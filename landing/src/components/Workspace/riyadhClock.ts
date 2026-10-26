import { useEffect, useState } from "react";

export type DayPhase = "night" | "dawn" | "day" | "dusk";

/** Riyadh is UTC+3 all year (no daylight saving). `?hour=21.5` previews another time of day. */
export function riyadhHour(date = new Date()) {
  const forced = typeof location !== "undefined" ? parseFloat(new URLSearchParams(location.search).get("hour") ?? "") : NaN;
  if (forced >= 0 && forced < 24) return forced;
  return (date.getUTCHours() + 3 + date.getUTCMinutes() / 60) % 24;
}

export function dayPhase(h: number): DayPhase {
  if (h >= 5 && h < 6.75) return "dawn";
  if (h >= 6.75 && h < 17) return "day";
  if (h >= 17 && h < 18.75) return "dusk";
  return "night";
}

export function useRiyadhClock() {
  const [hour, setHour] = useState(() => riyadhHour());
  useEffect(() => {
    const id = window.setInterval(() => setHour(riyadhHour()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  return { hour, phase: dayPhase(hour) };
}
