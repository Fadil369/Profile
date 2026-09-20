import { useState, useEffect, useRef, useCallback } from "react";

interface CountUpOptions {
  end: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  trigger?: boolean;
}

export function useCountUp({
  end,
  duration = 2000,
  decimals = 0,
  suffix = "",
  trigger = true,
}: CountUpOptions) {
  const [displayValue, setDisplayValue] = useState<string>("0");
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();

  const formatNumber = useCallback(
    (value: number, dec: number, suf: string) => {
      if (dec > 0) {
        return `${value.toFixed(dec)}${suf}`;
      }
      return `${Math.round(value).toLocaleString()}${suf}`;
    },
    []
  );

  const animate = useCallback(
    (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = end * eased;
      setDisplayValue(formatNumber(current, decimals, suffix));
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    },
    [end, duration, decimals, suffix, formatNumber]
  );

  useEffect(() => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    if (!trigger) {
      setDisplayValue("0");
      return;
    }
    startTimeRef.current = undefined;
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [end, trigger, duration, decimals, suffix, animate]);

  return displayValue;
}
