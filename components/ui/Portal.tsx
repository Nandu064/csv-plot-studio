"use client";

import { type ReactNode } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
  children: ReactNode;
}

/**
 * Portal component that renders children at document root level
 * This ensures modals and overlays are not constrained by parent containers
 */
export function Portal({ children }: PortalProps) {
  // Only render on client side
  if (typeof window === "undefined") {
    return null;
  }

  return createPortal(children, document.body);
}
