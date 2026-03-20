import { PostEditorPage } from "~/components/admin/PostEditorPage";
import { db as prisma } from "~/server/db";

export default async function AdminCreatePostPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  return <PostEditorPage mode="create" categories={categories} />;
}
