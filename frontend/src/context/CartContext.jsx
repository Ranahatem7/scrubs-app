import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "medtrack_cart";

/**
 * Wrap your app with <CartProvider> to give every page access to the cart.
 * Each cart item has the shape:
 *   { id, name, price, image, size, color, quantity }
 * The key that identifies a unique line item is id + size + color,
 * so the same product in two different sizes = two separate lines.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // ── Helpers ────────────────────────────────────────────────────────────
  const lineKey = (id, size, color) => `${id}__${size}__${color}`;

  const addItem = (product, size, color, qty = 1) => {
    const key = lineKey(product._id, size, color);
    setItems((prev) => {
      const existing = prev.find((i) => lineKey(i.id, i.size, i.color) === key);
      if (existing) {
        return prev.map((i) =>
          lineKey(i.id, i.size, i.color) === key
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [
        ...prev,
        {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.images?.[0],
          size,
          color,
          quantity: qty,
        },
      ];
    });
  };

  const removeItem = (id, size, color) => {
    const key = lineKey(id, size, color);
    setItems((prev) => prev.filter((i) => lineKey(i.id, i.size, i.color) !== key));
  };

  const updateQty = (id, size, color, qty) => {
    if (qty < 1) { removeItem(id, size, color); return; }
    const key = lineKey(id, size, color);
    setItems((prev) =>
      prev.map((i) =>
        lineKey(i.id, i.size, i.color) === key ? { ...i, quantity: qty } : i
      )
    );
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

/** Use this hook in any component to access the cart. */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}