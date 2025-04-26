import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthRedirect = async () => {
      const { error } = await supabase.auth.exchangeCodeForSession();

      if (error) {
        console.error("Error parsing auth session:", error.message);
      }

      // After storing session, navigate to home
      navigate("/", { replace: true });
    };

    handleAuthRedirect();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Finishing login...</p>
    </div>
  );
};

export default AuthCallback;
