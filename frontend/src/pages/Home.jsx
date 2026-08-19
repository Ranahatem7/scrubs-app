import PulseDivider from "../components/PulseDivider";
import ProductCard from "../components/ProductCard";
import useIsDesktop from "../hooks/useIsDesktop";
import useProducts from "../hooks/useProducts";
import useCategories from "../hooks/useCategories";
import useSiteSettings from "../hooks/useSiteSettings";
import LoadingPage from "../components/LoadingPage";
import { Link } from "react-router-dom";
import { theme, label, display, btnSolid, btnGhost, strongText } from "../theme";
import Footer from "../components/Footer";

export default function Home() {
  const isDesktop = useIsDesktop(700);
  const { products, loading, error, retry } = useProducts();
  const { categories } = useCategories();
  const { settings } = useSiteSettings();
  const heroImage  = settings?.heroImage  || "";
  const heroImage2 = settings?.heroImage2 || "";
  const heroImage3 = settings?.heroImage3 || "";
  const heroTitle = settings?.heroTitle || "Scrubs for the long shift";
  const heroSub = settings?.heroSub || "Engineered fabric, tailored cut, made for twelve hours on your feet.";

  if (loading) return <LoadingPage />;

  const heroPanel = (fallbackColor = theme.ink) => ({
    position: "relative",
    overflow: "hidden",
    background: fallbackColor,
  });

  const s = {
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
      gridTemplateColumns: isDesktop ? "1fr" : "1fr 1fr",
      gridTemplateRows: isDesktop ? "1fr 1fr" : "1fr",
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

    footer: {
      padding: `44px ${theme.pad}px 32px`,
      background: "#092a1f",
    },
    footLogo: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 36 },
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
      {/* Hero */}
      <section style={s.heroGrid}>
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

        <div style={s.heroRight}>
          <div style={s.heroRightTop}>
            {heroImage2 && <img src={heroImage2} alt="Shop Men" style={s.panelImg} />}
            <div style={s.heroOverlay} aria-hidden="true" />
            <span style={{ position: "relative", zIndex: 1, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>Collection</span>
            <a href="/men" style={{ ...btnSolid, position: "relative", zIndex: 1, marginTop: 10, display: "inline-flex", alignSelf: "flex-start" }}>Shop Men</a>
          </div>
          <div style={s.heroRightBottom}>
            {heroImage3 && <img src={heroImage3} alt="Shop Women" style={s.panelImg} />}
            <div style={s.heroOverlay} aria-hidden="true" />
            <span style={{ position: "relative", zIndex: 1, fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)" }}>Collection</span>
            <a href="/women" style={{ ...btnSolid, position: "relative", zIndex: 1, marginTop: 10, display: "inline-flex", alignSelf: "flex-start" }}>Shop Women</a>
          </div>
        </div>
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

      {/* Categories */}
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

        {error && (
          <div style={s.stateBlock}>
            <p style={s.errorText}>{error}</p>
            <button style={s.retryBtn} onClick={retry}>Try again</button>
          </div>
        )}

        {!error && products.length === 0 && (
          <p style={s.stateBlock}>No products yet — check back soon.</p>
        )}

        {!error && products.length > 0 && (
          <div style={s.grid}>
            {(products.filter((p) => p.featured).length > 0
              ? products.filter((p) => p.featured)
              : products
            ).slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <a href="/products" style={s.sectionCta}>View all products</a>
      </section>

      <PulseDivider />

      {/* Brand statement */}
      <section style={s.statement} id="story">
        <p style={s.statementText}>
          Every stitch is measured against a shift that doesn't end when you're tired.
        </p>
        <span style={label("light")}>MedTrack · Cairo</span>
      </section>

    <Footer />
          
    </main>
  );
}