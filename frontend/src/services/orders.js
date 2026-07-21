import { api } from "./api";

export function createOrder({ items, shipping, paymentMethod }) {
  return api.post("/orders", { items, shipping, paymentMethod });
}

export function getMyOrders() {
  return api.get("/orders/mine");
}
