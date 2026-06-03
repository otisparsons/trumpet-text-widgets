"use client";

import { useEffect, useRef, useState } from "react";

type SaveStatus = "idle" | "saving" | "saved";

interface UseDebouncedSaveOptions {
  initialValue: string;
  onSave: (value: string) => Promise<void>;
  delayMs?: number;
}

function hash(input: string): number {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = (h * 33) ^ input.charCodeAt(i);
  }

  return h >>> 0;
}

export function useDebouncedSave({
  initialValue,
  onSave,
  delayMs = 500,
}: UseDebouncedSaveOptions) {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lastSavedRef = useRef(initialValue);
  const lastSavedHashRef = useRef(hash(initialValue));

  function change(nextValue: string) {
    setValue(nextValue);

    if (timerRef.current) clearTimeout(timerRef.current);

    //Skip saving if the content is unchanged from what was last saved
    const unchanged =
      hash(nextValue) === lastSavedHashRef.current &&
      nextValue === lastSavedRef.current;

    if (unchanged) {
      setStatus("saved");
      return;
    }

    setStatus("saving");
    timerRef.current = setTimeout(async () => {
      await onSave(nextValue);
      lastSavedRef.current = nextValue;
      lastSavedHashRef.current = hash(nextValue);
      setStatus("saved");
    }, delayMs);
  }

  // Let caller cancel a pending save
  function cancelPending() {
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  //Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { value, status, change, cancelPending };
}
