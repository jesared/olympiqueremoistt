"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CalendarClock, Loader2, MapPin } from "lucide-react";

import {
  type CreateEventActionState,
  type DuplicateEventResult,
  type UpdateEventActionState,
} from "~/app/admin/events/action-types";
import { createEvent } from "~/app/admin/events/actions";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { slugify } from "~/lib/slug";

type EventFormState = CreateEventActionState | UpdateEventActionState;

type EventFormData = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  startDate: Date;
  endDate: Date | null;
  published: boolean;
  categoryId?: string | null;
};

type CategoryOption = {
  id: string;
  name: string;
};

type EventFormProps = {
  mode?: "create" | "edit";
  initialData?: EventFormData;
  categories?: CategoryOption[];
  submitAction?: (state: EventFormState, formData: FormData) => Promise<EventFormState>;
  duplicateAction?: () => Promise<DuplicateEventResult>;
};

function toDatetimeLocalValue(date: Date | null) {
  if (!date) return "";
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);
  return localDate.toISOString().slice(0, 16);
}

function formatPreviewDate(startDate: string, endDate: string) {
  if (!startDate) return "Date à définir";

  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return "Date invalide";

  const formatter = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedStart = formatter.format(start);
  if (!endDate) return formattedStart;

  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return formattedStart;

  return `${formattedStart} → ${formatter.format(end)}`;
}

export function EventForm({
  mode = "create",
  initialData,
  categories = [],
  submitAction,
  duplicateAction,
}: EventFormProps) {
  const router = useRouter();
  const [isDuplicating, startDuplicating] = useTransition();
  const initialState: EventFormState = { status: "idle" };
  const resolvedSubmitAction = submitAction ?? createEvent;
  const [state, formAction, pending] = useActionState(resolvedSubmitAction, initialState);

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [startDate, setStartDate] = useState(toDatetimeLocalValue(initialData?.startDate ?? null));
  const [endDate, setEndDate] = useState(toDatetimeLocalValue(initialData?.endDate ?? null));
  const [hasEndDate, setHasEndDate] = useState(Boolean(initialData?.endDate));
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [categoryId, setCategoryId] = useState(initialData?.categoryId ?? "");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(mode === "edit");
  const [toast, setToast] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (state.status === "success") {
      setToast({
        kind: "success",
        message:
          state.message ?? (mode === "edit" ? "Événement mis à jour." : "Événement créé."),
      });
      const redirectTimer = window.setTimeout(() => {
        if (state.redirectTo) {
          router.push(state.redirectTo);
        }
      }, 900);

      return () => window.clearTimeout(redirectTimer);
    }

    if (state.status === "error" && state.message) {
      setToast({ kind: "error", message: state.message });
      const toastTimer = window.setTimeout(() => setToast(null), 2500);
      return () => window.clearTimeout(toastTimer);
    }

    return undefined;
  }, [mode, router, state]);

  const formattedDate = useMemo(
    () => formatPreviewDate(startDate, hasEndDate ? endDate : ""),
    [endDate, hasEndDate, startDate],
  );

  return (
    <>
      <form action={formAction} className="space-y-6">
        <div className="flex flex-col gap-3 border-b pb-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Éditeur d&apos;événement</p>
            <h1 className="text-2xl font-semibold tracking-tight">
              {mode === "edit" ? "Modifier un événement" : "Créer un événement"}
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={published ? "default" : "secondary"}>
              {published ? "Publié" : "Brouillon"}
            </Badge>

            <Button asChild variant="outline" disabled={pending || isDuplicating}>
              <Link href="/admin/events">Retour à la liste</Link>
            </Button>

            {mode === "edit" && duplicateAction ? (
              <Button
                type="button"
                variant="secondary"
                disabled={pending || isDuplicating}
                onClick={() => {
                  const confirmed = window.confirm(
                    "Dupliquer cet événement ? Vous serez redirigé vers la copie.",
                  );
                  if (!confirmed) return;

                  startDuplicating(async () => {
                    const result = await duplicateAction();
                    setToast({
                      kind: result.status === "success" ? "success" : "error",
                      message: result.message,
                    });
                    if (result.status === "success" && result.redirectTo) {
                      router.push(result.redirectTo);
                    }
                  });
                }}
              >
                {isDuplicating ? <Loader2 className="size-4 animate-spin" /> : null}
                Dupliquer
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-10">
          <div className="mx-auto w-full max-w-3xl space-y-6 lg:col-span-7">
            <Card>
              <CardHeader>
                <CardTitle>Contenu principal</CardTitle>
                <CardDescription>
                  Rédigez votre événement avec les informations essentielles.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="title">
                    Titre
                  </label>
                  <Input
                    id="title"
                    name="title"
                    value={title}
                    onChange={(event) => {
                      const nextTitle = event.target.value;
                      setTitle(nextTitle);
                      if (!slugManuallyEdited) setSlug(slugify(nextTitle));
                    }}
                    placeholder="Championnat régional U18"
                  />
                  {state.errors?.title ? (
                    <p className="text-destructive text-xs">{state.errors.title[0]}</p>
                  ) : null}
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="slug">
                    Slug
                  </label>
                  <Input
                    id="slug"
                    name="slug"
                    value={slug}
                    onChange={(event) => {
                      setSlug(slugify(event.target.value));
                      setSlugManuallyEdited(true);
                    }}
                    placeholder="championnat-regional-u18"
                  />
                  {state.errors?.slug ? (
                    <p className="text-destructive text-xs">{state.errors.slug[0]}</p>
                  ) : null}
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="description">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Décrivez le contexte, les horaires, les objectifs et les informations importantes."
                    className="min-h-40"
                  />
                  {state.errors?.description ? (
                    <p className="text-destructive text-xs">{state.errors.description[0]}</p>
                  ) : null}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Informations événement</CardTitle>
                <CardDescription>Date, lieu et durée.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Catégorie</label>
                  <Select
                    value={categoryId || "none"}
                    onValueChange={(value) =>
                      setCategoryId(value === "none" ? "" : value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une catégorie" />
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
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="location">
                    Lieu
                  </label>
                  <div className="relative">
                    <MapPin className="text-muted-foreground absolute top-3 left-3 size-4" />
                    <Input
                      id="location"
                      name="location"
                      value={location}
                      onChange={(event) => setLocation(event.target.value)}
                      className="pl-9"
                      placeholder="Gymnase Marcel Cerdan"
                    />
                  </div>
                  {state.errors?.location ? (
                    <p className="text-destructive text-xs">{state.errors.location[0]}</p>
                  ) : null}
                </div>

                <div className="grid gap-2">
                  <label className="text-sm font-medium" htmlFor="startDate">
                    Date de début
                  </label>
                  <div className="relative">
                    <CalendarClock className="text-muted-foreground absolute top-3 left-3 size-4" />
                    <Input
                      id="startDate"
                      name="startDate"
                      type="datetime-local"
                      value={startDate}
                      onChange={(event) => {
                        const next = event.target.value;
                        setStartDate(next);
                        if (!endDate && next && hasEndDate) setEndDate(next);
                      }}
                      className="pl-9"
                    />
                  </div>
                  {state.errors?.startDate ? (
                    <p className="text-destructive text-xs">{state.errors.startDate[0]}</p>
                  ) : null}
                </div>

                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">Ajouter une date de fin</p>
                    <p className="text-muted-foreground text-xs">
                      Optionnel pour les événements multi-jours.
                    </p>
                  </div>
                  <Switch
                    checked={hasEndDate}
                    onCheckedChange={(checked) => {
                      setHasEndDate(checked);
                      if (!checked) {
                        setEndDate("");
                      } else if (!endDate && startDate) {
                        setEndDate(startDate);
                      }
                    }}
                  />
                </div>

                {hasEndDate ? (
                  <div className="grid gap-2">
                    <label className="text-sm font-medium" htmlFor="endDate">
                      Date de fin
                    </label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="datetime-local"
                      value={endDate}
                      onChange={(event) => setEndDate(event.target.value)}
                    />
                    {state.errors?.endDate ? (
                      <p className="text-destructive text-xs">{state.errors.endDate[0]}</p>
                    ) : null}
                  </div>
                ) : (
                  <input type="hidden" name="endDate" value="" />
                )}
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-3">
              <Button type="submit" disabled={pending || isDuplicating}>
                {pending ? <Loader2 className="size-4 animate-spin" /> : null}
                {mode === "edit" ? "Mettre à jour" : "Créer"}
              </Button>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>Publication</CardTitle>
                <CardDescription>Choisissez le statut de diffusion.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Publié</p>
                    <p className="text-muted-foreground text-xs">
                      Basculer entre brouillon et publié.
                    </p>
                  </div>
                  <Switch checked={published} onCheckedChange={setPublished} />
                </div>
                <input name="published" type="hidden" value={String(published)} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Aperçu en direct</CardTitle>
                <CardDescription>
                  Vérifiez rapidement le rendu de votre fiche événement.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge variant={published ? "default" : "secondary"}>
                  {published ? "Publié" : "Brouillon"}
                </Badge>
                <h3 className="text-base font-semibold">{title || "Titre de votre événement"}</h3>
                <p className="text-muted-foreground text-sm">{formattedDate}</p>
                <p className="text-muted-foreground text-sm">{location || "Lieu à définir"}</p>
                <p className="line-clamp-4 text-sm">
                  {description || "La description apparaîtra ici en temps réel."}
                </p>
              </CardContent>
            </Card>
          </div>
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
    </>
  );
}
