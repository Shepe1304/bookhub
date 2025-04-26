import { Link } from "react-router-dom";
import { FaThumbsUp, FaComment, FaClock } from "react-icons/fa";

const PostCard = ({ post }) => {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Link to={`/post/${post.id}`} className="block">
      <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition duration-300 h-full border border-gray-200">
        {post.image_url && (
          <div className="h-48 overflow-hidden">
            <img
              src={post.image_url}
              alt={post.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/400x200?text=Book+Image";
              }}
            />
          </div>
        )}

        <div className="p-4">
          <h3 className="text-lg font-bold text-blue-800 mb-2 line-clamp-2">
            {post.title}
          </h3>

          {post.book_title && (
            <p className="text-sm text-gray-700 mb-2">
              <span className="font-medium">Book:</span> {post.book_title}
              {post.book_author && <span> by {post.book_author}</span>}
            </p>
          )}

          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <FaThumbsUp className="mr-1 text-blue-600" />
                {post.upvotes || 0}
              </span>
              <span className="flex items-center">
                <FaComment className="mr-1 text-blue-600" />
                {post.comment_count || 0}
              </span>
            </div>

            <span className="flex items-center">
              <FaClock className="mr-1" />
              {formatDate(post.created_at)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PostCard;
