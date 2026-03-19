"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { Card, CardContent } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { players } from "~/data/admin";

export default function AdminJoueursPage() {
  const [search, setSearch] = useState("");

  const filteredPlayers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) return players;

    return players.filter((player) =>
      [player.name, player.club, player.license]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch),
    );
  }, [search]);

  return (
    <Card>
      <CardContent className="space-y-4">
        <div className="relative max-w-md">
          <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher un joueur, club ou licence"
            className="pl-9"
          />
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Club</TableHead>
              <TableHead>Classement</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead>Licence</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPlayers.map((player) => (
              <TableRow key={player.id}>
                <TableCell className="font-medium">{player.name}</TableCell>
                <TableCell>{player.club}</TableCell>
                <TableCell>{player.ranking}</TableCell>
                <TableCell>{player.category}</TableCell>
                <TableCell>{player.license}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
