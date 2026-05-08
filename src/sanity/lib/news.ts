import "server-only";

import { db as prisma } from "~/server/db";
import { slugify } from "~/lib/slug";
import { isSanityConfigured } from "~/sanity/lib/config";
import { sanityClient } from "~/sanity/lib/client";
import { getSanityImageUrl } from "~/sanity/lib/image";

type PortableTextChild = {
  _type: string;
  text?: string;
};

type PortableTextTextBlock = {
  _type: string;
  _key?: string;
  children?: PortableTextChild[];
};

type PortableTextImageBlock = {
  _type: "image";
  _key?: string;
  asset?: unknown;
  alt?: string;
  caption?: string;
  display?: "standard" | "wide" | "left" | "right";
};

type GalleryImage = {
  asset?: unknown;
  alt?: string;
  caption?: string;
};

type PortableTextGalleryBlock = {
  _type: "imageGallery";
  _key?: string;
  title?: string;
  leftImage?: GalleryImage;
  rightImage?: GalleryImage;
  caption?: string;
};

type PortableTextBlock =
  | PortableTextTextBlock
  | PortableTextImageBlock
  | PortableTextGalleryBlock;

function isPortableTextTextBlock(
  block: PortableTextBlock,
): block is PortableTextTextBlock {
  return "children" in block && Array.isArray(block.children);
}

type SanityPostRecord = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  author?: {
    name?: string | null;
    avatar?: unknown;
  } | null;
  authorName?: string | null;
  authorAvatar?: unknown;
  coverImage?: unknown;
  publishedAt: string;
  body?: PortableTextBlock[] | null;
};

export type PublishedNewsItem = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  plainTextContent: string;
  imageUrl: string | null;
  publishedAt: Date;
  category: {
    name: string;
    color?: string | null;
  } | null;
  author: {
    name: string;
    avatarUrl: string | null;
  } | null;
  source: "sanity" | "prisma";
  studioEditUrl: string | null;
  body: PortableTextBlock[] | null;
  contentHtml: string | null;
};

const SANITY_POSTS_QUERY = `
  *[_type == "post" && defined(slug.current)]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    author->{
      name,
      avatar
    },
    authorName,
    authorAvatar,
    coverImage,
    "publishedAt": coalesce(publishedAt, _createdAt),
    body
  }
`;

const SANITY_POST_BY_SLUG_QUERY = `
  *[_type == "post" && slug.current in $slugs] | order(_updatedAt desc)[0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    author->{
      name,
      avatar
    },
    authorName,
    authorAvatar,
    coverImage,
    "publishedAt": coalesce(publishedAt, _createdAt),
    body
  }
`;

function toTextExcerpt(value: string, maxLength = 160) {
  const normalized = value.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength).trimEnd()}…`;
}

function htmlToPlainText(content: string) {
  return content
    .replace(/&nbsp;|Â |Ã‚Â /g, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/[#>*_`\-\[\]()]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function portableTextToPlainText(blocks: PortableTextBlock[] | null | undefined) {
  if (!Array.isArray(blocks)) {
    return "";
  }

  const textParts: string[] = [];

  for (const block of blocks) {
    if (!isPortableTextTextBlock(block)) {
      continue;
    }

    const children = block.children ?? [];

    for (const child of children) {
      textParts.push(child.text ?? "");
    }
  }

  return textParts.join(" ").replace(/\s+/g, " ").trim();
}

function createStudioEditUrl(id: string) {
  return `/studio/intent/edit/id=${encodeURIComponent(id)};type=post`;
}

function mapSanityPost(post: SanityPostRecord): PublishedNewsItem {
  const plainTextBody = portableTextToPlainText(post.body);
  const trimmedExcerpt = post.excerpt?.trim();
  const excerptSource =
    trimmedExcerpt && trimmedExcerpt.length > 0
      ? trimmedExcerpt
      : plainTextBody;
  const authorName = post.author?.name?.trim() ?? post.authorName?.trim() ?? null;
  const authorAvatarSource = post.author?.avatar ?? post.authorAvatar;

  return {
    id: post._id,
    title: post.title,
    slug: post.slug,
    excerpt: toTextExcerpt(excerptSource),
    plainTextContent: plainTextBody,
    imageUrl: getSanityImageUrl(post.coverImage),
    publishedAt: new Date(post.publishedAt),
    category: null,
    author: authorName
      ? {
          name: authorName,
          avatarUrl: getSanityImageUrl(authorAvatarSource),
        }
      : null,
    source: "sanity",
    studioEditUrl: createStudioEditUrl(post._id),
    body: post.body ?? null,
    contentHtml: null,
  };
}

async function getSanityPublishedNewsItems() {
  if (!isSanityConfigured) {
    return [];
  }

  const posts = await sanityClient.fetch<SanityPostRecord[]>(SANITY_POSTS_QUERY);

  return posts.map(mapSanityPost);
}

async function getSanityPublishedNewsBySlug(slug: string) {
  if (!isSanityConfigured) {
    return null;
  }

  const normalizedSlug = slugify(slug);
  const slugs = Array.from(new Set([slug, normalizedSlug].filter(Boolean)));

  const post = await sanityClient.fetch<SanityPostRecord | null>(
    SANITY_POST_BY_SLUG_QUERY,
    { slugs },
  );

  return post ? mapSanityPost(post) : null;
}

async function getPrismaPublishedNewsItems() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      content: true,
      createdAt: true,
      author: {
        select: {
          name: true,
          image: true,
          email: true,
        },
      },
      category: {
        select: {
          name: true,
          color: true,
        },
      },
    },
  });

  return posts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: toTextExcerpt(htmlToPlainText(post.content)),
    plainTextContent: htmlToPlainText(post.content),
    imageUrl: post.imageUrl ?? null,
    publishedAt: post.createdAt,
    category: post.category,
    author:
      post.author?.name || post.author?.email
        ? {
            name:
              post.author.name?.trim() ??
              post.author.email?.trim() ??
              "Auteur",
            avatarUrl: post.author.image ?? null,
          }
        : null,
    source: "prisma" as const,
    studioEditUrl: null,
    body: null,
    contentHtml: post.content,
  }));
}

async function getPrismaPublishedNewsBySlug(slug: string) {
  const normalizedSlug = slugify(slug);
  const slugs = Array.from(new Set([slug, normalizedSlug].filter(Boolean)));

  const post = await prisma.post.findFirst({
    where: {
      published: true,
      slug: {
        in: slugs,
      },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      imageUrl: true,
      content: true,
      createdAt: true,
      author: {
        select: {
          name: true,
          image: true,
          email: true,
        },
      },
      category: {
        select: {
          name: true,
          color: true,
        },
      },
    },
  });

  if (!post) {
    return null;
  }

  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: toTextExcerpt(htmlToPlainText(post.content)),
    plainTextContent: htmlToPlainText(post.content),
    imageUrl: post.imageUrl ?? null,
    publishedAt: post.createdAt,
    category: post.category,
    author:
      post.author?.name || post.author?.email
        ? {
            name:
              post.author.name?.trim() ??
              post.author.email?.trim() ??
              "Auteur",
            avatarUrl: post.author.image ?? null,
          }
        : null,
    source: "prisma" as const,
    studioEditUrl: null,
    body: null,
    contentHtml: post.content,
  };
}

function mergePublishedNewsItems(
  prismaPosts: PublishedNewsItem[],
  sanityPosts: PublishedNewsItem[],
) {
  const merged = new Map<string, PublishedNewsItem>();

  for (const post of prismaPosts) {
    merged.set(post.slug, post);
  }

  for (const post of sanityPosts) {
    merged.set(post.slug, post);
  }

  return [...merged.values()].sort(
    (left, right) => right.publishedAt.getTime() - left.publishedAt.getTime(),
  );
}

export async function getPublishedNewsItems(limit?: number) {
  const [prismaPosts, sanityPosts] = await Promise.all([
    getPrismaPublishedNewsItems(),
    getSanityPublishedNewsItems(),
  ]);

  const merged = mergePublishedNewsItems(prismaPosts, sanityPosts);

  return typeof limit === "number" ? merged.slice(0, limit) : merged;
}

export async function getPublishedNewsBySlug(slug: string) {
  const requestedSlug = decodeURIComponent(slug);
  const sanityPost = await getSanityPublishedNewsBySlug(requestedSlug);

  if (sanityPost) {
    return sanityPost;
  }

  return getPrismaPublishedNewsBySlug(requestedSlug);
}

export async function getLegacyPrismaNewsRedirectSlug(slug: string) {
  const requestedSlug = decodeURIComponent(slug);

  const postByTitle = await prisma.post.findFirst({
    where: {
      title: requestedSlug,
      published: true,
    },
    select: {
      slug: true,
    },
  });

  if (postByTitle) {
    return postByTitle.slug;
  }

  const normalizedSlug = slugify(requestedSlug);

  if (!normalizedSlug || normalizedSlug === requestedSlug) {
    return null;
  }

  const postByNormalizedSlug = await prisma.post.findFirst({
    where: {
      slug: normalizedSlug,
      published: true,
    },
    select: {
      slug: true,
    },
  });

  return postByNormalizedSlug?.slug ?? null;
}
