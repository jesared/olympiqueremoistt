import { notFound } from "next/navigation";

import { PostEditorPage } from "~/components/admin/PostEditorPage";
import { db as prisma } from "~/server/db";

export default async function AdminPostEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      imageUrl: true,
      published: true,
      categoryId: true,
    },
  });

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <PostEditorPage
      mode="edit"
      initialData={{
        id: post.id,
        title: post.title,
        slug: post.slug,
        content: post.content,
        imageUrl: post.imageUrl ?? undefined,
        published: post.published,
        categoryId: post.categoryId ?? undefined,
      }}
      categories={categories}
    />
  );
}
