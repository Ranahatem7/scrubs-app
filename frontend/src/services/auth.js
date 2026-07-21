import { api } from "./api";

export function register(name, email, password) {
  return api.post("/auth/register", { name, email, password });
}

export function login(email, password) {
  return api.post("/auth/login", { email, password });
}

export function getMe() {
  return api.get("/auth/me");
}
