// Design tokens — MedTrack brand refresh (deep green / white / forest accent).
export const theme = {
  ink: "#0B1F18", // Deep Green — darkest background
  ink2: "#22252A", // Charcoal — raised panels / cards
  forest: "#0F5B46", // Forest Green — primary brand color: buttons, active fills, borders, the pulse line
  forestDeep: "#0A3F31", // darker forest, for pressed/hover states
  white: "#FFFFFF",
  lightGray: "#E8EDF5", // secondary text / muted-on-dark
  muted: "rgba(232, 237, 245, 0.7)", // lower-emphasis text, derived from lightGray
  hairline: "rgba(15, 91, 70, 0.35)", // forest-tinted separator lines

  fontDisplay: '"Satoshi", "Inter", system-ui, sans-serif',
  fontBody: '"Inter", system-ui, -apple-system, sans-serif',

  barH: 58,
  pad: 20,
  radius: 2,
};

// Reused style fragments
export const label = {
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  color: theme.white,
};

export const display = {
  fontFamily: theme.fontDisplay,
  fontWeight: 700,
  lineHeight: 1.05,
  letterSpacing: "-0.01em",
};

export const btn = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "14px 26px",
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  borderRadius: theme.radius,
  cursor: "pointer",
  textDecoration: "none",
};

export const btnSolid = {
  ...btn,
  background: theme.forest,
  color: theme.white,
};

export const btnGhost = {
  ...btn,
  border: `1px solid rgba(255, 255, 255, 0.3)`,
  color: theme.white,
};

// Plain bright emphasis text for wordmarks, totals, and other high-emphasis values.
export const strongText = {
  color: theme.white,
};
