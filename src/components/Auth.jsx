import { useState } from "react";
import { supabase } from "../supabaseClient";
import { FaEnvelope, FaLock, FaUser, FaGoogle, FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const SignIn = ({ onSignIn }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (onSignIn) onSignIn(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        // options: {
        //   redirectTo: window.location.origin,
        // },
        // options: {
        //   redirectTo: `${window.location.origin}/bookhub/`,
        // },
        options: {
          redirectTo:
            window.location.hostname === "localhost"
              ? "http://localhost:5173/bookhub/auth/callback"
              : "https://shepe1304.github.io/bookhub/auth/callback",
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSignIn}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">
              <FaEnvelope />
            </span>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">
              <FaLock />
            </span>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-300 flex-grow"></div>
          <div className="mx-4 text-gray-500">or</div>
          <div className="border-t border-gray-300 flex-grow"></div>
        </div>

        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={() => handleOAuthSignIn("google")}
            className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
          >
            <FaGoogle className="mr-2 text-red-500" />
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignIn("github")}
            className="w-full flex items-center justify-center bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900"
          >
            <FaGithub className="mr-2" />
            Continue with GitHub
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-gray-600">
        Don't have an account?{" "}
        <a href="/signup" className="text-blue-600 hover:underline">
          Sign up
        </a>
      </p>
    </div>
  );
};

export const SignUp = ({ onSignUp }) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
        },
      });

      if (error) throw error;

      if (onSignUp) onSignUp(data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthSignIn = async (provider) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        // options: {
        //   redirectTo: window.location.origin,
        // },
        // options: {
        //   redirectTo: `${window.location.origin}/bookhub/`,
        // },
        options: {
          redirectTo:
            window.location.hostname === "localhost"
              ? "http://localhost:5173/bookhub/auth/callback"
              : "https://shepe1304.github.io/bookhub/auth/callback",
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSignUp}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700 mb-2">
            Username
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">
              <FaUser />
            </span>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="YourUsername"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">
              <FaEnvelope />
            </span>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">
              <FaLock />
            </span>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">
              <FaLock />
            </span>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative flex items-center justify-center">
          <div className="border-t border-gray-300 flex-grow"></div>
          <div className="mx-4 text-gray-500">or</div>
          <div className="border-t border-gray-300 flex-grow"></div>
        </div>

        <div className="mt-4 space-y-3">
          <button
            type="button"
            onClick={() => handleOAuthSignIn("google")}
            className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
          >
            <FaGoogle className="mr-2 text-red-500" />
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => handleOAuthSignIn("github")}
            className="w-full flex items-center justify-center bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-900"
          >
            <FaGithub className="mr-2" />
            Continue with GitHub
          </button>
        </div>
      </div>

      <p className="mt-6 text-center text-gray-600">
        Already have an account?{" "}
        <a href="/signin" className="text-blue-600 hover:underline">
          Sign in
        </a>
      </p>
    </div>
  );
};

export const ProfileMenu = ({ user, onSignOut }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      if (onSignOut) onSignOut();
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      await supabase.auth._removeSession();
      navigate("/");
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
      >
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium focus:outline-none">
          {user.email.charAt(0).toUpperCase()}
        </div>
        <span className="text-white focus:outline-none">
          {user.user_metadata?.username || user.email.split("@")[0]}
        </span>
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 py-2 bg-white rounded-md shadow-xl z-20"
          style={{ boxShadow: "0 0 10px rgba(0,0,0,0.5)" }}
        >
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export const SignInPage = () => {
  const navigate = useNavigate();

  const handleSignIn = (user) => {
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <SignIn onSignIn={handleSignIn} />
    </div>
  );
};

export const SignUpPage = () => {
  const navigate = useNavigate();

  const handleSignUp = (user) => {
    navigate("/");
  };

  return (
    <div className="max-w-4xl mx-auto py-12">
      <SignUp onSignUp={handleSignUp} />
    </div>
  );
};
