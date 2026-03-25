"use client";

import { useEffect, useMemo, useState } from "react";

type TypingTextProps = {
  text?: string;
  words?: string[];
  speed?: number;
  startDelay?: number;
  cycleDelay?: number;
  deleteSpeed?: number;
  loop?: boolean;
  className?: string;
  showCursor?: boolean;
};

export function TypingText({
  text,
  words,
  speed = 38,
  startDelay: _startDelay = 300,
  cycleDelay = 1200,
  deleteSpeed = 22,
  loop = true,
  className,
  showCursor = true,
}: TypingTextProps) {
  const wordList = useMemo(
    () => (words && words.length > 0 ? words : text ? [text] : []),
    [text, words],
  );
  const [wordIndex, setWordIndex] = useState(0);
  const [count, setCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const fullText = wordList[wordIndex] ?? "";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefersReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setCount(fullText.length);
      return;
    }

    let timeoutId: number | undefined;

    if (!isDeleting && count < fullText.length) {
      timeoutId = window.setTimeout(
        () => setCount(count + 1),
        speed + Math.random() * 30,
      );
    } else if (!isDeleting && count === fullText.length) {
      if (wordList.length > 1 && loop) {
        timeoutId = window.setTimeout(() => setIsDeleting(true), cycleDelay);
      }
    } else if (isDeleting && count > 0) {
      timeoutId = window.setTimeout(
        () => setCount(count - 1),
        deleteSpeed + Math.random() * 20,
      );
    } else if (isDeleting && count === 0) {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % wordList.length);
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [
    count,
    cycleDelay,
    deleteSpeed,
    fullText.length,
    isDeleting,
    loop,
    prefersReducedMotion,
    speed,
    wordList.length,
  ]);

  const visibleText = fullText.slice(0, count);
  const maxLength = useMemo(
    () => (wordList.length ? Math.max(...wordList.map((w) => w.length)) : 0),
    [wordList],
  );

  return (
    <span
      className={`typing-text ${className ?? ""}`}
      style={maxLength ? { minWidth: `${maxLength}ch` } : undefined}
    >
      <span aria-hidden="true">
        {visibleText}
        {showCursor ? <span className="typing-cursor">|</span> : null}
      </span>
      <span className="sr-only">{fullText}</span>
    </span>
  );
}
