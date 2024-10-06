"use client";
import { useState } from 'react';
import { FileButton, Button, Group, Text } from '@mantine/core';

export default function File() {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);

    // Validate file types
    const isValid = selectedFile.type === "audio/mp3" || selectedFile.type === "audio/wav";

    if (!isValid) {
      setError("Invalid file type. Please upload the correct audio file.");
    } else {
      setError(null); // Clear the error if file is valid
    }
  };

  return (
    <div style={{position: "relative" }}>
      <Group justify="center" style={{ padding: "20px 0" }}>
        <FileButton
          onChange={handleFileChange}
          accept="audio/mp3,audio/wav"
        >
          {(props) => (
            <Button
              {...props}
              variant="outline"
              className="text-primary"
              color="violet"
              size="md"
              text-center
              radius="xl"
            >
              Browse my files
            </Button>
          )}
        </FileButton>
      </Group>

      {/* Show error if invalid file type is selected */}
      {error && (
        <div style={{
          width: "100%", 
          position: 'fixed', 
          bottom: 0,
          right:"50%",
          left: 0,
          padding: "20px",
          textAlign: "center"
        }} className='bg-primary'>
          <Text c="red">{error}</Text>
        </div>
      )}
    </div>
  );
}
