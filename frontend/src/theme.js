// Design tokens — pulled from the MedTrack logo.
export const theme = {
  ink: "#0b0b0c",
  ink2: "#151517",
  bronze: "#c08e5a",
  bronzeDeep: "#8a5f35",
  bronzeGlow: "rgba(192, 142, 90, 0.18)",
  silver: "#c9ccd1",
  bone: "#f1eee9",
  muted: "#8b8b90",
  hairline: "rgba(192, 142, 90, 0.22)",

  fontDisplay: '"Cormorant Garamond", Georgia, serif',
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
  color: theme.bronze,
};

export const display = {
  fontFamily: theme.fontDisplay,
  fontWeight: 300,
  lineHeight: 1.05,
  letterSpacing: "0.01em",
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
  background: `linear-gradient(135deg, ${theme.bronze}, ${theme.bronzeDeep})`,
  color: theme.ink,
};

export const btnGhost = {
  ...btn,
  border: `1px solid ${theme.hairline}`,
  color: theme.bone,
};

// The silver-to-bronze wordmark gradient from the logo
export const metalText = {
  background: `linear-gradient(100deg, ${theme.silver} 40%, ${theme.bronze} 60%)`,
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
  color: "transparent",
};