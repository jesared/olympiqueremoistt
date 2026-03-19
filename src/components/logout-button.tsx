"use client";

import { signOut } from "next-auth/react";
import { Button } from "~/components/ui/button";

export function LogoutButton() {
  return (
    <Button
      variant="outline"
      className="w-full cursor-pointer"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Se déconnecter
    </Button>
  );
}
