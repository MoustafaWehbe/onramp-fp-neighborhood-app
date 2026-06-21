import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "../layouts/AppLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { Settings } from "../pages/dashboard/Settings";
import { NotFound } from "../pages/NotFound";
import { Feed } from "../pages/feed/Feed";
import { IssuePage } from "../pages/feed/IssuePage";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected app routes */}
      {/* <Route element={<ProtectedRoute />}> */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Feed />} />
        <Route path="/issue/:id" element={<IssuePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
      {/* </Route> */}

      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
