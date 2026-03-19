"use client";

import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

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

export function NewsManager() {
  const [articles, setArticles] = useState(actualitesMock);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

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

  const save = () => {
    if (!form.title) return;

    if (editingId) {
      setArticles((prev) =>
        prev.map((article) =>
          article.id === editingId ? { ...article, ...form } : article,
        ),
      );
    } else {
      setArticles((prev) => [{ id: `news-${crypto.randomUUID()}`, ...form }, ...prev]);
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
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(article)}>
                      <Edit className="size-3.5" />
                      Éditer
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setArticles((prev) => prev.filter((item) => item.id !== article.id))
                      }
                    >
                      <Trash2 className="size-3.5" />
                      Supprimer
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
