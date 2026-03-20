"use client";

import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

type ToastState = {
  message: string;
  kind: "success" | "error";
} | null;

export function AddCategoryForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = (nextToast: ToastState) => {
    setToast(nextToast);
    window.setTimeout(() => setToast(null), 2500);
  };

  const onSubmit = (submitEvent: FormEvent<HTMLFormElement>) => {
    submitEvent.preventDefault();

    startTransition(async () => {
      try {
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });

        const payload: unknown = await response.json();

        if (!response.ok) {
          const errorMessage =
            typeof payload === "object" &&
            payload !== null &&
            "error" in payload &&
            typeof payload.error === "string"
              ? payload.error
              : "Impossible de créer la catégorie.";

          showToast({ message: errorMessage, kind: "error" });
          return;
        }

        setName("");
        showToast({ message: "Catégorie créée.", kind: "success" });
        router.refresh();
      } catch {
        showToast({
          message: "Impossible de créer la catégorie.",
          kind: "error",
        });
      }
    });
  };

  return (
    <>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nom
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Ex: Championnats"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
            disabled={isPending}
          />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          <span>{isPending ? "Création..." : "Ajouter"}</span>
        </Button>
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
