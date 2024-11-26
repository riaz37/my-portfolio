'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface TerminalContextType {
  isOpen: boolean;
  toggleTerminal: () => void;
}

const TerminalContext = createContext<TerminalContextType | undefined>(undefined);

export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleTerminal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const value = {
    isOpen,
    toggleTerminal
  };

  return (
    <TerminalContext.Provider value={value}>
      {children}
    </TerminalContext.Provider>
  );
}

export function useTerminal() {
  const context = useContext(TerminalContext);
  if (context === undefined) {
    throw new Error('useTerminal must be used within a TerminalProvider');
  }
  return context;
}
