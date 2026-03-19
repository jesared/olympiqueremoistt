"use client";

import { Edit, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

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
import { type SitePage, sitePagesMock } from "~/data/cms";

const emptyForm: Omit<SitePage, "id" | "updatedAt"> = {
  title: "",
  slug: "",
  content: "",
  status: "draft",
};

export function PagesManager() {
  const [pages, setPages] = useState(sitePagesMock);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
    setOpen(false);
  };

  const handleCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setOpen(true);
  };

  const handleEdit = (page: SitePage) => {
    setEditingId(page.id);
    setForm({
      title: page.title,
      slug: page.slug,
      content: page.content,
      status: page.status,
    });
    setOpen(true);
  };

  const handleSave = () => {
    if (!form.title || !form.slug) return;

    if (editingId) {
      setPages((prev) =>
        prev.map((page) =>
          page.id === editingId
            ? {
                ...page,
                ...form,
                updatedAt: new Date().toISOString().slice(0, 10),
              }
            : page,
        ),
      );
    } else {
      setPages((prev) => [
        {
          id: `page-${crypto.randomUUID()}`,
          ...form,
          updatedAt: new Date().toISOString().slice(0, 10),
        },
        ...prev,
      ]);
    }

    reset();
  };

  const handleDelete = (id: string) => {
    setPages((prev) => prev.filter((page) => page.id !== id));
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pages du site</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="size-4" />
              Créer une page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {isEditing ? "Éditer la page" : "Créer une page"}
              </DialogTitle>
              <DialogDescription>
                Formulaire CMS prêt à brancher sur Prisma.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-3">
              <Input
                placeholder="Titre"
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
              />
              <Input
                placeholder="Slug (ex: presentation-club)"
                value={form.slug}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, slug: event.target.value }))
                }
              />
              <Textarea
                placeholder="Contenu"
                value={form.content}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, content: event.target.value }))
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
              <Button onClick={handleSave}>Enregistrer</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Titre</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>MAJ</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">{page.title}</TableCell>
                <TableCell>/{page.slug}</TableCell>
                <TableCell>
                  <StatusBadge status={page.status} />
                </TableCell>
                <TableCell>{page.updatedAt}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(page)}>
                      <Edit className="size-3.5" />
                      Éditer
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(page.id)}
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
