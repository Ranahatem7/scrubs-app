import { images } from "./images";

// Placeholder data. Once the Express/MongoDB server is running,
// this gets replaced by a fetch in src/services/api.js.

export const categories = [
  { id: "tops", name: "Tops", note: "Four-way stretch", image: images.category.tops },
  { id: "pants", name: "Pants", note: "Ten pockets", image: images.category.pants },
  { id: "full-scrub", name: "Full Scrub", note: "Matched sets", image: images.category.fullScrub },
  { id: "lab-coats", name: "Lab Coats", note: "Tailored fit", image: images.category.labCoats },
];

export const products = [
  {
    id: "mt-top-graphite",
    name: "Graphite Top",
    fit: "Men · Slim",
    price: 950,
    tone: "#3a3f45",
    image: images.product.graphiteTop,
  },
  {
    id: "mt-top-midnight",
    name: "Midnight Top",
    fit: "Women · Classic",
    price: 950,
    tone: "#242c3a",
    image: images.product.midnightTop,
  },
  {
    id: "mt-pant-onyx",
    name: "Onyx Jogger Pant",
    fit: "Unisex · Tapered",
    price: 1100,
    tone: "#22242a",
    image: images.product.onyxPant,
  },
  {
    id: "mt-coat-bone",
    name: "Bone Lab Coat",
    fit: "Unisex · Tailored",
    price: 1450,
    tone: "#4a453d",
    image: images.product.boneLabCoat,
  },
];

export const formatPrice = (value) => `LE ${value.toLocaleString("en-EG")}`;