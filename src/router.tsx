import Auth from "@/pages/Auth/Auth";
import { Routes, Route, Navigate } from "react-router-dom";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/auth" />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
};

export default AppRouter;
