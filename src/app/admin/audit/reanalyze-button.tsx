"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { RotateCw } from "lucide-react";

import { Button } from "~/components/ui/button";

export function ReanalyzeButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  return (
    <Button
      variant="outline"
      onClick={() => {
        setIsRefreshing(true);
        router.refresh();
        setTimeout(() => setIsRefreshing(false), 500);
      }}
      disabled={isRefreshing}
    >
      <RotateCw className={isRefreshing ? "animate-spin" : ""} />
      {isRefreshing ? "Analyse en cours..." : "Re-analyser"}
    </Button>
  );
}
