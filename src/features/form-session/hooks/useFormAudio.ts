import { useRef, useState, useCallback } from "react";
import { FormField } from "@/types/FormField";
import { askQuestionFunction } from "../lib/utils/client/actions";
import { FormSessionDataType } from "@/types/FormSessionData";
import { prefetchNextAudio } from "../lib/utils/client/actions";

export function useFormAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [loadingAudio, setLoading] = useState(false);

  const playQuestionAudio = useCallback(
    async (field: FormField, session: FormSessionDataType) => {
      setLoading(true);
      try {
        const url = await askQuestionFunction(field, session.session_lang, session.id);// Fetches audio buffer from server and generates url on client

        if (url && audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = url;
          audioRef.current.load();
          await audioRef.current.play().catch((err) => {
            console.error("Audio playback failed:", err);
          });
        }
        if (session) {
        const currentIndex = session.fields.findIndex(f => f.id === field.id);
        prefetchNextAudio(currentIndex, session);
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
