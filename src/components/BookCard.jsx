import { useState } from "react";
import { FaBookOpen, FaThumbsUp } from "react-icons/fa";
import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="h-56 bg-gray-200 flex items-center justify-center">
        {book.cover_url && !imageError ? (
          <img
            src={book.cover_url}
            alt={book.title}
            className="h-full w-full object-cover"
            onError={handleImageError}
          />
        ) : (
          <div className="flex flex-col items-center text-gray-500">
            <FaBookOpen className="w-12 h-12 mb-2" />
            <span>No Cover</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-1">By {book.author}</p>
        {book.first_publish_year && (
          <p className="text-gray-500 text-xs">
            Published: {book.first_publish_year}
          </p>
        )}
      </div>
    </div>
  );
};

export default BookCard;
