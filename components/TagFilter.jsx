import { useState } from "react";

export default function TagFilter({ tags, activeTag, onTagChange }) {
  return (
    <div className="flex flex-wrap gap-3 mb-12">
      <button
        onClick={() => onTagChange("all")}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
          activeTag === "all"
            ? "bg-purple-600 text-white"
            : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
      >
        All Posts
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagChange(tag)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            activeTag === tag
              ? "bg-purple-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
}