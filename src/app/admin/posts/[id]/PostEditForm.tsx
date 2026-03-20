"use client";

import Link from "next/link";
import { type FormEvent, useState, useTransition } from "react";

import { PostEditorPanel } from "~/components/admin/post-editor-panel";
import { ImageUpload } from "~/components/ImageUpload";
import { Button } from "~/components/ui/button";
import { CardContent } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { uploadImage } from "~/lib/supabase";

import { updatePost } from "./actions";

type PostEditFormProps = {
  post: {
    id: string;
    title: string;
    slug: string;
    content: string;
    imageUrl: string | null;
    published: boolean;
  };
};

type ToastState = {
  message: string;
  kind: "success" | "error";
} | null;

const ERROR_MESSAGES: Record<string, string> = {
  "missing-fields": "Veuillez remplir tous les champs obligatoires.",
  "invalid-image": "L'URL de l'image est invalide.",
  "slug-already-used": "Ce slug est déjà utilisé par une autre actualité.",
  unknown: "Impossible de sauvegarder cette actualité.",
};

export function PostEditForm({ post }: PostEditFormProps) {
  const [toast, setToast] = useState<ToastState>(null);
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [imageUrl, setImageUrl] = useState(post.imageUrl ?? "");
  const [published, setPublished] = useState(post.published);

  const showToast = (nextToast: ToastState) => {
    setToast(nextToast);
    window.setTimeout(() => setToast(null), 2500);
  };

  const onSubmit = (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();

    const formData = new FormData(submitEvent.currentTarget);

    startTransition(async () => {
      const result = await updatePost(post.id, formData);

      if (result.success) {
        showToast({ message: "Actualité sauvegardée.", kind: "success" });
        return;
      }

      const errorMessage =
        ERROR_MESSAGES[result.error ?? "unknown"] ??
        "Impossible de sauvegarder cette actualité.";

      showToast({
        kind: "error",
        message: errorMessage,
      });
    });
  };

  return (
    <CardContent>
      <form className="space-y-4" onSubmit={onSubmit}>
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

        <div className="grid gap-2">
          <label htmlFor="slug" className="text-sm font-medium">
            Slug
          </label>
          <Input id="slug" name="slug" required defaultValue={post.slug} />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Image</label>
          <ImageUpload
            value={imageUrl}
            uploadImage={uploadImage}
            onUploaded={(url) => setImageUrl(url)}
          />
          <input type="hidden" name="imageUrl" value={imageUrl} />
        </div>

        <div className="grid gap-2">
          <label htmlFor="content-editor" className="text-sm font-medium">
            Contenu
          </label>
          <input type="hidden" name="content" value={content} required />
          <PostEditorPanel
            title={title}
            image={imageUrl}
            content={content}
            onContentChange={setContent}
          />
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="published"
            checked={published}
            onCheckedChange={(checked) => setPublished(checked === true)}
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
          <Button type="submit" disabled={isPending}>
            {isPending ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
          <Button asChild variant="outline" disabled={isPending}>
            <Link href="/admin/posts">Retour</Link>
          </Button>
        </div>
      </form>

      {toast ? (
        <div
          role="status"
          className={`fixed right-4 bottom-4 z-50 rounded-md border px-4 py-2 text-sm shadow-lg ${
            toast.kind === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200"
              : "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-200"
          }`}
        >
          {toast.message}
        </div>
      ) : null}
    </CardContent>
  );
}
