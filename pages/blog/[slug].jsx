import { MDXRemote } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import Layout from "../../components/Layout";
import SEO from "../../components/SEO";
import ReadingProgress from "../../components/ReadingProgress";
import CommentSection from "../../components/CommentSection";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "../../lib/prisma";
import { SITE_URL, SITE_AUTHOR } from "../../lib/config";
import { useUser } from "../../lib/useUser";

export async function getStaticPaths() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });

  return {
    paths: posts.map((p) => ({ params: { slug: p.slug } })),
    fallback: "blocking", // new posts (published after last build) render on first request
  };
}

export async function getStaticProps({ params }) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: { select: { username: true } } },
  });

  if (!post || !post.published) {
    return { notFound: true };
  }

  const mdxSource = await serialize(post.content);

 return {
  props: {
    meta: {
      title: post.title,
      description: post.description,
      image: post.image,
      tags: post.tags,
      readTime: post.readTime,
      author: post.author?.username || SITE_AUTHOR,
      date: post.createdAt.toISOString().split("T")[0],
    },
    mdxSource,
    slug: params.slug,
    postId: post.id,
    authorId: post.authorId,   // ← moved here, one level up
  },
  revalidate: 60,
};
}
export default function BlogPostPage({ meta, mdxSource, slug, postId, authorId }) {
  const { user } = useUser();
  const canEdit = user && (user.id === authorId || user.role === "ADMIN");
    const postUrl = `${SITE_URL}/blog/${slug}`;
  const publishedTime = meta.date ? new Date(meta.date).toISOString() : null;

  return (
    <>
      <SEO
        title={meta.title}
        description={meta.description || "Read this article on our blog"}
        image={meta.image || `${SITE_URL}/og-default.jpg`}
        url={postUrl}
        type="article"
        author={meta.author || SITE_AUTHOR}
        publishedTime={publishedTime}
        tags={meta.tags || []}
      />

      <ReadingProgress />

      <Layout>
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 group"
          >
            <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span>
            Back to all posts
          </Link>
{canEdit && (
  <Link
    href={`/blog/${slug}/edit`}
    className="ml-4 inline-block text-sm text-purple-600 dark:text-purple-400 hover:underline"
  >
    Edit post
  </Link>
)}
          <header className="mb-8">
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium mb-4">
              {meta.author || SITE_AUTHOR} • {meta.date} {meta.readTime && `• ${meta.readTime}`}
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {meta.title}
            </h1>
            {meta.description && (
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
                {meta.description}
              </p>
            )}
          </header>

          {meta.image && (
            <div className="relative w-full h-64 md:h-96 mb-12">
              <Image src={meta.image} alt={meta.title} fill className="object-cover rounded-lg" />
            </div>
          )}

          <div className="prose prose-lg prose-gray dark:prose-invert max-w-none
            prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed
            prose-a:text-purple-600 dark:prose-a:text-purple-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-gray-900 dark:prose-strong:text-white prose-strong:font-semibold
            prose-code:text-purple-600 dark:prose-code:text-purple-400 prose-code:bg-purple-50 dark:prose-code:bg-gray-800 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:text-gray-100
            prose-img:rounded-lg prose-img:shadow-md
          ">
            <MDXRemote {...mdxSource} />
          </div>

          {meta.tags && meta.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {meta.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-sm font-normal px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Share this article:</p>
            <div className="flex gap-3">
              
              <a  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(meta.title)}&url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition"
              >
                Twitter
              </a>
              
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm hover:bg-blue-800 transition"
              >
                LinkedIn
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(postUrl)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Copy Link
              </button>
            </div>
          </div>

          {/* Comments + Likes */}
          <CommentSection postId={postId} />
        </article>
      </Layout>
    </>
  );
}