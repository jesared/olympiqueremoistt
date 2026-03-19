"use client";

import Link from "next/link";
import { type FormEvent, useState, useTransition } from "react";

import { Button } from "~/components/ui/button";
import { CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

import { updateEvent } from "./actions";

type EventEditFormProps = {
  event: {
    id: string;
    title: string;
    slug: string;
    description: string;
    location: string;
    startDate: Date;
    endDate: Date | null;
    published: boolean;
  };
};

type ToastState = {
  message: string;
  kind: "success" | "error";
} | null;

const ERROR_MESSAGES: Record<string, string> = {
  "missing-fields": "Veuillez remplir tous les champs obligatoires.",
  "invalid-start-date": "La date de début est invalide.",
  "invalid-end-date": "La date de fin est invalide.",
  "end-before-start": "La date de fin doit être après la date de début.",
  "slug-already-used": "Ce slug est déjà utilisé par un autre événement.",
  unknown: "Impossible de sauvegarder cet événement.",
};

function toDatetimeLocalValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const localDate = new Date(date.getTime() - offset * 60_000);

  return localDate.toISOString().slice(0, 16);
}

export function EventEditForm({ event }: EventEditFormProps) {
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
      const result = await updateEvent(event.id, formData);

      if (result.success) {
        showToast({ message: "Événement sauvegardé.", kind: "success" });
        return;
      }

      const errorMessage =
        ERROR_MESSAGES[result.error ?? "unknown"] ??
        "Impossible de sauvegarder cet événement.";

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
          <Input id="title" name="title" required defaultValue={event.title} />
        </div>

        <div className="grid gap-2">
          <label htmlFor="slug" className="text-sm font-medium">
            Slug
          </label>
          <Input id="slug" name="slug" required defaultValue={event.slug} />
        </div>

        <div className="grid gap-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            required
            defaultValue={event.description}
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="location" className="text-sm font-medium">
            Lieu
          </label>
          <Input
            id="location"
            name="location"
            required
            defaultValue={event.location}
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="startDate" className="text-sm font-medium">
            Date de début
          </label>
          <Input
            id="startDate"
            name="startDate"
            type="datetime-local"
            required
            defaultValue={toDatetimeLocalValue(event.startDate)}
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="endDate" className="text-sm font-medium">
            Date de fin
          </label>
          <Input
            id="endDate"
            name="endDate"
            type="datetime-local"
            defaultValue={
              event.endDate ? toDatetimeLocalValue(event.endDate) : undefined
            }
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="published"
            name="published"
            type="checkbox"
            className="border-input h-4 w-4 rounded border"
            defaultChecked={event.published}
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
            <Link href="/admin/events">Retour</Link>
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
