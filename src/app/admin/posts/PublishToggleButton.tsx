"use client";

import { useState, useTransition } from "react";

import { togglePublishPost } from "~/app/admin/posts/actions";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";

type PublishToggleButtonProps = {
  postId: string;
  initialPublished: boolean;
};

export function PublishToggleButton({
  postId,
  initialPublished,
}: PublishToggleButtonProps) {
  const [isPublished, setIsPublished] = useState(initialPublished);
  const [isPending, startTransition] = useTransition();

  const onToggle = () => {
    const nextPublished = !isPublished;
    setIsPublished(nextPublished);

    startTransition(async () => {
      try {
        const result = await togglePublishPost(postId);
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
