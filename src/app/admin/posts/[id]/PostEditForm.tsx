"use client";

import Link from "next/link";
import { type FormEvent, useState, useTransition } from "react";

import { Button } from "~/components/ui/button";
import { CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

import { updatePost } from "./actions";

type PostEditFormProps = {
  post: {
    id: string;
    title: string;
    slug: string;
    content: string;
    image: string | null;
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
          <Input id="title" name="title" required defaultValue={post.title} />
        </div>

        <div className="grid gap-2">
          <label htmlFor="slug" className="text-sm font-medium">
            Slug
          </label>
          <Input id="slug" name="slug" required defaultValue={post.slug} />
        </div>

        <div className="grid gap-2">
          <label htmlFor="content" className="text-sm font-medium">
            Contenu
          </label>
          <Textarea id="content" name="content" required defaultValue={post.content} />
        </div>

        <div className="grid gap-2">
          <label htmlFor="image" className="text-sm font-medium">
            Image (URL)
          </label>
          <Input id="image" name="image" type="url" defaultValue={post.image ?? ""} />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="published"
            name="published"
            type="checkbox"
            className="border-input h-4 w-4 rounded border"
            defaultChecked={post.published}
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
