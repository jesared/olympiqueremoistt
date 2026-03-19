import { auth } from "~/server/auth";
import { UserMenu } from "./UserMenu";

export async function HeaderUser() {
  const session = await auth();

  return <UserMenu user={session?.user} />;
}
