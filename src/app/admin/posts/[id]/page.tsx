import { notFound } from "next/navigation";

import { Card, CardHeader, CardTitle } from "~/components/ui/card";
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
      image: true,
      published: true,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Modifier une actualité</CardTitle>
        </CardHeader>

        <PostEditForm post={post} />
      </Card>
    </div>
  );
}
