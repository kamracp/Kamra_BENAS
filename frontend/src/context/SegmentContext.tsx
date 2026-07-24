import { createContext, useContext, useState, type ReactNode } from "react";

export type Segment = "benas" | "manufacturing";

interface SegmentContextValue {
  segment: Segment;
  setSegment: (segment: Segment) => void;
}

const SegmentContext = createContext<SegmentContextValue | undefined>(undefined);

const STORAGE_KEY = "kamra-climateos-segment";

export function SegmentProvider({ children }: { children: ReactNode }) {
  const [segment, setSegmentState] = useState<Segment>(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "manufacturing" ? "manufacturing" : "benas";
  });

  function setSegment(next: Segment) {
    setSegmentState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <SegmentContext.Provider value={{ segment, setSegment }}>
      {children}
    </SegmentContext.Provider>
  );
}

export function useSegment() {
  const ctx = useContext(SegmentContext);
  if (!ctx) {
    throw new Error("useSegment must be used within a SegmentProvider");
  }
  return ctx;
}
