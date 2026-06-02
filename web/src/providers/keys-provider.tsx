"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";
import { store } from "@/lib/store";

interface KeysState {
  geminiKey: string;
  uploadPostKey: string;
  uploadUserId: string;
  elevenLabsKey: string;
  falKey: string;
  groqKey: string;
  replizAccessKey: string;
  replizSecretKey: string;
  transcriptionMethod: string;
}

interface KeysContextValue extends KeysState {
  setGeminiKey: (v: string) => void;
  setUploadPostKey: (v: string) => void;
  setUploadUserId: (v: string) => void;
  setElevenLabsKey: (v: string) => void;
  setFalKey: (v: string) => void;
  setGroqKey: (v: string) => void;
  setReplizAccessKey: (v: string) => void;
  setReplizSecretKey: (v: string) => void;
  setTranscriptionMethod: (v: string) => void;
}

const KeysContext = createContext<KeysContextValue | null>(null);

function getInitialState(): KeysState {
  if (typeof window === "undefined") {
    return {
      geminiKey: "",
      uploadPostKey: "",
      uploadUserId: "",
      elevenLabsKey: "",
      falKey: "",
      groqKey: "",
      replizAccessKey: "",
      replizSecretKey: "",
      transcriptionMethod: "faster-whisper",
    };
  }
  return {
    geminiKey: store.getGeminiKey(),
    uploadPostKey: store.getUploadPostKey(),
    uploadUserId: store.getUploadUserId(),
    elevenLabsKey: store.getElevenLabsKey(),
    falKey: store.getFalKey(),
    groqKey: store.getGroqKey(),
    replizAccessKey: store.getReplizAccessKey(),
    replizSecretKey: store.getReplizSecretKey(),
    transcriptionMethod: store.getTranscriptionMethod(),
  };
}

export function KeysProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<KeysState>(getInitialState);

  const value = useMemo<KeysContextValue>(() => {
    const setter =
      <K extends keyof KeysState>(key: K, persist: (v: string) => void) =>
      (v: string) => {
        setState((s) => ({ ...s, [key]: v }));
        persist(v);
      };

    return {
      ...state,
      setGeminiKey: setter("geminiKey", store.setGeminiKey),
      setUploadPostKey: setter("uploadPostKey", store.setUploadPostKey),
      setUploadUserId: setter("uploadUserId", store.setUploadUserId),
      setElevenLabsKey: setter("elevenLabsKey", store.setElevenLabsKey),
      setFalKey: setter("falKey", store.setFalKey),
      setGroqKey: setter("groqKey", store.setGroqKey),
      setReplizAccessKey: setter("replizAccessKey", store.setReplizAccessKey),
      setReplizSecretKey: setter("replizSecretKey", store.setReplizSecretKey),
      setTranscriptionMethod: setter("transcriptionMethod", store.setTranscriptionMethod),
    };
  }, [state]);

  return (
    <KeysContext.Provider value={value}>{children}</KeysContext.Provider>
  );
}

export function useKeys() {
  const ctx = useContext(KeysContext);
  if (!ctx) throw new Error("useKeys must be used within KeysProvider");
  return ctx;
}
