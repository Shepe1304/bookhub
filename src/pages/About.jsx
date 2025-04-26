import { Link } from "react-router-dom";
import { FaBook, FaGithub, FaReact, FaArrowRight } from "react-icons/fa";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        About Shepe's BookHub
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4">Welcome to Shepe's BookHub!</h2>
        <p className="mb-4">
          Shepe's BookHub is a platform for book lovers to discover, share, and
          discuss their favorite books. Whether you're looking for
          recommendations, want to share your thoughts on a recent read, or just
          browse through a collection of great books, Shepe's BookHub has you
          covered.
        </p>
        <p className="mb-4">
          This application was built as a final project for Codepath's
          Intermediate Web Development Course (WEB102), combining React,
          Tailwind CSS, and the Open Library API to create a seamless user
          experience for book enthusiasts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaBook className="text-blue-500 mr-2" /> Features
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Browse and search books from Open Library</li>
            <li>Create posts about your favorite books</li>
            <li>Comment on posts from other users</li>
            <li>Upvote posts you enjoy</li>
            <li>Sort and filter content based on popularity or recency</li>
            <li>Personalized user experience</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <FaReact className="text-blue-500 mr-2" /> Technology Stack
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>React for the frontend interface</li>
            <li>React Router for navigation</li>
            <li>Tailwind CSS for styling</li>
            <li>Supabase for database and authentication</li>
            <li>Open Library API for book data</li>
            <li>Vite for build tooling</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">How It Works</h2>
        <p className="mb-4">
          Shepe's BookHub integrates with the Open Library API to provide
          comprehensive information about books. Users can search for books,
          view details, and create posts to share their thoughts. The community
          aspect allows users to engage through comments and upvotes.
        </p>
        <p>
          All user data is stored securely in a Supabase database, ensuring a
          smooth and reliable experience.
        </p>
      </div>

      <div className="flex justify-center mt-8">
        <Link
          to="/book-explorer"
          className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start Exploring Books <FaArrowRight className="ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default About;
