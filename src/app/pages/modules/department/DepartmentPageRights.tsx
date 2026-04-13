import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Card } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../../components/ui/dialog";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { FileText, CheckCircle, Clock, XCircle, Search, X, ChevronDown, ChevronUp, Upload, Trash2, Download, Calendar, Hand, Map, Check, Info, Plus, Building2 } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../components/ui/tooltip";
import { Input } from "../../../components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover";
import { PageHeader } from "../../../components/PageHeader";
import { MetricCard } from "../../../components/ui/MetricCard";
import { toast } from "sonner";

// Mock data for pending requests
const pendingRequests = [
  { 
    id: "REQ-3042-992", 
    organization: "Transport Authority",
    description: "New Organization Registration",
    submittedBy: "Sana Mohammad", 
    date: "16 Mar 2026", 
    status: "pending" 
  },
  { 
    id: "REQ-3042-991", 
    organization: "Ministry of Health",
    description: "Health Data Access Request",
    submittedBy: "Ahmed Al-Harqani", 
    date: "15 Mar 2026", 
    status: "pending" 
  },
  { 
    id: "REQ-3042-990", 
    organization: "Survey.bh",
    description: "Survey Data Registration",
    submittedBy: "Fahim Hassan", 
    date: "14 Mar 2026", 
    status: "pending" 
  },
];

// Mock data for completed requests
const completedRequests = [
  { 
    id: "REQ-3042-989", 
    organization: "Urban Planning Authority",
    description: "Boundary Data Update",
    submittedBy: "Layla Ahmed", 
    date: "13 Mar 2026", 
    status: "approved" 
  },
  { 
    id: "REQ-3042-988", 
    organization: "Environmental Agency",
    description: "Environmental Data Access",
    submittedBy: "Jawaher Rashed", 
    date: "12 Mar 2026", 
    status: "approved" 
  },
];

// Mock data for department pending requests
const departmentPendingRequests = [
  { 
    id: "DEPT-3042-992", 
    departmentNameEn: "GIS Operations Unit",
    departmentNameAr: "وحدة عمليات نظم المعلومات الجغرافية",
    type: "Create",
    organization: "Transport Authority",
    pointOfContact: "Jawaher Rashed",
    businessDescription: "Responsible for managing and maintaining GIS infrastructure, spatial data operations, and technical support for mapping services across the organization.",
    submittedBy: "Lulwa Saad Mujaddam",
    date: "16 Mar 2026", 
    status: "pending" 
  },
  { 
    id: "DEPT-3042-991", 
    departmentNameEn: "Spatial Data Management",
    departmentNameAr: "إدارة البيانات المكانية",
    type: "Create",
    organization: "Min. of Municipalities",
    pointOfContact: "Rana A.Majeed",
    businessDescription: "Manages spatial data collection, validation, and distribution for municipal planning and development projects.",
    submittedBy: "Muneera Khamis",
    date: "15 Mar 2026", 
    status: "pending" 
  },
];

// Mock data for department completed requests
const departmentCompletedRequests = [
  { 
    id: "DEPT-3042-889", 
    departmentNameEn: "Road Network Studies",
    departmentNameAr: "دراسات شبكة الطرق",
    type: "Create",
    organization: "Works Authority",
    pointOfContact: "Omar Rashid",
    businessDescription: "Conducts comprehensive studies on road network development, traffic flow analysis, and infrastructure planning.",
    submittedBy: "Venkatesh Munusamy",
    date: "14 Mar 2026", 
    status: "approved" 
  },
];

// Mock data for user pending requests
const userPendingRequests = [
  { 
    id: "USR-3042-931", 
    userNameEn: "Mariam Al-Zayani",
    userNameAr: "مريم الزياني",
    email: "mariam.alzayani@transport.gov.bh",
    mobile: "+973 3344 5566",
    type: "Create",
    organization: "Transport Authority",
    department: "GIS Operations", 
    role: "Viewer",
    designation: "GIS Analyst",
    cpr: "980123456",
    employeeID: "EMP-2024-1234",
    startDate: "2024-03-15",
    endDate: "2025-03-14",
    submittedBy: "Lulwa Saad Mujaddam",
    date: "1 hour ago", 
    status: "pending" 
  },
  { 
    id: "USR-3042-932", 
    userNameEn: "Abdullah Hasan",
    userNameAr: "عبدالله حسن",
    email: "abdullah.hasan@municipalities.gov.bh",
    mobile: "+973 3355 6677",
    type: "Create",
    organization: "Min. of Municipalities",
    department: "Spatial Data Mgmt", 
    role: "Editor",
    designation: "Senior Data Manager",
    cpr: "950234567",
    employeeID: "EMP-2024-5678",
    startDate: "2024-03-20",
    endDate: "2025-03-19",
    submittedBy: "Jawaher Rashed",
    date: "3 hours ago", 
    status: "in-review" 
  },
];

// Mock data for user completed requests
const userCompletedRequests = [
  { 
    id: "USR-3042-929", 
    userNameEn: "Yousif Al-Doseri",
    userNameAr: "يوسف الدوسري",
    email: "yousif.aldoseri@works.gov.bh",
    mobile: "+973 3366 7788",
    type: "Create",
    organization: "Works Authority",
    department: "Royal Networks", 
    role: "Administrator",
    designation: "Network Operations Manager",
    cpr: "920345678",
    employeeID: "EMP-2024-9012",
    startDate: "2024-03-01",
    endDate: "2025-02-28",
    submittedBy: "Muneera Khamis",
    date: "2 days ago", 
    status: "approved" 
  },
];

// Mock data for data access pending requests
const dataAccessPendingRequests = [
  { 
    id: "DAE-3042-893", 
    service: "Road Network - WMS",
    serviceDescription: "Web Feature Service - Internal",
    requestor: "Sara Mohammad",
    organization: "Transport Authority", 
    date: "3 hours ago", 
    status: "pending" 
  },
  { 
    id: "DAE-3042-894", 
    service: "Building Footprints - WFS",
    serviceDescription: "Web Feature Service - External",
    requestor: "Ahmed Al-Harqani",
    organization: "Min. of Municipalities", 
    date: "4 hours ago", 
    status: "pending" 
  },
];

// Mock data for data access forwarded requests
const dataAccessForwardedRequests = [
  { 
    id: "DAE-3042-941", 
    service: "Utility Networks - WMS",
    serviceDescription: "Infrastructure",
    requestor: "Khalid Al-Tayar",
    organization: "BAPCO",
    dataOwners: ["Jawaher Rashed", "Lulwa Saad Mujaddam"],
    workflow: ["Submitted", "GIS Review", "Data Owner", "Delivery"]
  },
  { 
    id: "DAE-3042-942", 
    service: "Land Parcels - Feature Service",
    serviceDescription: "Cadastre",
    requestor: "Fatima Al-Hariri",
    organization: "Survey & Land Registration",
    dataOwners: ["Omar Al-Ansari", "Layla Al-Qassimi", "Yousif Al-Mahmood"],
    workflow: ["Submitted", "GIS Review", "Data Owner", "Delivery"]
  },
  { 
    id: "DAE-3042-943", 
    service: "Road Network - Map Service",
    serviceDescription: "Transportation",
    requestor: "Mohammed Al-Baker",
    organization: "Transport Authority",
    dataOwners: ["Khalid Al-Zayani"],
    workflow: ["Submitted", "GIS Review", "Data Owner", "Delivery"]
  },
  { 
    id: "DAE-3042-944", 
    service: "Building Permits - WFS",
    serviceDescription: "Urban Planning",
    requestor: "Noor Al-Hashimi",
    organization: "Min. of Municipalities",
    dataOwners: ["Lulwa Saad Mujaddam", "Jawaher Rashed"],
    workflow: ["Submitted", "GIS Review", "Data Owner", "Delivery"]
  },
  { 
    id: "DAE-3042-945", 
    service: "Environmental Zones - WMS",
    serviceDescription: "Environment",
    requestor: "Ali Al-Dosari",
    organization: "Environmental Agency",
    dataOwners: ["Fatima Al-Mansoori", "Omar Al-Ansari"],
    workflow: ["Submitted", "GIS Review", "Data Owner", "Delivery"]
  },
];

// Mock data for data access completed requests
const dataAccessCompletedRequests = [
  { 
    id: "DAE-3042-941", 
    service: "Utility Networks - WMS",
    serviceDescription: "Infrastructure",
    requestor: "Khalid Al-Tayar",
    organization: "BAPCO",
    workflow: ["Submitted", "GIS Review", "Data Owner", "Delivery"]
  },
];

// Mock data for spatial permission creation pending requests (User/Owner → IGA Review → Created)
const spatialPermissionPendingRequests = [
  { 
    id: "SPC-2024-021", 
    permissionName: "GIS Data Access",
    permissionSubtitle: "ID: 1",
    organization: "Transport Authority",
    layers: "3 Layers",
    boundary: "Bahrain Full Extent",
    date: "2 hours ago", 
    status: "pending" 
  },
  { 
    id: "SPC-2024-022", 
    permissionName: "Aerial View Access",
    permissionSubtitle: "ID: 2",
    organization: "Ministry of Health",
    layers: "11 Layers",
    boundary: "Northern Governorate",
    date: "5 hours ago", 
    status: "in-review" 
  },
];

// Mock data for spatial permission creation completed requests
const spatialPermissionCompletedRequests = [
  { 
    id: "SPC-2024-018", 
    permissionName: "Cadastral Access",
    permissionSubtitle: "",
    organization: "Survey Bureau",
    layers: "5 Layers",
    boundary: "Muharraq Governorate",
    date: "3 days ago", 
    status: "created" 
  },
];

// Mock data for user spatial permission update pending requests (Dept. Team → Users → IGA Approval)
const spatialPermissionUserUpdatePendingRequests = [
  { 
    id: "SPU-2024-014", 
    user: "Noura Al-Khalifa",
    userEmail: "noura.k@bswa.bh",
    permission: "GIS Data Access",
    changeType: "Add",
    department: "Urban Planning",
    date: "1 hour ago", 
    status: "pending" 
  },
  { 
    id: "SPU-2024-015", 
    user: "Yousif Al-Dossari",
    userEmail: "y.dossari@works.bh",
    permission: "Aerial View Access",
    changeType: "Modify",
    department: "Road Network",
    date: "3 hours ago", 
    status: "in-review" 
  },
];

// Mock data for user spatial permission update completed requests
const spatialPermissionUserUpdateCompletedRequests = [
  { 
    id: "SPU-2024-012", 
    user: "Ahmed Al-Mannai",
    userEmail: "ahmed.m@survey.bh",
    permission: "GIS Data Access",
    changeType: "Add",
    department: "Mapping",
    date: "4 days ago", 
    status: "completed" 
  },
];

// Mock data for spatial permission change requests
const spatialPermissionChangeRequests = [
  { 
    id: "SPY-2043-012", 
    user: "Ahmed Al-Mansoori",
    permission: "GIS Data Access",
    changeType: "Add",
    date: "6 days ago", 
    status: "completed" 
  },
];

// Mock data for services creation pending requests
const servicesCreationPendingRequests = [
  { 
    id: "SVC-2042-987", 
    serviceName: "WMS - Sewerage Network Tiles",
    url: "https://api.bsdi.gov.bh/wms/sewerage",
    description: "Web Map Service for sewerage network infrastructure visualization",
    type: "WMS",
    organization: "Electricity & Water Authority",
    department: "Infrastructure Department",
    endpoint: "/api/v1/wms/sewerage",
    authType: "OAuth 2.0",
    visibility: "Internal",
    requestor: "Jawaher Rashed",
    date: "1 hour ago", 
    status: "pending" 
  },
  { 
    id: "SVC-2042-986", 
    serviceName: "WFS - Building Footprints",
    url: "https://api.bsdi.gov.bh/wfs/buildings",
    description: "Web Feature Service providing building footprint data for urban planning",
    type: "WFS",
    organization: "Survey & Land Registration Bureau",
    department: "GIS Department",
    endpoint: "/api/v1/wfs/buildings",
    authType: "API Key",
    visibility: "Public",
    requestor: "Sara Abdulla",
    date: "3 hours ago", 
    status: "in-review" 
  },
];

// Mock data for services creation completed requests
const servicesCreationCompletedRequests = [
  { 
    id: "SVC-2042-985", 
    serviceName: "WMTS - Orthophoto Basemap",
    url: "https://api.bsdi.gov.bh/wmts/ortho",
    description: "Web Map Tile Service for high-resolution orthophotography",
    type: "WMTS",
    organization: "Ministry of Works",
    department: "Mapping Department",
    endpoint: "/api/v1/wmts/ortho",
    authType: "Bearer Token",
    visibility: "Internal",
    requestor: "Khalid Mohamed",
    date: "3 days ago", 
    status: "completed" 
  },
];

// Mock data for data download pending requests
const dataDownloadPendingRequests = [
  { 
    id: "DL-2042-913", 
    dataset: "Road Network - Full",
    format: "Shapefile",
    requestor: "Sara Mohammad",
    description: "Complete road network dataset for transportation planning",
    email: "sara.mohammad@transport.gov.bh",
    size: "~340 MB",
    date: "2+ ago", 
    status: "pending" 
  },
  { 
    id: "DL-2042-914", 
    dataset: "Building Footprints",
    format: "GeoJSON",
    requestor: "Ahmad Al-Kharus",
    description: "Building footprints for urban development analysis",
    email: "ahmad.alkharus@planning.gov.bh",
    size: "~62 MB",
    date: "4+ ago", 
    status: "pending" 
  },
];

// Mock data for data download forwarded requests
const dataDownloadForwardedRequests = [
  { 
    id: "DL-2042-912", 
    dataset: "Utility Networks",
    format: "Shapefile",
    product: "Plugins",
    requestor: "Khalid K. Fars",
    dataOwners: ["Ministry of Works"],
    workflow: ["Submitted", "Processed", "Approved"]
  },
];

// Mock data for data download completed requests
const dataDownloadCompletedRequests = [
  { 
    id: "DIM-2045-914", 
    dataset: "Parcel Boundaries",
    format: "KML",
    requestor: "Muneera Khamis",
    date: "5 days ago", 
    status: "completed" 
  },
];

// Mock data for metadata pending requests
const metadataPendingRequests = [
  { 
    id: "META-2042-989", 
    layerName: "Topographic Database",
    layerSubtitle: "Layer - Vector",
    metadataType: "ISO 3946",
    requestor: "Maryam Al-Jayed",
    date: "1 hour ago", 
    status: "pending" 
  },
  { 
    id: "META-2043-916", 
    layerName: "Satellite Imagery",
    layerSubtitle: "Layer - Raster",
    metadataType: "Dublin Core",
    requestor: "Abdullah Yawar",
    date: "5 hours ago", 
    status: "pending" 
  },
  { 
    id: "META-2042-911", 
    layerName: "Flood Hazard Zones",
    layerSubtitle: "Layer - Vector",
    metadataType: "ISO 3946",
    requestor: "Noura Al-Khalifa",
    date: "Yesterday", 
    status: "in-review" 
  },
];

// Mock data for metadata completed requests
const metadataCompletedRequests = [
  { 
    id: "META-2043-907", 
    layerName: "Land Use 2023",
    layerSubtitle: "Layer - Polygon",
    metadataType: "ISO 19915",
    requestor: "Yusuf Al-Doseri",
    date: "3 days ago", 
    status: "completed" 
  },
  { 
    id: "META-2043-903", 
    layerName: "Road Centerlines",
    layerSubtitle: "Layer - Line",
    metadataType: "FGDC",
    requestor: "Sara Mohammad",
    date: "6 days ago", 
    status: "completed" 
  },
];

// Mock data for application user pending requests
const appUserPendingRequests = [
  { 
    id: "APP-3042-125", 
    userName: "Ahmed Al-Mansouri",
    email: "ahmed.mansouri@gov.bh",
    organization: "Ministry of Works",
    department: "GIS Department",
    role: "GIS Analyst",
    requestedDate: "18 Mar 2025",
    submittedBy: "Lulwa Saad Mujaddam",
    status: "pending" 
  },
  { 
    id: "APP-3042-124", 
    userName: "Fatima Al-Khalifa",
    email: "fatima.khalifa@gov.bh",
    organization: "Transport Authority",
    department: "Data Management",
    role: "Data Reviewer",
    requestedDate: "17 Mar 2025",
    submittedBy: "Rana A.Majeed",
    status: "pending" 
  },
];

// Mock data for application user completed requests
const appUserCompletedRequests = [
  { 
    id: "APP-3042-123", 
    userName: "Mohammed Al-Baker",
    email: "mohammed.baker@gov.bh",
    organization: "Urban Planning Authority",
    department: "Planning Department",
    role: "Department Admin",
    requestedDate: "15 Mar 2025",
    approvedDate: "20 Mar 2025",
    approvedBy: "Layla Al-Qassimi",
    submittedBy: "Jawaher Rashed",
    status: "approved" 
  },
  { 
    id: "APP-3042-122", 
    userName: "Noura Al-Hashimi",
    email: "noura.hashimi@gov.bh",
    organization: "Environmental Agency",
    department: "Data Services",
    role: "Organization User",
    requestedDate: "14 Mar 2025",
    approvedDate: "19 Mar 2025",
    approvedBy: "Yousif Al-Mahmood",
    submittedBy: "Ahmed Al-Harqani",
    status: "approved" 
  },
];

// Mock data for user request groups (matching saved user groups structure)
const userRequestGroups = [
  {
    id: "GRP-001",
    usersCount: 4,
    dateCreated: "16 Mar 2026",
    submittedBy: "Lulwa Saad Mujaddam",
    status: "pending",
    fileName: "user_group_001.pdf",
    fileSize: "245 KB",
    users: [
      { id: 1, name: "Jawaher Rashed", email: "jawaher_rashed@gov.bh", role: "Department Admin, GIS Analyst, Data Reviewer", department: "IT Department", organization: "Ministry of Works" },
      { id: 2, name: "Lulwa Saad Mujaddam", email: "sara.mohammed@gov.bh", role: "GIS Analyst, Data Reviewer", department: "GIS Department", organization: "Ministry of Works" },
      { id: 3, name: "Rana A.Majeed", email: "khalid.ali@gov.bh", role: "Data Reviewer", department: "Planning Department", organization: "Ministry of Works" },
      { id: 4, name: "Muneera Khamis", email: "fatima.hassan@gov.bh", role: "Organization User, Department Admin", department: "IT Department", organization: "Ministry of Works" },
    ]
  },
  {
    id: "GRP-002",
    usersCount: 3,
    dateCreated: "15 Mar 2026",
    submittedBy: "Ahmed Al-Harqani",
    status: "pending",
    fileName: "access_request_002.pdf",
    fileSize: "189 KB",
    users: [
      { id: 5, name: "Mohammed Ali", email: "mohammed.ali@gov.bh", role: "GIS Analyst, Data Manager", department: "GIS Department", organization: "Ministry of Works" },
      { id: 6, name: "Noora Ahmed", email: "noora.ahmed@gov.bh", role: "Data Manager, System Administrator", department: "IT Department", organization: "Ministry of Works" },
      { id: 7, name: "Ali Hassan", email: "ali.hassan@gov.bh", role: "System Administrator", department: "IT Department", organization: "Ministry of Works" },
    ]
  },
  {
    id: "GRP-003",
    usersCount: 2,
    dateCreated: "14 Mar 2026",
    submittedBy: "Jawaher Rashed",
    status: "completed",
    fileName: "approved_group_003.pdf",
    fileSize: "132 KB",
    users: [
      { id: 8, name: "Maryam Saleh", email: "maryam.saleh@gov.bh", role: "GIS Analyst, Department Admin, Data Reviewer", department: "GIS Department", organization: "Ministry of Works" },
      { id: 9, name: "Omar Abdullah", email: "omar.abdullah@gov.bh", role: "Department Admin", department: "Planning Department", organization: "Ministry of Works" },
    ]
  },
];

// Filter user request groups by status
const userRequestPendingGroups = userRequestGroups.filter(g => g.status === "pending");
const userRequestCompletedGroups = userRequestGroups.filter(g => g.status === "completed");

export default function DepartmentPageRights() {
  const location = useLocation();
  const navigate = useNavigate();
  const isReviewer = location.pathname.includes("/reviewer");
  const isOrgAdmin = location.pathname.includes("/entity-admin");
  const isDeptAdmin = location.pathname.includes("/department-admin");
  const adminName = "Jawaher Rashed";
  const adminOrg = "BSDI";
  const adminDept = "GIS Department";

  // RBAC Filtering Logic - Department Level
  const getFilteredRequests = (requests: any[]) => {
    // For Department Admin, only show requests related to their department
    if (isDeptAdmin) {
      return requests.filter(req => {
        const deptMatch = req.department === adminDept || req.departmentNameEn === adminDept;
        const orgMatch = req.organization === adminOrg;
        return deptMatch || (orgMatch && (req.submittedBy === adminName || req.requestor === adminName));
      });
    }
    
    if (!isOrgAdmin) return requests;
    return requests.filter(req => {
      const orgMatch = req.organization === adminOrg;
      const submitterMatch = (req.submittedBy === adminName) || (req.requestor === adminName);
      const ownerMatch = req.dataOwners?.includes(adminName);
      return orgMatch || submitterMatch || ownerMatch;
    });
  };

  // Filtered Lists for Org Admin
  const filteredPendingRequests = getFilteredRequests(pendingRequests);
  const filteredCompletedRequests = getFilteredRequests(completedRequests);
  const filteredDeptPending = getFilteredRequests(departmentPendingRequests);
  const filteredDeptCompleted = getFilteredRequests(departmentCompletedRequests);
  const filteredUserPending = getFilteredRequests(userPendingRequests);
  const filteredUserCompleted = getFilteredRequests(userCompletedRequests);
  const filteredDataAccessPending = getFilteredRequests(dataAccessPendingRequests);
  const filteredDataAccessForwarded = getFilteredRequests(dataAccessForwardedRequests);
  const filteredDataAccessCompleted = getFilteredRequests(dataAccessCompletedRequests);
  const filteredSpatialPending = getFilteredRequests(spatialPermissionPendingRequests);
  const filteredSpatialCompleted = getFilteredRequests(spatialPermissionCompletedRequests);
  const filteredSpatialUserPending = getFilteredRequests(spatialPermissionUserUpdatePendingRequests);
  const filteredSpatialUserCompleted = getFilteredRequests(spatialPermissionUserUpdateCompletedRequests);
  const filteredServicesPending = getFilteredRequests(servicesCreationPendingRequests);
  const filteredServicesCompleted = getFilteredRequests(servicesCreationCompletedRequests);
  const filteredDownloadPending = getFilteredRequests(dataDownloadPendingRequests);
  const filteredDownloadForwarded = getFilteredRequests(dataDownloadForwardedRequests);
  const filteredDownloadCompleted = getFilteredRequests(dataDownloadCompletedRequests);
  const filteredMetadataPending = getFilteredRequests(metadataPendingRequests);
  const filteredMetadataCompleted = getFilteredRequests(metadataCompletedRequests);
  const filteredAppUserPending = getFilteredRequests(appUserPendingRequests);
  const filteredAppUserCompleted = getFilteredRequests(appUserCompletedRequests);
  
  // Custom filtering for user request groups (status is handled separately)
  const filteredUserRequestGroups = userRequestGroups.filter(g => {
    if (!isOrgAdmin) return true;
    // Check if any user in the group belongs to the admin's organization or admin submitted it
    const orgMatch = g.users?.some((u: any) => u.organization === adminOrg);
    const submitterMatch = g.submittedBy === adminName || true; // Assuming admin can see groups they view
    return orgMatch || submitterMatch;
  });

  const filteredUserRequestPendingGroups = filteredUserRequestGroups.filter(g => g.status === "pending");
  const filteredUserRequestCompletedGroups = filteredUserRequestGroups.filter(g => g.status === "completed");

  // KPI Calculations based on filtered data
  const totalPending = filteredPendingRequests.length + filteredDeptPending.length + 
                       filteredUserPending.length + filteredDataAccessPending.length + 
                       filteredSpatialPending.length + filteredServicesPending.length + 
                       filteredDownloadPending.length + filteredMetadataPending.length + 
                       filteredAppUserPending.length + filteredUserRequestPendingGroups.length;

  const totalApproved = filteredCompletedRequests.length + filteredDeptCompleted.length + 
                        filteredUserCompleted.length + filteredDataAccessCompleted.length + 
                        filteredSpatialCompleted.length + filteredServicesCompleted.length + 
                        filteredDownloadCompleted.length + filteredMetadataCompleted.length + 
                        filteredAppUserCompleted.length + filteredUserRequestCompletedGroups.length;

  // Helper for request status visualization
  const getRequestVisuals = (request: any) => {
    if (!isOrgAdmin && !isDeptAdmin) return null;
    if (request.status !== 'pending' && request.status !== 'in-review') return null;

    const isRaisedByMe = request.submittedBy === adminName;
    
    // Check if action is required (approving others' requests in my org or as data owner)
    const myOrgs = [adminOrg, "Works Authority", "BSDI"];
    const isActionRequired = (request.dataOwners?.includes(adminName)) || 
                            (!isRaisedByMe && myOrgs.includes(request.organization));

    if (isRaisedByMe) {
      return {
        label: "Raised by You",
        color: "bg-[#003F72]", // BSDI Blue for submitted
        textColor: "text-[#003F72]",
        bgColor: "bg-[#003F72]/10",
        indicator: "bg-[#003F72]"
      };
    }

    if (isActionRequired) {
      return {
        label: "Action Required",
        color: "bg-[#ED1C24]", // Red for action
        textColor: "text-[#ED1C24]",
        bgColor: "bg-[#ED1C24]/10",
        indicator: "bg-[#ED1C24]"
      };
    }

    return null;
  };
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  
  // Search and date range state for each accordion
  const [orgCompletedSearch, setOrgCompletedSearch] = useState("");
  const [orgCompletedDateRange, setOrgCompletedDateRange] = useState({ from: "", to: "" });
  
  const [deptPendingSearch, setDeptPendingSearch] = useState("");
  const [deptPendingDateRange, setDeptPendingDateRange] = useState({ from: "", to: "" });
  const [deptCompletedSearch, setDeptCompletedSearch] = useState("");
  const [deptCompletedDateRange, setDeptCompletedDateRange] = useState({ from: "", to: "" });
  
  const [userPendingSearch, setUserPendingSearch] = useState("");
  const [userPendingDateRange, setUserPendingDateRange] = useState({ from: "", to: "" });
  const [userCompletedSearch, setUserCompletedSearch] = useState("");
  const [userCompletedDateRange, setUserCompletedDateRange] = useState({ from: "", to: "" });
  
  const [dataAccessPendingSearch, setDataAccessPendingSearch] = useState("");
  const [dataAccessPendingDateRange, setDataAccessPendingDateRange] = useState({ from: "", to: "" });
  const [dataAccessForwardedSearch, setDataAccessForwardedSearch] = useState("");
  const [dataAccessForwardedDateRange, setDataAccessForwardedDateRange] = useState({ from: "", to: "" });
  const [dataAccessCompletedSearch, setDataAccessCompletedSearch] = useState("");
  const [dataAccessCompletedDateRange, setDataAccessCompletedDateRange] = useState({ from: "", to: "" });
  
  const [spatialPendingSearch, setSpatialPendingSearch] = useState("");
  const [spatialPendingDateRange, setSpatialPendingDateRange] = useState({ from: "", to: "" });
  const [spatialCompletedSearch, setSpatialCompletedSearch] = useState("");
  const [spatialCompletedDateRange, setSpatialCompletedDateRange] = useState({ from: "", to: "" });
  
  const [spatialUserPendingSearch, setSpatialUserPendingSearch] = useState("");
  const [spatialUserPendingDateRange, setSpatialUserPendingDateRange] = useState({ from: "", to: "" });
  const [spatialUserCompletedSearch, setSpatialUserCompletedSearch] = useState("");
  const [spatialUserCompletedDateRange, setSpatialUserCompletedDateRange] = useState({ from: "", to: "" });
  
  const [servicesPendingSearch, setServicesPendingSearch] = useState("");
  const [servicesPendingDateRange, setServicesPendingDateRange] = useState({ from: "", to: "" });
  const [servicesCompletedSearch, setServicesCompletedSearch] = useState("");
  const [servicesCompletedDateRange, setServicesCompletedDateRange] = useState({ from: "", to: "" });
  
  const [downloadPendingSearch, setDownloadPendingSearch] = useState("");
  const [downloadPendingDateRange, setDownloadPendingDateRange] = useState({ from: "", to: "" });
  const [downloadForwardedSearch, setDownloadForwardedSearch] = useState("");
  const [downloadForwardedDateRange, setDownloadForwardedDateRange] = useState({ from: "", to: "" });
  const [downloadCompletedSearch, setDownloadCompletedSearch] = useState("");
  const [downloadCompletedDateRange, setDownloadCompletedDateRange] = useState({ from: "", to: "" });
  
  const [metadataPendingSearch, setMetadataPendingSearch] = useState("");
  const [metadataPendingDateRange, setMetadataPendingDateRange] = useState({ from: "", to: "" });
  const [metadataCompletedSearch, setMetadataCompletedSearch] = useState("");
  const [metadataCompletedDateRange, setMetadataCompletedDateRange] = useState({ from: "", to: "" });
  
  const [appUserPendingSearch, setAppUserPendingSearch] = useState("");
  const [appUserPendingDateRange, setAppUserPendingDateRange] = useState({ from: "", to: "" });
  const [appUserCompletedSearch, setAppUserCompletedSearch] = useState("");
  const [appUserCompletedDateRange, setAppUserCompletedDateRange] = useState({ from: "", to: "" });
  
  // Download loading state
  const [downloadingKpi, setDownloadingKpi] = useState<string | null>(null);
  
  // Get the active tab from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "organization-creator");
  
  // Highlighted request ID for notification-to-request navigation
  const notificationId = searchParams.get("notificationId");
  const [highlightedId, setHighlightedId] = useState<string | null>(notificationId);
  
  // Accordion state for auto-opening based on notification status
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined);
  
  // Approval dialog state
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [approvalComments, setApprovalComments] = useState("");
  const [pendingApprovalId, setPendingApprovalId] = useState<string | null>(null);
  
  // Rejection dialog state
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [rejectionComment, setRejectionComment] = useState("");
  const [rejectingRequest, setRejectingRequest] = useState<any>(null);
  
  // User Request Groups state
  const [expandedUserGroupId, setExpandedUserGroupId] = useState<string | null>(null);
  const [userGroupUploadedFiles, setUserGroupUploadedFiles] = useState<Record<string, {name: string; size: number}>>({});
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadingForGroup, setUploadingForGroup] = useState<{groupId: string} | null>(null);
  const [groupUploadedFile, setGroupUploadedFile] = useState<File | null>(null);
  const [requestConfirmDialogOpen, setRequestConfirmDialogOpen] = useState(false);
  const [requestingGroupId, setRequestingGroupId] = useState<string | null>(null);
  const [userRequestGroupsList, setUserRequestGroupsList] = useState(userRequestGroups);
  
  // PDF Viewer state
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [viewingFileName, setViewingFileName] = useState<string>("");
  
  // Forward Dialog state
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false);
  const [forwardingRequest, setForwardingRequest] = useState<any>(null);
  const [selectedDataOwners, setSelectedDataOwners] = useState<string[]>([]);
  
  // Organization Details Dialog state
  const [orgDetailsDialogOpen, setOrgDetailsDialogOpen] = useState(false);
  const [viewingOrganization, setViewingOrganization] = useState<any>(null);
  const [forwardNotes, setForwardNotes] = useState<string>("");
  
  // State for forwarded requests
  const [dataDownloadForwardedList, setDataDownloadForwardedList] = useState(dataDownloadForwardedRequests);
  const [dataDownloadPendingList, setDataDownloadPendingList] = useState(dataDownloadPendingRequests);
  
  // Map Preview Dialog state
  const [mapPreviewOpen, setMapPreviewOpen] = useState(false);
  const [previewingRequest, setPreviewingRequest] = useState<any>(null);
  
  // Update active tab when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    if (tab) {
      setActiveTab(tab);
    }
    
    // Set highlighted ID if notificationId is present
    const notifId = searchParams.get("notificationId");
    const status = searchParams.get("status");
    
    if (notifId) {
      setHighlightedId(notifId);
      
      // Open the appropriate accordion based on status
      if (status === "pending") {
        setOpenAccordion("pending");
      } else if (status === "completed") {
        setOpenAccordion("completed");
      } else if (status === "forwarded") {
        setOpenAccordion("forwarded");
      }
      
      // Remove highlight after 3 seconds
      setTimeout(() => {
        setHighlightedId(null);
      }, 3000);
    }
  }, [location.search]);

  // Download KPI data as CSV
  const handleDownloadKPI = (kpiLabel: string, kpiValue: string) => {
    setDownloadingKpi(kpiLabel);
    
    // Simulate async download operation
    setTimeout(() => {
      try {
        // Create CSV content
        const csvContent = `KPI Report - ${kpiLabel}\nGenerated: ${new Date().toLocaleString()}\n\nMetric,Value\n${kpiLabel},${kpiValue}\n\nData Access Requests Summary\nTotal Requests,1374\nPending,67\nApproved,1234\nRejected,28\nIn Review,45`;
        
        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `${kpiLabel.toLowerCase().replace(/\s+/g, '-')}-report-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(url);
        
        // Show success notification
        toast.success(`${kpiLabel} report downloaded successfully!`);
      } catch (error) {
        toast.error('Failed to download report. Please try again.');
      } finally {
        setDownloadingKpi(null);
      }
    }, 800);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, string> = {
      approved: "bg-[#00A651] text-white",
      pending: "bg-[#FFA500] text-white",
      rejected: "bg-[#ED1C24] text-white",
    };
    return statusConfig[status] || "bg-[#666666] text-white";
  };

  // Handle approve button click - open dialog
  const handleApproveClick = (requestId: string) => {
    setPendingApprovalId(requestId);
    setApprovalDialogOpen(true);
  };

  // Handle approval confirmation
  const handleApprovalConfirm = () => {
    toast.success(`Approved ${pendingApprovalId} successfully`);
    
    // Reset state
    setApprovalDialogOpen(false);
    setApprovalComments("");
    setPendingApprovalId(null);
  };

  // Handle approval cancel
  const handleApprovalCancel = () => {
    setApprovalDialogOpen(false);
    setApprovalComments("");
    setPendingApprovalId(null);
  };

  // Handle reject button click - open dialog
  const handleRejectClick = (request: any) => {
    setRejectingRequest(request);
    setRejectionDialogOpen(true);
  };

  // Handle rejection confirmation
  const handleRejectionConfirm = () => {
    if (!rejectionComment.trim()) {
      toast.error("Please enter a reason for rejection");
      return;
    }
    
    toast.error(`Request ${rejectingRequest?.id} rejected. Reason: "${rejectionComment}"`);
    
    // Reset state
    setRejectionDialogOpen(false);
    setRejectionComment("");
    setRejectingRequest(null);
  };

  // Handle rejection cancel
  const handleRejectionCancel = () => {
    setRejectionDialogOpen(false);
    setRejectionComment("");
    setRejectingRequest(null);
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Handle file upload for user request groups
  const handleUserGroupUpload = () => {
    if (!groupUploadedFile || !uploadingForGroup) {
      toast.error("Please select a file to upload");
      return;
    }
    
    // Store the uploaded file info
    const fileKey = `${uploadingForGroup.groupId}-group`;
    setUserGroupUploadedFiles({
      ...userGroupUploadedFiles,
      [fileKey]: {
        name: groupUploadedFile.name,
        size: groupUploadedFile.size
      }
    });
    
    toast.success(`Document uploaded successfully for ${uploadingForGroup.groupId}`);
    
    // Close dialog and reset
    setUploadDialogOpen(false);
    setGroupUploadedFile(null);
    setUploadingForGroup(null);
  };

  // Handle delete user group
  const handleDeleteUserGroup = (groupId: string) => {
    setUserRequestGroupsList(userRequestGroupsList.filter(g => g.id !== groupId));
    toast.success(`Group ${groupId} deleted successfully`);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-10 py-8">
      <div className="max-w-[1800px] mx-auto space-y-8">
        <PageHeader
          title="Department Access Rights"
          description="Manage and monitor data access permissions for your department."
        />

        {/* Standardized Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            value="0" 
            label="Today" 
            icon={<Calendar className="w-6 h-6" />} 
            variant="blue" 
            trend={{ value: "0%", isNeutral: true }}
          />
          <MetricCard 
            value={totalApproved} 
            label="Approved" 
            icon={<CheckCircle className="w-6 h-6" />} 
            variant="green" 
            statusText="Completed"
          />
          <MetricCard 
            value="0" 
            label="Rejected" 
            icon={<XCircle className="w-6 h-6" />} 
            variant="red" 
            statusText="No Rejections"
          />
          <MetricCard 
            value={totalPending} 
            label="Pending" 
            icon={<Hand className="w-6 h-6" />} 
            variant="yellow" 
            statusText="Requires Review"
          />
        </div>

        <Card className="bg-white border-0 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="px-6 py-5">
              <TabsList className="inline-flex items-center gap-1 bg-[#F9FAFB] p-1 rounded-full border-0 overflow-x-auto no-scrollbar">
                <TabsTrigger value="organization-creator" className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[#6B7280] whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-[#111827] data-[state=active]:shadow-sm data-[state=active]:font-semibold transition-all">Department Admin</TabsTrigger>
                <TabsTrigger value="department" className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[#6B7280] whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-[#111827] data-[state=active]:shadow-sm data-[state=active]:font-semibold transition-all">Department</TabsTrigger>
                <TabsTrigger value="user-requests" className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[#6B7280] whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-[#111827] data-[state=active]:shadow-sm data-[state=active]:font-semibold transition-all">User Requests</TabsTrigger>
                <TabsTrigger value="data-access" className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[#6B7280] whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-[#111827] data-[state=active]:shadow-sm data-[state=active]:font-semibold transition-all">Data Access</TabsTrigger>
                <TabsTrigger value="spatial-permission" className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[#6B7280] whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-[#111827] data-[state=active]:shadow-sm data-[state=active]:font-semibold transition-all">Spatial Permission</TabsTrigger>
                <TabsTrigger value="services-creation" className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[#6B7280] whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-[#111827] data-[state=active]:shadow-sm data-[state=active]:font-semibold transition-all">Services Creation</TabsTrigger>
                <TabsTrigger value="data-download" className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[#6B7280] whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-[#111827] data-[state=active]:shadow-sm data-[state=active]:font-semibold transition-all">Data Download</TabsTrigger>
                <TabsTrigger value="metadata" className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[#6B7280] whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-[#111827] data-[state=active]:shadow-sm data-[state=active]:font-semibold transition-all">Metadata</TabsTrigger>
                <TabsTrigger value="application-user" className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-[#6B7280] whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-[#111827] data-[state=active]:shadow-sm data-[state=active]:font-semibold transition-all">Application User</TabsTrigger>
              </TabsList>
            </div>
            
            {/* Department Admin Tab */}
            <TabsContent value="organization-creator">
              <Accordion type="single" collapsible className="space-y-3" value={openAccordion} onValueChange={setOpenAccordion}>
                <AccordionItem 
                  value="completed"
                  className="mt-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white mx-6 shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline transition-colors group">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-2 h-2 bg-[#10B981] rounded-full shrink-0"></div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-base font-semibold text-[#111827]">Completed</span>
                        <span className="text-[13px] text-[#6B7280]">Total Requests : {String(filteredCompletedRequests.length).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0 pt-0">
                    {/* Search and Date Range */}
                    <div className="px-8 py-6 border-t border-[#F3F4F6] bg-[#F9FAFB]/50 flex items-center gap-6">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9CA3AF]" />
                        <Input
                          placeholder="Search Completed Requests..."
                          value={orgCompletedSearch}
                          onChange={(e) => setOrgCompletedSearch(e.target.value)}
                          className="pl-12 bg-white border-[#E5E7EB] focus:ring-2 focus:ring-[#EF4444]/10 focus:border-[#EF4444] rounded-xl h-11 text-sm transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-xl px-4 h-11">
                          <Calendar className="w-4 h-4 text-[#9CA3AF]" />
                          <input
                            type="date"
                            value={orgCompletedDateRange.from}
                            onChange={(e) => setOrgCompletedDateRange({ ...orgCompletedDateRange, from: e.target.value })}
                            className="bg-transparent border-0 focus:ring-0 text-sm text-[#374151] outline-none"
                          />
                          <span className="text-[#9CA3AF] text-sm font-medium">to</span>
                          <input
                            type="date"
                            value={orgCompletedDateRange.to}
                            onChange={(e) => setOrgCompletedDateRange({ ...orgCompletedDateRange, to: e.target.value })}
                            className="bg-transparent border-0 focus:ring-0 text-sm text-[#374151] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-[#F3F4F6] overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F9FAFB]/80 border-b border-[#F3F4F6]">
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Request Id</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Organization</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Business Description</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Submitted By</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Completed Date</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F3F4F6]">
                          {filteredCompletedRequests.map((request, index) => (
                            <tr 
                              key={request.id}
                              className="group hover:bg-[#F9FAFB] transition-all duration-200"
                            >
                              <td className="px-8 py-5">
                                <div className="flex flex-col gap-2">
                                  <span className="text-[#111827] font-bold tracking-tight">{request.id}</span>
                                  {getRequestVisuals(request) && (
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit ${getRequestVisuals(request)?.bgColor}`}>
                                      <div className={`w-1.5 h-1.5 rounded-full ${getRequestVisuals(request)?.indicator}`}></div>
                                      <span className={`text-[10px] font-bold uppercase tracking-wider ${getRequestVisuals(request)?.textColor}`}>
                                        {getRequestVisuals(request)?.label}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="space-y-1">
                                  <div className="font-bold text-[#111827]">{request.organization}</div>
                                  <div className="text-sm text-[#6B7280] font-medium leading-relaxed">{request.description}</div>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="text-sm text-[#4B5563] max-w-md leading-relaxed font-medium">
                                  {index === 0 
                                    ? "The Urban Planning Authority is responsible for comprehensive urban development planning, land use regulation, and sustainable growth strategies across the Kingdom of Bahrain."
                                    : "The Environmental Agency oversees environmental protection, conservation efforts, and sustainability initiatives to preserve Bahrain's natural resources and ecological balance."}
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="font-semibold text-[#111827]">{request.submittedBy}</div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="text-sm font-bold text-[#6B7280]">05 Mar 2025</div>
                              </td>
                              <td className="px-8 py-5">
                                <Badge className="bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 border-0 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                  Created
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            {/* Department Tab */}
            <TabsContent value="department" className="space-y-4">
              <Accordion type="single" collapsible className="space-y-3" value={openAccordion} onValueChange={setOpenAccordion}>
                {/* Pending Accordion */}
                <AccordionItem 
                  value="pending"
                  className="mt-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white mx-6 shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline transition-colors group">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-2 h-2 bg-[#EF4444] rounded-full shrink-0 animate-pulse"></div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-base font-semibold text-[#111827]">Pending</span>
                        <span className="text-[13px] text-[#6B7280]">Total Requests : {String(filteredDeptPending.length).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0 pt-0">
                    {/* Search and Date Range */}
                    <div className="px-8 py-6 border-t border-[#F3F4F6] bg-[#F9FAFB]/50 flex items-center gap-6">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9CA3AF]" />
                        <Input
                          placeholder="Search Pending Requests..."
                          value={deptPendingSearch}
                          onChange={(e) => setDeptPendingSearch(e.target.value)}
                          className="pl-12 bg-white border-[#E5E7EB] focus:ring-2 focus:ring-[#EF4444]/10 focus:border-[#EF4444] rounded-xl h-11 text-sm transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-xl px-4 h-11">
                          <Calendar className="w-4 h-4 text-[#9CA3AF]" />
                          <input
                            type="date"
                            value={deptPendingDateRange.from}
                            onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, from: e.target.value })}
                            className="bg-transparent border-0 focus:ring-0 text-sm text-[#374151] outline-none"
                          />
                          <span className="text-[#9CA3AF] text-sm font-medium">to</span>
                          <input
                            type="date"
                            value={deptPendingDateRange.to}
                            onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, to: e.target.value })}
                            className="bg-transparent border-0 focus:ring-0 text-sm text-[#374151] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-[#F3F4F6] overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F9FAFB]/80 border-b border-[#F3F4F6]">
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Request Id</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Department</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Type</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Organization</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Requested Date</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Requested By</th>
                            <th className="px-8 py-4 text-right text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F3F4F6]">
                          {filteredDeptPending.map((request, index) => [
                              <tr
                                key={`dept-pending-main-${request.id}-${index}`}
                                className={`group hover:bg-[#F9FAFB] transition-all duration-200 ${highlightedId === request.id ? 'bg-[#EF4444]/5' : ''}`}
                              >
                                <td className="px-8 py-5">
                                  <div className="flex flex-col gap-2">
                                    <span className="text-[#111827] font-bold tracking-tight">{request.id}</span>
                                    {getRequestVisuals(request) && (
                                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit ${getRequestVisuals(request)?.bgColor}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${getRequestVisuals(request)?.indicator}`}></div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${getRequestVisuals(request)?.textColor}`}>
                                          {getRequestVisuals(request)?.label}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-8 py-5 text-[#252628]">
                                  <div className="font-bold text-[#111827]">{request.departmentNameEn}</div>
                                  <div className="text-sm text-[#6B7280] font-medium leading-relaxed mt-0.5" dir="rtl">{request.departmentNameAr}</div>
                                </td>
                                <td className="px-8 py-5 text-[#252628]">
                                  <Badge className="bg-[#EF4444]/10 text-[#EF4444] border-0 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                    {request.type}
                                  </Badge>
                                </td>
                                <td className="px-8 py-5 text-[#111827] font-semibold">{request.organization}</td>
                                <td className="px-8 py-5 text-sm font-bold text-[#6B7280] whitespace-nowrap">{request.date}</td>
                                <td className="px-8 py-5 text-[#111827] font-semibold">{request.submittedBy || "Jawaher Rashed"}</td>
                                <td className="px-8 py-5">
                                  {isReviewer ? (
                                    <div className="text-right">
                                      <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">N/A</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-end gap-3">
                                      <Button 
                                        onClick={() => handleApproveClick(request.id)}
                                        size="sm"
                                        className="bg-[#10B981] hover:bg-[#059669] text-white text-[11px] font-bold uppercase tracking-wider px-6 h-10 rounded-full shadow-sm transition-all active:scale-95"
                                      >
                                        Approve
                                      </Button>
                                      <Button 
                                        onClick={() => handleRejectClick(request)}
                                        size="sm"
                                        variant="outline"
                                        className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white text-[11px] font-bold uppercase tracking-wider px-6 h-10 rounded-full transition-all active:scale-95"
                                      >
                                        Reject
                                      </Button>
                                    </div>
                                  )}
                                </td>
                              </tr>,
                              <tr key={`dept-pending-details-${request.id}-${index}`} className="bg-[#F9FAFB]/30">
                                <td colSpan={7} className="px-8 py-6">
                                  <div className="grid grid-cols-2 gap-8 text-sm">
                                    <div className="flex items-center gap-3">
                                      <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider shrink-0 w-32">Point Of Contact:</span>
                                      <span className="font-semibold text-[#111827] bg-[#F3F4F6] px-3 py-1.5 rounded-lg">{request.pointOfContact}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider shrink-0 w-32">Submitted By:</span>
                                      <span className="font-semibold text-[#111827] bg-[#F3F4F6] px-3 py-1.5 rounded-lg">{request.submittedBy}</span>
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                      <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Business Description:</div>
                                      <div className="text-[#4B5563] leading-relaxed font-medium bg-[#F3F4F6] p-4 rounded-xl border border-[#E5E7EB]">
                                        {request.businessDescription}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ])}
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Completed Accordion */}
                <AccordionItem 
                  value="completed"
                  className="mt-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white mx-6 shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline transition-colors group">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-2 h-2 bg-[#10B981] rounded-full shrink-0"></div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-base font-semibold text-[#111827]">Completed</span>
                        <span className="text-[13px] text-[#6B7280]">Total Requests : {String(filteredDeptCompleted.length).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0 pt-0">
                    {/* Search and Date Range */}
                    <div className="px-8 py-6 border-t border-[#F3F4F6] bg-[#F9FAFB]/50 flex items-center gap-6">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9CA3AF]" />
                        <Input
                          placeholder="Search Completed Requests..."
                          value={deptCompletedSearch}
                          onChange={(e) => setDeptCompletedSearch(e.target.value)}
                          className="pl-12 bg-white border-[#E5E7EB] focus:ring-2 focus:ring-[#EF4444]/10 focus:border-[#EF4444] rounded-xl h-11 text-sm transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-xl px-4 h-11">
                          <Calendar className="w-4 h-4 text-[#9CA3AF]" />
                          <input
                            type="date"
                            value={deptCompletedDateRange.from}
                            onChange={(e) => setDeptCompletedDateRange({ ...deptCompletedDateRange, from: e.target.value })}
                            className="bg-transparent border-0 focus:ring-0 text-sm text-[#374151] outline-none"
                          />
                          <span className="text-[#9CA3AF] text-sm font-medium">to</span>
                          <input
                            type="date"
                            value={deptCompletedDateRange.to}
                            onChange={(e) => setDeptCompletedDateRange({ ...deptCompletedDateRange, to: e.target.value })}
                            className="bg-transparent border-0 focus:ring-0 text-sm text-[#374151] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-[#F3F4F6] overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F9FAFB]/80 border-b border-[#F3F4F6]">
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Request Id</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Department</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Type</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Organization</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Requested Date</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Approved Date</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Approved By</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Requested By</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Comment</th>
                            <th className="px-8 py-4 text-right text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F3F4F6]">
                          {filteredDeptCompleted.map((request, index) => [
                              <tr
                                key={`dept-completed-main-${request.id}-${index}`}
                                className="group hover:bg-[#F9FAFB] transition-all duration-200"
                              >
                                <td className="px-8 py-5">
                                  <div className="flex flex-col gap-2">
                                    <span className="text-[#111827] font-bold tracking-tight">{request.id}</span>
                                    {getRequestVisuals(request) && (
                                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit ${getRequestVisuals(request)?.bgColor}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${getRequestVisuals(request)?.indicator}`}></div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${getRequestVisuals(request)?.textColor}`}>
                                          {getRequestVisuals(request)?.label}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-8 py-5 text-[#252628]">
                                  <div className="font-bold text-[#111827]">{request.departmentNameEn}</div>
                                  <div className="text-sm text-[#6B7280] font-medium leading-relaxed mt-0.5" dir="rtl">{request.departmentNameAr}</div>
                                </td>
                                <td className="px-8 py-5">
                                  <Badge className="bg-[#EF4444]/10 text-[#EF4444] border-0 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                    {request.type}
                                  </Badge>
                                </td>
                                <td className="px-8 py-5 text-[#111827] font-semibold">{request.organization}</td>
                                <td className="px-8 py-5 text-sm font-bold text-[#6B7280] whitespace-nowrap">{request.date}</td>
                                <td className="px-8 py-5 text-sm font-bold text-[#6B7280] whitespace-nowrap">10 Mar 2025</td>
                                <td className="px-8 py-5 text-[#111827] font-semibold">Fatima Al-Mansoori</td>
                                <td className="px-8 py-5 text-[#111827] font-semibold">{request.submittedBy || "Jawaher Rashed"}</td>
                                <td className="px-8 py-5">
                                  <div className="text-sm text-[#4B5563] font-medium max-w-xs truncate">All requirements met and validated</div>
                                </td>
                                <td className="px-8 py-5 text-right">
                                  <Badge className="bg-[#10B981]/10 text-[#10B981] border-0 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full whitespace-nowrap">
                                    Approved
                                  </Badge>
                                </td>
                              </tr>,
                              <tr key={`dept-completed-details-${request.id}-${index}`} className="bg-[#F9FAFB]/30">
                                <td colSpan={10} className="px-8 py-6">
                                  <div className="grid grid-cols-2 gap-8 text-sm">
                                    <div className="flex items-center gap-3">
                                      <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider shrink-0 w-32">Point Of Contact:</span>
                                      <span className="font-semibold text-[#111827] bg-[#F3F4F6] px-3 py-1.5 rounded-lg">{request.pointOfContact}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider shrink-0 w-32">Submitted By:</span>
                                      <span className="font-semibold text-[#111827] bg-[#F3F4F6] px-3 py-1.5 rounded-lg">{request.submittedBy}</span>
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                      <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Business Description:</div>
                                      <div className="text-[#4B5563] leading-relaxed font-medium bg-[#F3F4F6] p-4 rounded-xl border border-[#E5E7EB]">
                                        {request.businessDescription}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            ])}
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            {/* User Requests Tab */}
            <TabsContent value="user-requests" className="space-y-4">
              <Accordion type="single" collapsible className="space-y-3" value={openAccordion} onValueChange={setOpenAccordion}>
                {/* Pending Accordion */}
                <AccordionItem 
                  value="pending"
                  className="mt-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white mx-6 shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline transition-colors group">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-2 h-2 bg-[#EF4444] rounded-full shrink-0 animate-pulse"></div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-base font-semibold text-[#111827]">Pending</span>
                        <span className="text-[13px] text-[#6B7280]">Total Requests : {String(filteredUserRequestPendingGroups.length).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0 pt-0">
                    {/* Search and Date Range */}
                    <div className="px-8 py-6 border-t border-[#F3F4F6] bg-[#F9FAFB]/50 flex items-center gap-6">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9CA3AF]" />
                        <Input
                          placeholder="Search Pending Requests..."
                          value={userPendingSearch}
                          onChange={(e) => setUserPendingSearch(e.target.value)}
                          className="pl-12 bg-white border-[#E5E7EB] focus:ring-2 focus:ring-[#EF4444]/10 focus:border-[#EF4444] rounded-xl h-11 text-sm transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-xl px-4 h-11">
                          <Calendar className="w-4 h-4 text-[#9CA3AF]" />
                          <input
                            type="date"
                            value={userPendingDateRange.from}
                            onChange={(e) => setUserPendingDateRange({ ...userPendingDateRange, from: e.target.value })}
                            className="bg-transparent border-0 focus:ring-0 text-sm text-[#374151] outline-none"
                          />
                          <span className="text-[#9CA3AF] text-sm font-medium">to</span>
                          <input
                            type="date"
                            value={userPendingDateRange.to}
                            onChange={(e) => setUserPendingDateRange({ ...userPendingDateRange, to: e.target.value })}
                            className="bg-transparent border-0 focus:ring-0 text-sm text-[#374151] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-[#F3F4F6]">
                      {/* Column Headers */}
                      <div className="px-8 py-4 bg-[#F9FAFB]/80 border-b border-[#F3F4F6]">
                        <div className="flex items-center">
                          <div className="w-8"></div>
                          <div className="flex-1 grid grid-cols-6 gap-6">
                            <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Group Name</div>
                            <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Users</div>
                            <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Requested Date</div>
                            <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Requested By</div>
                            <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Uploaded File</div>
                            <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider text-right">Actions</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-6 space-y-4">
                        {filteredUserRequestPendingGroups.map((group) => (
                          <div key={group.id} className="border border-[#F3F4F6] rounded-2xl overflow-hidden bg-white shadow-sm hover:border-[#EF4444]/20 transition-all duration-200">
                            {/* Group Header Row */}
                            <div 
                              onClick={() => setExpandedUserGroupId(expandedUserGroupId === group.id ? null : group.id)}
                              className="flex items-center px-6 py-5 hover:bg-[#F9FAFB] transition-all cursor-pointer group/row"
                            >
                              <div className="w-8">
                                {expandedUserGroupId === group.id ? (
                                  <ChevronUp className="w-5 h-5 text-[#EF4444]" />
                                ) : (
                                  <ChevronDown className="w-5 h-5 text-[#9CA3AF] group-hover/row:text-[#6B7280]" />
                                )}
                              </div>
                              
                              <div className="flex-1 grid grid-cols-6 gap-6 items-center">
                                <div className="flex flex-col gap-2">
                                  <span className="text-[#111827] font-bold tracking-tight">{group.id}</span>
                                  {getRequestVisuals({ ...group, status: 'pending' }) && (
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit ${getRequestVisuals({ ...group, status: 'pending' })?.bgColor}`}>
                                      <div className={`w-1.5 h-1.5 rounded-full ${getRequestVisuals({ ...group, status: 'pending' })?.indicator}`}></div>
                                      <span className={`text-[10px] font-bold uppercase tracking-wider ${getRequestVisuals({ ...group, status: 'pending' })?.textColor}`}>
                                        {getRequestVisuals({ ...group, status: 'pending' })?.label}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="text-[#111827] font-semibold">{group.usersCount} users</div>
                                <div className="text-sm font-bold text-[#6B7280]">{group.dateCreated}</div>
                                <div className="text-[#111827] font-semibold">Jawaher Rashed</div>
                                <div onClick={(e) => e.stopPropagation()}>
                                  <Button 
                                    onClick={() => {
                                      setViewingFileName(group.fileName);
                                      setPdfViewerOpen(true);
                                    }}
                                    size="sm"
                                    variant="outline"
                                    className="border-[#E5E7EB] text-[#4B5563] hover:bg-[#F3F4F6] text-[11px] font-bold uppercase tracking-wider px-3 h-9 rounded-xl flex items-center gap-2 transition-all active:scale-95"
                                  >
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>View File</span>
                                  </Button>
                                </div>
                                <div className="text-right" onClick={(e) => e.stopPropagation()}>
                                  {!isReviewer ? (
                                    <div className="flex items-center justify-end gap-3">
                                      <Button 
                                        onClick={() => {
                                          setPendingApprovalId(group.id);
                                          setApprovalDialogOpen(true);
                                        }}
                                        size="sm"
                                        className="bg-[#10B981] hover:bg-[#059669] text-white text-[11px] font-bold uppercase tracking-wider px-6 h-10 rounded-full shadow-sm transition-all active:scale-95"
                                      >
                                        Approve
                                      </Button>
                                      <Button 
                                        onClick={() => {
                                          setRejectingRequest(group);
                                          setRejectionDialogOpen(true);
                                        }}
                                        size="sm"
                                        variant="outline"
                                        className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white text-[11px] font-bold uppercase tracking-wider px-6 h-10 rounded-full transition-all active:scale-95"
                                      >
                                        Reject
                                      </Button>
                                    </div>
                                  ) : (
                                    <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">N/A</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Expanded User Details */}
                            {expandedUserGroupId === group.id && (
                              <div className="border-t border-[#F3F4F6] bg-[#F9FAFB]/50">
                                <div className="px-8 py-5 border-b border-[#F3F4F6] bg-white flex items-center justify-between">
                                  <div>
                                    <h5 className="font-bold text-[#111827]">Group Members</h5>
                                    <p className="text-xs font-medium text-[#6B7280] mt-0.5">List of users requesting access in {group.id}</p>
                                  </div>
                                  <Badge className="bg-[#EF4444]/10 text-[#EF4444] border-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                                    {group.users.length} Members
                                  </Badge>
                                </div>
                                
                                <div className="overflow-x-auto">
                                  <table className="w-full">
                                    <thead>
                                      <tr className="bg-[#F9FAFB]">
                                        <th className="px-8 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Name</th>
                                        <th className="px-8 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Email</th>
                                        <th className="px-8 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Role</th>
                                        <th className="px-8 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Organization</th>
                                        <th className="px-8 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Department</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#F3F4F6]">
                                      {group.users.map((user) => (
                                        <tr key={user.id} className="hover:bg-white transition-all bg-transparent">
                                          <td className="px-8 py-4 text-[#111827] font-semibold">{user.name}</td>
                                          <td className="px-8 py-4 text-sm font-medium text-[#6B7280]">{user.email}</td>
                                          <td className="px-8 py-4">
                                            <div className="flex flex-wrap gap-2">
                                              {user.role.split(', ').slice(0, 1).map((role, index) => (
                                                <Badge 
                                                  key={index}
                                                  className="bg-[#6B7280]/10 text-[#6B7280] hover:bg-[#6B7280]/20 border-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg"
                                                >
                                                  {role}
                                                </Badge>
                                              ))}
                                              {user.role.split(', ').length > 1 && (
                                                <Popover>
                                                  <PopoverTrigger asChild>
                                                    <button className="bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 border-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full transition-all">
                                                      +{user.role.split(', ').length - 1} More
                                                    </button>
                                                  </PopoverTrigger>
                                                  <PopoverContent className="w-80 bg-white rounded-2xl border-[#E5E7EB] shadow-xl p-5">
                                                    <div className="space-y-4">
                                                      <div className="flex items-center gap-3 pb-4 border-b border-[#F3F4F6]">
                                                        <div className="w-10 h-10 rounded-full bg-[#EF4444]/10 flex items-center justify-center">
                                                          <span className="text-sm font-bold text-[#EF4444]">
                                                            {user.name.split(' ').map(n => n[0]).join('')}
                                                          </span>
                                                        </div>
                                                        <div>
                                                          <h4 className="font-bold text-[#111827] text-sm">{user.name}</h4>
                                                          <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Assigned Roles</p>
                                                        </div>
                                                      </div>
                                                      <div className="flex flex-wrap gap-2">
                                                        {user.role.split(', ').map((role, index) => (
                                                          <Badge 
                                                            key={index}
                                                            className="bg-[#6B7280]/10 text-[#6B7280] border-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg"
                                                          >
                                                            {role}
                                                          </Badge>
                                                        ))}
                                                      </div>
                                                    </div>
                                                  </PopoverContent>
                                                </Popover>
                                              )}
                                            </div>
                                          </td>
                                          <td className="px-8 py-4 text-sm font-semibold text-[#111827]">{user.organization}</td>
                                          <td className="px-8 py-4 text-sm font-medium text-[#6B7280]">{user.department}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                  {/* Completed Accordion */}
                  <AccordionItem 
                    value="completed"
                    className="mt-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white mx-6 shadow-sm"
                  >
                    <AccordionTrigger className="px-6 py-5 hover:no-underline transition-colors group">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-2 h-2 bg-[#10B981] rounded-full shrink-0"></div>
                        <div className="flex items-baseline gap-3">
                          <span className="text-base font-semibold text-[#111827]">Completed</span>
                          <span className="text-[13px] text-[#6B7280]">Total Requests : {String(filteredUserRequestCompletedGroups.length).padStart(2, '0')}</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0 pt-0">
                      {/* Search and Date Range */}
                      <div className="px-8 py-6 border-t border-[#F3F4F6] bg-[#F9FAFB]/50 flex items-center gap-6">
                        <div className="flex-1 relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9CA3AF]" />
                          <Input
                            placeholder="Search Completed Requests..."
                            value={userCompletedSearch}
                            onChange={(e) => setUserCompletedSearch(e.target.value)}
                            className="pl-12 bg-white border-[#E5E7EB] focus:ring-2 focus:ring-[#EF4444]/10 focus:border-[#EF4444] rounded-xl h-11 text-sm transition-all"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-xl px-4 h-11">
                            <Calendar className="w-4 h-4 text-[#9CA3AF]" />
                            <input
                              type="date"
                              value={userCompletedDateRange.from}
                              onChange={(e) => setUserCompletedDateRange({ ...userCompletedDateRange, from: e.target.value })}
                              className="bg-transparent border-0 focus:ring-0 text-sm text-[#374151] outline-none"
                            />
                            <span className="text-[#9CA3AF] text-sm font-medium">to</span>
                            <input
                              type="date"
                              value={userCompletedDateRange.to}
                              onChange={(e) => setUserCompletedDateRange({ ...userCompletedDateRange, to: e.target.value })}
                              className="bg-transparent border-0 focus:ring-0 text-sm text-[#374151] outline-none"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="border-t border-[#F3F4F6]">
                        {/* Column Headers */}
                        <div className="px-8 py-4 bg-[#F9FAFB]/80 border-b border-[#F3F4F6]">
                          <div className="flex items-center">
                            <div className="w-8"></div>
                            <div className="flex-1 grid grid-cols-8 gap-4">
                              <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Group Name</div>
                              <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Users</div>
                              <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Requested Date</div>
                              <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Approved Date</div>
                              <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Approved By</div>
                              <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Requested By</div>
                              <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Uploaded File</div>
                              <div className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider text-right">Status</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-6 space-y-4">
                          {filteredUserRequestCompletedGroups.map((group) => (
                            <div key={group.id} className="border border-[#F3F4F6] rounded-2xl overflow-hidden bg-white shadow-sm hover:border-[#10B981]/20 transition-all duration-200">
                              {/* Group Header Row */}
                              <div 
                                onClick={() => setExpandedUserGroupId(expandedUserGroupId === group.id ? null : group.id)}
                                className="flex items-center px-6 py-5 hover:bg-[#F9FAFB] transition-all cursor-pointer group/row"
                              >
                                <div className="w-8">
                                  {expandedUserGroupId === group.id ? (
                                    <ChevronUp className="w-5 h-5 text-[#10B981]" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5 text-[#9CA3AF] group-hover/row:text-[#6B7280]" />
                                  )}
                                </div>
                                
                                <div className="flex-1 grid grid-cols-8 gap-4 items-center">
                                  <div className="flex flex-col gap-2">
                                    <span className="text-[#111827] font-bold tracking-tight">{group.id}</span>
                                    {getRequestVisuals(group) && (
                                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit ${getRequestVisuals(group)?.bgColor}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${getRequestVisuals(group)?.indicator}`}></div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider ${getRequestVisuals(group)?.textColor}`}>
                                          {getRequestVisuals(group)?.label}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-[#111827] font-semibold">{group.usersCount} users</div>
                                  <div className="text-sm font-bold text-[#6B7280]">{group.dateCreated}</div>
                                  <div className="text-sm font-bold text-[#6B7280]">08 Mar 2025</div>
                                  <div className="text-[#111827] font-semibold">Yousif Al-Mahmood</div>
                                  <div className="text-[#111827] font-semibold">Jawaher Rashed</div>
                                  <div onClick={(e) => e.stopPropagation()}>
                                    <Button 
                                      onClick={() => {
                                        setViewingFileName(group.fileName);
                                        setPdfViewerOpen(true);
                                      }}
                                      size="sm"
                                      variant="outline"
                                      className="border-[#E5E7EB] text-[#4B5563] hover:bg-[#F3F4F6] text-[11px] font-bold uppercase tracking-wider px-3 h-9 rounded-xl flex items-center gap-2 transition-all active:scale-95"
                                    >
                                      <FileText className="w-3.5 h-3.5" />
                                      <span>View File</span>
                                    </Button>
                                  </div>
                                  <div className="text-right">
                                    <Badge className="bg-[#10B981]/10 text-[#10B981] border-0 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                                      Approved
                                    </Badge>
                                  </div>
                                </div>
                              </div>

                              {/* Expanded User Details */}
                              {expandedUserGroupId === group.id && (
                                <div className="border-t border-[#F3F4F6] bg-[#F9FAFB]/50">
                                  <div className="px-8 py-5 border-b border-[#F3F4F6] bg-white flex items-center justify-between">
                                    <div>
                                      <h5 className="font-bold text-[#111827]">Group Members</h5>
                                      <p className="text-xs font-medium text-[#6B7280] mt-0.5">List of users in {group.id}</p>
                                    </div>
                                    <Badge className="bg-[#10B981]/10 text-[#10B981] border-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                                      {group.users.length} Members
                                    </Badge>
                                  </div>
                                  
                                  <div className="overflow-x-auto">
                                    <table className="w-full">
                                      <thead>
                                        <tr className="bg-[#F9FAFB]">
                                          <th className="px-8 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Name</th>
                                          <th className="px-8 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Email</th>
                                          <th className="px-8 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Role</th>
                                          <th className="px-8 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Organization</th>
                                          <th className="px-8 py-3 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Department</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-[#F3F4F6]">
                                        {group.users.map((user) => (
                                          <tr key={user.id} className="hover:bg-white transition-all bg-transparent">
                                            <td className="px-8 py-4 text-[#111827] font-semibold">{user.name}</td>
                                            <td className="px-8 py-4 text-sm font-medium text-[#6B7280]">{user.email}</td>
                                            <td className="px-8 py-4">
                                              <div className="flex flex-wrap gap-2">
                                                {user.role.split(', ').slice(0, 1).map((role, index) => (
                                                  <Badge 
                                                    key={index}
                                                    className="bg-[#6B7280]/10 text-[#6B7280] hover:bg-[#6B7280]/20 border-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg"
                                                  >
                                                    {role}
                                                  </Badge>
                                                ))}
                                                {user.role.split(', ').length > 1 && (
                                                  <Popover>
                                                    <PopoverTrigger asChild>
                                                      <button className="bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 border-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full transition-all">
                                                        +{user.role.split(', ').length - 1} More
                                                      </button>
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-80 bg-white rounded-2xl border-[#E5E7EB] shadow-xl p-5">
                                                      <div className="space-y-4">
                                                        <div className="flex items-center gap-3 pb-4 border-b border-[#F3F4F6]">
                                                          <div className="w-10 h-10 rounded-full bg-[#EF4444]/10 flex items-center justify-center">
                                                            <span className="text-sm font-bold text-[#EF4444]">
                                                              {user.name.split(' ').map(n => n[0]).join('')}
                                                            </span>
                                                          </div>
                                                          <div>
                                                            <h4 className="font-bold text-[#111827] text-sm">{user.name}</h4>
                                                            <p className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wider">Assigned Roles</p>
                                                          </div>
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                          {user.role.split(', ').map((role, index) => (
                                                            <Badge 
                                                              key={index}
                                                              className="bg-[#6B7280]/10 text-[#6B7280] border-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg"
                                                            >
                                                              {role}
                                                            </Badge>
                                                          ))}
                                                        </div>
                                                      </div>
                                                    </PopoverContent>
                                                  </Popover>
                                                )}
                                              </div>
                                            </td>
                                            <td className="px-8 py-4 text-sm font-semibold text-[#111827]">{user.organization}</td>
                                            <td className="px-8 py-4 text-sm font-medium text-[#6B7280]">{user.department}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

            {/* Data Access Tab */}
            {/* Data Access Tab */}
            <TabsContent value="data-access" className="space-y-4">
              <Accordion type="single" collapsible className="space-y-3" value={openAccordion} onValueChange={setOpenAccordion}>
                {/* Pending Accordion */}
                <AccordionItem 
                  value="pending"
                  className="mt-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white mx-6 shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline transition-colors group">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-2 h-2 bg-[#EF4444] rounded-full shrink-0 animate-pulse"></div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-base font-semibold text-[#111827]">Pending</span>
                        <span className="text-[13px] text-[#6B7280]">Total Requests : {String(filteredDataAccessPending.length).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0 pt-0">
                    {/* Search and Date Range */}
                    <div className="px-8 py-6 border-t border-[#F3F4F6] bg-[#F9FAFB]/50 flex items-center gap-6">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9CA3AF]" />
                        <Input
                          placeholder="Search Pending Data Access..."
                          value={dataAccessPendingSearch}
                          onChange={(e) => setDataAccessPendingSearch(e.target.value)}
                          className="pl-12 bg-white border-[#E5E7EB] focus:ring-2 focus:ring-[#EF4444]/10 focus:border-[#EF4444] rounded-xl h-11 text-sm transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-xl px-4 h-11">
                          <Calendar className="w-4 h-4 text-[#9CA3AF]" />
                          <input
                            type="date"
                            value={dataAccessPendingDateRange.from}
                            onChange={(e) => setDataAccessPendingDateRange({ ...dataAccessPendingDateRange, from: e.target.value })}
                            className="bg-transparent border-0 focus:ring-0 text-sm text-[#374151] outline-none"
                          />
                          <span className="text-[#9CA3AF] text-sm font-medium">to</span>
                          <input
                            type="date"
                            value={dataAccessPendingDateRange.to}
                            onChange={(e) => setDataAccessPendingDateRange({ ...dataAccessPendingDateRange, to: e.target.value })}
                            className="bg-transparent border-0 focus:ring-0 text-sm text-[#374151] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-[#F3F4F6] overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F9FAFB]/80 border-b border-[#F3F4F6]">
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Request Id</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Organization & Department</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Service Details</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Requester Info</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Requested Date</th>
                            <th className="px-8 py-4 text-right text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F3F4F6]">
                          {filteredDataAccessPending.map((request) => (
                            <tr 
                              key={request.id}
                              className={`group hover:bg-[#F9FAFB] transition-all duration-200 ${highlightedId === request.id ? 'bg-[#EF4444]/5' : ''}`}
                            >
                              <td className="px-8 py-5">
                                <div className="flex flex-col gap-2">
                                  <span className="text-[#111827] font-bold tracking-tight">{request.id}</span>
                                  {getRequestVisuals({ ...request, submittedBy: request.requestor, status: 'pending' }) && (
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full w-fit ${getRequestVisuals({ ...request, submittedBy: request.requestor, status: 'pending' })?.bgColor}`}>
                                      <div className={`w-1.5 h-1.5 rounded-full ${getRequestVisuals({ ...request, submittedBy: request.requestor, status: 'pending' })?.indicator}`}></div>
                                      <span className={`text-[10px] font-bold uppercase tracking-wider ${getRequestVisuals({ ...request, submittedBy: request.requestor, status: 'pending' })?.textColor}`}>
                                        {getRequestVisuals({ ...request, submittedBy: request.requestor, status: 'pending' })?.label}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="font-bold text-[#111827]">{request.organization}</div>
                                <div className="text-xs font-medium text-[#6B7280] mt-0.5">IT Department</div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="font-bold text-[#111827]">{request.service}</div>
                                <div className="text-sm text-[#6B7280] font-medium leading-relaxed mt-0.5">{request.serviceDescription}</div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="font-bold text-[#111827]">{request.requestor}</div>
                                <div className="text-xs font-medium text-[#6B7280] mt-0.5">{request.organization} • Data Team</div>
                              </td>
                              <td className="px-8 py-5 text-sm font-bold text-[#6B7280] whitespace-nowrap">12 Jan 2025</td>
                              <td className="px-8 py-5 text-right">
                                {isReviewer ? (
                                    <span className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-wider">N/A</span>
                                  ) : (
                                    <div className="flex items-center justify-end gap-3">
                                      <Button 
                                        onClick={() => handleApproveClick(request.id)}
                                        size="sm"
                                        className="bg-[#10B981] hover:bg-[#059669] text-white text-[11px] font-bold uppercase tracking-wider px-6 h-10 rounded-full shadow-sm transition-all active:scale-95"
                                      >
                                        Approve
                                      </Button>
                                      <Button 
                                        onClick={() => {
                                          setForwardingRequest(request);
                                          setForwardDialogOpen(true);
                                        }}
                                        size="sm"
                                        variant="outline"
                                        className="border-[#003F72] text-[#003F72] hover:bg-[#003F72]/5 text-[11px] font-bold uppercase tracking-wider px-6 h-10 rounded-full shadow-sm transition-all active:scale-95"
                                      >
                                        Forward
                                      </Button>
                                      <Button 
                                        onClick={() => handleRejectClick(request)}
                                        size="sm"
                                        variant="outline"
                                        className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white text-[11px] font-bold uppercase tracking-wider px-6 h-10 rounded-full transition-all active:scale-95"
                                      >
                                        Reject
                                      </Button>
                                    </div>
                                  )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Forwarded Accordion */}
                <AccordionItem 
                  value="forwarded"
                  className="mt-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white mx-6 shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline transition-colors group">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-2 h-2 bg-[#F59E0B] rounded-full shrink-0"></div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-base font-semibold text-[#111827]">Forwarded</span>
                        <span className="text-[13px] text-[#6B7280]">Total Requests : {String(filteredDataAccessForwarded.length).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0 pt-0">
                    {/* Search and Date Range */}
                    <div className="px-8 py-6 border-t border-[#F3F4F6] bg-[#F9FAFB]/50 flex items-center gap-6">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9CA3AF]" />
                        <Input
                          placeholder="Search Forwarded Requests..."
                          value={dataAccessForwardedSearch}
                          onChange={(e) => setDataAccessForwardedSearch(e.target.value)}
                          className="pl-12 bg-white border-[#E5E7EB] focus:ring-2 focus:ring-[#EF4444]/10 focus:border-[#EF4444] rounded-xl h-11 text-sm transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-xl px-4 h-11">
                          <Calendar className="w-4 h-4 text-[#9CA3AF]" />
                          <input
                            type="date"
                            value={dataAccessForwardedDateRange.from}
                            onChange={(e) => setDataAccessForwardedDateRange({ ...dataAccessForwardedDateRange, from: e.target.value })}
                            className="bg-transparent border-0 focus:ring-0 text-sm text-[#374151] outline-none"
                          />
                          <span className="text-[#9CA3AF] text-sm font-medium">to</span>
                          <input
                            type="date"
                            value={dataAccessForwardedDateRange.to}
                            onChange={(e) => setDataAccessForwardedDateRange({ ...dataAccessForwardedDateRange, to: e.target.value })}
                            className="bg-transparent border-0 focus:ring-0 text-sm text-[#374151] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-[#F3F4F6] overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F9FAFB]/80 border-b border-[#F3F4F6]">
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Request Id</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Service & Owner</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Requester</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Timeline</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Comments</th>
                            <th className="px-8 py-4 text-right text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Workflow</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F3F4F6]">
                          {filteredDataAccessForwarded.map((request) => (
                            <tr 
                              key={request.id}
                              className="group hover:bg-[#F9FAFB] transition-all duration-200"
                            >
                              <td className="px-8 py-5">
                                <span className="text-[#111827] font-bold tracking-tight">{request.id}</span>
                              </td>
                              <td className="px-8 py-5">
                                <div className="font-bold text-[#111827]">{request.service}</div>
                                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                  {request.dataOwners && request.dataOwners.map((owner, ownerIndex) => (
                                    <Badge 
                                      key={ownerIndex}
                                      className="bg-[#374151]/10 text-[#374151] border-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
                                    >
                                      {owner}
                                    </Badge>
                                  ))}
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="font-bold text-[#111827]">{request.requestor}</div>
                                <div className="text-xs font-medium text-[#6B7280] mt-0.5">{request.organization}</div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="flex flex-col gap-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-[#9CA3AF] uppercase w-16">Req:</span>
                                    <span className="text-xs font-bold text-[#374151]">15 Jan 2025</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-[#9CA3AF] uppercase w-16">Fwd:</span>
                                    <span className="text-xs font-bold text-[#374151]">18 Jan 2025</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="text-sm text-[#4B5563] font-medium italic">"Forwarded to data owner for approval"</div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="flex items-center justify-end gap-1">
                                  {request.workflow.map((step, stepIndex) => (
                                    <div key={stepIndex} className="flex items-center">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger>
                                            <div 
                                              className={`
                                                w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold transition-all
                                                ${stepIndex < 2 ? 'bg-[#10B981]' : stepIndex === 2 ? 'bg-[#EF4444] animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.3)]' : 'bg-[#E5E7EB]'}
                                              `}
                                            >
                                              {stepIndex < 2 ? (
                                                <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                              ) : (
                                                stepIndex + 1
                                              )}
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent className="bg-[#111827] text-white border-0 rounded-lg py-2 px-3">
                                            <p className="text-[11px] font-bold uppercase tracking-wider">{step}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      
                                      {stepIndex < request.workflow.length - 1 && (
                                        <div 
                                          className={`
                                            w-4 h-0.5 mx-0.5
                                            ${stepIndex < 1 ? 'bg-[#10B981]' : 'bg-[#E5E7EB]'}
                                          `}
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Completed Accordion */}
                <AccordionItem 
                  value="completed"
                  className="mt-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white mx-6 shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline transition-colors group">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-2 h-2 bg-[#10B981] rounded-full shrink-0"></div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-base font-semibold text-[#111827]">Completed</span>
                        <span className="text-[13px] text-[#6B7280]">Total Requests : {String(filteredDataAccessCompleted.length).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0 pt-0">
                    {/* Search and Date Range */}
                    <div className="px-8 py-6 border-t border-[#F3F4F6] bg-[#F9FAFB]/50 flex items-center gap-6">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#9CA3AF]" />
                        <Input
                          placeholder="Search Completed Requests..."
                          value={dataAccessCompletedSearch}
                          onChange={(e) => setDataAccessCompletedSearch(e.target.value)}
                          className="pl-12 bg-white border-[#E5E7EB] focus:ring-2 focus:ring-[#EF4444]/10 focus:border-[#EF4444] rounded-xl h-11 text-sm transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-3 bg-white border border-[#E5E7EB] rounded-xl px-4 h-11">
                          <Calendar className="w-4 h-4 text-[#9CA3AF]" />
                          <input
                            type="date"
                            value={dataAccessCompletedDateRange.from}
                            onChange={(e) => setDataAccessCompletedDateRange({ ...dataAccessCompletedDateRange, from: e.target.value })}
                            className="bg-transparent border-0 focus:ring-0 text-sm text-[#374151] outline-none"
                          />
                          <span className="text-[#9CA3AF] text-sm font-medium">to</span>
                          <input
                            type="date"
                            value={dataAccessCompletedDateRange.to}
                            onChange={(e) => setDataAccessCompletedDateRange({ ...dataAccessCompletedDateRange, to: e.target.value })}
                            className="bg-transparent border-0 focus:ring-0 text-sm text-[#374151] outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="border-t border-[#F3F4F6] overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F9FAFB]/80 border-b border-[#F3F4F6]">
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Request Id</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Service Info</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Requester</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Approved Date</th>
                            <th className="px-8 py-4 text-left text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Approved By</th>
                            <th className="px-8 py-4 text-right text-[11px] font-bold text-[#6B7280] uppercase tracking-wider">Workflow</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F3F4F6]">
                          {filteredDataAccessCompleted.map((request) => (
                            <tr 
                              key={request.id}
                              className="group hover:bg-[#F9FAFB] transition-all duration-200"
                            >
                              <td className="px-8 py-5 text-[#111827] font-bold tracking-tight">{request.id}</td>
                              <td className="px-8 py-5">
                                <div className="font-bold text-[#111827]">{request.service}</div>
                                <div className="text-sm text-[#6B7280] font-medium leading-relaxed mt-0.5">{request.serviceDescription}</div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="font-bold text-[#111827]">{request.requestor}</div>
                                <div className="text-xs font-medium text-[#6B7280] mt-0.5">{request.organization}</div>
                              </td>
                              <td className="px-8 py-5 text-sm font-bold text-[#6B7280]">20 Jan 2025</td>
                              <td className="px-8 py-5">
                                <div className="font-bold text-[#111827]">Mohammed Al-Baker</div>
                                <div className="text-[10px] font-bold text-[#10B981] uppercase tracking-wider">IGA Admin</div>
                              </td>
                              <td className="px-8 py-5">
                                <div className="flex items-center justify-end gap-1">
                                  {request.workflow.map((step, stepIndex) => (
                                    <div key={stepIndex} className="flex items-center">
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger>
                                            <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#10B981] text-white">
                                              <Check className="w-3.5 h-3.5" strokeWidth={3} />
                                            </div>
                                          </TooltipTrigger>
                                          <TooltipContent className="bg-[#111827] text-white border-0 rounded-lg py-2 px-3">
                                            <p className="text-[11px] font-bold uppercase tracking-wider">{step}</p>
                                          </TooltipContent>
                                        </Tooltip>
                                      </TooltipProvider>
                                      {stepIndex < request.workflow.length - 1 && (
                                        <div className="w-4 h-0.5 mx-0.5 bg-[#10B981]" />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            {/* Spatial Permission Tab */}
            <TabsContent value="spatial-permission" className="space-y-6">
              {/* Permission Creation Requests Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-4 px-2">
                  <div className="h-px flex-1 bg-[#E5E7EB]"></div>
                  <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-[0.2em]">Spatial Access Requests</h3>
                  <div className="h-px flex-1 bg-[#E5E7EB]"></div>
                </div>
                
                <Accordion type="single" collapsible className="space-y-4" value={openAccordion} onValueChange={setOpenAccordion}>
                  <AccordionItem 
                    value="pending"
                    className="mt-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white mx-6 shadow-sm"
                  >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline transition-colors group">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-2 h-2 bg-[#EF4444] rounded-full shrink-0 animate-pulse"></div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-base font-semibold text-[#111827]">Pending Approval</span>
                        <span className="text-[13px] text-[#6B7280]">Total Requests : {String(filteredSpatialPending.length).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    {/* Search and Date Range */}
                    <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/30 flex items-center gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                        <Input
                          placeholder="Search spatial requests..."
                          value={spatialPendingSearch}
                          onChange={(e) => setSpatialPendingSearch(e.target.value)}
                          className="pl-11 h-11 bg-white border-[#E5E7EB] focus:border-[#EF4444] focus:ring-[#EF4444]/10 rounded-xl transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Input
                          type="date"
                          value={spatialPendingDateRange.from}
                          onChange={(e) => setSpatialPendingDateRange({ ...spatialPendingDateRange, from: e.target.value })}
                          className="h-11 bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl w-40"
                        />
                        <span className="text-gray-400 font-medium">to</span>
                        <Input
                          type="date"
                          value={spatialPendingDateRange.to}
                          onChange={(e) => setSpatialPendingDateRange({ ...spatialPendingDateRange, to: e.target.value })}
                          className="h-11 bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl w-40"
                        />
                      </div>
                    </div>
                    <div className="border-t border-gray-100 overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F9FAFB]/80">
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Request ID</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Permission Name</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Organization</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Spatial Scope</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Data Selection</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Layers</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Boundary</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Requested Date</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Preview</th>
                            <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredSpatialPending.map((request, index) => (
                            <tr 
                              key={request.id}
                              className="group border-b border-gray-50 last:border-0 hover:bg-[#F9FAFB] transition-colors"
                            >
                              <td className="px-6 py-4 text-gray-900 font-bold text-sm">
                                <div className="flex flex-col gap-2">
                                  <span>{request.id}</span>
                                  {getRequestVisuals({ ...request, status: 'pending' }) && (
                                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full w-fit ${getRequestVisuals({ ...request, status: 'pending' })?.bgColor} border border-black/5`}>
                                      <div className={`w-1.5 h-1.5 rounded-full ${getRequestVisuals({ ...request, status: 'pending' })?.indicator}`}></div>
                                      <span className={`text-[10px] font-bold uppercase tracking-wider ${getRequestVisuals({ ...request, status: 'pending' })?.textColor}`}>
                                        {getRequestVisuals({ ...request, status: 'pending' })?.label}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-700 text-sm font-medium">{request.permissionName}</td>
                              <td className="px-6 py-4 text-gray-700 text-sm">{request.organization}</td>
                              <td className="px-6 py-4 text-gray-700 text-sm">{index === 0 ? 'Full Coverage' : 'Partial'}</td>
                              <td className="px-6 py-4 text-gray-700 text-sm">{index === 0 ? 'All Attributes' : 'Selected'}</td>
                              <td className="px-6 py-4 text-gray-700 text-sm">{request.layers}</td>
                              <td className="px-6 py-4 text-gray-700 text-sm">{request.boundary}</td>
                              <td className="px-6 py-4 text-gray-500 text-sm font-medium">{index === 0 ? '12 Mar 2025' : '08 Mar 2025'}</td>
                              <td className="px-6 py-4">
                                <Button 
                                  onClick={() => {
                                    setPreviewingRequest(request);
                                    setMapPreviewOpen(true);
                                  }}
                                  variant="outline"
                                  className="h-8 border-[#E5E7EB] text-gray-600 hover:border-[#EF4444] hover:text-[#EF4444] text-[11px] font-bold px-3 rounded-lg bg-white"
                                >
                                  Preview
                                </Button>
                              </td>
                              <td className="px-6 py-4">
                                  {isReviewer ? (
                                    <div className="text-right">
                                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded">N/A</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-end gap-2">
                                      <Button 
                                        onClick={() => handleApproveClick(request.id)}
                                        className="bg-[#10B981] hover:bg-[#059669] text-white text-[11px] font-bold px-6 h-10 rounded-full shadow-sm transition-all active:scale-95"
                                      >
                                        Approve
                                      </Button>
                                      <Button 
                                        onClick={() => handleRejectClick(request)}
                                        variant="outline"
                                        className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white text-[11px] font-bold px-6 h-10 rounded-full transition-all active:scale-95"
                                      >
                                        Reject
                                      </Button>
                                    </div>
                                  )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Completed Accordion */}
                <AccordionItem 
                  value="completed"
                  className="mt-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white mx-6 shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline transition-colors group">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-2 h-2 bg-[#10B981] rounded-full shrink-0"></div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-base font-semibold text-[#111827]">Completed Requests</span>
                        <span className="text-[13px] text-[#6B7280]">Total Requests : {String(filteredSpatialCompleted.length).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    {/* Search and Date Range */}
                    <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/30 flex items-center gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                        <Input
                          placeholder="Search completed requests..."
                          value={spatialCompletedSearch}
                          onChange={(e) => setSpatialCompletedSearch(e.target.value)}
                          className="pl-11 h-11 bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Input
                          type="date"
                          value={spatialCompletedDateRange.from}
                          onChange={(e) => setSpatialCompletedDateRange({ ...spatialCompletedDateRange, from: e.target.value })}
                          className="h-11 bg-white border-[#E5E7EB] rounded-xl w-40"
                        />
                        <span className="text-gray-400 font-medium">to</span>
                        <Input
                          type="date"
                          value={spatialCompletedDateRange.to}
                          onChange={(e) => setSpatialCompletedDateRange({ ...spatialCompletedDateRange, to: e.target.value })}
                          className="h-11 bg-white border-[#E5E7EB] rounded-xl w-40"
                        />
                      </div>
                    </div>
                    <div className="border-t border-gray-100 overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F9FAFB]/80">
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Request ID</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Permission Name</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Organization</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Spatial Scope</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Data Selection</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Layers</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Boundary</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Requested Date</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Approved Date</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Approved By</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Preview</th>
                            <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredSpatialCompleted.map((request, index) => (
                            <tr 
                              key={request.id}
                              className="group border-b border-gray-50 last:border-0 hover:bg-[#F9FAFB] transition-colors"
                            >
                              <td className="px-6 py-4 text-gray-900 font-bold text-sm">{request.id}</td>
                              <td className="px-6 py-4 text-gray-700 text-sm font-medium">{request.permissionName}</td>
                              <td className="px-6 py-4 text-gray-700 text-sm">{request.organization}</td>
                              <td className="px-6 py-4 text-gray-700 text-sm">Full Coverage</td>
                              <td className="px-6 py-4 text-gray-700 text-sm">All Attributes</td>
                              <td className="px-6 py-4 text-gray-700 text-sm">{request.layers}</td>
                              <td className="px-6 py-4 text-gray-700 text-sm">{request.boundary}</td>
                              <td className="px-6 py-4 text-gray-500 text-sm font-medium">28 Feb 2025</td>
                              <td className="px-6 py-4 text-gray-500 text-sm font-medium">05 Mar 2025</td>
                              <td className="px-6 py-4 text-gray-700 text-sm font-medium">Lulwa Saad Mujaddam</td>
                              <td className="px-6 py-4">
                                <Button 
                                  onClick={() => {
                                    setPreviewingRequest(request);
                                    setMapPreviewOpen(true);
                                  }}
                                  variant="outline"
                                  className="h-8 border-[#E5E7EB] text-gray-600 hover:border-[#EF4444] hover:text-[#EF4444] text-[11px] font-bold px-3 rounded-lg bg-white"
                                >
                                  Preview
                                </Button>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <Badge className="bg-[#ECFDF5] text-[#10B981] border-green-100/50 text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider">Approved</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              </div>

              {/* User Spatial Permission Update Requests Section */}
              <div className="mt-12 mb-6 space-y-4">
                <div className="flex items-center gap-4 px-2">
                  <div className="h-px flex-1 bg-[#E5E7EB]"></div>
                  <h3 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-[0.2em]">User Spatial Permission Updates</h3>
                  <div className="h-px flex-1 bg-[#E5E7EB]"></div>
                </div>
                
                <Accordion type="single" collapsible className="space-y-3" value={openAccordion} onValueChange={setOpenAccordion}>
                  <AccordionItem 
                    value="user-pending"
                    className="mt-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white mx-6 shadow-sm"
                  >
                    <AccordionTrigger className="px-6 py-5 hover:no-underline transition-colors group">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-2 h-2 bg-[#EF4444] rounded-full shrink-0 animate-pulse"></div>
                        <div className="flex items-baseline gap-3">
                          <span className="text-base font-semibold text-[#111827]">Pending Approval</span>
                          <span className="text-[13px] text-[#6B7280]">Total Requests : {String(filteredSpatialUserPending.length).padStart(2, '0')}</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0">
                      {/* Search and Date Range */}
                      <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/30 flex items-center gap-4">
                        <div className="flex-1 relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                          <Input
                            placeholder="Search user updates..."
                            value={spatialUserPendingSearch}
                            onChange={(e) => setSpatialUserPendingSearch(e.target.value)}
                            className="pl-11 h-11 bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl transition-all"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Input
                            type="date"
                            value={spatialUserPendingDateRange.from}
                            onChange={(e) => setSpatialUserPendingDateRange({ ...spatialUserPendingDateRange, from: e.target.value })}
                            className="h-11 bg-white border-[#E5E7EB] rounded-xl w-40"
                          />
                          <span className="text-gray-400 font-medium">to</span>
                          <Input
                            type="date"
                            value={spatialUserPendingDateRange.to}
                            onChange={(e) => setSpatialUserPendingDateRange({ ...spatialUserPendingDateRange, to: e.target.value })}
                            className="h-11 bg-white border-[#E5E7EB] rounded-xl w-40"
                          />
                        </div>
                      </div>
                      <div className="border-t border-gray-100 overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-[#F9FAFB]/80">
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Request ID</th>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">User</th>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Permission</th>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Spatial Scope</th>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Data Selection</th>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Change Type</th>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Department</th>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Requested Date</th>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Requested By</th>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Preview</th>
                              <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredSpatialUserPending.map((request, index) => (
                              <tr 
                                key={request.id}
                                className="group border-b border-gray-50 last:border-0 hover:bg-[#F9FAFB] transition-colors"
                              >
                                <td className="px-6 py-4 text-gray-900 font-bold text-sm">{request.id}</td>
                                <td className="px-6 py-4">
                                  <div className="font-bold text-gray-900 text-sm tracking-tight">{request.user}</div>
                                  <div className="text-[11px] text-[#6B7280] font-medium mt-0.5">{request.userEmail}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-700 text-sm font-medium">{request.permission}</td>
                                <td className="px-6 py-4 text-gray-700 text-sm">{index === 0 ? 'Full Coverage' : 'Partial'}</td>
                                <td className="px-6 py-4 text-gray-700 text-sm">{index === 0 ? 'All Attributes' : 'Selected'}</td>
                                <td className="px-6 py-4">
                                  <Badge className={`${
                                    request.changeType === 'Add' 
                                      ? 'bg-green-50 text-[#10B981] border-green-100' 
                                      : 'bg-purple-50 text-purple-600 border-purple-100'
                                  } text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider`}>
                                    {request.changeType}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 text-gray-700 text-sm">{request.department}</td>
                                <td className="px-6 py-4 text-gray-500 text-sm font-medium">{index === 0 ? '16 Mar 2025' : '15 Mar 2025'}</td>
                                <td className="px-6 py-4 text-gray-700 text-sm font-medium">{request.userName || request.user || "Jawaher Rashed"}</td>
                                <td className="px-6 py-4">
                                  <Button 
                                    onClick={() => {
                                      setPreviewingRequest(request);
                                      setMapPreviewOpen(true);
                                    }}
                                    variant="outline"
                                    className="h-8 border-[#E5E7EB] text-gray-600 hover:border-[#EF4444] hover:text-[#EF4444] text-[11px] font-bold px-3 rounded-lg bg-white"
                                  >
                                    Preview
                                  </Button>
                                </td>
                                <td className="px-6 py-4">
                                  {isReviewer ? (
                                    <div className="text-right">
                                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded">N/A</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-end gap-2">
                                      <Button 
                                        onClick={() => handleApproveClick(request.id)}
                                        className="bg-[#10B981] hover:bg-[#059669] text-white text-[11px] font-bold px-6 h-10 rounded-full shadow-sm transition-all active:scale-95"
                                      >
                                        Approve
                                      </Button>
                                      <Button 
                                        onClick={() => handleRejectClick(request)}
                                        variant="outline"
                                        className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white text-[11px] font-bold px-6 h-10 rounded-full transition-all active:scale-95"
                                      >
                                        Reject
                                      </Button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* User Update Completed Accordion */}
                  <AccordionItem 
                    value="user-completed"
                    className="mt-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white mx-6 shadow-sm"
                  >
                    <AccordionTrigger className="px-6 py-5 hover:no-underline transition-colors group">
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-2 h-2 bg-[#10B981] rounded-full shrink-0"></div>
                        <div className="flex items-baseline gap-3">
                          <span className="text-base font-semibold text-[#111827]">Completed Requests</span>
                          <span className="text-[13px] text-[#6B7280]">Total Requests : {String(filteredSpatialUserCompleted.length).padStart(2, '0')}</span>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0">
                      {/* Search and Date Range */}
                      <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/30 flex items-center gap-4">
                        <div className="flex-1 relative">
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                          <Input
                            placeholder="Search completed updates..."
                            value={spatialUserCompletedSearch}
                            onChange={(e) => setSpatialUserCompletedSearch(e.target.value)}
                            className="pl-11 h-11 bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl transition-all"
                          />
                        </div>
                        <div className="flex items-center gap-3">
                          <Input
                            type="date"
                            value={spatialUserCompletedDateRange.from}
                            onChange={(e) => setSpatialUserCompletedDateRange({ ...spatialUserCompletedDateRange, from: e.target.value })}
                            className="h-11 bg-white border-[#E5E7EB] rounded-xl w-40"
                          />
                          <span className="text-gray-400 font-medium">to</span>
                          <Input
                            type="date"
                            value={spatialUserCompletedDateRange.to}
                            onChange={(e) => setSpatialUserCompletedDateRange({ ...spatialUserCompletedDateRange, to: e.target.value })}
                            className="h-11 bg-white border-[#E5E7EB] rounded-xl w-40"
                          />
                        </div>
                      </div>
                      <div className="border-t border-gray-100 overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="bg-[#F9FAFB]/80">
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Request ID</th>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">User</th>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Permission</th>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Spatial Scope</th>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Data Selection</th>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Change Type</th>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Department</th>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Requested Date</th>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Approved Date</th>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Approved By</th>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Requested By</th>
                              <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Preview</th>
                              <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredSpatialUserCompleted.map((request, index) => (
                              <tr 
                                key={request.id}
                                className="group border-b border-gray-50 last:border-0 hover:bg-[#F9FAFB] transition-colors"
                              >
                                <td className="px-6 py-4 text-gray-900 font-bold text-sm">{request.id}</td>
                                <td className="px-6 py-4">
                                  <div className="font-bold text-gray-900 text-sm tracking-tight">{request.user}</div>
                                  <div className="text-[11px] text-[#6B7280] font-medium mt-0.5">{request.userEmail}</div>
                                </td>
                                <td className="px-6 py-4 text-gray-700 text-sm font-medium">{request.permission}</td>
                                <td className="px-6 py-4 text-gray-700 text-sm">Full Coverage</td>
                                <td className="px-6 py-4 text-gray-700 text-sm">All Attributes</td>
                                <td className="px-6 py-4">
                                  <Badge className="bg-green-50 text-[#10B981] border-green-100 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                                    {request.changeType}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 text-gray-700 text-sm">{request.department}</td>
                                <td className="px-6 py-4 text-gray-500 text-sm font-medium">15 Feb 2025</td>
                                <td className="px-6 py-4 text-gray-500 text-sm font-medium">28 Feb 2025</td>
                                <td className="px-6 py-4 text-gray-700 text-sm font-medium">Omar Al-Ansari</td>
                                <td className="px-6 py-4 text-gray-700 text-sm font-medium">{request.userName || request.user || "Jawaher Rashed"}</td>
                                <td className="px-6 py-4">
                                  <Button 
                                    onClick={() => {
                                      setPreviewingRequest(request);
                                      setMapPreviewOpen(true);
                                    }}
                                    variant="outline"
                                    className="h-8 border-[#E5E7EB] text-gray-600 hover:border-[#EF4444] hover:text-[#EF4444] text-[11px] font-bold px-3 rounded-lg bg-white"
                                  >
                                    Preview
                                  </Button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <Badge className="bg-[#ECFDF5] text-[#10B981] border-green-100/50 text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider">Approved</Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>

            {/* Services Creation Tab */}
            <TabsContent value="services-creation" className="space-y-4">
              {/* Pending Accordion */}
              <Accordion type="single" collapsible className="space-y-3" value={openAccordion} onValueChange={setOpenAccordion}>
                <AccordionItem 
                  value="pending"
                  className="mt-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white mx-6 shadow-sm"
                >
                  <AccordionTrigger className="px-5 py-4 hover:no-underline transition-colors group">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-2 h-2 bg-[#EF4444] rounded-full shrink-0 animate-pulse"></div>
                      <div className="flex flex-col">
                        <span className="text-base font-semibold text-[#111827]">Pending Approval</span>
                        <span className="text-[13px] text-[#6B7280]">Total Requests : {String(filteredServicesPending.length).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    {/* Search and Date Range */}
                    <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/30 flex items-center gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                        <Input
                          placeholder="Search service requests..."
                          value={servicesPendingSearch}
                          onChange={(e) => setServicesPendingSearch(e.target.value)}
                          className="pl-11 h-11 bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Input
                          type="date"
                          value={servicesPendingDateRange.from}
                          onChange={(e) => setServicesPendingDateRange({ ...servicesPendingDateRange, from: e.target.value })}
                          className="h-11 bg-white border-[#E5E7EB] rounded-xl w-40"
                        />
                        <span className="text-gray-400 font-medium">to</span>
                        <Input
                          type="date"
                          value={servicesPendingDateRange.to}
                          onChange={(e) => setServicesPendingDateRange({ ...servicesPendingDateRange, to: e.target.value })}
                          className="h-11 bg-white border-[#E5E7EB] rounded-xl w-40"
                        />
                      </div>
                    </div>
                    <div className="border-t border-gray-100 overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F9FAFB]/80">
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Request ID</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Service Name</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Organization</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Requestor</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Requested By</th>
                            <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredServicesPending.map((request, index) => (
                            <tr 
                              key={request.id}
                              className="group border-b border-gray-50 last:border-0 hover:bg-[#F9FAFB] transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-2">
                                  <span className="text-gray-900 font-bold text-sm tracking-tight">{request.id}</span>
                                  {getRequestVisuals({ ...request, submittedBy: request.requestor, status: 'pending' }) && (
                                    <Badge className={`w-fit inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border-0 ${getRequestVisuals({ ...request, submittedBy: request.requestor, status: 'pending' })?.bgColor}`}>
                                      <div className={`w-1.5 h-1.5 rounded-full ${getRequestVisuals({ ...request, submittedBy: request.requestor, status: 'pending' })?.indicator}`}></div>
                                      <span className={`text-[9px] font-bold uppercase tracking-wider ${getRequestVisuals({ ...request, submittedBy: request.requestor, status: 'pending' })?.textColor}`}>
                                        {getRequestVisuals({ ...request, submittedBy: request.requestor, status: 'pending' })?.label}
                                      </span>
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-900 text-sm font-bold">{request.serviceName}</td>
                              <td className="px-6 py-4">
                                <Badge className="bg-blue-50 text-blue-600 border-blue-100 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                                  {request.type}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-gray-600 text-sm leading-relaxed max-w-[200px] truncate">{request.description}</td>
                              <td className="px-6 py-4 text-gray-700 text-sm font-medium">{request.organization}</td>
                              <td className="px-6 py-4 text-gray-600 text-sm">{request.department}</td>
                              <td className="px-6 py-4 text-gray-700 text-sm font-medium">{request.requestor}</td>
                              <td className="px-6 py-4 text-gray-500 text-sm font-medium">14 Mar 2025</td>
                              <td className="px-6 py-4 text-gray-700 text-sm font-medium">{request.requestor || "Jawaher Rashed"}</td>
                              <td className="px-6 py-4 text-right">
                                  {isReviewer ? (
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded">N/A</span>
                                  ) : (
                                    <div className="flex items-center justify-end gap-2">
                                      <Button
                                        onClick={() => handleApproveClick(request.id)}
                                        className="bg-[#EF4444] hover:bg-[#D93030] text-white text-[11px] font-bold px-4 h-8 rounded-lg shadow-sm"
                                      >
                                        Approve
                                      </Button>
                                      <Button
                                        onClick={() => handleRejectClick(request)}
                                        variant="outline"
                                        className="border-[#E5E7EB] text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-[#EF4444] text-[11px] font-bold px-4 h-8 rounded-lg"
                                      >
                                        Reject
                                      </Button>
                                    </div>
                                  )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Completed Accordion */}
                <AccordionItem 
                  value="completed"
                  className="mt-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white mx-6 shadow-sm"
                >
                  <AccordionTrigger className="px-5 py-4 hover:no-underline transition-colors group">
                    <div className="flex items-center gap-4 text-left">
                      <div className="w-2 h-2 bg-[#10B981] rounded-full shrink-0"></div>
                      <div className="flex flex-col">
                        <span className="text-base font-semibold text-[#111827]">Completed Requests</span>
                        <span className="text-[13px] text-[#6B7280]">Total Requests : {String(filteredServicesCompleted.length).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    {/* Search and Date Range */}
                    <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/30 flex items-center gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                        <Input
                          placeholder="Search completed services..."
                          value={servicesCompletedSearch}
                          onChange={(e) => setServicesCompletedSearch(e.target.value)}
                          className="pl-11 h-11 bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Input
                          type="date"
                          value={servicesCompletedDateRange.from}
                          onChange={(e) => setServicesCompletedDateRange({ ...servicesCompletedDateRange, from: e.target.value })}
                          className="h-11 bg-white border-[#E5E7EB] rounded-xl w-40"
                        />
                        <span className="text-gray-400 font-medium">to</span>
                        <Input
                          type="date"
                          value={servicesCompletedDateRange.to}
                          onChange={(e) => setServicesCompletedDateRange({ ...servicesCompletedDateRange, to: e.target.value })}
                          className="h-11 bg-white border-[#E5E7EB] rounded-xl w-40"
                        />
                      </div>
                    </div>
                    <div className="border-t border-gray-100 overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F9FAFB]/80">
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Request ID</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Service Name</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">URL Endpoint</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Organization</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Requestor</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Req. Date</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">App. Date</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Approved By</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Requested By</th>
                            <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredServicesCompleted.map((request, index) => (
                              <tr
                                key={`service-completed-${request.id}-${index}`}
                                className="group border-b border-gray-50 last:border-0 hover:bg-[#F9FAFB] transition-colors"
                              >
                                <td className="px-6 py-4 text-gray-900 font-bold text-sm tracking-tight">{request.id}</td>
                                <td className="px-6 py-4 text-gray-900 text-sm font-bold">{request.serviceName}</td>
                                <td className="px-6 py-4">
                                  <div className="text-xs text-blue-600 font-mono bg-blue-50/50 px-2 py-0.5 rounded w-fit">{request.url}</div>
                                </td>
                                <td className="px-6 py-4">
                                  <Badge className="bg-blue-50 text-blue-600 border-blue-100 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                                    {request.type}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 text-gray-600 text-sm leading-relaxed max-w-[200px] truncate">{request.description}</td>
                                <td className="px-6 py-4 text-gray-700 text-sm font-medium">{request.organization}</td>
                                <td className="px-6 py-4 text-gray-600 text-sm">{request.department}</td>
                                <td className="px-6 py-4 text-gray-700 text-sm font-medium">{request.requestor}</td>
                                <td className="px-6 py-4 text-gray-500 text-sm font-medium">01 Mar 2025</td>
                                <td className="px-6 py-4 text-gray-500 text-sm font-medium">12 Mar 2025</td>
                                <td className="px-6 py-4 text-gray-700 text-sm font-medium">Khalid Al-Zayani</td>
                                <td className="px-6 py-4 text-gray-700 text-sm font-medium">{request.requestor || "Jawaher Rashed"}</td>
                                <td className="px-6 py-4 text-right">
                                  <Badge className="bg-[#ECFDF5] text-[#10B981] border-green-100/50 text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider">Approved</Badge>
                                </td>
                              </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            {/* Data Download Tab */}
            <TabsContent value="data-download" className="space-y-4">
              {/* Pending Accordion */}
              <Accordion type="single" collapsible className="space-y-3" value={openAccordion} onValueChange={setOpenAccordion}>
                <AccordionItem 
                  value="pending"
                  className="mt-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white mx-6 shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline transition-colors group">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-2 h-2 bg-[#EF4444] rounded-full shrink-0 animate-pulse"></div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-base font-semibold text-[#111827]">Pending Approval</span>
                        <span className="text-[13px] text-[#6B7280]">Total Requests : {String(filteredDownloadPending.length).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    {/* Search and Date Range */}
                    <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/30 flex items-center gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                        <Input
                          placeholder="Search download requests..."
                          value={downloadPendingSearch}
                          onChange={(e) => setDownloadPendingSearch(e.target.value)}
                          className="pl-11 h-11 bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Input
                          type="date"
                          value={downloadPendingDateRange.from}
                          onChange={(e) => setDownloadPendingDateRange({ ...downloadPendingDateRange, from: e.target.value })}
                          className="h-11 bg-white border-[#E5E7EB] rounded-xl w-40"
                        />
                        <span className="text-gray-400 font-medium">to</span>
                        <Input
                          type="date"
                          value={downloadPendingDateRange.to}
                          onChange={(e) => setDownloadPendingDateRange({ ...downloadPendingDateRange, to: e.target.value })}
                          className="h-11 bg-white border-[#E5E7EB] rounded-xl w-40"
                        />
                      </div>
                    </div>
                    <div className="border-t border-gray-100 overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F9FAFB]/80">
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Request ID</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Dataset</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Format</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Requestor</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Description</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Requested By</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Preview</th>
                            <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredDownloadPending.map((request, index) => (
                            <tr 
                              key={request.id}
                              className="group border-b border-gray-50 last:border-0 hover:bg-[#F9FAFB] transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-2">
                                  <span className="text-gray-900 font-bold text-sm tracking-tight">{request.id}</span>
                                  {getRequestVisuals({ ...request, submittedBy: request.requestor, status: 'pending' }) && (
                                    <Badge className={`w-fit inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border-0 ${getRequestVisuals({ ...request, submittedBy: request.requestor, status: 'pending' })?.bgColor}`}>
                                      <div className={`w-1.5 h-1.5 rounded-full ${getRequestVisuals({ ...request, submittedBy: request.requestor, status: 'pending' })?.indicator}`}></div>
                                      <span className={`text-[9px] font-bold uppercase tracking-wider ${getRequestVisuals({ ...request, submittedBy: request.requestor, status: 'pending' })?.textColor}`}>
                                        {getRequestVisuals({ ...request, submittedBy: request.requestor, status: 'pending' })?.label}
                                      </span>
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-900 text-sm font-bold">{request.dataset}</td>
                              <td className="px-6 py-4">
                                <Badge className="bg-orange-50 text-orange-600 border-orange-100 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                                  {request.format}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-gray-700 text-sm font-medium">{request.requestor}</td>
                              <td className="px-6 py-4 text-gray-600 text-sm leading-relaxed max-w-[200px] truncate">{request.description || 'N/A'}</td>
                              <td className="px-6 py-4 text-gray-500 text-xs font-medium italic">{request.email || 'N/A'}</td>
                              <td className="px-6 py-4 text-gray-500 text-sm font-medium">14 Mar 2025</td>
                              <td className="px-6 py-4 text-gray-700 text-sm font-medium">{request.requestor || "Jawaher Rashed"}</td>
                              <td className="px-6 py-4">
                                <Button 
                                  onClick={() => {
                                    setPreviewingRequest(request);
                                    setMapPreviewOpen(true);
                                  }}
                                  variant="outline"
                                  className="h-8 border-[#E5E7EB] text-gray-600 hover:border-[#EF4444] hover:text-[#EF4444] text-[11px] font-bold px-3 rounded-lg bg-white flex items-center gap-2"
                                >
                                  <Map className="w-3.5 h-3.5" />
                                  Map
                                </Button>
                              </td>
                              <td className="px-6 py-4">
                                  {isReviewer ? (
                                    <div className="text-right">
                                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2 py-1 rounded">N/A</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-end gap-2">
                                      <Button 
                                        onClick={() => handleApproveClick(request.id)}
                                        className="bg-[#10B981] hover:bg-[#059669] text-white text-[11px] font-bold px-6 h-10 rounded-full shadow-sm transition-all active:scale-95"
                                      >
                                        Approve
                                      </Button>
                                      <Button 
                                        onClick={() => {
                                          setForwardingRequest(request);
                                          setForwardDialogOpen(true);
                                        }}
                                        variant="outline"
                                        className="border-[#003F72] text-[#003F72] hover:bg-[#003F72]/5 text-[11px] font-bold px-6 h-10 rounded-full shadow-sm transition-all active:scale-95"
                                      >
                                        Forward
                                      </Button>
                                      <Button 
                                        onClick={() => handleRejectClick(request)}
                                        variant="outline"
                                        className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white text-[11px] font-bold px-6 h-10 rounded-full transition-all active:scale-95"
                                      >
                                        Reject
                                      </Button>
                                    </div>
                                  )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Forwarded Accordion */}
                <AccordionItem 
                  value="forwarded"
                  className="mt-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white mx-6 shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline transition-colors group">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-2 h-2 bg-[#F59E0B] rounded-full shrink-0"></div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-base font-semibold text-[#111827]">Forwarded Requests</span>
                        <span className="text-[13px] text-[#6B7280]">Total Requests : {String(dataDownloadForwardedList.length).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    {/* Search and Date Range */}
                    <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/30 flex items-center gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                        <Input
                          placeholder="Search forwarded requests..."
                          value={downloadForwardedSearch}
                          onChange={(e) => setDownloadForwardedSearch(e.target.value)}
                          className="pl-11 h-11 bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Input
                          type="date"
                          value={downloadForwardedDateRange.from}
                          onChange={(e) => setDownloadForwardedDateRange({ ...downloadForwardedDateRange, from: e.target.value })}
                          className="h-11 bg-white border-[#E5E7EB] rounded-xl w-40"
                        />
                        <span className="text-gray-400 font-medium">to</span>
                        <Input
                          type="date"
                          value={downloadForwardedDateRange.to}
                          onChange={(e) => setDownloadForwardedDateRange({ ...downloadForwardedDateRange, to: e.target.value })}
                          className="h-11 bg-white border-[#E5E7EB] rounded-xl w-40"
                        />
                      </div>
                    </div>
                    <div className="border-t border-gray-100 overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F9FAFB]/80">
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Request ID</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Dataset</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Product</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Requestor</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Req. Date</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Fwd. Date</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Requested By</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Data Owners</th>
                            <th className="px-6 py-4 text-center text-[11px] font-bold text-gray-500 uppercase tracking-wider">Workflow</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataDownloadForwardedList.map((request, index) => (
                            <tr 
                              key={request.id}
                              className="group border-b border-gray-50 last:border-0 hover:bg-[#F9FAFB] transition-colors"
                            >
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-2">
                                  <span className="text-gray-900 font-bold text-sm tracking-tight">{request.id}</span>
                                  <Badge className="w-fit inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border-0 bg-amber-50">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></div>
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700">Forwarded</span>
                                  </Badge>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-gray-900 text-sm font-bold">{request.dataset}</td>
                              <td className="px-6 py-4 text-gray-700 text-sm font-medium">{request.product}</td>
                              <td className="px-6 py-4 text-gray-700 text-sm font-medium">{request.requestor}</td>
                              <td className="px-6 py-4 text-gray-500 text-sm font-medium">10 Mar 2025</td>
                              <td className="px-6 py-4 text-gray-500 text-sm font-medium">12 Mar 2025</td>
                              <td className="px-6 py-4 text-gray-700 text-sm font-medium">{request.requestor || "Jawaher Rashed"}</td>
                              <td className="px-6 py-4">
                                <div className="flex flex-wrap items-center gap-1.5">
                                  {request.dataOwners.map((owner, ownerIndex) => (
                                    <Badge 
                                      key={ownerIndex}
                                      className="bg-blue-50 text-blue-600 border-blue-100/50 text-[10px] font-bold px-2 py-0.5"
                                    >
                                      {owner}
                                    </Badge>
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center gap-1">
                                  {request.workflow.map((step: string, stepIndex: number) => {
                                    const isCompleted = stepIndex < 2;
                                    const isActive = stepIndex === 2;
                                    const isPending = stepIndex > 2;
                                    
                                    return (
                                      <div key={stepIndex} className="flex items-center">
                                        <div className="flex flex-col items-center group/step">
                                          <div 
                                            className={`
                                              w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                              ${isCompleted ? 'bg-[#10B981] border-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.3)]' : ''}
                                              ${isActive ? 'bg-white border-[#EF4444] shadow-[0_0_8px_rgba(239,68,68,0.2)] scale-110' : ''}
                                              ${isPending ? 'bg-white border-gray-200' : ''}
                                            `}
                                          >
                                            {isCompleted && (
                                              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                              </svg>
                                            )}
                                            {isActive && (
                                              <div className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse"></div>
                                            )}
                                          </div>
                                          <div className="absolute opacity-0 group-hover/step:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] py-1 px-2 rounded -mt-12 pointer-events-none whitespace-nowrap z-10 font-bold uppercase tracking-wider">
                                            {step}
                                          </div>
                                        </div>
                                        
                                        {stepIndex < request.workflow.length - 1 && (
                                          <div 
                                            className={`
                                              w-6 h-0.5 mx-0.5
                                              ${stepIndex < 2 ? 'bg-[#10B981]' : 'bg-gray-100'}
                                            `}
                                          ></div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Completed Accordion */}
                <AccordionItem 
                  value="completed"
                  className="mt-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white mx-6 shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline transition-colors group">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-2 h-2 bg-[#10B981] rounded-full shrink-0"></div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-base font-semibold text-[#111827]">Completed Requests</span>
                        <span className="text-[13px] text-[#6B7280]">Total Requests : {String(dataDownloadCompletedRequests.length).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    {/* Search and Date Range */}
                    <div className="px-6 py-5 border-t border-gray-100 bg-gray-50/30 flex items-center gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                        <Input
                          placeholder="Search completed downloads..."
                          value={downloadCompletedSearch}
                          onChange={(e) => setDownloadCompletedSearch(e.target.value)}
                          className="pl-11 h-11 bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl transition-all"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <Input
                          type="date"
                          value={downloadCompletedDateRange.from}
                          onChange={(e) => setDownloadCompletedDateRange({ ...downloadCompletedDateRange, from: e.target.value })}
                          className="h-11 bg-white border-[#E5E7EB] rounded-xl w-40"
                        />
                        <span className="text-gray-400 font-medium">to</span>
                        <Input
                          type="date"
                          value={downloadCompletedDateRange.to}
                          onChange={(e) => setDownloadCompletedDateRange({ ...downloadCompletedDateRange, to: e.target.value })}
                          className="h-11 bg-white border-[#E5E7EB] rounded-xl w-40"
                        />
                      </div>
                    </div>
                    <div className="border-t border-gray-100 overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F9FAFB]/80">
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Request ID</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Dataset</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Format</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Requestor</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Req. Date</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">App. Date</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Approved By</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">Requested By</th>
                            <th className="px-6 py-4 text-right text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {dataDownloadCompletedRequests.map((request, index) => (
                            <tr 
                              key={request.id}
                              className="group border-b border-gray-50 last:border-0 hover:bg-[#F9FAFB] transition-colors"
                            >
                              <td className="px-6 py-4 text-gray-900 font-bold text-sm tracking-tight">{request.id}</td>
                              <td className="px-6 py-4 text-gray-900 text-sm font-bold">{request.dataset}</td>
                              <td className="px-6 py-4">
                                <Badge className="bg-orange-50 text-orange-600 border-orange-100 text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider">
                                  {request.format}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-gray-700 text-sm font-medium">{request.requestor}</td>
                              <td className="px-6 py-4 text-gray-500 text-sm font-medium">05 Mar 2025</td>
                              <td className="px-6 py-4 text-gray-500 text-sm font-medium">14 Mar 2025</td>
                              <td className="px-6 py-4 text-gray-700 text-sm font-medium">Layla Al-Qassimi</td>
                              <td className="px-6 py-4 text-gray-700 text-sm font-medium">{request.requestor || "Jawaher Rashed"}</td>
                              <td className="px-6 py-4 text-right">
                                <Badge className="bg-[#ECFDF5] text-[#10B981] border-green-100/50 text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider">Approved</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            {/* Metadata Tab */}
            <TabsContent value="metadata" className="space-y-4">
              {/* Pending Accordion */}
              <Accordion type="single" collapsible className="space-y-3" value={openAccordion} onValueChange={setOpenAccordion}>
                <AccordionItem 
                  value="pending"
                  className="mt-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white mx-6 shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline transition-colors group">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-2 h-2 bg-[#EF4444] rounded-full shrink-0 animate-pulse"></div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-base font-semibold text-[#111827]">Pending</span>
                        <span className="text-[13px] text-[#6B7280]">Total Requests : 03</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    {/* Search and Date Range */}
                    <div className="px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB]/50 flex items-center gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <Input
                          placeholder="Search Requests..."
                          value={metadataPendingSearch}
                          onChange={(e) => setMetadataPendingSearch(e.target.value)}
                          className="pl-10 bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl h-10"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="date"
                          value={metadataPendingDateRange.from}
                          onChange={(e) => setMetadataPendingDateRange({ ...metadataPendingDateRange, from: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl h-10"
                        />
                        <span className="text-[#6B7280] font-medium text-sm">to</span>
                        <Input
                          type="date"
                          value={metadataPendingDateRange.to}
                          onChange={(e) => setMetadataPendingDateRange({ ...metadataPendingDateRange, to: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl h-10"
                        />
                      </div>
                    </div>
                    <div className="border-t border-[#E5E7EB] overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F9FAFB]/80">
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Request Id</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Layer Name</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Requestor</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Requested Date</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Requested By</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                          {metadataPendingRequests.map((request, index) => (
                            <tr 
                              key={request.id}
                              className={`${highlightedId === request.id ? 'bg-[#EF4444]/5' : (index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]/30')} hover:bg-[#F9FAFB] transition-colors`}
                            >
                              <td className="px-6 py-4 text-[#111827] font-medium text-sm">
                                <div className="flex flex-col gap-1.5">
                                  <span>{request.id}</span>
                                  {getRequestVisuals({ ...request, submittedBy: request.requestor, status: 'pending' }) && (
                                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full w-fit ${getRequestVisuals({ ...request, submittedBy: request.requestor, status: 'pending' })?.bgColor}`}>
                                      <div className={`w-1.5 h-1.5 rounded-full ${getRequestVisuals({ ...request, submittedBy: request.requestor, status: 'pending' })?.indicator}`}></div>
                                      <span className={`text-[10px] font-bold uppercase tracking-wider ${getRequestVisuals({ ...request, submittedBy: request.requestor, status: 'pending' })?.textColor}`}>
                                        {getRequestVisuals({ ...request, submittedBy: request.requestor, status: 'pending' })?.label}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-[#111827] text-sm">{request.layerName}</div>
                                <div className="text-xs text-[#6B7280] mt-0.5">{request.layerSubtitle}</div>
                              </td>
                              <td className="px-6 py-4 text-[#374151] text-sm">{request.requestor}</td>
                              <td className="px-6 py-4 text-[#6B7280] text-sm font-medium">{index === 0 ? '16 Mar 2025' : index === 1 ? '14 Mar 2025' : '12 Mar 2025'}</td>
                              <td className="px-6 py-4 text-[#374151] text-sm">{request.requestor || "Jawaher Rashed"}</td>
                              <td className="px-6 py-4">
                                  {isReviewer ? (
                                    <span className="text-xs text-[#9CA3AF] font-semibold italic">N/A</span>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <Button 
                                        onClick={() => handleApproveClick(request.id)}
                                        size="sm"
                                        className="bg-[#10B981] hover:bg-[#059669] text-white text-[11px] font-bold uppercase tracking-wider px-6 h-10 rounded-full shadow-sm transition-all active:scale-95"
                                      >
                                        Approve
                                      </Button>
                                      <Button 
                                        onClick={() => handleRejectClick(request)}
                                        size="sm"
                                        variant="outline"
                                        className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white text-[11px] font-bold uppercase tracking-wider px-6 h-10 rounded-full transition-all active:scale-95"
                                      >
                                        Reject
                                      </Button>
                                    </div>
                                  )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Completed Accordion */}
                <AccordionItem 
                  value="completed"
                  className="mt-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white mx-6 shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline transition-colors group">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-2 h-2 bg-[#10B981] rounded-full shrink-0"></div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-base font-semibold text-[#111827]">Completed</span>
                        <span className="text-[13px] text-[#6B7280]">Total Requests : 02</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    {/* Search and Date Range */}
                    <div className="px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB]/50 flex items-center gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <Input
                          placeholder="Search Requests..."
                          value={metadataCompletedSearch}
                          onChange={(e) => setMetadataCompletedSearch(e.target.value)}
                          className="pl-10 bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl h-10"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="date"
                          value={metadataCompletedDateRange.from}
                          onChange={(e) => setMetadataCompletedDateRange({ ...metadataCompletedDateRange, from: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl h-10"
                        />
                        <span className="text-[#6B7280] font-medium text-sm">to</span>
                        <Input
                          type="date"
                          value={metadataCompletedDateRange.to}
                          onChange={(e) => setMetadataCompletedDateRange({ ...metadataCompletedDateRange, to: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl h-10"
                        />
                      </div>
                    </div>
                    <div className="border-t border-[#E5E7EB] overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F9FAFB]/80">
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Request Id</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Layer Name</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Requestor</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Requested Date</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Approved Date</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Approved By</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Requested By</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                          {metadataCompletedRequests.map((request, index) => (
                            <tr 
                              key={request.id}
                              className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]/30'} hover:bg-[#F9FAFB] transition-colors`}
                            >
                              <td className="px-6 py-4 text-[#111827] font-medium text-sm">{request.id}</td>
                              <td className="px-6 py-4">
                                <div className="font-semibold text-[#111827] text-sm">{request.layerName}</div>
                                <div className="text-xs text-[#6B7280] mt-0.5">{request.layerSubtitle}</div>
                              </td>
                              <td className="px-6 py-4 text-[#374151] text-sm">{request.requestor}</td>
                              <td className="px-6 py-4 text-[#6B7280] text-sm font-medium">{request.date}</td>
                              <td className="px-6 py-4 text-[#6B7280] text-sm font-medium">13 Mar 2025</td>
                              <td className="px-6 py-4 text-[#374151] text-sm">Noor Al-Hashimi</td>
                              <td className="px-6 py-4 text-[#374151] text-sm">{request.requestor || "Jawaher Rashed"}</td>
                              <td className="px-6 py-4">
                                <Badge className="bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 text-xs font-bold px-3 py-1 rounded-full">Approved</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            {/* Application User Tab */}
            <TabsContent value="application-user" className="space-y-4">
              {/* Pending Accordion */}
              <Accordion type="single" collapsible className="space-y-3" value={openAccordion} onValueChange={setOpenAccordion}>
                <AccordionItem 
                  value="pending"
                  className="mt-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white mx-6 shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline transition-colors group">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-2 h-2 bg-[#EF4444] rounded-full shrink-0 animate-pulse"></div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-base font-semibold text-[#111827]">Pending</span>
                        <span className="text-[13px] text-[#6B7280]">Total Requests : {String(appUserPendingRequests.length).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    {/* Search and Date Range */}
                    <div className="px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB]/50 flex items-center gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <Input
                          placeholder="Search Requests..."
                          value={appUserPendingSearch}
                          onChange={(e) => setAppUserPendingSearch(e.target.value)}
                          className="pl-10 bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl h-10"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="date"
                          value={appUserPendingDateRange.from}
                          onChange={(e) => setAppUserPendingDateRange({ ...appUserPendingDateRange, from: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl h-10"
                        />
                        <span className="text-[#6B7280] font-medium text-sm">to</span>
                        <Input
                          type="date"
                          value={appUserPendingDateRange.to}
                          onChange={(e) => setAppUserPendingDateRange({ ...appUserPendingDateRange, to: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl h-10"
                        />
                      </div>
                    </div>
                    <div className="border-t border-[#E5E7EB] overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F9FAFB]/80">
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Request Id</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">User Name</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Organization</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Department</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Requested Date</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Requested By</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                          {appUserPendingRequests.map((request, index) => (
                            <tr 
                              key={request.id}
                              className={`${highlightedId === request.id ? 'bg-[#EF4444]/5' : (index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]/30')} hover:bg-[#F9FAFB] transition-colors`}
                            >
                              <td className="px-6 py-4 text-[#111827] font-medium text-sm">
                                <div className="flex flex-col gap-1.5">
                                  <span>{request.id}</span>
                                  {getRequestVisuals({ ...request, status: 'pending' }) && (
                                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full w-fit ${getRequestVisuals({ ...request, status: 'pending' })?.bgColor}`}>
                                      <div className={`w-1.5 h-1.5 rounded-full ${getRequestVisuals({ ...request, status: 'pending' })?.indicator}`}></div>
                                      <span className={`text-[10px] font-bold uppercase tracking-wider ${getRequestVisuals({ ...request, status: 'pending' })?.textColor}`}>
                                        {getRequestVisuals({ ...request, status: 'pending' })?.label}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 text-[#111827] font-semibold text-sm">{request.userName}</td>
                              <td className="px-6 py-4 text-[#6B7280] text-sm">{request.email}</td>
                              <td className="px-6 py-4 text-[#374151] text-sm">{request.organization}</td>
                              <td className="px-6 py-4 text-[#6B7280] text-sm">{request.department}</td>
                              <td className="px-6 py-4">
                                <Badge className="bg-[#0099DD]/10 text-[#0099DD] border-[#0099DD]/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  {request.role}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-[#6B7280] text-sm font-medium">{request.requestedDate}</td>
                              <td className="px-6 py-4 text-[#374151] text-sm">{request.submittedBy || "Jawaher Rashed"}</td>
                              <td className="px-6 py-4">
                                  {isReviewer ? (
                                    <span className="text-xs text-[#9CA3AF] font-semibold italic">N/A</span>
                                  ) : (
                                    <div className="flex items-center gap-2">
                                      <Button 
                                        onClick={() => handleApproveClick(request.id)}
                                        size="sm"
                                        className="bg-[#10B981] hover:bg-[#059669] text-white text-[11px] font-bold uppercase tracking-wider px-6 h-10 rounded-full shadow-sm transition-all active:scale-95"
                                      >
                                        Approve
                                      </Button>
                                      <Button 
                                        onClick={() => handleRejectClick(request)}
                                        size="sm"
                                        variant="outline"
                                        className="border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white text-[11px] font-bold uppercase tracking-wider px-6 h-10 rounded-full transition-all active:scale-95"
                                      >
                                        Reject
                                      </Button>
                                    </div>
                                  )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Completed Accordion */}
                <AccordionItem 
                  value="completed"
                  className="mt-4 border border-[#E5E7EB] rounded-2xl overflow-hidden bg-white mx-6 shadow-sm"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline transition-colors group">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-2 h-2 bg-[#10B981] rounded-full shrink-0"></div>
                      <div className="flex items-baseline gap-3">
                        <span className="text-base font-semibold text-[#111827]">Completed</span>
                        <span className="text-[13px] text-[#6B7280]">Total Requests : {String(appUserCompletedRequests.length).padStart(2, '0')}</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    {/* Search and Date Range */}
                    <div className="px-6 py-4 border-t border-[#E5E7EB] bg-[#F9FAFB]/50 flex items-center gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <Input
                          placeholder="Search Requests..."
                          value={appUserCompletedSearch}
                          onChange={(e) => setAppUserCompletedSearch(e.target.value)}
                          className="pl-10 bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl h-10"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="date"
                          value={appUserCompletedDateRange.from}
                          onChange={(e) => setAppUserCompletedDateRange({ ...appUserCompletedDateRange, from: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl h-10"
                        />
                        <span className="text-[#6B7280] font-medium text-sm">to</span>
                        <Input
                          type="date"
                          value={appUserCompletedDateRange.to}
                          onChange={(e) => setAppUserCompletedDateRange({ ...appUserCompletedDateRange, to: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:border-[#EF4444] rounded-xl h-10"
                        />
                      </div>
                    </div>
                    <div className="border-t border-[#E5E7EB] overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-[#F9FAFB]/80">
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Request Id</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">User Name</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Email</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Organization</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Department</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Role</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Requested Date</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Approved Date</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Approved By</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Requested By</th>
                            <th className="px-6 py-4 text-left text-[11px] font-bold text-[#4B5563] uppercase tracking-wider">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E5E7EB]">
                          {appUserCompletedRequests.map((request, index) => (
                            <tr 
                              key={request.id}
                              className={`${index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]/30'} hover:bg-[#F9FAFB] transition-colors`}
                            >
                              <td className="px-6 py-4 text-[#111827] font-medium text-sm">{request.id}</td>
                              <td className="px-6 py-4 text-[#111827] font-semibold text-sm">{request.userName}</td>
                              <td className="px-6 py-4 text-[#6B7280] text-sm">{request.email}</td>
                              <td className="px-6 py-4 text-[#374151] text-sm">{request.organization}</td>
                              <td className="px-6 py-4 text-[#6B7280] text-sm">{request.department}</td>
                              <td className="px-6 py-4">
                                <Badge className="bg-[#0099DD]/10 text-[#0099DD] border-[#0099DD]/20 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                  {request.role}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 text-[#6B7280] text-sm font-medium">{request.requestedDate}</td>
                              <td className="px-6 py-4 text-[#6B7280] text-sm font-medium">{request.approvedDate}</td>
                              <td className="px-6 py-4 text-[#374151] text-sm">{request.approvedBy}</td>
                              <td className="px-6 py-4 text-[#374151] text-sm">{request.submittedBy || "Jawaher Rashed"}</td>
                              <td className="px-6 py-4">
                                <Badge className="bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20 text-xs font-bold px-3 py-1 rounded-full">Approved</Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        </Card>
      </div>

      {/* Approval Confirmation Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="max-w-md bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0 h-[500px] flex flex-col overflow-hidden">
          <div className="px-8 pt-8 pb-8 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-[18px] font-semibold text-[#EF4444]">Approve Request</DialogTitle>
              <DialogDescription className="text-[14px] text-[#6B7280] mt-1">Confirm approval of the request</DialogDescription>
            </DialogHeader>
            <div className="text-center space-y-6">
              {/* Alert Illustration */}
              <div className="flex justify-center">
                <div className="relative">
                  {/* Outer glow circle */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 rounded-full blur-2xl scale-150"></div>

                  {/* Main circle with check illustration */}
                  <div className="relative w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(16,185,129,0.4)]">
                    <div className="relative">
                      <CheckCircle className="w-10 h-10 text-white" strokeWidth={2} />
                    </div>
                  </div>

                  {/* Animated rings */}
                  <div className="absolute inset-0 rounded-full border-4 border-[#10B981]/30 animate-ping"></div>
                </div>
              </div>

              {/* Confirmation Text */}
              <div className="space-y-3">
                <h3 className="text-3xl font-bold text-[#111827] tracking-tight">
                  Approve Request
                </h3>
                <p className="text-[#6B7280] text-sm font-medium leading-relaxed max-w-[260px] mx-auto">
                  Are you sure you want to approve request <span className="text-[#111827] font-bold">{pendingApprovalId}</span>?
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                <Button
                  onClick={handleApprovalConfirm}
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white rounded-2xl h-14 text-sm font-bold shadow-[0_10px_20px_rgba(16,185,129,0.2)] transition-all duration-300"
                >
                  Yes, Approve
                </Button>
                <Button
                  onClick={handleApprovalCancel}
                  variant="outline"
                  className="w-full border-[#E5E7EB] rounded-2xl h-14 text-[#4B5563] text-sm font-bold hover:bg-[#F9FAFB] border-2 transition-all duration-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>      {/* Rejection Dialog with Comments */}
      <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <DialogContent className="max-w-md bg-white rounded-[32px] border border-[#E5E7EB] shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0 h-[500px] flex flex-col overflow-hidden">
          <div className="px-10 pt-12 pb-10 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-[18px] font-semibold text-[#EF4444]">Reject Request</DialogTitle>
              <DialogDescription className="text-[14px] text-[#6B7280] mt-1">Please provide a reason for rejection</DialogDescription>
            </DialogHeader>
            <div className="text-center space-y-8">
              {/* Alert Illustration */}
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-[#EF4444]/20 rounded-full blur-2xl scale-150"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-[#FF6B6B] to-[#EF4444] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(239,68,68,0.4)]">
                    <XCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-[#EF4444]/30 animate-ping"></div>
                </div>
              </div>
              
              {/* Confirmation Text */}
              <div className="space-y-3">
                <h3 className="text-3xl font-bold text-[#111827] tracking-tight">
                  Reject Request
                </h3>
                <p className="text-[#6B7280] text-sm font-medium leading-relaxed max-w-[260px] mx-auto">
                  Please provide a reason for rejecting request <span className="text-[#111827] font-bold">{rejectingRequest?.id}</span>
                </p>
              </div>

              <div className="space-y-4 text-left">
                <div className="space-y-2.5">
                  <Label htmlFor="rejection-comment" className="text-sm font-bold text-[#374151] ml-1">
                    Rejection Reason <span className="text-[#EF4444]">*</span>
                  </Label>
                  <Textarea
                    id="rejection-comment"
                    value={rejectionComment}
                    onChange={(e) => setRejectionComment(e.target.value)}
                    placeholder="Enter the reason for rejection..."
                    className="min-h-[140px] bg-[#F9FAFB] border-[#E5E7EB] rounded-2xl resize-none focus:ring-2 focus:ring-[#EF4444] focus:border-transparent text-sm placeholder:text-[#9CA3AF] p-4 transition-all"
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col gap-3 pt-2">
                <Button
                  onClick={handleRejectionConfirm}
                  className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-2xl h-14 text-sm font-bold shadow-[0_10px_20px_rgba(239,68,68,0.2)] transition-all duration-300"
                >
                  Confirm Rejection
                </Button>
                <Button
                  onClick={handleRejectionCancel}
                  variant="outline"
                  className="w-full border-[#E5E7EB] rounded-2xl h-14 text-[#4B5563] text-sm font-bold hover:bg-[#F9FAFB] border-2 transition-all duration-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog for User Request Groups */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0 h-[500px] flex flex-col overflow-hidden">
          <div className="px-8 pt-8 pb-8 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-[18px] font-semibold text-[#EF4444]">
                Upload Document
              </DialogTitle>
              <DialogDescription className="text-[14px] text-[#6B7280] mt-1 leading-tight">
                Upload a document for {uploadingForGroup?.groupId}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-[#E0E0E0] rounded-xl p-6 text-center bg-[#F5F5F5]/50">
                <Input 
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setGroupUploadedFile(file);
                    }
                  }}
                  className="mb-3"
                />
                {groupUploadedFile && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-[#1a1a1a] bg-white px-3 py-2 rounded-lg border border-[#E0E0E0]">
                    <FileText className="w-4 h-4 text-[#ED1C24]" />
                    <span className="font-medium">{groupUploadedFile.name}</span>
                    <span className="text-[#666666]">({(groupUploadedFile.size / 1024).toFixed(2)} KB)</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleUserGroupUpload}
                  disabled={!groupUploadedFile}
                  className="flex-1 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-2xl h-14 text-sm font-bold shadow-[0_10px_20px_rgba(239,68,68,0.2)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Upload Document
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setUploadDialogOpen(false);
                    setGroupUploadedFile(null);
                    setUploadingForGroup(null);
                  }}
                  className="flex-1 border-[#E5E7EB] rounded-2xl h-14 text-[#4B5563] text-sm font-bold hover:bg-[#F9FAFB] border-2 transition-all duration-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Request Confirmation Dialog */}
      <Dialog open={requestConfirmDialogOpen} onOpenChange={setRequestConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white rounded-[32px] border border-[#E5E7EB] shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0 h-[500px] flex flex-col overflow-hidden">
          <div className="px-10 pt-12 pb-10 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            <DialogHeader className="mb-8 text-center space-y-4">
              <DialogTitle className="text-[18px] font-semibold text-[#EF4444]">
                Request Sent!
              </DialogTitle>
              <DialogDescription className="text-[14px] text-[#6B7280] mt-1 leading-tight">
                Your request has been successfully submitted for approval
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Info Box */}
              <div className="flex items-start gap-4 p-5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[24px]">
                <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Info className="w-4 h-4 text-[#10B981]" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-bold text-[#111827]">Order Status</p>
                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    You will receive a notification once the administrator reviews and processes your request for <span className="text-[#EF4444] font-bold">Group {requestingGroupId}</span>.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <Button
                onClick={() => setRequestConfirmDialogOpen(false)}
                className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-2xl h-14 text-sm font-bold shadow-[0_10px_20px_rgba(239,68,68,0.2)] transition-all duration-300"
              >
                Done
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer Dialog */}
      <Dialog open={pdfViewerOpen} onOpenChange={setPdfViewerOpen}>
        <DialogContent className="max-w-4xl h-[90vh] bg-white rounded-2xl border border-[#B0AAA2]/20 shadow-2xl p-0 flex flex-col">
          <div className="px-6 py-4 border-b border-[#E5E5E5] flex items-center">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#003F72]" />
              <div>
                <DialogTitle className="text-lg font-semibold text-[#252628]">
                  Document Viewer
                </DialogTitle>
                <DialogDescription className="text-sm text-[#666666] mt-0.5">
                  {viewingFileName}
                </DialogDescription>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-auto bg-[#F5F5F5]">
            <div className="w-full h-full bg-white rounded-xl shadow-inner border border-[#E5E5E5] flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="mx-auto w-20 h-20 rounded-full bg-[#003F72]/10 flex items-center justify-center">
                  <FileText className="w-10 h-10 text-[#003F72]" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-[#252628]">PDF Document</p>
                  <p className="text-sm text-[#666666] mt-1">{viewingFileName}</p>
                  <p className="text-xs text-[#999999] mt-2">Preview would be displayed here</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Forward Request Dialog */}
      <Dialog open={forwardDialogOpen} onOpenChange={setForwardDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl p-0 h-[500px] flex flex-col overflow-hidden">
          <div className="px-8 pt-8 pb-8 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-[18px] font-semibold text-[#EF4444]">
                Forward Request
              </DialogTitle>
              <DialogDescription className="text-[14px] text-[#6B7280] mt-1 leading-tight">
                Forward this request to a data owner for review
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Request Details */}
              <div className="space-y-3 p-4 bg-[#F5F5F5] rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#666666]">Request ID:</span>
                  <span className="text-sm font-medium text-[#252628]">{forwardingRequest?.id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#666666]">Subject:</span>
                  <span className="text-sm font-medium text-[#252628]">{forwardingRequest?.service}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#666666]">Type:</span>
                  <Badge className="bg-[#0099DD] text-white text-xs px-2 py-1">
                    Service Access
                  </Badge>
                </div>
              </div>

              {/* Data Owner Multi-Select */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#252628]"><span className="text-[#ED1C24]">Data Owners*</span></label>
                <div className="space-y-3 p-4 border border-[#E5E5E5] rounded-xl bg-white max-h-[200px] overflow-y-auto">
                  {[
                    { id: 'ministry-works', name: 'Ministry of Works' },
                    { id: 'ewa', name: 'Electricity and Water Authority' },
                    { id: 'slrb', name: 'Survey and Land Registration Bureau' },
                    { id: 'ministry-transport', name: 'Ministry of Transportation' },
                    { id: 'ministry-health', name: 'Ministry of Health' },
                    { id: 'urban-planning', name: 'Urban Planning Authority' }
                  ].map((owner) => (
                    <label 
                      key={owner.id}
                      className="flex items-center gap-3 cursor-pointer hover:bg-[#EBECE8]/30 p-2 rounded-lg transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDataOwners.includes(owner.name)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedDataOwners([...selectedDataOwners, owner.name]);
                          } else {
                            setSelectedDataOwners(selectedDataOwners.filter(o => o !== owner.name));
                          }
                        }}
                        className="w-4 h-4 text-[#003F72] border-[#E5E5E5] rounded focus:ring-[#003F72] focus:ring-2"
                      />
                      <span className="text-sm text-[#252628]">{owner.name}</span>
                    </label>
                  ))}
                </div>
                {selectedDataOwners.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedDataOwners.map((owner) => (
                      <Badge 
                        key={owner}
                        className="bg-[#003F72] text-white text-xs px-3 py-1 flex items-center gap-2"
                      >
                        {owner}
                        <X 
                          className="w-3 h-3 cursor-pointer hover:text-[#ED1C24]" 
                          onClick={() => setSelectedDataOwners(selectedDataOwners.filter(o => o !== owner))}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#252628]">
                  Notes
                </label>
                <textarea
                  value={forwardNotes}
                  onChange={(e) => setForwardNotes(e.target.value)}
                  placeholder="Add any additional notes or comments..."
                  rows={4}
                  className="w-full px-4 py-3 border border-[#E5E5E5] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#003F72] focus:border-transparent text-[#252628] resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4">
                <Button
                  onClick={() => {
                    if (selectedDataOwners.length > 0) {
                      // Remove from pending list
                      setDataDownloadPendingList(dataDownloadPendingList.filter(r => r.id !== forwardingRequest?.id));
                      
                      // Add to forwarded list with selected data owners
                      const forwardedRequest = {
                        id: forwardingRequest?.id,
                        dataset: forwardingRequest?.dataset,
                        format: forwardingRequest?.format,
                        product: "Plugins",
                        requestor: forwardingRequest?.requestor,
                        dataOwners: selectedDataOwners,
                        workflow: ["Submitted", "Forwarded"]
                      };
                      setDataDownloadForwardedList([forwardedRequest, ...dataDownloadForwardedList]);
                      
                      const ownersList = selectedDataOwners.join(', ');
                      toast.success(`Request ${forwardingRequest?.id} forwarded to ${ownersList}`);
                      setForwardDialogOpen(false);
                      setSelectedDataOwners([]);
                      setForwardNotes("");
                    } else {
                      toast.error("Please select at least one data owner");
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-[#003F72] to-[#002d5a] hover:from-[#002d5a] hover:to-[#001f3f] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(0,63,114,0.3)] hover:shadow-[0_8px_32px_rgba(0,63,114,0.4)] transition-all duration-300"
                >
                  Forward Request
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setForwardDialogOpen(false);
                    setSelectedDataOwners([]);
                    setForwardNotes("");
                  }}
                  className="flex-1 border-[#E0E0E0] rounded-xl h-12 hover:bg-[#EBECE8]/30 transition-all"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Map Preview Dialog */}
      <Dialog open={mapPreviewOpen} onOpenChange={setMapPreviewOpen}>
        <DialogContent className="w-[60vw] max-w-none sm:max-w-none h-[85vh] bg-white rounded-2xl border border-[#B0AAA2]/20 shadow-2xl p-0 flex flex-col">
          <div className="px-8 pt-8 pb-4 border-b border-[#E5E5E5]">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#003F72]/10 to-[#0099DD]/10 flex items-center justify-center">
                  <Map className="w-5 h-5 text-[#003F72]" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-bold text-[#252628]">
                    Dataset Preview
                  </DialogTitle>
                  <DialogDescription className="text-[#666666] mt-1">
                    {previewingRequest?.dataset || `${previewingRequest?.permissionName} - ${previewingRequest?.boundary}`}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            {/* Request Details */}
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="p-3 bg-[#F5F5F5] rounded-xl">
                <div className="text-xs font-semibold text-[#666666] mb-1">Request ID</div>
                <div className="text-sm font-medium text-[#252628]">{previewingRequest?.id}</div>
              </div>
              <div className="p-3 bg-[#F5F5F5] rounded-xl">
                <div className="text-xs font-semibold text-[#666666] mb-1">{previewingRequest?.dataset ? 'Requestor' : 'Organization'}</div>
                <div className="text-sm font-medium text-[#252628]">{previewingRequest?.requestor || previewingRequest?.organization}</div>
              </div>
              <div className="p-3 bg-[#F5F5F5] rounded-xl">
                <div className="text-xs font-semibold text-[#666666] mb-1">{previewingRequest?.format ? 'Format' : 'Layers'}</div>
                <div className="text-sm font-medium text-[#252628]">{previewingRequest?.format || previewingRequest?.layers}</div>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-6 overflow-hidden">
            <div className="w-full h-full rounded-xl overflow-hidden border-2 border-[#E5E5E5] shadow-lg relative">
              <iframe
                src="https://www.openstreetmap.org/export/embed.html?bbox=50.3577%2C25.7667%2C50.7577%2C26.3667&layer=mapnik"
                style={{ width: "100%", height: "100%", border: 0 }}
                title="Bahrain Map Preview"
              />
              {/* Green boundary overlays - Multiple specific regions */}
              <div className="absolute inset-0 pointer-events-none">
                {/* Central Region - Manama */}
                <div className="absolute top-[25%] left-[40%] w-[25%] h-[30%] border-4 border-[#22C55E] rounded-lg shadow-[0_0_20px_rgba(34,197,94,0.5)] bg-[#22C55E]/10"></div>
                {/* Northern Region */}
                <div className="absolute top-[15%] left-[35%] w-[18%] h-[15%] border-3 border-[#22C55E]/60 rounded-md shadow-[0_0_15px_rgba(34,197,94,0.3)] bg-[#22C55E]/5"></div>
                {/* Southern Region */}
                <div className="absolute top-[60%] left-[45%] w-[20%] h-[20%] border-3 border-[#22C55E]/60 rounded-md shadow-[0_0_15px_rgba(34,197,94,0.3)] bg-[#22C55E]/5"></div>
              </div>
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-md border border-[#E5E5E5]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#22C55E] rounded-sm"></div>
                  <span className="text-sm font-medium text-[#252628]">Selected Boundary Area</span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 pb-8 pt-4">
            <Button
              onClick={() => setMapPreviewOpen(false)}
              className="w-full bg-gradient-to-r from-[#003F72] to-[#002d5a] hover:from-[#002d5a] hover:to-[#001f3f] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(0,63,114,0.3)] hover:shadow-[0_8px_32px_rgba(0,63,114,0.4)] transition-all duration-300"
            >
              Close Preview
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Organization Details Dialog */}
      <Dialog open={orgDetailsDialogOpen} onOpenChange={setOrgDetailsDialogOpen}>
        <DialogContent className="max-w-3xl bg-white rounded-3xl border border-[#E5E7EB] shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0 h-[500px] flex flex-col overflow-hidden">
          <div className="px-8 pt-8 pb-8 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-[18px] font-semibold text-[#EF4444]">
                Organization Details
              </DialogTitle>
              <DialogDescription className="text-[14px] text-[#6B7280] mt-1 leading-tight">
                Review the organization information
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Organization Name */}
              <div className="space-y-2">
                <Label className="text-[#4A4A4A] font-medium text-sm">
                  Organization Name <span className="text-[#ED1C24]">*</span>
                </Label>
                <Input 
                  value={viewingOrganization?.organization || ''} 
                  readOnly
                  className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl h-12 px-4 text-[#1A1A1A]"
                />
              </div>

              {/* Organization Name (Arabic) */}
              <div className="space-y-2">
                <Label className="text-[#4A4A4A] font-medium text-sm">
                  Organization Name (Arabic) <span className="text-[#ED1C24]">*</span>
                </Label>
                <Input 
                  value="هيئة التخطيط العمراني"
                  readOnly
                  className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl h-12 px-4 text-[#1A1A1A] text-right"
                  dir="rtl"
                />
              </div>

              {/* Parent Organization */}
              <div className="space-y-2">
                <Label className="text-[#4A4A4A] font-medium text-sm">
                  Parent Organization
                </Label>
                <Input 
                  value="Ministry of Works"
                  readOnly
                  className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl h-12 px-4 text-[#1A1A1A]"
                />
              </div>

              {/* Point of Contact */}
              <div className="space-y-2">
                <Label className="text-[#4A4A4A] font-medium text-sm">
                  Point of Contact <span className="text-[#ED1C24]">*</span>
                </Label>
                <Input 
                  value="Jawaher Rashed"
                  readOnly
                  className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl h-12 px-4 text-[#1A1A1A]"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="text-[#4A4A4A] font-medium text-sm">
                  Email <span className="text-[#ED1C24]">*</span>
                </Label>
                <Input 
                  value="ahmed.alkhalifa@upa.gov.bh"
                  readOnly
                  className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl h-12 px-4 text-[#1A1A1A]"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-2">
                <Label className="text-[#4A4A4A] font-medium text-sm">
                  Phone Number <span className="text-[#ED1C24]">*</span>
                </Label>
                <Input 
                  value="+973 1729 8888"
                  readOnly
                  className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl h-12 px-4 text-[#1A1A1A]"
                />
              </div>

              {/* Business Description */}
              <div className="space-y-2">
                <Label className="text-[#4A4A4A] font-medium text-sm">
                  Business Description <span className="text-[#ED1C24]">*</span>
                </Label>
                <Textarea 
                  value="The Urban Planning Authority is responsible for comprehensive urban development planning, land use regulation, and sustainable growth strategies across the Kingdom of Bahrain."
                  readOnly
                  className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-xl min-h-24 px-4 py-3 text-[#1A1A1A] resize-none"
                />
              </div>

              {/* Close Button */}
              <div className="pt-4">
                <Button 
                  onClick={() => setOrgDetailsDialogOpen(false)}
                  className="w-full bg-gradient-to-r from-[#003F72] to-[#002d5a] hover:from-[#002d5a] hover:to-[#001f3f] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(0,63,114,0.3)] hover:shadow-[0_8px_32px_rgba(0,63,114,0.4)] transition-all duration-300"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}