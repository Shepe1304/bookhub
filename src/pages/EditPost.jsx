import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { FaBook, FaTimes } from "react-icons/fa";
import BookSearch from "../components/BookSearch";

const EditPost = ({ userId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    book_api_id: "",
    book_title: "",
    book_author: "",
  });
  const [originalPost, setOriginalPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showBookSearch, setShowBookSearch] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        if (!data) throw new Error("Post not found");

        if (data.user_id !== userId) {
          navigate(`/post/${id}`);
          return;
        }

        setFormData(data);
        setOriginalPost(data);

        if (data.book_title) {
          setSelectedBook({
            id: data.book_api_id,
            title: data.book_title,
            author_name: data.book_author ? [data.book_author] : [],
            cover_url: data.image_url,
          });
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, userId, navigate]);

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
    setIsSubmitting(true);
    setError(null);

    try {
      if (!formData.title.trim()) {
        throw new Error("Post title is required");
      }

      const { error } = await supabase
        .from("posts")
        .update({
          title: formData.title,
          content: formData.content,
          image_url: formData.image_url,
          book_api_id: formData.book_api_id,
          book_title: formData.book_title,
          book_author: formData.book_author,
        })
        .eq("id", id);

      if (error) throw error;

      navigate(`/post/${id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error && !originalPost) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
        <p>Error: {error}</p>
        <button
          onClick={() => navigate(`/post/${id}`)}
          className="text-blue-600 hover:underline mt-2"
        >
          Go back to post
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
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
              onClick={() => navigate(`/post/${id}`)}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
