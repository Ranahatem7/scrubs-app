import { images } from "./images";

// Category rail furniture (name/note/image) — there's no categories
// endpoint on the backend, so this stays hardcoded. Actual products now
// come from the API; see src/services/products.js and src/hooks/useProducts.js.

export const categories = [
  { id: "tops", name: "Tops", note: "Four-way stretch", image: images.category.tops },
  { id: "pants", name: "Pants", note: "Ten pockets", image: images.category.pants },
  { id: "full-scrub", name: "Full Scrub", note: "Matched sets", image: images.category.fullScrub },
  { id: "lab-coats", name: "Lab Coats", note: "Tailored fit", image: images.category.labCoats },
];

export const formatPrice = (value) => `LE ${value.toLocaleString("en-EG")}`;