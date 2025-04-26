import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import PostCard from "../components/PostCard";
import {
  FaSortAmountDown,
  FaSortAmountUp,
  FaClock,
  FaThumbsUp,
  FaSearch,
} from "react-icons/fa";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderBy, setOrderBy] = useState("created_at");
  const [ascending, setAscending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchPosts = async () => {
    setLoading(true);
    let query = supabase.from("posts").select("*");

    if (searchTerm) {
      query = query.ilike("title", `%${searchTerm}%`);
    }

    query = query.order(orderBy, { ascending });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching posts:", error);
    } else {
      setPosts(data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, [orderBy, ascending, searchTerm]);

  const handleSort = (column) => {
    if (orderBy === column) {
      setAscending(!ascending);
    } else {
      setOrderBy(column);
      setAscending(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      <section className="bg-blue-50 p-8 rounded-lg shadow-sm">
        <h1 className="text-3xl font-bold text-blue-800 mb-2">
          Welcome to Shepe's BookHub!
        </h1>
        <p className="text-gray-700">
          Share your favorite books, discover new reads, and join discussions
          with fellow book lovers.
        </p>
      </section>

      <section className="bg-white p-6 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => handleSort("created_at")}
              className={`flex items-center space-x-1 px-3 py-2 rounded ${
                orderBy === "created_at"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100"
              }`}
            >
              <FaClock />
              <span>Date</span>
              {orderBy === "created_at" &&
                (ascending ? (
                  <FaSortAmountUp className="ml-1" />
                ) : (
                  <FaSortAmountDown className="ml-1" />
                ))}
            </button>

            <button
              onClick={() => handleSort("upvotes")}
              className={`flex items-center space-x-1 px-3 py-2 rounded ${
                orderBy === "upvotes"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100"
              }`}
            >
              <FaThumbsUp />
              <span>Upvotes</span>
              {orderBy === "upvotes" &&
                (ascending ? (
                  <FaSortAmountUp className="ml-1" />
                ) : (
                  <FaSortAmountDown className="ml-1" />
                ))}
            </button>
          </div>

          <form onSubmit={handleSearch} className="w-full md:w-auto">
            <div className="flex items-center justify-center focus:border-none">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border rounded-l py-2 px-3 w-full md:w-64"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-3.25 rounded-r hover:bg-blue-700"
              >
                <FaSearch />
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-gray-500">
              No posts found. Be the first to create a post!
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
