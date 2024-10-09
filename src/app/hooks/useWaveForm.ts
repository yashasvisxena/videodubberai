import React, { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin, { Region } from "wavesurfer.js/dist/plugins/regions.js";

interface UseWaveformProps {
  audioFile: File | null;
  waveformRef: React.RefObject<HTMLDivElement>;
}

export const useWaveform = ({ audioFile, waveformRef }: UseWaveformProps) => {
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const regionRef = useRef<Region | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [regionsPlugin, setRegionsPlugin] = useState<RegionsPlugin>();
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const initializeWaveSurfer = async (audioBlob: Blob) => {
    if (wavesurfer.current) {
      wavesurfer.current.destroy();
    }

    if (waveformRef.current) {
      const regions = RegionsPlugin.create();
      const newWaveSurfer = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#00fe8f",
        progressColor: "#00fe8f",
        cursorColor: "#e3e3e4",
        cursorWidth: 1,
        height: 150,
        plugins: [regions],
      });

      setRegionsPlugin(regions);
      wavesurfer.current = newWaveSurfer;

      newWaveSurfer.on("ready", () => {
        const audioDuration = newWaveSurfer.getDuration();
        setDuration(audioDuration);

        const region = regions.addRegion({
          start: 0,
          end: audioDuration,
          color: "rgba(0, 254, 143, 0.3)",
          drag: false,
          resize: true,
        });

        regionRef.current = region;

        region.on("update-end", () => {
          if (newWaveSurfer && regionRef.current) {
            newWaveSurfer.setTime(regionRef.current.start);
            if (isPlaying) newWaveSurfer.play();
            // setIsPlaying(true);
          }
        });
      });

      newWaveSurfer.on("timeupdate", (currentTime) => {
        setCurrentTime(currentTime);
      });

      newWaveSurfer.on("play", () => setIsPlaying(true));
      newWaveSurfer.on("pause", () => setIsPlaying(false));
      newWaveSurfer.on("finish", () => setIsPlaying(false));

      await newWaveSurfer.load(URL.createObjectURL(audioBlob));
    }
  };

  useEffect(() => {
    if (!audioFile) return;

    const loadWaveSurfer = async () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      try {
        await initializeWaveSurfer(audioFile);
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === "AbortError") {
            console.log("Loading was aborted");
          } else {
            console.error("Error loading audio:", error);
          }
        }
      }
    };

    loadWaveSurfer();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, [audioFile]);

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      if (regionRef.current && !isPlaying) {
        wavesurfer.current.setTime(regionRef.current.start);
      }
      wavesurfer.current.playPause();
    }
  };

  const handleCut = async () => {
    if (!wavesurfer.current || !regionRef.current || !audioFile) return;

    setIsProcessing(true);

    try {
      const arrayBuffer = await new AudioContext().decodeAudioData(
        await audioFile.arrayBuffer()
      );
      const region = regionRef.current;

      const startSample = Math.floor(region.start * arrayBuffer.sampleRate);
      const endSample = Math.floor(region.end * arrayBuffer.sampleRate);
      const newLength = endSample - startSample;

      const offlineAudioContext = new OfflineAudioContext(
        arrayBuffer.numberOfChannels,
        newLength,
        arrayBuffer.sampleRate
      );

      const newBuffer = offlineAudioContext.createBuffer(
        arrayBuffer.numberOfChannels,
        newLength,
        arrayBuffer.sampleRate
      );

      for (let channel = 0; channel < arrayBuffer.numberOfChannels; channel++) {
        const newChannelData = newBuffer.getChannelData(channel);
        const originalChannelData = arrayBuffer.getChannelData(channel);
        for (let i = 0; i < newLength; i++) {
          newChannelData[i] = originalChannelData[i + startSample];
        }
      }

      const source = offlineAudioContext.createBufferSource();
      source.buffer = newBuffer;
      source.connect(offlineAudioContext.destination);
      source.start();

      const renderedBuffer = await offlineAudioContext.startRendering();

      const wavBlob = await new Promise<Blob>((resolve) => {
        const audioContext = new AudioContext();
        const mediaStreamDest = audioContext.createMediaStreamDestination();
        const mediaRecorder = new MediaRecorder(mediaStreamDest.stream);
        const chunks: BlobPart[] = [];

        const source = audioContext.createBufferSource();
        source.buffer = renderedBuffer;
        source.connect(mediaStreamDest);

        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () =>
          resolve(new Blob(chunks, { type: "audio/wav" }));

        mediaRecorder.start();
        source.start();
        source.onended = () => mediaRecorder.stop();
      });

      // Create a new File object from the Blob
      const newAudioFile = new File(
        [wavBlob],
        `${audioFile.name.split(".")[0]}_cut.wav`,
        {
          type: "audio/wav",
        }
      );

      // Initialize a new waveform with the cut audio
      await initializeWaveSurfer(newAudioFile);
    } catch (error) {
      console.error("Error during cut operation:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadRegion = async () => {
    if (!wavesurfer.current || !regionRef.current || !audioFile) return;

    setIsProcessing(true);

    try {
      const arrayBuffer = await new AudioContext().decodeAudioData(
        await audioFile.arrayBuffer()
      );
      const region = regionRef.current;

      const startSample = Math.floor(region.start * arrayBuffer.sampleRate);
      const endSample = Math.floor(region.end * arrayBuffer.sampleRate);
      const newLength = endSample - startSample;

      const offlineAudioContext = new OfflineAudioContext(
        arrayBuffer.numberOfChannels,
        newLength,
        arrayBuffer.sampleRate
      );

      const newBuffer = offlineAudioContext.createBuffer(
        arrayBuffer.numberOfChannels,
        newLength,
        arrayBuffer.sampleRate
      );

      for (let channel = 0; channel < arrayBuffer.numberOfChannels; channel++) {
        const newChannelData = newBuffer.getChannelData(channel);
        const originalChannelData = arrayBuffer.getChannelData(channel);
        for (let i = 0; i < newLength; i++) {
          newChannelData[i] = originalChannelData[i + startSample];
        }
      }

      const source = offlineAudioContext.createBufferSource();
      source.buffer = newBuffer;
      source.connect(offlineAudioContext.destination);
      source.start();

      const renderedBuffer = await offlineAudioContext.startRendering();

      const wavBlob = await new Promise<Blob>((resolve) => {
        const audioContext = new AudioContext();
        const mediaStreamDest = audioContext.createMediaStreamDestination();
        const mediaRecorder = new MediaRecorder(mediaStreamDest.stream);
        const chunks: BlobPart[] = [];

        const source = audioContext.createBufferSource();
        source.buffer = renderedBuffer;
        source.connect(mediaStreamDest);

        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () =>
          resolve(new Blob(chunks, { type: "audio/wav" }));

        mediaRecorder.start();
        source.start();
        source.onended = () => mediaRecorder.stop();
      });

      const url = URL.createObjectURL(wavBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${audioFile.name.split(".")[0]}_trimmed.wav`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading region:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isPlaying,
    duration,
    currentTime,
    isProcessing,
    handlePlayPause,
    handleDownloadRegion,
    handleCut,
  };
};
