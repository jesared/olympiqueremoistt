"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState, useTransition } from "react";
import { CalendarDays, CheckCircle2, Info, Loader2, Sparkles, User } from "lucide-react";

import RichTextEditor from "~/components/RichTextEditor";
import { ImageUpload } from "~/components/ImageUpload";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { slugify } from "~/lib/slug";
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
    createdAt: Date;
    updatedAt: Date;
    author: {
      name: string | null;
    };
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

const FALLBACK_CONTENT =
  "<p>Commencez à rédiger votre actualité pour voir l’aperçu.</p>";

export function PostEditForm({ post }: PostEditFormProps) {
  const [toast, setToast] = useState<ToastState>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [title, setTitle] = useState(post.title);
  const [slug, setSlug] = useState(post.slug);
  const [content, setContent] = useState(post.content);
  const [imageUrl, setImageUrl] = useState(post.imageUrl ?? "");
  const [published, setPublished] = useState(post.published);
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    [],
  );

  const updatedAtLabel = dateFormatter.format(post.updatedAt);
  const createdAtLabel = dateFormatter.format(post.createdAt);

  useEffect(() => {
    if (!statusMessage) return;

    const timeout = window.setTimeout(() => setStatusMessage(null), 2000);
    return () => window.clearTimeout(timeout);
  }, [statusMessage]);

  const showToast = (nextToast: ToastState) => {
    setToast(nextToast);
    window.setTimeout(() => setToast(null), 2500);
  };

  const handleSave = (formData: FormData) => {
    setStatusMessage("Saving...");

    startTransition(async () => {
      const result = await updatePost(post.id, formData);

      if (result.success) {
        setStatusMessage("Sauvegardé");
        showToast({ message: "Actualité sauvegardée.", kind: "success" });
        return;
      }

      const errorMessage =
        ERROR_MESSAGES[result.error ?? "unknown"] ??
        "Impossible de sauvegarder cette actualité.";

      setStatusMessage(null);
      showToast({
        kind: "error",
        message: errorMessage,
      });
    });
  };

  const onSubmit = (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();
    const formData = new FormData(submitEvent.currentTarget);
    handleSave(formData);
  };

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Éditeur d’actualité</p>
          <h1 className="text-2xl font-semibold tracking-tight">Modifier une actualité</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-muted inline-flex rounded-lg p-1">
            <Button
              type="button"
              size="sm"
              variant={mode === "edit" ? "default" : "ghost"}
              onClick={() => setMode("edit")}
            >
              Edit
            </Button>
            <Button
              type="button"
              size="sm"
              variant={mode === "preview" ? "default" : "ghost"}
              onClick={() => setMode("preview")}
            >
              Aperçu
            </Button>
          </div>

          <Badge variant={published ? "default" : "secondary"}>
            {published ? "Publié" : "Draft"}
          </Badge>

          <Button asChild variant="outline" disabled={isPending}>
            <Link href="/admin/posts">Retour</Link>
          </Button>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Sauvegarde..." : "Sauvegarder"}
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="mx-auto w-full max-w-3xl flex-1 space-y-6">
          <div className="relative overflow-hidden rounded-2xl border bg-muted/20">
            <div className="aspect-video w-full">
              {imageUrl.trim() ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={title.trim() || "Image d’actualité"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                  Ajoutez une image de couverture 16:9
                </div>
              )}
            </div>

            <div className="absolute right-3 bottom-3 flex gap-2">
              <label className="sr-only" htmlFor="image-url-input">
                URL de l’image
              </label>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => document.getElementById("image-url-input")?.focus()}
              >
                Changer
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setImageUrl("")}
              >
                Supprimer
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <input
              id="title"
              name="title"
              required
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Titre de votre actualité"
              className="w-full bg-transparent text-3xl font-bold outline-none placeholder:text-muted-foreground/70"
            />
          </div>

          {mode === "edit" ? (
            <div className="space-y-0">
              <input type="hidden" name="content" value={content} required />
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Commencez à écrire votre actualité..."
                toolbarClassName="sticky top-0 z-10 -mx-4 rounded-none border-x-0 bg-background/95 px-4 py-3 backdrop-blur"
                contentClassName="min-h-[420px] px-0 py-10 text-base"
                className="rounded-none"
              />
            </div>
          ) : (
            <article className="prose dark:prose-invert max-w-none rounded-2xl border p-6 md:p-8">
              <h1>{title.trim() || "Titre de votre actualité"}</h1>
              <div dangerouslySetInnerHTML={{ __html: content.trim() || FALLBACK_CONTENT }} />
            </article>
          )}
        </div>

        <aside className="w-full lg:w-80">
          <div className="space-y-6 lg:sticky lg:top-6">
            <Card>
              <CardHeader>
                <CardTitle>Publication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Statut</span>
                  <Badge variant={published ? "default" : "secondary"}>
                    {published ? "Publié" : "Draft"}
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="published"
                    checked={published}
                    onCheckedChange={(checked) => setPublished(checked === true)}
                  />
                  <label htmlFor="published" className="text-sm font-medium">
                    Publier maintenant
                  </label>
                </div>

                <input type="hidden" name="published" value={published ? "on" : "off"} />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending ? "Saving..." : "Sauvegarder"}
                </Button>

                <p className="text-muted-foreground flex items-center gap-2 text-xs">
                  {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  {statusMessage ?? "Les modifications sont enregistrées manuellement."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Slug</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input id="slug" name="slug" required value={slug} onChange={(event) => setSlug(event.target.value)} />
                <Button type="button" variant="outline" className="w-full gap-2" onClick={() => setSlug(slugify(title))}>
                  <Sparkles className="h-4 w-4" />
                  Auto-générer
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Infos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <p className="text-muted-foreground flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Créé le {createdAtLabel}
                </p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Mis à jour le {updatedAtLabel}
                </p>
                <p className="text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {post.author.name ? `Auteur: ${post.author.name}` : "Auteur non renseigné"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ImageUpload
                  value={imageUrl}
                  uploadImage={uploadImage}
                  onUploaded={(url) => setImageUrl(url)}
                />
                <Input
                  id="image-url-input"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(event) => setImageUrl(event.target.value)}
                />
                <input type="hidden" name="imageUrl" value={imageUrl} />
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>

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
    </form>
  );
}
