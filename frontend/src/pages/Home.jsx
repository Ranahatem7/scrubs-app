import PulseDivider from "../components/PulseDivider";
import ProductCard from "../components/ProductCard";
import useIsDesktop from "../hooks/useIsDesktop";
import useProducts from "../hooks/useProducts";
import { categories } from "../data/products";
import { images } from "../data/images";
import { theme, label, display, btnSolid, btnGhost, strongText } from "../theme";

export default function Home() {
  const isDesktop = useIsDesktop(700);
  const { products, loading, error, retry } = useProducts();

  const s = {
    hero: {
      position: "relative",
      minHeight: "92vh",
      display: "flex",
      alignItems: "flex-end",
      padding: `0 ${theme.pad}px 72px`,
      overflow: "hidden",
    },
    // Photo, then a forest-green wash, then a bottom-heavy scrim for legibility
    heroBg: {
      position: "absolute",
      inset: 0,
      background: `linear-gradient(to top, ${theme.ink} 4%, rgba(11,31,24,0.82) 34%, rgba(11,31,24,0.42) 100%),
        radial-gradient(90% 60% at 80% 20%, rgba(15,91,70,0.35), transparent 60%),
        url(${images.hero}) center 20% / cover no-repeat`,
    },
    heroInner: { position: "relative", zIndex: 1, maxWidth: 460 },
    heroTitle: { ...display, margin: "14px 0 0", fontSize: "clamp(46px, 15vw, 68px)" },
    heroEm: { ...strongText, fontStyle: "normal" },
    heroSub: { margin: "16px 0 0", maxWidth: "30ch", fontSize: 14, color: theme.lightGray },
    heroActions: { display: "flex", gap: 10, marginTop: 28 },
    heroBtn: isDesktop ? { paddingInline: 30 } : { flex: 1, paddingInline: 12 },
    heroScroll: {
      position: "absolute",
      bottom: 26,
      left: "50%",
      width: 1,
      height: 34,
      background: `linear-gradient(to bottom, ${theme.white}, transparent)`,
    },

    section: { padding: "56px 0" },
    head: { padding: `0 ${theme.pad}px`, marginBottom: 24 },
    title: { ...display, margin: "8px 0 0", fontSize: 34 },
    sectionCta: { ...btnGhost, display: "flex", margin: `28px ${theme.pad}px 0` },

    rail: {
      display: "flex",
      gap: 12,
      overflowX: "auto",
      padding: `0 ${theme.pad}px 6px`,
      scrollSnapType: "x mandatory",
    },
    railCard: (image) => ({
      position: "relative",
      flex: `0 0 ${isDesktop ? "30%" : "63%"}`,
      aspectRatio: "4 / 5",
      scrollSnapAlign: "start",
      display: "flex",
      alignItems: "flex-end",
      padding: 16,
      border: "1px solid rgba(255, 255, 255, 0.06)",
      borderRadius: theme.radius,
      background: `linear-gradient(to top, rgba(11,31,24,0.94) 6%, rgba(11,31,24,0.2) 62%),
        url(${image}) center / cover no-repeat`,
      overflow: "hidden",
    }),
    railGlow: {
      position: "absolute",
      inset: "auto -20% -40% -20%",
      height: "60%",
      background: `radial-gradient(50% 100% at 50% 100%, rgba(15,91,70,0.35), transparent)`,
    },
    railMeta: { position: "relative", display: "flex", flexDirection: "column", gap: 3 },
    railName: { fontFamily: theme.fontDisplay, fontSize: 24, fontWeight: 500 },
    railNote: { fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: theme.lightGray },

    grid: {
      display: "grid",
      gridTemplateColumns: `repeat(${isDesktop ? 4 : 2}, 1fr)`,
      gap: "22px 12px",
      padding: `0 ${theme.pad}px`,
    },

    // Products states
    stateBlock: {
      padding: `56px ${theme.pad}px`,
      textAlign: "center",
      color: theme.muted,
      fontSize: 13,
      letterSpacing: "0.1em",
    },
    errorText: { margin: "0 0 18px", color: "#c0524a", letterSpacing: "0.02em" },
    retryBtn: { ...btnGhost, display: "inline-flex" },

    statement: { padding: `72px ${theme.pad}px`, textAlign: "center" },
    statementText: {
      ...display,
      margin: "0 auto 18px",
      fontSize: isDesktop ? 40 : 28,
      fontStyle: "italic",
      lineHeight: 1.25,
      maxWidth: isDesktop ? "18ch" : "none",
    },

    footer: {
      padding: `44px ${theme.pad}px 32px`,
      borderTop: `1px solid ${theme.hairline}`,
      background: theme.ink2,
    },
    footBrand: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 34 },
    // TODO: swap for the real MT/ECG logo asset once provided — text treatment is a placeholder
    footMt: { ...strongText, fontFamily: theme.fontDisplay, fontSize: 26, fontWeight: 700, lineHeight: 1 },
    footCols: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 28, marginBottom: 32 },
    footCol: { display: "flex", flexDirection: "column", gap: 9 },
    footHead: {
      margin: "0 0 4px",
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: "0.28em",
      textTransform: "uppercase",
      color: theme.lightGray,
    },
    footLink: { fontSize: 13, color: theme.lightGray },
    footContact: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      paddingTop: 24,
      borderTop: "1px solid rgba(255, 255, 255, 0.06)",
    },
    footText: { margin: 0, fontSize: 13, color: theme.lightGray },
    legal: {
      margin: "28px 0 0",
      fontSize: 10,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: theme.muted,
    },
  };

  return (
    <main id="top">
      {/* Hero */}
      <section style={s.hero}>
        <div style={s.heroBg} aria-hidden="true" />
        <div style={s.heroInner}>
          <span style={label}>Medical Wear</span>
          <h1 style={s.heroTitle}>
            Scrubs for the
            <br />
            <em style={s.heroEm}>long shift</em>
          </h1>
          <p style={s.heroSub}>
            Engineered fabric, tailored cut, made for twelve hours on your feet.
          </p>
          <div style={s.heroActions}>
       <a href="/men" style={{ ...btnSolid, ...s.heroBtn }}>Shop men</a>
<a href="/women" style={{ ...btnGhost, ...s.heroBtn }}>Shop women</a>
          </div>
        </div>
        <span style={s.heroScroll} aria-hidden="true" />
      </section>

      <PulseDivider />

      {/* Categories — horizontal rail reads naturally on a phone */}
      <section style={s.section} id="collections">
        <div style={s.head}>
          <span style={label}>Collections</span>
          <h2 style={s.title}>Shop by piece</h2>
        </div>

        <div style={s.rail} className="no-scrollbar">
          {categories.map((cat) => (
            <a key={cat.id} href={`#${cat.id}`} style={s.railCard(cat.image)}>
              <span style={s.railGlow} aria-hidden="true" />
              <span style={s.railMeta}>
                <span style={s.railName}>{cat.name}</span>
                <span style={s.railNote}>{cat.note}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Featured products */}
      <section style={s.section} id="men">
        <div style={s.head}>
          <span style={label}>New in</span>
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
        <span style={label}>MedTrack · Cairo</span>
      </section>

      {/* Footer */}
      <footer style={s.footer} id="contact">
        <div style={s.footBrand}>
          <span style={s.footMt}>MT</span>
          <span style={label}>Medical Wear</span>
        </div>

        <div style={s.footCols}>
          <div style={s.footCol}>
            <h3 style={s.footHead}>Shop</h3>
            <a href="#men" style={s.footLink}>Men</a>
            <a href="#women" style={s.footLink}>Women</a>
            <a href="#lab-coats" style={s.footLink}>Lab coats</a>
          </div>
          <div style={s.footCol}>
            <h3 style={s.footHead}>Help</h3>
            <a href="#sizing" style={s.footLink}>Size guide</a>
            <a href="#fabric" style={s.footLink}>Our fabric</a>
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