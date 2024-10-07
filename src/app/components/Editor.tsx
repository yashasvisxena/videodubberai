import React, { useEffect, useRef, useState } from "react";
import { Button, Stack, Text, Group } from "@mantine/core";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconDownload,
  IconScissors,
} from "@tabler/icons-react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import "./style.css";
import { useAudioFileStore } from "../store/AudioFile.state";


// Define types for WaveSurfer and Region
interface Region {
  start: number;
  end: number;
  id: string;
  color: string;
  drag: boolean;
  resize: boolean;
  on: (event: string, callback: () => void) => void;
}

// Extend WaveSurfer type to include missing methods
interface ExtendedWaveSurfer extends WaveSurfer {
  getDecodedData: () => AudioBuffer | null;
  loadDecodedBuffer: (buffer: AudioBuffer) => void;
}

const Editor = () => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<ExtendedWaveSurfer | null>(null);
  const regionRef = useRef<Region | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const { audioFile } = useAudioFileStore();
  const fileName = audioFile ? audioFile.name : "";

  useEffect(() => {
    if (!audioFile) return;

    const loadWaveSurfer = async () => {
      // Cleanup previous instance
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      if (waveformRef.current) {
        try {
          const fileUrl = URL.createObjectURL(audioFile);

          const regionsPlugin = RegionsPlugin.create();
          wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: "#00fe8f",
            progressColor: "#00fe8f",
            cursorColor: "#e3e3e4",
            barWidth: 0,
            barRadius: 0,
            cursorWidth: 1,
            height: 150,
            barGap: 0,
            plugins: [regionsPlugin],
          }) as ExtendedWaveSurfer;

          wavesurfer.current.on("ready", () => {
            if (!wavesurfer.current) return;

            const audioDuration = wavesurfer.current.getDuration();
            setDuration(audioDuration);

            const region = regionsPlugin.addRegion({
              start: 0,
              end: audioDuration,
              color: "rgba(0, 255, 0, 0.2)",
              drag: false,
              resize: true,
            }) as Region;

            regionRef.current = region;

            region.on("update-end", () => {
              if (wavesurfer.current && regionRef.current) {
                wavesurfer.current.setTime(regionRef.current.start);
                wavesurfer.current.play();
                setIsPlaying(true);
              }
            });

            wavesurfer.current.on("audioprocess", () => {
              if (!wavesurfer.current) return;
              const currentTime = wavesurfer.current.getCurrentTime();
              setCurrentTime(currentTime);

              if (
                regionRef.current &&
                (currentTime < regionRef.current.start ||
                  currentTime >= regionRef.current.end)
              ) {
                wavesurfer.current.setTime(regionRef.current.start);
                if (currentTime >= regionRef.current.end) {
                  wavesurfer.current.pause();
                  setIsPlaying(false);
                }
              }
            });
          });

          wavesurfer.current.on("finish", () => {
            setIsPlaying(false);
          });

          // Load audio file without passing AbortSignal
          await wavesurfer.current.load(fileUrl);
        } catch (error) {
          if (error instanceof Error && error.name === "AbortError") {
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
    if (wavesurfer.current && regionRef.current) {
      if (!isPlaying) {
        wavesurfer.current.setTime(regionRef.current.start);
      }
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const handleIsolateRegion = async () => {
    if (!wavesurfer.current || !regionRef.current || !audioFile) return;

    setIsProcessing(true);

    try {
      const audioContext = new AudioContext();
      const audioBuffer = await wavesurfer.current.getDecodedData();

      if (!audioBuffer) {
        throw new Error("Failed to get decoded audio data");
      }

      const startOffset = Math.floor(
        regionRef.current.start * audioBuffer.sampleRate
      );
      const endOffset = Math.floor(
        regionRef.current.end * audioBuffer.sampleRate
      );

      const newBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        endOffset - startOffset,
        audioBuffer.sampleRate
      );

      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const newChannelData = newBuffer.getChannelData(channel);
        const originalChannelData = audioBuffer.getChannelData(channel);
        for (let i = 0; i < newBuffer.length; i++) {
          newChannelData[i] = originalChannelData[i + startOffset];
        }
      }

      wavesurfer.current.loadDecodedBuffer(newBuffer);

      if (regionRef.current) {
        regionRef.current.start = 0;
        regionRef.current.end = newBuffer.duration;
      }

      setDuration(newBuffer.duration);
    } catch (error) {
      console.error("Error isolating region:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadRegion = async () => {
    if (!wavesurfer.current || !regionRef.current || !audioFile) return;

    setIsProcessing(true);

    try {
      const audioContext = new AudioContext();
      const audioBuffer = await wavesurfer.current.getDecodedData();

      if (!audioBuffer) {
        throw new Error("Failed to get decoded audio data");
        return;
      }

      const startOffset = Math.floor(
        regionRef.current.start * audioBuffer.sampleRate
      );
      const endOffset = Math.floor(
        regionRef.current.end * audioBuffer.sampleRate
      );

      const newBuffer = audioContext.createBuffer(
        audioBuffer.numberOfChannels,
        endOffset - startOffset,
        audioBuffer.sampleRate
      );

      for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
        const newChannelData = newBuffer.getChannelData(channel);
        const originalChannelData = audioBuffer.getChannelData(channel);
        for (let i = 0; i < newBuffer.length; i++) {
          newChannelData[i] = originalChannelData[i + startOffset];
        }
      }

      // Convert buffer to wav file
      const offlineAudioContext = new OfflineAudioContext(
        newBuffer.numberOfChannels,
        newBuffer.length,
        newBuffer.sampleRate
      );

      const source = offlineAudioContext.createBufferSource();
      source.buffer = newBuffer;
      source.connect(offlineAudioContext.destination);
      source.start();

      const renderedBuffer = await offlineAudioContext.startRendering();

      const wavBlob = await new Promise<Blob>((resolve) => {
        const audioContext = new AudioContext();
        const mediaStreamDestination =
          audioContext.createMediaStreamDestination();
        const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);
        const chunks: BlobPart[] = [];

        const source = audioContext.createBufferSource();
        source.buffer = renderedBuffer;
        source.connect(mediaStreamDestination);

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
      a.download = `${fileName.split(".")[0]}_trimmed.wav`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading region:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Stack
      align="stretch"
      justify="center"
      gap="lg"
      p="xl"
      style={{ height: "100vh" }}
    >
      <Group justify="flex-end" mr={"sm"}>
        <Text size="sm" c="dimmed">
          {fileName}
        </Text>
      </Group>
      <div
        id="waveform"
        ref={waveformRef}
        style={{ width: "100%", background: "#1f1e29" }}
      />
      <Group>
        <Text size="sm" color="dimmed">
          {formatTime(currentTime)}
        </Text>
        <Text size="sm" color="dimmed">
          {formatTime(duration)}
        </Text>
      </Group>
      <Group align="center">
        <Button
          onClick={handlePlayPause}
          leftSection={
            isPlaying ? (
              <IconPlayerPause size={16} />
            ) : (
              <IconPlayerPlay size={16} />
            )
          }
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button
          onClick={handleIsolateRegion}
          leftSection={<IconScissors size={16} />}
          disabled={isProcessing}
        >
          Isolate Region
        </Button>
        <Button
          onClick={handleDownloadRegion}
          leftSection={<IconDownload size={16} />}
          disabled={isProcessing}
        >
          Download Region
        </Button>
      </Group>
    </Stack>
  );
};

export default Editor;