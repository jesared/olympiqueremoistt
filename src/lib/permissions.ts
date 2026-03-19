export type TournamentEditor = {
  id: string;
  role?: string | null;
};

export type EditableTournament = {
  organizerId?: string | null;
};

export function canEditTournament(
  user: TournamentEditor | null | undefined,
  tournament: EditableTournament | null | undefined,
): boolean {
  if (!user) return false;

  if (user.role === "ADMIN") return true;

  if (user.role === "ORGANIZER") {
    return tournament?.organizerId === user.id;
  }

  return false;
}
