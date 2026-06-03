import { act, renderHook } from "@testing-library/react";
import { beforeEach } from "vitest";
import { useDebouncedSave } from "./useDebouncedSave";

describe("useDebouncedSave", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("does not save immediately on change", () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useDebouncedSave({ initialValue: "", onSave }),
    );

    act(() => {
      result.current.change("hello");
    });

    // Before the delay elapses, nothing has been saved yet.
    expect(onSave).not.toHaveBeenCalled();
  });

  it("saves once after the debounce delay", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useDebouncedSave({ initialValue: "", onSave }),
    );

    act(() => {
      result.current.change("hello");
    });

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("hello");
  });

  it("debounces rapid changes into a single save", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useDebouncedSave({ initialValue: "", onSave }),
    );

    act(() => {
      result.current.change("h");
      result.current.change("he");
      result.current.change("hel");
      result.current.change("hell");
      result.current.change("hello");
    });

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    //Only the final value is saved, once.
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("hello");
  });

  it("does not save when the value returns to the last-saved value", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useDebouncedSave({ initialValue: "hello", onSave }),
    );

    //User types something then reverts to the original before the debounce fires
    act(() => {
      result.current.change("hello!");
      result.current.change("hello");
    });

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    //Nothing should be saved
    expect(onSave).not.toHaveBeenCalled();
  });

  it("keeps the typed value (doesn't clobber it on the skip path)", () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useDebouncedSave({ initialValue: "hello", onSave }),
    );

    //Value should show was was typed, not status string
    expect(result.current.value).toBe("hello");
  });

  it("exposes the typed value as it changes", () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useDebouncedSave({ initialValue: "", onSave }),
    );

    act(() => {
      result.current.change("typing");
    });

    expect(result.current.value).toBe("typing");
  });

  it("saves again after a committed save when the value changes", async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useDebouncedSave({ initialValue: "", onSave }),
    );

    act(() => {
      result.current.change("first");
    });

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    act(() => {
      result.current.change("second");
    });

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(onSave).toHaveBeenCalledTimes(2);
    expect(onSave).toHaveBeenNthCalledWith(1, "first");
    expect(onSave).toHaveBeenNthCalledWith(2, "second");
  });
});
