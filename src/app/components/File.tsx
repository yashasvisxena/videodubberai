"use client";
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@mantine/core';

export default function File() {
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    if (file) {
      if (file.type.startsWith('audio/')) {
        // Create an object URL for the file
        const fileUrl = URL.createObjectURL(file);
        
        // Store file info in sessionStorage
        sessionStorage.setItem('audioFile', JSON.stringify({
          name: file.name,
          url: fileUrl,
          type: file.type
        }));
        
        // Trigger re-render and redirect to editor page
        router.refresh();  // Refresh the current page to render Editor
      } else {
        setError("Please select a valid audio file (MP3, WAV, etc.)");
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
        onClick={() => fileInputRef.current?.click()}
        variant="outline"
        color="violet"
        size="lg"
        radius="xl"
      >
        Browse my files
      </Button>
      {error && (
        <div style={{
          width: "100%", 
          position: 'fixed', 
          bottom: 0,
          padding: "20px",
          textAlign: "center",
          backgroundColor: '#1A1B1E'
        }}>
          <span style={{ color: 'red' }}>{error}</span>
        </div>
      )}
    </div>
  );
}
