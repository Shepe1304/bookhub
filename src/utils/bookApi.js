export const searchBooks = async (query, page = 1, limit = 12) => {
  if (!query || query.trim() === "") {
    throw new Error("Search query is required");
  }

  const offset = (page - 1) * limit;

  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(
        query
      )}&limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    return {
      books: data.docs.map((book) => ({
        id: book.key,
        title: book.title,
        author: book.author_name ? book.author_name[0] : "Unknown Author",
        cover_id: book.cover_i,
        cover_url: book.cover_i
          ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
          : null,
        first_publish_year: book.first_publish_year,
        language: book.language ? book.language[0] : null,
      })),
      total: data.numFound,
      page,
      limit,
    };
  } catch (error) {
    console.error("Error searching books:", error);
    throw error;
  }
};

export const getBookDetails = async (bookId) => {
  try {
    const worksId = bookId.replace("/works/", "");
    const response = await fetch(
      `https://openlibrary.org/works/${worksId}.json`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (
      data.description &&
      typeof data.description === "object" &&
      data.description.value
    ) {
      data.description = data.description.value;
    }

    return data;
  } catch (error) {
    console.error("Error fetching book details:", error);
    throw error;
  }
};

export const getPopularBooks = async (
  category = "fantasy fiction",
  page = 1,
  limit = 12
) => {
  return searchBooks(category, page, limit);
};
