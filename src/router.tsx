import Auth from "@pages/Auth/Auth";
import { Routes, Route, Navigate } from "react-router-dom";
import DefaultLayout from "@/layouts/Default";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<Navigate to="/auth" />} />
        <Route path="auth" element={<Auth />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
