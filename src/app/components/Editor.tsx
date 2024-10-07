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
import { useAudioFileStore } from "../store/AudioFile.state";

const Editor = () => {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null); // Store the WaveSurfer instance here
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // Fetch the audioFile from Zustand store
  const { audioFile } = useAudioFileStore();

  useEffect(() => {
    const loadWaveSurfer = async () => {
      if (!audioFile) return;

      const WaveSurfer = (await import("wavesurfer.js")).default;
      const RegionsPlugin = (await import("wavesurfer.js/dist/plugins/regions"))
        .default;

      // Ensure the previous WaveSurfer instance is destroyed
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }

      // Ensure the waveformRef is present
      if (waveformRef.current) {
        const fileUrl = URL.createObjectURL(audioFile); // Generate the object URL from the File object

        try {
          wavesurfer.current = WaveSurfer.create({
            container: waveformRef.current,
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

          wavesurfer.current.load(fileUrl);
        } catch (error) {
          console.error("Error loading the audio file:", error);
        }
      }
    };

    loadWaveSurfer();

    // Cleanup on unmount or audio file change
    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
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
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
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
            {isPlaying ? (
              <IconPlayerPause size={16} />
            ) : (
              <IconPlayerPlay size={16} />
            )}
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray">
            <IconCut size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" color="gray">
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

export default Editor;
