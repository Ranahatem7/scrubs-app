import { api } from "./api";

// params: { category, gender, featured }
export function getProducts(params = {}) {
  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ).toString();
  return api.get(`/products${query ? `?${query}` : ""}`);
}

export function getProductBySlug(slug) {
  return api.get(`/products/${encodeURIComponent(slug)}`);
}
