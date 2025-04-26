import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaThumbsUp,
  FaBookOpen,
} from "react-icons/fa";

const BookExplorer = () => {
  const [query, setQuery] = useState("");
  const [currentSearchTerm, setCurrentSearchTerm] = useState("fantasy fiction");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isBookDetailsLoading, setIsBookDetailsLoading] = useState(false);
  const [bookDetails, setBookDetails] = useState(null);
  const [subjectNum, setSubjectNum] = useState(5);

  const resultsPerPage = 12;

  useEffect(() => {
    if (books.length === 0 && !isLoading) {
      searchBooks("fantasy fiction", 1);
    }
  }, []);

  const searchBooks = async (searchQuery, pageNum) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const offset = (pageNum - 1) * resultsPerPage;
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          searchQuery
        )}&limit=${resultsPerPage}&offset=${offset}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch books");
      }

      const data = await response.json();

      setTotalResults(data.numFound);

      const formattedBooks = data.docs.map((book) => ({
        id: book.key,
        title: book.title,
        author: book.author_name ? book.author_name[0] : "Unknown Author",
        cover_id: book.cover_i,
        cover_url: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
          : null,
        first_publish_year: book.first_publish_year,
      }));

      setBooks(formattedBooks);
      setPage(pageNum);
      setCurrentSearchTerm(searchQuery); // Update the current search term
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchBooks(query, 1);
  };

  const fetchBookDetails = async (bookId) => {
    setIsBookDetailsLoading(true);
    try {
      const worksId = bookId.replace("/works/", "");
      const response = await fetch(
        `https://openlibrary.org/works/${worksId}.json`
      );

      if (!response.ok) throw new Error("Failed to fetch book details");

      const data = await response.json();
      setBookDetails(data);

      if (
        data.description &&
        typeof data.description === "object" &&
        data.description.value
      ) {
        data.description = data.description.value;
      }

      return data;
    } catch (err) {
      console.error("Error fetching book details:", err);
      return null;
    } finally {
      setIsBookDetailsLoading(false);
    }
  };

  const handleBookClick = async (book) => {
    setSelectedBook(book);
    await fetchBookDetails(book.id);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      searchBooks(currentSearchTerm, page - 1); // Use currentSearchTerm instead of query
    }
  };

  const handleNextPage = () => {
    if (page * resultsPerPage < totalResults) {
      searchBooks(currentSearchTerm, page + 1); // Use currentSearchTerm instead of query
    }
  };

  const closeBookDetails = () => {
    setSelectedBook(null);
    setBookDetails(null);
  };

  const toggleSubjectsDisplay = () => {
    setSubjectNum(subjectNum === 5 ? bookDetails.subjects.length : 5);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(totalResults / resultsPerPage);

    return (
      <div className="flex items-center justify-center mt-8 space-x-4">
        <button
          onClick={handlePrevPage}
          disabled={page === 1}
          className={`flex items-center px-4 py-2 rounded ${
            page === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          <FaChevronLeft className="mr-2" /> Previous
        </button>
        <div className="text-gray-700">
          Page {page} of {totalPages || 1}
        </div>
        <button
          onClick={handleNextPage}
          disabled={page * resultsPerPage >= totalResults}
          className={`flex items-center px-4 py-2 rounded ${
            page * resultsPerPage >= totalResults
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Next <FaChevronRight className="ml-2" />
        </button>
      </div>
    );
  };

  // console.log("Current search term:", currentSearchTerm);
  // console.log("Page:", page);
  // console.log("Total results:", totalResults);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Book Explorer</h1>

      <form
        onSubmit={handleSearch}
        className="flex items-center mb-8 max-w-2xl mx-auto"
      >
        <div className="relative flex-grow">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for books..."
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute right-3 top-2.5 text-gray-400">
            <FaSearch />
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="ml-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {isLoading ? <FaSpinner className="animate-spin" /> : "Search"}
        </button>
      </form>

      {error && (
        <div className="text-red-500 text-center mb-4">Error: {error}</div>
      )}

      {isLoading ? (
        <div className="flex justify-center my-12">
          <div className="w-16 h-16 text-blue-500">
            <FaSpinner className="animate-spin w-full h-full" />
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <div
                key={book.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleBookClick(book)}
              >
                <div className="h-56 bg-gray-200 flex items-center justify-center">
                  {book.cover_url ? (
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/200x300?text=No+Cover";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <FaBookOpen className="w-12 h-12 mb-2" />
                      <span>No Cover</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-1">By {book.author}</p>
                  {book.first_publish_year && (
                    <p className="text-gray-500 text-xs">
                      Published: {book.first_publish_year}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {books.length === 0 && !isLoading && (
            <div className="text-center text-gray-500 my-12">
              No books found. Try a different search term.
            </div>
          )}

          {books.length > 0 && renderPagination()}
        </>
      )}

      {selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold">{selectedBook.title}</h2>
                <button
                  onClick={closeBookDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {isBookDetailsLoading ? (
                <div className="flex justify-center my-8">
                  <FaSpinner className="animate-spin w-8 h-8 text-blue-500" />
                </div>
              ) : (
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3">
                    <div className="bg-gray-200 rounded-lg overflow-hidden">
                      {selectedBook.cover_url ? (
                        <img
                          src={selectedBook.cover_url}
                          alt={selectedBook.title}
                          className="w-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                              "https://via.placeholder.com/300x450?text=No+Cover";
                          }}
                        />
                      ) : (
                        <div className="h-72 flex flex-col items-center justify-center text-gray-500">
                          <FaBookOpen className="w-16 h-16 mb-2" />
                          <span>No Cover Available</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex flex-col space-y-2">
                      <p>
                        <strong>Author:</strong> {selectedBook.author}
                      </p>
                      {selectedBook.first_publish_year && (
                        <p>
                          <strong>First Published:</strong>{" "}
                          {selectedBook.first_publish_year}
                        </p>
                      )}
                      {bookDetails && bookDetails.subjects && (
                        <div>
                          <strong>Subjects:</strong>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {bookDetails.subjects
                              .slice(0, subjectNum)
                              .map((subject, index) => (
                                <span
                                  key={index}
                                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                                >
                                  {subject}
                                </span>
                              ))}
                            {bookDetails.subjects.length > subjectNum && (
                              <span
                                className="text-sm text-gray-500 cursor-pointer hover:text-blue-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSubjectsDisplay();
                                }}
                              >
                                +{bookDetails.subjects.length - subjectNum} more
                              </span>
                            )}
                            {subjectNum > 5 && (
                              <span
                                className="text-sm text-blue-500 cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSubjectsDisplay();
                                }}
                              >
                                Show less
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full md:w-2/3">
                    <h3 className="text-xl font-semibold mb-3">Description</h3>
                    {bookDetails && bookDetails.description ? (
                      <div className="prose max-w-none">
                        <p>
                          {typeof bookDetails.description === "string"
                            ? bookDetails.description
                            : "No detailed description available."}
                        </p>
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">
                        No description available for this book.
                      </p>
                    )}

                    <div className="mt-6">
                      <h3 className="text-xl font-semibold mb-3">
                        Read This Book
                      </h3>
                      <a
                        href={`https://openlibrary.org${selectedBook.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        <FaBookOpen className="mr-2" /> View on Open Library
                      </a>
                    </div>

                    <div className="mt-6">
                      <Link
                        to="/create-post"
                        state={{ bookData: selectedBook }}
                        className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        <FaThumbsUp className="mr-2" /> Create Post About This
                        Book
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookExplorer;
