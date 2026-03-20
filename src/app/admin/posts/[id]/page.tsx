import { notFound } from "next/navigation";

import { db as prisma } from "~/server/db";

import { PostEditForm } from "./PostEditForm";

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
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  return <PostEditForm post={post} />;
}
