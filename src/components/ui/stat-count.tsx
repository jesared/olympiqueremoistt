"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type StatCountProps = {
  value: string;
  durationMs?: number;
  className?: string;
};

const numberRegex = /(\d+)/g;
const isNumberToken = (token: string) => /^\d+$/.test(token);

export function StatCount({ value, durationMs = 900, className }: StatCountProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const tokens = useMemo(
    () => value.split(numberRegex).filter((token) => token.length > 0),
    [value],
  );
  const numbers = useMemo(
    () =>
      tokens
        .filter((token) => isNumberToken(token))
        .map((match) => Number.parseInt(match, 10)),
    [tokens],
  );
  const [current, setCurrent] = useState<number[]>(() => numbers.map(() => 0));

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!ref.current || hasStarted) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasStarted(true);
          }
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    if (prefersReducedMotion) {
      setCurrent(numbers);
      return;
    }

    let start: number | null = null;
    let frameId: number;

    const animate = (timestamp: number) => {
      if (start === null) start = timestamp;
      const progress = Math.min((timestamp - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);

      setCurrent(numbers.map((n) => Math.round(n * eased)));

      if (progress < 1) {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [durationMs, hasStarted, numbers, prefersReducedMotion]);

  if (numbers.length === 0) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {tokens.map((token, index) => {
        if (!isNumberToken(token)) {
          return <span key={`t-${index}`}>{token}</span>;
        }
        const numberIndex =
          tokens.slice(0, index + 1).filter(isNumberToken).length - 1;
        const animated = current[numberIndex] ?? 0;
        return <span key={`n-${index}`}>{animated}</span>;
      })}
    </span>
  );
}
