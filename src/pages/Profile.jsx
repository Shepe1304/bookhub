import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import PostCard from "../components/PostCard";

const Profile = ({ user }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        setPosts(data);
      }
    };

    fetchPosts();
  }, [user]);

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-gray-600">Loading Profile...</div>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col items-center">
        {/* {user.user_metadata?.avatar_url ? (
          <img
            src={user.user_metadata.avatar_url}
            alt="Avatar"
            className="w-24 h-24 rounded-full mb-4 object-cover"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold mb-4">
            {user.email.charAt(0).toUpperCase()}
          </div>
        )} */}

        <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-bold mb-4">
          {user.email.charAt(0).toUpperCase()}
        </div>

        {/* User Info */}
        <h1 className="text-2xl font-bold mb-2">
          {user.user_metadata?.full_name || "Unnamed User"}
        </h1>
        <div className="text-gray-600 mb-1">@{user.email?.split("@")[0]}</div>
        <div className="text-gray-500">{user.email}</div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Your Posts</h2>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 mt-12">
            You haven't posted anything yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
