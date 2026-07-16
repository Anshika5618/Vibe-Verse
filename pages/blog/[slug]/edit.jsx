import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Layout from "../../../components/Layout";
import SEO from "../../../components/SEO";
import { useUser } from "../../../lib/useUser";

export default function EditPostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const { user, loading: userLoading } = useUser();

  const [postId, setPostId] = useState(null);
  const [authorId, setAuthorId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    image: "",
    tags: "",
    published: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/posts/slug/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.post) {
          const p = data.post;
          setPostId(p.id);
          setAuthorId(p.authorId);
          setForm({
            title: p.title,
            description: p.description || "",
            content: p.content,
            image: p.image || "",
            tags: (p.tags || []).join(", "),
            published: p.published,
          });
        }
        setLoading(false);
      });
  }, [slug]);

  useEffect(() => {
    if (userLoading || loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (authorId && user.id !== authorId && user.role !== "ADMIN") {
      router.push(`/blog/${slug}`);
    }
  }, [user, userLoading, loading, authorId, slug, router]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          description: form.description,
          image: form.image || undefined,
          tags,
          published: form.published,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to update post");
        setSubmitting(false);
        return;
      }

      router.push(`/blog/${slug}`);
    } catch {
      setError("Network error");
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this post permanently?")) return;
    const res = await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    if (res.ok) router.push("/");
  }

  if (loading || userLoading || !user) return null;

  return (
    <>
      <SEO title={`Edit: ${form.title}`} description="Edit blog post" />
      <Layout>
        <div className="max-w-3xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Edit post</h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <input
                name="description"
                value={form.description}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Cover image URL
              </label>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tags (comma-separated)
              </label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Content (Markdown/MDX)
              </label>
              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                required
                rows={14}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
              <input type="checkbox" name="published" checked={form.published} onChange={handleChange} />
              Published
            </label>

            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 transition disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save changes"}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-6 py-2.5 rounded-lg border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-950 transition"
              >
                Delete post
              </button>
            </div>
          </form>
        </div>
      </Layout>
    </>
  );
}