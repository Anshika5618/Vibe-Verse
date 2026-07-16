import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "../lib/useUser";

function CommentForm({ postId, parentId, onPosted, onCancel }) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, postId, parentId: parentId || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to post comment");
        setSubmitting(false);
        return;
      }
      setContent("");
      setSubmitting(false);
      onPosted();
    } catch {
      setError("Network error");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={parentId ? "Write a reply..." : "Write a comment..."}
        rows={parentId ? 2 : 3}
        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
      {error && <p className="text-xs text-red-600 dark:text-red-400 mt-1">{error}</p>}
      <div className="flex gap-2 mt-2">
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-1.5 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition disabled:opacity-50"
        >
          {submitting ? "Posting..." : parentId ? "Reply" : "Comment"}
        </button>
        {parentId && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-1.5 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function Comment({ comment, postId, user, onChanged, depth = 0 }) {
  const [replying, setReplying] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this comment?")) return;
    const res = await fetch(`/api/comments/${comment.id}`, { method: "DELETE" });
    if (res.ok) onChanged();
  }

  const canDelete = user && (user.id === comment.authorId || user.role === "ADMIN");

  return (
    <div className={depth > 0 ? "ml-6 mt-4 pl-4 border-l border-gray-200 dark:border-gray-700" : "mt-6"}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {comment.author.username}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(comment.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{comment.content}</p>

      <div className="flex gap-3 mt-1">
        {user && (
          <button
            onClick={() => setReplying(!replying)}
            className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
          >
            Reply
          </button>
        )}
        {canDelete && (
          <button
            onClick={handleDelete}
            className="text-xs text-red-600 dark:text-red-400 hover:underline"
          >
            Delete
          </button>
        )}
      </div>

      {replying && (
        <CommentForm
          postId={postId}
          parentId={comment.id}
          onPosted={() => {
            setReplying(false);
            onChanged();
          }}
          onCancel={() => setReplying(false)}
        />
      )}

      {comment.replies?.map((reply) => (
        <Comment
          key={reply.id}
          comment={reply}
          postId={postId}
          user={user}
          onChanged={onChanged}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

export default function CommentSection({ postId }) {
  const { user, loading: userLoading } = useUser();
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  async function loadComments() {
    setLoading(true);
    const res = await fetch(`/api/posts/${postId}/comments`);
    const data = await res.json();
    setComments(data.comments || []);
    setLoading(false);
  }

  useEffect(() => {
    if (postId) loadComments();
  }, [postId]);

  useEffect(() => {
    if (!postId) return;
    fetch(`/api/posts/${postId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.post) {
          setLiked(data.post.liked || false);
          setLikeCount(data.post._count?.likes || 0);
        }
      });
  }, [postId]);

  async function handleLikeToggle() {
    if (!user) return;
    const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
    const data = await res.json();
    if (res.ok) {
      setLiked(data.liked);
      setLikeCount(data.likeCount);
    }
  }

  return (
    <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
      {/* Like button */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={handleLikeToggle}
          disabled={!user}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            liked
              ? "bg-purple-600 text-white"
              : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {liked ? "♥ Liked" : "♡ Like"} {likeCount > 0 && `(${likeCount})`}
        </button>
        {!user && !userLoading && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            <Link href="/login" className="text-purple-600 dark:text-purple-400 hover:underline">
              Log in
            </Link>{" "}
            to like
          </span>
        )}
      </div>

      {/* Comments */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      {user ? (
        <CommentForm postId={postId} onPosted={loadComments} />
      ) : (
        !userLoading && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <Link href="/login" className="text-purple-600 dark:text-purple-400 hover:underline">
              Log in
            </Link>{" "}
            to leave a comment
          </p>
        )
      )}

      {loading ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">Loading comments...</p>
      ) : comments.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-6">No comments yet — be the first!</p>
      ) : (
        comments.map((comment) => (
          <Comment key={comment.id} comment={comment} postId={postId} user={user} onChanged={loadComments} />
        ))
      )}
    </div>
  );
}