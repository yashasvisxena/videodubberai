"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button, Stack, Text, Group, ActionIcon } from "@mantine/core";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconCut,
  IconTrash,
  IconArrowsShuffle,
  IconWaveSine,
  IconMicrophone,
  IconKeyframes,
} from "@tabler/icons-react";
import WaveSurfer from "wavesurfer.js";

const AudioEditor = () => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioFile, setAudioFile] = useState(null);

  useEffect(() => {
    const loadWaveSurfer = async () => {
      const WaveSurfer = (await import("wavesurfer.js")).default;
      const RegionsPlugin = (await import("wavesurfer.js/dist/plugins/regions")).default;

      const storedFile = sessionStorage.getItem("audioFile");
      if (storedFile) {
        const { url } = JSON.parse(storedFile);
        setAudioFile(url);
      }

      // Make sure waveformRef.current is not null before creating WaveSurfer instance
      if (waveformRef.current) {
        wavesurfer.current = WaveSurfer.create({
          container: waveformRef.current,  // Use the ref safely here
          waveColor: "#4FE3C1",
          progressColor: "#2C7A7B",
          cursorColor: "#506AD4",
          barWidth: 2,
          barRadius: 3,
          cursorWidth: 1,
          height: 128,
          barGap: 3,
          plugins: [RegionsPlugin.create()],
        });

        wavesurfer.current.on("ready", () => {
          setDuration(wavesurfer.current!.getDuration());
        });

        wavesurfer.current.on("audioprocess", () => {
          setCurrentTime(wavesurfer.current!.getCurrentTime());
        });

        wavesurfer.current.on("finish", () => {
          setIsPlaying(false);
        });

        if (audioFile) {
          wavesurfer.current.load(audioFile);
        }
      }
    };

    loadWaveSurfer();

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
      }
    };
  }, [audioFile]);

  useEffect(() => {
    if (audioFile && wavesurfer.current) {
      wavesurfer.current.load(audioFile);
    }
  }, [audioFile]);

  const handlePlayPause = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const back = () => {
    window.history.back();
  };

  

  

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <Stack>
      <div ref={waveformRef} style={{ width: "100%", background: "#2C2E33" }} />
      <Group>
        <Text size="sm" color="dimmed">
          {formatTime(currentTime)}
        </Text>
        <Text size="sm" color="dimmed">
          {formatTime(duration)}
        </Text>
      </Group>
      <Group>
        <Group>
          <ActionIcon variant="subtle" color="gray" onClick={handlePlayPause}>
            {isPlaying ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray" >
            <IconCut size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray" >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>
        <Group>
          <ActionIcon variant="subtle" color="gray">
            <IconArrowsShuffle size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray">
            <IconWaveSine size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray">
            <IconMicrophone size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray">
            <IconKeyframes size={16} />
          </ActionIcon>
        </Group>
      </Group>
      <Group>
        <Button variant="light" onClick={back}>
          Cancel
        </Button>
        <Button>Save</Button>
      </Group>
    </Stack>
  );
};

export default AudioEditor;
