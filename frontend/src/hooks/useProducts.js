import { useCallback, useEffect, useState } from "react";
import { getProducts } from "../services/products";

/** Fetches /api/products and exposes loading/error/retry alongside the data. */
export default function useProducts(params = {}) {
  const paramsKey = JSON.stringify(params);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    getProducts(JSON.parse(paramsKey))
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [paramsKey, reloadKey]);

  const retry = useCallback(() => setReloadKey((k) => k + 1), []);

  return { products, loading, error, retry };
}
