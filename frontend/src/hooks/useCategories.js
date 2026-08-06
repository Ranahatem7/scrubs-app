import { useEffect, useState } from "react";

export default function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   fetch(`${import.meta.env.VITE_API_URL}/admin/categories/public`)
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return { categories, loading };
}