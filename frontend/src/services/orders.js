import { api } from "./api";

export function createOrder({ items, shipping, paymentMethod, shippingFee, discountAmount, discountCode }) {
  return api.post("/orders", { items, shipping, paymentMethod, shippingFee, discountAmount, discountCode });
}

export function getMyOrders() {
  return api.get("/orders/mine");
}