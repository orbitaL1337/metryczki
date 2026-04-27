"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "site_visit_counter_v1";

export default function VisitCounter() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    try {
      const currentRaw = window.localStorage.getItem(STORAGE_KEY);
      const current = Number.parseInt(currentRaw ?? "0", 10);
      const next = Number.isFinite(current) && current > 0 ? current + 1 : 1;

      window.localStorage.setItem(STORAGE_KEY, String(next));
      setCount(next);
    } catch {
      setCount(null);
    }
  }, []);

  if (count === null) {
    return <span>Licznik odwiedzin: --</span>;
  }

  return <span>Licznik odwiedzin: {count}</span>;
}