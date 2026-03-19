"use client";

import { Moon, Sun } from "lucide-react";
import * as React from "react";

import { useTheme } from "~/components/theme-provider";
import { Button } from "~/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Button variant="outline" size="icon" className="size-9" />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
      className="size-9 cursor-pointer"
    >
      {isDark ? (
        <Sun className="animate-in fade-in zoom-in-50 size-4" />
      ) : (
        <Moon className="animate-in fade-in zoom-in-50 size-4" />
      )}
    </Button>
  );
}
