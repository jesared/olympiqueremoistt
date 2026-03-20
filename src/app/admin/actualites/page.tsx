import { NewsManager } from "~/components/admin/cms/news-manager";
import type { NewsArticle } from "~/data/cms";
import { db } from "~/server/db";

export default async function AdminActualitesPage() {
  const posts = await db.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      content: true,
      imageUrl: true,
      createdAt: true,
      published: true,
    },
  });

  const articles: NewsArticle[] = posts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    date: post.createdAt.toISOString().slice(0, 10),
    image: post.imageUrl ?? "",
    status: post.published ? "published" : "draft",
  }));

  return (
    <div className="space-y-6">
      <NewsManager initialArticles={articles} />
    </div>
  );
}
