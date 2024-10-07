"use client";
import { useState, useRef } from 'react';
import { Button } from '@mantine/core';
import { useAudioFileStore } from '../store/AudioFile.state';


export default function File() {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { setAudioFile } = useAudioFileStore();
  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      if (file.type.startsWith('audio/')) {
        // Store the file in Zustand store
        setAudioFile(file);

      } else {
        setError("Invalid file type. Please upload the correct audio file.");
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <Button
        style={{color:"white"}}
        onClick={() => fileInputRef.current?.click()}
        variant="outline"
        color="#665cc2"
        size="md"
        radius="xl"
      >
        Browse my files
      </Button>
      {error && (
        <div style={{
          width: "100%", 
          position: 'fixed', 
          bottom: 0,
          left: 0,
          padding: "20px",
          textAlign: "center",
          backgroundColor: '#17171e',
          zIndex:"999"
        }}>
          <span style={{ color: 'red' }}>{error}</span>
        </div>
      )}
    </div>
  );
}
