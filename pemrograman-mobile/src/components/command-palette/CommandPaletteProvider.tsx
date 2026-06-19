import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import CommandPaletteFeedbackBanner, { CommandPaletteFeedbackTone } from "./CommandPaletteFeedbackBanner";

interface CommandPaletteFeedbackState {
  visible: boolean;
  tone: CommandPaletteFeedbackTone;
  title: string;
  message?: string;
}

interface CommandPaletteContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  showFeedback: (feedback: Omit<CommandPaletteFeedbackState, "visible">) => void;
  hideFeedback: () => void;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | undefined>(undefined);

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState<CommandPaletteFeedbackState>({
    visible: false,
    tone: "loading",
    title: "",
  });

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((value) => !value), []);
  const showFeedback = useCallback((next: Omit<CommandPaletteFeedbackState, "visible">) => {
    setFeedback({ visible: true, ...next });
  }, []);
  const hideFeedback = useCallback(() => {
    setFeedback((prev) => ({ ...prev, visible: false }));
  }, []);

  useEffect(() => {
    if (!feedback.visible || feedback.tone === "loading") {
      return;
    }

    const timer = setTimeout(() => {
      hideFeedback();
    }, 2600);

    return () => clearTimeout(timer);
  }, [feedback.visible, feedback.tone, hideFeedback]);

  const value = useMemo(
    () => ({ isOpen, open, close, toggle, showFeedback, hideFeedback }),
    [close, hideFeedback, isOpen, open, showFeedback, toggle]
  );

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      <CommandPaletteFeedbackBanner
        visible={feedback.visible}
        tone={feedback.tone}
        title={feedback.title}
        message={feedback.message}
      />
    </CommandPaletteContext.Provider>
  );
}

export function useCommandPalette() {
  const context = useContext(CommandPaletteContext);

  if (!context) {
    throw new Error("useCommandPalette must be used within CommandPaletteProvider");
  }

  return context;
}
