"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";

import { createEvent, type CreateEventState } from "./actions";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Création..." : "Créer"}
    </Button>
  );
}

const initialState: CreateEventState = {};

type FieldErrorProps = {
  error?: string;
};

function FieldError({ error }: FieldErrorProps) {
  if (!error) return null;

  return <p className="text-destructive text-xs">{error}</p>;
}

export function EventCreateForm() {
  const [state, formAction] = useActionState(createEvent, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {state.formError ? (
        <p className="border-destructive/50 bg-destructive/10 text-destructive rounded-md border p-3 text-sm">
          {state.formError}
        </p>
      ) : null}

      <div className="grid gap-2">
        <label htmlFor="title" className="text-sm font-medium">
          Titre
        </label>
        <Input id="title" name="title" required />
        <FieldError error={state.fieldErrors?.title} />
      </div>

      <div className="grid gap-2">
        <label htmlFor="slug" className="text-sm font-medium">
          Slug
        </label>
        <Input
          id="slug"
          name="slug"
          required
          placeholder="championnat-regional-2026"
        />
        <p className="text-muted-foreground text-xs">
          Format recommandé: minuscules et tirets.
        </p>
        <FieldError error={state.fieldErrors?.slug} />
      </div>

      <div className="grid gap-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea id="description" name="description" required />
        <FieldError error={state.fieldErrors?.description} />
      </div>

      <div className="grid gap-2">
        <label htmlFor="location" className="text-sm font-medium">
          Lieu
        </label>
        <Input id="location" name="location" required />
        <FieldError error={state.fieldErrors?.location} />
      </div>

      <div className="grid gap-2">
        <label htmlFor="startDate" className="text-sm font-medium">
          Date de début
        </label>
        <Input id="startDate" name="startDate" type="datetime-local" required />
        <FieldError error={state.fieldErrors?.startDate} />
      </div>

      <div className="grid gap-2">
        <label htmlFor="endDate" className="text-sm font-medium">
          Date de fin
        </label>
        <Input id="endDate" name="endDate" type="datetime-local" />
        <FieldError error={state.fieldErrors?.endDate} />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="published"
          name="published"
          type="checkbox"
          className="border-input h-4 w-4 rounded border"
        />
        <label htmlFor="published" className="text-sm font-medium">
          Publier maintenant
        </label>
      </div>

      <div className="flex gap-2">
        <SubmitButton />
        <Button asChild variant="outline">
          <Link href="/admin/events">Annuler</Link>
        </Button>
      </div>
    </form>
  );
}
