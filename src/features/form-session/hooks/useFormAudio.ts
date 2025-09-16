import { useRef, useState, useCallback } from "react";
import { FormField } from "@/types/FormField";
import { TextTranslateParams } from "spitch/resources";
import { askQuestionFunction } from "../lib/utils/_askQuestion";

export function useFormAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loadingAudio, setLoading] = useState(false);

  // Play AI-generated question audio for a field
  const playQuestionAudio = useCallback(
    async (field: FormField, lang: TextTranslateParams["source"]) => {
      setLoading(true);
      try {
        const url = await askQuestionFunction(field, lang);// Fetches audio buffer from server and generates url on client
        console.log(url)
        if (url && audioRef.current) {
          // Stop any current audio
          audioRef.current.pause();
          audioRef.current.src = url;
          audioRef.current.load();
          await audioRef.current.play().catch((err) => {
            console.error("Audio playback failed:", err);
          });
        }
      } finally {
        setLoading(false);
      }
    },
    []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
  }, []);

  return {
    audioRef,
    loadingAudio,
    setLoading,
    playQuestionAudio,
    stopAudio,
  };
}
