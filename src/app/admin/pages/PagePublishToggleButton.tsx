"use client";

import { useState, useTransition } from "react";

import { togglePublishPage } from "~/app/admin/pages/actions";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

type PagePublishToggleButtonProps = {
  pageId: string;
  initialPublished: boolean;
};

export function PagePublishToggleButton({
  pageId,
  initialPublished,
}: PagePublishToggleButtonProps) {
  const [isPublished, setIsPublished] = useState(initialPublished);
  const [isPending, startTransition] = useTransition();

  const onToggle = () => {
    const nextPublished = !isPublished;
    setIsPublished(nextPublished);

    startTransition(async () => {
      try {
        const result = await togglePublishPage(pageId);
        setIsPublished(result.published);
      } catch {
        setIsPublished(!nextPublished);
      }
    });
  };

  return (
    <div className="flex items-center justify-end gap-2">
      <Badge variant={isPublished ? "success" : "outline"}>
        {isPublished ? "Publié" : "Brouillon"}
      </Badge>
      <Button size="sm" variant="outline" onClick={onToggle} disabled={isPending}>
        {isPending
          ? "Mise à jour..."
          : isPublished
            ? "Passer en brouillon"
            : "Publier"}
      </Button>
    </div>
  );
}
