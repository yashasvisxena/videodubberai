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
import { features } from "./features";
import File from "./File";
import HowTo from "./HowTo";
import { useRef } from "react";

export default function NavbarSection() {
  const [opened, { toggle }] = useDisclosure();
  const { hovered: hoveredMenu, ref: refMenu } = useHover();
  const { hovered: hoveredSupport, ref: refSupport } = useHover();
  const { hovered: hoveredMainMenu, ref: refMainMenu } = useHover();

  const sectionRef = useRef<HTMLDivElement>(null);

  const scrollToSection = () => {
    sectionRef.current?.scrollIntoView({
      behavior: "smooth", 
    });
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
          <Group h="100%" justify="center" ref={refMenu}>
            <BiMenuAltLeft
              style={{
                visibility: opened ? "visible" : "hidden",
                color: hoveredMenu ? "gray" : "white",
                cursor: "pointer",
              }}
              onClick={toggle}
              size={40}
            />
          </Group>
        </AppShell.Section>

        <AppShell.Section grow my="sm" component={ScrollArea}>
          <Stack h="100%" align="center" justify="center" gap="lg">
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
          <Stack h={100} align="center" justify="center" gap="lg">
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
        <Group h="100%" pl="lg" pt="lg" ref={refMainMenu}>
          <BiMenuAltLeft
            style={{
              visibility: !opened ? "visible" : "hidden",
              color: hoveredMainMenu ? "gray" : "white",
              cursor: "pointer",
              position: "fixed",
              top: 20,
              left: 20,
            }}
            onClick={toggle}
            size={40}
          />
        </Group>

        <AppShell.Section
          style={{
            borderBottom: "1px solid #2C2E33",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            height: "98vh",
            widht: "100%",
          }}
        >
          <Group justify="center" style={{ marginBottom: 5 }}>
            <Button onClick={scrollToSection} variant="transparent" color="white" size="compact-sm">
              HOW IT WORKS
            </Button>
            <Button variant="transparent" color="White" size="compact-sm">
              JOINER
            </Button>
          </Group>
          <Title style={{ color: "white", fontSize: 40 }}>Audio Cutter</Title>
          <Text size="xl">
            Free editor to trim and cut any audio file online
          </Text>
          <File />
        </AppShell.Section>
        {/* Reference to the HowTo section */}
        <HowTo ref={sectionRef} />
      </AppShell.Main>
    </AppShell>
  );
}
