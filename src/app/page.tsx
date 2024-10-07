"use client";
import {
  AppShell,
  Group,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure, useHover } from "@mantine/hooks";
import { BiMenuAltLeft } from "react-icons/bi";
import { MdContactSupport } from "react-icons/md";
import Image from "next/image";
import { features } from "./components/features";
import { GoX } from "react-icons/go";
import Home from "./components/Home";
import { useAudioFileStore } from "./store/AudioFile.state";
import Editor from "./components/Editor";


export default function Page() {
  const [opened, { toggle }] = useDisclosure();
  const { hovered: hoveredExit, ref: refExit } = useHover();
  const { hovered: hoveredSupport, ref: refSupport } = useHover();
  const { hovered: hoveredMainMenu, ref: refMainMenu } = useHover();

  // Fetch audioFile from the Zustand store
  const { audioFile,setAudioFile } = useAudioFileStore();

  return (
    <AppShell
      navbar={{
        width: { sm: 80 },
        breakpoint: "sm",
        collapsed: { mobile: !opened, desktop: !opened },
      }}
    >
      <AppShell.Navbar
        withBorder={false}
        p="sm"
        className="bg-secondary text-primary"
      >
        <AppShell.Section>
          <Group h="80px" justify="center"></Group>
        </AppShell.Section>

        <AppShell.Section
          component={ScrollArea}
          style={{ overflowX: "clip" }}
        >
          <Stack align="center" justify="flex-start" gap="lg" style={{ overflowX: "clip" }}>
            {features.map((feature, index) => {
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    cursor: "pointer",
                    gap: "5px",
                    padding: 2,
                  }}
                >
                  {/* Icon */}
                  <div style={{ fontSize: 20, color: "white" }}>
                    {feature.icon}
                  </div>
                  {/* Title */}
                  <Text size="xs">{feature.title}</Text>
                </div>
              );
            })}
          </Stack>
        </AppShell.Section>

        <AppShell.Section>
          <Stack
            style={{ height: "150px", overflow: "hidden" }}
            align="center"
            justify="center"
            gap="md"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
                overflow: "hidden",
              }}
              ref={refSupport}
            >
              <MdContactSupport
                size={30}
                style={{ color: hoveredSupport ? "gray" : "white" }}
              />
              <Text size="sm">Support</Text>
            </div>

            <Image alt="USA flag" src="/usa.png" width={30} height={30} />
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main
        style={{ display: "flex", flexDirection: "column" }}
        className="bg-primary text-primary"
      >
        <Group h="100%" pl="lg" pt="lg" justify="space-between">
          <div ref={refMainMenu}>
            <BiMenuAltLeft
              style={{
                color: hoveredMainMenu ? "gray" : "white",
                cursor: "pointer",
                position: "fixed",
                top: 20,
                left: 20,
                zIndex: "1001",
              }}
              onClick={toggle}
              size={40}
            />
          </div>

          {/* Conditionally render the GoX icon if an audio file exists */}
          {audioFile && (
            <div ref={refExit}>
              <GoX
                style={{
                  color: hoveredExit ? "gray" : "white",
                  cursor: "pointer",
                  position: "fixed",
                  top: 20,
                  right: 20,
                  zIndex: "1001",
                }}
                onClick={() => {
                  setAudioFile(null);
                }}
                size={40}
              />
            </div>
          )}
        </Group>
        {audioFile ? (
          <Editor/>
        ) : (
          <Home />
        )}
      </AppShell.Main>
    </AppShell>
  );
}
