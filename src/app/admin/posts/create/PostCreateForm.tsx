"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { PostEditorPanel } from "~/components/admin/post-editor-panel";
import { ImageUpload } from "~/components/ImageUpload";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { uploadImage } from "~/lib/supabase";

const DRAFT_KEY = "post-create-draft";

type PostCreateFormProps = {
  action: (data: FormData) => Promise<void>;
};

export function PostCreateForm({ action }: PostCreateFormProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [published, setPublished] = useState(false);

  useEffect(() => {
    const rawDraft = localStorage.getItem(DRAFT_KEY);

    if (!rawDraft) {
      return;
    }

    try {
      const parsedDraft = JSON.parse(rawDraft) as {
        title?: string;
        content?: string;
        image?: string;
        published?: boolean;
      };

      setTitle(parsedDraft.title ?? "");
      setContent(parsedDraft.content ?? "");
      setImage(parsedDraft.image ?? "");
      setPublished(parsedDraft.published ?? false);
    } catch {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, []);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({
          title,
          content,
          image,
          published,
        }),
      );
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [title, content, image, published]);

  const onPublishedChange = (checked: boolean | "indeterminate") => {
    setPublished(checked === true);
  };

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-2">
        <label htmlFor="title" className="text-sm font-medium">
          Titre
        </label>
        <Input
          id="title"
          name="title"
          required
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
      </div>

      <p className="text-muted-foreground text-xs">
        Le slug est généré automatiquement à partir du titre.
      </p>

      <div className="grid gap-2">
        <label className="text-sm font-medium">Image</label>
        <ImageUpload
          value={image}
          uploadImage={uploadImage}
          onUploaded={setImage}
        />
        <input type="hidden" name="image" value={image} />
      </div>

      <div className="grid gap-2">
        <label htmlFor="content-editor" className="text-sm font-medium">
          Contenu
        </label>
        <input type="hidden" name="content" value={content} required />
        <PostEditorPanel
          title={title}
          image={image}
          content={content}
          onContentChange={setContent}
        />
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="published"
          checked={published}
          onCheckedChange={onPublishedChange}
        />
        <input
          type="hidden"
          name="published"
          value={published ? "on" : "off"}
        />
        <label htmlFor="published" className="text-sm font-medium">
          Publier maintenant
        </label>
      </div>

      <div className="flex gap-2">
        <Button type="submit">Créer</Button>
        <Button asChild variant="outline">
          <Link href="/admin/posts">Annuler</Link>
        </Button>
      </div>
    </form>
  );
}
