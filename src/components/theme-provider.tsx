"use client"

import * as React from "react"

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Since next-themes is removed, we just render the children.
  // The app will fall back to the default theme defined in globals.css.
  // We can explore other ways to implement theme toggling later if needed.
  return <>{children}</>
}
