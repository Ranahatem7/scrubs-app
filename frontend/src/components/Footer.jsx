import { useEffect, useState } from "react";
import { theme } from "../theme";

export default function Footer() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/admin/categories/public`)
      .then((r) => r.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const s = {
    footer: {
      padding: `44px ${theme.pad}px 32px`,
      background: "#092a1f",
      marginTop: "auto",
    },
    brand: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: 36,
    },
    cols: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 28,
      marginBottom: 32,
    },
    col: { display: "flex", flexDirection: "column", gap: 9 },
    colHead: {
      margin: "0 0 4px",
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: "0.28em",
      textTransform: "uppercase",
      color: theme.textOnDark,
    },
    link: { fontSize: 13, color: theme.textOnDarkMuted, textDecoration: "none" },
    contact: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      paddingTop: 24,
      borderTop: `1px solid ${theme.hairlineOnDark}`,
    },
    contactText: { margin: 0, fontSize: 13, color: theme.textOnDarkMuted },
    legal: {
      margin: "28px 0 0",
      fontSize: 10,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: theme.textOnDarkMuted,
    },
  };

  return (
    <footer style={s.footer}>
      <div style={s.brand}>
        <img
          src="/logo.png"
          alt="MedTrack"
          style={{ height: 80, width: "auto", display: "block" }}
        />
        <span
          style={{
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: theme.textOnDarkMuted,
            marginTop: -25,
          }}
        >
          MedTrack
        </span>
      </div>

      <div style={s.cols}>
        {/* Shop — dynamic categories */}
        <div style={s.col}>
          <h3 style={s.colHead}>Shop</h3>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <a key={cat._id} href={`/category/${cat.slug}`} style={s.link}>
                {cat.name}
              </a>
            ))
          ) : (
            <>
              <a href="/men" style={s.link}>Men</a>
              <a href="/women" style={s.link}>Women</a>
            </>
          )}
        </div>

        {/* Help */}
        <div style={s.col}>
          <h3 style={s.colHead}>Help</h3>
          <a href="#sizing" style={s.link}>Size guide</a>
          <a href="#returns" style={s.link}>Returns</a>
        </div>
      </div>

      <div style={s.contact}>
        <p style={s.contactText}>New Cairo, Cairo</p>
        <a href="mailto:hello@medtrack.com" style={s.link}>hello@medtrack.com</a>
        <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
          <a
            href="https://www.instagram.com/medtrack.wear?igsh=MWppMmp6YmpocXl3MQ=="
            target="_blank"
            rel="noopener noreferrer"
            style={s.link}
          >
            Instagram
          </a>
          <a
            href="https://www.tiktok.com/@medtrack.wear?_r=1&_t=ZS-9918BfOV5SH"
            target="_blank"
            rel="noopener noreferrer"
            style={s.link}
          >
            TikTok
          </a>
        </div>
      </div>

      <p style={s.legal}>© 2026 MedTrack</p>
    </footer>
  );
}