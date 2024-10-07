//zustand store to store the audio file 
import { create } from "zustand";

type AudioFileStore = {
  audioFile: File | null;
  setAudioFile: (audioFile: File|null) => void;
};

export const useAudioFileStore = create<AudioFileStore>((set) => ({
  audioFile: null,
  setAudioFile: (audioFile) => set({ audioFile }),
}));

