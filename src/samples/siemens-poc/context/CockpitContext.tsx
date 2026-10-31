import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type ShortcutsVariant = 'tiles' | 'list';

interface CockpitContextValue {
  /** True when the portal is rendered by the Cockpit AppShell */
  enabled: boolean;
  /** Worklist rows published by the Taskboard so the hero overview can summarize them */
  assignments: any[] | null;
  setAssignments: (rows: any[] | null) => void;
}

const CockpitContext = createContext<CockpitContextValue>({
  enabled: false,
  assignments: null,
  setAssignments: () => {}
});

export function CockpitProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<any[] | null>(null);
  const value = useMemo(() => ({ enabled: true, assignments, setAssignments }), [assignments]);
  return <CockpitContext.Provider value={value}>{children}</CockpitContext.Provider>;
}

export function useCockpit() {
  return useContext(CockpitContext);
}

/** Lets a parent layout decide how a Shortcuts widget renders (Quick Access tiles vs. app list) */
export const ShortcutsVariantContext = createContext<ShortcutsVariant>('tiles');

/** Strips the `@L ` annotation prefix and localizes the remaining text */
export function localize(value: string | undefined, localeReference = ''): string {
  if (!value) return '';
  const text = value.startsWith('@L ') ? value.slice(3) : value;
  return PCore.getLocaleUtils().getLocaleValue(text, '', localeReference);
}
