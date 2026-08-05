import PulseDivider from "../components/PulseDivider";
import ProductCard from "../components/ProductCard";
import useIsDesktop from "../hooks/useIsDesktop";
import useProducts from "../hooks/useProducts";
import useCategories from "../hooks/useCategories";
import useSiteSettings from "../hooks/useSiteSettings";
import { images } from "../data/images";
import { Link } from "react-router-dom";
import { theme, label, display, btnSolid, btnGhost, strongText } from "../theme";

export default function Home() {
  const isDesktop = useIsDesktop(700);
  const { products, loading, error, retry } = useProducts();
  const { categories } = useCategories();
  const { settings } = useSiteSettings();
  const heroImage  = settings?.heroImage  || images.hero;
  const heroImage2 = settings?.heroImage2 || "";
  const heroImage3 = settings?.heroImage3 || "";
  const heroTitle = settings?.heroTitle || "Scrubs for the long shift";
  const heroSub = settings?.heroSub || "Engineered fabric, tailored cut, made for twelve hours on your feet.";

  const heroPanel = (fallbackColor = theme.ink) => ({
    position: "relative",
    overflow: "hidden",
    background: fallbackColor,
  });

  const s = {
    // ── Hero mosaic ──────────────────────────────────────────────────────
    heroGrid: {
      display: "grid",
      gridTemplateColumns: isDesktop ? "1fr 1fr" : "1fr",
      minHeight: isDesktop ? "95vh" : "auto",
    },
    heroLeft: {
      ...heroPanel(theme.ink),
      minHeight: isDesktop ? "95vh" : "60vw",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: isDesktop ? "48px 40px" : "28px 20px",
    },
    heroLeftImg: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center top",
    },
    heroRight: {
      display: "grid",
      gridTemplateRows: "1fr 1fr",
      gap: 3,
    },
    heroRightTop: {
    ...heroPanel("#c8cac8"),
      minHeight: isDesktop ? 0 : "45vw",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: isDesktop ? "32px 28px" : "20px 16px",
    },
    heroRightBottom: {
     ...heroPanel("#c8cac8"),
      minHeight: isDesktop ? 0 : "45vw",
      display: "flex",
      flexDirection: "column",
      justifyContent: "flex-end",
      padding: isDesktop ? "32px 28px" : "20px 16px",
    },
    panelImg: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%",
      objectFit: "contain",
      objectPosition: "center top",
    },
    heroOverlay: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(to top, rgba(11,31,24,0.82) 0%, rgba(11,31,24,0.25) 60%, transparent 100%)",
      pointerEvents: "none",
    },
    heroTitle: {
      ...display,
      position: "relative",
      zIndex: 1,
      margin: "12px 0 0",
      fontSize: isDesktop ? "clamp(38px, 5vw, 64px)" : "clamp(32px, 10vw, 48px)",
      lineHeight: 1.05,
      color: theme.textOnDark,
      textTransform: "uppercase",
      letterSpacing: "-0.01em",
    },
    heroSub: {
      position: "relative",
      zIndex: 1,
      margin: "14px 0 0",
      maxWidth: "28ch",
      fontSize: 13,
      lineHeight: 1.6,
      color: theme.textOnDarkMuted,
    },
    heroActions: {
      position: "relative",
      zIndex: 1,
      display: "flex",
      gap: 10,
      marginTop: 24,
      flexWrap: "wrap",
    },

    // ── Light content sections ───────────────────────────────────────────
    section: { padding: "56px 0", background: theme.surfaceLight },
    head: { padding: `0 ${theme.pad}px`, marginBottom: 24 },
    title: { ...display, margin: "8px 0 0", fontSize: 34, color: theme.accent },
    sectionCta: { ...btnGhost("light"), display: "flex", margin: `28px ${theme.pad}px 0` },

    rail: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 280px))",
      gap: 12,
      padding: `0 ${theme.pad}px`,
      justifyContent: "center",
    },
    railCard: (image) => ({
      position: "relative",
      aspectRatio: "3 / 4",
      display: "flex",
      alignItems: "flex-end",
      padding: 16,
      border: `1px solid ${theme.hairlineOnLight}`,
      borderRadius: theme.radius,
      background: `linear-gradient(to top, rgba(11,31,24,0.94) 6%, rgba(11,31,24,0.2) 62%),
        url(${image}) center / cover no-repeat`,
      overflow: "hidden",
      textDecoration: "none",
    }),
    railGlow: {
      position: "absolute",
      inset: "auto -20% -40% -20%",
      height: "60%",
      background: `radial-gradient(50% 100% at 50% 100%, rgba(15,91,70,0.35), transparent)`,
    },
    railMeta: { position: "relative", display: "flex", flexDirection: "column", gap: 3 },
    railName: { fontFamily: theme.fontDisplay, fontSize: 24, fontWeight: 500, color: theme.textOnDark },
    railNote: { fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: theme.textOnDarkMuted },

    grid: {
      display: "grid",
      gridTemplateColumns: `repeat(${isDesktop ? 4 : 2}, 1fr)`,
      gap: "22px 12px",
      padding: `0 ${theme.pad}px`,
    },

    stateBlock: {
      padding: `56px ${theme.pad}px`,
      textAlign: "center",
      color: theme.textOnLightMuted,
      fontSize: 13,
      letterSpacing: "0.1em",
    },
    errorText: { margin: "0 0 18px", color: "#c0524a", letterSpacing: "0.02em" },
    retryBtn: { ...btnGhost("light"), display: "inline-flex" },

    // ── Brand statement ───────────────────────────────────────────────────
    statement: { padding: `20px ${theme.pad}px`, textAlign: "center", background: theme.surfaceLight },
    statementText: {
      ...display,
      margin: "0 auto 18px",
      fontSize: isDesktop ? 20 : 18,
      fontStyle: "italic",
      lineHeight: 0.95,
      maxWidth: isDesktop ? "18ch" : "none",
      color: theme.accent,
    },

    // ── Footer (dark bookend) ────────────────────────────────────────────
    footer: {
      padding: `44px ${theme.pad}px 32px`,
      background: theme.surfaceDark,
    },
    footBrand: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 34 },
    footMt: { ...strongText("dark"), fontFamily: theme.fontDisplay, fontSize: 26, fontWeight: 700, lineHeight: 1 },
    footCols: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 28, marginBottom: 32 },
    footCol: { display: "flex", flexDirection: "column", gap: 9 },
    footHead: {
      margin: "0 0 4px",
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: "0.28em",
      textTransform: "uppercase",
      color: theme.textOnDark,
    },
    footLink: { fontSize: 13, color: theme.textOnDarkMuted },
    footContact: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      paddingTop: 24,
      borderTop: `1px solid ${theme.hairlineOnDark}`,
    },
    footText: { margin: 0, fontSize: 13, color: theme.textOnDarkMuted },
    legal: {
      margin: "28px 0 0",
      fontSize: 10,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: theme.textOnDarkMuted,
    },
  };

  return (
    <main id="top">
      {/* Hero — 3-panel mosaic */}
      <section style={s.heroGrid}>
        {/* Left — tall main image */}
        <div style={s.heroLeft}>
          {heroImage && <img src={heroImage} alt="" style={s.heroLeftImg} />}
          <div style={s.heroOverlay} aria-hidden="true" />
          <span style={{ ...label("dark"), position: "relative", zIndex: 1 }}>Medical Wear</span>
          <h1 style={s.heroTitle}>{heroTitle}</h1>
          <p style={s.heroSub}>{heroSub}</p>
          <div style={s.heroActions}>
            <a href="#collections" style={btnSolid}>Shop</a>
          </div>
        </div>

        {/* Right — two stacked panels (desktop only) */}
        {isDesktop && (
          <div style={s.heroRight}>
            {/* Top right — Shop Men */}
            <div style={s.heroRightTop}>
              {heroImage2 && <img src={heroImage2} alt="Shop Men" style={s.panelImg} />}
              <div style={s.heroOverlay} aria-hidden="true" />
              <span style={{ position: "relative", zIndex: 1, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>Collection</span>
              <a href="/men" style={{ ...btnSolid, position: "relative", zIndex: 1, marginTop: 10, display: "inline-flex", alignSelf: "flex-start" }}>Shop Men</a>
            </div>
            {/* Bottom right — Shop Women */}
            <div style={s.heroRightBottom}>
              {heroImage3 && <img src={heroImage3} alt="Shop Women" style={s.panelImg} />}
              <div style={s.heroOverlay} aria-hidden="true" />
              <span style={{ position: "relative", zIndex: 1, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>Collection</span>
              <a href="/women" style={{ ...btnSolid, position: "relative", zIndex: 1, marginTop: 10, display: "inline-flex", alignSelf: "flex-start" }}>Shop Women</a>
            </div>
          </div>
        )}
      </section>

      <PulseDivider />

      {/* Slogan banner */}
      <section style={{
        padding: `10px ${theme.pad}px`,
        background: theme.surfaceLight,
        textAlign: "center",
        borderBottom: `1px solid ${theme.hairlineOnLight}`,
      }}>
        <p style={{
          ...display,
          margin: "0 auto 4px",
          fontSize: isDesktop ? 22 : 18,
          fontStyle: "italic",
          color: theme.accent,
          letterSpacing: "0.01em",
        }}>
          Wear the journey.
        </p>
        <span style={label("light")}>MedTrack Medical Wear</span>
      </section>

      {/* Categories — now loaded from database */}
      <section style={s.section} id="collections">
        <div style={s.head}>
          <span style={label("light")}>Collections</span>
          <h2 style={s.title}>Shop by piece</h2>
        </div>

        <div style={s.rail} className="no-scrollbar">
          {categories.map((cat) => (
           <Link key={cat._id} to={`/category/${cat.slug}`} style={s.railCard(cat.image)}>
              <span style={s.railGlow} aria-hidden="true" />
              <span style={s.railMeta}>
                <span style={s.railName}>{cat.name}</span>
                <span style={s.railNote}>{cat.subtitle}</span>
              </span>
           </Link>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section style={s.section} id="men">
        <div style={s.head}>
          <span style={label("light")}>New in</span>
          <h2 style={s.title}>This season</h2>
        </div>

        {loading && <p style={s.stateBlock}>Loading products…</p>}

        {!loading && error && (
          <div style={s.stateBlock}>
            <p style={s.errorText}>{error}</p>
            <button style={s.retryBtn} onClick={retry}>Try again</button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <p style={s.stateBlock}>No products yet — check back soon.</p>
        )}

        {!loading && !error && products.length > 0 && (
          <div style={s.grid}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <a href="#all" style={s.sectionCta}>View all products</a>
      </section>

      <PulseDivider />

      {/* Brand statement */}
      <section style={s.statement} id="story">
        <p style={s.statementText}>
          Every stitch is measured against a shift that doesn't end when you're tired.
        </p>
        <span style={label("light")}>MedTrack · Cairo</span>
      </section>

      {/* Footer */}
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
            <a href="#lab-coats" style={s.footLink}>Lab coats</a>
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
    </main>
  );
}