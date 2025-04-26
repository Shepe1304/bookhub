import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../supabaseClient";
import BookSearch from "../components/BookSearch";
import { FaImage, FaBook, FaTimes } from "react-icons/fa";

const CreatePost = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image_url: "",
    book_api_id: "",
    book_title: "",
    book_author: "",
    post_author: user.email.split("@")[0],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showBookSearch, setShowBookSearch] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    // Check if a book was passed through navigation state
    if (location.state && location.state.bookData) {
      const book = location.state.bookData;
      setSelectedBook(book);
      setFormData((prev) => ({
        ...prev,
        book_api_id: book.id,
        book_title: book.title,
        book_author: book.author ? book.author : "",
        image_url: book.cover_url || prev.image_url,
      }));
    }
  }, [location]);

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

      const { data, error } = await supabase
        .from("posts")
        .insert({
          ...formData,
          user_id: user.id,
          upvotes: 0,
        })
        .select();

      if (error) throw error;

      navigate(`/post/${data[0].id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create a New Post</h1>

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
                      by {selectedBook.author_name.join(", ")}
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
            <div className="flex">
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
            <p className="text-sm text-gray-500 mt-1">
              <FaImage className="inline mr-1" />
              Provide a URL to an image for your post.
            </p>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md mr-2 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
            >
              {isSubmitting ? "Creating..." : "Create Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
