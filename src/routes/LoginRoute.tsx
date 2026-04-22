import { Navigate, Outlet } from "react-router-dom";
import { HashLoader } from "react-spinners";
import { useAuth } from "@/hooks/useAuth";

const LoginRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-10">
        <HashLoader color="#1e90ff" loading={loading} size={60} />
        <p className="text-brand-blue text-sm mt-5">
          Checking authentication...
        </p>
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  return <Outlet />;
};

export default LoginRoute;
