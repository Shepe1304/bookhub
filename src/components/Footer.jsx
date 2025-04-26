import { FaBook, FaGithub, FaReact } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <FaBook className="text-blue-400 text-2xl mr-2" />
              <span className="text-xl font-bold">Shepe's BookHub</span>
            </Link>
            <p className="text-gray-400 mt-2">
              Share and discover your favorite books
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-4 mb-2">
              <a
                href="https://github.com/Shepe1304/BookCoverExplorer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://react.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaReact size={24} />
              </a>
            </div>
            <p className="text-gray-400 text-sm">
              Built with React & Tailwind CSS
            </p>
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Shepe's BookHub - All rights reserved
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-700 flex flex-col md:flex-row justify-center md:justify-between items-center">
          <nav className="flex flex-wrap justify-center mb-4 md:mb-0">
            <Link to="/" className="text-gray-400 hover:text-white mx-3 mb-2">
              Home
            </Link>
            <Link
              to="/book-explorer"
              className="text-gray-400 hover:text-white mx-3 mb-2"
            >
              Book Explorer
            </Link>
            <Link
              to="/about"
              className="text-gray-400 hover:text-white mx-3 mb-2"
            >
              About
            </Link>
          </nav>
          <p className="text-gray-500 text-sm">
            Using the Open Library API for book data
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
