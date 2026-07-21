require("dotenv").config();
const fs = require("fs/promises");
const path = require("path");
const { pathToFileURL } = require("url");
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Product = require("../models/Product");

const FRONTEND_DATA_DIR = path.resolve(__dirname, "../../frontend/src/data");
const TMP_DIR = path.resolve(__dirname, ".tmp");

const CATEGORY_BY_ID_PREFIX = [
  { prefix: "mt-top-", category: "tops" },
  { prefix: "mt-pant-", category: "pants" },
  { prefix: "mt-coat-", category: "lab-coats" },
  { prefix: "mt-set-", category: "full-scrub" },
];

function categoryFromId(id) {
  return CATEGORY_BY_ID_PREFIX.find((c) => id.startsWith(c.prefix))?.category || "tops";
}

function genderFromFit(fit = "") {
  const genderPart = fit.split("·")[0]?.trim().toLowerCase();
  if (genderPart === "men") return "men";
  if (genderPart === "women") return "women";
  return "unisex";
}

// frontend/src/data/products.js and images.js are plain ES modules (no JSX,
// no bundler-only syntax) but products.js imports "./images" without an
// extension, which Node's native ESM loader won't resolve. Rather than pull
// in a build tool just to seed data, copy both files into a throwaway
// directory here (inside server/, never touching frontend/) with the
// extension fixed, import them, then delete the copies.
async function loadFrontendProducts() {
  await fs.mkdir(TMP_DIR, { recursive: true });

  // .mjs (not .js) so Node treats them as ESM regardless of server/package.json's
  // CommonJS "type" — the source files use `export const`, not `module.exports`.
  const imagesSrc = await fs.readFile(path.join(FRONTEND_DATA_DIR, "images.js"), "utf8");
  const productsSrc = (
    await fs.readFile(path.join(FRONTEND_DATA_DIR, "products.js"), "utf8")
  ).replace('from "./images"', 'from "./images.mjs"');

  await fs.writeFile(path.join(TMP_DIR, "images.mjs"), imagesSrc);
  await fs.writeFile(path.join(TMP_DIR, "products.mjs"), productsSrc);

  const mod = await import(pathToFileURL(path.join(TMP_DIR, "products.mjs")).href);
  return mod.products;
}

async function seed() {
  await connectDB();
  const products = await loadFrontendProducts();

  const docs = products.map((p) => ({
    name: p.name,
    slug: p.id,
    description: "",
    price: p.price,
    category: categoryFromId(p.id),
    gender: genderFromFit(p.fit),
    fit: p.fit || "",
    sizes: ["S", "M", "L", "XL"],
    colors: [],
    images: p.image ? [p.image] : [],
    tone: p.tone || "#3a3f45",
    stock: 50,
    featured: false,
  }));

  for (const doc of docs) {
    await Product.findOneAndUpdate({ slug: doc.slug }, doc, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      runValidators: true,
    });
    console.log(`Upserted: ${doc.slug}`);
  }

  console.log(`Seeded ${docs.length} products.`);
}

seed()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await fs.rm(TMP_DIR, { recursive: true, force: true });
    await mongoose.disconnect();
  });
