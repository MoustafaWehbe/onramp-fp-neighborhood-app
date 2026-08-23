import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "../layouts/AppLayout";
import { AuthLayout } from "../layouts/AuthLayout";
import { Login } from "../pages/auth/Login";
import { Register } from "../pages/auth/Register";
import { Dashboard } from "../pages/dashboard/Dashboard";
import { Settings } from "../pages/dashboard/Settings";
import { NotFound } from "../pages/NotFound";

import { ReportIssue } from "../pages/issues/ReportIssue";
import { AuthorityWorkspace } from "../pages/issues/AuthorityWorkspace";
import { Feed } from "../pages/feed/Feed";
import { MyReports } from "../pages/feed/MyReports";
import { IssuePage } from "../pages/feed/IssuePage";
import { AdminUsers } from "@/pages/admin/AdminUsers";
import { AdminConsole } from "@/pages/admin/AdminConsole";
import { WorkQueue } from "@/pages/issues/WorkQueue";

export function AppRoutes() {
  return (
    <Routes>
      {/* Public auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Protected app routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/admin" element={<AdminConsole />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/" element={<Feed />} />
          <Route path="/issue/:id" element={<IssuePage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/report-issue" element={<ReportIssue />} />
          <Route path="/my-reports" element={<MyReports />} />
          <Route path="/worker-workspace" element={<AuthorityWorkspace />} />
          <Route path="/work-queue" element={<WorkQueue />} />
        </Route>
      </Route>
      {/* </Route> */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
