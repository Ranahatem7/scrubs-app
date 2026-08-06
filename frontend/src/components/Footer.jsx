import PulseDivider from "./PulseDivider";
import { theme, label, display, strongText } from "../theme";

export default function Footer() {
  const s = {
    statement: { padding: `20px ${theme.pad}px`, textAlign: "center", background: theme.surfaceLight },
    statementText: {
      fontFamily: theme.fontDisplay,
      fontWeight: 700,
      lineHeight: 0.95,
      letterSpacing: "-0.01em",
      margin: "0 auto 18px",
      fontSize: 20,
      fontStyle: "italic",
      color: theme.accent,
    },
    footer: { padding: `44px ${theme.pad}px 32px`, background: theme.surfaceDark },
    footBrand: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 34 },
    footMt: { ...strongText("dark"), fontFamily: theme.fontDisplay, fontSize: 26, fontWeight: 700, lineHeight: 1 },
    footCols: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 28, marginBottom: 32 },
    footCol: { display: "flex", flexDirection: "column", gap: 9 },
    footHead: {
      margin: "0 0 4px", fontSize: 10, fontWeight: 500,
      letterSpacing: "0.28em", textTransform: "uppercase", color: theme.textOnDark,
    },
    footLink: { fontSize: 13, color: theme.textOnDarkMuted },
    footContact: {
      display: "flex", flexDirection: "column", gap: 6,
      paddingTop: 24, borderTop: `1px solid ${theme.hairlineOnDark}`,
    },
    footText: { margin: 0, fontSize: 13, color: theme.textOnDarkMuted },
    legal: {
      margin: "28px 0 0", fontSize: 10,
      letterSpacing: "0.18em", textTransform: "uppercase", color: theme.textOnDarkMuted,
    },
  };

  return (
    <>
      <PulseDivider />

      <section style={s.statement} id="story">
        <p style={s.statementText}>
          Every stitch is measured against a shift that doesn't end when you're tired.
        </p>
        <span style={label("light")}>MedTrack · Cairo</span>
      </section>

      <footer style={s.footer} id="contact">
        <div style={s.footBrand}>
          <span style={s.footMt}>MT</span>
          <span style={label("dark")}>Medical Wear</span>
        </div>

        <div style={s.footCols}>
          <div style={s.footCol}>
            <h3 style={s.footHead}>Shop</h3>
            <a href="/men" style={s.footLink}>Men</a>
            <a href="/women" style={s.footLink}>Women</a>
            <a href="/category/lab-coats" style={s.footLink}>Lab coats</a>
          </div>
          <div style={s.footCol}>
            <h3 style={s.footHead}>Help</h3>
            <a href="#sizing" style={s.footLink}>Size guide</a>
            <a href="#returns" style={s.footLink}>Returns</a>
          </div>
        </div>

        <div style={s.footContact}>
          <p style={s.footText}>New Cairo, Cairo</p>
          <a href="mailto:hello@medtrack.com" style={s.footLink}>hello@medtrack.com</a>
        </div>

        <p style={s.legal}>© 2026 MedTrack</p>
      </footer>
    </>
  );
}