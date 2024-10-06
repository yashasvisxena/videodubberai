/* eslint-disable react/display-name */
"use client";
import { forwardRef } from "react";
import { Blockquote, Container, Title, Text } from "@mantine/core";
import { CiLock } from "react-icons/ci";

const HowTo = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} className="main">
      <Container fluid>
        <Title order={1} className="How">
          How to cut audio
        </Title>
        <Blockquote
          color="rgb(103,93,194)"
          iconSize={30}
          mt="xl"
          className="block"
        >
          <Text className="text">
            This app can be used to trim and/or cut audio tracks, remove audio
            fragments, and fade in and fade out your music easily to make the
            audio harmoniously.
          </Text>
          <Text className="text">
            It is fast and easy to use. You can save the audio file in any
            format (codec parameters are configurable).
          </Text>
          <Text className="text">
            It works directly in the browser, no needs to install any software,
            is available for mobile devices.
          </Text>
        </Blockquote>

        <Title order={1} className="How" mt="lg">
          <CiLock />
          Privacy and Security Guaranteed
        </Title>
        <Blockquote
          color="rgb(103,93,194)"
          iconSize={30}
          mt="xl"
          className="block"
        >
          <Text className="text">
            This is a serverless app. Your files do not leave your device,
            ensuring complete privacy and security.
          </Text>
        </Blockquote>
      </Container>
    </div>
  );
});

export default HowTo;
