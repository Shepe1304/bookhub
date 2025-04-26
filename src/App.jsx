import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import BookExplorer from "./pages/BookExplorer";
import CreatePost from "./pages/CreatePost";
import PostDetail from "./pages/PostDetail";
import About from "./pages/About";
import { SignInPage, SignUpPage } from "./components/Auth";
import LoadingSpinner from "./components/LoadingSpinner";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (session) {
          setUser(session.user);
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          setUser(session.user);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const checkAndCreateTables = async () => {
    try {
      const { error: postsError } = await supabase
        .from("posts")
        .select("id")
        .limit(1);

      const { error: commentsError } = await supabase
        .from("comments")
        .select("id")
        .limit(1);

      console.log("Database connection verified");
    } catch (error) {
      console.error("Error connecting to database:", error);
    }
  };

  useEffect(() => {
    checkAndCreateTables();
  }, []);

  const PrivateRoute = ({ element, redirectTo = "/signin" }) => {
    return user ? element : <Navigate to={redirectTo} />;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router basename="/bookhub">
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar user={user} />
        <main className="flex-grow py-6 px-4 sm:px-6">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route
              path="/profile"
              element={<PrivateRoute element={<Profile user={user} />} />}
            />
            <Route
              path="/book-explorer"
              element={<BookExplorer user={user} />}
            />
            <Route
              path="/create-post"
              element={<PrivateRoute element={<CreatePost user={user} />} />}
            />
            <Route path="/post/:id" element={<PostDetail user={user} />} />
            <Route
              path="/edit/:id"
              element={
                <PrivateRoute
                  element={<PostDetail user={user} editMode={true} />}
                />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/signin" element={<SignInPage />} />
            <Route path="/signup" element={<SignUpPage />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
