"use server";

import { canEditTournament } from "~/lib/permissions";
import { requireAdmin } from "~/server/auth/auth-helpers";
import { db } from "~/server/db";

type UpdateTournamentInput = {
  tournamentId: string;
  name: string;
  location: string;
  startDate: Date;
};

export async function updateTournamentAction(input: UpdateTournamentInput) {
  const session = await requireAdmin();

  const tournament = await db.tournament.findUnique({
    where: { id: input.tournamentId },
    select: { id: true, organizerId: true },
  });

  if (!tournament) {
    throw new Error("Tournoi introuvable.");
  }

  const isAllowed = canEditTournament(session.user, tournament);

  if (!isAllowed) {
    throw new Error("Unauthorized: cannot edit this tournament.");
  }

  return db.tournament.update({
    where: { id: tournament.id },
    data: {
      name: input.name,
      location: input.location,
      startDate: input.startDate,
    },
  });
}
