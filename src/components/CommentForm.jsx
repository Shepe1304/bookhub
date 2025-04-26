import { useState } from "react";
import { supabase } from "../supabaseClient";

const CommentForm = ({ postId, userId, onCommentAdded }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          post_id: postId,
          content,
          user_id: userId,
        })
        .select();

      if (error) throw error;

      onCommentAdded(data[0]);
      setContent("");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border">
      <h3 className="text-lg font-medium mb-3">Add a comment</h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your comment here..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          required
        />

        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
