import Auth from "@pages/Auth/Auth";
import { Routes, Route, Navigate } from "react-router-dom";
import DefaultLayout from "@/layouts/Default";
import DashboardLayout from "@/layouts/DashboardLayout";
import Overview from "@/pages/Dashboard/Overview";
import LoginRoute from "@/routes/LoginRoute";
import NotFound from "@/components/NotFound/NotFound";
import Projects from "@/pages/Dashboard/Projects";
import Project from "@/components/projects/Project";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<DefaultLayout />}>
        <Route index element={<Navigate to="/auth" />} />
        <Route path="auth" element={<Auth />} />

        {/* Protected routes */}
        <Route element={<LoginRoute />}>
          {/* Dashboard routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Overview />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/:id" element={<Project />} />
          </Route>
        </Route>

        {/* Catch-all 404 route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
