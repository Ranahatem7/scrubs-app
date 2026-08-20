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
      background: "#092a1f",
      padding: "56px 40px 32px",
    },
    top: {
      display: "grid",
      gridTemplateColumns: "1.5fr 1fr 1fr 1fr",
      gap: 40,
      marginBottom: 48,
      alignItems: "start",
    },
    brand: {
      display: "flex",
      flexDirection: "column",
      gap: 12,
    },
    brandLogoRow: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      marginTop: -16,
    },
    brandName: {
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      color: theme.textOnDark,
    },
    brandTagline: {
      fontSize: 12,
      color: theme.textOnDarkMuted,
      lineHeight: 1.6,
      maxWidth: "22ch",
    },
    socials: {
      display: "flex",
      gap: 10,
      marginTop: 4,
    },
    socialBtn: {
      padding: "6px 14px",
      fontSize: 10,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: theme.textOnDarkMuted,
      border: `1px solid rgba(255,255,255,0.15)`,
      borderRadius: 999,
      textDecoration: "none",
      transition: "border-color 0.15s, color 0.15s",
    },
    col: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
    },
    colHead: {
      margin: "0 0 6px",
      fontSize: 9,
      fontWeight: 600,
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      color: theme.textOnDark,
    },
    link: {
      fontSize: 13,
      color: theme.textOnDarkMuted,
      textDecoration: "none",
      lineHeight: 1.5,
    },
    bottom: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 24,
      borderTop: `1px solid rgba(255,255,255,0.08)`,
      flexWrap: "wrap",
      gap: 12,
    },
    legal: {
      fontSize: 10,
      letterSpacing: "0.16em",
      textTransform: "uppercase",
      color: theme.textOnDarkMuted,
      margin: 0,
    },
    address: {
      fontSize: 11,
      color: theme.textOnDarkMuted,
      letterSpacing: "0.06em",
    },
  };

  return (
    <footer style={s.footer}>
      <div style={s.top}>
        {/* Brand */}
        <div style={s.brand}>
          <div style={s.brandLogoRow}>
            <img src="/logo.png" alt="MedTrack" style={{ height: 40, width: "auto" }} />
            <span style={s.brandName}>MedTrack</span>
          </div>
          <p style={s.brandTagline}>
            Medical wear engineered for the long shift — precision stitching, fabric that breathes.
          </p>
          <div style={s.socials}>
            <a
              href="https://www.instagram.com/medtrack.wear?igsh=MWppMmp6YmpocXl3MQ=="
              target="_blank" rel="noopener noreferrer"
              style={s.socialBtn}
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@medtrack.wear?_r=1&_t=ZS-9918BfOV5SH"
              target="_blank" rel="noopener noreferrer"
              style={s.socialBtn}
            >
              TikTok
            </a>
          </div>
        </div>

        {/* Shop */}
        <div style={s.col}>
          <h3 style={s.colHead}>Shop</h3>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <a key={cat._id} href={`/category/${cat.slug}`} style={s.link}>{cat.name}</a>
            ))
          ) : (
            <>
              <a href="/men" style={s.link}>Men</a>
              <a href="/women" style={s.link}>Women</a>
            </>
          )}
          <a href="/products" style={s.link}>All products</a>
        </div>

        {/* Help */}
        <div style={s.col}>
          <h3 style={s.colHead}>Help</h3>
       
          <a href="#returns" style={s.link}>Returns</a>
         
        </div>

       
      </div>

      <div style={s.bottom}>
        <p style={s.legal}>© 2026 MedTrack. All rights reserved.</p>
        <span style={s.address}>Made in Cairo, Egypt 🇪🇬</span>
      </div>
    </footer>
  );
}