"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarClock, Loader2, MapPin } from "lucide-react";

import { createEventAction, initialCreateEventState } from "./actions";

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
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { slugify } from "~/lib/slug";

function formatPreviewDate(startDate: string, endDate: string) {
  if (!startDate) {
    return "Date à définir";
  }

  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) {
    return "Date invalide";
  }

  const formatter = new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedStart = formatter.format(start);

  if (!endDate) {
    return formattedStart;
  }

  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) {
    return formattedStart;
  }

  return `${formattedStart} → ${formatter.format(end)}`;
}

function SubmitButtons({ pending }: { pending: boolean }) {
  return (
    <div className="flex flex-wrap gap-3">
      <Button type="submit" name="intent" value="draft" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        Créer l&apos;événement
      </Button>

      <Button
        type="submit"
        name="intent"
        value="publish"
        disabled={pending}
        variant="secondary"
      >
        {pending ? <Loader2 className="size-4 animate-spin" /> : null}
        Créer et publier
      </Button>
    </div>
  );
}

export function EventForm() {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    createEventAction,
    initialCreateEventState,
  );

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [multiDay, setMultiDay] = useState(false);
  const [published, setPublished] = useState(false);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [toast, setToast] = useState<{
    kind: "success" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    if (state.status === "success") {
      setToast({
        kind: "success",
        message: state.message ?? "Événement créé.",
      });
      const redirectTimer = window.setTimeout(() => {
        router.push(state.redirectTo ?? "/admin/events");
      }, 900);

      return () => window.clearTimeout(redirectTimer);
    }

    if (state.status === "error" && state.message) {
      setToast({ kind: "error", message: state.message });
      const toastTimer = window.setTimeout(() => setToast(null), 2500);
      return () => window.clearTimeout(toastTimer);
    }

    return undefined;
  }, [router, state]);

  const formattedDate = useMemo(
    () => formatPreviewDate(startDate, multiDay ? endDate : ""),
    [endDate, multiDay, startDate],
  );

  return (
    <>
      <form
        action={formAction}
        className="grid grid-cols-1 gap-6 lg:grid-cols-10"
      >
        <div className="space-y-6 lg:col-span-7">
          <Card>
            <CardHeader>
              <CardTitle>Contenu principal</CardTitle>
              <CardDescription>
                Rédigez votre événement comme dans un CMS moderne.
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
                    if (!slugManuallyEdited) {
                      setSlug(slugify(nextTitle));
                    }
                  }}
                  placeholder="Championnat régional U18"
                />
                {state.errors?.title ? (
                  <p className="text-destructive text-xs">
                    {state.errors.title[0]}
                  </p>
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
                    setSlug(event.target.value);
                    setSlugManuallyEdited(true);
                  }}
                  placeholder="championnat-regional-u18"
                />
                {state.errors?.slug ? (
                  <p className="text-destructive text-xs">
                    {state.errors.slug[0]}
                  </p>
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
                  <p className="text-destructive text-xs">
                    {state.errors.description[0]}
                  </p>
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
                  <p className="text-destructive text-xs">
                    {state.errors.location[0]}
                  </p>
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
                      if (!endDate && next && multiDay) {
                        setEndDate(next);
                      }
                    }}
                    className="pl-9"
                  />
                </div>
                {state.errors?.startDate ? (
                  <p className="text-destructive text-xs">
                    {state.errors.startDate[0]}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">
                    Événement sur plusieurs jours
                  </p>
                  <p className="text-muted-foreground text-xs">
                    Activez pour ajouter une date de fin.
                  </p>
                </div>
                <Switch
                  checked={multiDay}
                  onCheckedChange={(checked) => {
                    setMultiDay(checked);
                    if (!checked) {
                      setEndDate("");
                    } else if (!endDate && startDate) {
                      setEndDate(startDate);
                    }
                  }}
                />
              </div>

              {multiDay ? (
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
                    <p className="text-destructive text-xs">
                      {state.errors.endDate[0]}
                    </p>
                  ) : null}
                </div>
              ) : (
                <input type="hidden" name="endDate" value="" />
              )}
            </CardContent>
          </Card>

          <SubmitButtons pending={pending} />
        </div>

        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Publication</CardTitle>
              <CardDescription>
                Choisissez le statut de diffusion.
              </CardDescription>
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
              <div className="flex items-center justify-between">
                <Badge variant={published ? "default" : "secondary"}>
                  {published ? "Publié" : "Brouillon"}
                </Badge>
              </div>
              <h3 className="text-base font-semibold">
                {title || "Titre de votre événement"}
              </h3>
              <p className="text-muted-foreground text-sm">{formattedDate}</p>
              <p className="text-muted-foreground text-sm">
                {location || "Lieu à définir"}
              </p>
              <p className="line-clamp-4 text-sm">
                {description || "La description apparaîtra ici en temps réel."}
              </p>
            </CardContent>
          </Card>
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
