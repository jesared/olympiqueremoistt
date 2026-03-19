"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "~/components/ui/button";
import { useTheme } from "~/components/theme-provider";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <Button
      variant="outline"
      size="icon"
      className="border-border bg-background/70 text-foreground hover:bg-muted relative backdrop-blur transition-colors"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Activer le mode clair" : "Activer le mode sombre"}
    >
      <Sun
        className="size-[1.15rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
        aria-hidden="true"
      />
      <Moon
        className="absolute size-[1.15rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
        aria-hidden="true"
      />
      <span className="sr-only">Changer le thème</span>
    </Button>
  );
}
