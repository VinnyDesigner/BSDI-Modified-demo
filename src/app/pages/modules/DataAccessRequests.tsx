import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { getStatusBadgeProps } from "../../lib/statusUtils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { FileText, CheckCircle, Clock, XCircle, Search, X, ChevronDown, ChevronUp, Upload, Trash2, Download, Calendar, Hand, Map, Forward, Globe } from "lucide-react";
import { MetricCard } from "../../components/ui/MetricCard";
import { Input } from "../../components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Info, Check } from "lucide-react";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";
import { PageHeader } from "../../components/PageHeader";

const rowStyles = `
  .request-row-wrapper {
    overflow-x: auto;
    overflow-y: hidden;
    width: 100%;
    scrollbar-width: thin;
    scrollbar-color: #D1D5DB transparent;
  }
  .request-row-wrapper::-webkit-scrollbar {
    height: 6px;
  }
  .request-row-wrapper::-webkit-scrollbar-thumb {
    background: #D1D5DB;
    border-radius: 6px;
  }
  .request-row {
    min-width: 1100px;
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 4px 0;
  }
  .column-fixed {
    flex: 0 0 auto;
  }

  .request-table-wrapper {
    display: flex;
    background: #FFFFFF;
    border-radius: 16px;
    padding: 16px;
    margin: 0 16px;
    overflow: hidden;
  }
  .table-fixed-left,
  .table-fixed-right {
    flex-shrink: 0;
    background: #FFFFFF;
    z-index: 2;
  }
  .table-fixed-left {
    width: 160px;
    border-right: 1px solid #F1F5F9;
  }
  .table-fixed-right {
    width: 120px;
    border-left: 1px solid #F1F5F9;
    text-align: center;
  }
  .table-scrollable {
    overflow-x: auto;
    flex: 1;
  }
  .table-scrollable::-webkit-scrollbar {
    display: none; /* hide scrollbar */
  }
  .header-row,
  .row {
    display: grid;
    grid-template-columns: 
      220px   /* Department */
      120px   /* Type */
      200px   /* Organization */
      200px   /* Submitted By */
      160px   /* Date */
      300px;  /* Description */
    column-gap: 16px;
    align-items: center;
  }
  .header,
  .header-row {
    font-size: 13px;
    font-weight: 500;
    color: rgba(107,114,128,0.65);
    padding-bottom: 12px;
  }
  .cell,
  .row {
    height: 60px;
    border-bottom: 1px solid #F1F5F9;
    font-size: 14px;
    color: #111827;
    display: flex;
    align-items: center;
  }
  .request-table-wrapper .row:hover,
  .request-table-wrapper .cell:hover {
    background: #F9FAFB;
  }
  .action-buttons {
    display: flex;
    justify-content: center;
    gap: 8px;
  }
`;

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


// Mock data for forwarded requests (Organization Creator Layer)
const forwardRequests = [
  { 
    id: "REQ-3042-987", 
    organization: "Urban Planning Authority",
    description: "Boundary Data Update",
    submittedBy: "Layla Ahmed", 
    date: "10 Mar 2026", 
    status: "forwarded" 
  },
];
// Mock data for department pending requests
const departmentPendingRequests = [
  { 
    id: "DEPT-3042-992", 
    departmentNameEn: "GIS Operations Unit",
    departmentNameAr: "???? ?????? ??? ????????? ?????????",
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
    departmentNameAr: "????? ???????? ????????",
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
    departmentNameAr: "?????? ???? ?????",
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
    userNameAr: "???? ???????",
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
    userNameAr: "??????? ???",
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
    userNameAr: "???? ???????",
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

// Mock data for spatial permission creation pending requests (User/Owner ? IGA Review ? Created)
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

// Mock data for user spatial permission update pending requests (Dept. Team ? Users ? IGA Approval)
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

export default function DataAccessRequests() {
  const location = useLocation();
  const navigate = useNavigate();
  const isReviewer = location.pathname.includes("/reviewer");
  const isOrgAdmin = location.pathname.includes("/entity-admin");
  const adminName = "Jawaher Rashed";
  const adminOrg = "BSDI";

  // RBAC Filtering Logic
  const getFilteredRequests = (requests: any[]) => {
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
  const filteredForwardRequests = getFilteredRequests(forwardRequests);
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
    const submitterMatch = (g as any).submittedBy === adminName || true; // Assuming admin can see groups they view
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
    if (!isOrgAdmin) return null;
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
  const [orgPendingSearch, setOrgPendingSearch] = useState("");
  const [orgPendingDateRange, setOrgPendingDateRange] = useState({ from: "", to: "" });
  const [orgCompletedSearch, setOrgCompletedSearch] = useState("");
  const [orgForwardSearch, setOrgForwardSearch] = useState("");
  const [orgForwardDateRange, setOrgForwardDateRange] = useState({ from: "", to: "" });
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
  const [activeTab, setActiveTab] = useState(tabFromUrl || (isOrgAdmin ? "department" : "organization-creator"));
  
  // Highlighted request ID for notification-to-request navigation
  const notificationId = searchParams.get("notificationId");
  const [highlightedId, setHighlightedId] = useState<string | null>(notificationId);
  
  // Accordion state for auto-opening based on notification status
  const [openAccordion, setOpenAccordion] = useState<string | undefined>(undefined);
  
  // Approval dialog state
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [approvalComments, setApprovalComments] = useState("");
  const [serviceUrl, setServiceUrl] = useState("");
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
    return getStatusBadgeProps(status).variant;
  };

  // Handle approve button click - open dialog
  const handleApproveClick = (requestId: string) => {
    // Find if it's a service request to pre-fill URL
    const serviceReq = servicesCreationPendingRequests.find(r => r.id === requestId);
    if (serviceReq) {
      setServiceUrl(serviceReq.url || "");
    } else {
      setServiceUrl("");
    }
    
    setPendingApprovalId(requestId);
    setApprovalDialogOpen(true);
  };

  // Handle approval confirmation
  const handleApprovalConfirm = () => {
    const successMsg = serviceUrl 
      ? `Approved ${pendingApprovalId} successfully with URL: ${serviceUrl}`
      : `Approved ${pendingApprovalId} successfully`;
      
    toast.success(successMsg);
    
    // Reset state
    setApprovalDialogOpen(false);
    setApprovalComments("");
    setServiceUrl("");
    setPendingApprovalId(null);
  };

  // Handle approval cancel
  const handleApprovalCancel = () => {
    setApprovalDialogOpen(false);
    setApprovalComments("");
    setServiceUrl("");
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
    <div className="min-h-screen bg-[#F5F7FA] px-[24px] py-[20px]">
      <div className="w-full space-y-6">
        <PageHeader 
          title="Data Access Requests"
          description="Manage data access workflows"
        />

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            label="Today"
            value="0"
            icon={<Calendar className="w-6 h-6" />}
            variant="red"
          />
          <MetricCard
            label="Approved"
            value={totalApproved}
            icon={<CheckCircle className="w-6 h-6" />}
            variant="green"
          />
          <MetricCard
            label="Rejected"
            value="0"
            icon={<XCircle className="w-6 h-6" />}
            variant="yellow"
          />
          <MetricCard
            label="Pending"
            value={totalPending}
            icon={<Hand className="w-6 h-6" />}
            variant="blue"
          />
        </div>

        {/* Requests Tabs */}
        <div className="bg-white rounded-[16px] px-[24px] pt-[20px] pb-[24px]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <style>{`
              .tabs-wrapper { width: 100% !important; overflow: hidden !important; }
              .custom-tabs-container { display: flex !important; gap: 10px !important; width: max-content !important; min-width: 100% !important; overflow-x: auto !important; overflow-y: hidden !important; flex-wrap: nowrap !important; scroll-behavior: smooth !important; padding-left: 4px !important; scrollbar-width: none !important; -ms-overflow-style: none !important; border-bottom: none !important; align-items: center !important; }
              .custom-tabs-container::-webkit-scrollbar { display: none !important; }
              .custom-tabs-container * { border-right: none !important; } 
              .tab-item { flex: unset !important; flex-shrink: 0 !important; width: auto !important; box-shadow: none !important; outline: none !important; height: 36px !important; padding: 0 16px !important; border-radius: 10px !important; font-size: 14px !important; font-weight: 500 !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; white-space: nowrap !important; margin: 0 !important; } 
              .tab-item[data-state="active"] { background: #EF4444 !important; color: #FFFFFF !important; border: none !important; } 
              .tab-item[data-state="inactive"], .tab-item:not([data-state="active"]) { background: #FFFFFF !important; color: #6B7280 !important; border: 1px solid #E5E7EB !important; } 
              .tab-item[data-state="inactive"]:hover, .tab-item:not([data-state="active"]):hover { background: #F9FAFB !important; color: #111827 !important; }

              .request-table-container { background: rgba(255,255,255,0.9); border-radius: 12px; overflow: hidden; }
              .request-table-header, .request-table-row {
                display: grid;
                grid-template-columns: 160px 200px 120px 200px 180px 160px 1fr 120px;
                align-items: center;
                column-gap: 16px;
              }
              .request-table-header {
                padding: 12px 18px;
                background: rgba(231,231,231,0.65);
                color: #252525;
                font-size: 13px;
                font-weight: 500;
                text-align: left;
                padding-bottom: 12px;
              }
              .request-table-header div { text-align: left; }
              .request-table-row {
                padding: 14px 18px;
                border-bottom: 1px solid #F1F5F9;
                transition: background 0.15s ease;
                cursor: pointer;
              }
              .request-table-row:hover { background: rgba(249,250,251,0.9); }
              .request-table-row:last-child { border-bottom: none; }
              .request-table-row div { font-size: 14px; color: #1E293B; font-weight: 400; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; text-align: left; }
              .status-badge { padding: 5px 11px; border-radius: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; width: fit-content; }
              .status-badge.created { background: #ECFDF5; color: #10B981; }
              .status-badge.pending { background: #FFF7ED; color: #F97316; }
              .status-badge.forwarded { background: #EFF6FF; color: #3B82F6; }
            `}</style>
            <div className="tabs-wrapper mb-6 w-full">
              <TabsList className="custom-tabs-container bg-transparent w-full">
              {!isOrgAdmin && <TabsTrigger value="organization-creator" className="tab-item">Organization</TabsTrigger>}
              <TabsTrigger value="department" className="tab-item">Department</TabsTrigger>
              <TabsTrigger value="user-requests" className="tab-item">User Requests</TabsTrigger>
              <TabsTrigger value="data-access" className="tab-item">Data Access</TabsTrigger>
              <TabsTrigger value="spatial-permission" className="tab-item">Spatial Permission</TabsTrigger>
              <TabsTrigger value="services-creation" className="tab-item">Services Creation</TabsTrigger>
              <TabsTrigger value="data-download" className="tab-item">Data Download</TabsTrigger>
              <TabsTrigger value="metadata" className="tab-item">Metadata</TabsTrigger>
              <TabsTrigger value="application-user" className="tab-item">Application User</TabsTrigger>
              </TabsList>
            </div>
            
            {/* Organization/Creator Tab */}
            <TabsContent value="organization-creator">
              <Accordion type="single" collapsible className="space-y-3" value={openAccordion} onValueChange={setOpenAccordion}>

                {/* Completed Accordion */}
                <AccordionItem 
                  value="org-completed"
                  className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 ${openAccordion === 'org-completed' ? 'bg-[#ECFDF5]' : 'bg-white'}`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#10B981] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                      <span className="font-medium text-[#111827] text-sm">Completed</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0 bg-white/50">
                    <div className="px-6 py-4 flex items-center gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <Input
                          placeholder="Search completed requests..."
                          value={orgCompletedSearch}
                          onChange={(e) => setOrgCompletedSearch(e.target.value)}
                          className="pl-10 bg-white/90 border-[#E5E7EB] focus:ring-[#003F72] rounded-[10px] h-[36px] text-[14px]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Input type="date" value={orgCompletedDateRange.from} onChange={(e) => setOrgCompletedDateRange({ ...orgCompletedDateRange, from: e.target.value })} className="bg-white/90 border-[#E5E7EB] focus:ring-[#003F72] rounded-[10px] h-[36px] text-[14px]" />
                        <span className="text-[#6B7280] font-bold text-xs uppercase">to</span>
                        <Input type="date" value={orgCompletedDateRange.to} onChange={(e) => setOrgCompletedDateRange({ ...orgCompletedDateRange, to: e.target.value })} className="bg-white/90 border-[#E5E7EB] focus:ring-[#003F72] rounded-[10px] h-[36px] text-[14px]" />
                      </div>
                    </div>
                    <div className="px-6 pb-6">
                      <div className="request-table-container">
                        <div className="request-table-header">
                          <div>Request Id</div>
                          <div>Organization</div>
                          <div>Business Description</div>
                          <div>Submitted By</div>
                          <div>Completed Date</div>
                          <div>Status</div>
                          <div>Actions</div>
                        </div>
                        {filteredCompletedRequests.filter(r => !orgCompletedSearch || r.id.toLowerCase().includes(orgCompletedSearch.toLowerCase()) || r.organization.toLowerCase().includes(orgCompletedSearch.toLowerCase()) || r.submittedBy.toLowerCase().includes(orgCompletedSearch.toLowerCase())).map((request) => (
                          <div key={request.id} className="request-table-row">
                            <div>{request.id}</div>
                            <div>{request.organization}</div>
                            <div>{request.description}</div>
                            <div>{request.submittedBy}</div>
                            <div>05 Mar 2025</div>
                            <div><Badge variant={getStatusBadgeProps("created").variant}>{getStatusBadgeProps("created").label}</Badge></div>
                            <div>{isReviewer ? <span className="text-sm text-[#9CA3AF] font-medium">N/A</span> : "-"}</div>
                          </div>
                        ))}
                      </div>
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
                  className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 ${openAccordion === 'pending' ? 'bg-[#FEF2F2]' : 'bg-white'}`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#ED1C24] rounded-full animate-pulse shadow-[0_0_8px_rgba(237,28,36,0.5)]"></div>
                      <span className="font-medium text-[#111827] text-sm">Pending</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0 bg-white/50">
                    {/* Search and Date Range */}
                    <div className="px-6 py-4 border-t border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <Input
                          placeholder="Search pending requests..."
                          value={deptPendingSearch}
                          onChange={(e) => setDeptPendingSearch(e.target.value)}
                          className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 md:flex items-center gap-2 w-full lg:w-auto">
                        <Input
                          type="date"
                          value={deptPendingDateRange.from}
                          onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, from: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                        <div className="hidden md:flex items-center px-1">
                          <span className="text-[#6B7280] font-bold text-xs uppercase">to</span>
                        </div>
                        <Input
                          type="date"
                          value={deptPendingDateRange.to}
                          onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, to: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="px-6 pb-6 pt-4">
                      <div className="request-table-container">
                        {/* Table Header */}
                        <div className="request-table-header">
                          <div>Request ID</div>
                          <div>Department</div>
                          <div>Type</div>
                          <div>Organization</div>
                          <div>Submitted By</div>
                          <div>Requested Date</div>
                          <div>Business Description</div>
                          <div>Actions</div>
                        </div>

                        {/* Table Body */}
                        {filteredDeptPending.map((request) => (
                          <div key={request.id} className="request-table-row">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] animate-pulse shadow-[0_0_8px_rgba(237,28,36,0.5)]" />
                              <span className="font-medium">{request.id}</span>
                            </div>

                            <div className="flex flex-col justify-center">
                              <span className="font-medium text-[#111827]">{request.departmentNameEn}</span>
                              <span className="text-[11px] text-[#6B7280] leading-none mt-0.5" dir="rtl">{request.departmentNameAr}</span>
                            </div>

                            <div>
                              <Badge className="bg-[#0099DD]/10 text-[#0099DD] border-0 font-medium px-3 py-1 rounded-lg w-fit text-[10px] uppercase tracking-wider">
                                {request.type}
                              </Badge>
                            </div>

                            <div>
                              <span className="font-medium text-[#111827]">{request.organization}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#E5E7EB] flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-[#4B5563] border border-white shadow-sm">
                                {request.submittedBy?.[0] || 'L'}
                              </div>
                              <span className="font-medium text-[#111827]">{request.submittedBy}</span>
                            </div>

                            <div className="flex items-center gap-2 text-[#4B5563]">
                              <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-[#6B7280]" />
                              <span className="font-medium">{request.date}</span>
                            </div>

                            <div className="truncate">
                              <p className="text-[13px] font-normal text-[#4B5563] truncate" title={request.businessDescription}>
                                {request.businessDescription}
                              </p>
                            </div>

                            <div className="flex items-center justify-center gap-2">
                              {!isReviewer && (
                                <>
                                  <Button 
                                    onClick={() => handleApproveClick(request.id)}
                                    size="icon"
                                    className="bg-[#10B981]/10 hover:bg-[#10B981] text-[#10B981] hover:text-white h-[32px] w-[32px] rounded-lg shadow-sm transition-colors border border-[#10B981]/20"
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    onClick={() => handleRejectClick(request)}
                                    size="icon"
                                    variant="outline"
                                    className="bg-[#ED1C24]/10 hover:bg-[#ED1C24] text-[#ED1C24] hover:text-white h-[32px] w-[32px] rounded-lg shadow-sm transition-colors border border-[#ED1C24]/20"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                              {isReviewer && <span className="text-sm text-[#9CA3AF] font-medium px-[18px]">N/A</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Completed Accordion */}
                <AccordionItem 
                  value="completed"
                  className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 ${openAccordion === 'completed' ? 'bg-[#ECFDF5]' : 'bg-white'}`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#10B981] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                      <span className="font-medium text-[#111827] text-sm">Completed</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0 bg-white/50">
                    {/* Search and Date Range */}
                    <div className="px-6 py-4 border-t border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <Input
                          placeholder="Search completed departments..."
                          value={deptCompletedSearch}
                          onChange={(e) => setDeptCompletedSearch(e.target.value)}
                          className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 md:flex items-center gap-2 w-full lg:w-auto">
                        <Input
                          type="date"
                          value={deptCompletedDateRange.from}
                          onChange={(e) => setDeptCompletedDateRange({ ...deptCompletedDateRange, from: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                        <div className="hidden md:flex items-center px-1">
                          <span className="text-[#6B7280] font-bold text-xs uppercase">to</span>
                        </div>
                        <Input
                          type="date"
                          value={deptCompletedDateRange.to}
                          onChange={(e) => setDeptCompletedDateRange({ ...deptCompletedDateRange, to: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="px-6 pb-6 pt-4">
                      <div className="request-table-container">
                        {/* Table Header */}
                        <div className="request-table-header">
                          <div>Request ID</div>
                          <div>Department</div>
                          <div>Type</div>
                          <div>Organization</div>
                          <div>Approved By</div>
                          <div>Approved Date</div>
                          <div>Comment</div>
                          <div>Status</div>
                        </div>

                        {/* Table Body */}
                        {filteredDeptCompleted.map((request) => (
                          <div key={request.id} className="request-table-row cursor-default">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                              <span className="font-medium text-[14px]">{request.id}</span>
                            </div>

                            <div className="flex flex-col justify-center">
                              <span className="font-medium text-[#111827] text-[14px]">{request.departmentNameEn}</span>
                              <span className="text-[11px] text-[#6B7280] leading-none mt-0.5" dir="rtl">{request.departmentNameAr}</span>
                            </div>

                            <div>
                              <Badge className="bg-[#10B981]/10 text-[#10B981] border-0 font-medium px-3 py-1 rounded-lg w-fit text-[10px] uppercase tracking-wider">
                                {request.type}
                              </Badge>
                            </div>

                            <div>
                              <span className="font-medium text-[#111827] text-[14px]">{request.organization}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-[#10B981] border border-white shadow-sm">
                                F
                              </div>
                              <span className="font-medium text-[#111827] text-[14px]">Fatima Al-Mansoori</span>
                            </div>

                            <div className="flex items-center gap-2 text-[#4B5563]">
                              <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-[#6B7280]" />
                              <span className="font-medium text-[14px]">10 Mar 2025</span>
                            </div>

                            <div className="truncate">
                              <p className="text-[13px] font-normal text-[#4B5563] truncate" title="All requirements met and validated">
                                All requirements met and validated
                              </p>
                            </div>

                            <div className="flex items-center justify-center">
                              <Badge variant={getStatusBadgeProps("approved").variant}>
                                {getStatusBadgeProps("approved").label}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
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
                  className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 ${openAccordion === 'pending' ? 'bg-[#FEF2F2]' : 'bg-white'}`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#ED1C24] rounded-full animate-pulse shadow-[0_0_8px_rgba(237,28,36,0.5)]"></div>
                      <span className="font-medium text-[#111827] text-sm">Pending</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0 bg-white/50">
                    {/* Search and Date Range */}
                    <div className="px-6 py-4 border-t border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <Input
                          placeholder="Search pending requests..."
                          value={userPendingSearch}
                          onChange={(e) => setUserPendingSearch(e.target.value)}
                          className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 md:flex items-center gap-2 w-full lg:w-auto">
                        <Input
                          type="date"
                          value={userPendingDateRange.from}
                          onChange={(e) => setUserPendingDateRange({ ...userPendingDateRange, from: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                        <div className="hidden md:flex items-center px-1">
                          <span className="text-[#6B7280] font-bold text-xs uppercase">to</span>
                        </div>
                        <Input
                          type="date"
                          value={userPendingDateRange.to}
                          onChange={(e) => setUserPendingDateRange({ ...userPendingDateRange, to: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 p-6 border-t border-[#E5E7EB]">
                      {filteredUserRequestPendingGroups.map((group) => (
                        <div key={group.id} className="group relative flex flex-col p-0 bg-white border border-[#E5E7EB] rounded-[10px] transition-all duration-300 hover:shadow-md hover:border-[#ED1C24]/30">
                          <div 
                            onClick={() => setExpandedUserGroupId(expandedUserGroupId === group.id ? null : group.id)}
                            className="flex items-center w-full overflow-hidden py-[14px] cursor-pointer"
                          >
                            {/* Fixed Left - ID */}
                            <div className="flex-shrink-0 px-[18px] flex flex-col gap-1 min-w-[140px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Group ID</span>
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] animate-pulse" />
                                <span className="text-[14px] font-medium text-[#111827]">{group.id}</span>
                              </div>
                            </div>

                            {/* Scrollable Middle */}
                            <div className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-4 pl-6 pr-4 border-l border-[#E5E7EB]">
                              {/* Users */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[100px] max-w-[150px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Users</span>
                                <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{group.usersCount} users</span>
                              </div>

                              {/* Dates */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[140px] max-w-[200px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Requested Date</span>
                                <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{group.dateCreated}</span>
                              </div>

                              {/* Requested By */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[140px] max-w-[200px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Requested By</span>
                                <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">Jawaher Rashed</span>
                              </div>

                              {/* File */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[120px] max-w-[200px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Uploaded File</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setViewingFileName(group.fileName);
                                          setPdfViewerOpen(true);
                                        }}
                                        size="icon"
                                        variant="outline"
                                        className="bg-[#003F72]/10 hover:bg-[#003F72] text-[#003F72] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#003F72]/20"
                                      >
                                        <FileText className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">View File</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </div>

                            {/* Fixed Right */}
                            <div className="flex-shrink-0 flex items-center gap-4 border-l border-[#E5E7EB] px-[18px] ml-auto">
                              {isReviewer ? (

                                <span className="text-sm text-[#9CA3AF] font-medium px-[18px]">N/A</span>

                              ) : (

                                <TooltipProvider>
                                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          onClick={() => {
                                            setPendingApprovalId(group.id);
                                            setApprovalDialogOpen(true);
                                          }}
                                          size="icon"
                                          className="bg-[#10B981]/10 hover:bg-[#10B981] text-[#10B981] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#10B981]/20"
                                        >
                                          <Check className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Approve</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          onClick={() => {
                                            setRejectingRequest(group);
                                            setRejectionDialogOpen(true);
                                          }}
                                          size="icon"
                                          variant="outline"
                                          className="bg-[#ED1C24]/10 hover:bg-[#ED1C24] text-[#ED1C24] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#ED1C24]/20"
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Reject</TooltipContent>
                                    </Tooltip>
                                  </div>
                                </TooltipProvider>
                              )}
                              {expandedUserGroupId === group.id ? <ChevronUp className="w-5 h-5 text-[#6B7280]" /> : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
                            </div>
                          </div>

                          {/* Expanded Member List */}
                          {expandedUserGroupId === group.id && (
                            <div className="border-t border-[#F3F4F6] bg-[#F9FAFB]/50 transition-all duration-300">
                              <div className="px-8 py-5 border-b border-[#F3F4F6] bg-white flex items-center justify-between">
                                <div>
                                  <h5 className="font-medium text-[#111827] text-[14px]">Group Members</h5>
                                  <p className="text-[12px] font-normal text-[#6B7280] mt-0.5">Full list of users included in group {group.id}</p>
                                </div>
                                <Badge className="bg-[#10B981]/10 text-[#10B981] border-0 text-[10px] font-medium uppercase tracking-wider px-2.5 py-1 rounded-full">
                                  {group.usersCount} Members
                                </Badge>
                              </div>
                              
                              <div className="overflow-x-auto">
                                <table className="w-full">
                                  <thead>
                                    <tr className="bg-[#F9FAFB]">
                                      <th className="px-8 py-3 text-left text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">Name</th>
                                      <th className="px-8 py-3 text-left text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">Email</th>
                                      <th className="px-8 py-3 text-left text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">Role</th>
                                      <th className="px-8 py-3 text-left text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">Organization</th>
                                      <th className="px-8 py-3 text-left text-[11px] font-medium text-[#6B7280] uppercase tracking-wider">Department</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-[#F3F4F6]">
                                    {group.users.map((user) => (
                                      <tr key={user.id} className="hover:bg-white transition-all bg-transparent">
                                        <td className="px-8 py-4 text-[#111827] font-medium text-[14px]">{user.name}</td>
                                        <td className="px-8 py-4 text-[14px] font-medium text-[#6B7280]">{user.email}</td>
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
                                                  <button className="bg-[#ED1C24]/10 text-[#ED1C24] hover:bg-[#ED1C24]/20 border-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full transition-all">
                                                    +{user.role.split(', ').length - 1} More
                                                  </button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-80 bg-white rounded-2xl border-[#E5E7EB] shadow-xl p-5">
                                                  <div className="space-y-4">
                                                    <div className="flex items-center gap-3 pb-4 border-b border-[#F3F4F6]">
                                                      <div className="w-10 h-10 rounded-full bg-[#ED1C24]/10 flex items-center justify-center">
                                                        <span className="text-sm font-bold text-[#ED1C24]">
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
                                        <td className="px-8 py-4 text-[14px] font-medium text-[#111827]">{user.organization}</td>
                                        <td className="px-8 py-4 text-[14px] font-medium text-[#6B7280]">{user.department}</td>
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
                  </AccordionContent>
                </AccordionItem>

                  {/* Completed Accordion */}
                  <AccordionItem 
                    value="completed"
                    className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 ${openAccordion === 'completed' ? 'bg-[#ECFDF5]' : 'bg-white'}`}
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#10B981] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="font-medium text-[#111827] text-sm">Completed</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0 bg-white/50">
                      {/* Search and Date Range */}
                      <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center gap-4">
                        <div className="flex-1 relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                          <Input
                            placeholder="Search completed groups..."
                            value={userCompletedSearch}
                            onChange={(e) => setUserCompletedSearch(e.target.value)}
                            className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Input
                            type="date"
                            value={userCompletedDateRange.from}
                            onChange={(e) => setUserCompletedDateRange({ ...userCompletedDateRange, from: e.target.value })}
                            className="bg-white border-[#E5E7EB] focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
                          />
                          <span className="text-[#6B7280] font-bold text-xs uppercase">to</span>
                          <Input
                            type="date"
                            value={userCompletedDateRange.to}
                            onChange={(e) => setUserCompletedDateRange({ ...userCompletedDateRange, to: e.target.value })}
                            className="bg-white border-[#E5E7EB] focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 p-6 border-t border-[#E5E7EB]">
                        {filteredUserRequestCompletedGroups.map((group) => (
                          <div key={group.id} className="group relative flex flex-col p-0 bg-white border border-[#E5E7EB] rounded-[10px] transition-all duration-300 hover:shadow-md hover:border-[#10B981]/30">
                            <div 
                              onClick={() => setExpandedUserGroupId(expandedUserGroupId === group.id ? null : group.id)}
                              className="flex items-center w-full overflow-hidden py-[14px] cursor-pointer"
                            >
                              {/* Fixed Left - ID */}
                              <div className="flex-shrink-0 px-[18px] flex flex-col gap-1 min-w-[140px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Group ID</span>
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                                  <span className="text-[14px] font-medium text-[#111827]">{group.id}</span>
                                </div>
                              </div>

                              {/* Scrollable Middle */}
                              <div className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-4 pl-6 pr-4 border-l border-[#E5E7EB]">
                                {/* Users */}
                                <div className="flex-shrink-0 flex flex-col gap-1 min-w-[100px] max-w-[150px]">
                                  <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Users</span>
                                  <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{group.usersCount} users</span>
                                </div>

                                {/* Dates */}
                                <div className="flex-shrink-0 flex flex-col gap-1 min-w-[140px] max-w-[200px]">
                                  <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Approved Date</span>
                                  <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">08 Mar 2025</span>
                                </div>

                                {/* Approved By */}
                                <div className="flex-shrink-0 flex flex-col gap-1 min-w-[140px] max-w-[200px]">
                                  <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Approved By</span>
                                  <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">Yousif Al-Mahmood</span>
                                </div>

                                 {/* File */}
                                 <div className="flex-shrink-0 flex flex-col gap-1 min-w-[120px] max-w-[200px]">
                                  <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Uploaded File</span>
                                  <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setViewingFileName(group.fileName);
                                          setPdfViewerOpen(true);
                                        }}
                                        size="icon"
                                        variant="outline"
                                        className="bg-[#003F72]/10 hover:bg-[#003F72] text-[#003F72] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#003F72]/20"
                                      >
                                        <FileText className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">View File</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                </div>
                              </div>

                              {/* Fixed Right */}
                              <div className="flex-shrink-0 flex items-center gap-4 border-l border-[#E5E7EB] px-[18px] ml-auto">
                                <Badge variant={getStatusBadgeProps("approved").variant}>
                                  {getStatusBadgeProps("approved").label}
                                </Badge>
                                {expandedUserGroupId === group.id ? <ChevronUp className="w-5 h-5 text-[#6B7280]" /> : <ChevronDown className="w-5 h-5 text-[#6B7280]" />}
                              </div>
                            </div>

                            {/* Expanded Member List */}
                            {expandedUserGroupId === group.id && (
                              <div className="border-t border-[#F3F4F6] bg-[#F9FAFB]/50 transition-all duration-300">
                                <div className="px-8 py-5 border-b border-[#F3F4F6] bg-white flex items-center justify-between">
                                  <div>
                                    <h5 className="font-bold text-[#111827]">Group Members</h5>
                                    <p className="text-xs font-medium text-[#6B7280] mt-0.5">Full list of users included in group {group.id}</p>
                                  </div>
                                  <Badge className="bg-[#10B981]/10 text-[#10B981] border-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                                    {group.usersCount} Members
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
                                                    <button className="bg-[#ED1C24]/10 text-[#ED1C24] hover:bg-[#ED1C24]/20 border-0 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full transition-all">
                                                      +{user.role.split(', ').length - 1} More
                                                    </button>
                                                  </PopoverTrigger>
                                                  <PopoverContent className="w-80 bg-white rounded-2xl border-[#E5E7EB] shadow-xl p-5">
                                                    <div className="space-y-4">
                                                      <div className="flex items-center gap-3 pb-4 border-b border-[#F3F4F6]">
                                                        <div className="w-10 h-10 rounded-full bg-[#ED1C24]/10 flex items-center justify-center">
                                                          <span className="text-sm font-bold text-[#ED1C24]">
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
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>

            {/* Data Access Tab */}
            <TabsContent value="data-access" className="space-y-4">
              <Accordion type="single" collapsible className="space-y-3" value={openAccordion} onValueChange={setOpenAccordion}>
                {/* Pending Accordion */}
                <AccordionItem 
                  value="pending"
                  className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 ${openAccordion === 'pending' ? 'bg-[#FEF2F2]' : 'bg-white'}`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#ED1C24] rounded-full animate-pulse shadow-[0_0_8px_rgba(237,28,36,0.5)]"></div>
                      <span className="font-medium text-[#111827] text-sm">Pending</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0 bg-white/50">
                    {/* Search and Date Range */}
                    <div className="px-6 py-4 border-t border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <Input
                          placeholder="Search pending requests..."
                          value={dataAccessPendingSearch}
                          onChange={(e) => setDataAccessPendingSearch(e.target.value)}
                          className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 md:flex items-center gap-2 w-full lg:w-auto">
                        <Input
                          type="date"
                          value={dataAccessPendingDateRange.from}
                          onChange={(e) => setDataAccessPendingDateRange({ ...dataAccessPendingDateRange, from: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                        <div className="hidden md:flex items-center px-1">
                          <span className="text-[#6B7280] font-bold text-xs uppercase">to</span>
                        </div>
                        <Input
                          type="date"
                          value={dataAccessPendingDateRange.to}
                          onChange={(e) => setDataAccessPendingDateRange({ ...dataAccessPendingDateRange, to: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 p-6 border-t border-[#E5E7EB]">
                      {filteredDataAccessPending.map((request) => (
                        <div key={request.id} className="group relative flex bg-white border border-[#E5E7EB] rounded-[10px] transition-all duration-300 hover:shadow-md hover:border-[#ED1C24]/30 overflow-hidden items-center py-[14px]">
                          {/* Fixed Left - ID */}
                          <div className="flex-shrink-0 px-[18px] flex flex-col gap-1 min-w-[140px]">
                            <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Request ID</span>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] animate-pulse" />
                              <span className="text-[14px] font-medium text-[#111827]">{request.id}</span>
                            </div>
                          </div>

                          {/* Scrollable Middle */}
                          <div className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-4 pl-6 pr-4 border-l border-[#E5E7EB]">
                            {/* Service */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[180px] max-w-[280px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Service</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.service}</span>
                              <span className="text-[11px] font-normal text-[#6B7280] line-clamp-1">{request.serviceDescription}</span>
                            </div>

                            {/* Entity */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[160px] max-w-[240px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Entity</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.organization}</span>
                              <span className="text-[10px] font-medium text-[#9CA3AF]">IT Department</span>
                            </div>

                            {/* Requester */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[160px] max-w-[240px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Requester</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.requestor}</span>
                              <span className="text-[10px] font-medium text-[#9CA3AF]">Data Team</span>
                            </div>

                            {/* Date */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[100px] max-w-[140px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Requested Date</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">12 Jan 2025</span>
                            </div>
                          </div>

                          {/* Fixed Right */}
                          <div className="flex-shrink-0 flex items-center gap-2 border-l border-[#E5E7EB] px-[18px] ml-auto">
                            {isReviewer ? (
                              <span className="text-sm text-[#9CA3AF] font-medium px-[18px]">N/A</span>
                            ) : (
                              <TooltipProvider>
                                <div className="flex items-center gap-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        onClick={() => handleApproveClick(request.id)}
                                        size="icon"
                                        className="bg-[#10B981]/10 hover:bg-[#10B981] text-[#10B981] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#10B981]/20"
                                      >
                                        <Check className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Approve</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        onClick={() => {
                                          setForwardingRequest(request);
                                          setForwardDialogOpen(true);
                                        }}
                                        size="icon"
                                        className="bg-[#003F72]/10 hover:bg-[#003F72] text-[#003F72] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#003F72]/20"
                                      >
                                        <Forward className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Forward</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        onClick={() => handleRejectClick(request)}
                                        size="icon"
                                        variant="outline"
                                        className="bg-[#ED1C24]/10 hover:bg-[#ED1C24] text-[#ED1C24] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#ED1C24]/20"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Reject</TooltipContent>
                                  </Tooltip>
                                </div>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Forwarded Accordion */}
                <AccordionItem 
                  value="forwarded"
                  className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 ${openAccordion === 'forwarded' ? 'bg-[#FFFBEB]' : 'bg-white'}`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#F59E0B] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                      <span className="font-medium text-[#111827] text-sm">Forwarded</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0 bg-white/50">
                    {/* Search and Date Range */}
                    <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <Input
                          placeholder="Search forwarded requests..."
                          value={dataAccessForwardedSearch}
                          onChange={(e) => setDataAccessForwardedSearch(e.target.value)}
                          className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#F59E0B] rounded-[10px] h-[36px] text-[14px]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="date"
                          value={dataAccessForwardedDateRange.from}
                          onChange={(e) => setDataAccessForwardedDateRange({ ...dataAccessForwardedDateRange, from: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#F59E0B] rounded-[10px] h-[36px] text-[14px]"
                        />
                        <span className="text-[#6B7280] font-bold text-xs uppercase">to</span>
                        <Input
                          type="date"
                          value={dataAccessForwardedDateRange.to}
                          onChange={(e) => setDataAccessForwardedDateRange({ ...dataAccessForwardedDateRange, to: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#F59E0B] rounded-[10px] h-[36px] text-[14px]"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 p-6 border-t border-[#E5E7EB]">
                      {filteredDataAccessForwarded.map((request) => (
                        <div key={request.id} className="group relative flex flex-col p-0 bg-white border border-[#E5E7EB] rounded-[10px] transition-all duration-300 hover:shadow-md hover:border-[#F59E0B]/30">
                          <div className="flex items-center w-full overflow-hidden py-[14px]">
                            {/* Fixed Left - ID */}
                            <div className="flex-shrink-0 px-[18px] flex flex-col gap-1 min-w-[140px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Request ID</span>
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                                <span className="text-[14px] font-medium text-[#111827]">{request.id}</span>
                              </div>
                            </div>

                            {/* Scrollable Middle */}
                            <div className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-4 pl-6 pr-4 border-l border-[#E5E7EB]">
                              {/* Service */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[180px] max-w-[280px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Service</span>
                                <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.service}</span>
                                <span className="text-[11px] font-normal text-[#6B7280] line-clamp-1">{request.serviceDescription}</span>
                              </div>

                              {/* Dates */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[140px] max-w-[200px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Dates</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">Req: 15 Jan</span>
                                  <span className="text-[10px] text-[#9CA3AF]">?</span>
                                  <span className="text-[14px] font-medium text-[#F59E0B] whitespace-normal break-words leading-[1.4]">Fwd: 18 Jan</span>
                                </div>
                              </div>

                              {/* Data Owners */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[160px] max-w-[260px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Data Owners</span>
                                <div className="flex flex-wrap gap-1.5">
                                  {request.dataOwners?.map((owner: string, idx: number) => (
                                    <Badge key={idx} className="bg-[#003F72]/10 text-[#003F72] border-0 text-[9px] font-medium px-1.5 py-0.5 rounded-md">
                                      {owner}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              {/* Workflow Stepper Pre-view */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[200px] max-w-[300px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Workflow Progress</span>
                                <div className="flex items-center gap-1 mt-1">
                                  {request.workflow.map((_: any, idx: number) => (
                                    <div key={idx} className={`h-1 rounded-full ${idx < 2 ? 'bg-[#10B981] w-8' : idx === 2 ? 'bg-[#F59E0B] w-8' : 'bg-[#E5E7EB] w-8'}`}></div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Fixed Right */}
                            <div className="flex-shrink-0 flex items-center gap-4 border-l border-[#E5E7EB] px-[18px] ml-auto">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 font-medium px-3 py-1 rounded-lg uppercase text-[10px] tracking-wider">
                                Forwarded
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Expanded Workflow Detail */}
                          <div className="px-[18px] py-4 border-t border-[#F3F4F6] bg-[#F9FAFB]/50 rounded-b-2xl">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Info className="w-3.5 h-3.5 text-[#F59E0B]" />
                                <span className="text-[11px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Status:</span>
                                <p className="text-[11px] font-medium text-[#4B5563]">Waiting for data owner approval</p>
                              </div>
                              
                              <div className="flex items-center -space-x-1">
                                {request.workflow.map((step: any, idx: number) => (
                                  <div key={idx} className="flex items-center">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${idx < 2 ? 'bg-[#10B981] border-[#10B981]' : idx === 2 ? 'bg-white border-[#F59E0B]' : 'bg-white border-[#E5E7EB]'}`}>
                                      {idx < 2 ? (
                                        <Check className="w-3 h-3 text-white" />
                                      ) : (
                                        <span className={`text-[9px] font-bold ${idx === 2 ? 'text-[#F59E0B]' : 'text-[#6B7280]'}`}>{idx + 1}</span>
                                      )}
                                    </div>
                                    {idx < request.workflow.length - 1 && (
                                      <div className={`w-6 h-0.5 ${idx < 2 ? 'bg-[#10B981]' : 'bg-[#E5E7EB]'}`}></div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Completed Accordion */}
                <AccordionItem 
                  value="dept-completed"
                  className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 ${openAccordion === 'dept-completed' ? 'bg-[#ECFDF5]' : 'bg-white'}`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusBadgeProps("completed").variant}>{getStatusBadgeProps("completed").label}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0 bg-white/50">
                    {/* Search and Date Range */}
                    <div className="px-6 py-4 border-t border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <Input
                          placeholder="Search completed requests..."
                          value={dataAccessCompletedSearch}
                          onChange={(e) => setDataAccessCompletedSearch(e.target.value)}
                          className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 md:flex items-center gap-2 w-full lg:w-auto">
                        <Input
                          type="date"
                          value={dataAccessCompletedDateRange.from}
                          onChange={(e) => setDataAccessCompletedDateRange({ ...dataAccessCompletedDateRange, from: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                        <div className="hidden md:flex items-center px-1">
                          <span className="text-[#6B7280] font-bold text-xs uppercase">to</span>
                        </div>
                        <Input
                          type="date"
                          value={dataAccessCompletedDateRange.to}
                          onChange={(e) => setDataAccessCompletedDateRange({ ...dataAccessCompletedDateRange, to: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 p-6 border-t border-[#E5E7EB]">
                      {filteredDataAccessCompleted.map((request) => (
                        <div key={request.id} className="group relative flex flex-col p-0 bg-white border border-[#E5E7EB] rounded-[10px] transition-all duration-300 hover:shadow-md hover:border-[#10B981]/30">
                          <div className="flex items-center w-full overflow-hidden py-[14px]">
                            {/* Fixed Left - ID */}
                            <div className="flex-shrink-0 px-[18px] flex flex-col gap-1 min-w-[140px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Request ID</span>
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                                <span className="text-[14px] font-medium text-[#111827]">{request.id}</span>
                              </div>
                            </div>

                            {/* Scrollable Middle */}
                            <div className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-4 pl-6 pr-4 border-l border-[#E5E7EB]">
                              {/* Service */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[180px] max-w-[280px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Service</span>
                                <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.service}</span>
                                <span className="text-[11px] font-normal text-[#6B7280] line-clamp-1">{request.serviceDescription}</span>
                              </div>

                              {/* Dates */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[140px] max-w-[200px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Dates</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">Req: {request.reqDate}</span>
                                  <span className="text-[10px] text-[#9CA3AF]">?</span>
                                  <span className="text-[14px] font-medium text-[#10B981] whitespace-normal break-words leading-[1.4]">App: {request.appDate}</span>
                                </div>
                              </div>

                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[160px] max-w-[260px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Approved By</span>
                                <div className="flex items-center">
                                  <span className="inline-flex items-center px-[10px] py-[4px] rounded-full text-[12px] font-medium bg-[#E6F0FA] text-[#3D72A2]">
                                    {request.approvedBy}
                                  </span>
                                </div>
                                <span className="text-[11px] font-normal text-[#9CA3AF] mt-1">Super Admin</span>
                              </div>

                              {/* Workflow Stepper Pre-view */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[200px] max-w-[300px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Workflow Progress</span>
                                <div className="flex items-center gap-1 mt-1">
                                  {[1, 2, 3, 4].map((_, idx) => (
                                    <div key={idx} className="h-1 rounded-full bg-[#10B981] w-8"></div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Fixed Right */}
                            <div className="flex-shrink-0 flex items-center gap-4 border-l border-[#E5E7EB] px-[18px] ml-auto">
                              <Badge variant={getStatusBadgeProps("completed").variant}>
                                {getStatusBadgeProps("completed").label}
                              </Badge>
                            </div>
                          </div>
                          
                          {/* Expanded Workflow Detail */}
                          <div className="px-[18px] py-4 border-t border-[#F3F4F6] bg-[#F9FAFB]/50 rounded-b-2xl">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                                <span className="text-[11px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Status:</span>
                                <p className="text-[11px] font-medium text-[#4B5563]">Access granted and provisioned</p>
                              </div>
                              
                              <div className="flex items-center -space-x-1">
                                {[1, 2, 3, 4].map((step, idx) => (
                                  <div key={idx} className="flex items-center">
                                    <div className="w-6 h-6 rounded-full flex items-center justify-center bg-[#10B981] border-2 border-[#10B981]">
                                      <Check className="w-3 h-3 text-white" />
                                    </div>
                                    {idx < 3 && (
                                      <div className="w-6 h-0.5 bg-[#10B981]"></div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            {/* Spatial Permission Tab */}
            <TabsContent value="spatial-permission" className="space-y-8">
              {/* Permission Creation Requests Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 px-2">
                  <h3 className="text-sm font-bold text-[#374151] whitespace-nowrap">Spatial Access Requests � Creation</h3>
                  <div className="h-px flex-1 bg-[#E5E7EB]"></div>
                </div>
                
                <Accordion type="single" collapsible className="space-y-3" value={openAccordion} onValueChange={setOpenAccordion}>
                  {/* Pending Accordion */}
                  <AccordionItem 
                    value="pending"
                    className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 ${openAccordion === 'pending' ? 'bg-[#FEF2F2]' : 'bg-white'}`}
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">
                      <div className="flex items-center gap-3">
                        <Badge variant={getStatusBadgeProps("pending").variant}>{getStatusBadgeProps("pending").label}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0 bg-white/50">
                      {/* Search and Date Range */}
                      <div className="px-6 py-4 border-t border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1 relative w-full">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                          <Input
                            placeholder="Search pending requests..."
                            value={spatialPendingSearch}
                            onChange={(e) => setSpatialPendingSearch(e.target.value)}
                            className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                          />
                        </div>
                        <div className="grid grid-cols-2 md:flex items-center gap-2 w-full lg:w-auto">
                          <Input
                            type="date"
                            value={spatialPendingDateRange.from}
                            onChange={(e) => setSpatialPendingDateRange({ ...spatialPendingDateRange, from: e.target.value })}
                            className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                          />
                          <div className="hidden md:flex items-center px-1">
                            <span className="text-[#6B7280] font-bold text-xs uppercase">to</span>
                          </div>
                          <Input
                            type="date"
                            value={spatialPendingDateRange.to}
                            onChange={(e) => setSpatialPendingDateRange({ ...spatialPendingDateRange, to: e.target.value })}
                            className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 p-6 border-t border-[#E5E7EB]">
                        {filteredSpatialPending.map((request, index) => (
                          <div key={request.id} className="group relative flex bg-white border border-[#E5E7EB] rounded-[10px] transition-all duration-300 hover:shadow-md hover:border-[#ED1C24]/30 overflow-hidden items-center py-[14px]">
                            {/* Fixed Left - ID */}
                            <div className="flex-shrink-0 px-[18px] flex flex-col gap-1 min-w-[140px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Request ID</span>
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] animate-pulse" />
                                <span className="text-[14px] font-medium text-[#111827]">{request.id}</span>
                              </div>
                            </div>

                            {/* Scrollable Middle */}
                            <div className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-4 pl-6 pr-4 border-l border-[#E5E7EB]">
                              {/* Permission */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[200px] max-w-[300px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Permission Name</span>
                                <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.permissionName}</span>
                                <span className="text-[11px] font-normal text-[#9CA3AF] mt-0.5">{request.organization}</span>
                              </div>

                              {/* Coverage */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[150px] max-w-[220px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Coverage / Attributes</span>
                                <div className="flex items-center gap-1.5 mt-1.5">
                                  <Badge className="bg-[#003F72]/5 text-[#003F72] border-0 text-[10px] font-medium px-2 py-0.5 rounded-md">
                                    {index === 0 ? 'Full' : 'Partial'}
                                  </Badge>
                                  <Badge className="bg-[#10B981]/5 text-[#10B981] border-0 text-[10px] font-medium px-2 py-0.5 rounded-md">
                                    {index === 0 ? 'All' : 'Selected'}
                                  </Badge>
                                </div>
                              </div>

                              {/* Details */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[140px] max-w-[200px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Layers / Boundary</span>
                                <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.layers} Layers</span>
                                <span className="text-[11px] font-normal text-[#9CA3AF] uppercase mt-0.5">{request.boundary}</span>
                              </div>

                              {/* Date */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[120px] max-w-[160px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Requested Date</span>
                                <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{index === 0 ? '12 Mar 2025' : '08 Mar 2025'}</span>
                              </div>
                            </div>

                            {/* Fixed Right */}
                            <div className="flex-shrink-0 flex items-center gap-2 border-l border-[#E5E7EB] px-[18px] ml-auto">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      onClick={() => {
                                        setPreviewingRequest(request);
                                        setMapPreviewOpen(true);
                                      }}
                                      size="icon"
                                      variant="outline"
                                      className="bg-[#003F72]/10 hover:bg-[#003F72] text-[#003F72] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#003F72]/20"
                                    >
                                      <Map className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Preview Map</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              {isReviewer ? (

                                <span className="text-sm text-[#9CA3AF] font-medium px-[18px]">N/A</span>

                              ) : (

                                <TooltipProvider>
                                  <div className="flex items-center gap-2">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          onClick={() => handleApproveClick(request.id)}
                                          size="icon"
                                          className="bg-[#10B981]/10 hover:bg-[#10B981] text-[#10B981] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#10B981]/20"
                                        >
                                          <Check className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Approve</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          onClick={() => handleRejectClick(request)}
                                          size="icon"
                                          variant="outline"
                                          className="bg-[#ED1C24]/10 hover:bg-[#ED1C24] text-[#ED1C24] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#ED1C24]/20"
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Reject</TooltipContent>
                                    </Tooltip>
                                  </div>
                                </TooltipProvider>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Completed Accordion */}
                  <AccordionItem 
                    value="completed"
                    className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 ${openAccordion === 'completed' ? 'bg-[#ECFDF5]' : 'bg-white'}`}
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#10B981] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                        <span className="font-medium text-[#111827] text-sm">Completed</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0 bg-white/50">
                      {/* Search and Date Range */}
                      <div className="px-6 py-4 border-t border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1 relative w-full">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                          <Input
                            placeholder="Search completed requests..."
                            value={spatialCompletedSearch}
                            onChange={(e) => setSpatialCompletedSearch(e.target.value)}
                            className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] w-full"
                          />
                        </div>
                        <div className="grid grid-cols-2 md:flex items-center gap-2 w-full lg:w-auto">
                          <Input
                            type="date"
                            value={spatialCompletedDateRange.from}
                            onChange={(e) => setSpatialCompletedDateRange({ ...spatialCompletedDateRange, from: e.target.value })}
                            className="bg-white border-[#E5E7EB] focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] w-full"
                          />
                          <div className="hidden md:flex items-center px-1">
                            <span className="text-[#6B7280] font-bold text-xs uppercase">to</span>
                          </div>
                          <Input
                            type="date"
                            value={spatialCompletedDateRange.to}
                            onChange={(e) => setSpatialCompletedDateRange({ ...spatialCompletedDateRange, to: e.target.value })}
                            className="bg-white border-[#E5E7EB] focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 p-6 border-t border-[#E5E7EB]">
                        {filteredSpatialCompleted.map((request) => (
                          <div key={request.id} className="group relative flex bg-white border border-[#E5E7EB] rounded-[10px] transition-all duration-300 hover:shadow-md hover:border-[#10B981]/30 overflow-hidden items-center py-[14px]">
                            {/* Fixed Left - ID */}
                            <div className="flex-shrink-0 px-[18px] flex flex-col gap-1 min-w-[140px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Request ID</span>
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                                <span className="text-[14px] font-medium text-[#111827]">{request.id}</span>
                              </div>
                            </div>

                            {/* Scrollable Middle */}
                            <div className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-4 pl-6 pr-4 border-l border-[#E5E7EB]">
                              {/* Permission */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[200px] max-w-[300px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Permission Name</span>
                                <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.permissionName}</span>
                                <span className="text-[11px] font-normal text-[#9CA3AF] mt-0.5">{request.organization}</span>
                              </div>

                              {/* Dates */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[160px] max-w-[240px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Timeline</span>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">Req: 28 Feb</span>
                                  <span className="text-[10px] text-[#9CA3AF]">?</span>
                                  <span className="text-[14px] font-medium text-[#10B981] whitespace-normal break-words leading-[1.4]">App: 05 Mar</span>
                                </div>
                              </div>

                              {/* Approved By */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[160px] max-w-[260px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Approved By</span>
                                <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">Lulwa Saad Mujaddam</span>
                                <span className="text-[11px] font-normal text-[#9CA3AF]">IGA Admin</span>
                              </div>
                            </div>

                            {/* Fixed Right */}
                            <div className="flex-shrink-0 flex items-center gap-4 border-l border-[#E5E7EB] px-[18px] ml-auto">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      onClick={() => {
                                        setPreviewingRequest(request);
                                        setMapPreviewOpen(true);
                                      }}
                                      size="icon"
                                      variant="outline"
                                      className="bg-[#003F72]/10 hover:bg-[#003F72] text-[#003F72] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#003F72]/20"
                                    >
                                      <Map className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">View Map</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <Badge variant={getStatusBadgeProps("approved").variant}>
                                {getStatusBadgeProps("approved").label}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
                {/* User Spatial Permission Update Requests Section */}
              <div className="space-y-4 pt-4 border-t border-[#E5E7EB]">
                <div className="flex items-center gap-4 px-2">
                  <h3 className="text-sm font-bold text-[#374151] whitespace-nowrap">User Spatial Access � Updates</h3>
                  <div className="h-px flex-1 bg-[#E5E7EB]"></div>
                </div>
                
                <Accordion type="single" collapsible className="space-y-3" value={openAccordion} onValueChange={setOpenAccordion}>
                  {/* Pending Accordion */}
                  <AccordionItem 
                    value="user-pending"
                    className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 ${openAccordion === 'user-pending' ? 'bg-[#FEF2F2]' : 'bg-white'}`}
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">
                      <div className="flex items-center gap-3">
                        <Badge variant={getStatusBadgeProps("pending").variant}>Wait for Approval</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0 bg-white/50">
                      {/* Search and Date Range */}
                      <div className="px-6 py-4 border-t border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1 relative w-full">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                          <Input
                            placeholder="Search user updates..."
                            value={spatialUserPendingSearch}
                            onChange={(e) => setSpatialUserPendingSearch(e.target.value)}
                            className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                          />
                        </div>
                        <div className="grid grid-cols-2 md:flex items-center gap-2 w-full lg:w-auto">
                          <Input
                            type="date"
                            value={spatialUserPendingDateRange.from}
                            onChange={(e) => setSpatialUserPendingDateRange({ ...spatialUserPendingDateRange, from: e.target.value })}
                            className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                          />
                          <div className="hidden md:flex items-center px-1">
                            <span className="text-[#6B7280] font-bold text-xs uppercase">to</span>
                          </div>
                          <Input
                            type="date"
                            value={spatialUserPendingDateRange.to}
                            onChange={(e) => setSpatialUserPendingDateRange({ ...spatialUserPendingDateRange, to: e.target.value })}
                            className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 p-6 border-t border-[#E5E7EB]">
                        {filteredSpatialUserPending.map((request, index) => (
                          <div key={request.id} className="group relative flex bg-white border border-[#E5E7EB] rounded-[10px] transition-all duration-300 hover:shadow-md hover:border-[#ED1C24]/30 overflow-hidden items-center py-[14px]">
                            {/* Fixed Left - ID */}
                            <div className="flex-shrink-0 px-[18px] flex flex-col gap-1 min-w-[140px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Request ID</span>
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] animate-pulse" />
                                <span className="text-[14px] font-medium text-[#111827]">{request.id}</span>
                              </div>
                            </div>

                            {/* Scrollable Middle */}
                            <div className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-4 pl-6 pr-4 border-l border-[#E5E7EB]">
                              {/* User */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[180px] max-w-[280px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">User Details</span>
                                <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.user}</span>
                                <span className="text-[11px] font-normal text-[#9CA3AF] mt-0.5">{request.userEmail}</span>
                              </div>

                              {/* Permission */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[160px] max-w-[240px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Permission / Dept</span>
                                <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.permission}</span>
                                <span className="text-[11px] font-normal text-[#9CA3AF] mt-0.5">{request.department}</span>
                              </div>

                              {/* Change Type */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[100px] max-w-[140px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Change Type</span>
                                <div className="mt-1">
                                  <Badge className={`${
                                    request.changeType === 'Add' 
                                      ? 'bg-[#10B981]/10 text-[#10B981]' 
                                      : 'bg-[#8B5CF6]/10 text-[#8B5CF6]'
                                  } border-0 text-[10px] font-medium px-2 py-0.5 rounded-md`}>
                                    {request.changeType}
                                  </Badge>
                                </div>
                              </div>

                              {/* Date */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[100px] max-w-[140px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Date</span>
                                <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{index === 0 ? '16 Mar' : '15 Mar'} 2025</span>
                              </div>
                            </div>

                            {/* Fixed Right */}
                            <div className="flex-shrink-0 flex items-center gap-2 border-l border-[#E5E7EB] px-[18px] ml-auto">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      onClick={() => {
                                        setPreviewingRequest(request);
                                        setMapPreviewOpen(true);
                                      }}
                                      size="icon"
                                      variant="outline"
                                      className="bg-[#003F72]/10 hover:bg-[#003F72] text-[#003F72] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#003F72]/20"
                                    >
                                      <Map className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Preview Map</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              {isReviewer ? (

                                <span className="text-sm text-[#9CA3AF] font-medium px-[18px]">N/A</span>

                              ) : (

                                <TooltipProvider>
                                  <div className="flex items-center gap-2">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          onClick={() => handleApproveClick(request.id)}
                                          size="icon"
                                          className="bg-[#10B981]/10 hover:bg-[#10B981] text-[#10B981] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#10B981]/20"
                                        >
                                          <Check className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Approve</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button 
                                          onClick={() => handleRejectClick(request)}
                                          size="icon"
                                          variant="outline"
                                          className="bg-[#ED1C24]/10 hover:bg-[#ED1C24] text-[#ED1C24] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#ED1C24]/20"
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Reject</TooltipContent>
                                    </Tooltip>
                                  </div>
                                </TooltipProvider>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Completed Accordion */}
                  <AccordionItem 
                    value="user-completed"
                    className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 ${openAccordion === 'user-completed' ? 'bg-[#ECFDF5]' : 'bg-white'}`}
                  >
                    <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">
                      <div className="flex items-center gap-3">
                        <Badge variant={getStatusBadgeProps("completed").variant}>{getStatusBadgeProps("completed").label}</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-0 pb-0 bg-white/50">
                      {/* Search and Date Range */}
                      <div className="px-6 py-4 border-t border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center gap-4">
                        <div className="flex-1 relative w-full">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                          <Input
                            placeholder="Search completed logs..."
                            value={spatialUserCompletedSearch}
                            onChange={(e) => setSpatialUserCompletedSearch(e.target.value)}
                            className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] w-full"
                          />
                        </div>
                        <div className="grid grid-cols-2 md:flex items-center gap-2 w-full lg:w-auto">
                          <Input
                            type="date"
                            value={spatialUserCompletedDateRange.from}
                            onChange={(e) => setSpatialUserCompletedDateRange({ ...spatialUserCompletedDateRange, from: e.target.value })}
                            className="bg-white border-[#E5E7EB] focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] w-full"
                          />
                          <div className="hidden md:flex items-center px-1">
                            <span className="text-[#6B7280] font-bold text-xs uppercase">to</span>
                          </div>
                          <Input
                            type="date"
                            value={spatialUserCompletedDateRange.to}
                            onChange={(e) => setSpatialUserCompletedDateRange({ ...spatialUserCompletedDateRange, to: e.target.value })}
                            className="bg-white border-[#E5E7EB] focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] w-full"
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-3 p-6 border-t border-[#E5E7EB]">
                        {filteredSpatialUserCompleted.map((request) => (
                          <div key={request.id} className="group relative flex bg-white border border-[#E5E7EB] rounded-[10px] transition-all duration-300 hover:shadow-md hover:border-[#10B981]/30 overflow-hidden items-center py-[14px]">
                            {/* Fixed Left - ID */}
                            <div className="flex-shrink-0 px-[18px] flex flex-col gap-1 min-w-[140px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Request ID</span>
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                                <span className="text-[14px] font-medium text-[#111827]">{request.id}</span>
                              </div>
                            </div>

                            {/* Scrollable Middle */}
                            <div className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-4 pl-6 pr-4 border-l border-[#E5E7EB]">
                              {/* User */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[180px] max-w-[280px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">User Details</span>
                                <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.user}</span>
                                <span className="text-[11px] font-normal text-[#9CA3AF] mt-0.5">{request.userEmail}</span>
                              </div>

                              {/* Dates */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[140px] max-w-[200px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Timeline</span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">Req: 15 Feb</span>
                                  <span className="text-[10px] text-[#9CA3AF]">?</span>
                                  <span className="text-[14px] font-medium text-[#10B981] whitespace-normal break-words leading-[1.4]">App: 28 Feb</span>
                                </div>
                              </div>

                              {/* Approved By */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[160px] max-w-[260px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Approved By</span>
                                <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">Omar Al-Ansari</span>
                                <span className="text-[11px] font-normal text-[#9CA3AF] mt-0.5">IGA Admin</span>
                              </div>
                            </div>

                            {/* Fixed Right */}
                            <div className="flex-shrink-0 flex items-center gap-4 border-l border-[#E5E7EB] px-[18px] ml-auto">
                              <Button 
                                onClick={() => {
                                  setPreviewingRequest(request);
                                  setMapPreviewOpen(true);
                                }}
                                variant="ghost"
                                className="text-[#003F72] hover:bg-[#003F72]/5 font-medium h-[30px] px-4 rounded-lg text-[13px]"
                              >
                                View Map
                              </Button>
                              <Badge variant={getStatusBadgeProps("approved").variant}>
                                {getStatusBadgeProps("approved").label}
                              </Badge>
                            </div>
                          </div>
                        ))}
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
                  className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 ${openAccordion === 'pending' ? 'bg-[#FEF2F2]' : 'bg-white'}`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusBadgeProps("pending").variant}>{getStatusBadgeProps("pending").label}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0 bg-white/50">
                    {/* Search and Date Range */}
                    <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <Input
                          placeholder="Search pending services..."
                          value={servicesPendingSearch}
                          onChange={(e) => setServicesPendingSearch(e.target.value)}
                          className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px]"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="date"
                          value={servicesPendingDateRange.from}
                          onChange={(e) => setServicesPendingDateRange({ ...servicesPendingDateRange, from: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px]"
                        />
                        <span className="text-[#6B7280] font-bold text-xs uppercase">to</span>
                        <Input
                          type="date"
                          value={servicesPendingDateRange.to}
                          onChange={(e) => setServicesPendingDateRange({ ...servicesPendingDateRange, to: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px]"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 p-6 border-t border-[#E5E7EB]">
                      {filteredServicesPending.map((request, index) => (
                        <div key={request.id} className="group relative flex bg-white border border-[#E5E7EB] rounded-[10px] transition-all duration-300 hover:shadow-md hover:border-[#ED1C24]/30 overflow-hidden items-center py-[14px]">
                          {/* Fixed Left - ID */}
                          <div className="flex-shrink-0 px-[18px] flex flex-col gap-1 min-w-[140px]">
                            <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Request ID</span>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] animate-pulse" />
                              <span className="text-[14px] font-medium text-[#111827]">{request.id}</span>
                            </div>
                          </div>

                          {/* Scrollable Middle */}
                          <div className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-4 pl-6 pr-4 border-l border-[#E5E7EB]">
                            {/* Service Info */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[200px] max-w-[300px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Service Details</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.serviceName}</span>
                              <div className="mt-1">
                                <Badge className="bg-[#0099DD]/5 text-[#0099DD] border-0 text-[10px] font-medium px-2 py-0.5 rounded-md">
                                  {request.type}
                                </Badge>
                              </div>
                            </div>

                            {/* Organization */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[180px] max-w-[280px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Organization / Dept</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.organization}</span>
                              <span className="text-[11px] font-normal text-[#9CA3AF] mt-0.5">{request.department}</span>
                            </div>

                            {/* Requestor */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[140px] max-w-[200px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Submitted By</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.requestor}</span>
                              <span className="text-[11px] font-normal text-[#9CA3AF] uppercase mt-0.5">Citizen</span>
                            </div>

                            {/* Date */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[100px] max-w-[140px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Requested</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">14 Mar 2025</span>
                            </div>
                          </div>

                          {/* Fixed Right */}
                          <div className="flex-shrink-0 flex items-center gap-2 border-l border-[#E5E7EB] px-[18px] ml-auto">
                            {isReviewer ? (

                              <span className="text-sm text-[#9CA3AF] font-medium px-[18px]">N/A</span>

                            ) : (

                              <TooltipProvider>
                                <div className="flex items-center gap-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        onClick={() => handleApproveClick(request.id)}
                                        size="icon"
                                        className="bg-[#10B981]/10 hover:bg-[#10B981] text-[#10B981] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#10B981]/20"
                                      >
                                        <Check className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Approve</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        onClick={() => handleRejectClick(request)}
                                        size="icon"
                                        variant="outline"
                                        className="bg-[#ED1C24]/10 hover:bg-[#ED1C24] text-[#ED1C24] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#ED1C24]/20"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Reject</TooltipContent>
                                  </Tooltip>
                                </div>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Completed Accordion */}
                <AccordionItem 
                  value="completed"
                  className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 ${openAccordion === 'completed' ? 'bg-[#ECFDF5]' : 'bg-white'}`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusBadgeProps("completed").variant}>{getStatusBadgeProps("completed").label}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0 bg-white/50">
                    {/* Search and Date Range */}
                    <div className="px-6 py-4 border-t border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <Input
                          placeholder="Search completed services..."
                          value={servicesCompletedSearch}
                          onChange={(e) => setServicesCompletedSearch(e.target.value)}
                          className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 md:flex items-center gap-2 w-full lg:w-auto">
                        <Input
                          type="date"
                          value={servicesCompletedDateRange.from}
                          onChange={(e) => setServicesCompletedDateRange({ ...servicesCompletedDateRange, from: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                        <div className="hidden md:flex items-center px-1">
                          <span className="text-[#6B7280] font-bold text-xs uppercase">to</span>
                        </div>
                        <Input
                          type="date"
                          value={servicesCompletedDateRange.to}
                          onChange={(e) => setServicesCompletedDateRange({ ...servicesCompletedDateRange, to: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 p-6 border-t border-[#E5E7EB]">
                      {filteredServicesCompleted.map((request, index) => (
                        <div key={request.id} className="group relative flex bg-white border border-[#E5E7EB] rounded-[10px] transition-all duration-300 hover:shadow-md hover:border-[#10B981]/30 overflow-hidden items-center py-[14px]">
                          {/* Fixed Left - ID */}
                          <div className="flex-shrink-0 px-[18px] flex flex-col gap-1 min-w-[140px]">
                            <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Request ID</span>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                              <span className="text-[14px] font-medium text-[#111827]">{request.id}</span>
                            </div>
                          </div>

                          {/* Scrollable Middle */}
                          <div className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-4 pl-6 pr-4 border-l border-[#E5E7EB]">
                            {/* Service Info */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[220px] max-w-[340px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Service & URL</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.serviceName}</span>
                              <span className="text-[11px] font-mono text-[#0099DD] truncate max-w-[200px] mt-0.5">{request.url}</span>
                            </div>

                            {/* Dates */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[160px] max-w-[220px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Timeline</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">Req: 01 Mar</span>
                                <span className="text-[10px] text-[#9CA3AF]">?</span>
                                <span className="text-[14px] font-medium text-[#10B981] whitespace-normal break-words leading-[1.4]">App: 12 Mar</span>
                              </div>
                            </div>

                            {/* Approved By */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[160px] max-w-[240px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Approved By</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">Khalid Al-Zayani</span>
                              <span className="text-[11px] font-normal text-[#9CA3AF] mt-0.5">Service Manager</span>
                            </div>
                          </div>

                          {/* Fixed Right */}
                          <div className="flex-shrink-0 flex items-center gap-4 border-l border-[#E5E7EB] px-[18px] ml-auto">
                            <Badge variant={getStatusBadgeProps("active").variant}>
                              {getStatusBadgeProps("active").label}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>

            {/* Data Download Tab */}
            <TabsContent value="data-download" className="space-y-4">
              <Accordion type="single" collapsible className="space-y-3" value={openAccordion} onValueChange={setOpenAccordion}>
                {/* Pending Accordion */}
                <AccordionItem 
                  value="pending"
                  className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 ${openAccordion === 'pending' ? 'bg-[#FEF2F2]' : 'bg-white'}`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusBadgeProps("pending").variant}>{getStatusBadgeProps("pending").label}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0 bg-white/50">
                    <div className="px-6 py-4 border-t border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <Input
                          placeholder="Search pending downloads..."
                          value={downloadPendingSearch}
                          onChange={(e) => setDownloadPendingSearch(e.target.value)}
                          className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 md:flex items-center gap-2 w-full lg:w-auto">
                        <Input
                          type="date"
                          value={downloadPendingDateRange.from}
                          onChange={(e) => setDownloadPendingDateRange({ ...downloadPendingDateRange, from: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                        <div className="hidden md:flex items-center px-1">
                          <span className="text-[#6B7280] font-bold text-xs uppercase">to</span>
                        </div>
                        <Input
                          type="date"
                          value={downloadPendingDateRange.to}
                          onChange={(e) => setDownloadPendingDateRange({ ...downloadPendingDateRange, to: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                    </div>
                                        {filteredDownloadPending.map((request) => (
                        <div key={request.id} className="group relative flex bg-white border border-[#E5E7EB] rounded-[10px] transition-all duration-300 hover:shadow-md hover:border-[#ED1C24]/30 overflow-hidden items-center py-[14px]">
                          {/* Fixed Left - ID */}
                          <div className="flex-shrink-0 px-[18px] flex flex-col gap-1 min-w-[140px]">
                            <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Request ID</span>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] animate-pulse" />
                              <span className="text-[14px] font-medium text-[#111827]">{request.id}</span>
                            </div>
                          </div>

                          {/* Scrollable Middle */}
                          <div className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-4 pl-6 pr-4 border-l border-[#E5E7EB]">
                            {/* Dataset */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[200px] max-w-[300px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Dataset & Format</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.dataset}</span>
                              <div className="mt-1">
                                <Badge className="bg-[#003F72]/5 text-[#003F72] border-0 text-[10px] font-medium px-2 py-0.5 rounded-md">
                                  {request.format}
                                </Badge>
                              </div>
                            </div>

                            {/* Requestor */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[150px] max-w-[240px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Submitted By</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.requestor}</span>
                              <span className="text-[11px] font-normal text-[#9CA3AF] truncate max-w-[140px] lowercase mt-0.5">{request.email}</span>
                            </div>

                            {/* Timeline */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[100px] max-w-[140px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Timeline</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">14 Mar 2025</span>
                              <span className="text-[11px] font-normal text-[#9CA3AF] uppercase mt-0.5">Requested</span>
                            </div>
                          </div>

                          {/* Fixed Right */}
                          <div className="flex-shrink-0 flex items-center gap-3 border-l border-[#E5E7EB] px-[18px] ml-auto">
                            <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      onClick={() => {
                                        setPreviewingRequest(request);
                                        setMapPreviewOpen(true);
                                      }}
                                      size="icon"
                                      variant="outline"
                                      className="bg-[#003F72]/10 hover:bg-[#003F72] text-[#003F72] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#003F72]/20"
                                    >
                                      <Map className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Map</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            <div className="w-px h-6 bg-[#E5E7EB] mx-1" />
                             {isReviewer ? (
                               <span className="text-sm text-[#9CA3AF] font-medium px-[18px]">N/A</span>
                             ) : (
                               <TooltipProvider>
                                <div className="flex items-center gap-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        onClick={() => handleApproveClick(request.id)}
                                        size="icon"
                                        className="bg-[#10B981]/10 hover:bg-[#10B981] text-[#10B981] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#10B981]/20"
                                      >
                                        <Check className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Approve</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        onClick={() => {
                                          setForwardingRequest(request);
                                          setForwardDialogOpen(true);
                                        }}
                                        size="icon"
                                        className="bg-[#003F72]/10 hover:bg-[#003F72] text-[#003F72] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#003F72]/20"
                                      >
                                        <Forward className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Forward</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        onClick={() => handleRejectClick(request)}
                                        size="icon"
                                        variant="outline"
                                        className="bg-[#ED1C24]/10 hover:bg-[#ED1C24] text-[#ED1C24] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#ED1C24]/20"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Reject</TooltipContent>
                                  </Tooltip>
                                </div>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Forwarded Accordion */}
                <AccordionItem 
                  value="forwarded"
                  className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 ${openAccordion === 'forwarded' ? 'bg-[#FFF7ED]' : 'bg-white'}`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">{getStatusBadgeProps("forwarded").label}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0 bg-white/50">
                    <div className="px-6 py-4 border-t border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <Input
                          placeholder="Search forwarded downloads..."
                          value={downloadForwardedSearch}
                          onChange={(e) => setDownloadForwardedSearch(e.target.value)}
                          className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#F97316] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 md:flex items-center gap-2 w-full lg:w-auto">
                        <Input
                          type="date"
                          value={downloadForwardedDateRange.from}
                          onChange={(e) => setDownloadForwardedDateRange({ ...downloadForwardedDateRange, from: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#F97316] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                        <div className="hidden md:flex items-center px-1">
                          <span className="text-[#6B7280] font-bold text-xs uppercase">to</span>
                        </div>
                        <Input
                          type="date"
                          value={downloadForwardedDateRange.to}
                          onChange={(e) => setDownloadForwardedDateRange({ ...downloadForwardedDateRange, to: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#F97316] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                    </div>
                                        {dataDownloadForwardedList.map((request) => (
                        <div key={request.id} className="group relative flex bg-white border border-[#E5E7EB] rounded-[10px] transition-all duration-300 hover:shadow-md hover:border-[#F97316]/30 overflow-hidden items-center py-[14px] transition-all duration-300 hover:shadow-md hover:border-[#F97316]/30">
                          
                            {/* Fixed Left - ID */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[140px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Request ID</span>
                              <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#F97316]" />
                                <span className="text-[14px] font-medium text-[#111827]">{request.id}</span>
                              </div>
                            </div>

                            {/* Scrollable Middle */}
                            <div className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-4 pl-6 pr-4 border-l border-[#E5E7EB]">
                              {/* Dataset */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[200px] max-w-[300px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Dataset & Product</span>
                                <span className="text-[14px] font-medium text-[#111827] leading-[1.4] whitespace-normal break-words">{request.dataset}</span>
                                <span className="text-[11px] font-normal text-[#0099DD] mt-0.5">{request.product}</span>
                              </div>

                              {/* Ownership */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[150px] max-w-[280px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Workflow Ownership</span>
                                <div className="flex flex-wrap gap-1.5 mt-1.5">
                                  {request.dataOwners.map((owner, idx) => (
                                    <Badge key={idx} className="bg-[#003F72]/5 text-[#003F72] border-0 text-[10px] font-medium px-2 py-0.5 rounded-lg truncate max-w-[120px]">
                                      {owner}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Dates */}
                              <div className="flex-shrink-0 flex flex-col gap-1 min-w-[120px] max-w-[160px]">
                                <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Key Dates</span>
                                <div className="flex flex-col mt-0.5">
                                  <span className="text-[11px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">Req: 10 Mar 2025</span>
                                  <span className="text-[11px] font-medium text-[#F97316] whitespace-normal break-words leading-[1.4]">Fwd: 12 Mar 2025</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Fixed Right */}
                            <div className="flex-shrink-0 flex items-center gap-4 border-l border-[#E5E7EB] px-[18px] ml-auto">
                              <Badge variant={getStatusBadgeProps("pending").variant}>
                                {getStatusBadgeProps("pending").label}
                              </Badge>
                            </div>
                          </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Completed Accordion */}
                <AccordionItem 
                  value="completed"
                  className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 ${openAccordion === 'completed' ? 'bg-[#ECFDF5]' : 'bg-white'}`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusBadgeProps("completed").variant}>{getStatusBadgeProps("completed").label}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0 bg-white/50">
                    <div className="px-6 py-4 border-t border-[#E5E7EB] flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <Input
                          placeholder="Search completed downloads..."
                          value={downloadCompletedSearch}
                          onChange={(e) => setDownloadCompletedSearch(e.target.value)}
                          className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 md:flex items-center gap-2 w-full lg:w-auto">
                        <Input
                          type="date"
                          value={downloadCompletedDateRange.from}
                          onChange={(e) => setDownloadCompletedDateRange({ ...downloadCompletedDateRange, from: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                        <div className="hidden md:flex items-center px-1">
                          <span className="text-[#6B7280] font-bold text-xs uppercase">to</span>
                        </div>
                        <Input
                          type="date"
                          value={downloadCompletedDateRange.to}
                          onChange={(e) => setDownloadCompletedDateRange({ ...downloadCompletedDateRange, to: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-3 p-6 border-t border-[#E5E7EB]">
                      {dataDownloadCompletedRequests.map((request) => (
                        <div key={request.id} className="group relative flex bg-white border border-[#E5E7EB] rounded-[10px] transition-all duration-300 hover:shadow-md hover:border-[#10B981]/30 overflow-hidden items-center py-[14px]">
                          {/* Fixed Left - ID */}
                          <div className="flex-shrink-0 px-[18px] flex flex-col gap-1 min-w-[140px]">
                            <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Request ID</span>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                              <span className="text-[14px] font-medium text-[#111827]">{request.id}</span>
                            </div>
                          </div>

                          {/* Scrollable Middle */}
                          <div className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-4 pl-6 pr-4 border-l border-[#E5E7EB]">
                            {/* Dataset */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[200px] max-w-[300px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Dataset & Format</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.dataset}</span>
                              <div className="mt-1">
                                <Badge className="bg-[#10B981]/5 text-[#10B981] border-0 text-[10px] font-medium px-2 py-0.5 rounded-md">
                                  {request.format}
                                </Badge>
                              </div>
                            </div>

                            {/* Dates */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[160px] max-w-[200px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Timeline</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">Req: 05 Mar</span>
                                <span className="text-[10px] text-[#9CA3AF]">?</span>
                                <span className="text-[14px] font-medium text-[#10B981] whitespace-normal break-words leading-[1.4]">App: 14 Mar</span>
                              </div>
                            </div>

                            {/* Approved By */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[160px] max-w-[240px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Approved By</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">Layla Al-Qassimi</span>
                              <span className="text-[11px] font-normal text-[#9CA3AF] mt-0.5 uppercase">Service Lead</span>
                            </div>
                          </div>

                          {/* Fixed Right */}
                          <div className="flex-shrink-0 flex items-center gap-4 border-l border-[#E5E7EB] px-[18px] ml-auto">
                            <div className="flex flex-col items-end gap-1">
                              <Badge variant={getStatusBadgeProps("approved").variant}>
                                {getStatusBadgeProps("approved").label}
                              </Badge>
                              <span className="text-[9px] font-medium text-[#9CA3AF] uppercase tracking-tighter">Workflow closed</span>
                            </div>
                          </div>
                        </div>
                      ))}
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
                  className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden ${openAccordion === 'pending' ? 'bg-[#ED1C24]/5' : 'bg-white'}`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-[#EBECE8]/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusBadgeProps("pending").variant}>{getStatusBadgeProps("pending").label}</Badge>
                      </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    {/* Search and Date Range */}
                    <div className="px-6 py-4 border-t border-[#E5E5E5] bg-[#F8F9FA] flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
                        <Input
                          placeholder="Search requests..."
                          value={metadataPendingSearch}
                          onChange={(e) => setMetadataPendingSearch(e.target.value)}
                          className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 md:flex items-center gap-2 w-full lg:w-auto">
                        <Input
                          type="date"
                          value={metadataPendingDateRange.from}
                          onChange={(e) => setMetadataPendingDateRange({ ...metadataPendingDateRange, from: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                        <div className="hidden md:flex items-center px-1">
                          <span className="text-[#6B7280] font-bold text-xs uppercase">to</span>
                        </div>
                        <Input
                          type="date"
                          value={metadataPendingDateRange.to}
                          onChange={(e) => setMetadataPendingDateRange({ ...metadataPendingDateRange, to: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 p-6 border-t border-[#E5E7EB]">
                      {metadataPendingRequests.map((request, index) => (
                        <div key={request.id} className="group relative flex bg-white border border-[#E5E7EB] rounded-[10px] transition-all duration-300 hover:shadow-md hover:border-[#ED1C24]/30 overflow-hidden items-center py-[14px]">
                          {/* Fixed Left - ID */}
                          <div className="flex-shrink-0 px-[18px] flex flex-col gap-1 min-w-[140px]">
                            <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Request ID</span>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] animate-pulse" />
                              <span className="text-[14px] font-medium text-[#111827]">{request.id}</span>
                            </div>
                          </div>

                          {/* Scrollable Middle */}
                          <div className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-4 pl-6 pr-4 border-l border-[#E5E7EB]">
                            {/* Layer Name */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[200px] max-w-[300px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Layer Name</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.layerName}</span>
                              <span className="text-[11px] font-normal text-[#9CA3AF] mt-0.5 whitespace-normal break-words leading-[1.4]">{request.layerSubtitle}</span>
                            </div>

                            {/* Requestor */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[150px] max-w-[240px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Requestor</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.requestor}</span>
                            </div>

                            {/* Requested By */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[150px] max-w-[240px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Requested By</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.requestor || "Jawaher Rashed"}</span>
                            </div>

                            {/* Timeline */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[100px] max-w-[140px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Requested Date</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{index === 0 ? '16 Mar 2025' : index === 1 ? '14 Mar 2025' : '12 Mar 2025'}</span>
                            </div>
                          </div>

                          {/* Fixed Right */}
                          <div className="flex-shrink-0 flex items-center gap-3 border-l border-[#E5E7EB] px-[18px] ml-auto">
                            {isReviewer ? (
                              <span className="text-sm text-[#9CA3AF] font-medium">N/A</span>
                            ) : (
                              <TooltipProvider>
                                <div className="flex items-center gap-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        onClick={() => handleApproveClick(request.id)}
                                        size="icon"
                                        className="bg-[#10B981]/10 hover:bg-[#10B981] text-[#10B981] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#10B981]/20"
                                      >
                                        <Check className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Approve</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        onClick={() => handleRejectClick(request)}
                                        size="icon"
                                        variant="outline"
                                        className="bg-[#ED1C24]/10 hover:bg-[#ED1C24] text-[#ED1C24] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#ED1C24]/20"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Reject</TooltipContent>
                                  </Tooltip>
                                </div>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Completed Accordion */}
                <AccordionItem 
                  value="completed"
                  className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden ${openAccordion === 'completed' ? 'bg-[#00A651]/5' : 'bg-white'}`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-[#EBECE8]/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusBadgeProps("completed").variant}>{getStatusBadgeProps("completed").label}</Badge>
                      </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    {/* Search and Date Range */}
                    <div className="px-6 py-4 border-t border-[#E5E5E5] bg-[#F8F9FA] flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
                        <Input
                          placeholder="Search requests..."
                          value={metadataCompletedSearch}
                          onChange={(e) => setMetadataCompletedSearch(e.target.value)}
                          className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 md:flex items-center gap-2 w-full lg:w-auto">
                        <Input
                          type="date"
                          value={metadataCompletedDateRange.from}
                          onChange={(e) => setMetadataCompletedDateRange({ ...metadataCompletedDateRange, from: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                        <div className="hidden md:flex items-center px-1">
                          <span className="text-[#6B7280] font-bold text-xs uppercase">to</span>
                        </div>
                        <Input
                          type="date"
                          value={metadataCompletedDateRange.to}
                          onChange={(e) => setMetadataCompletedDateRange({ ...metadataCompletedDateRange, to: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 p-6 border-t border-[#E5E7EB]">
                      {metadataCompletedRequests.map((request, index) => (
                        <div key={request.id} className="group relative flex bg-white border border-[#E5E7EB] rounded-[10px] transition-all duration-300 hover:shadow-md hover:border-[#10B981]/30 overflow-hidden items-center py-[14px]">
                          {/* Fixed Left - ID */}
                          <div className="flex-shrink-0 px-[18px] flex flex-col gap-1 min-w-[140px]">
                            <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Request ID</span>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                              <span className="text-[14px] font-medium text-[#111827]">{request.id}</span>
                            </div>
                          </div>

                          {/* Scrollable Middle */}
                          <div className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-4 pl-6 pr-4 border-l border-[#E5E7EB]">
                            {/* Layer Name */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[200px] max-w-[300px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Layer Name</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.layerName}</span>
                              <span className="text-[11px] font-normal text-[#9CA3AF] mt-0.5 whitespace-normal break-words leading-[1.4]">{request.layerSubtitle}</span>
                            </div>

                            {/* Requestor */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[150px] max-w-[240px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Requestor & Requested By</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.requestor}</span>
                              <span className="text-[11px] font-normal text-[#9CA3AF] mt-0.5 whitespace-normal break-words leading-[1.4]">By: {request.requestor || "Jawaher Rashed"}</span>
                            </div>

                            {/* Dates */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[160px] max-w-[200px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Timeline</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">Req: {request.date}</span>
                                <span className="text-[10px] text-[#9CA3AF]">?</span>
                                <span className="text-[14px] font-medium text-[#10B981] whitespace-normal break-words leading-[1.4]">App: 13 Mar 2025</span>
                              </div>
                            </div>

                            {/* Approved By */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[160px] max-w-[240px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Approved By</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">Noor Al-Hashimi</span>
                            </div>
                          </div>

                          {/* Fixed Right */}
                          <div className="flex-shrink-0 flex items-center gap-4 border-l border-[#E5E7EB] px-[18px] ml-auto">
                            <Badge variant={getStatusBadgeProps("approved").variant}>
                              {getStatusBadgeProps("approved").label}
                            </Badge>
                          </div>
                        </div>
                      ))}
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
                  className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden ${openAccordion === 'pending' ? 'bg-[#ED1C24]/5' : 'bg-white'}`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-[#EBECE8]/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusBadgeProps("pending").variant}>{getStatusBadgeProps("pending").label}</Badge>
                      </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    {/* Search and Date Range */}
                    <div className="px-6 py-4 border-t border-[#E5E5E5] bg-[#F8F9FA] flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
                        <Input
                          placeholder="Search requests..."
                          value={appUserPendingSearch}
                          onChange={(e) => setAppUserPendingSearch(e.target.value)}
                          className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 md:flex items-center gap-2 w-full lg:w-auto">
                        <Input
                          type="date"
                          value={appUserPendingDateRange.from}
                          onChange={(e) => setAppUserPendingDateRange({ ...appUserPendingDateRange, from: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                        <div className="hidden md:flex items-center px-1">
                          <span className="text-[#6B7280] font-bold text-xs uppercase">to</span>
                        </div>
                        <Input
                          type="date"
                          value={appUserPendingDateRange.to}
                          onChange={(e) => setAppUserPendingDateRange({ ...appUserPendingDateRange, to: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 p-6 border-t border-[#E5E7EB]">
                      {appUserPendingRequests.map((request, index) => (
                        <div key={request.id} className="group relative flex bg-white border border-[#E5E7EB] rounded-[10px] transition-all duration-300 hover:shadow-md hover:border-[#ED1C24]/30 overflow-hidden items-center py-[14px]">
                          {/* Fixed Left - ID */}
                          <div className="flex-shrink-0 px-[18px] flex flex-col gap-1 min-w-[140px]">
                            <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Request ID</span>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#ED1C24] animate-pulse" />
                              <span className="text-[14px] font-medium text-[#111827]">{request.id}</span>
                            </div>
                          </div>

                          {/* Scrollable Middle */}
                          <div className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-4 pl-6 pr-4 border-l border-[#E5E7EB]">
                            {/* User Info */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[200px] max-w-[280px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">User Details</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.userName}</span>
                              <span className="text-[11px] font-normal text-[#9CA3AF] mt-0.5 whitespace-normal break-words leading-[1.4]">{request.email}</span>
                            </div>

                            {/* Organization */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[180px] max-w-[280px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Organization / Dept</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.organization}</span>
                              <span className="text-[11px] font-normal text-[#9CA3AF] mt-0.5 whitespace-normal break-words leading-[1.4]">{request.department}</span>
                            </div>

                            {/* Role */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[120px] max-w-[160px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Role</span>
                              <div className="mt-0.5">
                                <Badge className="bg-[#0099DD]/5 text-[#0099DD] border-0 text-[10px] font-medium px-2 py-0.5 rounded-md">
                                  {request.role}
                                </Badge>
                              </div>
                            </div>

                            {/* Timeline */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[160px] max-w-[200px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Timeline</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.requestedDate}</span>
                              </div>
                            </div>
                            
                            {/* Requested By */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[150px] max-w-[240px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Requested By</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.submittedBy || "Jawaher Rashed"}</span>
                            </div>
                          </div>

                          {/* Fixed Right */}
                          <div className="flex-shrink-0 flex items-center gap-3 border-l border-[#E5E7EB] px-[18px] ml-auto">
                            {isReviewer ? (
                              <span className="text-sm text-[#9CA3AF] font-medium">N/A</span>
                            ) : (
                              <TooltipProvider>
                                <div className="flex items-center gap-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        onClick={() => handleApproveClick(request.id)}
                                        size="icon"
                                        className="bg-[#10B981]/10 hover:bg-[#10B981] text-[#10B981] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#10B981]/20"
                                      >
                                        <Check className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Approve</TooltipContent>
                                  </Tooltip>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        onClick={() => handleRejectClick(request)}
                                        size="icon"
                                        variant="outline"
                                        className="bg-[#ED1C24]/10 hover:bg-[#ED1C24] text-[#ED1C24] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#ED1C24]/20"
                                      >
                                        <X className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Reject</TooltipContent>
                                  </Tooltip>
                                </div>
                              </TooltipProvider>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Completed Accordion */}
                <AccordionItem 
                  value="completed"
                  className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden ${openAccordion === 'completed' ? 'bg-[#00A651]/5' : 'bg-white'}`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-[#EBECE8]/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <Badge variant={getStatusBadgeProps("completed").variant}>{getStatusBadgeProps("completed").label}</Badge>
                      </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    {/* Search and Date Range */}
                    <div className="px-6 py-4 border-t border-[#E5E5E5] bg-[#F8F9FA] flex flex-col lg:flex-row lg:items-center gap-4">
                      <div className="flex-1 relative w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
                        <Input
                          placeholder="Search requests..."
                          value={appUserCompletedSearch}
                          onChange={(e) => setAppUserCompletedSearch(e.target.value)}
                          className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 md:flex items-center gap-2 w-full lg:w-auto">
                        <Input
                          type="date"
                          value={appUserCompletedDateRange.from}
                          onChange={(e) => setAppUserCompletedDateRange({ ...appUserCompletedDateRange, from: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                        <div className="hidden md:flex items-center px-1">
                          <span className="text-[#6B7280] font-bold text-xs uppercase">to</span>
                        </div>
                        <Input
                          type="date"
                          value={appUserCompletedDateRange.to}
                          onChange={(e) => setAppUserCompletedDateRange({ ...appUserCompletedDateRange, to: e.target.value })}
                          className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-[10px] h-[36px] text-[14px] w-full"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 p-6 border-t border-[#E5E7EB]">
                      {appUserCompletedRequests.map((request, index) => (
                        <div key={request.id} className="group relative flex bg-white border border-[#E5E7EB] rounded-[10px] transition-all duration-300 hover:shadow-md hover:border-[#10B981]/30 overflow-hidden items-center py-[14px]">
                          {/* Fixed Left - ID */}
                          <div className="flex-shrink-0 px-[18px] flex flex-col gap-1 min-w-[140px]">
                            <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Request ID</span>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                              <span className="text-[14px] font-medium text-[#111827]">{request.id}</span>
                            </div>
                          </div>

                          {/* Scrollable Middle */}
                          <div className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-4 pl-6 pr-4 border-l border-[#E5E7EB]">
                            {/* User Info */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[200px] max-w-[280px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">User Details</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.userName}</span>
                              <span className="text-[11px] font-normal text-[#9CA3AF] mt-0.5 whitespace-normal break-words leading-[1.4]">{request.email}</span>
                            </div>

                            {/* Organization */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[180px] max-w-[280px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Organization / Dept</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.organization}</span>
                              <span className="text-[11px] font-normal text-[#9CA3AF] mt-0.5 whitespace-normal break-words leading-[1.4]">{request.department}</span>
                            </div>

                            {/* Role */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[120px] max-w-[160px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Role</span>
                              <div className="mt-0.5">
                                <Badge className="bg-[#0099DD]/5 text-[#0099DD] border-0 text-[10px] font-medium px-2 py-0.5 rounded-md">
                                  {request.role}
                                </Badge>
                              </div>
                            </div>

                            {/* Timeline */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[160px] max-w-[220px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Timeline</span>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">Req: {request.requestedDate}</span>
                                <span className="text-[10px] text-[#9CA3AF]">?</span>
                                <span className="text-[14px] font-medium text-[#10B981] whitespace-normal break-words leading-[1.4]">App: {request.approvedDate}</span>
                              </div>
                            </div>

                            {/* Approver & Requester */}
                            <div className="flex-shrink-0 flex flex-col gap-1 min-w-[180px] max-w-[280px]">
                              <span className="text-[12px] font-medium text-[#6B7280] uppercase tracking-[0.4px]">Approver & Requester</span>
                              <span className="text-[14px] font-medium text-[#111827] whitespace-normal break-words leading-[1.4]">{request.approvedBy}</span>
                              <span className="text-[11px] font-normal text-[#9CA3AF] mt-0.5 whitespace-normal break-words leading-[1.4]">Req by: {request.submittedBy || "Jawaher Rashed"}</span>
                            </div>
                          </div>

                          {/* Fixed Right */}
                          <div className="flex-shrink-0 flex items-center gap-4 border-l border-[#E5E7EB] px-[18px] ml-auto">
                            <Badge variant={getStatusBadgeProps("approved").variant}>
                              {getStatusBadgeProps("approved").label}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Approval Confirmation Dialog */}
      <Dialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <DialogContent className="max-w-md bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
          <div className="px-8 pt-8 pb-8">
            <DialogHeader className="sr-only">
              <DialogTitle>Approve Request</DialogTitle>
              <DialogDescription>Confirm approval of the request</DialogDescription>
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
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#1A1A1A]">
                  Approve Request
                </h3>
                <p className="text-[#6B6B6B] text-sm">
                  Are you sure you want to approve request {pendingApprovalId}?
                </p>
                
                {/* Conditional URL Input for Services Creation */}
                {activeTab === "services-creation" && (
                  <div className="text-left space-y-2 pt-2">
                    <Label htmlFor="service-url" className="text-sm font-semibold text-[#1A1A1A]">
                      Add URL <span className="text-[#ED1C24]">*</span>
                    </Label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] group-focus-within:text-[#ED1C24] transition-colors">
                        <Globe className="w-4 h-4" />
                      </div>
                      <Input
                        id="service-url"
                        placeholder="https://mapservices.bsdi.gov.bh/..."
                        value={serviceUrl}
                        onChange={(e) => setServiceUrl(e.target.value)}
                        className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#ED1C24] focus:border-[#ED1C24] rounded-xl h-11 text-[14px] transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleApprovalConfirm}
                  className="w-full bg-gradient-to-r from-[#00A651] to-[#008d44] hover:from-[#008d44] hover:to-[#007a3a] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(0,166,81,0.3)] hover:shadow-[0_8px_32px_rgba(0,166,81,0.4)] transition-all duration-300"
                >
                  Yes, Approve
                </Button>
                <Button
                  onClick={handleApprovalCancel}
                  variant="outline"
                  className="w-full border-[#E0E0E0] rounded-xl h-12 text-[#252628] hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection Dialog with Comments */}
      <Dialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <DialogContent className="max-w-md bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
          <div className="px-8 pt-8 pb-8">
            <DialogHeader className="sr-only">
              <DialogTitle>Reject Request</DialogTitle>
              <DialogDescription>Please provide a reason for rejection</DialogDescription>
            </DialogHeader>
            <div className="text-center space-y-6">
              {/* Alert Illustration */}
              <div className="flex justify-center">
                <div className="relative">
                  {/* Outer glow circle */}
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B6B]/20 to-[#ED1C24]/20 rounded-full blur-2xl scale-150"></div>

                  {/* Main circle with alert illustration */}
                  <div className="relative w-24 h-24 bg-gradient-to-br from-[#FF6B6B] to-[#ED1C24] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(237,28,36,0.4)]">
                    <div className="relative">
                      <XCircle className="w-10 h-10 text-white" strokeWidth={2} />
                    </div>
                  </div>

                  {/* Animated rings */}
                  <div className="absolute inset-0 rounded-full border-4 border-[#FF6B6B]/30 animate-ping"></div>
                </div>
              </div>
              
              {/* Confirmation Text */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#1A1A1A]">
                  Reject Request
                </h3>
                <p className="text-[#6B6B6B] text-sm">
                  Please provide a reason for rejecting request {rejectingRequest?.id}
                </p>
              </div>

              <div className="space-y-4 text-left">
                <div className="space-y-2">
                  <Label htmlFor="rejection-comment" className="text-sm font-semibold text-[#252628]">
                    Rejection Reason <span className="text-[#ED1C24]">*</span>
                  </Label>
                  <Textarea
                    id="rejection-comment"
                    value={rejectionComment}
                    onChange={(e) => setRejectionComment(e.target.value)}
                    placeholder="Enter the reason for rejection..."
                    className="min-h-[120px] bg-[#EBECE8]/30 border-[#B0AAA2]/30 rounded-xl resize-none focus:ring-2 focus:ring-[#ED1C24]"
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleRejectionConfirm}
                  className="w-full bg-gradient-to-r from-[#ED1C24] to-[#d41820] hover:from-[#d41820] hover:to-[#c0151b] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300"
                >
                  Confirm Rejection
                </Button>
                <Button
                  onClick={handleRejectionCancel}
                  variant="outline"
                  className="w-full border-[#E0E0E0] rounded-xl h-12 text-[#252628] hover:bg-gray-50"
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
        <DialogContent className="sm:max-w-[500px] bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
          <div className="px-8 pt-8 pb-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-[#1A1A1A]">
                Upload Document
              </DialogTitle>
              <DialogDescription className="text-[#6B6B6B] mt-2">
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
                  className="flex-1 bg-gradient-to-r from-[#ED1C24] to-[#d41820] hover:from-[#d41820] hover:to-[#c0151b] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="flex-1 border-[#E0E0E0] rounded-xl h-12 hover:bg-[#EBECE8]/30 transition-all"
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
        <DialogContent className="sm:max-w-[500px] bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
          <div className="px-8 pt-8 pb-8">
            <DialogHeader className="mb-6 text-center">
              {/* Success Icon */}
              <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-gradient-to-br from-[#22C55E] to-[#16A34A] flex items-center justify-center shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <DialogTitle className="text-3xl font-bold text-[#1A1A1A]">
                Request Sent!
              </DialogTitle>
              <DialogDescription className="text-[#6B6B6B] mt-3 text-base">
                Your request has been sent to the Admin for approval.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Info Box */}
              <div className="flex items-start gap-3 p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl">
                <div className="w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm text-[#1E40AF] flex-1">
                  You will be notified once the Admin reviews and approves your request for <span className="font-semibold">Group {requestingGroupId}</span>
                </p>
              </div>

              {/* Action Button */}
              <Button
                onClick={() => setRequestConfirmDialogOpen(false)}
                className="w-full bg-gradient-to-r from-[#ED1C24] to-[#d41820] hover:from-[#d41820] hover:to-[#c0151b] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300 font-semibold"
              >
                OK
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
        <DialogContent className="sm:max-w-[600px] bg-white rounded-2xl border border-[#B0AAA2]/20 shadow-2xl p-0">
          <div className="px-8 pt-8 pb-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-[#252628]">
                Forward Request
              </DialogTitle>
              <DialogDescription className="text-[#666666] mt-2">
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
        <DialogContent className="w-[95vw] max-w-[1400px] sm:w-[95vw] h-[600px] bg-white rounded-2xl border border-[#B0AAA2]/20 shadow-2xl p-0 flex flex-col">
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
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
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
          <div className="px-8 pt-8 pb-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-[#252628]">
                Organization Details
              </DialogTitle>
              <DialogDescription className="text-[#666666] mt-2">
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
                  value="???? ??????? ????????"
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
    </div>
  );
}