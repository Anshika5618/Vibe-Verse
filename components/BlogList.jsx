import { useState } from "react";
import BlogCard from "./BlogCard";
import TagFilter from "./TagFilter";

export default function BlogList({ blogs }) {
  const [activeTag, setActiveTag] = useState("all");

  // Collect all unique tags across all posts
  const allTags = [...new Set(blogs.flatMap((blog) => blog.tags || []))];

  // Filter blogs based on active tag
  const filteredBlogs = activeTag === "all"
    ? blogs
    : blogs.filter((blog) => blog.tags?.includes(activeTag));

  const recent = filteredBlogs.slice(0, 4);
  const allPosts = filteredBlogs.slice(4);

  return (
    <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="mb-12">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white tracking-tight mb-4">
          THE BLOG
        </h1>
      </div>

      {/* Tag Filter */}
      <TagFilter
        tags={allTags}
        activeTag={activeTag}
        onTagChange={setActiveTag}
      />

      {/* No results */}
      {filteredBlogs.length === 0 && (
        <div className="text-center py-24">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No posts found for <span className="font-semibold text-purple-600 dark:text-purple-400">#{activeTag}</span>
          </p>
          <button
            onClick={() => setActiveTag("all")}
            className="mt-4 text-sm text-gray-500 dark:text-gray-400 underline hover:text-gray-900 dark:hover:text-white transition"
          >
            Clear filter
          </button>
        </div>
      )}

      {/* Recent posts */}
      {filteredBlogs.length > 0 && (
        <div className="mb-16">
          <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
            Recent blog posts
          </h2>

          {recent.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-2 gap-6 mb-6">
              <div className="lg:row-span-2">
                <BlogCard {...recent[0]} featured />
              </div>
              {recent[1] && (
                <div>
                  <BlogCard {...recent[1]} />
                </div>
              )}
              {recent[2] && (
                <div>
                  <BlogCard {...recent[2]} />
                </div>
              )}
            </div>
          )}

          {recent[3] && (
            <div className="w-full">
              <BlogCard {...recent[3]} horizontal />
            </div>
          )}
        </div>
      )}

      {/* All posts */}
      {allPosts.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
            All blog posts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPosts.map((blog) => (
              <BlogCard key={blog.slug} {...blog} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}