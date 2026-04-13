import { createBrowserRouter, Navigate } from "react-router";
// Page imports
import Login from "./pages/Login";
import DashboardLayout from "./components/DashboardLayout";
import UserDashboard from "./pages/dashboards/UserDashboard";
import DepartmentDashboard from "./pages/dashboards/DepartmentDashboard";
// EntityAdminDashboard intentionally excluded - entity-admin now uses SuperAdminDashboard
import SuperAdminDashboard from "./pages/dashboards/SuperAdminDashboard";
import MonitoringDashboard from "./pages/dashboards/MonitoringDashboard";
import Organizations from "./pages/modules/Organizations";
import Departments from "./pages/modules/Departments";
import Users from "./pages/modules/Users";

import DataAccessRequests1 from "./pages/modules/DataAccessRequests1";

import MetadataManagement from "./pages/modules/MetadataManagement";
import EntityAccessMatrix from "./pages/modules/EntityAccessMatrix";
import ServicesAPIs from "./pages/modules/ServicesAPIs";
import RolesPermissions from "./pages/modules/RolesPermissions";
import Roles from "./pages/modules/Roles";
import Roles2 from "./pages/modules/Roles2";
import SecurityAccessGroup from "./pages/modules/SecurityAccessGroup";
import SpatialGroupSelection from "./pages/modules/SpatialGroupSelection";
import Downloads from "./pages/modules/Downloads";
import AuditLogs from "./pages/modules/AuditLogs";
import Applications from "./pages/modules/Applications";
import Settings from "./pages/modules/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: DashboardLayout,
    children: [
      // Default redirect
      {
        index: true,
        element: <Navigate to="/dashboard/super-admin" replace />,
      },
      // User Role Flow
      { 
        path: "user", 
        Component: UserDashboard 
      },
      { 
        path: "user/organizations", 
        Component: Organizations 
      },
      { 
        path: "user/departments", 
        Component: Departments 
      },
      { 
        path: "user/users", 
        Component: Users 
      },
      { 
        path: "user/data-requests1", 
        Component: DataAccessRequests1 
      },
      { 
        path: "user/metadata", 
        Component: MetadataManagement 
      },
      { 
        path: "user/entity-access-matrix", 
        Component: EntityAccessMatrix 
      },
      { 
        path: "user/services-apis", 
        Component: ServicesAPIs 
      },
      { 
        path: "user/roles", 
        Component: RolesPermissions 
      },
      { 
        path: "user/roles-management", 
        Component: Roles 
      },
      { 
        path: "user/roles2", 
        Component: Roles2 
      },
      { 
        path: "user/security-access-group", 
        Component: SecurityAccessGroup 
      },
      { 
        path: "user/permissions", 
        element: <Navigate to="/dashboard/user/security-access-group" replace /> 
      },
      { 
        path: "user/spatial-group-selection", 
        Component: SpatialGroupSelection 
      },
      { 
        path: "user/downloads", 
        Component: Downloads 
      },
      { 
        path: "user/audit-logs", 
        Component: AuditLogs 
      },
      { 
        path: "user/applications", 
        Component: Applications 
      },
      { 
        path: "user/settings", 
        Component: Settings 
      },

      // Department Reviewer Flow
      { 
        path: "department", 
        Component: DepartmentDashboard 
      },
      { 
        path: "department/organizations", 
        Component: Organizations 
      },
      { 
        path: "department/departments", 
        Component: Departments 
      },
      { 
        path: "department/users", 
        Component: Users 
      },
      { 
        path: "department/data-requests1", 
        Component: DataAccessRequests1 
      },
      { 
        path: "department/metadata", 
        Component: MetadataManagement 
      },
      { 
        path: "department/entity-access-matrix", 
        Component: EntityAccessMatrix 
      },
      { 
        path: "department/services-apis", 
        Component: ServicesAPIs 
      },
      { 
        path: "department/roles", 
        Component: RolesPermissions 
      },
      { 
        path: "department/roles-management", 
        Component: Roles 
      },
      { 
        path: "department/roles2", 
        Component: Roles2 
      },
      { 
        path: "department/security-access-group", 
        Component: SecurityAccessGroup 
      },
      { 
        path: "department/permissions", 
        element: <Navigate to="/dashboard/department/security-access-group" replace /> 
      },
      { 
        path: "department/spatial-group-selection", 
        Component: SpatialGroupSelection 
      },
      { 
        path: "department/downloads", 
        Component: Downloads 
      },
      { 
        path: "department/audit-logs", 
        Component: AuditLogs 
      },
      { 
        path: "department/applications", 
        Component: Applications 
      },
      { 
        path: "department/settings", 
        Component: Settings 
      },

      // Entity Admin Flow
      { 
        path: "entity-admin", 
        Component: SuperAdminDashboard 
      },
      // entity-admin/organizations — redirect to dashboard (Organizations page hidden for Organization Admin role)
      { 
        path: "entity-admin/organizations", 
        element: <Navigate to="/dashboard/entity-admin" replace /> 
      },
      { 
        path: "entity-admin/departments", 
        Component: Departments 
      },
      { 
        path: "entity-admin/users", 
        Component: Users 
      },
      { 
        path: "entity-admin/data-requests1", 
        Component: DataAccessRequests1 
      },
      { 
        path: "entity-admin/metadata", 
        Component: MetadataManagement 
      },
      { 
        path: "entity-admin/entity-access-matrix", 
        Component: EntityAccessMatrix 
      },
      { 
        path: "entity-admin/services-apis", 
        Component: ServicesAPIs 
      },
      { 
        path: "entity-admin/roles", 
        Component: RolesPermissions 
      },
      { 
        path: "entity-admin/roles-management", 
        Component: Roles 
      },
      { 
        path: "entity-admin/roles2", 
        Component: Roles2 
      },
      { 
        path: "entity-admin/security-access-group", 
        Component: SecurityAccessGroup 
      },
      { 
        path: "entity-admin/permissions", 
        element: <Navigate to="/dashboard/entity-admin/security-access-group" replace /> 
      },
      { 
        path: "entity-admin/spatial-group-selection", 
        Component: SpatialGroupSelection 
      },
      { 
        path: "entity-admin/downloads", 
        Component: Downloads 
      },
      { 
        path: "entity-admin/audit-logs", 
        Component: AuditLogs 
      },
      { 
        path: "entity-admin/applications", 
        Component: Applications 
      },
      { 
        path: "entity-admin/settings", 
        Component: Settings 
      },

      // Super Admin Flow
      { 
        path: "super-admin", 
        Component: SuperAdminDashboard 
      },
      { 
        path: "super-admin/organizations", 
        Component: Organizations 
      },
      { 
        path: "super-admin/departments", 
        Component: Departments 
      },
      { 
        path: "super-admin/users", 
        Component: Users 
      },
      { 
        path: "super-admin/data-requests1", 
        Component: DataAccessRequests1 
      },
      { 
        path: "super-admin/metadata", 
        Component: MetadataManagement 
      },
      { 
        path: "super-admin/entity-access-matrix", 
        Component: EntityAccessMatrix 
      },
      { 
        path: "super-admin/services-apis", 
        Component: ServicesAPIs 
      },
      { 
        path: "super-admin/roles", 
        Component: RolesPermissions 
      },
      { 
        path: "super-admin/roles-management", 
        Component: Roles 
      },
      { 
        path: "super-admin/roles2", 
        Component: Roles2 
      },
      { 
        path: "super-admin/security-access-group", 
        Component: SecurityAccessGroup 
      },
      { 
        path: "super-admin/permissions", 
        element: <Navigate to="/dashboard/super-admin/security-access-group" replace /> 
      },
      { 
        path: "super-admin/spatial-group-selection", 
        Component: SpatialGroupSelection 
      },
      { 
        path: "super-admin/downloads", 
        Component: Downloads 
      },
      { 
        path: "super-admin/audit-logs", 
        Component: AuditLogs 
      },
      { 
        path: "super-admin/applications", 
        Component: Applications 
      },
      { 
        path: "super-admin/settings", 
        Component: Settings 
      },

      // Reviewer Flow (Duplicate of Super Admin)
      { 
        path: "reviewer", 
        Component: SuperAdminDashboard 
      },
      { 
        path: "reviewer/organizations", 
        Component: Organizations 
      },
      { 
        path: "reviewer/departments", 
        Component: Departments 
      },
      { 
        path: "reviewer/users", 
        Component: Users 
      },
      { 
        path: "reviewer/data-requests1", 
        Component: DataAccessRequests1 
      },
      { 
        path: "reviewer/metadata", 
        Component: MetadataManagement 
      },
      { 
        path: "reviewer/entity-access-matrix", 
        Component: EntityAccessMatrix 
      },
      { 
        path: "reviewer/services-apis", 
        Component: ServicesAPIs 
      },
      { 
        path: "reviewer/roles", 
        Component: RolesPermissions 
      },
      { 
        path: "reviewer/roles-management", 
        Component: Roles 
      },
      { 
        path: "reviewer/roles2", 
        Component: Roles2 
      },
      { 
        path: "reviewer/security-access-group", 
        Component: SecurityAccessGroup 
      },
      { 
        path: "reviewer/permissions", 
        element: <Navigate to="/dashboard/reviewer/security-access-group" replace /> 
      },
      { 
        path: "reviewer/spatial-group-selection", 
        Component: SpatialGroupSelection 
      },
      { 
        path: "reviewer/downloads", 
        Component: Downloads 
      },
      { 
        path: "reviewer/audit-logs", 
        Component: AuditLogs 
      },
      { 
        path: "reviewer/applications", 
        Component: Applications 
      },
      { 
        path: "reviewer/settings", 
        Component: Settings 
      },

      // Monitoring Flow
      { 
        path: "monitoring", 
        Component: MonitoringDashboard 
      },
      { 
        path: "monitoring/organizations", 
        Component: Organizations 
      },
      { 
        path: "monitoring/departments", 
        Component: Departments 
      },
      { 
        path: "monitoring/users", 
        Component: Users 
      },
      { 
        path: "monitoring/metadata", 
        Component: MetadataManagement 
      },
      { 
        path: "monitoring/entity-access-matrix", 
        Component: EntityAccessMatrix 
      },
      { 
        path: "monitoring/services-apis", 
        Component: ServicesAPIs 
      },
      { 
        path: "monitoring/roles", 
        Component: RolesPermissions 
      },
      { 
        path: "monitoring/roles-management", 
        Component: Roles 
      },
      { 
        path: "monitoring/roles2", 
        Component: Roles2 
      },
      { 
        path: "monitoring/security-access-group", 
        Component: SecurityAccessGroup 
      },
      { 
        path: "monitoring/permissions", 
        element: <Navigate to="/dashboard/monitoring/security-access-group" replace /> 
      },
      { 
        path: "monitoring/spatial-group-selection", 
        Component: SpatialGroupSelection 
      },
      { 
        path: "monitoring/downloads", 
        Component: Downloads 
      },
      { 
        path: "monitoring/audit-logs", 
        Component: AuditLogs 
      },
      { 
        path: "monitoring/applications", 
        Component: Applications 
      },
      { 
        path: "monitoring/settings", 
        Component: Settings 
      },
    ],
  },
]);