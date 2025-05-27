"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

interface LayoutContextProps {
  layoutMode: "light" | "dark";
  toggleLayout: () => void;
}

const LayoutContext = createContext<
  LayoutContextProps | undefined
>(undefined);

export const LayoutProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [layoutMode, setLayoutMode] = useState<
    "light" | "dark"
  >("light");

  const toggleLayout = () => {
    setLayoutMode((prev) =>
      prev === "light" ? "dark" : "light"
    );
  };

  return (
    <LayoutContext.Provider
      value={{ layoutMode, toggleLayout }}
    >
      <div
        className={
          layoutMode === "dark" ? "dark-mode" : "light-mode"
        }
      >
        {children}
      </div>
    </LayoutContext.Provider>
  );
};

export const useLayout = (): LayoutContextProps => {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error(
      "useLayout must be used within a LayoutProvider"
    );
  }
  return context;
};
