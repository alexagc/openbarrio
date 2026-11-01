/**
 * Canonical Design System 2.0 Tokens - "Civic Precision"
 * Unified Design Tokens for OpenBarrio Web, Extension, and Reports.
 */

export const colors = {
  // Obsidian Surface System
  surface: {
    DEFAULT: "#0b1326",
    dim: "#0b1326",
    bright: "#31394d",
    lowest: "#060e20",
    low: "#131b2e",
    container: "#171f33",
    high: "#222a3d",
    highest: "#2d3449",
    variant: "#2d3449",
  },
  // Text & On-Surface
  text: {
    primary: "#dae2fd",
    secondary: "#bccac0",
    muted: "#87948b",
    inverse: "#002114",
  },
  // Emerald / Primary (Inspire Cadastre, High Scores, Action)
  emerald: {
    DEFAULT: "#10b981",
    dim: "#68dba9",
    light: "#85f8c4",
    dark: "#006c4a",
    container: "#25a475",
    onContainer: "#00311f",
  },
  // Sky / Tertiary (Civic Boundaries, Urban Planning, Info)
  sky: {
    DEFAULT: "#38bdf8",
    dim: "#b4c5ff",
    light: "#dbe1ff",
    dark: "#003ea8",
    container: "#618bff",
    onContainer: "#002469",
  },
  // Amber / Secondary (Discrepancies, Warnings, Moderate Risk)
  amber: {
    DEFAULT: "#f59e0b",
    dim: "#ffb77d",
    light: "#ffdcc3",
    dark: "#6e3900",
    container: "#d97707",
    onContainer: "#432100",
  },
  // Coral / Red / Error (High Hazard, Critical Alerts)
  coral: {
    DEFAULT: "#ef4444",
    dim: "#ffb4ab",
    container: "#93000a",
    onContainer: "#ffdad6",
  },
  // Outlines & Borders
  border: {
    subtle: "#3d4a42",
    DEFAULT: "#87948b",
    focus: "#68dba9",
  },
} as const;

export const typography = {
  fonts: {
    headline: ['"Plus Jakarta Sans"', "sans-serif"],
    body: ["Inter", "sans-serif"],
    mono: ['"JetBrains Mono"', "monospace"],
  },
  sizes: {
    xs: ["11px", { lineHeight: "14px", fontWeight: "500" }],
    sm: ["12px", { lineHeight: "16px", fontWeight: "400" }],
    base: ["13px", { lineHeight: "18px", fontWeight: "400" }],
    md: ["14px", { lineHeight: "22px", fontWeight: "400" }],
    lg: ["16px", { lineHeight: "24px", fontWeight: "600" }],
    xl: ["18px", { lineHeight: "26px", fontWeight: "600" }],
    "2xl": ["24px", { lineHeight: "32px", fontWeight: "700" }],
    "3xl": ["30px", { lineHeight: "38px", fontWeight: "800" }],
  },
} as const;

export const radii = {
  DEFAULT: "0.125rem", // 2px
  sm: "0.125rem",      // 2px
  md: "0.25rem",       // 4px
  lg: "0.25rem",       // 4px
  xl: "0.5rem",        // 8px
  "2xl": "0.75rem",    // 12px
  full: "9999px",
} as const;

export const zIndex = {
  base: 0,
  dock: 10,
  panel: 20,
  hud: 30,
  bottomSheet: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
} as const;

export const tokens = {
  colors,
  typography,
  radii,
  zIndex,
} as const;

export default tokens;
