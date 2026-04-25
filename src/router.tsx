import Auth from "@pages/Auth/Auth";
import { Routes, Route, Navigate } from "react-router-dom";
import DefaultLayout from "@/layouts/Default";
import DashboardLayout from "@/layouts/DashboardLayout";
import Overview from "@/pages/Dashboard/Overview";
import LoginRoute from "@/routes/LoginRoute";
import NotFound from "@/components/NotFound/NotFound";
import Projects from "@/pages/Dashboard/Projects";
import ProjectIndex from "@/features/projects/Index";
import Services from "@/pages/Dashboard/Services";
import ServiceIndex from "@/features/services/Index";

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
            <Route path="projects/:id" element={<ProjectIndex />} />
            <Route path="services" element={<Services />} />
            {/* prettier-ignore */}
            <Route path="services/:projectId/:serviceId" element={<ServiceIndex />} />
          </Route>
        </Route>

        {/* Catch-all 404 route */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
