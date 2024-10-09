import React, { useRef } from "react";
import { Button, Stack, Text, Group } from "@mantine/core";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconDownload,
  IconScissors,
} from "@tabler/icons-react";
import "./style.css";
import { useAudioFileStore } from "../store/AudioFile.state";
import { useWaveform } from "../hooks/useWaveForm";

const Editor = () => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const { audioFile } = useAudioFileStore();
  const fileName = audioFile ? audioFile.name : "";

  const {
    isPlaying,
    duration,
    currentTime,
    isProcessing,
    handlePlayPause,
    handleDownloadRegion,
    handleCut,
  } = useWaveform({ audioFile, waveformRef });

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
          onClick={handleCut}
          leftSection={<IconScissors size={16} />}
          disabled={isProcessing}
        >
          Cut
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
