"use client";

import { Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState, useTransition } from "react";

import {
  createPostAction,
  updatePostAction,
} from "~/app/admin/posts/editor-actions";
import { ImageUpload } from "~/components/ImageUpload";
import RichTextEditor from "~/components/RichTextEditor";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { slugify } from "~/lib/slug";
import { uploadImage } from "~/lib/supabase";

type PostEditorPageProps = {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    content: string;
    imageUrl?: string;
    published?: boolean;
    categoryId?: string;
  };
  categories: Array<{ id: string; name: string }>;
  mode: "create" | "edit";
};

const FALLBACK_CONTENT =
  "<p>Commencez à rédiger votre actualité pour voir l’aperçu.</p>";

const ERROR_MESSAGES: Record<PostError, string> = {
  "missing-fields": "Veuillez remplir tous les champs obligatoires.",
  "invalid-image": "L'URL de l'image est invalide.",
  "slug-already-used": "Ce slug est déjà utilisé par une autre actualité.",
  unknown: "Impossible de sauvegarder cette actualité.",
};

export function PostEditorPage({
  initialData,
  categories,
  mode,
}: PostEditorPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [viewMode, setViewMode] = useState<"edit" | "preview">("edit");
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl ?? "");
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [feedback, setFeedback] = useState<string | null>(null);

  const titleLabel =
    mode === "create" ? "Créer une actualité" : "Modifier une actualité";
  const submitLabel = mode === "create" ? "Créer" : "Mettre à jour";

  const previewDate = useMemo(
    () =>
      new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }).format(new Date()),
    [],
  );

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback(null);

    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result =
        mode === "create"
          ? await createPostAction(formData)
          : await updatePostAction(initialData?.id ?? "", formData);

      if (result.success) {
        router.push("/admin/posts");
        router.refresh();
        return;
      }

      setFeedback(ERROR_MESSAGES[result.error ?? "unknown"] ?? null);
    });
  };

  return (
    <form className="space-y-6" onSubmit={onSubmit}>
      <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Éditeur d’actualité</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {titleLabel}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-muted inline-flex rounded-lg p-1">
            <Button
              type="button"
              size="sm"
              variant={viewMode === "edit" ? "default" : "ghost"}
              onClick={() => setViewMode("edit")}
            >
              Éditer
            </Button>
            <Button
              type="button"
              size="sm"
              variant={viewMode === "preview" ? "default" : "ghost"}
              onClick={() => setViewMode("preview")}
            >
              Aperçu
            </Button>
          </div>

          <Badge variant={published ? "default" : "secondary"}>
            {published ? "Publié" : "Brouillon"}
          </Badge>

          <Button asChild variant="outline" disabled={isPending}>
            <Link href="/admin/posts">Retour</Link>
          </Button>

          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              submitLabel
            )}
          </Button>
        </div>
      </div>

      {feedback ? (
        <p className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-3 text-sm">
          {feedback}
        </p>
      ) : null}

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="mx-auto w-full max-w-3xl flex-1 space-y-6">
          <div className="bg-muted/20 relative overflow-hidden rounded-2xl border">
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
          </div>

          <input
            id="title"
            name="title"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Titre de votre actualité"
            className="placeholder:text-muted-foreground/70 w-full bg-transparent text-3xl font-bold outline-none"
          />

          {viewMode === "edit" ? (
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
              <p className="text-muted-foreground text-xs">{previewDate}</p>
              <h1>{title.trim() || "Titre de votre actualité"}</h1>
              <div
                dangerouslySetInnerHTML={{
                  __html: content.trim() || FALLBACK_CONTENT,
                }}
              />
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
                    {published ? "Publié" : "Brouillon"}
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox
                    id="published"
                    checked={published}
                    onCheckedChange={(checked) =>
                      setPublished(checked === true)
                    }
                  />
                  <label htmlFor="published" className="text-sm font-medium">
                    Publier maintenant
                  </label>
                </div>

                <input
                  type="hidden"
                  name="published"
                  value={published ? "on" : "off"}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {submitLabel}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Slug</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  id="slug"
                  name="slug"
                  required={mode === "edit"}
                  value={slug}
                  onChange={(event) => setSlug(event.target.value)}
                  placeholder="slug-de-l-actualite"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setSlug(slugify(title))}
                >
                  <Sparkles className="h-4 w-4" />
                  Auto-générer
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Catégorie</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Select
                  value={categoryId || "none"}
                  onValueChange={(value) =>
                    setCategoryId(value === "none" ? "" : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Aucune catégorie</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input type="hidden" name="categoryId" value={categoryId} />
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
                  onUploaded={setImageUrl}
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
    </form>
  );
}

export type { PostEditorPageProps };
