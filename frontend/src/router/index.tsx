
import OrganizationList from "../features/organizations/pages/OrganizationList";
import { Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import ComingSoon from "../pages/ComingSoon";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />

        <Route path="organizations"element={<OrganizationList />}
/>

        <Route path="buildings" element={<ComingSoon title="Buildings" />} />

        <Route path="utilities" element={<ComingSoon title="Utilities" />} />

        <Route path="energy" element={<ComingSoon title="Energy Intelligence" />} />

        <Route path="hvac" element={<ComingSoon title="HVAC Analytics" />} />

        <Route path="electrical" element={<ComingSoon title="Electrical Analytics" />} />

        <Route path="water" element={<ComingSoon title="Water Analytics" />} />

        <Route path="carbon" element={<ComingSoon title="Carbon Accounting" />} />

        <Route path="esg" element={<ComingSoon title="ESG Reporting" />} />
      </Route>

      <Route path="/login" element={<Login />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}