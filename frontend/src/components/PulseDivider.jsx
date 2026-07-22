import { theme } from "../theme";

const s = {
  wrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    padding: `0 ${theme.pad}px`,
  },
  line: {
    flex: 1,
    height: 1,
    background: `linear-gradient(to right, transparent, ${theme.hairline}, transparent)`,
  },
  wave: { width: 96, height: 20, flex: "none" },
};

/**
 * The ECG line from the MedTrack logo, reused as a section divider.
 * This is the one recurring flourish in the design.
 */
export default function PulseDivider() {
  return (
    <div style={s.wrap}>
      <span style={s.line} />
      <svg style={s.wave} viewBox="0 0 120 24" fill="none" aria-hidden="true">
        <path
          d="M0 12h34l6-9 7 18 6-13 5 8 5-4h52"
          stroke={theme.forest}
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span style={s.line} />
    </div>
  );
}