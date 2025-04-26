import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import {
  FaThumbsUp,
  FaEdit,
  FaTimes,
  FaTrash,
  FaClock,
  FaBook,
  FaLink,
  FaSave,
} from "react-icons/fa";
import CommentForm from "../components/CommentForm";
import CommentCard from "../components/CommentCard";
import BookSearch from "../components/BookSearch";
import { formatDate } from "../utils/formatDate";

const PostDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookDetails, setBookDetails] = useState(null);
  const [loadingBookDetails, setLoadingBookDetails] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showBookSearch, setShowBookSearch] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    book_api_id: "",
    book_title: "",
    book_author: "",
    post_author: user.email.split("@")[0],
  });

  useEffect(() => {
    const fetchPostAndComments = async () => {
      setLoading(true);
      try {
        const { data: postData, error: postError } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single();

        if (postError) throw postError;
        if (!postData) throw new Error("Post not found");

        setPost(postData);
        setFormData(postData);

        if (user && postData.user_id === user.id) {
          setIsAuthor(true);
        }

        if (postData.book_title) {
          setSelectedBook({
            id: postData.book_api_id,
            title: postData.book_title,
            author_name: postData.book_author ? [postData.book_author] : [],
            cover_url: postData.image_url,
          });
        }

        const { data: commentsData, error: commentsError } = await supabase
          .from("comments")
          .select("*")
          .eq("post_id", id)
          .order("created_at", { ascending: false });

        if (commentsError) throw commentsError;

        setComments(commentsData || []);

        if (
          postData.book_api_id &&
          postData.book_api_id.startsWith("/works/")
        ) {
          fetchBookDetails(postData.book_api_id);
        }
      } catch (err) {
        console.error("Error fetching post:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [id]);

  const fetchBookDetails = async (bookId) => {
    setLoadingBookDetails(true);
    try {
      const worksId = bookId.replace("/works/", "");
      const response = await fetch(
        `https://openlibrary.org/works/${worksId}.json`
      );

      if (!response.ok) throw new Error("Failed to fetch book details");

      const data = await response.json();
      setBookDetails(data);
    } catch (err) {
      console.error("Error fetching book details:", err);
    } finally {
      setLoadingBookDetails(false);
    }
  };

  const handleUpvote = async () => {
    if (!user) {
      alert("Please sign in to upvote posts");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("posts")
        .update({ upvotes: (post.upvotes || 0) + 1 })
        .eq("id", post.id)
        .select();

      if (error) throw error;

      setPost({ ...post, upvotes: data[0].upvotes });
    } catch (err) {
      console.error("Error upvoting post:", err);
    }
  };

  const handleDelete = async () => {
    if (!isAuthor) {
      alert("You don't have permission to delete this post");
      return;
    }

    try {
      const { error: commentsError } = await supabase
        .from("comments")
        .delete()
        .eq("post_id", post.id);

      if (commentsError) throw commentsError;

      const { error } = await supabase.from("posts").delete().eq("id", post.id);

      if (error) throw error;

      navigate("/");
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const addComment = (newComment) => {
    setComments([newComment, ...comments]);
  };

  const deleteComment = async (commentId) => {
    try {
      const { error } = await supabase
        .from("comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setFormData((prev) => ({
      ...prev,
      book_api_id: book.id,
      book_title: book.title,
      book_author: book.author_name ? book.author_name.join(", ") : "",
      image_url: book.cover_url || prev.image_url,
    }));
    setShowBookSearch(false);
  };

  const handleRemoveBook = () => {
    setSelectedBook(null);
    setFormData((prev) => ({
      ...prev,
      book_api_id: "",
      book_title: "",
      book_author: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthor) {
      alert("You don't have permission to edit this post");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("posts")
        .update({
          title: formData.title,
          content: formData.content,
          image_url: formData.image_url,
          book_api_id: formData.book_api_id,
          book_title: formData.book_title,
          book_author: formData.book_author,
          post_author: formData.post_author,
        })
        .eq("id", id)
        .select();

      if (error) throw error;

      setPost(data[0]);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEditMode = () => {
    if (!isAuthor) {
      alert("You don't have permission to edit this post");
      return;
    }
    setEditMode(!editMode);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        <p>Error: {error}</p>
        <p className="mt-2">
          <Link to="/" className="text-blue-600 hover:underline">
            Return to home page
          </Link>
        </p>
      </div>
    );
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  if (!editMode) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link
            to="/"
            className="text-blue-600 hover:underline flex items-center"
          >
            ← Back to all posts
          </Link>
        </div>

        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          <header className="p-6 border-b">
            <h1 className="text-2xl font-bold text-gray-800">{post.title}</h1>
            <div className="flex items-center text-gray-500 mt-2">
              <FaClock className="mr-1" />
              <span>
                {formatDate(post.created_at)} by {post.post_author}
              </span>
            </div>
          </header>

          {post.image_url && (
            <div className="relative">
              <img
                src={post.image_url}
                alt={post.title}
                className="w-full max-h-96 object-contain bg-gray-50"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://via.placeholder.com/800x400?text=Image+Not+Available";
                }}
              />
            </div>
          )}

          {(post.book_title || bookDetails) && (
            <div className="bg-blue-50 p-4 border-t border-b border-blue-100">
              <div className="flex items-start">
                <FaBook className="text-blue-600 mt-1 mr-2" />
                <div>
                  <h3 className="font-medium">Book Information</h3>
                  <p className="font-bold">{post.book_title}</p>
                  {post.book_author && <p>by {post.book_author}</p>}

                  {bookDetails && bookDetails.description && (
                    <div className="mt-2">
                      <h4 className="font-medium text-sm">Description:</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {typeof bookDetails.description === "string"
                          ? bookDetails.description
                          : bookDetails.description.value ||
                            "No description available"}
                      </p>
                    </div>
                  )}

                  {post.book_api_id && (
                    <a
                      href={`https://openlibrary.org${post.book_api_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:underline mt-2 text-sm"
                    >
                      <FaLink className="mr-1" /> View on Open Library
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="p-6">
            {post.content && (
              <div className="prose max-w-none">
                {post.content
                  .split("\n")
                  .map((paragraph, i) =>
                    paragraph ? <p key={i}>{paragraph}</p> : <br key={i} />
                  )}
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleUpvote}
                  className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100"
                >
                  <FaThumbsUp />
                  <span>{post.upvotes || 0} Upvotes</span>
                </button>
              </div>

              {isAuthor && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={toggleEditMode}
                    className="flex items-center space-x-1 px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => setDeleteModalOpen(true)}
                    className="flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </article>

        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">Comments</h2>

          {user ? (
            <CommentForm
              postId={post.id}
              userId={user.id}
              onCommentAdded={addComment}
            />
          ) : (
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <p className="text-center">
                <Link to="/signin" className="text-blue-600 hover:underline">
                  Sign in
                </Link>{" "}
                to leave a comment
              </p>
            </div>
          )}

          <div className="mt-6 space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  currentUserId={user?.id}
                  onDelete={() => deleteComment(comment.id)}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </section>

        {deleteModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Delete Post</h3>
              <p>
                Are you sure you want to delete this post? This action cannot be
                undone.
              </p>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={toggleEditMode}
          className="text-blue-600 hover:underline flex items-center"
        >
          ← Back to post
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Post</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="title"
            >
              Post Title*
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="content"
            >
              Content
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-32"
              rows={6}
            />
          </div>

          {!selectedBook && (
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setShowBookSearch(!showBookSearch)}
                className="flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
              >
                <FaBook className="mr-2" />
                {showBookSearch ? "Hide Book Search" : "Search for a Book"}
              </button>
            </div>
          )}

          {showBookSearch && !selectedBook && (
            <div className="mb-6 p-4 bg-gray-50 rounded-md">
              <BookSearch onSelectBook={handleBookSelect} />
            </div>
          )}

          {selectedBook && (
            <div className="mb-6 p-4 bg-blue-50 rounded-md">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">Selected Book:</h3>
                <button
                  type="button"
                  onClick={handleRemoveBook}
                  className="text-gray-500 hover:text-red-500"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="flex mt-2">
                {selectedBook.cover_url && (
                  <img
                    src={selectedBook.cover_url}
                    alt={selectedBook.title}
                    className="w-16 h-24 object-cover mr-4"
                  />
                )}
                <div>
                  <p className="font-medium">{selectedBook.title}</p>
                  {selectedBook.author_name && (
                    <p className="text-sm text-gray-600">
                      by{" "}
                      {Array.isArray(selectedBook.author_name)
                        ? selectedBook.author_name.join(", ")
                        : selectedBook.author_name}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="image_url"
            >
              Image URL
            </label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={toggleEditMode}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? (
                "Saving..."
              ) : (
                <>
                  <FaSave className="mr-1" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostDetail;
