"use client";

import { Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { deletePost, togglePublish } from "~/app/admin/actualites/actions";

import { StatusBadge } from "~/components/admin/cms/status-badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Textarea } from "~/components/ui/textarea";
import { actualitesMock, type NewsArticle } from "~/data/cms";

const emptyForm: Omit<NewsArticle, "id"> = {
  title: "",
  content: "",
  date: "",
  image: "",
  status: "draft",
};

type ToastState = {
  message: string;
  kind: "success" | "error";
} | null;

type NewsManagerProps = {
  initialArticles?: NewsArticle[];
};

export function NewsManager({
  initialArticles = actualitesMock,
}: NewsManagerProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [pendingPublishId, setPendingPublishId] = useState<string | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NewsArticle | null>(null);
  const [toast, setToast] = useState<ToastState>(null);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const showToast = (nextToast: ToastState) => {
    setToast(nextToast);
    window.setTimeout(() => setToast(null), 2500);
  };

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
    setOpen(false);
  };

  const openCreate = () => {
    setEditingId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEdit = (article: NewsArticle) => {
    setEditingId(article.id);
    setForm({
      title: article.title,
      content: article.content,
      date: article.date,
      image: article.image,
      status: article.status,
    });
    setOpen(true);
  };

  const toggleLocalStatus = (id: string) =>
    setArticles((prev) =>
      prev.map((article) =>
        article.id === id
          ? {
              ...article,
              status: article.status === "published" ? "draft" : "published",
            }
          : article,
      ),
    );

  const handleTogglePublish = async (id: string) => {
    if (pendingPublishId) return;

    const currentStatus = articles.find((article) => article.id === id)?.status;

    if (!currentStatus) return;

    setPendingPublishId(id);
    toggleLocalStatus(id);

    try {
      const updatedPost = await togglePublish(id);
      setArticles((prev) =>
        prev.map((article) =>
          article.id === id
            ? {
                ...article,
                status: updatedPost.published ? "published" : "draft",
              }
            : article,
        ),
      );
    } catch (error) {
      setArticles((prev) =>
        prev.map((article) =>
          article.id === id
            ? {
                ...article,
                status: currentStatus,
              }
            : article,
        ),
      );
      console.error("Erreur lors du changement de publication", error);
    } finally {
      setPendingPublishId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || pendingDeleteId) return;

    setPendingDeleteId(deleteTarget.id);

    try {
      await deletePost(deleteTarget.id);
      setArticles((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast({ message: "Actualité supprimée.", kind: "success" });
    } catch (error) {
      console.error("Erreur lors de la suppression", error);
      showToast({
        message: "Impossible de supprimer cette actualité.",
        kind: "error",
      });
    } finally {
      setPendingDeleteId(null);
    }
  };

  const save = () => {
    if (!form.title) return;

    if (editingId) {
      setArticles((prev) =>
        prev.map((article) =>
          article.id === editingId ? { ...article, ...form } : article,
        ),
      );
    } else {
      setArticles((prev) => [
        { id: `news-${crypto.randomUUID()}`, ...form },
        ...prev,
      ]);
    }

    reset();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Actualités</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreate}>
              <Plus className="size-4" />
              Créer une actualité
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Éditer l'actualité" : "Créer une actualité"}
              </DialogTitle>
              <DialogDescription>Gestion éditoriale du site.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <Input
                placeholder="Titre"
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
              />
              <Textarea
                placeholder="Contenu"
                value={form.content}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, content: event.target.value }))
                }
              />
              <Input
                type="date"
                value={form.date}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, date: event.target.value }))
                }
              />
              <Input
                placeholder="Image (mock URL)"
                value={form.image}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, image: event.target.value }))
                }
              />
              <div className="flex gap-2">
                <Button
                  variant={form.status === "draft" ? "secondary" : "outline"}
                  onClick={() =>
                    setForm((prev) => ({ ...prev, status: "draft" }))
                  }
                >
                  Brouillon
                </Button>
                <Button
                  variant={
                    form.status === "published" ? "secondary" : "outline"
                  }
                  onClick={() =>
                    setForm((prev) => ({ ...prev, status: "published" }))
                  }
                >
                  Publié
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={reset}>
                Annuler
              </Button>
              <Button onClick={save}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Publication</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell className="font-medium">{article.title}</TableCell>
                <TableCell>{article.date}</TableCell>
                <TableCell>{article.image || "—"}</TableCell>
                <TableCell>
                  <StatusBadge status={article.status} />
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant={
                      article.status === "published" ? "secondary" : "outline"
                    }
                    onClick={() => void handleTogglePublish(article.id)}
                    disabled={pendingPublishId === article.id}
                  >
                    {pendingPublishId === article.id
                      ? "Mise à jour..."
                      : article.status === "published"
                        ? "Dépublier"
                        : "Publier"}
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEdit(article)}
                    >
                      <Edit className="size-3.5" />
                      Éditer
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDeleteTarget(article)}
                      disabled={pendingDeleteId === article.id}
                    >
                      {pendingDeleteId === article.id ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                      Supprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog
        open={Boolean(deleteTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setDeleteTarget(null);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Voulez-vous vraiment supprimer{" "}
              <strong>{deleteTarget?.title}</strong> ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={Boolean(pendingDeleteId)}
            >
              Annuler
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => void handleDelete()}
              disabled={Boolean(pendingDeleteId)}
            >
              {pendingDeleteId ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Trash2 className="size-4" />
              )}
              <span>Supprimer</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
    </Card>
  );
}
