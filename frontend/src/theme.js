// Design tokens — MedTrack brand: white-dominant site with forest-green
// accent, and Deep Green reserved for the header, hero, footer, and sidebar
// ("bookends"). Everything else is a light surface.
const palette = {
  ink: "#0B1F18", // Deep Green
  ink2: "#22252A", // Charcoal
  forest: "#0F5B46", // Forest Green
  forestDeep: "#0A3F31",
  white: "#FFFFFF",
  lightGray: "#E8EDF5",
};

export const theme = {
  ...palette,

  // Surfaces — pick one of these for every section/card background.
  surfaceDark: palette.ink, // header, hero, footer, sidebar
  surfaceLight: palette.white, // default page/section background, cards
  surfaceMuted: palette.lightGray, // breaks up back-to-back white sections

  // Text — pick the pair that matches the surface underneath.
  textOnDark: palette.white,
  textOnDarkMuted: "rgba(232, 237, 245, 0.7)",
  textOnLight: palette.ink2,
  textOnLightMuted: "rgba(34, 37, 42, 0.6)",

  // Accent — forest green, the one place green does more than bookend.
  accent: palette.forest,
  accentDeep: palette.forestDeep,

  // Dividers — subtle, tuned per surface.
  hairlineOnDark: "rgba(255, 255, 255, 0.14)",
  hairlineOnLight: "rgba(34, 37, 42, 0.08)",

  fontDisplay: '"Satoshi", "Inter", system-ui, sans-serif',
  fontBody: '"Inter", system-ui, -apple-system, sans-serif',

  barH: 58,
  pad: 20,
  radius: 2,
};

// Reused style fragments — most take a `tone` ("light" | "dark") so the same
// helper works on both a white section and a dark bookend without
// duplicating the component.

// Small-caps eyebrow captions ("COLLECTIONS", "NEW IN"). Defaults to "light"
// since most of the site is now light surfaces; dark bookends pass "dark".
export const label = (tone = "light") => ({
  fontSize: 10,
  fontWeight: 500,
  letterSpacing: "0.32em",
  textTransform: "uppercase",
  color: tone === "dark" ? theme.textOnDark : theme.accent,
});

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

// Primary button — solid forest fill, white text. Same on any surface.
export const btnSolid = {
  ...btn,
  background: theme.accent,
  color: theme.textOnDark,
};

// Secondary/ghost button. On light surfaces: white fill, forest border+text.
// On dark surfaces: transparent fill, white border+text (e.g. over a photo).
export const btnGhost = (tone = "light") => ({
  ...btn,
  background: tone === "dark" ? "transparent" : theme.surfaceLight,
  border: `1px solid ${tone === "dark" ? "rgba(255, 255, 255, 0.3)" : theme.accent}`,
  color: tone === "dark" ? theme.textOnDark : theme.accent,
});

// Plain high-emphasis text for wordmarks and headline-adjacent emphasis —
// matches the heading color for whichever surface it sits on.
export const strongText = (tone = "light") => ({
  color: tone === "dark" ? theme.textOnDark : theme.textOnLight,
});
