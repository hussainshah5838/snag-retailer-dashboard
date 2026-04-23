import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import { PATHS } from "./paths";
import { isAuthenticated } from "../auth/api/auth.service";

// Auth
import Login from "../auth/Login";

// Layout
import AdminLayout from "../layouts/AdminLayout";

// Modules
import { Dashboard } from "../modules/dashboard";
import { RetailerManagement } from "../modules/retailer-management";
import { Offers } from "../modules/offers";
import { AudienceTargeting } from "../modules/audience-targeting";
import { PromotionLimits } from "../modules/promotion-limits";
import { Billing } from "../modules/billing";
import { LegalDocs } from "../modules/legal-docs";
import BulkUpload from "../modules/offers/bulk-upload/BulkUploadXlsx";
import Financials from "../modules/billing/Financials";
import ProfileSettings from "../modules/profile/ProfileSettings";
import RuntimeErrorBoundary from "../components/RuntimeErrorBoundary";

function RequireAuth() {
  const location = useLocation();
  
  if (!isAuthenticated()) {
    // Redirect to login with current location so we can redirect back after auth
    return (
      <Navigate to={PATHS.auth.login} state={{ from: location }} replace />
    );
  }
  
  return <Outlet />;
}

function AdminRoutes() {
  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth */}
        <Route path={PATHS.auth.login} element={<Login />} />

        {/* Protected admin area */}
        <Route element={<RequireAuth />}>
          <Route path={`${PATHS.admin.root}/*`} element={<AdminRoutes />}>
            <Route
              index
              element={<Navigate to={PATHS.admin.dashboard} replace />}
            />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="merchants" element={<RetailerManagement />} />
            <Route path="offers" element={<Offers />} />
            <Route path="offers/bulk" element={<BulkUpload />} />
            <Route path="audience" element={<AudienceTargeting />} />
            <Route path="promotion-limits" element={<PromotionLimits />} />
            <Route
              path="billing"
              element={
                <RuntimeErrorBoundary message={"Failed to load Billing"}>
                  <Billing />
                </RuntimeErrorBoundary>
              }
            />
            <Route path="billing/financials" element={<Financials />} />
            <Route path="profile" element={<ProfileSettings />} />
            <Route path="legal" element={<LegalDocs />} />
          </Route>
        </Route>

        {/* Fallback: send unauthenticated users to login */}
        <Route path="*" element={<Navigate to={PATHS.auth.login} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
