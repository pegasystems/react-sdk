import { createContext, useContext, useState, useRef, type ReactNode, type MutableRefObject } from 'react';

interface TodoPortalContextType {
  surveyCase: any | null;
  setSurveyCase: (data: any | null) => void;
  clickGoRef: MutableRefObject<() => void>;
}

const TodoPortalContext = createContext<TodoPortalContextType>({
  surveyCase: null,
  setSurveyCase: () => {},
  clickGoRef: { current: () => {} }
});

export function TodoPortalProvider({ children }: { children: ReactNode }) {
  const [surveyCase, setSurveyCase] = useState<any | null>(null);
  const clickGoRef = useRef<() => void>(() => {});
  return <TodoPortalContext.Provider value={{ surveyCase, setSurveyCase, clickGoRef }}>{children}</TodoPortalContext.Provider>;
}

export function useTodoPortal() {
  return useContext(TodoPortalContext);
}
