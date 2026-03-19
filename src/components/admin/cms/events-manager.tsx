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
import { evenementsMock, type SiteEvent } from "~/data/cms";

const emptyForm: Omit<SiteEvent, "id"> = {
  title: "",
  date: "",
  location: "",
  description: "",
  status: "draft",
};

export function EventsManager() {
  const [events, setEvents] = useState(evenementsMock);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const reset = () => {
    setForm(emptyForm);
    setEditingId(null);
    setOpen(false);
  };

  const save = () => {
    if (!form.title) return;

    if (editingId) {
      setEvents((prev) =>
        prev.map((event) => (event.id === editingId ? { ...event, ...form } : event)),
      );
    } else {
      setEvents((prev) => [{ id: `event-${crypto.randomUUID()}`, ...form }, ...prev]);
    }

    reset();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Événements</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
                setOpen(true);
              }}
            >
              <Plus className="size-4" />
              Créer un événement
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Éditer l'événement" : "Créer un événement"}
              </DialogTitle>
              <DialogDescription>Planification des événements club.</DialogDescription>
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
                type="date"
                value={form.date}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, date: event.target.value }))
                }
              />
              <Input
                placeholder="Lieu"
                value={form.location}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, location: event.target.value }))
                }
              />
              <Textarea
                placeholder="Description"
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, description: event.target.value }))
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
              <TableHead>Lieu</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="font-medium">{event.title}</TableCell>
                <TableCell>{event.date}</TableCell>
                <TableCell>{event.location}</TableCell>
                <TableCell>
                  <StatusBadge status={event.status} />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingId(event.id);
                        setForm({
                          title: event.title,
                          date: event.date,
                          location: event.location,
                          description: event.description,
                          status: event.status,
                        });
                        setOpen(true);
                      }}
                    >
                      <Edit className="size-3.5" />
                      Éditer
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setEvents((prev) => prev.filter((item) => item.id !== event.id))
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
