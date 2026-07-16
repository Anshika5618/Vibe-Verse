import Layout from "../components/Layout";
import BlogList from "../components/BlogList";
import SEO from "../components/SEO";
import { prisma } from "../lib/prisma";
import { SITE_NAME, SITE_URL, SITE_AUTHOR } from "../lib/config";

export async function getStaticProps() {
  const posts = await prisma.post.findMany({
  where: { published: true },
  orderBy: { createdAt: "desc" },
  take: 20, // cap the homepage at 20 most recent posts
  select: {
    slug: true,
    title: true,
    description: true,
    image: true,
    tags: true,
    readTime: true,
    createdAt: true,
    author: { select: { username: true } },
  },
});

  const blogs = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    image: p.image,
    tags: p.tags,
    readTime: p.readTime,
    date: p.createdAt.toISOString().split("T")[0], // matches your old "date" string format loosely
    author: p.author?.username || SITE_AUTHOR,
  }));

  return {
    props: { blogs },
    revalidate: 60, // ISR: rebuild this page in the background at most once a minute
  };
}

export default function Home({ blogs }) {
  return (
    <>
      <SEO
        title={`${SITE_NAME} - Web Development & Design`}
        description="A modern blog featuring articles about web development, React, Next.js, design, and technology"
        url={SITE_URL}
        image={`${SITE_URL}/og-home.jpg`}
      />
      <Layout>
        <BlogList blogs={blogs} />
      </Layout>
    </>
  );
}