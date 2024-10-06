"use client";
import { AppShell, Group, ScrollArea, Stack, Text } from "@mantine/core";
import { useDisclosure, useHover } from "@mantine/hooks";
import { MdContactSupport } from "react-icons/md";
import Image from "next/image";
import { BiMenuAltLeft } from "react-icons/bi";
import { GoX } from "react-icons/go";
import Home from "./components/Home";
import Editor from "./components/editor";
import { features } from "./components/features";


export default function Base() {
  const [opened, { toggle }] = useDisclosure();
  const { hovered: hoveredExit, ref: refExit } = useHover();
  const { hovered: hoveredSupport, ref: refSupport } = useHover();
  const { hovered: hoveredMainMenu, ref: refMainMenu } = useHover();
  
  // Retrieve uploaded file from sessionStorage
  const audioFile = typeof window !== 'undefined' && sessionStorage.getItem('audioFile');

  const handleClearFile = () => {
    sessionStorage.removeItem('audioFile');
    window.location.reload();  // To reset the UI
  };

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
        p="md"
        className="bg-secondary text-primary"
      >
        <AppShell.Section>
          <Group h="42px" justify="center"></Group>
        </AppShell.Section>

        <AppShell.Section
          component={ScrollArea}
          style={{ scrollMargin: "10px" }}
        >
          <Stack align="flex-start" justify="flex-start" gap="lg">
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
                    padding: 5,
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
            style={{ height: "100%" }}
            align="center"
            justify="start"
            gap="lg"
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                cursor: "pointer",
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

      <AppShell.Main className="bg-primary text-primary" style={{ display: "flex", flexDirection: "column" }}>
        <Group h="100%" pl="lg" pt="lg" justify="space-between">
          <div ref={refMainMenu}>
            <BiMenuAltLeft
              style={{
                color: hoveredMainMenu ? "gray" : "white",
                cursor: "pointer",
                position: "fixed",
                top: 20,
                left: 20,
                zIndex: 1001,
              }}
              onClick={toggle}
              size={40}
            />
          </div>
          {audioFile && (
            <div ref={refExit}>
              <GoX
                style={{
                  color: hoveredExit ? "gray" : "white",
                  cursor: "pointer",
                  position: "fixed",
                  top: 20,
                  right: 20,
                  zIndex: 1001,
                }}
                size={40}
                onClick={handleClearFile}
              />
            </div>
          )}
        </Group>

        {/* Conditionally render the Editor if a file is uploaded, otherwise render Home */}
        {audioFile ? <Editor /> : <Home />}
      </AppShell.Main>
    </AppShell>
  );
}
