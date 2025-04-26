import { useState } from "react";
import { FaSearch, FaSpinner } from "react-icons/fa";

const BookSearch = ({ onSelectBook }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const searchBooks = async (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      // Open Library API
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          query
        )}&limit=10`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await response.json();

      const formattedResults = data.docs.map((book) => ({
        id: book.key,
        title: book.title,
        author_name: book.author_name || ["Unknown author"],
        cover_url: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
          : null,
        first_publish_year: book.first_publish_year,
      }));

      setSearchResults(formattedResults);
    } catch (err) {
      console.error("Search error:", err);
      setError(err.message);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      searchBooks();
    }
  };

  return (
    <div className="book-search-container">
      <div className="mb-4">
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Search for a book... (Remember to click the magnifier!)"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={searchBooks}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 flex items-center"
            disabled={isLoading}
          >
            {isLoading ? <FaSpinner className="animate-spin" /> : <FaSearch />}
          </button>
        </div>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="max-h-64 overflow-y-auto">
        {searchResults.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {searchResults.map((book) => (
              <li key={book.id} className="py-3">
                <button
                  type="button"
                  onClick={() => onSelectBook(book)}
                  className="flex items-start w-full text-left hover:bg-gray-50 p-2 rounded"
                >
                  {book.cover_url ? (
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      className="w-12 h-16 object-cover mr-3"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/60x80?text=No+Cover";
                      }}
                    />
                  ) : (
                    <div className="w-12 h-16 bg-gray-200 flex items-center justify-center mr-3">
                      <span className="text-xs text-gray-500">No cover</span>
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium">{book.title}</h4>
                    {book.author_name && (
                      <p className="text-sm text-gray-600">
                        by {book.author_name.join(", ")}
                      </p>
                    )}
                    {book.first_publish_year && (
                      <p className="text-xs text-gray-500">
                        {book.first_publish_year}
                      </p>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          !isLoading &&
          query && (
            <p className="text-gray-500 text-center py-4">
              No books found matching your search.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default BookSearch;
