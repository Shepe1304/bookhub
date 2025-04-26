import { useState } from "react";
import { FaTrash, FaClock } from "react-icons/fa";

const CommentCard = ({ comment, currentUserId, onDelete }) => {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const formatDate = (dateString) => {
    const options = {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      onDelete();
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border">
      <div className="flex justify-between items-start">
        <div className="flex items-center text-gray-500 text-sm">
          <FaClock className="mr-1" />
          <span>{formatDate(comment.created_at)}</span>
        </div>

        {comment.user_id === currentUserId && (
          <div>
            {confirmDelete ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-red-600">Delete?</span>
                <button
                  onClick={handleDelete}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Yes
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  No
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-gray-400 hover:text-red-600"
              >
                <FaTrash size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-2 text-gray-800">
        {comment.content
          .split("\n")
          .map((paragraph, i) =>
            paragraph ? <p key={i}>{paragraph}</p> : <br key={i} />
          )}
      </div>
    </div>
  );
};

export default CommentCard;
