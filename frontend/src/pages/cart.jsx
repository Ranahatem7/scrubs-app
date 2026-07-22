import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import PulseDivider from "../components/PulseDivider";
import useIsDesktop from "../hooks/useIsDesktop";
import { theme, label, display, btnSolid, btnGhost, strongText } from "../theme";

export default function Cart() {
  const isDesktop = useIsDesktop(700);
  const { items, removeItem, updateQty, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  const s = {
    page: { minHeight: "100vh", background: theme.ink, paddingBottom: 80 },

    // ── Page header ───────────────────────────────────────────────────────
    pageHead: {
      padding: `48px ${theme.pad}px 32px`,
      borderBottom: `1px solid ${theme.hairline}`,
    },
    pageTitle: { ...display, margin: "8px 0 0", fontSize: isDesktop ? 40 : 30 },
    itemCount: { fontSize: 13, color: theme.muted, marginTop: 6 },

    // ── Layout ────────────────────────────────────────────────────────────
    layout: {
      display: "grid",
      gridTemplateColumns: isDesktop ? "1fr 340px" : "1fr",
      gap: 28,
      maxWidth: 1080,
      margin: "0 auto",
      padding: `40px ${theme.pad}px 0`,
      alignItems: "start",
    },

    // ── Cart items list ───────────────────────────────────────────────────
    itemsList: { display: "flex", flexDirection: "column", gap: 14 },

    itemCard: {
      display: "flex",
      gap: 16,
      padding: 16,
      background: theme.ink2,
      border: `1px solid ${theme.hairline}`,
      borderRadius: theme.radius,
    },
    itemImage: {
      width: 90,
      height: 110,
      objectFit: "cover",
      borderRadius: 8,
      flexShrink: 0,
      background: "rgba(255,255,255,0.04)",
    },
    itemInfo: { flex: 1, display: "flex", flexDirection: "column", gap: 6 },
    itemName: {
      fontFamily: theme.fontDisplay,
      fontSize: 16,
      fontWeight: 400,
      color: "#fff",
      margin: 0,
    },
    itemMeta: {
      fontSize: 11,
      color: theme.muted,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
    },
    itemPrice: { ...strongText, fontSize: 15, marginTop: "auto" },

    // Quantity controls
    qtyRow: { display: "flex", alignItems: "center", gap: 0, marginTop: 8 },
    qtyBtn: {
      width: 30,
      height: 30,
      border: `1px solid rgba(255,255,255,0.12)`,
      background: "transparent",
      color: "#fff",
      fontSize: 16,
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 6,
      transition: "border-color 0.15s",
    },
    qtyNum: {
      width: 34,
      textAlign: "center",
      fontSize: 14,
      color: "#fff",
      fontFamily: theme.fontBody,
    },
    removeBtn: {
      marginLeft: "auto",
      background: "none",
      border: "none",
      color: theme.muted,
      fontSize: 11,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      cursor: "pointer",
      padding: 0,
      alignSelf: "flex-start",
      transition: "color 0.15s",
    },

    // ── Empty state ───────────────────────────────────────────────────────
    empty: {
      padding: `80px ${theme.pad}px`,
      textAlign: "center",
    },
    emptyTitle: { ...display, fontSize: 26, margin: "0 0 12px" },
    emptyText: { fontSize: 14, color: theme.lightGray, margin: "0 0 28px" },

    // ── Order summary sidebar ─────────────────────────────────────────────
    summary: {
      background: theme.ink2,
      border: `1px solid ${theme.hairline}`,
      borderRadius: theme.radius,
      padding: 24,
      position: isDesktop ? "sticky" : "static",
      top: theme.barH + 20,
    },
    summaryTitle: {
      margin: "0 0 20px",
      fontSize: 11,
      fontWeight: 500,
      letterSpacing: "0.26em",
      textTransform: "uppercase",
      color: theme.lightGray,
    },
    summaryRow: {
      display: "flex",
      justifyContent: "space-between",
      fontSize: 13,
      color: theme.lightGray,
      marginBottom: 12,
    },
    summaryTotal: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 16,
      marginTop: 4,
      borderTop: `1px solid ${theme.hairline}`,
      fontSize: 15,
      color: "#fff",
    },
    totalAmount: { ...strongText, fontSize: 18 },

    checkoutBtn: {
      ...btnSolid,
      width: "100%",
      marginTop: 18,
      padding: "14px 0",
      justifyContent: "center",
      fontSize: 13,
      letterSpacing: "0.14em",
    },
    continueBtn: {
      ...btnGhost,
      width: "100%",
      marginTop: 10,
      padding: "13px 0",
      justifyContent: "center",
      fontSize: 12,
    },

    shippingNote: {
      marginTop: 14,
      fontSize: 11,
      color: theme.muted,
      textAlign: "center",
      letterSpacing: "0.06em",
    },

    // ── Footer ────────────────────────────────────────────────────────────
    footer: {
      padding: `44px ${theme.pad}px 32px`,
      borderTop: `1px solid ${theme.hairline}`,
      background: theme.ink2,
      marginTop: 80,
    },
    footBrand: { display: "flex", flexDirection: "column", gap: 6, marginBottom: 34 },
    // TODO: swap for the real MT/ECG logo asset once provided — text treatment is a placeholder
    footMt: { ...strongText, fontFamily: theme.fontDisplay, fontSize: 26, fontWeight: 700, lineHeight: 1 },
    footCols: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 28, marginBottom: 32 },
    footCol: { display: "flex", flexDirection: "column", gap: 9 },
    footHead: {
      margin: "0 0 4px", fontSize: 10, fontWeight: 500,
      letterSpacing: "0.28em", textTransform: "uppercase", color: theme.lightGray,
    },
    footLink: { fontSize: 13, color: theme.lightGray },
    footContact: {
      display: "flex", flexDirection: "column", gap: 6,
      paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.06)",
    },
    footText: { margin: 0, fontSize: 13, color: theme.lightGray },
    legal: { margin: "28px 0 0", fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: theme.muted },
  };

  // ── Empty cart ──────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <main style={s.page}>
        <div style={s.pageHead}>
          <span style={label}>Your bag</span>
          <h1 style={s.pageTitle}>Cart</h1>
        </div>
        <PulseDivider />
        <div style={s.empty}>
          <h2 style={s.emptyTitle}>Your cart is empty</h2>
          <p style={s.emptyText}>Add some scrubs and come back here.</p>
          <a href="/men" style={{ ...btnSolid, paddingInline: 32 }}>Shop men</a>
          {"  "}
          <a href="/women" style={{ ...btnGhost, paddingInline: 32, marginLeft: 10 }}>Shop women</a>
        </div>

        <footer style={s.footer}>
          <div style={s.footBrand}>
            <span style={s.footMt}>MT</span>
            <span style={label}>Medical Wear</span>
          </div>
          <div style={s.footCols}>
            <div style={s.footCol}>
              <h3 style={s.footHead}>Shop</h3>
              <a href="/men" style={s.footLink}>Men</a>
              <a href="/women" style={s.footLink}>Women</a>
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

  // ── Cart with items ─────────────────────────────────────────────────────
  return (
    <main style={s.page}>
      {/* Page header */}
      <div style={s.pageHead}>
        <span style={label}>Your bag</span>
        <h1 style={s.pageTitle}>Cart</h1>
        <p style={s.itemCount}>{totalItems} {totalItems === 1 ? "item" : "items"}</p>
      </div>

      <PulseDivider />

      <div style={s.layout}>

        {/* ── Left: items ── */}
        <div style={s.itemsList}>
          {items.map((item) => (
            <div key={`${item.id}__${item.size}__${item.color}`} style={s.itemCard}>
              <img src={item.image} alt={item.name} style={s.itemImage} />

              <div style={s.itemInfo}>
                <p style={s.itemName}>{item.name}</p>
                <span style={s.itemMeta}>
                  {item.size && `Size: ${item.size}`}
                  {item.size && item.color && " · "}
                  {item.color && `Color: ${item.color}`}
                </span>

                <div style={s.qtyRow}>
                  <button
                    style={s.qtyBtn}
                    onClick={() => updateQty(item.id, item.size, item.color, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span style={s.qtyNum}>{item.quantity}</span>
                  <button
                    style={s.qtyBtn}
                    onClick={() => updateQty(item.id, item.size, item.color, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <span style={s.itemPrice}>
                  EGP {(item.price * item.quantity).toLocaleString()}
                </span>

                <button
                  style={s.removeBtn}
                  onClick={() => removeItem(item.id, item.size, item.color)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Right: summary ── */}
        <div style={s.summary}>
          <p style={s.summaryTitle}>Order summary</p>

          <div style={s.summaryRow}>
            <span>Subtotal ({totalItems} items)</span>
            <span>EGP {totalPrice.toLocaleString()}</span>
          </div>
          <div style={s.summaryRow}>
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>

          <div style={s.summaryTotal}>
            <span>Total</span>
            <span style={s.totalAmount}>EGP {totalPrice.toLocaleString()}</span>
          </div>

          <button
            style={s.checkoutBtn}
            onClick={() => navigate("/checkout")}
          >
            Proceed to checkout
          </button>

          <a href="/men" style={s.continueBtn}>← Continue shopping</a>

          <p style={s.shippingNote}>Free delivery on orders over EGP 500</p>
        </div>

      </div>

      {/* Footer */}
      <footer style={s.footer}>
        <div style={s.footBrand}>
          <span style={s.footMt}>MT</span>
          <span style={label}>Medical Wear</span>
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
          <a href="mailto:hello@medtrack.com" style={s.footLink}>hello@medtrack.com</a>
        </div>
        <p style={s.legal}>© 2026 MedTrack</p>
      </footer>
    </main>
  );
}