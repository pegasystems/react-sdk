import { useSyncExternalStore } from 'react';

import type { CockpitMode } from '../styles/cockpitTheme';

// Cockpit state shared with components rendered outside the AppShell tree (e.g. the modal container).
interface CockpitState {
  active: boolean;
  mode: CockpitMode;
}

let state: CockpitState = { active: false, mode: 'dark' };
const listeners = new Set<() => void>();

export function setCockpitState(next: CockpitState) {
  if (next.active === state.active && next.mode === state.mode) return;
  state = next;
  listeners.forEach(listener => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useCockpitState() {
  return useSyncExternalStore(subscribe, () => state);
}
