import { theme } from "../theme";

const s = {
  wrap: (tone) => ({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: `40px ${theme.pad}px`,
    background: tone === "dark" ? theme.surfaceDark : theme.surfaceLight,
  }),
  line: (tone) => ({
    flex: 1,
    height: 1,
    background: `linear-gradient(to right, transparent, ${
      tone === "dark" ? theme.hairlineOnDark : theme.hairlineOnLight
    }, transparent)`,
  }),
  wave: { width: 140, height: 30, flex: "none" },
};

/**
 * The ECG line from the MedTrack logo, reused as a section divider.
 * Also gives dark-to-light section transitions their breathing room, since
 * it renders as a padded strip in its own tone rather than a bare line.
 */
export default function PulseDivider({ tone = "light" }) {
  const strokeColor = tone === "dark" ? theme.textOnDark : theme.accent;

  return (
    <div style={s.wrap(tone)}>
      <span style={s.line(tone)} />
      <svg style={s.wave} viewBox="0 0 120 24" fill="none" aria-hidden="true">
        <path
          d="M0 12h34l6-9 7 18 6-13 5 8 5-4h52"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span style={s.line(tone)} />
    </div>
  );
}
