"use client";

import { useSyncExternalStore } from "react";

/**
 * Tiny global UI store (no dependency). Holds cross-cutting UI state that
 * unrelated components react to: intro finished, layout grid, easter eggs, toasts.
 */
export type AppState = {
  /** Preloader finished; hero choreography may start. */
  introDone: boolean;
  /** Layout grid overlay (press G). */
  grid: boolean;
  /** Multiplayer party easter egg (Konami code). */
  party: boolean;
  /** Keyboard shortcuts sheet (press ?). */
  shortcuts: boolean;
  /** Figma-style toast message. */
  toast: { id: number; message: string } | null;
};

let state: AppState = {
  introDone: false,
  grid: false,
  party: false,
  shortcuts: false,
  toast: null,
};

const listeners = new Set<() => void>();

export function setAppState(patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) {
  const next = typeof patch === "function" ? patch(state) : patch;
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}

export function getAppState(): AppState {
  return state;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

const serverState = state;

export function useAppState<T>(selector: (s: AppState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(state),
    () => selector(serverState),
  );
}

let toastId = 0;
export function showToast(message: string) {
  toastId += 1;
  setAppState({ toast: { id: toastId, message } });
}
