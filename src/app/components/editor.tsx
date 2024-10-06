"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  ActionIcon,
  Group,
  Text,
  Container,
  Box,
  Center,
  Stack,
  AppShell,
} from "@mantine/core";
import { X, Play, Pause, SkipBack, Scissors, Trash2 } from "lucide-react";
import WaveSurfer from "wavesurfer.js";
import { useWindowScroll } from "@mantine/hooks";

export default function Editor() {
  const router = useRouter();
  const [audioInfo, setAudioInfo] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<string>("00:00.0");
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Retrieve audio info from sessionStorage
    const storedAudioInfo = sessionStorage.getItem("audioFile");
    if (!storedAudioInfo) {
      window.location.reload();
      return;
    }

    const parsedAudioInfo = JSON.parse(storedAudioInfo);
    setAudioInfo(parsedAudioInfo);

    // Initialize WaveSurfer
    if (containerRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: containerRef.current,
        waveColor: "#40C057",
        progressColor: "#2B8A3E",
        cursorColor: "#40C057",
        barWidth: 2,
        barRadius: 3,
        cursorWidth: 1,
        height: 160,
        barGap: 3,
      });

      wavesurferRef.current.load(parsedAudioInfo.url);

      wavesurferRef.current.on("ready", () => {
        const audioDuration = wavesurferRef.current?.getDuration() || 0;
        setDuration(formatTime(audioDuration));
      });
    }

    return () => {
      wavesurferRef.current?.destroy();
      URL.revokeObjectURL(parsedAudioInfo.url);
    };
  }, [router]);

  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    const milliseconds = Math.floor((timeInSeconds % 1) * 10);
    return `${minutes}:${seconds.toString().padStart(2, "0")}.${milliseconds}`;
  };

  const handlePlayPause = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const handleBack = () => {
    if (wavesurferRef.current) {
      wavesurferRef.current.stop();
    }
    sessionStorage.removeItem("audioFile");
    router.push("/");
  };

  if (!audioInfo) {
    return null;
  }

  return (
    <AppShell.Section>
      <Container size="lg" p="md">
        <Box mb="lg">
          <Group>
            <Text size="sm" c="dimmed">
              {audioInfo.name}
            </Text>
          </Group>
        </Box>

        <Box
          mb="lg"
          ref={containerRef}
          style={{ width: "100%", height: 160, backgroundColor: "#f5f5f5" }}
        />

        <Stack>
          <Group>
            <ActionIcon
              variant="filled"
              color="gray"
              size="lg"
              onClick={handlePlayPause}
            >
              {isPlaying ? <Pause /> : <Play />}
            </ActionIcon>
            <ActionIcon variant="light" color="gray">
              <SkipBack />
            </ActionIcon>
          </Group>

          <Group>
            <Text size="sm">Start: 00:00.0</Text>
            <Text size="sm">End: {duration}</Text>
          </Group>

          <Group>
            <ActionIcon variant="light" color="gray">
              <Scissors />
            </ActionIcon>
            <ActionIcon variant="light" color="gray">
              <Trash2 />
            </ActionIcon>
            <Button variant="outline" color="green" radius="xl">
              Save
            </Button>
          </Group>
        </Stack>
      </Container>
    </AppShell.Section>
  );
}
