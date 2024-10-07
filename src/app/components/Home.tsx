"use client"
import { AppShell, Button,Group, Stack, Text, Title } from '@mantine/core'
import {useRef} from 'react'
import File from './File'
import HowTo from './HowTo'

function Home() {
    const sectionRef = useRef<HTMLDivElement>(null);

  const scrollToSection = () => {
    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };
  return (
    <div><AppShell.Section
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
    <Stack
    h={300}
    align="center"
    justify="space-evenly"
    gap="md">
    <Group justify="center" mb={10}>
      <Button
        onClick={scrollToSection}
        variant="transparent"
        color="white"
        size="compact-sm"
        style={{ fontWeight:500 }}
      >
        HOW IT WORKS
      </Button>
      <Button variant="transparent" color="White" size="compact-sm">
        JOINER
      </Button>
    </Group>
    <Title style={{ color: "white", fontSize: 50 , fontWeight:500 }}>Audio Cutter</Title>
    <Text size="xl" mb={'sm'} c="#c9d1e1" style={{textAlign:"center" , fontSize:25}}>
      Free editor to trim and cut any audio file online
    </Text>
    <File />
    </Stack>
  </AppShell.Section>
  <HowTo ref={sectionRef} /></div>
  )
}

export default Home