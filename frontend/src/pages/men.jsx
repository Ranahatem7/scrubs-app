import { useState } from "react";
import PulseDivider from "../components/PulseDivider";
import ProductCard from "../components/ProductCard";
import useIsDesktop from "../hooks/useIsDesktop";
import useProducts from "../hooks/useProducts";
import { images } from "../data/images";
import { theme, label, display, btnSolid, btnGhost, strongText } from "../theme";

// Filter categories for men's page — ids match Product.category in the backend
const MEN_FILTERS = [
  { id: "all", name: "All" },
  { id: "tops", name: "Scrub Tops" },
  { id: "pants", name: "Scrub Pants" },
  { id: "lab-coats", name: "Lab Coats" },
  { id: "full-scrub", name: "Sets" },
];

export default function Men() {
  const isDesktop = useIsDesktop(700);
  const [activeFilter, setActiveFilter] = useState("all");
  const { products, loading, error, retry } = useProducts();

  // Men's page shows men's + unisex pieces
  const menProducts = products.filter(
    (p) => p.gender === "men" || p.gender === "unisex" || !p.gender
  );
  const filtered =
    activeFilter === "all"
      ? menProducts
      : menProducts.filter((p) => p.category === activeFilter);

  const s = {
    // ── Hero ──────────────────────────────────────────────────────────────
    hero: {
      position: "relative",
      minHeight: "72vh",
      display: "flex",
      alignItems: "flex-end",
      padding: `0 ${theme.pad}px 64px`,
      overflow: "hidden",
    },
    heroBg: {
      position: "absolute",
      inset: 0,
      background: `linear-gradient(to top, ${theme.ink} 4%, rgba(11,31,24,0.80) 34%, rgba(11,31,24,0.38) 100%),
        radial-gradient(90% 60% at 20% 30%, rgba(15,91,70,0.35), transparent 60%),
        url(${images.menHero ?? images.hero}) center 30% / cover no-repeat`,
    },
    heroInner: { position: "relative", zIndex: 1, maxWidth: 480 },
    heroTitle: {
      ...display,
      margin: "14px 0 0",
      fontSize: "clamp(40px, 12vw, 62px)",
    },
    heroEm: { ...strongText, fontStyle: "normal" },
    heroSub: {
      margin: "16px 0 0",
      maxWidth: "32ch",
      fontSize: 14,
      color: theme.lightGray,
    },
    heroActions: { display: "flex", gap: 10, marginTop: 28 },
    heroBtn: isDesktop ? { paddingInline: 30 } : { flex: 1, paddingInline: 12 },

    // ── Filter bar ────────────────────────────────────────────────────────
    filterBar: {
      display: "flex",
      gap: 8,
      overflowX: "auto",
      padding: `28px ${theme.pad}px 0`,
      scrollSnapType: "x mandatory",
    },
    filterPill: (active) => ({
      flex: "0 0 auto",
      scrollSnapAlign: "start",
      padding: "7px 18px",
      borderRadius: 999,
      border: `1px solid ${active ? theme.forest : "rgba(255,255,255,0.12)"}`,
      background: active ? `rgba(15,91,70,0.35)` : "transparent",
      color: active ? theme.white : theme.lightGray,
      fontSize: 12,
      fontFamily: theme.fontBody,
      letterSpacing: "0.08em",
      cursor: "pointer",
      transition: "border-color 0.18s, color 0.18s, background 0.18s",
      whiteSpace: "nowrap",
    }),

    // ── Product section ───────────────────────────────────────────────────
    section: { padding: "40px 0 64px" },
    head: { padding: `0 ${theme.pad}px`, marginBottom: 24 },
    title: { ...display, margin: "8px 0 0", fontSize: 34 },
    countNote: {
      marginTop: 4,
      fontSize: 12,
      color: theme.muted,
      letterSpacing: "0.1em",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: `repeat(${isDesktop ? 4 : 2}, 1fr)`,
      gap: "22px 12px",
      padding: `0 ${theme.pad}px`,
    },

    // Empty / loading / error states
    empty: {
      padding: `56px ${theme.pad}px`,
      textAlign: "center",
      color: theme.muted,
      fontSize: 13,
      letterSpacing: "0.12em",
    },
    errorText: { margin: "0 0 18px", color: "#c0524a", letterSpacing: "0.02em" },
    retryBtn: { ...btnGhost, display: "inline-flex" },

    // ── Brand statement ───────────────────────────────────────────────────
    statement: { padding: `64px ${theme.pad}px`, textAlign: "center" },
    statementText: {
      ...display,
      margin: "0 auto 18px",
      fontSize: isDesktop ? 36 : 26,
      fontStyle: "italic",
      lineHeight: 1.3,
      maxWidth: isDesktop ? "20ch" : "none",
    },

    // ── Footer ────────────────────────────────────────────────────────────
    footer: {
      padding: `44px ${theme.pad}px 32px`,
      background: theme.white,
    },
    footBrand: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 34 },
    // TODO: swap for the real MT/ECG logo asset once provided — text treatment is a placeholder
    footMt: {
      fontFamily: theme.fontDisplay,
      fontSize: 26,
      fontWeight: 700,
      lineHeight: 1,
      color: theme.forest,
    },
    footTagline: {
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: "0.32em",
      textTransform: "uppercase",
      color: "rgba(11, 31, 24, 0.55)",
    },
    footCols: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: 28,
      marginBottom: 32,
    },
    footCol: { display: "flex", flexDirection: "column", gap: 9 },
    footHead: {
      margin: "0 0 4px",
      fontSize: 10,
      fontWeight: 500,
      letterSpacing: "0.28em",
      textTransform: "uppercase",
      color: theme.forest,
    },
    footLink: { fontSize: 13, color: theme.ink2 },
    footContact: {
      display: "flex",
      flexDirection: "column",
      gap: 6,
      paddingTop: 24,
      borderTop: "1px solid rgba(11, 31, 24, 0.1)",
    },
    footText: { margin: 0, fontSize: 13, color: theme.ink2 },
    legal: {
      margin: "28px 0 0",
      fontSize: 10,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "rgba(11, 31, 24, 0.5)",
    },
  };

  return (
    <main id="top">
      {/* Hero */}
      <section style={s.hero}>
        <div style={s.heroBg} aria-hidden="true" />
        <div style={s.heroInner}>
          <span style={label}>Men&rsquo;s collection</span>
          <h1 style={s.heroTitle}>
            Dressed for the
            <br />
            <em style={s.heroEm}>long call</em>
          </h1>
          <p style={s.heroSub}>
            Performance scrubs cut for movement, built to last a twelve-hour shift and beyond.
          </p>
          <div style={s.heroActions}>
            <a href="#products" style={{ ...btnSolid, ...s.heroBtn }}>Shop now</a>
            <a href="/women" style={{ ...btnGhost, ...s.heroBtn }}>Shop women</a>
          </div>
        </div>
      </section>

      <PulseDivider />

      {/* Filter bar */}
      <div style={s.filterBar} className="no-scrollbar" role="group" aria-label="Filter by category">
        {MEN_FILTERS.map((f) => (
          <button
            key={f.id}
            style={s.filterPill(activeFilter === f.id)}
            onClick={() => setActiveFilter(f.id)}
          >
            {f.name}
          </button>
        ))}
      </div>

      {/* Products */}
      <section style={s.section} id="products">
        <div style={s.head}>
          <span style={label}>Men&rsquo;s scrubs</span>
          <h2 style={s.title}>
            {activeFilter === "all"
              ? "All pieces"
              : MEN_FILTERS.find((f) => f.id === activeFilter)?.name}
          </h2>
          {!loading && !error && (
            <p style={s.countNote}>
              {filtered.length} {filtered.length === 1 ? "item" : "items"}
            </p>
          )}
        </div>

        {loading && <p style={s.empty}>Loading products…</p>}

        {!loading && error && (
          <div style={s.empty}>
            <p style={s.errorText}>{error}</p>
            <button style={s.retryBtn} onClick={retry}>Try again</button>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div style={s.grid}>
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <p style={s.empty}>No items in this category yet.</p>
        )}
      </section>

      <PulseDivider />

      {/* Brand statement */}
      <section style={s.statement}>
        <p style={s.statementText}>
          Precision stitching. Fabric that breathes. A fit that moves with you.
        </p>
        <span style={label}>MedTrack · Cairo</span>
      </section>

      {/* Footer */}
      <footer style={s.footer} id="contact">
        <div style={s.footBrand}>
          <span style={s.footMt}>MT</span>
          <span style={s.footTagline}>Medical Wear</span>
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
            <a href="#fabric" style={s.footLink}>Our fabric</a>
            <a href="#returns" style={s.footLink}>Returns</a>
          </div>
        </div>

        <div style={s.footContact}>
          <p style={s.footText}>New Cairo, Cairo</p>
          <a href="mailto:hello@medtrack.com" style={s.footLink}>
            hello@medtrack.com
          </a>
        </div>

        <p style={s.legal}>© 2026 MedTrack</p>
      </footer>
    </main>
  );
}