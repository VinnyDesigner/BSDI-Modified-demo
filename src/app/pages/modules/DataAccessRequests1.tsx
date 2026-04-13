import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { FileText, CheckCircle, Clock, XCircle, Search, X, ChevronDown, ChevronUp, Upload, Trash2, Download, Calendar, Hand, Map, Forward, Eye, Users, Globe, Building2, Layers, MapPin } from "lucide-react";
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

  .sub-tabs-container {
    display: flex;
    gap: 20px;
    border-bottom: 1px solid #E5E7EB;
    margin-bottom: 24px;
    padding-bottom: 0;
  }
  .sub-tab-item {
    padding: 8px 12px;
    font-size: 14px;
    font-weight: 500;
    color: #6B7280;
    cursor: pointer;
    position: relative;
    transition: all 0.2s;
  }
  .sub-tab-item:hover {
    color: #111827;
  }
  .sub-tab-item.active {
    color: #111827;
    font-weight: 600;
  }
  .sub-tab-item.active::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #EF4444;
  }
`;

// Mock data for pending requests
const RAW_pendingRequests = [
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
  { 
    id: "REQ-2024-001", 
    organization: "BSDI",
    description: "BSDI Primary Node Registration",
    submittedBy: "Jawaher Rashed", 
    date: "18 Mar 2026", 
    status: "pending" 
  },
  { 
    id: "REQ-2024-002", 
    organization: "Works Authority",
    description: "Infrastructure Data Access",
    submittedBy: "Layla Ahmed", 
    date: "17 Mar 2026", 
    status: "pending",
    dataOwners: ["Jawaher Rashed"]
  },
  { 
    id: "REQ-2024-003", 
    organization: "BSDI",
    description: "Metadata Schema Update",
    submittedBy: "Khalid Ali", 
    date: "16 Mar 2026", 
    status: "pending" 
  }
];

// Mock data for completed requests
const RAW_completedRequests = [
  { 
    id: "REQ-3042-989", 
    organization: "Urban Planning Authority",
    description: "The Urban Planning Authority is responsible for comprehensive urban development planning, land use regulation, and sustainable growth strategies across the Kingdom of Bahrain.",
    submittedBy: "Layla Ahmed", 
    date: "13 Mar 2026", 
    status: "approved" 
  },
  { 
    id: "REQ-3042-988", 
    organization: "Environmental Agency",
    description: "The Environmental Agency oversees environmental protection, conservation efforts, and sustainability initiatives to preserve Bahrain's natural resources and ecological balance.",
    submittedBy: "Jawaher Rashed", 
    date: "12 Mar 2026", 
    status: "approved" 
  },
  { 
    id: "REQ-2024-004", 
    organization: "BSDI",
    description: "Annual Security Audit Report",
    submittedBy: "Jawaher Rashed", 
    date: "11 Mar 2026", 
    status: "approved" 
  },
  { 
    id: "REQ-2024-005", 
    organization: "Ministry of Interior",
    description: "Public Safety Data Integration",
    submittedBy: "Omar Abdullah", 
    date: "05 Mar 2026", 
    status: "approved",
    approvedBy: "Jawaher Rashed"
  }
];

const RAW_departmentCompletedRequests = [
  { 
    id: "DEPT-3042-889", 
    department: "Road Network Studies",
    type: "Create",
    organization: "Works Authority",
    approver: "Fatima Al-Mansoori",
    approvedDate: "10 Mar 2025",
    status: "Approved"
  },
  { 
    id: "DEPT-2024-001", 
    department: "GIS Department",
    type: "Update",
    organization: "BSDI",
    approver: "Jawaher Rashed",
    approvedDate: "15 Mar 2026",
    status: "Approved"
  },
  { 
    id: "DEPT-2024-002", 
    department: "Mapping Services",
    type: "Create",
    organization: "BSDI",
    approver: "Jawaher Rashed",
    approvedDate: "12 Mar 2026",
    status: "Approved"
  }
];

const RAW_departmentPendingRequests = [
  { 
    id: "DEPT-3042-992", 
    department: "GIS Operations Unit",
    type: "CREATE",
    organization: "Transport Authority",
    submittedBy: "Lulwa Saad Mujaddam",
    requestedDate: "16 Mar 2026",
    businessDescription: "Responsible for managing and maintaining GIS infrastructure, spatial data operations, and technical support across all municipal departments.",
    status: "pending" 
  },
  { 
    id: "DEPT-3042-991", 
    department: "Spatial Data Management",
    type: "CREATE",
    organization: "Min. of Municipalities",
    submittedBy: "Muneera Khamis",
    requestedDate: "15 Mar 2026",
    businessDescription: "Manages spatial data collection, validation, and distribution for municipal planning and development activities, ensuring data integrity and accessibility.",
    status: "pending" 
  },
  { 
    id: "DEPT-2024-003", 
    department: "GIS Department",
    type: "Update",
    organization: "BSDI",
    submittedBy: "Jawaher Rashed",
    requestedDate: "18 Mar 2026",
    businessDescription: "Updating storage capacity for the core GIS database to accommodate new raster datasets.",
    status: "pending" 
  },
  { 
    id: "DEPT-2024-004", 
    department: "IT Infrastructure",
    type: "Update",
    organization: "BSDI",
    submittedBy: "Ahmed Al-Mansoori",
    requestedDate: "17 Mar 2026",
    businessDescription: "Server maintenance and upgrade for the production environment.",
    status: "pending",
    dataOwners: ["Jawaher Rashed"]
  }
];



// Mock data for user request groups (matching saved user groups structure)
const RAW_userRequestGroups = [
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
  {
    id: "GRP-004",
    usersCount: 5,
    dateCreated: "18 Mar 2026",
    status: "pending",
    fileName: "bsdi_review_group.pdf",
    fileSize: "512 KB",
    submittedBy: "Jawaher Rashed",
    users: [
      { id: 10, name: "Fatima Al-Sayed", email: "fatima.alsayed@bsdi.gov.bh", role: "GIS Analyst", department: "GIS Department", organization: "BSDI" },
      { id: 11, name: "Ahmed Al-Mansoori", email: "ahmed.mansoori@bsdi.gov.bh", role: "Data Manager", department: "GIS Department", organization: "BSDI" }
    ]
  }
];

// Filter user request groups by status
const userRequestPendingGroups = RAW_userRequestGroups.filter(g => g.status === "pending");
const userRequestCompletedGroups = RAW_userRequestGroups.filter(g => g.status === "completed");


// Mock data for Data Access Pending Requests

// Mock data for Data Access Completed Requests
const RAW_dataAccessCompletedRequests = [
  { id: "DAE-3042-941", service: "Utility Networks - WMS", reqDate: "12 Jan 2025", appDate: "20 Jan 2025", approvedBy: "Mohammed Al-Baker" },
  { id: "DAE-3042-945", service: "Land Parcels - WFS", reqDate: "08 Jan 2025", appDate: "18 Jan 2025", approvedBy: "Sara Mohammad" },
  { id: "DAE-3042-946", service: "Satellite Imagery - WMTS", reqDate: "05 Jan 2025", appDate: "15 Jan 2025", approvedBy: "Ahmed Al-Harqani" },
  { id: "DAE-3042-947", service: "Topographic Maps - WMS", reqDate: "02 Jan 2025", appDate: "10 Jan 2025", approvedBy: "Jawaher Rashed" },
  { id: "DAE-2024-001", service: "BSDI Core Layers - WFS", reqDate: "10 Mar 2026", appDate: "15 Mar 2026", approvedBy: "Jawaher Rashed", organization: "BSDI", organizationDept: "GIS Department" },
  { id: "DAE-2024-002", service: "Traffic Flow API", reqDate: "05 Mar 2026", appDate: "12 Mar 2026", approvedBy: "Jawaher Rashed", organization: "Transport Authority", organizationDept: "Traffic Management" }
];

const RAW_dataAccessPendingRequests = [
  { id: "DAE-3042-893", service: "Road Network - WMS", entity: "Transport Authority", requester: "Sara Mohammad", date: "12 Jan 2025" },
  { id: "DAE-3042-894", service: "Building Footprints - WFS", entity: "Min. of Municipalities", requester: "Ahmed Al-Harqani", date: "12 Jan 2025" },
  { id: "DAE-2024-003", service: "Satellite Imagery 2024", entity: "BSDI", requester: "Jawaher Rashed", date: "16 Mar 2026" },
  { id: "DAE-2024-004", service: "Utility Corridors", entity: "BSDI", requester: "Ahmed Al-Mansoori", date: "15 Mar 2026", dataOwners: ["Jawaher Rashed"] }
];

const DATA_OWNERS = [
  { id: "do1", name: "Ahmed Al-Mansoori" },
  { id: "do2", name: "Fatima Al-Sayed" },
  { id: "do3", name: "Khalid Al-Khalifa" },
  { id: "do4", name: "Muna Ibrahim" },
  { id: "do5", name: "Jasim Al-Rowai" }
];

const RAW_dataAccessForwardedRequests = [
  { 
    id: "DAE-3042-941", 
    service: "Utility Networks - WMS", 
    reqDate: "15 Jan 2025", 
    fwdDate: "18 Jan 2025", 
    dataOwners: ["Jawaher Rashed", "Lulwa Saad Mujaddam"],
    progressStage: 3
  },
  { 
    id: "DAE-3042-942", 
    service: "Land Parcels - WFS", 
    reqDate: "10 Jan 2025", 
    fwdDate: "12 Jan 2025", 
    dataOwners: ["Ahmed Al-Harqani"],
    progressStage: 2
  },
  { 
    id: "DAE-3042-943", 
    service: "Satellite Imagery - WMTS", 
    reqDate: "08 Jan 2025", 
    fwdDate: "09 Jan 2025", 
    dataOwners: ["Muneera Khamis", "Rana A. Majeed"],
    progressStage: 4
  },
  { 
    id: "DAE-3042-944", 
    service: "Topographic Maps - WMS", 
    reqDate: "05 Jan 2025", 
    fwdDate: "—", 
    dataOwners: ["Lulwa Saad Mujaddam"],
    progressStage: 1
  }
];

// Mock data for Spatial Access Pending Requests
const RAW_spatialAccessPendingRequests = [
  { 
    id: "SPC-2024-021", 
    permissionName: "GIS Data Access", 
    coverage: "Full, All", 
    layers: "3 Layers (Bahrain Full Extent)", 
    date: "12 Mar 2025", 
    status: "pending" 
  },
  { 
    id: "SPC-2024-022", 
    permissionName: "Aerial View Access", 
    coverage: "Partial, Selected", 
    layers: "11 Layers (Northern Governorate)", 
    date: "08 Mar 2025", 
    status: "pending" 
  },
  { 
    id: "SPC-2024-001", 
    permissionName: "BSDI Internal Review", 
    coverage: "Full", 
    layers: "15 Layers", 
    date: "18 Mar 2026", 
    status: "pending",
    organization: "BSDI"
  },
  { 
    id: "SPC-2024-002", 
    permissionName: "Ministry of Health Emergency Access", 
    coverage: "Regional", 
    layers: "5 Layers", 
    date: "17 Mar 2026", 
    status: "pending",
    dataOwners: ["Jawaher Rashed"]
  }
];

// Mock data for Spatial Access Completed Requests
const RAW_spatialAccessCompletedRequests = [
  { 
    id: "SPC-2024-018", 
    permissionName: "Cadastral Access", 
    requestedDate: "28 Feb 2025", 
    approvedDate: "05 Mar 2025", 
    approvedBy: "Lulwa Saad Mujaddam", 
    status: "approved" 
  },
  { 
    id: "SPC-2024-003", 
    permissionName: "Spatial Planning Access", 
    requestedDate: "10 Mar 2026", 
    approvedDate: "14 Mar 2026", 
    approvedBy: "Jawaher Rashed", 
    status: "approved",
    organization: "BSDI"
  }
];

// Mock data for User Access Sub-tab Pending Requests
const RAW_userAccessSubPendingRequests = [
  { id: "SPU-2024-014", userDetails: "Noura Al-Khalifa", email: "noura.khalifa@bsdi.gov.bh", permissionDept: "GIS Data Access (Urban Planning)", type: "Add", date: "16 Mar 2025", status: "pending" },
  { id: "SPU-2024-015", userDetails: "Yousif Al-Dossari", email: "yousif.dossari@bsdi.gov.bh", permissionDept: "Aerial View Access (Road Network)", type: "Modify", date: "15 Mar 2025", status: "pending" },
  { id: "SPU-2024-001", userDetails: "Fatima Al-Sayed", email: "fatima.alsayed@bsdi.gov.bh", permissionDept: "Core Data Access (GIS Department)", type: "Add", date: "18 Mar 2026", status: "pending", department: "GIS Department" },
  { id: "SPU-2024-002", userDetails: "Ahmed Al-Mansoori", email: "ahmed.mansoori@bsdi.gov.bh", permissionDept: "Infrastructure Access (IT Department)", type: "Modify", date: "17 Mar 2026", status: "pending", dataOwners: ["Jawaher Rashed"] }
];

// Mock data for User Access Sub-tab Completed Requests
const RAW_userAccessSubCompletedRequests = [
  { id: "SPU-2024-012", userDetails: "Ahmed Al-Mannai", email: "ahmed.m@survey.bh", requestedDate: "15 Feb 2025", approvedDate: "28 Feb 2025", approvedBy: "Omar Al-Ansari", status: "Approved" },
  { id: "SPU-2024-003", userDetails: "Sara Mohammad", email: "sara.m@bsdi.gov.bh", requestedDate: "10 Mar 2026", approvedDate: "14 Mar 2026", approvedBy: "Jawaher Rashed", status: "Approved" }
];


// Mock data for Data Download Pending Requests
const RAW_dataDownloadPendingRequests = [
  { 
    id: "DL-2042-913", 
    dataset: "Road Network - Full",
    format: "Shapefile",
    requestor: "Sara Mohammad",
    description: "Complete road network dataset for transportation planning",
    email: "sara.mohammad@transport.gov.bh",
    date: "14 Mar 2025", 
    status: "pending" 
  },
  { 
    id: "DL-2042-914", 
    dataset: "Building Footprints",
    format: "GeoJSON",
    requestor: "Ahmad Al-Kharus",
    description: "Building footprints for urban development analysis",
    email: "ahmad.alkharus@planning.gov.bh",
    date: "14 Mar 2025", 
    status: "pending" 
  },
  { 
    id: "DL-2024-001", 
    dataset: "BSDI Administrative Boundaries",
    format: "File Geodatabase",
    requestor: "Jawaher Rashed",
    description: "Official administrative boundaries for all governorates.",
    email: "jawaher.rashed@bsdi.gov.bh",
    date: "18 Mar 2026", 
    status: "pending" 
  },
  { 
    id: "DL-2024-002", 
    dataset: "High Resolution Imagery 2024",
    format: "GeoTIFF",
    requestor: "Fatima Al-Sayed",
    description: "Multi-spectral satellite imagery for environmental monitoring.",
    email: "fatima.alsayed@bsdi.gov.bh",
    date: "17 Mar 2026", 
    status: "pending",
    dataOwners: ["Jawaher Rashed"]
  }
];


const RAW_dataDownloadCompletedRequests = [
  { 
    id: "DIM-2045-914", 
    dataset: "Parcel Boundaries",
    format: "KML",
    requestor: "Fatima Hassan",
    requestedDate: "05 Mar 2025", 
    approvedDate: "14 Mar 2025",
    approvedBy: "Layla Al-Qassimi",
    status: "Approved" 
  },
  { 
    id: "DL-2024-003", 
    dataset: "National Elevation Model",
    format: "DEM",
    requestor: "Jawaher Rashed",
    requestedDate: "01 Mar 2026", 
    approvedDate: "15 Mar 2026",
    approvedBy: "Khalid Ali",
    status: "Approved" 
  }
];


const RAW_dataDownloadForwardedRequests = [
  { 
    id: "DL-2042-912", 
    dataset: "Utility Networks",
    product: "Plugins",
    requestor: "Khalid K. Fars",
    requestedDate: "10 Mar 2025", 
    forwardedDate: "12 Mar 2025",
    dataOwners: "Ministry of Works",
    workflow: "Submitted-Processed-Approved" 
  },
  { 
    id: "DL-2024-004", 
    dataset: "Digital Twin 3D Models",
    product: "3D Data",
    requestor: "Ahmed Al-Mansoori",
    requestedDate: "15 Mar 2026", 
    forwardedDate: "18 Mar 2026",
    dataOwners: "Jawaher Rashed",
    workflow: "Submitted-Processed-Approving" 
  }
];


const RAW_metadataPendingRequests = [
  { 
    id: "META-2042-989", 
    layerName: "Topographic Database",
    layerType: "Vector",
    requestor: "Maryam Al-Jayed",
    requestedBy: "Maryam Al-Jayed",
    date: "16 Mar 2025" 
  },
  { 
    id: "META-2043-916", 
    layerName: "Satellite Imagery",
    layerType: "Raster",
    requestor: "Abdullah Yawar",
    requestedBy: "Abdullah Yawar",
    date: "14 Mar 2025" 
  },
  { 
    id: "META-2042-911", 
    layerName: "Flood Hazard Zones",
    layerType: "Vector",
    requestor: "Noura Al-Khalifa",
    requestedBy: "Noura Al-Khalifa",
    date: "12 Mar 2025" 
  },
  { 
    id: "META-2024-001", 
    layerName: "BSDI Metadata Core",
    layerType: "Standard",
    requestor: "Jawaher Rashed",
    requestedBy: "Jawaher Rashed",
    date: "18 Mar 2026" 
  },
  { 
    id: "META-2024-002", 
    layerName: "Infrastructure Metadata",
    layerType: "Vector",
    requestor: "Ahmed Al-Mansoori",
    requestedBy: "Ahmed Al-Mansoori",
    date: "17 Mar 2026",
    dataOwners: ["Jawaher Rashed"]
  }
];


const RAW_metadataCompletedRequests = [
  { 
    id: "META-2043-907", 
    layerName: "Land Use 2023",
    layerType: "Polygon",
    requestor: "Yusuf Al-Doseri",
    requestedDate: "3 days ago", 
    approvedDate: "13 Mar 2025",
    approvedBy: "Noor Al-Hashimi",
    status: "Approved" 
  },
  { 
    id: "META-2043-903", 
    layerName: "Road Centerlines",
    layerType: "Line",
    requestor: "Sara Mohammad",
    requestedDate: "6 days ago", 
    approvedDate: "13 Mar 2025",
    approvedBy: "Noor Al-Hashimi",
    status: "Approved" 
  },
  { 
    id: "META-2024-003", 
    layerName: "Geographic Names Index",
    layerType: "Database",
    requestor: "Jawaher Rashed",
    requestedDate: "05 Mar 2026", 
    approvedDate: "15 Mar 2026",
    approvedBy: "Khalid Ali",
    status: "Approved" 
  }
];

const RAW_appUsersPendingRequests = [
    { id: "APP-3042-125", name: "Ahmed Al-Mansouri", email: "ahmed.mansouria@gov.bh", orgDept: "Ministry of Works (GIS Department)", role: "GIS Analyst", requestedDate: "18 Mar 2025", requestedBy: "Lulwa Saad Mujaddam" },
    { id: "APP-3042-124", name: "Fatima Al-Khalifa", email: "fatima.khalifa@gov.bh", orgDept: "Transport Authority (Data Management)", role: "Data Reviewer", requestedDate: "17 Mar 2025", requestedBy: "Rana A. Majeed" },
    { id: "APP-2024-001", name: "Sara Mohammad", email: "sara.m@bsdi.gov.bh", orgDept: "BSDI (GIS Department)", role: "GIS Manager", requestedDate: "18 Mar 2026", requestedBy: "Jawaher Rashed" },
    { id: "APP-2024-002", name: "Khalid Ali", email: "khalid.ali@bsdi.gov.bh", orgDept: "BSDI (IT Infrastructure)", role: "System Admin", requestedDate: "17 Mar 2026", requestedBy: "Ahmed Al-Mansoori", dataOwners: ["Jawaher Rashed"] }
  ];

  const RAW_appUsersCompletedRequests = [
    { id: "APP-3042-123", name: "Mohammed Al-Baker", email: "mohammed.baker@gov.bh", orgDept: "Urban Planning Authority (Planning Department)", role: "Department Admin", requestedDate: "15 Mar 2025", approvedDate: "20 Mar 2025", approver: "—", requester: "—", status: "Approved" },
    { id: "APP-3042-122", name: "—", email: "", orgDept: "Environmental Agency (Data Services)", role: "Organization User", requestedDate: "14 Mar 2025", approvedDate: "19 Mar 2025", approver: "Yousif Al-Mahmood", requester: "Ahmed Al-Harqani", status: "Approved" },
    { id: "APP-2024-003", name: "Layla Ahmed", email: "layla.a@bsdi.gov.bh", orgDept: "BSDI (Mapping Services)", role: "Org Admin", requestedDate: "10 Mar 2026", approvedDate: "15 Mar 2026", approver: "Jawaher Rashed", requester: "Jawaher Rashed", status: "Approved" }
  ];

export default function DataAccessRequests1() {
  const [appUsersPendingSearch, setAppUsersPendingSearch] = useState("");
  const [appUsersPendingDateRange, setAppUsersPendingDateRange] = useState({from:'', to:''});
  const [appUsersCompletedSearch, setAppUsersCompletedSearch] = useState("");
  const [appUsersCompletedDateRange, setAppUsersCompletedDateRange] = useState({from:'', to:''});

  

    const location = useLocation();
  const navigate = useNavigate();

  const isSuperAdmin = location.pathname.includes("/super-admin");
  const isOrgAdmin = location.pathname.includes("/entity-admin");
  const isDeptAdmin = location.pathname.includes("/department");
  const isReviewer = location.pathname.includes("/reviewer");
  const adminName = "Jawaher Rashed";
  const adminOrg = "BSDI";
  const adminDept = "GIS Department";

  const applyRbacFilter = (requests: any[]) => {
    if (!requests || !Array.isArray(requests)) return [];
    if (isSuperAdmin) return requests;
    
    if (isReviewer) {
      return requests.filter(req => {
        const ownerMatch = req.dataOwners?.includes(adminName) || (Array.isArray(req.dataOwners) && req.dataOwners.includes(adminName));
        const approverMatch = req.approvedBy === adminName || req.approver === adminName || req.reviewer === adminName;
        return ownerMatch || approverMatch;
      });
    }

    if (isDeptAdmin) {
      return requests.filter(req => {
        const deptStr = (req.orgDept || req.department || req.organizationDept || req.permissionDept || "").toLowerCase();
        const deptMatch = deptStr.includes(adminDept.toLowerCase());
        const submitterMatch = req.submittedBy === adminName || req.requestor === adminName || req.requestedBy === adminName;
        const ownerMatch = req.dataOwners?.includes(adminName) || req.approvedBy === adminName || req.approver === adminName;
        return deptMatch || submitterMatch || ownerMatch;
      });
    }

    // Default: isOrgAdmin or Organization User
    return requests.filter(req => {
      const orgStr = (req.organization || req.entity || req.orgDept || req.organizationDept || "").toLowerCase();
      const orgMatch = orgStr.includes(adminOrg.toLowerCase());
      const submitterMatch = req.submittedBy === adminName || req.requestor === adminName || req.requestedBy === adminName;
      const ownerMatch = req.dataOwners?.includes(adminName) || req.approvedBy === adminName || req.approver === adminName;
      return orgMatch || submitterMatch || ownerMatch;
    });
  };

  const applyGroupsRbacFilter = (groups: any[]) => {
    if (!groups || !Array.isArray(groups)) return [];
    if (isSuperAdmin) return groups;
    if (isOrgAdmin) {
      return groups.filter(g => g.users?.some((u: any) => (u.organization || "").toLowerCase() === adminOrg.toLowerCase()) || true); // Assuming submitter is always matched
    }
    return groups;
  };

  const pendingRequests = applyRbacFilter(RAW_pendingRequests);
  const completedRequests = applyRbacFilter(RAW_completedRequests);
  const departmentCompletedRequests = applyRbacFilter(RAW_departmentCompletedRequests);
  const departmentPendingRequests = applyRbacFilter(RAW_departmentPendingRequests);
  const dataAccessCompletedRequests = applyRbacFilter(RAW_dataAccessCompletedRequests);
  const dataAccessPendingRequests = applyRbacFilter(RAW_dataAccessPendingRequests);
  const dataAccessForwardedRequests = applyRbacFilter(RAW_dataAccessForwardedRequests);
  const spatialAccessPendingRequests = applyRbacFilter(RAW_spatialAccessPendingRequests);
  const spatialAccessCompletedRequests = applyRbacFilter(RAW_spatialAccessCompletedRequests);
  const userAccessSubPendingRequests = applyRbacFilter(RAW_userAccessSubPendingRequests);
  const userAccessSubCompletedRequests = applyRbacFilter(RAW_userAccessSubCompletedRequests);
  const dataDownloadPendingRequests = applyRbacFilter(RAW_dataDownloadPendingRequests);
  const dataDownloadCompletedRequests = applyRbacFilter(RAW_dataDownloadCompletedRequests);
  const dataDownloadForwardedRequests = applyRbacFilter(RAW_dataDownloadForwardedRequests);
  const metadataPendingRequests = applyRbacFilter(RAW_metadataPendingRequests);
  const metadataCompletedRequests = applyRbacFilter(RAW_metadataCompletedRequests);
  const appUsersPendingRequests = applyRbacFilter(RAW_appUsersPendingRequests);
  const appUsersCompletedRequests = applyRbacFilter(RAW_appUsersCompletedRequests);
  const userRequestGroups = applyGroupsRbacFilter(RAW_userRequestGroups);

  const filteredUserRequestPendingGroups = userRequestGroups.filter(g => g.status === "pending");
  const filteredUserRequestCompletedGroups = userRequestGroups.filter(g => g.status === "completed");

  const filteredCompletedRequests = completedRequests;
  const filteredDeptCompleted = departmentCompletedRequests;
  const filteredDeptPending = departmentPendingRequests;
  const totalPending = filteredUserRequestPendingGroups.length + departmentPendingRequests.length;
  const totalApproved = completedRequests.length + filteredUserRequestCompletedGroups.length + departmentCompletedRequests.length;

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
  const [orgCompletedSearch, setOrgCompletedSearch] = useState("");
  const [orgCompletedDateRange, setOrgCompletedDateRange] = useState({ from: "", to: "" });
  
  const [deptPendingSearch, setDeptPendingSearch] = useState("");

  const [metadataPendingSearch, setMetadataPendingSearch] = useState("");
  const [metadataPendingDateRange, setMetadataPendingDateRange] = useState({from:'', to:''});
  const [metadataForwardedSearch, setMetadataForwardedSearch] = useState("");
  const [metadataForwardedDateRange, setMetadataForwardedDateRange] = useState({from:'', to:''});
  const [metadataCompletedSearch, setMetadataCompletedSearch] = useState("");
  const [metadataCompletedDateRange, setMetadataCompletedDateRange] = useState({from:'', to:''});

  const [dataDownloadForwardedSearch, setDataDownloadForwardedSearch] = useState("");
  const [dataDownloadForwardedDateRange, setDataDownloadForwardedDateRange] = useState({from:'', to:''});

  const [deptPendingDateRange, setDeptPendingDateRange] = useState({ from: "", to: "" });
  
  const [userRequestPendingSearch, setUserRequestPendingSearch] = useState("");
  const [userRequestPendingDateRange, setUserRequestPendingDateRange] = useState({ from: "", to: "" });
  const [userRequestCompletedSearch, setUserRequestCompletedSearch] = useState("");
  const [userRequestCompletedDateRange, setUserRequestCompletedDateRange] = useState({ from: "", to: "" });
  const [userRequestOpenAccordion, setUserRequestOpenAccordion] = useState<string | undefined>("user-pending");
  const [expandedGroupRow, setExpandedGroupRow] = useState<string | null>(null);
  const [fileViewerOpen, setFileViewerOpen] = useState<{open: boolean; fileName: string; fileSize: string}>({open: false, fileName: '', fileSize: ''});
  const [rolesPopover, setRolesPopover] = useState<{open: boolean; roles: string[]; anchor: string}>({open: false, roles: [], anchor: ''});
  const [approveDialog, setApproveDialog] = useState<{open: boolean; requestId: string}>({open: false, requestId: ''});
  const [rejectDialog, setRejectDialog] = useState<{open: boolean; requestId: string}>({open: false, requestId: ''});
  const [rejectionReason, setRejectionReason] = useState("");
  

  
  // Download loading state
  const [downloadingKpi, setDownloadingKpi] = useState<string | null>(null);
  
  const showOrgTab = isSuperAdmin || isReviewer;
  const showDeptTab = !isDeptAdmin || isSuperAdmin || isReviewer;
  
  // Get the active tab from URL query parameters
  const searchParams = new URLSearchParams(location.search);
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || (showOrgTab ? "organization-creator" : (showDeptTab ? "department" : "user-request")));
  
  // Highlighted request ID for notification-to-request navigation
  const notificationId = searchParams.get("notificationId");
  const [highlightedId, setHighlightedId] = useState<string | null>(notificationId);
  
  // Accordion state for auto-opening based on notification status
  const [openAccordion, setOpenAccordion] = useState<string | undefined>("org-completed");
  
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
  
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [viewingFileName, setViewingFileName] = useState<string>("");
  
  const [forwardDialogOpen, setForwardDialogOpen] = useState(false);
  const [selectedForwardRequest, setSelectedForwardRequest] = useState<any>(null);
  const [selectedDataOwners, setSelectedDataOwners] = useState<string[]>([]);
  const [forwardNotes, setForwardNotes] = useState("");
  
  const [dataAccessForwardedSearch, setDataAccessForwardedSearch] = useState("");
  const [dataAccessForwardedDateRange, setDataAccessForwardedDateRange] = useState({ from: "", to: "" });
  
  // Organization Details Dialog state
  const [orgDetailsDialogOpen, setOrgDetailsDialogOpen] = useState(false);
  const [viewingOrganization, setViewingOrganization] = useState<any>(null);
  

  
  // Map Preview Dialog state
  const [mapPreviewOpen, setMapPreviewOpen] = useState(false);
  const [previewingRequest, setPreviewingRequest] = useState<any>(null);

  // New states for Spatial Permission Sub-tabs
  const [spatialSubTab, setSpatialSubTab] = useState("spatial-access");
  const [spatialAccessPendingSearch, setSpatialAccessPendingSearch] = useState("");
  const [spatialAccessPendingDateRange, setSpatialAccessPendingDateRange] = useState({ from: "", to: "" });
  const [spatialAccessCompletedSearch, setSpatialAccessCompletedSearch] = useState("");
  const [spatialAccessCompletedDateRange, setSpatialAccessCompletedDateRange] = useState({ from: "", to: "" });
  const [userAccessSubPendingSearch, setUserAccessSubPendingSearch] = useState("");
  const [userAccessSubPendingDateRange, setUserAccessSubPendingDateRange] = useState({ from: "", to: "" });
  const [userAccessSubCompletedSearch, setUserAccessSubCompletedSearch] = useState("");
  const [userAccessSubCompletedDateRange, setUserAccessSubCompletedDateRange] = useState({ from: "", to: "" });
  const [spatialOpenAccordion, setSpatialOpenAccordion] = useState<string | undefined>("pending");

  
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
    <div className="min-h-screen bg-[#F5F7FA] px-[24px] py-[20px]">
      <div className="w-full space-y-6">
        <PageHeader 
          title="Request 1"
          description="Manage data access workflows"
        />

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-4 gap-6">
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
              .status-badge { padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 500; text-transform: capitalize; letter-spacing: 0.3px; width: fit-content; display: inline-flex; align-items: center; justify-content: center; background: #E6F5EA; color: #1E7E34; }
              .status-badge.created-green { background: #E6F5EA !important; color: #1E7E34 !important; }
              .status-badge.pending { background: #E6F5EA !important; color: #1E7E34 !important; }
              .status-badge.forwarded { background: #E6F5EA !important; color: #1E7E34 !important; }

              /* New Scrollable Table Styles */
              .scrollable-table-container { 
                width: 100%; 
                overflow-x: auto; 
                position: relative;
                scrollbar-width: none; /* Firefox */
                -ms-overflow-style: none; /* IE/Edge */
                border-radius: 10px;
                background: white;
              }
              .scrollable-table-container::-webkit-scrollbar { 
                display: none; /* Chrome, Safari */
              }
              
              .org-completed-table, .dept-pending-table, .user-requests-table { 
                width: 100%; 
                border-collapse: collapse; 
                table-layout: auto;
              }
              
              .org-completed-table thead tr, .dept-pending-table thead tr, .user-requests-table thead tr {
                background: #E6E6E6;
              }

              .org-completed-table th, .dept-pending-table th, .user-requests-table th {
                background: transparent; 
                padding: 12px 15px;
                font-size: 13px;
                font-weight: 600;
                color: #2B2B2B;
                text-align: left;
                position: sticky;
                top: 0;
                z-index: 2;
                white-space: nowrap;
              }
              
              .org-completed-table td, .dept-pending-table td, .user-requests-table td {
                padding: 12px 15px;
                font-size: 13px;
                color: #374151;
                border-bottom: 1px solid #F0F0F0;
                vertical-align: middle;
                text-align: left;
                background: inherit;
              }

              /* 16px Left/Right Padding for the table */
              .org-completed-table th:first-child, .org-completed-table td:first-child,
              .dept-pending-table th:first-child, .dept-pending-table td:first-child,
              .user-requests-table th:first-child, .user-requests-table td:first-child {
                padding-left: 16px !important;
              }
              .org-completed-table th:last-child, .org-completed-table td:last-child,
              .dept-pending-table th:last-child, .dept-pending-table td:last-child,
              .user-requests-table th:last-child, .user-requests-table td:last-child {
                padding-right: 16px !important;
              }
              
              .org-completed-table tr:hover, .dept-pending-table tr:hover, .user-requests-table tr.parent-row:hover { background: #f9fafb; }
              .org-completed-table tr:hover td, .dept-pending-table tr:hover td, .user-requests-table tr.parent-row:hover td { background: #f9fafb; }
              
              .user-requests-table tr.parent-row.is-expanded { background: #F9FAFB; }
              .user-requests-table tr.parent-row.is-expanded td { background: #F9FAFB !important; }
              .user-requests-table tr.expanded-row td { padding: 0 !important; border-bottom: none !important; }
              
              .member-details-container {
                background: #F9FAFB;
                border-top: 1px solid #F0F0F0;
                padding-bottom: 20px;
              }
              
              /* Sticky Columns */
              .org-completed-table .sticky-col-id, .dept-pending-table .sticky-col-id, .user-requests-table .sticky-col-id { 
                position: sticky; 
                left: 0; 
                z-index: 3; 
                background: inherit;
              }
              
              .org-completed-table .sticky-col-status, .dept-pending-table .sticky-col-actions, .user-requests-table .sticky-col-actions { 
                position: sticky; 
                right: 0; 
                z-index: 3; 
                background: inherit;
                text-align: left;
              }
              
              /* Re-enforce header background for sticky columns to prevent overlap issues */
              .org-completed-table thead th.sticky-col-id,
              .org-completed-table thead th.sticky-col-status,
              .dept-pending-table thead th.sticky-col-id,
              .dept-pending-table thead th.sticky-col-actions,
              .user-requests-table thead th.sticky-col-id,
              .user-requests-table thead th.sticky-col-actions {
                background: #E6E6E6 !important;
              }
              
              /* Data row sticky columns should inherit the row's background (white or hover color) */
              .org-completed-table tbody td.sticky-col-id,
              .org-completed-table tbody td.sticky-col-status,
              .dept-pending-table tbody td.sticky-col-id,
              .dept-pending-table tbody td.sticky-col-actions,
              .user-requests-table tbody td.sticky-col-id,
              .user-requests-table tbody td.sticky-col-actions {
                background: white;
              }
              
              .org-completed-table tr:hover td.sticky-col-id,
              .org-completed-table tr:hover td.sticky-col-status,
              .dept-pending-table tr:hover td.sticky-col-id,
              .dept-pending-table tr:hover td.sticky-col-actions,
              .user-requests-table tr.parent-row:hover td.sticky-col-id,
              .user-requests-table tr.parent-row:hover td.sticky-col-actions,
              .user-requests-table tr.parent-row.is-expanded td.sticky-col-id,
              .user-requests-table tr.parent-row.is-expanded td.sticky-col-actions {
                background: #f9fafb !important;
              }
              
              .org-completed-table .col-org, .dept-pending-table .col-org { white-space: nowrap; }
              .org-completed-table .col-submitted, .dept-pending-table .col-submitted { white-space: nowrap; }
              .org-completed-table .col-date, .dept-pending-table .col-date { white-space: nowrap; }
              
              .org-completed-table .col-desc, .dept-pending-table .col-desc { 
                max-width: 260px; 
              }

              .business-desc-cell {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                line-height: 1.5;
                font-size: 13px;
              }

              .custom-tabs-container {
                display: flex !important;
                justify-content: flex-start !important;
                gap: 12px !important;
                border-bottom: none !important;
                padding-left: 0 !important;
              }

              .tab-item {
                color: #6B7280 !important;
                font-weight: 500 !important;
                padding: 8px 24px !important;
                border-radius: 10px !important;
                transition: all 0.3s !important;
                background: transparent !important;
                border: none !important;
                font-size: 14px !important;
              }

              .tab-item[data-state="active"] {
                background-color: #ED1C24 !important;
                color: white !important;
                box-shadow: 0 4px 12px rgba(237, 28, 36, 0.2) !important;
              }

              .sub-tabs-container {
                display: flex;
                gap: 20px;
                border-bottom: 1px solid #E5E7EB;
                margin-bottom: 24px;
                padding-bottom: 0;
              }
              .sub-tab-item {
                padding: 8px 12px;
                font-size: 14px;
                font-weight: 500;
                color: #6B7280;
                cursor: pointer;
                position: relative;
                transition: all 0.2s;
              }
              .sub-tab-item:hover {
                color: #111827;
              }
              .sub-tab-item.active {
                color: #111827;
                font-weight: 600;
              }
              .sub-tab-item.active::after {
                content: '';
                position: absolute;
                bottom: -1px;
                left: 0;
                right: 0;
                height: 2px;
                background-color: #EF4444;
              }

              /* Reviewer Overrides to completely remove the Actions column */
              ${isReviewer ? `
                th.sticky-col-actions, 
                th.grp-sticky-actions,
                td.sticky-col-actions,
                td.grp-sticky-actions,
                .request-table-header > div:last-child, 
                .request-table-row > div:last-child { 
                  display: none !important; 
                }
                .request-table-header, .request-table-row {
                  grid-template-columns: 160px 200px 120px 200px 180px 160px 1fr !important;
                }
              ` : ''}
            `}</style>
            <div className="mb-6 w-full overflow-x-auto custom-scrollbar pb-1">
              <TabsList className="custom-tabs-container bg-transparent flex-nowrap justify-start h-auto w-max py-1">
                {showOrgTab && <TabsTrigger value="organization-creator" className="tab-item tab whitespace-nowrap">Organization</TabsTrigger>}
                {showDeptTab && <TabsTrigger value="department" className="tab-item tab whitespace-nowrap">Department</TabsTrigger>}
                <TabsTrigger value="user-request" className="tab-item tab whitespace-nowrap">User Request</TabsTrigger>
                <TabsTrigger value="data-access" className="tab-item tab whitespace-nowrap">Data Access</TabsTrigger>
                <TabsTrigger value="spatial-permission" className="tab-item tab whitespace-nowrap">Spatial Permission</TabsTrigger>
                <TabsTrigger value="department-2" className="tab-item tab whitespace-nowrap">Services Creation</TabsTrigger>
                <TabsTrigger value="data-download" className="tab-item tab whitespace-nowrap">Data Download</TabsTrigger>
                <TabsTrigger value="metadata" className="tab-item tab whitespace-nowrap">Metadata</TabsTrigger>
                <TabsTrigger value="app-users" className="tab-item tab whitespace-nowrap">Application Users</TabsTrigger>
              </TabsList>
            </div>
            
            {/* Organization/Creator Tab */}
            <TabsContent value="organization-creator">
              <Tabs defaultValue="org-completed">
                {/* Secondary line tabs */}
                <div className="flex items-center justify-between border-b border-[#E5E7EB] mb-4 pr-1">
<TabsList className="bg-transparent h-auto p-0 gap-0">
  <TabsTrigger
                      value="org-completed"
                      className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#10B981] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#10B981] after:opacity-0 data-[state=active]:after:opacity-100"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#10B981]"></span>
                        Completed
                      </span>
                    </TabsTrigger>
</TabsList>


<TabsContent value="org-completed" className="mt-0 !m-0 p-0 border-0 flex-1 flex justify-end" tabIndex={-1}>
    <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="relative" style={{minWidth:'220px',maxWidth:'320px',flex:1}}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search completed requests..."
            value={orgCompletedSearch}
            onChange={(e) => setOrgCompletedSearch(e.target.value)}
            className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={orgCompletedDateRange.from}
              onChange={(e) => setOrgCompletedDateRange({ ...orgCompletedDateRange, from: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={orgCompletedDateRange.to}
              onChange={(e) => setOrgCompletedDateRange({ ...orgCompletedDateRange, to: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>
</div>
                <TabsContent value="org-completed" className="mt-0">
                  
<div className="scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">

                        <table className="org-completed-table">
                          <thead>
                            <tr>
                              <th className="sticky-col-id">Request ID</th>
                              <th className="col-org">Organization</th>
                              <th className="col-submitted">Submitted By</th>
                              <th className="col-date">Completed Date</th>
                              <th className="col-desc">Business Description</th>
                              <th className="sticky-col-status">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {filteredCompletedRequests.filter(r => !orgCompletedSearch || r.id.toLowerCase().includes(orgCompletedSearch.toLowerCase()) || r.organization.toLowerCase().includes(orgCompletedSearch.toLowerCase()) || r.submittedBy.toLowerCase().includes(orgCompletedSearch.toLowerCase())).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    {request.id}
                                  </td>
                                  <td className="col-org">
                                    {request.organization}
                                  </td>
                                  <td className="col-submitted">
                                    {request.submittedBy}
                                  </td>
                                  <td className="col-date font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      05 Mar 2025
                                    </div>
                                  </td>
                                  <td className="col-desc">
                                    <div className="business-desc-cell">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="cursor-help">{request.description}</span>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-800 text-white text-xs p-2 max-w-[300px]">
                                          {request.description}
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                  </td>
                                  <td className="sticky-col-status">
                                    <span className="status-badge created-green">Created</span>
                                  </td>
                                </tr>
                              ))}
                            </TooltipProvider>
                          </tbody>
                        </table>
</div>
</TabsContent>
              </Tabs>
            </TabsContent>

            {/* Department Tab */}
            <TabsContent value="department">
              <Tabs defaultValue="dept-pending">
                {/* Secondary line tabs */}
                <div className="flex items-center justify-between border-b border-[#E5E7EB] mb-4 pr-1">
<TabsList className="bg-transparent h-auto p-0 gap-0">
  <TabsTrigger value="dept-pending" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#EF4444] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#EF4444] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>Pending</span>
                    </TabsTrigger>
                    <TabsTrigger value="dept-completed" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#10B981] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#10B981] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span>Completed</span>
                    </TabsTrigger>
</TabsList>

<TabsContent value="dept-completed" className="mt-0 !m-0 p-0 border-0 flex-1 flex justify-end" tabIndex={-1}>
    <div className="flex items-center gap-4 w-[600px] justify-end">
        <div className="w-[65%] relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <input
                          type="text"
                          placeholder="Search completed requests..."
                          value={orgCompletedSearch}
                          onChange={(e) => setOrgCompletedSearch(e.target.value)}
                          className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
                        />
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="relative flex-1">
                          <input type="text" placeholder="dd-mm-yyyy" className="w-full px-3 bg-white border border-[#E5E7EB] rounded-[10px] h-[36px] text-[14px]" />
                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        </div>
                      </div>
    </div>
</TabsContent>

<TabsContent value="dept-pending" className="mt-0 !m-0 p-0 border-0 flex-1 flex justify-end" tabIndex={-1}>
    <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="relative" style={{minWidth:'220px',maxWidth:'320px',flex:1}}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search pending requests..."
            value={deptPendingSearch}
            onChange={(e) => setDeptPendingSearch(e.target.value)}
            className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={deptPendingDateRange.from}
              onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, from: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={deptPendingDateRange.to}
              onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, to: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>
</div>
                <TabsContent value="dept-pending" className="mt-0">
                  
<div className="scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">

                        <table className="dept-pending-table">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Department</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Type</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Organization</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Submitted By</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Business Description</th>
                              <th className="sticky-col-actions text-[11px] font-bold text-[#6B7280] text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {filteredDeptPending.filter(r => !deptPendingSearch || r.id.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.department?.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.organization?.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.submittedBy.toLowerCase().includes(deptPendingSearch.toLowerCase())).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827] whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap">{request.department}</td>
                                  <td className="whitespace-nowrap">{request.type}</td>
                                  <td className="whitespace-nowrap">{request.organization}</td>
                                  <td className="font-medium whitespace-nowrap">{request.submittedBy}</td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.requestedDate}
                                    </div>
                                  </td>
                                  <td className="col-desc">
                                    <div className="business-desc-cell max-w-[200px] truncate">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="cursor-help whitespace-nowrap overflow-hidden text-ellipsis block">{request.businessDescription}</span>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-800 text-white text-xs p-2 max-w-[300px]">
                                          {request.businessDescription}
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                  </td>
                                  <td className="sticky-col-actions">
                                  {isOrgAdmin ? (
                                    <div className="flex justify-center items-center h-full w-full">
                                      <span className={`inline-flex items-center justify-center px-3 py-1.5 min-w-[80px] text-[12px] font-semibold rounded-full capitalize shadow-sm transition-all duration-300 ${request?.status?.toLowerCase() === 'pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20' : 'bg-[#003F72]/10 text-[#003F72] border border-[#003F72]/20'}`}>
                                          {request?.status || "Pending"}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-end gap-2">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button 
                                            className="flex items-center justify-center w-8 h-8 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 rounded-full transition-colors font-bold border border-[#10B981]/20" 
                                            onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}
                                          >
                                            ✓
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Approve</TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button 
                                            className="flex items-center justify-center w-8 h-8 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 rounded-full transition-colors font-bold border border-[#EF4444]/20" 
                                            onClick={(e) => { e.stopPropagation(); setRejectDialog({open: true, requestId: request.id}); }}
                                          >
                                            ✕
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Reject</TooltipContent>
                                      </Tooltip>
                                    </div>
                                  )}
                                </td>
                                </tr>
                              ))}
                            </TooltipProvider>
                          </tbody>
                        </table>
                      
</div>
</TabsContent>

                {/* Organization Completed Accordion (Reused in Department Tab) */}
                <TabsContent value="dept-completed" className="mt-0">
  <div className="pb-6 pt-2">
    <div className="scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                        <table className="org-completed-table">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Department</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Type</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Organization</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approver</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approved Date</th>
                              <th className="sticky-col-status text-left text-[11px] font-bold text-[#6B7280]">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredDeptCompleted.map((request) => (
                              <tr key={request.id}>
                                <td className="sticky-col-id font-medium text-[#111827]">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
                                    {request.id}
                                  </div>
                                </td>
                                <td className="whitespace-nowrap">{request.department}</td>
                                <td className="whitespace-nowrap">{request.type}</td>
                                <td className="whitespace-nowrap">{request.organization}</td>
                                <td className="font-medium text-[#111827] whitespace-nowrap">{request.approver}</td>
                                <td className="font-medium whitespace-nowrap">
                                  <div className="flex items-center gap-2 text-[#374151]">
                                    <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                    {request.approvedDate}
                                  </div>
                                </td>
                                <td className="sticky-col-status">
                                  <span className="status-badge created-green">{request.status}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    
  </div>
</TabsContent>
              </Tabs>
            </TabsContent>

            {/* User Request Tab */}
            <TabsContent value="user-request">
              <Tabs defaultValue="user-pending">
                {/* Secondary line tabs */}
                <div className="flex items-center justify-between border-b border-[#E5E7EB] mb-4 pr-1">
<TabsList className="bg-transparent h-auto p-0 gap-0">
  <TabsTrigger value="user-pending" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#EF4444] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#EF4444] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>Pending</span>
                    </TabsTrigger>
                    <TabsTrigger value="user-completed" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#10B981] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#10B981] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span>Completed</span>
                    </TabsTrigger>
</TabsList>


<TabsContent value="user-pending" className="mt-0 !m-0 p-0 border-0 flex-1 flex justify-end" tabIndex={-1}>
    <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="relative" style={{minWidth:'220px',maxWidth:'320px',flex:1}}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search pending requests..."
            value={userRequestPendingSearch}
            onChange={(e) => setUserRequestPendingSearch(e.target.value)}
            className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={userRequestPendingDateRange.from}
              onChange={(e) => setUserRequestPendingDateRange({ ...userRequestPendingDateRange, from: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={userRequestPendingDateRange.to}
              onChange={(e) => setUserRequestPendingDateRange({ ...userRequestPendingDateRange, to: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>
<TabsContent value="user-completed" className="mt-0 !m-0 p-0 border-0 flex-1 flex justify-end" tabIndex={-1}>
    <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="relative" style={{minWidth:'220px',maxWidth:'320px',flex:1}}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search completed requests..."
            value={userRequestCompletedSearch}
            onChange={(e) => setUserRequestCompletedSearch(e.target.value)}
            className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={userRequestCompletedDateRange.from}
              onChange={(e) => setUserRequestCompletedDateRange({ ...userRequestCompletedDateRange, from: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={userRequestCompletedDateRange.to}
              onChange={(e) => setUserRequestCompletedDateRange({ ...userRequestCompletedDateRange, to: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>
</div>
                
                <TabsContent value="user-pending" className="mt-0">
                  
<div className="scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white" style={{position:'relative'}}>

                        <style>{`
                          .user-group-table { width: 100%; border-collapse: collapse; table-layout: auto; }
                          .user-group-table thead tr { background: #E6E6E6; }
                          .user-group-table th {
                            background: transparent; padding: 12px 15px; font-size: 13px; font-weight: 600;
                            color: #2B2B2B; text-align: left; position: sticky; top: 0; z-index: 2; white-space: nowrap;
                          }
                          .user-group-table td { padding: 12px 15px; font-size: 13px; color: #374151; border-bottom: 1px solid #F0F0F0; vertical-align: middle; text-align: left; background: inherit; }
                          .user-group-table th:first-child, .user-group-table td:first-child { padding-left: 16px !important; }
                          .user-group-table th:last-child, .user-group-table td:last-child { padding-right: 16px !important; }
                          .user-group-table .grp-sticky-id { position: sticky; left: 0; z-index: 3; background: inherit; }
                          .user-group-table .grp-sticky-expand { position: sticky; left: 0; z-index: 3; background: inherit; width: 40px; padding-right: 0 !important; }
                          .user-group-table .grp-sticky-actions { position: sticky; right: 0; z-index: 3; background: inherit; text-align: right; }
                          .user-group-table tbody tr { transition: background 0.15s; }
                          .user-group-table tbody tr:hover td { background: #F9FAFB; }
                          .user-group-table tbody tr.is-expanded td { background: #F9FAFB; }
                          .user-group-table .expanded-content-row td { padding: 0 !important; border-bottom: 2px solid #E5E7EB !important; background: #F9FAFB !important; }
                          .nested-member-table { width: 100%; border-collapse: collapse; table-layout: auto; background: #FFFFFF; }
                          .nested-member-table thead tr { background: #FFFFFF; }
                          .nested-member-table th { background: #FFFFFF; padding: 14px 16px; font-size: 13px; font-weight: 500; color: #2B2B2B; text-align: left !important; vertical-align: middle; white-space: nowrap; border-bottom: 1px solid #F1F5F9; }
                          .nested-member-table th:first-child { padding-left: 20px !important; }
                          .nested-member-table th:last-child { padding-right: 20px !important; }
                          .nested-member-table td { padding: 0 16px; height: 60px; font-size: 13px; font-weight: 400; color: #374151; border-bottom: 1px solid #F1F5F9; vertical-align: middle; text-align: left !important; background: #FFFFFF; }
                          .nested-member-table td:first-child { padding-left: 20px !important; }
                          .nested-member-table td:last-child { padding-right: 20px !important; }
                          .nested-member-table tbody tr:last-child td { border-bottom: none; }
                          .nested-member-table tbody tr:hover td { background: #F9FAFB; }
                          .role-chip { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-weight: 600; }
                          .name-cell { display: flex; align-items: center; justify-content: flex-start; gap: 12px; }
                          .expand-btn { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 8px; border: 1px solid #E5E7EB; background: white; cursor: pointer; color: #6B7280; transition: all 0.15s; }
                          .expand-btn:hover { background: #F3F4F6; color: #374151; }
                          .expand-btn.active { background: #EFF6FF; border-color: #BFDBFE; color: #3B82F6; }
                        `}</style>

                        <table className="user-group-table">
                          <thead>
                            <tr>
                              <th className="grp-sticky-expand" style={{width:'44px'}}></th>
                              <th className="grp-sticky-id" style={{left:'44px'}}>Group ID</th>
                              <th>Users</th>
                              <th>Requested Date</th>
                              <th>Requested By</th>
                              <th>Uploaded File</th>
                              <th className="grp-sticky-actions">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {userRequestGroups.map((group) => (
                                <React.Fragment key={group.id}>
                                  <tr className={expandedGroupRow === group.id ? 'is-expanded' : ''}>
                                    {/* Expand Button */}
                                    <td className="grp-sticky-expand" style={{left:'0', width:'44px', paddingRight:'0'}}>
                                      <button
                                        className={`expand-btn ${expandedGroupRow === group.id ? 'active' : ''}`}
                                        onClick={() => setExpandedGroupRow(expandedGroupRow === group.id ? null : group.id)}
                                        title={expandedGroupRow === group.id ? 'Collapse' : 'Expand members'}
                                      >
                                        {expandedGroupRow === group.id
                                          ? <ChevronUp className="w-3.5 h-3.5" />
                                          : <ChevronDown className="w-3.5 h-3.5" />}
                                      </button>
                                    </td>

                                    {/* Group ID - sticky */}
                                    <td className="grp-sticky-id font-semibold text-[#111827] whitespace-nowrap" style={{left:'44px'}}>
                                      <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full"></div>
                                        {group.id}
                                      </div>
                                    </td>

                                    {/* Users count */}
                                    <td className="whitespace-nowrap">
                                      <div className="flex items-center gap-2 text-[#374151]">
                                        <div className="flex items-center justify-center w-7 h-7 bg-[#EFF6FF] rounded-full border border-[#BFDBFE]">
                                          <Users className="w-3.5 h-3.5 text-[#3B82F6]" />
                                        </div>
                                        <span className="font-medium">{group.usersCount} Users</span>
                                      </div>
                                    </td>

                                    {/* Requested Date */}
                                    <td className="whitespace-nowrap">
                                      <div className="flex items-center gap-2 text-[#374151]">
                                        <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                        {group.dateCreated}
                                      </div>
                                    </td>

                                    {/* Requested By */}
                                    <td className="font-medium whitespace-nowrap text-[#374151]">
                                      {group.users[0]?.name}
                                    </td>

                                    {/* Uploaded File */}
                                    <td className="whitespace-nowrap">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            className="flex items-center gap-2 px-3 py-1.5 bg-[#F5F6F8] hover:bg-[#E5E7EB] rounded-lg border border-[#E5E7EB] text-[12px] font-medium text-[#374151] transition-colors"
                                            onClick={() => setFileViewerOpen({open: true, fileName: group.fileName, fileSize: group.fileSize})}
                                          >
                                            <FileText className="w-3.5 h-3.5 text-[#EF4444]" />
                                            <span className="max-w-[100px] truncate">{group.fileName}</span>
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-800 text-white text-xs">
                                          {group.fileName} — {group.fileSize}
                                        </TooltipContent>
                                      </Tooltip>
                                    </td>

                                    {/* Actions - sticky right */}
                                    <td className="grp-sticky-actions">
                                      <div className="flex items-center justify-end gap-2">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button 
                                              className="flex items-center justify-center w-8 h-8 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 rounded-full transition-colors font-bold border border-[#10B981]/20"
                                              onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: group.id}); }}
                                            >
                                              ✓
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent className="bg-gray-800 text-white text-xs">Approve</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button 
                                              className="flex items-center justify-center w-8 h-8 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 rounded-full transition-colors font-bold border border-[#EF4444]/20"
                                              onClick={(e) => { e.stopPropagation(); setRejectDialog({open: true, requestId: group.id}); }}
                                            >
                                              ✕
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent className="bg-gray-800 text-white text-xs">Reject</TooltipContent>
                                        </Tooltip>
                                      </div>
                                    </td>
                                  </tr>

                                  {/* Expanded Members Row */}
                                  {expandedGroupRow === group.id && (
                                    <tr className="expanded-content-row">
                                      <td colSpan={7} style={{padding:'0 !important'}}>
                                        <div style={{animation: 'fadeIn 0.25s ease', padding: '16px 20px 20px 20px', background: '#F9FAFB'}}>
                                          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(-6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
                                          {/* Card Header */}
                                          <div className="flex items-center justify-between mb-4">
                                            <div>
                                              <h4 className="font-semibold text-[14px] text-[#111827]">Group Members</h4>
                                              <p className="text-[12px] text-[#6B7280] mt-0.5">Full list of users included in group <span className="font-semibold text-[#374151]">{group.id}</span></p>
                                            </div>
                                            <span className="px-3 py-1 bg-[#EFF6FF] text-[#3B82F6] border border-[#BFDBFE] rounded-full text-[12px] font-semibold">
                                              {group.usersCount} Members
                                            </span>
                                          </div>

                                          {/* Nested Members Table */}
                                          <div className="rounded-2xl overflow-hidden border border-[#F1F5F9] shadow-sm" style={{background:'#FFFFFF', borderRadius:'16px', padding: '0'}}>
                                            <table className="nested-member-table">
                                              <thead>
                                                <tr>
                                                  <th>Name</th>
                                                  <th>Email</th>
                                                  <th>Role</th>
                                                  <th>Organization</th>
                                                  <th>Department</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {group.users.map((member: any, idx: number) => {
                                                  const roles = member.role.split(',').map((r: string) => r.trim());
                                                  const primaryRole = roles[0];
                                                  const extraCount = roles.length - 1;
                                                  return (
                                                    <tr key={idx}>
                                                      <td style={{textAlign:'left', verticalAlign:'middle'}}>
                                                        <div className="name-cell">
                                                          <div className="w-7 h-7 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#DC2626] text-[11px] font-bold shrink-0">
                                                            {member.name.charAt(0)}
                                                          </div>
                                                          <span className="font-medium text-[#111827] whitespace-nowrap">{member.name}</span>
                                                        </div>
                                                      </td>
                                                      <td className="text-[#6B7280]" style={{textAlign:'left', verticalAlign:'middle'}}>{member.email}</td>
                                                      <td style={{textAlign:'left', verticalAlign:'middle'}}>
                                                        <div className="flex items-center justify-start gap-1.5 flex-wrap">
                                                          <span className="role-chip bg-[#EFF6FF] text-[#3B82F6] border border-[#BFDBFE]">{primaryRole}</span>
                                                          {extraCount > 0 && (
                                                            <button
                                                              className="role-chip bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB] cursor-pointer hover:bg-[#E5E7EB] transition-colors"
                                                              onClick={() => setRolesPopover({open: true, roles: roles, anchor: `${group.id}-${idx}`})}
                                                            >+{extraCount} more</button>
                                                          )}
                                                        </div>
                                                      </td>
                                                      <td className="text-[#374151] whitespace-nowrap" style={{textAlign:'left', verticalAlign:'middle'}}>{member.organization}</td>
                                                      <td className="text-[#374151] whitespace-nowrap" style={{textAlign:'left', verticalAlign:'middle'}}>{member.department}</td>
                                                    </tr>
                                                  );
                                                })}
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              ))}
                            </TooltipProvider>
                          </tbody>
                        </table>
                      
</div>
</TabsContent>

                <TabsContent value="user-completed" className="mt-0">
                  
<div className="scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">

                        <table className="org-completed-table">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Service</th>
                              <th className="text-[11px] font-bold text-[#6B7280]" style={{minWidth: '260px'}}>URL</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approved By</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approved Date</th>
                              <th className="sticky-col-status text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {filteredDeptCompleted.filter(r => !userRequestCompletedSearch || r.id.toLowerCase().includes(userRequestCompletedSearch.toLowerCase()) || r.service.toLowerCase().includes(userRequestCompletedSearch.toLowerCase()) || r.approvedBy.toLowerCase().includes(userRequestCompletedSearch.toLowerCase())).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap">{request.service}</td>
                                  <td style={{minWidth: '260px'}}>
                                    <a href={request.url} target="_blank" rel="noopener noreferrer" className="text-[#3D72A2] hover:underline text-[13px]">
                                      {request.url}...
                                    </a>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.requestedDate}
                                    </div>
                                  </td>
                                  <td className="font-medium">{request.approvedBy}</td>
                                  <td className="font-medium">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.approvedDate}
                                    </div>
                                  </td>
                                  <td className="sticky-col-status">
                                    <span className="status-badge created-green">Active</span>
                                  </td>
                                </tr>
                              ))}
                            </TooltipProvider>
                          </tbody>
                        </table>
                      
</div>
</TabsContent>
              </Tabs>
            </TabsContent>
            {/* Data Access Tab (Duplicated from Department) */}
            <TabsContent value="data-access">
              <Tabs defaultValue="dept-pending">
                {/* Secondary line tabs */}
                <div className="flex items-center justify-between border-b border-[#E5E7EB] mb-4 pr-1">
<TabsList className="bg-transparent h-auto p-0 gap-0">
  <TabsTrigger value="dept-pending" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#EF4444] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#EF4444] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>Pending</span>
                    </TabsTrigger>
                    <TabsTrigger value="dept-forwarded" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#F59E0B] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#F59E0B] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>Forwarded</span>
                    </TabsTrigger>
                    <TabsTrigger value="dept-completed" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#10B981] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#10B981] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span>Completed</span>
                    </TabsTrigger>
</TabsList>

<TabsContent value="dept-completed" className="mt-0 !m-0 p-0 border-0 flex-1 flex justify-end" tabIndex={-1}>
    <div className="flex items-center gap-4 w-[600px] justify-end">
        <div className="w-[65%] relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <input
                          type="text"
                          placeholder="Search completed requests..."
                          value={orgCompletedSearch}
                          onChange={(e) => setOrgCompletedSearch(e.target.value)}
                          className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
                        />
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="relative flex-1">
                          <input type="text" placeholder="dd-mm-yyyy" className="w-full px-3 bg-white border border-[#E5E7EB] rounded-[10px] h-[36px] text-[14px]" />
                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        </div>
                      </div>
    </div>
</TabsContent>

<TabsContent value="dept-pending" className="mt-0 !m-0 p-0 border-0 flex-1 flex justify-end" tabIndex={-1}>
    <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="relative" style={{minWidth:'220px',maxWidth:'320px',flex:1}}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search pending requests..."
            value={deptPendingSearch}
            onChange={(e) => setDeptPendingSearch(e.target.value)}
            className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={deptPendingDateRange.from}
              onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, from: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={deptPendingDateRange.to}
              onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, to: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>
<TabsContent value="dept-forwarded" className="mt-0 !m-0 p-0 border-0 flex-1 flex justify-end" tabIndex={-1}>
    <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="relative" style={{minWidth:'220px',maxWidth:'320px',flex:1}}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search forwarded requests..."
            value={dataAccessForwardedSearch}
            onChange={(e) => setDataAccessForwardedSearch(e.target.value)}
            className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#F59E0B] rounded-[10px] h-[36px] text-[14px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={orgCompletedDateRange.from}
              onChange={(e) => setOrgCompletedDateRange({ ...orgCompletedDateRange, from: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#F59E0B] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={orgCompletedDateRange.to}
              onChange={(e) => setOrgCompletedDateRange({ ...orgCompletedDateRange, to: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#F59E0B] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>
</div>
                
                <TabsContent value="dept-pending" className="mt-0">
                  
<div className="scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">

                        <table className="dept-pending-table">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Service</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Entity</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requester</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="sticky-col-actions text-[11px] font-bold text-[#6B7280] text-center">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {dataAccessPendingRequests.map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td>{request.service}</td>
                                  <td>{request.entity}</td>
                                  <td>{request.requester}</td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.date}
                                    </div>
                                  </td>
                                  <td className="sticky-col-actions">
                                  {isOrgAdmin ? (
                                    <div className="flex justify-center items-center h-full w-full">
                                      <span className={`inline-flex items-center justify-center px-3 py-1.5 min-w-[80px] text-[12px] font-semibold rounded-full capitalize shadow-sm transition-all duration-300 ${request?.status?.toLowerCase() === 'pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20' : 'bg-[#003F72]/10 text-[#003F72] border border-[#003F72]/20'}`}>
                                          {request?.status || "Pending"}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-center gap-2">
                                      {/* Approve ✓ */}
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button 
                                            className="flex items-center justify-center w-8 h-8 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981] hover:text-white rounded-full transition-all duration-300 font-bold border border-[#10B981]/20 shadow-sm"
                                            onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}
                                          >
                                            ✓
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Approve</TooltipContent>
                                      </Tooltip>
                                      
                                      {/* Forward ➜ */}
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button 
                                            className="flex items-center justify-center w-8 h-8 bg-[#003F72]/10 text-[#003F72] hover:bg-[#003F72] hover:text-white rounded-full transition-all duration-300 font-bold border border-[#003F72]/20 shadow-sm"
                                            onClick={(e) => { 
                                              e.stopPropagation(); 
                                              setSelectedForwardRequest(request);
                                              setForwardDialogOpen(true);
                                              setSelectedDataOwners([]);
                                              setForwardNotes("");
                                            }}
                                          >
                                            ➜
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Forward</TooltipContent>
                                      </Tooltip>
                                      
                                      {/* Reject ✕ */}
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button 
                                            className="flex items-center justify-center w-8 h-8 bg-[#ED1C24]/10 text-[#ED1C24] hover:bg-[#ED1C24] hover:text-white rounded-full transition-all duration-300 font-bold border border-[#ED1C24]/20 shadow-sm"
                                            onClick={(e) => { e.stopPropagation(); setRejectDialog({open: true, requestId: request.id}); }}
                                          >
                                            ✕
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Reject</TooltipContent>
                                      </Tooltip>
                                    </div>
                                  )}
                                </td>
                                </tr>
                              ))}
                            </TooltipProvider>
                          </tbody>
                        </table>
                      
</div>
</TabsContent>

                <TabsContent value="dept-forwarded" className="mt-0">
                  
<div className="scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">

                        <table className="dept-pending-table">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280] w-[15%]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280] w-[18%]">Service</th>
                              <th className="text-[11px] font-bold text-[#6B7280] w-[14%]">Requested Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280] w-[14%]">Forward Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280] w-[24%]">Data Owners</th>
                              <th className="text-[11px] font-bold text-[#6B7280] text-center w-[15%]">Workflow Progress</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {dataAccessForwardedRequests.map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td>{request.service}</td>
                                  <td>
                                    <div className="flex items-center gap-2 text-[13px] text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.reqDate}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="flex items-center gap-2 text-[13px] text-[#374151]">
                                      <Forward className="w-3.5 h-3.5 text-[#F59E0B]" />
                                      {request.fwdDate}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="flex flex-wrap gap-1.5 max-w-[250px]">
                                      {request.dataOwners.map((owner: string, idx: number) => (
                                        <span 
                                          key={idx} 
                                          className="inline-flex items-center px-[10px] py-[4px] rounded-full text-[12px] font-medium bg-[#E6F0FA] text-[#3D72A2] transition-colors hover:bg-[#3D72A2]/20"
                                        >
                                          {owner}
                                        </span>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="text-center">
                                    <div className="flex items-center justify-center py-2">
                                      <div className="flex items-center">
                                        {[1, 2, 3, 4].map((step) => {
                                          const isActive = request.progressStage === step;
                                          const isCompleted = request.progressStage > step;
                                          const isFuture = request.progressStage < step;
                                          
                                          return (
                                            <React.Fragment key={step}>
                                              {/* Circle */}
                                              <div 
                                                className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 ${
                                                  isCompleted ? "bg-[#10B981] text-white" : 
                                                  isActive ? "bg-white border-2 border-[#F59E0B] text-[#F59E0B] font-bold text-[11px]" :
                                                  "bg-white border border-[#E5E7EB] text-[#94A3B8] font-bold text-[11px]"
                                                }`}
                                              >
                                                {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step}
                                              </div>
                                              
                                              {/* Line (except for last step) */}
                                              {step < 4 && (
                                                <div 
                                                  className={`w-6 h-[1.5px] transition-all duration-300 ${
                                                    isCompleted || (isActive && request.progressStage > step) ? "bg-[#10B981]" : 
                                                    (isActive && step < 4 && request.progressStage === step) ? "bg-[#E5E7EB]" :
                                                    "bg-[#E5E7EB]"
                                                  }`}
                                                  style={{ 
                                                    background: isCompleted ? "#10B981" : 
                                                               (isActive && step === 3) ? "#E5E7EB" : 
                                                               isFuture ? "#E5E7EB" : 
                                                               (isActive && step < 3) ? "#10B981" : "#E5E7EB" 
                                                  }}
                                                ></div>
                                              )}
                                            </React.Fragment>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </TooltipProvider>
                          </tbody>
                        </table>
                      
</div>
</TabsContent>

                <TabsContent value="dept-completed" className="mt-0">
                  
<div className="scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">

                        <table className="dept-pending-table">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280] w-[15%]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280] w-[18%]">Service</th>
                              <th className="text-[11px] font-bold text-[#6B7280] w-[14%]">Requested Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280] w-[14%]">Approved Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280] w-[24%]">Approved By</th>
                              <th className="text-[11px] font-bold text-[#6B7280] text-center w-[15%]">Workflow Progress</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {dataAccessCompletedRequests.map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td>{request.service}</td>
                                  <td>
                                    <div className="flex items-center gap-2 text-[13px] text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.reqDate}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="flex items-center gap-2 text-[13px] text-[#374151]">
                                      <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
                                      {request.appDate}
                                    </div>
                                  </td>
                                  <td>
                                    <span className="inline-flex items-center px-[10px] py-[4px] rounded-full text-[12px] font-medium bg-[#E6F0FA] text-[#3D72A2]">
                                      {request.approvedBy}
                                    </span>
                                  </td>
                                  <td className="text-center">
                                    <div className="flex items-center justify-center py-2">
                                      <div className="flex items-center">
                                        {[1, 2, 3, 4].map((step) => (
                                          <React.Fragment key={step}>
                                            {/* Circle */}
                                            <div className="w-6 h-6 rounded-full flex items-center justify-center shadow-sm transition-all duration-300 bg-[#10B981] text-white">
                                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                                            </div>
                                            
                                            {/* Line (except for last step) */}
                                            {step < 4 && (
                                              <div className="w-6 h-[1.5px] transition-all duration-300 bg-[#10B981]"></div>
                                            )}
                                          </React.Fragment>
                                        ))}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </TooltipProvider>
                          </tbody>
                        </table>
                      
</div>
</TabsContent>
              </Tabs>
            </TabsContent>

            {/* Spatial Permission Tab */}
            <TabsContent value="spatial-permission">
              {/* Custom Sub-tabs Header */}
              <div className="sub-tabs-container">
                <div 
                  className={`sub-tab-item ${spatialSubTab === 'spatial-access' ? 'active' : ''}`}
                  onClick={() => setSpatialSubTab('spatial-access')}
                >
                  Spatial Access Request
                </div>
                <div 
                  className={`sub-tab-item ${spatialSubTab === 'user-access' ? 'active' : ''}`}
                  onClick={() => setSpatialSubTab('user-access')}
                >
                  User Access Request
                </div>
              </div>

              {/* Sub-tab Content */}
              <Tabs defaultValue="pending">
                {/* Secondary line tabs */}
                <div className="flex items-center justify-between border-b border-[#E5E7EB] mb-4 pr-1">
<TabsList className="bg-transparent h-auto p-0 gap-0">
  <TabsTrigger value="pending" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#EF4444] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#EF4444] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>Pending</span>
                    </TabsTrigger>
                    <TabsTrigger value="completed" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#10B981] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#10B981] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span>Completed</span>
                    </TabsTrigger>
</TabsList>

<TabsContent value="pending" className="mt-0 !m-0 p-0 border-0 flex-1 flex justify-end" tabIndex={-1}>
    <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="relative" style={{minWidth:'200px',maxWidth:'280px',flex:1}}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search pending requests..."
            value={spatialSubTab === 'spatial-access' ? spatialAccessPendingSearch : userAccessSubPendingSearch}
            onChange={(e) => spatialSubTab === 'spatial-access' ? setSpatialAccessPendingSearch(e.target.value) : setUserAccessSubPendingSearch(e.target.value)}
            className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px]"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={spatialSubTab === 'spatial-access' ? spatialAccessPendingDateRange.from : userAccessSubPendingDateRange.from}
              onChange={(e) => spatialSubTab === 'spatial-access' ? setSpatialAccessPendingDateRange({...spatialAccessPendingDateRange, from: e.target.value}) : setUserAccessSubPendingDateRange({...userAccessSubPendingDateRange, from: e.target.value})}
              className="w-[120px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={spatialSubTab === 'spatial-access' ? spatialAccessPendingDateRange.to : userAccessSubPendingDateRange.to}
              onChange={(e) => spatialSubTab === 'spatial-access' ? setSpatialAccessPendingDateRange({...spatialAccessPendingDateRange, to: e.target.value}) : setUserAccessSubPendingDateRange({...userAccessSubPendingDateRange, to: e.target.value})}
              className="w-[120px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>
<TabsContent value="completed" className="mt-0 !m-0 p-0 border-0 flex-1 flex justify-end" tabIndex={-1}>
    <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="relative" style={{minWidth:'200px',maxWidth:'280px',flex:1}}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search completed requests..."
            value={spatialSubTab === 'spatial-access' ? spatialAccessCompletedSearch : userAccessSubCompletedSearch}
            onChange={(e) => spatialSubTab === 'spatial-access' ? setSpatialAccessCompletedSearch(e.target.value) : setUserAccessSubCompletedSearch(e.target.value)}
            className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={spatialSubTab === 'spatial-access' ? spatialAccessCompletedDateRange.from : userAccessSubCompletedDateRange.from}
              onChange={(e) => spatialSubTab === 'spatial-access' ? setSpatialAccessCompletedDateRange({...spatialAccessCompletedDateRange, from: e.target.value}) : setUserAccessSubCompletedDateRange({...userAccessSubCompletedDateRange, from: e.target.value})}
              className="w-[120px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={spatialSubTab === 'spatial-access' ? spatialAccessCompletedDateRange.to : userAccessSubCompletedDateRange.to}
              onChange={(e) => spatialSubTab === 'spatial-access' ? setSpatialAccessCompletedDateRange({...spatialAccessCompletedDateRange, to: e.target.value}) : setUserAccessSubCompletedDateRange({...userAccessSubCompletedDateRange, to: e.target.value})}
              className="w-[120px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>
</div>
                
                <TabsContent value="pending" className="mt-0">
  <div className="pb-6 pt-2">
    <div className="scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                        <table className="dept-pending-table">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280] w-[15%]">Request ID</th>
                              {spatialSubTab === 'spatial-access' ? (
                                <>
                                  <th className="text-[11px] font-bold text-[#6B7280] w-[15%]">Permission Name</th>
                                  <th className="text-[11px] font-bold text-[#6B7280] w-[15%]">Coverage / Attributes</th>
                                  <th className="text-[11px] font-bold text-[#6B7280] w-[25%]">Layers / Boundary</th>
                                  <th className="text-[11px] font-bold text-[#6B7280] w-[15%]">Requested Date</th>
                                </>
                              ) : (
                                <>
                                  <th className="text-[11px] font-bold text-[#6B7280] w-[15%]">User Details</th>
                                  <th className="text-[11px] font-bold text-[#6B7280] w-[25%]">Permission / Dept</th>
                                  <th className="text-[11px] font-bold text-[#6B7280] w-[15%]">Change Type</th>
                                  <th className="text-[11px] font-bold text-[#6B7280] w-[15%]">Date</th>
                                </>
                              )}
                              <th className="sticky-col-actions">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(spatialSubTab === 'spatial-access' ? spatialAccessPendingRequests : userAccessSubPendingRequests).filter((r: any) => {
                              const search = spatialSubTab === 'spatial-access' ? spatialAccessPendingSearch : userAccessSubPendingSearch;
                              return !search || r.id.toLowerCase().includes(search.toLowerCase()) || (r.department && r.department.toLowerCase().includes(search.toLowerCase())) || (r.permissionName && r.permissionName.toLowerCase().includes(search.toLowerCase()));
                            }).map((request: any) => (
                              <tr key={request.id}>
                                <td className="sticky-col-id font-medium text-[#111827]">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                                    {request.id}
                                  </div>
                                </td>
                                {spatialSubTab === 'spatial-access' ? (
                                  <>
                                    <td className="font-medium text-[#111827]">{request.permissionName}</td>
                                    <td>
                                      <div className="flex flex-wrap gap-2">
                                        {request.coverage.split(',').map((item: string, idx: number) => (
                                          <span key={idx} className="inline-flex items-center px-[10px] py-[4px] rounded-full text-[12px] font-medium bg-[#E6F0FA] text-[#3D72A2]">
                                            {item.trim()}
                                          </span>
                                        ))}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center border border-[#BFDBFE]">
                                          <Map className="w-4 h-4 text-[#3B82F6]" />
                                        </div>
                                        <span className="text-[13px]">{request.layers}</span>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="flex items-center gap-2 text-[#374151]">
                                        <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                        {request.date}
                                      </div>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                  <td>
                                    <div className="flex flex-col gap-0.5">
                                      <span className="font-medium text-[#111827]">{request.userDetails}</span>
                                      <span className="text-[11px] text-[#6B7280]">{request.email}</span>
                                    </div>
                                  </td>
                                  <td className="text-[13px]">{request.permissionDept}</td>
                                  <td>
                                    <span className={`px-2.5 py-1 rounded-full text-[12px] font-medium border ${
                                      request.type === 'Add' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-[#3B82F6]/10 text-[#3B82F6] border-[#3B82F6]/20'
                                    }`}>
                                      {request.type}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.date}
                                    </div>
                                  </td>
                                  </>
                                )}
                                <td className="sticky-col-actions text-right">
                                  {isOrgAdmin ? (
                                    <div className="flex justify-center items-center h-full w-full">
                                      <span className={`inline-flex items-center justify-center px-3 py-1.5 min-w-[80px] text-[12px] font-semibold rounded-full capitalize shadow-sm transition-all duration-300 ${request?.status?.toLowerCase() === 'pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20' : 'bg-[#003F72]/10 text-[#003F72] border border-[#003F72]/20'}`}>
                                          {request?.status || "Pending"}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-end gap-2">
                                    <button 
                                        className="flex items-center justify-center w-8 h-8 bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20 rounded-full transition-colors font-bold border border-[#3B82F6]/20" 
                                        title="View Map"
                                        onClick={() => { setPreviewingRequest(request); setMapPreviewOpen(true); }}
                                      >
                                        🗺️
                                      </button>
                                    {!isReviewer && (
                                      <>
                                        <button 
                                          className="flex items-center justify-center w-8 h-8 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 rounded-full transition-colors font-bold border border-[#10B981]/20" 
                                          title="Approve"
                                          onClick={() => setApproveDialog({open: true, requestId: request.id})}
                                        >
                                          ✓
                                        </button>
                                        <button 
                                          className="flex items-center justify-center w-8 h-8 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 rounded-full transition-colors font-bold border border-[#EF4444]/20" 
                                          title="Reject"
                                          onClick={() => setRejectDialog({open: true, requestId: request.id})}
                                        >
                                          ✕
                                        </button>
                                      </>
                                    )}
                                  </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    
  </div>
</TabsContent>

                <TabsContent value="completed" className="mt-0">
  <div className="pb-6 pt-2">
    <div className="scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                        <table className="org-completed-table">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              {spatialSubTab === 'spatial-access' ? (
                                <>
                                  <th className="text-[11px] font-bold text-[#6B7280]">Permission Name</th>
                                  <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                                  <th className="text-[11px] font-bold text-[#6B7280]">Approved Date</th>
                                  <th className="text-[11px] font-bold text-[#6B7280]">Approved By</th>
                                </>
                              ) : (
                                <>
                                  <th className="text-[11px] font-bold text-[#6B7280]">User Details</th>
                                  <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                                  <th className="text-[11px] font-bold text-[#6B7280]">Approved Date</th>
                                  <th className="text-[11px] font-bold text-[#6B7280]">Approved By</th>
                                </>
                              )}
                              <th className="text-[11px] font-bold text-[#6B7280]">Status</th>
                              <th className="sticky-col-actions text-[11px] font-bold text-[#6B7280]">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(spatialSubTab === 'spatial-access' ? spatialAccessCompletedRequests : userAccessSubCompletedRequests).filter((r: any) => {
                              const search = spatialSubTab === 'spatial-access' ? spatialAccessCompletedSearch : userAccessSubCompletedSearch;
                              return !search || r.id.toLowerCase().includes(search.toLowerCase()) || (r.department && r.department.toLowerCase().includes(search.toLowerCase())) || (r.approvedBy && r.approvedBy.toLowerCase().includes(search.toLowerCase())) || (r.permissionName && r.permissionName.toLowerCase().includes(search.toLowerCase()));
                            }).map((request: any) => (
                              <tr key={request.id}>
                                <td className="sticky-col-id font-medium text-[#111827]">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                    {request.id}
                                  </div>
                                </td>
                                {spatialSubTab === 'spatial-access' ? (
                                  <>
                                    <td className="font-medium text-[#111827]">{request.permissionName}</td>
                                    <td>
                                      <div className="flex items-center gap-2 text-[#374151] text-[13px]">
                                        <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                        {request.requestedDate}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="flex items-center gap-2 text-[#374151] text-[13px]">
                                        <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
                                        {request.approvedDate}
                                      </div>
                                    </td>
                                    <td className="font-medium text-[#111827]">
                                      <span className="inline-flex items-center px-[10px] py-[4px] rounded-full text-[12px] font-medium bg-[#E6F0FA] text-[#3D72A2]">
                                        {request.approvedBy}
                                      </span>
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <td>
                                      <div className="flex flex-col gap-0.5">
                                        <span className="font-medium text-[#111827]">{request.userDetails}</span>
                                        <span className="text-[11px] text-[#6B7280]">{request.email}</span>
                                      </div>
                                    </td>
                                    <td>
                                      <div className="flex items-center gap-2 text-[#374151] text-[13px]">
                                        <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                        {request.requestedDate}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="flex items-center gap-2 text-[#374151] text-[13px]">
                                        <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
                                        {request.approvedDate}
                                      </div>
                                    </td>
                                    <td className="font-medium text-[#111827]">
                                      <span className="inline-flex items-center px-[10px] py-[4px] rounded-full text-[12px] font-medium bg-[#E6F0FA] text-[#3D72A2]">
                                        {request.approvedBy}
                                      </span>
                                    </td>
                                  </>
                                )}
                                <td>
                                  <span className="status-badge created-green flex items-center justify-center gap-1.5 w-fit whitespace-nowrap">
                                    {spatialSubTab === 'spatial-access' ? (
                                      <>Completed <span className="text-[14px]">✅</span></>
                                    ) : (
                                      'Approved'
                                    )}
                                  </span>
                                </td>
                                <td>
                                  <div className="flex items-center gap-2">
                                    <button 
                                        className="flex items-center justify-center w-8 h-8 bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20 rounded-full transition-colors font-bold border border-[#3B82F6]/20" 
                                        title="View Map"
                                        onClick={() => { setPreviewingRequest(request); setMapPreviewOpen(true); }}
                                      >
                                        🗺️
                                      </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    
  </div>
</TabsContent>
              </Tabs>
            </TabsContent>

            {/* Department-2 Tab (Duplicated) */}
            <TabsContent value="department-2">
              <Tabs defaultValue="dept-pending">
                {/* Secondary line tabs */}
                <div className="flex items-center justify-between border-b border-[#E5E7EB] mb-4 pr-1">
<TabsList className="bg-transparent h-auto p-0 gap-0">
  <TabsTrigger value="dept-pending" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#EF4444] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#EF4444] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>Pending</span>
                    </TabsTrigger>
                    <TabsTrigger value="org-completed" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#10B981] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#10B981] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span>Completed</span>
                    </TabsTrigger>
</TabsList>


<TabsContent value="dept-pending" className="mt-0 !m-0 p-0 border-0 flex-1 flex justify-end" tabIndex={-1}>
    <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="relative" style={{minWidth:'220px',maxWidth:'320px',flex:1}}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search pending requests..."
            value={deptPendingSearch}
            onChange={(e) => setDeptPendingSearch(e.target.value)}
            className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={deptPendingDateRange.from}
              onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, from: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={deptPendingDateRange.to}
              onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, to: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>
<TabsContent value="org-completed" className="mt-0 !m-0 p-0 border-0 flex-1 flex justify-end" tabIndex={-1}>
    <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="relative" style={{minWidth:'220px',maxWidth:'320px',flex:1}}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search completed requests..."
            value={orgCompletedSearch}
            onChange={(e) => setOrgCompletedSearch(e.target.value)}
            className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={orgCompletedDateRange.from}
              onChange={(e) => setOrgCompletedDateRange({ ...orgCompletedDateRange, from: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={orgCompletedDateRange.to}
              onChange={(e) => setOrgCompletedDateRange({ ...orgCompletedDateRange, to: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>
</div>
                
                <TabsContent value="dept-pending" className="mt-0">
                  
<div className="scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">

                        <table className="dept-pending-table">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Service Details</th>
                              <th className="text-[11px] font-bold text-[#6B7280]" style={{minWidth: '280px'}}>Organization / Dept</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Submitted By</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="sticky-col-actions text-[11px] font-bold text-[#6B7280] text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {filteredDeptPending.filter(r => !deptPendingSearch || r.id.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.serviceDetails.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.organizationDept.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.submittedBy.toLowerCase().includes(deptPendingSearch.toLowerCase())).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827] whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap">{request.serviceDetails}</td>
                                  <td style={{minWidth: '280px'}}>{request.organizationDept}</td>
                                  <td className="font-medium whitespace-nowrap">{request.submittedBy}</td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.date}
                                    </div>
                                  </td>
                                  <td className="sticky-col-actions">
                                  {isOrgAdmin ? (
                                    <div className="flex justify-center items-center h-full w-full">
                                      <span className={`inline-flex items-center justify-center px-3 py-1.5 min-w-[80px] text-[12px] font-semibold rounded-full capitalize shadow-sm transition-all duration-300 ${request?.status?.toLowerCase() === 'pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20' : 'bg-[#003F72]/10 text-[#003F72] border border-[#003F72]/20'}`}>
                                          {request?.status || "Pending"}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-end gap-2">
                                      {!isReviewer && (
                                        <>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <button 
                                                className="flex items-center justify-center w-8 h-8 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 rounded-full transition-colors font-bold border border-[#10B981]/20" 
                                                onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}
                                              >
                                                ✓
                                              </button>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Approve</TooltipContent>
                                          </Tooltip>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <button 
                                                className="flex items-center justify-center w-8 h-8 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 rounded-full transition-colors font-bold border border-[#EF4444]/20" 
                                                onClick={(e) => { e.stopPropagation(); setRejectDialog({open: true, requestId: request.id}); }}
                                              >
                                                ✕
                                              </button>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Reject</TooltipContent>
                                          </Tooltip>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </td>
                                </tr>
                              ))}
                            </TooltipProvider>
                          </tbody>
                        </table>
                      
</div>
</TabsContent>

                <TabsContent value="org-completed" className="mt-0">
                  
<div className="scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">

                        <table className="org-completed-table">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Service</th>
                              <th className="text-[11px] font-bold text-[#6B7280]" style={{minWidth: '260px'}}>URL</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approved By</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approved Date</th>
                              <th className="sticky-col-status text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {filteredDeptCompleted.filter(r => !orgCompletedSearch || r.id.toLowerCase().includes(orgCompletedSearch.toLowerCase()) || r.service.toLowerCase().includes(orgCompletedSearch.toLowerCase()) || r.approvedBy.toLowerCase().includes(orgCompletedSearch.toLowerCase())).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap">{request.service}</td>
                                  <td style={{minWidth: '260px'}}>
                                    <a href={request.url} target="_blank" rel="noopener noreferrer" className="text-[#3D72A2] hover:underline text-[13px]">
                                      {request.url}...
                                    </a>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.requestedDate}
                                    </div>
                                  </td>
                                  <td className="font-medium">{request.approvedBy}</td>
                                  <td className="font-medium">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.approvedDate}
                                    </div>
                                  </td>
                                  <td className="sticky-col-status">
                                    <span className="status-badge created-green">Active</span>
                                  </td>
                                </tr>
                              ))}
                            </TooltipProvider>
                          </tbody>
                        </table>
                      
</div>
</TabsContent>
              </Tabs>
            </TabsContent>

            {/* Data Download Tab (Duplicated from Services Creation) */}
            <TabsContent value="data-download">
              <Tabs defaultValue="dept-pending">
                {/* Secondary line tabs */}
                <div className="flex items-center justify-between border-b border-[#E5E7EB] mb-4 pr-1">
<TabsList className="bg-transparent h-auto p-0 gap-0">
  <TabsTrigger value="dept-pending" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#EF4444] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#EF4444] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>Pending</span>
                    </TabsTrigger>
                    <TabsTrigger value="data-download-forwarded" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#F59E0B] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#F59E0B] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>Forwarded</span>
                    </TabsTrigger>
                    <TabsTrigger value="org-completed" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#10B981] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#10B981] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span>Completed</span>
                    </TabsTrigger>
</TabsList>


<TabsContent value="dept-pending" className="mt-0 !m-0 p-0 border-0 flex-1 flex justify-end" tabIndex={-1}>
    <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="relative" style={{minWidth:'220px',maxWidth:'320px',flex:1}}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search pending requests..."
            value={deptPendingSearch}
            onChange={(e) => setDeptPendingSearch(e.target.value)}
            className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={deptPendingDateRange.from}
              onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, from: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={deptPendingDateRange.to}
              onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, to: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>
<TabsContent value="data-download-forwarded" className="mt-0 !m-0 p-0 border-0 flex-1 flex justify-end" tabIndex={-1}>
    <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="relative" style={{minWidth:'220px',maxWidth:'320px',flex:1}}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search forwarded requests..."
            value={dataDownloadForwardedSearch}
            onChange={(e) => setDataDownloadForwardedSearch(e.target.value)}
            className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#F59E0B] rounded-[10px] h-[36px] text-[14px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={dataDownloadForwardedDateRange.from}
              onChange={(e) => setDataDownloadForwardedDateRange({ ...dataDownloadForwardedDateRange, from: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#F59E0B] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={dataDownloadForwardedDateRange.to}
              onChange={(e) => setDataDownloadForwardedDateRange({ ...dataDownloadForwardedDateRange, to: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#F59E0B] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>
<TabsContent value="org-completed" className="mt-0 !m-0 p-0 border-0 flex-1 flex justify-end" tabIndex={-1}>
    <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="relative" style={{minWidth:'220px',maxWidth:'320px',flex:1}}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search completed requests..."
            value={orgCompletedSearch}
            onChange={(e) => setOrgCompletedSearch(e.target.value)}
            className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={orgCompletedDateRange.from}
              onChange={(e) => setOrgCompletedDateRange({ ...orgCompletedDateRange, from: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={orgCompletedDateRange.to}
              onChange={(e) => setOrgCompletedDateRange({ ...orgCompletedDateRange, to: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>
</div>
                
                <TabsContent value="dept-pending" className="mt-0">
                  
<div className="scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">

                        <table className="dept-pending-table">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Dataset</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Format</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requestor</th>
                              <th className="text-[11px] font-bold text-[#6B7280]" style={{minWidth: '240px'}}>Description</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Email</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="sticky-col-actions text-[11px] font-bold text-[#6B7280] text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {dataDownloadPendingRequests.filter(r => !deptPendingSearch || r.id.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.dataset.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.requestor.toLowerCase().includes(deptPendingSearch.toLowerCase())).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827] whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap font-medium">{request.dataset}</td>
                                  <td className="whitespace-nowrap">
                                    <span className="px-2.5 py-1 bg-[#3D72A2]/10 text-[#3D72A2] rounded-full text-[12px] font-medium border border-[#3D72A2]/20">
                                      {request.format}
                                    </span>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">{request.requestor}</td>
                                  <td style={{minWidth: '240px'}}>
                                    <span className="text-[#374151] whitespace-normal inline-block max-w-[220px]">{request.description}</span>
                                  </td>
                                  <td className="whitespace-nowrap">
                                    <a href={"mailto:" + request.email} className="text-[#3D72A2] hover:underline text-[13px] flex items-center">
                                      {request.email} <span className="ml-1 text-[10px]">↗</span>
                                    </a>
                                  </td>
                                  <td className="font-medium whitespace-nowrap text-[#374151]">
                                    {request.date}
                                  </td>
                                  <td className="sticky-col-actions">
                                  {isOrgAdmin ? (
                                    <div className="flex justify-center items-center h-full w-full">
                                      <span className={`inline-flex items-center justify-center px-3 py-1.5 min-w-[80px] text-[12px] font-semibold rounded-full capitalize shadow-sm transition-all duration-300 ${request?.status?.toLowerCase() === 'pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20' : 'bg-[#003F72]/10 text-[#003F72] border border-[#003F72]/20'}`}>
                                          {request?.status || "Pending"}
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-end gap-1.5">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button 
                                            className="flex items-center justify-center w-7 h-7 bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20 rounded-full transition-colors font-bold border border-[#3B82F6]/20 text-[10px]" 
                                            onClick={(e) => { e.stopPropagation(); setPreviewingRequest(request); setMapPreviewOpen(true); }}
                                          >
                                            🗺️
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">View Map</TooltipContent>
                                      </Tooltip>
                                      {!isReviewer && (
                                        <>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <button 
                                                className="flex items-center justify-center w-7 h-7 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 rounded-full transition-colors font-bold border border-[#10B981]/20" 
                                                onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}
                                              >
                                                ✓
                                              </button>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Approve</TooltipContent>
                                          </Tooltip>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <button 
                                                className="flex items-center justify-center w-7 h-7 bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20 rounded-full transition-colors border border-[#F59E0B]/20 font-bold" 
                                                onClick={(e) => { e.stopPropagation(); setSelectedForwardRequest({ ...request, service: request.dataset }); setForwardDialogOpen(true); }}
                                              >
                                                ➜
                                              </button>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Forward</TooltipContent>
                                          </Tooltip>
                                          <Tooltip>
                                            <TooltipTrigger asChild>
                                              <button 
                                                className="flex items-center justify-center w-7 h-7 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 rounded-full transition-colors font-bold border border-[#EF4444]/20" 
                                                onClick={(e) => { e.stopPropagation(); setRejectDialog({open: true, requestId: request.id}); }}
                                              >
                                                ✕
                                              </button>
                                            </TooltipTrigger>
                                            <TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Reject</TooltipContent>
                                          </Tooltip>
                                        </>
                                      )}
                                    </div>
                                  )}
                                </td>
                                </tr>
                              ))}
                            </TooltipProvider>
                          </tbody>
                        </table>
                      
</div>
</TabsContent>

                <TabsContent value="data-download-forwarded" className="mt-0">
                  
<div className="scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">

                        <table className="dept-pending-table">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Dataset</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Product</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requestor</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Forwarded Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Data Owners</th>
                              <th className="sticky-col-status text-right pr-4">Workflow</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {dataDownloadForwardedRequests.filter(r => !dataDownloadForwardedSearch || r.id.toLowerCase().includes(dataDownloadForwardedSearch.toLowerCase()) || r.dataset.toLowerCase().includes(dataDownloadForwardedSearch.toLowerCase()) || r.requestor.toLowerCase().includes(dataDownloadForwardedSearch.toLowerCase()) || r.dataOwners.toLowerCase().includes(dataDownloadForwardedSearch.toLowerCase())).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <div className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap font-medium">{request.dataset}</td>
                                  <td className="whitespace-nowrap">
                                    <span className="px-2.5 py-1 bg-[#6B7280]/10 text-[#4B5563] rounded-full text-[12px] font-medium border border-[#6B7280]/20">
                                      {request.product}
                                    </span>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">{request.requestor}</td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      {request.requestedDate}
                                    </div>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      {request.forwardedDate}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap font-medium text-[#3D72A2]">
                                      {request.dataOwners}
                                  </td>
                                  <td className="sticky-col-status pr-4">
                                    <div className="flex flex-col py-1.5 items-end justify-center w-full">
                                      <div className="flex items-center gap-0 w-fit">
                                        {/* Step 1 */}
                                        <div className="w-[22px] h-[22px] rounded-full bg-[#10B981] flex items-center justify-center text-white z-10 relative">
                                          <Check className="w-3.5 h-3.5 stroke-[3]"/>
                                        </div>
                                        {/* Connecting Line */}
                                        <div className="w-8 h-[2px] bg-[#10B981] -ml-1 -mr-1 z-0"></div>
                                        
                                        {/* Step 2 */}
                                        <div className="w-[22px] h-[22px] rounded-full bg-[#10B981] flex items-center justify-center text-white z-10 relative">
                                          <Check className="w-3.5 h-3.5 stroke-[3]"/>
                                        </div>
                                        {/* Connecting Line */}
                                        <div className="w-8 h-[2px] bg-[#10B981] -ml-1 -mr-1 z-0"></div>
                                        
                                        {/* Step 3 */}
                                        <div className="w-[22px] h-[22px] rounded-full border-[2px] border-[#F59E0B] bg-white flex items-center justify-center text-[#F59E0B] text-[11px] font-bold z-10 relative shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                                          3
                                        </div>
                                        {/* Connecting Line */}
                                        <div className="w-8 h-[2px] bg-[#E5E7EB] -ml-1 -mr-1 z-0"></div>
                                        
                                        {/* Step 4 */}
                                        <div className="w-[22px] h-[22px] rounded-full border border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-center text-[#9CA3AF] text-[11px] font-bold z-10 relative shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                                          4
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </TooltipProvider>
                          </tbody>
                        </table>
                      
</div>
</TabsContent>

                <TabsContent value="org-completed" className="mt-0">
                  
<div className="scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">

                        <table className="org-completed-table">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Dataset</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Format</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requestor</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approved Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approved By</th>
                              <th className="sticky-col-status text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {dataDownloadCompletedRequests.filter(r => !orgCompletedSearch || r.id.toLowerCase().includes(orgCompletedSearch.toLowerCase()) || r.dataset.toLowerCase().includes(orgCompletedSearch.toLowerCase()) || r.requestor.toLowerCase().includes(orgCompletedSearch.toLowerCase()) || r.approvedBy.toLowerCase().includes(orgCompletedSearch.toLowerCase())).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap font-medium">{request.dataset}</td>
                                  <td className="whitespace-nowrap">
                                    <span className="px-2.5 py-1 bg-[#3D72A2]/10 text-[#3D72A2] rounded-full text-[12px] font-medium border border-[#3D72A2]/20">
                                      {request.format}
                                    </span>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">{request.requestor}</td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      {request.requestedDate}
                                    </div>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      {request.approvedDate}
                                    </div>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                      {request.approvedBy}
                                  </td>
                                  <td className="sticky-col-status">
                                    <span className="status-badge created-green flex items-center gap-1.5 w-fit whitespace-nowrap">
                                      Approved
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </TooltipProvider>
                          </tbody>
                        </table>
                      
</div>
</TabsContent>
              </Tabs>
            </TabsContent>

            {/* Metadata Tab */}
            <TabsContent value="metadata">
              <Tabs defaultValue="metadata-pending">
                {/* Secondary line tabs */}
                <div className="flex items-center justify-between border-b border-[#E5E7EB] mb-4 pr-1">
<TabsList className="bg-transparent h-auto p-0 gap-0">
  <TabsTrigger value="metadata-pending" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#EF4444] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#EF4444] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>Pending</span>
                    </TabsTrigger>
                    <TabsTrigger value="metadata-completed" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#10B981] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#10B981] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span>Completed</span>
                    </TabsTrigger>
</TabsList>


<TabsContent value="metadata-pending" className="mt-0 !m-0 p-0 border-0 flex-1 flex justify-end" tabIndex={-1}>
    <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="relative" style={{minWidth:'220px',maxWidth:'320px',flex:1}}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search pending requests..."
            value={metadataPendingSearch}
            onChange={(e) => setMetadataPendingSearch(e.target.value)}
            className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={metadataPendingDateRange.from}
              onChange={(e) => setMetadataPendingDateRange({ ...metadataPendingDateRange, from: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={metadataPendingDateRange.to}
              onChange={(e) => setMetadataPendingDateRange({ ...metadataPendingDateRange, to: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>
<TabsContent value="metadata-completed" className="mt-0 !m-0 p-0 border-0 flex-1 flex justify-end" tabIndex={-1}>
    <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="relative" style={{minWidth:'220px',maxWidth:'320px',flex:1}}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search completed requests..."
            value={metadataCompletedSearch}
            onChange={(e) => setMetadataCompletedSearch(e.target.value)}
            className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
          />
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={metadataCompletedDateRange.from}
              onChange={(e) => setMetadataCompletedDateRange({ ...metadataCompletedDateRange, from: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={metadataCompletedDateRange.to}
              onChange={(e) => setMetadataCompletedDateRange({ ...metadataCompletedDateRange, to: e.target.value })}
              className="w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>
</div>
                
                <TabsContent value="metadata-pending" className="mt-0">
                  
<div className="scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">

                        <table className="dept-pending-table w-full">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Layer Name</th>
                              <th className="text-[11px] font-bold text-[#6B7280]" style={{minWidth: '160px'}}>Layer Type</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requestor</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="sticky-col-actions text-[11px] font-bold text-[#6B7280]">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {metadataPendingRequests.filter(r => !metadataPendingSearch || r.id.toLowerCase().includes(metadataPendingSearch.toLowerCase()) || r.layerName.toLowerCase().includes(metadataPendingSearch.toLowerCase()) || r.requestor.toLowerCase().includes(metadataPendingSearch.toLowerCase())).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap font-medium">{request.layerName}</td>
                                  <td className="whitespace-nowrap">
                                    <span className="px-2.5 py-1 bg-[#3D72A2]/10 text-[#3D72A2] rounded-full text-[12px] font-medium border border-[#3D72A2]/20">
                                      {request.layerType}
                                    </span>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">{request.requestor}</td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.date}
                                    </div>
                                  </td>
                                  <td className="sticky-col-actions">
                                    {!isReviewer && (
                                      <div className="flex items-center gap-2">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button 
                                              className="flex items-center justify-center w-7 h-7 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 rounded-full transition-colors font-bold border border-[#10B981]/20" 
                                              onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}
                                            >
                                              ✓
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Approve</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button 
                                              className="flex items-center justify-center w-7 h-7 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 rounded-full transition-colors font-bold border border-[#EF4444]/20" 
                                              onClick={(e) => { e.stopPropagation(); setRejectDialog({open: true, requestId: request.id}); }}
                                            >
                                              ✕
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Reject</TooltipContent>
                                        </Tooltip>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </TooltipProvider>
                          </tbody>
                        </table>
                      
</div>
</TabsContent>

                <TabsContent value="metadata-completed" className="mt-0">
                  
<div className="scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">

                        <table className="org-completed-table w-full">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Layer Name</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Layer Type</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requestor</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approved Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approved By</th>
                              <th className="sticky-col-status text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {metadataCompletedRequests.filter(r => !metadataCompletedSearch || r.id.toLowerCase().includes(metadataCompletedSearch.toLowerCase()) || r.layerName.toLowerCase().includes(metadataCompletedSearch.toLowerCase()) || r.requestor.toLowerCase().includes(metadataCompletedSearch.toLowerCase()) || r.approvedBy.toLowerCase().includes(metadataCompletedSearch.toLowerCase())).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap font-medium">{request.layerName}</td>
                                  <td className="whitespace-nowrap">
                                    <span className="px-2.5 py-1 bg-[#3D72A2]/10 text-[#3D72A2] rounded-full text-[12px] font-medium border border-[#3D72A2]/20">
                                      {request.layerType}
                                    </span>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">{request.requestor}</td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.requestedDate}
                                    </div>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.approvedDate}
                                    </div>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                      {request.approvedBy}
                                  </td>
                                  <td className="sticky-col-status">
                                    <span className="status-badge created-green flex items-center gap-1.5 w-fit whitespace-nowrap">
                                      Approved
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </TooltipProvider>
                          </tbody>
                        </table>
                      
</div>
</TabsContent>
              </Tabs>
            </TabsContent>

            {/* Application Users Tab */}
            <TabsContent value="app-users">
              <Tabs defaultValue="app-users-pending">
                {/* Secondary line tabs */}
                <div className="flex items-center justify-between border-b border-[#E5E7EB] mb-4 pr-1">
<TabsList className="bg-transparent h-auto p-0 gap-0">
  <TabsTrigger value="app-users-pending" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#EF4444] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#EF4444] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>Pending</span>
                    </TabsTrigger>
                    <TabsTrigger value="app-users-completed" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#10B981] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#10B981] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span>Completed</span>
                    </TabsTrigger>
</TabsList>

<TabsContent value="app-users-pending" className="mt-0 !m-0 p-0 border-0 flex-1 flex justify-end" tabIndex={-1}>
    <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="relative" style={{minWidth:'200px',maxWidth:'280px',flex:1}}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search pending requests..."
            value={appUsersPendingSearch}
            onChange={(e) => setAppUsersPendingSearch(e.target.value)}
            className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px]"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={appUsersPendingDateRange.from}
              onChange={(e) => setAppUsersPendingDateRange({ ...appUsersPendingDateRange, from: e.target.value })}
              className="w-[120px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={appUsersPendingDateRange.to}
              onChange={(e) => setAppUsersPendingDateRange({ ...appUsersPendingDateRange, to: e.target.value })}
              className="w-[120px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>
<TabsContent value="app-users-completed" className="mt-0 !m-0 p-0 border-0 flex-1 flex justify-end" tabIndex={-1}>
    <div className="flex items-center gap-3 flex-1 justify-end">
        <div className="relative" style={{minWidth:'200px',maxWidth:'280px',flex:1}}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
          <input
            type="text"
            placeholder="Search completed requests..."
            value={appUsersCompletedSearch}
            onChange={(e) => setAppUsersCompletedSearch(e.target.value)}
            className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={appUsersCompletedDateRange.from}
              onChange={(e) => setAppUsersCompletedDateRange({ ...appUsersCompletedDateRange, from: e.target.value })}
              className="w-[120px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={appUsersCompletedDateRange.to}
              onChange={(e) => setAppUsersCompletedDateRange({ ...appUsersCompletedDateRange, to: e.target.value })}
              className="w-[120px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>
</div>
                
                <TabsContent value="app-users-pending" className="mt-0">
  <div className="pb-6 pt-2">
    <div className="scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                        <table className="dept-pending-table w-full">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280] min-w-[200px]">User Details</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Organization / Dept</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Role</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested By</th>
                              <th className="sticky-col-actions text-[11px] font-bold text-[#6B7280]">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {appUsersPendingRequests.filter(r => !appUsersPendingSearch || r.id.toLowerCase().includes(appUsersPendingSearch.toLowerCase()) || r.name.toLowerCase().includes(appUsersPendingSearch.toLowerCase()) || r.orgDept.toLowerCase().includes(appUsersPendingSearch.toLowerCase())).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap">
                                    {request.name !== '—' ? (
                                      <div className="flex flex-col gap-0.5">
                                        <span className="font-bold text-[#111827] text-[13px]">{request.name}</span>
                                        <span className="text-[#3D72A2] text-[12px]">{request.email}</span>
                                      </div>
                                    ) : (
                                      <span className="font-medium text-[#6B7280]">{request.name}</span>
                                    )}
                                  </td>
                                  <td className="font-medium whitespace-nowrap text-[#374151]">{request.orgDept}</td>
                                  <td className="whitespace-nowrap">
                                    <span className="px-2.5 py-1 bg-[#F3F4F6] text-[#4B5563] rounded-full text-[12px] font-medium border border-[#E5E7EB]">
                                      {request.role}
                                    </span>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.requestedDate}
                                    </div>
                                  </td>
                                  <td className="font-medium whitespace-nowrap text-[#374151]">{request.requestedBy}</td>
                                  <td className="sticky-col-actions">
                                    {!isReviewer && (
                                      <div className="flex items-center gap-2">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button 
                                              className="flex items-center justify-center w-7 h-7 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 rounded-full transition-colors font-bold border border-[#10B981]/20" 
                                              onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}
                                            >
                                              ✓
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Approve</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button 
                                              className="flex items-center justify-center w-7 h-7 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 rounded-full transition-colors font-bold border border-[#EF4444]/20" 
                                              onClick={(e) => { e.stopPropagation(); setRejectDialog({open: true, requestId: request.id}); }}
                                            >
                                              ✕
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Reject</TooltipContent>
                                        </Tooltip>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </TooltipProvider>
                          </tbody>
                        </table>
                      </div>
                    
  </div>
</TabsContent>

                <TabsContent value="app-users-completed" className="mt-0">
  <div className="pb-6 pt-2">
    <div className="scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                        <table className="org-completed-table w-full">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">User Details</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Organization / Dept</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Role</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approved Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approver</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requester</th>
                              <th className="sticky-col-status text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {appUsersCompletedRequests.filter(r => !appUsersCompletedSearch || r.id.toLowerCase().includes(appUsersCompletedSearch.toLowerCase()) || r.name.toLowerCase().includes(appUsersCompletedSearch.toLowerCase()) || r.orgDept.toLowerCase().includes(appUsersCompletedSearch.toLowerCase())).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap">
                                    {request.name !== '—' ? (
                                      <div className="flex flex-col gap-0.5">
                                        <span className="font-bold text-[#111827] text-[13px]">{request.name}</span>
                                        <span className="text-[#3D72A2] text-[12px]">{request.email}</span>
                                      </div>
                                    ) : (
                                      <span className="font-medium text-[#6B7280]">{request.name}</span>
                                    )}
                                  </td>
                                  <td className="font-medium whitespace-nowrap text-[#374151]">{request.orgDept}</td>
                                  <td className="whitespace-nowrap">
                                    <span className="px-2.5 py-1 bg-[#F3F4F6] text-[#4B5563] rounded-full text-[12px] font-medium border border-[#E5E7EB]">
                                      {request.role}
                                    </span>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.requestedDate}
                                    </div>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.approvedDate}
                                    </div>
                                  </td>
                                  <td className="font-medium whitespace-nowrap text-[#374151]">
                                      {request.approver}
                                  </td>
                                  <td className="font-medium whitespace-nowrap text-[#374151]">
                                      {request.requester}
                                  </td>
                                  <td className="sticky-col-status">
                                    <span className="status-badge created-green flex items-center gap-1.5 w-fit whitespace-nowrap">
                                      Approved
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </TooltipProvider>
                          </tbody>
                        </table>
                      </div>
                    
  </div>
</TabsContent>
              </Tabs>
            </TabsContent>


            {/* User Request Tab */}
            


            {/* ─── Approve Dialog ─── */}
            <Dialog open={approveDialog.open} onOpenChange={(o) => setApproveDialog({...approveDialog, open: o})}>
              <DialogContent className="p-0 overflow-hidden" style={{maxWidth:'400px', borderRadius:'16px'}}>
                <div className="p-8 pb-6 flex flex-col items-center text-center relative">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 bg-[#10B981] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(16,185,129,0.3)]">
                      <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Approve Request</h3>
                  <p className="text-[14px] text-[#6B7280]">Are you sure you want to approve request {approveDialog.requestId}?</p>
                </div>
                <div className="px-6 pb-6 pt-2 flex flex-row gap-3">
                  <Button
                    onClick={() => setApproveDialog({open: false, requestId: ''})}
                    variant="outline"
                    className="flex-1 bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151] rounded-[10px] h-[36px] px-4 font-medium hover:bg-gray-50 transition-colors shadow-sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setApproveDialog({open: false, requestId: ''})}
                    className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white rounded-[10px] h-[36px] px-4 font-medium transition-colors border-0 shadow-sm"
                  >
                    Yes, Approve
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* ─── Reject Dialog ─── */}
            <Dialog open={rejectDialog.open} onOpenChange={(o) => { setRejectDialog({...rejectDialog, open: o}); if(!o) setRejectionReason(""); }}>
              <DialogContent className="p-0 overflow-hidden" style={{maxWidth:'400px', borderRadius:'16px'}}>
                <div className="p-8 pb-4 flex flex-col items-center text-center relative">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 bg-[#ED1C24] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(237,28,36,0.3)]">
                      <XCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Reject Request</h3>
                  <p className="text-[14px] text-[#6B7280]">Please provide a reason for rejecting request {rejectDialog.requestId}</p>
                </div>
                <div className="px-6 pb-6 space-y-5">
                  <div className="space-y-2 text-left">
                    <label className="text-[14px] font-medium text-[#111827]">
                      Rejection Reason <span className="text-[#ED1C24]">*</span>
                    </label>
                    <textarea 
                      className="w-full min-h-[100px] p-3 rounded-lg border focus:outline-none transition-colors border-[#E5E7EB] focus:border-[#ED1C24] focus:ring-1 focus:ring-[#ED1C24]/20 bg-[#F9FAFB] text-[14px] resize-none"
                      placeholder="Enter the reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="flex flex-row gap-3 pt-2">
                    <Button
                      onClick={() => setRejectDialog({open: false, requestId: ''})}
                      variant="outline"
                      className="flex-1 bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151] rounded-[10px] h-[36px] px-4 font-medium hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={!rejectionReason.trim()}
                      onClick={() => setRejectDialog({open: false, requestId: ''})}
                      className="flex-1 bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-[10px] h-[36px] px-4 font-medium transition-colors border-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#EF4444]"
                    >
                      Confirm Rejection
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* ─── Document Viewer Dialog ─── */}
            <Dialog open={fileViewerOpen.open} onOpenChange={(o) => setFileViewerOpen({...fileViewerOpen, open: o})}>
              <DialogContent className="p-0 overflow-hidden" style={{maxWidth:'520px', height:'500px', borderRadius:'16px', display:'flex', flexDirection:'column'}}>
                {/* Header */}
                <DialogHeader className="px-6 py-4 border-b border-[#E5E7EB] flex-shrink-0 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#FEE2E2] flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#EF4444]" />
                    </div>
                    <div>
                      <DialogTitle className="text-[14px] font-[600] text-[#EF4444]">Document Viewer</DialogTitle>
                      <DialogDescription className="text-[12px] text-[#6B7280] mt-0.5">{fileViewerOpen.fileName}</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                {/* Body */}
                <div className="flex-1 overflow-auto bg-[#F9FAFB] flex items-center justify-center p-6">
                  <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-10 flex flex-col items-center gap-4 w-full max-w-[340px]">
                    <div className="w-16 h-16 rounded-full bg-[#FEE2E2] flex items-center justify-center">
                      <FileText className="w-8 h-8 text-[#EF4444]" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-[15px] text-[#111827]">PDF Document</p>
                      <p className="text-[13px] text-[#6B7280] mt-1">{fileViewerOpen.fileName}</p>
                      <p className="text-[12px] text-[#9CA3AF] mt-1">Preview would be displayed here</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button className="flex items-center gap-2 px-4 bg-[#EF4444] text-white rounded-[10px] h-[36px] text-[13px] font-medium hover:bg-[#DC2626] transition-colors">
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  </div>
                </div>
                {/* Footer */}
                <div className="px-6 py-4 border-t border-[#E5E7EB] bg-white flex justify-end flex-shrink-0">
                  <Button 
                    onClick={() => setFileViewerOpen({...fileViewerOpen, open: false})}
                    className="bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-[10px] h-[36px] px-6 font-medium transition-colors border-0 shadow-sm"
                  >
                    Close
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* ─── Roles Popover Dialog ─── */}
            <Dialog open={rolesPopover.open} onOpenChange={(o) => setRolesPopover({...rolesPopover, open: o})}>
              <DialogContent className="p-0 overflow-hidden" style={{maxWidth:'340px', borderRadius:'14px'}}>
                <DialogHeader className="px-5 py-4 border-b border-[#F0F0F0]">
                  <DialogTitle className="text-[14px] font-semibold text-[#111827]">All Roles</DialogTitle>
                  <DialogDescription className="text-[12px] text-[#6B7280]">Assigned roles for this user</DialogDescription>
                </DialogHeader>
                <div className="px-5 py-4 flex flex-wrap gap-2">
                  {rolesPopover.roles.map((role, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#EFF6FF] text-[#3B82F6] border border-[#BFDBFE] rounded-full text-[12px] font-medium">{role}</span>
                  ))}
                </div>
              </DialogContent>
            </Dialog>




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
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleApprovalConfirm}
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white rounded-[10px] h-[36px] px-4 font-medium transition-colors border-0 shadow-sm"
                >
                  Yes, Approve
                </Button>
                <Button
                  onClick={handleApprovalCancel}
                  variant="outline"
                  className="w-full bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151] rounded-[10px] h-[36px] px-4 font-medium hover:bg-gray-50 transition-colors shadow-sm"
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
                  className="w-full bg-gradient-to-r from-[#ED1C24] to-[#d41820] hover:from-[#d41820] hover:to-[#c0151b] text-white rounded-[10px] h-[36px] shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300"
                >
                  Confirm Rejection
                </Button>
                <Button
                  onClick={handleRejectionCancel}
                  variant="outline"
                  className="w-full bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151] rounded-[10px] h-[36px] px-4 font-medium hover:bg-gray-50 transition-colors shadow-sm"
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
                  className="flex-1 bg-gradient-to-r from-[#ED1C24] to-[#d41820] hover:from-[#d41820] hover:to-[#c0151b] text-white rounded-[10px] h-[36px] shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="flex-1 border-[#E0E0E0] rounded-[10px] h-[36px] hover:bg-[#EBECE8]/30 transition-all"
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
                className="w-full bg-gradient-to-r from-[#ED1C24] to-[#d41820] hover:from-[#d41820] hover:to-[#c0151b] text-white rounded-[10px] h-[36px] shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300 font-semibold"
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


      {/* Map Preview Dialog */}
      

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
                  className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-[10px] h-[36px] px-4 text-[#1A1A1A]"
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
                  className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-[10px] h-[36px] px-4 text-[#1A1A1A] text-right"
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
                  className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-[10px] h-[36px] px-4 text-[#1A1A1A]"
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
                  className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-[10px] h-[36px] px-4 text-[#1A1A1A]"
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
                  className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-[10px] h-[36px] px-4 text-[#1A1A1A]"
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
                  className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-[10px] h-[36px] px-4 text-[#1A1A1A]"
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
                  className="w-full bg-gradient-to-r from-[#003F72] to-[#002d5a] hover:from-[#002d5a] hover:to-[#001f3f] text-white rounded-[10px] h-[36px] shadow-[0_6px_24px_rgba(0,63,114,0.3)] hover:shadow-[0_8px_32px_rgba(0,63,114,0.4)] transition-all duration-300"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Forward Request Modal */}
      <Dialog open={forwardDialogOpen} onOpenChange={setForwardDialogOpen}>
        <DialogContent className="max-w-[500px] h-[500px] bg-white rounded-[16px] border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 pt-6 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <DialogHeader className="p-0">
                  <DialogTitle className="text-[18px] font-semibold text-[#EF4444] leading-tight">
                    Forward Request
                  </DialogTitle>
                  <DialogDescription className="text-[14px] text-[#6B7280] mt-1">
                    Forward this request to a data owner for review
                  </DialogDescription>
                </DialogHeader>
              </div>
            </div>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto px-6 space-y-5">
            {/* Request Info Card */}
            <div className="bg-[#F9FAFB] rounded-[12px] p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-[0.5px]">Request ID</span>
                  <div className="text-[14px] font-semibold text-[#111827]">{selectedForwardRequest?.id}</div>
                </div>
                <div>
                  <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-[0.5px] block text-right">Type</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-medium bg-[#E6F0FA] text-[#3D72A2] mt-0.5">
                    Data Access
                  </span>
                </div>
              </div>
              <div className="border-t border-gray-100 pt-2">
                <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-[0.5px]">Subject</span>
                <div className="text-[14px] font-medium text-[#374151]">{selectedForwardRequest?.service}</div>
              </div>
            </div>

            {/* Data Owners Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-[13px] font-semibold text-[#EF4444]">
                  Data Owners <span className="text-[#EF4444]">*</span>
                </Label>
                <span className="text-[11px] text-[#6B7280]">{selectedDataOwners.length} selected</span>
              </div>
              
              <div className="border border-[#E5E7EB] rounded-[10px] h-[130px] overflow-y-auto bg-[#FFFFFF] p-1 custom-scrollbar">
                {DATA_OWNERS.map((owner) => (
                  <div 
                    key={owner.id}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-[#F9FAFB] rounded-[6px] cursor-pointer transition-colors"
                    onClick={() => {
                      if (selectedDataOwners.includes(owner.name)) {
                        setSelectedDataOwners(selectedDataOwners.filter(name => name !== owner.name));
                      } else {
                        setSelectedDataOwners([...selectedDataOwners, owner.name]);
                      }
                    }}
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedDataOwners.includes(owner.name) ? 'bg-[#EF4444] border-[#EF4444]' : 'border-[#E5E7EB]'}`}>
                      {selectedDataOwners.includes(owner.name) && <Check className="w-2.5 h-2.5 text-white stroke-[3]" />}
                    </div>
                    <span className="text-[13px] text-[#374151] font-medium">{owner.name}</span>
                  </div>
                ))}
              </div>

              {/* Selected Chips */}
              {selectedDataOwners.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1 max-h-[60px] overflow-y-auto custom-scrollbar">
                  {selectedDataOwners.map((owner) => (
                    <div 
                      key={owner} 
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-medium bg-[#E6F0FA] text-[#3D72A2] group"
                    >
                      {owner}
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDataOwners(selectedDataOwners.filter(name => name !== owner));
                        }}
                        className="p-0.5 rounded-full hover:bg-[#3D72A2]/10 text-[#3D72A2]/60 hover:text-[#3D72A2]"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes Field */}
            <div className="space-y-2 pb-2">
              <Label htmlFor="forward-notes" className="text-[13px] font-semibold text-[#374151]">
                Notes
              </Label>
              <Textarea
                id="forward-notes"
                value={forwardNotes}
                onChange={(e) => setForwardNotes(e.target.value)}
                placeholder="Add any additional notes or comments..."
                className="h-[90px] border-[#E5E7EB] rounded-[10px] py-3 text-[13px] resize-none focus:ring-[#EF4444] focus:border-[#EF4444]"
              />
            </div>
          </div>

          {/* Footer / Action Buttons */}
          <div className="px-6 py-5 border-t border-[#F3F4F6] bg-[#FFFFFF] flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setForwardDialogOpen(false)}
              className="px-6 border-[#E5E7EB] text-[#374151] text-[13px] font-medium h-[36px] rounded-[10px] hover:bg-gray-50 transition-all shadow-sm"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedDataOwners.length === 0) {
                  toast.error("Please select at least one data owner");
                  return;
                }
                toast.success(`Request forwarded successfully to ${selectedDataOwners.length} owners`);
                setForwardDialogOpen(false);
              }}
              className="px-6 bg-[#EF4444] hover:bg-[#D93434] text-white text-[13px] font-semibold h-[36px] rounded-[10px] shadow-sm transition-all flex items-center justify-center gap-2"
            >
              Forward Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }
      `}</style>
    
      {/* Dataset Preview Modal (Spatial Permission) */}
      <Dialog open={mapPreviewOpen} onOpenChange={setMapPreviewOpen}>
        <DialogContent className="max-w-[600px] h-[500px] bg-white rounded-[16px] border-0 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-0 overflow-hidden flex flex-col">

          <div className="flex-1 flex flex-col px-6 pt-6 overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col gap-0.5 mb-5">
              <h3 className="text-[18px] font-semibold text-[#EF4444]">Dataset Preview</h3>
              <p className="text-[14px] text-[#6B7280]">
                Visual representation of the requested spatial boundary and dataset layers.
              </p>
            </div>

            {/* Info Cards Row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-[#F9FAFB] rounded-[12px] p-3 border border-[#F3F4F6]">
                <div className="flex items-center gap-2 mb-1.5 text-[#6B7280]">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Request ID</span>
                </div>
                <div className="text-[13px] font-bold text-[#111827]">{previewingRequest?.id || "—"}</div>
              </div>
              <div className="bg-[#F9FAFB] rounded-[12px] p-3 border border-[#F3F4F6]">
                <div className="flex items-center gap-2 mb-1.5 text-[#6B7280]">
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Organization</span>
                </div>
                <div className="text-[13px] font-bold text-[#111827] truncate">
                  {previewingRequest?.organization || "Works Authority"}
                </div>
              </div>
              <div className="bg-[#F9FAFB] rounded-[12px] p-3 border border-[#F3F4F6]">
                <div className="flex items-center gap-2 mb-1.5 text-[#6B7280]">
                  <Layers className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Layers</span>
                </div>
                <div className="text-[13px] font-bold text-[#111827]">
                  {previewingRequest?.layers || (previewingRequest?.permissionName ? "11 Layers" : "3 Layers")}
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="relative flex-1 bg-[#F1F5F9] rounded-[12px] overflow-hidden border border-[#E5E7EB] mb-6 group min-h-[200px]">
              {/* Mock Map Background */}
              <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="w-full h-full bg-[#EF4444]/5 border-2 border-dashed border-[#EF4444]/30 rounded-xl flex items-center justify-center relative">
                   <span className="text-[#EF4444] text-[10px] uppercase font-bold tracking-widest opacity-30 text-center px-4">Boundary Area Overlay</span>
                   <div className="absolute w-2.5 h-2.5 bg-[#EF4444] rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                </div>
              </div>
              <div className="absolute top-3 left-3 bg-white rounded-full px-3 py-1 shadow-sm border border-gray-100 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_4px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[11px] font-semibold text-[#374151]">Selected Area</span>
              </div>
            </div>

            {/* Button Section */}
            <div className="pb-6 flex justify-end">
              <Button
                onClick={() => setMapPreviewOpen(false)}
                className="w-fit px-8 bg-[#EF4444] hover:bg-[#D93434] text-white h-[36px] rounded-[10px] font-semibold text-[14px] transition-all active:scale-[0.98]"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
</div>
  );
}