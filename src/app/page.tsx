"use client";
import {
  AppShell,
  Button,
  Group,
  ScrollArea,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useDisclosure, useHover } from "@mantine/hooks";
import { BiMenuAltLeft } from "react-icons/bi";
import { MdContactSupport } from "react-icons/md";
import Image from "next/image";
import { features } from "./components/features";
import { GoX } from "react-icons/go";
import { useState } from "react";
import Home from "./components/Home";

export default function NavbarSection() {
  const [opened, { toggle }] = useDisclosure();
  const { hovered: hoveredExit, ref: refExit } = useHover();
  const { hovered: hoveredSupport, ref: refSupport } = useHover();
  const { hovered: hoveredMainMenu, ref: refMainMenu } = useHover();

  const [isEditingMode, setIsEditingMode] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSuccess = (file: File) => {
    setSelectedFile(file);
    setIsEditingMode(true);
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
          {isEditingMode && selectedFile && (
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
                size={40}
              />
            </div>
          )}
        </Group>
        {isEditingMode && selectedFile ? <></> : <Home />}
      </AppShell.Main>
    </AppShell>
  );
}
