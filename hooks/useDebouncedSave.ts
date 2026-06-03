"use client";

import { useEffect, useRef, useState } from "react";

type SaveStatus = "idle" | "saving" | "saved";

interface UseDebouncedSaveOptions {
  initialValue: string;
  onSave: (value: string) => Promise<void>;
  delayMs?: number;
}

export function useDebouncedSave({
  initialValue,
  onSave,
  delayMs = 500,
}: UseDebouncedSaveOptions) {
  const [value, setValue] = useState(initialValue);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function change(nextValue: string) {
    setValue(nextValue);
    setStatus("saving");

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      await onSave(nextValue);
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
