import React, { useState, useEffect } from "react";
import { getStatusBadgeProps } from "../../lib/statusUtils";
import { generateAccessFormHtml } from "../../lib/printTemplate";
import { useLocation, useNavigate } from "react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "../../components/ui/dialog";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { FileText, CheckCircle, Clock, XCircle, Search, X, ChevronDown, ChevronUp, Upload, Trash2, Download, Calendar, Hand, Map, Forward, Eye, Users, Globe, Building2, Layers, MapPin } from "lucide-react";

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
  .mobile-card {
    background: #FFFFFF;
    border: 1px solid #E5E7EB;
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 12px;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  }
`;

// Mock data for forwarded organization requests
const RAW_orgForwardedRequests = [
  { 
    id: "REQ-3042-995", 
    organization: "Civil Service Bureau",
    description: "New Organization Registration for CSB",
    submittedBy: "Hassan Al-Majed", 
    requestedDate: "12 Mar 2026", 
    forwardedDate: "14 Mar 2026",
    status: "forwarded" 
  },
  { 
    id: "REQ-3042-996", 
    organization: "Ministry of Finance",
    description: "Finance Data Access Registration",
    submittedBy: "Noof Al-Sayed", 
    requestedDate: "11 Mar 2026", 
    forwardedDate: "13 Mar 2026",
    status: "forwarded" 
  }
];

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
    organization: "Information & eGovernment Authority",
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
    organization: "Information & eGovernment Authority",
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
    requestedDate: "10 Mar 2026",
    date: "13 Mar 2026", 
    approvedBy: "Jawaher Rashed",
    status: "approved" 
  },
  { 
    id: "REQ-3042-988", 
    organization: "Environmental Agency",
    description: "The Environmental Agency oversees environmental protection, conservation efforts, and sustainability initiatives to preserve Bahrain's natural resources and ecological balance.",
    submittedBy: "Jawaher Rashed", 
    requestedDate: "05 Mar 2026",
    date: "12 Mar 2026", 
    approvedBy: "Lulwa Saad Mujaddam",
    status: "approved" 
  },
  { 
    id: "REQ-2024-004", 
    organization: "Information & eGovernment Authority",
    description: "Annual Security Audit Report",
    submittedBy: "Jawaher Rashed", 
    requestedDate: "01 Mar 2026",
    date: "11 Mar 2026", 
    approvedBy: "Ahmed Al-Mansoori",
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
  },
  { 
    id: "REQ-3042-995", 
    organization: "Civil Service Bureau",
    description: "New Organization Registration for CSB",
    submittedBy: "Hassan Al-Majed", 
    requestedDate: "12 Mar 2026", 
    date: "14 Mar 2026",
    forwardedBy: "Ahmed Al-Mansoori",
    forwardedDate: "14 Mar 2026",
    status: "forwarded" 
  },
  { 
    id: "REQ-3042-998", 
    organization: "Ministry of Justice",
    description: "Legal Data Access Request",
    submittedBy: "Muneera Khamis", 
    requestedDate: "08 Mar 2026", 
    date: "10 Mar 2026",
    rejectedBy: "Layla Ahmed",
    rejectedDate: "10 Mar 2026",
    status: "rejected" 
  }
];

const RAW_departmentCompletedRequests = [
  { 
    id: "SRV-3042-889", 
    department: "Urban Planning",
    type: "WMS/WFS",
    organization: "Ministry of Housing",
    businessDescription: "To analyze traffic patterns and road network efficiency for urban planning.",
    proposedServiceName: "Road Network Analysis Service",
    servicePurpose: "To analyze traffic patterns and road network efficiency for urban planning.",
    layerDetails: "Roads, Intersections, Traffic Signals",
    additionalDetails: "Requires access to real-time traffic sensor data from Works Authority.",
    expectedServiceDetails: "WMS/WFS service with support for temporal filtering.",
    requestedBy: "Sana Mohammad",
    requestedDate: "05 Mar 2025",
    approvedBy: "Fatima Al-Mansoori",
    approvedDate: "10 Mar 2025",
    status: "Approved"
  },
  { 
    id: "SRV-2024-001", 
    department: "GIS Department",
    type: "WFS",
    organization: "Information & eGovernment Authority",
    businessDescription: "Providing high-precision building boundaries for property assessment.",
    proposedServiceName: "Building Footprints WFS",
    servicePurpose: "Providing high-precision building boundaries for property assessment.",
    layerDetails: "Structures, Land Parcels",
    additionalDetails: "Data should be updated on a quarterly basis to reflect new constructions.",
    expectedServiceDetails: "High-performance WFS service with GeoJSON output support.",
    requestedBy: "Ahmed Al-Mansoori",
    requestedDate: "10 Mar 2026",
    approvedBy: "Jawaher Rashed",
    approvedDate: "14 Mar 2026",
    status: "Approved"
  },
  { 
    id: "SRV-2024-002", 
    department: "Environmental Services",
    type: "WMTS",
    organization: "Ministry of Environment",
    businessDescription: "Distributing high-res recent satellite imagery for environmental monitoring.",
    proposedServiceName: "National Basemap Imagery",
    servicePurpose: "Distributing high-res recent satellite imagery for environmental monitoring.",
    layerDetails: "Orthophotos, Satellite Imagery",
    additionalDetails: "Needs to support high concurrency for public facing applications.",
    expectedServiceDetails: "WMTS service with multiple zoom levels and cloud-optimized GeoTIFFs.",
    requestedBy: "Khalid Ali",
    requestedDate: "08 Mar 2026",
    approvedBy: "Jawaher Rashed",
    approvedDate: "12 Mar 2026",
    status: "Approved"
  },
  { 
    id: "SRV-3042-995", 
    department: "Education Planning",
    type: "Web Map",
    organization: "Ministry of Education",
    businessDescription: "Demographic analysis for future school locations.",
    requestedBy: "Jawaher Rashed",
    requestedDate: "12 Mar 2026",
    forwardedBy: "Ahmed Al-Mansoori",
    forwardedDate: "14 Mar 2026",
    status: "Forwarded" 
  },
  { 
    id: "SRV-3042-998", 
    department: "Health Planning",
    type: "Feature Service",
    organization: "Ministry of Health",
    businessDescription: "Hospital location optimization study.",
    requestedBy: "Muneera Khamis",
    requestedDate: "10 Mar 2026",
    rejectedBy: "Layla Ahmed",
    rejectedDate: "12 Mar 2026",
    status: "Rejected" 
  }
];

const RAW_departmentPendingRequests = [
  { 
    id: "SRV-3042-992", 
    department: "GIS Department",
    type: "Map Service",
    organization: "Works Authority",
    businessDescription: "Visualization of underground utility networks for infrastructure maintenance.",
    proposedServiceName: "Utility Corridor Viewer",
    servicePurpose: "Visualization of underground utility networks for infrastructure maintenance.",
    layerDetails: "Water Pipes, Telecom Lines, Power Grid",
    additionalDetails: "Strict access control required; only authorized personnel from Utility orgs can view.",
    expectedServiceDetails: "Secured map service with restricted attribute visibility.",
    submittedBy: "Lulwa Saad Mujaddam",
    requestedDate: "16 Mar 2026",
    status: "pending" 
  },
  { 
    id: "SRV-3042-991", 
    department: "Emergency Services",
    type: "Overlay Service",
    organization: "Ministry of Interior",
    businessDescription: "Identifying high-risk flood zones for emergency response planning.",
    proposedServiceName: "Flood Risk Mapping",
    servicePurpose: "Identifying high-risk flood zones for emergency response planning.",
    additionalDetails: "Include cross-sections of major wadis and historical flood extent polygons.",
    expectedServiceDetails: "Overlay service compatible with emergency dashboard widgets.",
    layerDetails: "Contours, Hydrology, Flood Plains",
    submittedBy: "Muneera Khamis",
    requestedDate: "15 Mar 2026",
    status: "pending" 
  },
  { 
    id: "SRV-2024-003", 
    department: "Transportation",
    type: "REST API",
    organization: "Ministry of Transportation",
    businessDescription: "Exposing real-time transit data for mobile application integration.",
    proposedServiceName: "Public Transit Hubs API",
    servicePurpose: "Exposing real-time transit data for mobile application integration.",
    layerDetails: "Bus Stops, Metro Stations, Route Lines",
    additionalDetails: "GTFS-Realtime format compatibility is a priority.",
    expectedServiceDetails: "RESTful API with JSON responses and low latency.",
    submittedBy: "Jawaher Rashed",
    requestedDate: "18 Mar 2026",
    status: "pending" 
  },
  { 
    id: "SRV-2024-004", 
    department: "Survey Department",
    type: "Feature Service",
    organization: "SLRB",
    businessDescription: "Updating land ownership boundaries based on recent survey data.",
    proposedServiceName: "Cadastral Boundary Update",
    servicePurpose: "Updating land ownership boundaries based on recent survey data.",
    layerDetails: "Parcels, Lot Numbers",
    additionalDetails: "Final verification by SLRB survey department needed before publication.",
    expectedServiceDetails: "Private feature service for internal review before being moved to production.",
    submittedBy: "Ahmed Al-Mansoori",
    requestedDate: "17 Mar 2026",
    status: "pending",
    dataOwners: ["Jawaher Rashed"]
  }
];

const RAW_departmentForwardedRequests = [
  { 
    id: "SRV-3042-995", 
    department: "Education Planning",
    type: "Web Map",
    organization: "Ministry of Education",
    businessDescription: "Demographic analysis for future school locations.",
    proposedServiceName: "Population Density Service",
    servicePurpose: "Demographic analysis for future school locations.",
    layerDetails: "Population Stats, Governorate Boundaries",
    submittedBy: "Jawaher Rashed",
    requestedDate: "12 Mar 2026",
    forwardedDate: "14 Mar 2026",
    status: "Forwarded" 
  },
  { 
    id: "SRV-3042-996", 
    department: "Marine Protection",
    type: "Tile Service",
    organization: "Information & eGovernment Authority",
    businessDescription: "Tracking protected marine habitats and coral reefs.",
    proposedServiceName: "Marine Habitat mapping",
    servicePurpose: "Tracking protected marine habitats and coral reefs.",
    layerDetails: "Coral Reefs, Protected Areas",
    submittedBy: "Fatima Al-Sayed",
    requestedDate: "15 Mar 2026",
    forwardedDate: "17 Mar 2026",
    status: "Forwarded" 
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
      { id: 1, name: "Jawaher Rashed", email: "jawaher_rashed@gov.bh", role: "Department Admin, GIS Analyst, Data Reviewer", department: "IT Department", organization: "Information & eGovernment Authority" },
      { id: 2, name: "Lulwa Saad Mujaddam", email: "sara.mohammed@gov.bh", role: "GIS Analyst, Data Reviewer", department: "GIS Department", organization: "Information & eGovernment Authority" },
      { id: 3, name: "Rana A.Majeed", email: "khalid.ali@gov.bh", role: "Data Reviewer", department: "Planning Department", organization: "Information & eGovernment Authority" },
      { id: 4, name: "Muneera Khamis", email: "fatima.hassan@gov.bh", role: "Organization User, Department Admin", department: "IT Department", organization: "Information & eGovernment Authority" },
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
      { id: 5, name: "Mohammed Ali", email: "mohammed.ali@gov.bh", role: "GIS Analyst, Data Manager", department: "GIS Department", organization: "Information & eGovernment Authority" },
      { id: 6, name: "Noora Ahmed", email: "noora.ahmed@gov.bh", role: "Data Manager, System Administrator", department: "IT Department", organization: "Information & eGovernment Authority" },
      { id: 7, name: "Ali Hassan", email: "ali.hassan@gov.bh", role: "System Administrator", department: "IT Department", organization: "Information & eGovernment Authority" },
    ]
  },
  {
    id: "GRP-003",
    usersCount: 2,
    dateCreated: "14 Mar 2026",
    status: "completed",
    fileName: "approved_group_003.pdf",
    fileSize: "132 KB",
    approvedBy: "Jawaher Rashed",
    approvedDate: "16 Mar 2026",
    users: [
      { id: 8, name: "Maryam Saleh", email: "maryam.saleh@gov.bh", role: "GIS Analyst, Department Admin, Data Reviewer", department: "GIS Department", organization: "Information & eGovernment Authority" },
      { id: 9, name: "Omar Abdullah", email: "omar.abdullah@gov.bh", role: "Department Admin", department: "Planning Department", organization: "Information & eGovernment Authority" },
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
      { id: 10, name: "Fatima Al-Sayed", email: "fatima.alsayed@geoportal.gov.bh", role: "GIS Analyst", department: "GIS Department", organization: "Information & eGovernment Authority" },
      { id: 11, name: "Ahmed Al-Mansoori", email: "ahmed.mansoori@geoportal.gov.bh", role: "Data Manager", department: "GIS Department", organization: "Information & eGovernment Authority" }
    ]
  }
];

const RAW_userRequestForwardedGroups = [
  {
    id: "GRP-001",
    usersCount: 4,
    dateCreated: "16 Mar 2026",
    forwardedDate: "17 Mar 2026",
    status: "forwarded",
    fileName: "user_group_001.pdf",
    fileSize: "245 KB",
    users: [
      { id: 1, name: "Jawaher Rashed", email: "jawaher_rashed@gov.bh", role: "Department Admin, GIS Analyst, Data Reviewer", department: "IT Department", organization: "Information & eGovernment Authority" },
      { id: 2, name: "Lulwa Saad Mujaddam", email: "sara.mohammed@gov.bh", role: "GIS Analyst, Data Reviewer", department: "GIS Department", organization: "Information & eGovernment Authority" },
      { id: 3, name: "Rana A.Majeed", email: "khalid.ali@gov.bh", role: "Data Reviewer", department: "Planning Department", organization: "Information & eGovernment Authority" },
      { id: 4, name: "Muneera Khamis", email: "fatima.hassan@gov.bh", role: "Organization User, Department Admin", department: "IT Department", organization: "Information & eGovernment Authority" },
    ]
  },
  {
    id: "GRP-002",
    usersCount: 3,
    dateCreated: "15 Mar 2026",
    forwardedDate: "16 Mar 2026",
    status: "forwarded",
    fileName: "access_request_002.pdf",
    fileSize: "189 KB",
    users: [
      { id: 5, name: "Mohammed Ali", email: "mohammed.ali@gov.bh", role: "GIS Analyst, Data Manager", department: "GIS Department", organization: "Information & eGovernment Authority" },
      { id: 6, name: "Noora Ahmed", email: "noora.ahmed@gov.bh", role: "Data Manager, System Administrator", department: "IT Department", organization: "Information & eGovernment Authority" },
      { id: 7, name: "Ali Hassan", email: "ali.hassan@gov.bh", role: "System Administrator", department: "IT Department", organization: "Information & eGovernment Authority" },
    ]
  },
  {
    id: "GRP-004",
    usersCount: 5,
    dateCreated: "18 Mar 2026",
    forwardedDate: "19 Mar 2026",
    status: "forwarded",
    fileName: "bsdi_review_group.pdf",
    fileSize: "512 KB",
    submittedBy: "Jawaher Rashed",
    users: [
      { id: 10, name: "Fatima Al-Sayed", email: "fatima.alsayed@geoportal.gov.bh", role: "GIS Analyst", department: "GIS Department", organization: "Information & eGovernment Authority" },
      { id: 11, name: "Ahmed Al-Mansoori", email: "ahmed.mansoori@geoportal.gov.bh", role: "Data Manager", department: "GIS Department", organization: "Information & eGovernment Authority" }
    ]
  }
];

// Filter user request groups by status
const userRequestPendingGroups = RAW_userRequestGroups.filter(g => g.status === "pending");
const userRequestCompletedGroups = RAW_userRequestGroups.filter(g => g.status === "completed");


// Mock data for Data Access Pending Requests

// Mock data for Data Access Completed Requests
const RAW_dataAccessCompletedRequests = [
  { id: "DAE-3042-941", service: "Utility Networks - WMS", requestedBy: "Sara Mohammad", requestedDate: "12 Jan 2025", appDate: "20 Jan 2025", approvedBy: "Mohammed Al-Baker", comment: "Approved for public access" },
  { id: "DAE-3042-945", service: "Land Parcels - WFS", requestedBy: "Ahmed Al-Harqani", requestedDate: "08 Jan 2025", appDate: "18 Jan 2025", approvedBy: "Sara Mohammad", comment: "Usage limit applied" },
  { id: "DAE-3042-946", service: "Satellite Imagery - WMTS", requestedBy: "Fahim Hassan", requestedDate: "05 Jan 2025", appDate: "15 Jan 2025", approvedBy: "Ahmed Al-Harqani", comment: "Approved explicitly" },
  { id: "DAE-3042-947", service: "Topographic Maps - WMS", requestedBy: "Layla Ahmed", requestedDate: "02 Jan 2025", appDate: "10 Jan 2025", approvedBy: "Jawaher Rashed", comment: "No special comments" },
  { id: "DAE-2024-001", service: "BSDI Core Layers - WFS", requestedBy: "Jawaher Rashed", requestedDate: "10 Mar 2026", appDate: "15 Mar 2026", approvedBy: "Jawaher Rashed", organization: "Information & eGovernment Authority", organizationDept: "GIS Department", comment: "Core access granted" },
  { id: "DAE-2024-002", service: "Traffic Flow API", requestedBy: "Lulwa Saad Mujaddam", requestedDate: "05 Mar 2026", appDate: "12 Mar 2026", approvedBy: "Jawaher Rashed", organization: "Transport Authority", organizationDept: "Traffic Management", comment: "API key generated" },
  { id: "DAE-2024-005", service: "Environmental Zones", requestedBy: "Khalid Ali", requestedDate: "08 Mar 2026", fwdDate: "10 Mar 2026", forwardedBy: "Ahmed Al-Mansoori", organization: "Environmental Agency", organizationDept: "Conservation", status: "forwarded" },
  { id: "DAE-2024-006", service: "Maritime Routes", requestedBy: "Muneera Khamis", requestedDate: "07 Mar 2026", rejDate: "09 Mar 2026", rejectedBy: "Layla Ahmed", organization: "Port Authority", organizationDept: "Operations", status: "rejected" }
];

const RAW_dataAccessPendingRequests = [
  { id: "DAE-3042-893", service: "Road Network - WMS", entity: "Transport Authority", requester: "Sara Mohammad", date: "12 Jan 2025" },
  { id: "DAE-3042-894", service: "Building Footprints - WFS", entity: "Min. of Municipalities", requester: "Ahmed Al-Harqani", date: "12 Jan 2025" },
  { id: "DAE-2024-003", service: "Satellite Imagery 2024", entity: "Information & eGovernment Authority", requester: "Jawaher Rashed", date: "16 Mar 2026" },
  { id: "DAE-2024-004", service: "Utility Corridors", entity: "Information & eGovernment Authority", requester: "Ahmed Al-Mansoori", date: "15 Mar 2026", dataOwners: ["Jawaher Rashed"] }
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
    fwdDate: "07 Jan 2025", 
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
    requestor: "Sana Mohammad",
    date: "12 Mar 2025", 
    status: "pending" 
  },
  { 
    id: "SPC-2024-022", 
    permissionName: "Aerial View Access", 
    coverage: "Partial, Selected", 
    layers: "11 Layers (Northern Governorate)", 
    requestor: "Ahmed Al-Harqani",
    date: "08 Mar 2025", 
    status: "pending" 
  },
  { 
    id: "SPC-2024-001", 
    permissionName: "BSDI Internal Review", 
    coverage: "Full", 
    layers: "15 Layers", 
    requestor: "Jawaher Rashed",
    date: "18 Mar 2026", 
    status: "pending",
    organization: "Information & eGovernment Authority"
  },
  { 
    id: "SPC-2024-002", 
    permissionName: "Ministry of Health Emergency Access", 
    coverage: "Regional", 
    layers: "5 Layers", 
    requestor: "Ahmed Al-Mansoori",
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
    requestedBy: "Ahmed Al-Mannai",
    requestedDate: "28 Feb 2025", 
    approvedDate: "05 Mar 2025", 
    approvedBy: "Lulwa Saad Mujaddam", 
    status: "approved" 
  },
  { 
    id: "SPC-2024-004", 
    permissionName: "Emergency Response Map", 
    requestedBy: "Khalid Ali",
    requestedDate: "08 Mar 2026", 
    forwardedDate: "10 Mar 2026", 
    forwardedBy: "Ahmed Al-Mansoori", 
    status: "forwarded" 
  },
  { 
    id: "SPC-2024-005", 
    permissionName: "Restricted Area Access", 
    requestedBy: "Muneera Khamis",
    requestedDate: "05 Mar 2026", 
    rejectedDate: "07 Mar 2026", 
    rejectedBy: "Layla Ahmed", 
    status: "rejected" 
  }
];

// Mock data for User Access Sub-tab Pending Requests
const RAW_userAccessSubPendingRequests = [
  { id: "SPU-2024-014", userDetails: "Noura Al-Khalifa", email: "noura.khalifa@geoportal.gov.bh", permissionDept: "GIS Data Access (Urban Planning)", type: "Add", requestedBy: "Khalid Ali", date: "16 Mar 2025", status: "pending" },
  { id: "SPU-2024-015", userDetails: "Yousif Al-Dossari", email: "yousif.dossari@geoportal.gov.bh", permissionDept: "Aerial View Access (Road Network)", type: "Modify", requestedBy: "Fatima Al-Sayed", date: "15 Mar 2025", status: "pending" },
  { id: "SPU-2024-001", userDetails: "Fatima Al-Sayed", email: "fatima.alsayed@geoportal.gov.bh", permissionDept: "Core Data Access (GIS Department)", type: "Add", requestedBy: "Jawaher Rashed", date: "18 Mar 2026", status: "pending", department: "GIS Department" },
  { id: "SPU-2024-002", userDetails: "Ahmed Al-Mansoori", email: "ahmed.mansoori@geoportal.gov.bh", permissionDept: "Infrastructure Access (IT Department)", type: "Modify", requestedBy: "Jawaher Rashed", date: "17 Mar 2026", status: "pending", dataOwners: ["Jawaher Rashed"] }
];

// Mock data for User Access Sub-tab Completed Requests
const RAW_userAccessSubCompletedRequests = [
  { id: "SPU-2024-012", userDetails: "Ahmed Al-Mannai", email: "ahmed.m@survey.bh", requestedDate: "15 Feb 2025", approvedDate: "28 Feb 2025", approvedBy: "Omar Al-Ansari", status: "Approved" },
  { id: "SPU-2024-003", userDetails: "Sara Mohammad", email: "sara.m@geoportal.gov.bh", requestedDate: "10 Mar 2026", approvedDate: "14 Mar 2026", approvedBy: "Jawaher Rashed", status: "Approved" },
  { id: "SPU-2024-004", userDetails: "Ali Hassan", email: "ali.h@gov.bh", requestedDate: "08 Mar 2026", forwardedDate: "10 Mar 2026", forwardedBy: "Ahmed Al-Mansoori", status: "forwarded" },
  { id: "SPU-2024-005", userDetails: "Noura Ahmed", email: "n.ahmed@gov.bh", requestedDate: "05 Mar 2026", rejectedDate: "07 Mar 2026", rejectedBy: "Layla Ahmed", status: "rejected" }
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
    email: "jawaher.rashed@geoportal.gov.bh",
    date: "18 Mar 2026", 
    status: "pending" 
  },
  { 
    id: "DL-2024-002", 
    dataset: "High Resolution Imagery 2024",
    format: "GeoTIFF",
    requestor: "Fatima Al-Sayed",
    description: "Multi-spectral satellite imagery for environmental monitoring.",
    email: "fatima.alsayed@geoportal.gov.bh",
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
    requestedBy: "Fatima Hassan",
    requestedDate: "05 Mar 2025", 
    approvedDate: "14 Mar 2025",
    approvedBy: "Layla Al-Qassimi",
    status: "Approved" 
  },
  { 
    id: "DL-2024-005", 
    dataset: "Hydrology Network",
    format: "GeoJSON",
    requestedBy: "Khalid Ali",
    requestedDate: "05 Mar 2026", 
    forwardedDate: "07 Mar 2026",
    forwardedBy: "Ahmed Al-Mansoori",
    status: "forwarded" 
  },
  { 
    id: "DL-2024-006", 
    dataset: "Protected Areas",
    format: "Shapefile",
    requestedBy: "Muneera Khamis",
    requestedDate: "04 Mar 2026", 
    rejectedDate: "06 Mar 2026",
    rejectedBy: "Layla Ahmed",
    status: "rejected" 
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
    dataOwners: "Information & eGovernment Authority",
    workflow: "Submitted-Processed-Approved",
    organization: "Information & eGovernment Authority"
  },
  { 
    id: "DL-2024-004", 
    dataset: "Digital Twin 3D Models",
    product: "3D Data",
    requestor: "Ahmed Al-Mansoori",
    requestedDate: "15 Mar 2026", 
    forwardedDate: "18 Mar 2026",
    dataOwners: "Jawaher Rashed",
    workflow: "Submitted-Processed-Approving",
    organization: "Information & eGovernment Authority"
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
    requestedBy: "Yusuf Al-Doseri",
    requestedDate: "10 Mar 2025", 
    approvedDate: "13 Mar 2025",
    approvedBy: "Noor Al-Hashimi",
    status: "Approved" 
  },
  { 
    id: "META-2043-903", 
    layerName: "Road Centerlines",
    layerType: "Line",
    requestedBy: "Sara Mohammad",
    requestedDate: "07 Mar 2025", 
    approvedDate: "13 Mar 2025",
    approvedBy: "Noor Al-Hashimi",
    status: "Approved" 
  },
  { 
    id: "META-2024-004", 
    layerName: "Census 2020 Metadata",
    layerType: "Database",
    requestedBy: "Khalid Ali",
    requestedDate: "04 Mar 2026", 
    forwardedDate: "06 Mar 2026",
    forwardedBy: "Ahmed Al-Mansoori",
    status: "forwarded" 
  },
  { 
    id: "META-2024-005", 
    layerName: "Classified Military Sites",
    layerType: "Restricted",
    requestedBy: "Muneera Khamis",
    requestedDate: "03 Mar 2026", 
    rejectedDate: "05 Mar 2026",
    rejectedBy: "Layla Ahmed",
    status: "rejected" 
  }
];

const RAW_appUsersPendingRequests = [
    { id: "APP-3042-125", name: "Ahmed Al-Mansouri", email: "ahmed.mansouria@gov.bh", orgDept: "Information & eGovernment Authority (GIS Department)", role: "GIS Analyst", requestedDate: "18 Mar 2025", requestedBy: "Lulwa Saad Mujaddam" },
    { id: "APP-3042-124", name: "Fatima Al-Khalifa", email: "fatima.khalifa@gov.bh", orgDept: "Transport Authority (Data Management)", role: "Data Reviewer", requestedDate: "17 Mar 2025", requestedBy: "Rana A. Majeed" },
    { id: "APP-2024-001", name: "Sara Mohammad", email: "sara.m@geoportal.gov.bh", orgDept: "Information & eGovernment Authority (GIS Department)", role: "GIS Manager", requestedDate: "18 Mar 2026", requestedBy: "Jawaher Rashed" },
    { id: "APP-2024-002", name: "Khalid Ali", email: "khalid.ali@geoportal.gov.bh", orgDept: "Information & eGovernment Authority (IT Infrastructure)", role: "System Admin", requestedDate: "17 Mar 2026", requestedBy: "Ahmed Al-Mansoori", dataOwners: ["Jawaher Rashed"] }
  ];

// Mock data for services creation pending requests
const RAW_servicesCreationPendingRequests = [
  { 
    id: "SVC-2042-987", 
    serviceName: "WMS - Sewerage Network Tiles",
    url: "https://api.bsdi.gov.bh/wms/sewerage",
    description: "Web Map Service for sewerage network infrastructure visualization",
    type: "WMS",
    organization: "Information & eGovernment Authority",
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
const RAW_servicesCreationCompletedRequests = [
  { 
    id: "SVC-2042-985", 
    serviceName: "WMTS - Orthophoto Basemap",
    url: "https://api.bsdi.gov.bh/wmts/ortho",
    description: "Web Map Tile Service for high-resolution orthophotography",
    type: "WMTS",
    organization: "Information & eGovernment Authority",
    department: "Mapping Department",
    endpoint: "/api/v1/wmts/ortho",
    authType: "Bearer Token",
    visibility: "Internal",
    requestor: "Khalid Mohamed",
    date: "3 days ago", 
    status: "completed" 
  },
];

const RAW_spatialAccessForwardedRequests = [
  { 
    id: "SPC-2042-991", 
    permissionName: "Emergency Response - Health", 
    coverage: "Regional",
    layers: "8 Layers (Southern Governorate)",
    requestor: "Sara Mohammad",
    requestedDate: "10 Mar 2025", 
    forwardedDate: "12 Mar 2025",
    status: "Forwarded",
    organization: "Information & eGovernment Authority"
  },
  { 
    id: "SPC-2024-004", 
    permissionName: "Environmental Monitoring Plan", 
    coverage: "Partial, Selected",
    layers: "5 Layers",
    requestor: "Fatima Al-Sayed",
    requestedDate: "14 Mar 2026", 
    forwardedDate: "16 Mar 2026",
    status: "Forwarded",
    organization: "Information & eGovernment Authority"
  }
];

// Mock data for User Access Sub-tab Forwarded Requests
const RAW_userAccessSubForwardedRequests = [
  { id: "SPU-2042-995", userDetails: "Ahmed Al-Mannai", email: "ahmed.m@survey.bh", requestedDate: "11 Mar 2025", forwardedDate: "13 Mar 2025", status: "Forwarded", organization: "Information & eGovernment Authority" },
  { id: "SPU-2024-004", userDetails: "Sana Mohammad", email: "sana.m@geoportal.gov.bh", requestedDate: "15 Mar 2026", forwardedDate: "17 Mar 2026", status: "Forwarded", organization: "Information & eGovernment Authority" }
];

// Mock data for Metadata Forwarded Requests
const RAW_metadataForwardedRequests = [
  { 
    id: "META-2042-999", 
    layerName: "Climate Risk Zones",
    layerType: "Raster",
    requestor: "Khalid Ali",
    requestedDate: "12 Mar 2025", 
    forwardedDate: "14 Mar 2025",
    organization: "Information & eGovernment Authority"
  },
  { 
    id: "META-2024-005", 
    layerName: "BSDI Infrastructure Layer",
    layerType: "Vector",
    requestor: "Jawaher Rashed",
    requestedBy: "Jawaher Rashed",
    requestedDate: "16 Mar 2026", 
    forwardedDate: "18 Mar 2026",
    organization: "Information & eGovernment Authority"
  }
];

// Mock data for Application Users Forwarded Requests
const RAW_appUsersForwardedRequests = [
  { 
    id: "APP-3042-129", 
    name: "Omar Al-Ansari", 
    email: "omar.ansari@gov.bh", 
    orgDept: "Information & eGovernment Authority (Environmental Division)", 
    role: "Reviewer", 
    requestedDate: "15 Mar 2025", 
    forwardedDate: "18 Mar 2025",
    organization: "Information & eGovernment Authority"
  },
  { 
    id: "APP-2024-005", 
    name: "Sara Mohammad", 
    email: "sara.m@geoportal.gov.bh", 
    orgDept: "Information & eGovernment Authority (GIS Department)", 
    role: "GIS Analyst", 
    requestedDate: "16 Mar 2026", 
    forwardedDate: "18 Mar 2026",
    requestedBy: "Jawaher Rashed",
    organization: "Information & eGovernment Authority"
  }
];


const RAW_appUsersCompletedRequests = [
    { id: "APP-3042-123", name: "Mohammed Al-Baker", email: "mohammed.baker@gov.bh", orgDept: "Urban Planning Authority (Planning Department)", role: "Department Admin", requestedDate: "15 Mar 2025", approvedDate: "20 Mar 2025", approvedBy: "Jawaher Rashed", requestedBy: "Khalid Ali", status: "Approved" },
    { id: "APP-3042-122", name: "Hamad Al-Khalifa", email: "hamad.k@gov.bh", orgDept: "Environmental Agency (Data Services)", role: "Organization User", requestedDate: "14 Mar 2025", approvedDate: "19 Mar 2025", approvedBy: "Yousif Al-Mahmood", requestedBy: "Ahmed Al-Harqani", status: "Approved" },
    { id: "APP-2024-003", name: "Layla Ahmed", email: "layla.a@geoportal.gov.bh", orgDept: "Information & eGovernment Authority (Mapping Services)", role: "Org Admin", requestedDate: "10 Mar 2026", approvedDate: "15 Mar 2026", approvedBy: "Jawaher Rashed", requestedBy: "Jawaher Rashed", status: "Approved" }
];


export default function DataAccessRequests1() {
  const [appUsersPendingSearch, setAppUsersPendingSearch] = useState("");
  const [appUsersPendingDateRange, setAppUsersPendingDateRange] = useState({from:'', to:''});
  const [appUsersCompletedSearch, setAppUsersCompletedSearch] = useState("");
  const [appUsersCompletedDateRange, setAppUsersCompletedDateRange] = useState({from:'', to:''});
  const [userRequestPendingSearch, setUserRequestPendingSearch] = useState("");
  const [userRequestPendingDateRange, setUserRequestPendingDateRange] = useState({ from: "", to: "" });
  const [userRequestCompletedSearch, setUserRequestCompletedSearch] = useState("");
  const [userRequestCompletedDateRange, setUserRequestCompletedDateRange] = useState({ from: "", to: "" });
  const [dataAccessForwardDialogOpen, setDataAccessForwardDialogOpen] = useState(false);
  const [forwardDataAccessFile, setForwardDataAccessFile] = useState<File | null>(null);
  const [forwardingEntity, setForwardingEntity] = useState<string | null>(null);

      const location = useLocation();
  const navigate = useNavigate();

  const isSuperAdmin = location.pathname.includes("/super-admin");
  const isOrgAdmin = location.pathname.includes("/entity-admin");
  const isDeptAdmin = location.pathname.includes("/department");
  const isReviewer = location.pathname.includes("/reviewer");
  const adminName = "Jawaher Rashed";
  const adminOrg = "Information & eGovernment Authority";
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
  const departmentPendingRequests = applyRbacFilter(RAW_departmentPendingRequests);
  const dataAccessPendingRequests = applyRbacFilter(RAW_dataAccessPendingRequests);
  const spatialAccessPendingRequests = applyRbacFilter(RAW_spatialAccessPendingRequests);
  const userAccessSubPendingRequests = applyRbacFilter(RAW_userAccessSubPendingRequests);
  const dataDownloadPendingRequests = applyRbacFilter(RAW_dataDownloadPendingRequests);
  const metadataPendingRequests = applyRbacFilter(RAW_metadataPendingRequests);
  const appUsersPendingRequests = applyRbacFilter(RAW_appUsersPendingRequests);
  const userRequestGroups = applyGroupsRbacFilter(RAW_userRequestGroups);

  const formatFwd = (arr) => applyRbacFilter(arr).map(r => ({...r, status: r.status || "Forwarded", approvedBy: r.forwardedBy || r.requestedBy || "System", approvedDate: r.forwardedDate}));
  const formatFwdGrp = (arr) => applyGroupsRbacFilter(arr).map(g => ({...g, status: "Forwarded"}));

  const completedRequests = [...applyRbacFilter(RAW_completedRequests), ...formatFwd(RAW_orgForwardedRequests)];
  const departmentCompletedRequests = [...applyRbacFilter(RAW_departmentCompletedRequests), ...formatFwd(RAW_departmentForwardedRequests)];
  const dataAccessCompletedRequests = [
    ...applyRbacFilter(RAW_dataAccessCompletedRequests).map(r => ({...r, status: 'Approved'})), 
    ...formatFwd(RAW_dataAccessForwardedRequests),
    ...applyRbacFilter(RAW_dataAccessPendingRequests).map(r => ({...r, status: 'Pending', requestedBy: r.requester, requestedDate: r.date, approvedBy: 'â€”', approvedDate: 'â€”'}))
  ];
  const spatialAccessCompletedRequests = [...applyRbacFilter(RAW_spatialAccessCompletedRequests), ...formatFwd(RAW_spatialAccessForwardedRequests)];
  const userAccessSubCompletedRequests = [...applyRbacFilter(RAW_userAccessSubCompletedRequests), ...formatFwd(RAW_userAccessSubForwardedRequests)];
  const dataDownloadCompletedRequests = [
    ...applyRbacFilter(RAW_dataDownloadCompletedRequests).map(r => ({...r, status: 'Approved'})), 
    ...formatFwd(RAW_dataDownloadForwardedRequests),
    ...applyRbacFilter(RAW_dataDownloadPendingRequests).map(r => ({...r, status: 'Pending', requestedBy: r.requestor, requestedDate: r.date, approvedBy: 'â€”', approvedDate: 'â€”'}))
  ];
  const metadataCompletedRequests = [
    ...applyRbacFilter(RAW_metadataCompletedRequests).map(r => ({...r, status: 'Approved'})), 
    ...formatFwd(RAW_metadataForwardedRequests),
    ...applyRbacFilter(RAW_metadataPendingRequests).map(r => ({...r, status: 'Pending', requestedBy: r.requestor, requestedDate: r.date, approvedBy: 'â€”', approvedDate: 'â€”'}))
  ];
  const appUsersCompletedRequests = [
    ...applyRbacFilter(RAW_appUsersCompletedRequests).map(r => ({...r, status: 'Approved'})), 
    ...formatFwd(RAW_appUsersForwardedRequests),
    ...applyRbacFilter(RAW_appUsersPendingRequests).map(r => ({...r, status: 'Pending', requestedBy: r.requestedBy || "Jawaher Rashed", requestedDate: r.requestedDate, approvedBy: 'â€”', approvedDate: r.requestedDate || 'â€”'}))
  ];
  
  const orgForwardedRequests = [];
  const departmentForwardedRequests = [];
  const dataAccessForwardedRequests = [];
  const spatialAccessForwardedRequests = [];
  const userAccessSubForwardedRequests = [];
  const metadataForwardedRequests = [];
  const appUsersForwardedRequests = [];
  const dataDownloadForwardedRequests = [];

  const userRequestForwardedGroups = applyGroupsRbacFilter(RAW_userRequestForwardedGroups);


  const filteredCompletedRequests = completedRequests;
  const filteredDeptCompleted = departmentCompletedRequests;
  const filteredDeptPending = departmentPendingRequests;

  // Services Creation data
  const servicesCreationPendingRequests = applyRbacFilter(RAW_servicesCreationPendingRequests);
  const servicesCreationCompletedRequests = applyRbacFilter(RAW_servicesCreationCompletedRequests);


// Helper for request status visualization
  const getRequestVisuals = (request: any) => {
    if (!isOrgAdmin) return null;
    if (request.status !== 'pending' && request.status !== 'in-review') return null;

    const isRaisedByMe = request.submittedBy === adminName;
    
    // Check if action is required (approving others' requests in my org or as data owner)
    const myOrgs = [adminOrg, "Works Authority"];
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
        color: "bg-[#EF4444]", // Red for action
        textColor: "text-[#EF4444]",
        bgColor: "bg-[#EF4444]/10",
        indicator: "bg-[#EF4444]"
      };
    }

    return null;
  };
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  
  // Status filter states for Completed tabs
  const [deptCompletedStatusFilter, setDeptCompletedStatusFilter] = useState("All");
  const [userRequestCompletedStatusFilter, setUserRequestCompletedStatusFilter] = useState("All");
  const [dataAccessCompletedStatusFilter, setDataAccessCompletedStatusFilter] = useState("All");
  const [spatialAccessCompletedStatusFilter, setSpatialAccessCompletedStatusFilter] = useState("All");
  const [orgCompletedStatusFilter, setOrgCompletedStatusFilter] = useState("All");
  const [servicesCreationCompletedStatusFilter, setServicesCreationCompletedStatusFilter] = useState("All");
  const [dataDownloadCompletedStatusFilter, setDataDownloadCompletedStatusFilter] = useState("Approved");
  const [dataDownloadCompletedSearch, setDataDownloadCompletedSearch] = useState("");
  const [dataDownloadCompletedDateRange, setDataDownloadCompletedDateRange] = useState({ from: "", to: "" });
  const [metadataCompletedStatusFilter, setMetadataCompletedStatusFilter] = useState("Approved");
  const [appUsersCompletedStatusFilter, setAppUsersCompletedStatusFilter] = useState("Approved");

  const [dataAccessCompletedSearch, setDataAccessCompletedSearch] = useState("");
  const [dataAccessCompletedDateRange, setDataAccessCompletedDateRange] = useState({ from: "", to: "" });
  
  // Search and date range state for each accordion
  const [orgPendingSearch, setOrgPendingSearch] = useState("");
  const [orgPendingDateRange, setOrgPendingDateRange] = useState({ from: "", to: "" });

  const [orgCompletedSearch, setOrgCompletedSearch] = useState("");
  const [orgCompletedDateRange, setOrgCompletedDateRange] = useState({ from: "", to: "" });
  
  const [deptPendingSearch, setDeptPendingSearch] = useState("");
  const [deptPendingDateRange, setDeptPendingDateRange] = useState({ from: "", to: "" });

  const [deptCompletedSearch, setDeptCompletedSearch] = useState("");
  const [deptCompletedDateRange, setDeptCompletedDateRange] = useState({ from: "", to: "" });

  const [metadataPendingSearch, setMetadataPendingSearch] = useState("");
  const [metadataPendingDateRange, setMetadataPendingDateRange] = useState({from:'', to:''});
  const [metadataForwardedSearch, setMetadataForwardedSearch] = useState("");
  const [metadataForwardedDateRange, setMetadataForwardedDateRange] = useState({from:'', to:''});
  const [metadataCompletedSearch, setMetadataCompletedSearch] = useState("");
  const [metadataCompletedDateRange, setMetadataCompletedDateRange] = useState({from:'', to:''});

  const [userRequestForwardedSearch, setUserRequestForwardedSearch] = useState("");
  const [userRequestForwardedDateRange, setUserRequestForwardedDateRange] = useState({ from: "", to: "" });

  const [appUsersForwardedSearch, setAppUsersForwardedSearch] = useState("");
  const [appUsersForwardedDateRange, setAppUsersForwardedDateRange] = useState({ from: "", to: "" });

  const [deptForwardedSearch, setDeptForwardedSearch] = useState("");
  const [deptForwardedDateRange, setDeptForwardedDateRange] = useState({ from: "", to: "" });

  const [orgForwardedSearch, setOrgForwardedSearch] = useState("");
  const [orgForwardedDateRange, setOrgForwardedDateRange] = useState({ from: "", to: "" });

  const [spatialAccessForwardedSearch, setSpatialAccessForwardedSearch] = useState("");
  const [spatialAccessForwardedDateRange, setSpatialAccessForwardedDateRange] = useState({ from: "", to: "" });

  const [userAccessSubForwardedSearch, setUserAccessSubForwardedSearch] = useState("");
  const [userAccessSubForwardedDateRange, setUserAccessSubForwardedDateRange] = useState({ from: "", to: "" });
  const [expandedDataAccessRow, setExpandedDataAccessRow] = useState<string | null>(null);
  const [expandedDataAccessFwdRow, setExpandedDataAccessFwdRow] = useState<string | null>(null);
  const [expandedDataAccessCmpRow, setExpandedDataAccessCmpRow] = useState<string | null>(null);

  const [dataDownloadForwardedSearch, setDataDownloadForwardedSearch] = useState("");
  const [dataDownloadForwardedDateRange, setDataDownloadForwardedDateRange] = useState({from:'', to:''});

  const [userRequestOpenAccordion, setUserRequestOpenAccordion] = useState<string | undefined>(undefined);
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
  
  const [pdfViewerOpen, setPdfViewerOpen] = useState(false);
  const [viewingFileName, setViewingFileName] = useState<string>("");
  const [selectedPrintData, setSelectedPrintData] = useState<any>(null);
  
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
  const [spatialOpenAccordion, setSpatialOpenAccordion] = useState<string | undefined>(undefined);

  // States used by Spatial Permission tab UI
  const [spatialPendingSearch, setSpatialPendingSearch] = useState("");
  const [spatialPendingDateRange, setSpatialPendingDateRange] = useState({ from: "", to: "" });
  const [spatialCompletedSearch, setSpatialCompletedSearch] = useState("");
  const [spatialCompletedDateRange, setSpatialCompletedDateRange] = useState({ from: "", to: "" });
  const [spatialUserPendingSearch, setSpatialUserPendingSearch] = useState("");
  const [spatialUserPendingDateRange, setSpatialUserPendingDateRange] = useState({ from: "", to: "" });
  const [spatialUserCompletedSearch, setSpatialUserCompletedSearch] = useState("");
  const [spatialUserCompletedDateRange, setSpatialUserCompletedDateRange] = useState({ from: "", to: "" });

  // Filtered arrays for Spatial Permission tab
  const filteredSpatialPending = spatialAccessPendingRequests.filter(r =>
    (!spatialPendingSearch || r.id?.toLowerCase().includes(spatialPendingSearch.toLowerCase()) || r.permissionName?.toLowerCase().includes(spatialPendingSearch.toLowerCase()) || r.organization?.toLowerCase().includes(spatialPendingSearch.toLowerCase())) &&
    (!spatialPendingDateRange.from || new Date(r.date) >= new Date(spatialPendingDateRange.from)) &&
    (!spatialPendingDateRange.to   || new Date(r.date) <= new Date(spatialPendingDateRange.to))
  );

  const filteredSpatialCompleted = spatialAccessCompletedRequests.filter(r => {
    const searchDateMatch = (!spatialCompletedSearch || r.id?.toLowerCase().includes(spatialCompletedSearch.toLowerCase()) || r.permissionName?.toLowerCase().includes(spatialCompletedSearch.toLowerCase()) || r.organization?.toLowerCase().includes(spatialCompletedSearch.toLowerCase())) &&
    (!spatialCompletedDateRange.from || new Date(r.date) >= new Date(spatialCompletedDateRange.from)) &&
    (!spatialCompletedDateRange.to   || new Date(r.date) <= new Date(spatialCompletedDateRange.to));
    const statusMatch = 
      (spatialAccessCompletedStatusFilter === "Approved" && (r.status?.toLowerCase() === "approved" || r.status?.toLowerCase() === "completed")) ||
      (spatialAccessCompletedStatusFilter === "Forwarded" && r.status?.toLowerCase() === "forwarded") ||
      (spatialAccessCompletedStatusFilter === "Rejected" && r.status?.toLowerCase() === "rejected");
    return searchDateMatch && statusMatch;
  });

  const filteredSpatialUserPending = userAccessSubPendingRequests.filter(r =>
    (!spatialUserPendingSearch || r.id?.toLowerCase().includes(spatialUserPendingSearch.toLowerCase()) || r.user?.toLowerCase().includes(spatialUserPendingSearch.toLowerCase()) || r.permission?.toLowerCase().includes(spatialUserPendingSearch.toLowerCase())) &&
    (!spatialUserPendingDateRange.from || new Date(r.date) >= new Date(spatialUserPendingDateRange.from)) &&
    (!spatialUserPendingDateRange.to   || new Date(r.date) <= new Date(spatialUserPendingDateRange.to))
  );

  const filteredSpatialUserCompleted = userAccessSubCompletedRequests.filter(r => {
    const searchDateMatch = (!spatialUserCompletedSearch || r.id?.toLowerCase().includes(spatialUserCompletedSearch.toLowerCase()) || r.user?.toLowerCase().includes(spatialUserCompletedSearch.toLowerCase()) || r.permission?.toLowerCase().includes(spatialUserCompletedSearch.toLowerCase())) &&
    (!spatialUserCompletedDateRange.from || new Date(r.date) >= new Date(spatialUserCompletedDateRange.from)) &&
    (!spatialUserCompletedDateRange.to   || new Date(r.date) <= new Date(spatialUserCompletedDateRange.to));
    const statusMatch = 
      (spatialAccessCompletedStatusFilter === "Approved" && (r.status?.toLowerCase() === "approved" || r.status?.toLowerCase() === "completed")) ||
      (spatialAccessCompletedStatusFilter === "Forwarded" && r.status?.toLowerCase() === "forwarded") ||
      (spatialAccessCompletedStatusFilter === "Rejected" && r.status?.toLowerCase() === "rejected");
    return searchDateMatch && statusMatch;
  });

  // States used by Services Creation tab UI
  const [servicesPendingSearch, setServicesPendingSearch] = useState("");
  const [servicesPendingDateRange, setServicesPendingDateRange] = useState({ from: "", to: "" });
  const [servicesCompletedSearch, setServicesCompletedSearch] = useState("");
  const [servicesCompletedDateRange, setServicesCompletedDateRange] = useState({ from: "", to: "" });

  // Filtered arrays for Services Creation tab
  const filteredServicesPending = servicesCreationPendingRequests.filter(r =>
    (!servicesPendingSearch || r.id?.toLowerCase().includes(servicesPendingSearch.toLowerCase()) || r.serviceName?.toLowerCase().includes(servicesPendingSearch.toLowerCase()) || r.organization?.toLowerCase().includes(servicesPendingSearch.toLowerCase())) &&
    (!servicesPendingDateRange.from || new Date(r.date) >= new Date(servicesPendingDateRange.from)) &&
    (!servicesPendingDateRange.to   || new Date(r.date) <= new Date(servicesPendingDateRange.to))
  );

  const filteredServicesCompleted = servicesCreationCompletedRequests.filter(r => {
    const searchDateMatch = (!servicesCompletedSearch || r.id?.toLowerCase().includes(servicesCompletedSearch.toLowerCase()) || r.serviceName?.toLowerCase().includes(servicesCompletedSearch.toLowerCase()) || r.organization?.toLowerCase().includes(servicesCompletedSearch.toLowerCase())) &&
    (!servicesCompletedDateRange.from || new Date(r.date) >= new Date(servicesCompletedDateRange.from)) &&
    (!servicesCompletedDateRange.to   || new Date(r.date) <= new Date(servicesCompletedDateRange.to));
    const statusMatch = 
      (servicesCreationCompletedStatusFilter === "Approved" && (r.status?.toLowerCase() === "approved" || r.status?.toLowerCase() === "completed")) ||
      (servicesCreationCompletedStatusFilter === "Forwarded" && r.status?.toLowerCase() === "forwarded") ||
      (servicesCreationCompletedStatusFilter === "Rejected" && r.status?.toLowerCase() === "rejected");
    return searchDateMatch && statusMatch;
  });

  const filteredUserRequestForwardedGroups = userRequestForwardedGroups.filter(g => 
    (!userRequestForwardedSearch || g.id.toLowerCase().includes(userRequestForwardedSearch.toLowerCase()) || g.users[0]?.name.toLowerCase().includes(userRequestForwardedSearch.toLowerCase())) &&
    (!userRequestForwardedDateRange.from || new Date(g.dateCreated) >= new Date(userRequestForwardedDateRange.from)) &&
    (!userRequestForwardedDateRange.to || new Date(g.dateCreated) <= new Date(userRequestForwardedDateRange.to))
  );

  const userRequestAllGroups = [...userRequestGroups, ...userRequestForwardedGroups.map(g => ({...g, status: 'Forwarded'}))];
  const filteredUserRequestCompletedGroups = userRequestAllGroups.filter(g => {
    const searchMatch = !userRequestCompletedSearch || g.id.toLowerCase().includes(userRequestCompletedSearch.toLowerCase()) || g.users[0]?.name.toLowerCase().includes(userRequestCompletedSearch.toLowerCase());
    const statusMatch = userRequestCompletedStatusFilter === "All" || 
      (userRequestCompletedStatusFilter === "Approved" && (g.status?.toLowerCase() === "approved" || g.status?.toLowerCase() === "completed" || g.status?.toLowerCase() === "approve")) ||
      (userRequestCompletedStatusFilter === "Forwarded" && g.status?.toLowerCase() === "forwarded") ||
      (userRequestCompletedStatusFilter === "Rejected" && g.status?.toLowerCase() === "rejected");
    const dateMatch = (!userRequestCompletedDateRange.from || new Date(g.dateCreated) >= new Date(userRequestCompletedDateRange.from)) &&
                      (!userRequestCompletedDateRange.to || new Date(g.dateCreated) <= new Date(userRequestCompletedDateRange.to));
    return searchMatch && statusMatch && dateMatch;
  });

  const filteredUserRequestPendingGroups = userRequestGroups.filter(g => 
    g.status === "pending" && 
    (!userRequestPendingSearch || g.id.toLowerCase().includes(userRequestPendingSearch.toLowerCase()) || g.users[0]?.name.toLowerCase().includes(userRequestPendingSearch.toLowerCase())) &&
    (!userRequestPendingDateRange.from || new Date(g.dateCreated) >= new Date(userRequestPendingDateRange.from)) &&
    (!userRequestPendingDateRange.to || new Date(g.dateCreated) <= new Date(userRequestPendingDateRange.to))
  );

  const totalPending = filteredUserRequestPendingGroups.length + departmentPendingRequests.length;
  const totalApproved = completedRequests.length + filteredUserRequestCompletedGroups.length + departmentCompletedRequests.length;


  
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
      rejected: "bg-[#EF4444] text-white",
    };
    return statusConfig[status] || "bg-[#666666] text-white";
  };

  // Handle approve button click - open dialog
  const handleApproveClick = (requestId: string) => {
    // If in Services Creation tab, try to find existing URL
    if (activeTab === "department-2") {
      const request = departmentPendingRequests.find(r => r.id === requestId);
      if (request && (request as any).url) {
        setServiceUrl((request as any).url);
      } else {
        setServiceUrl("");
      }
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
    setRejectionComment("");
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
    <div className="min-h-screen bg-[#F5F7FA] px-4 md:px-[24px] py-4 md:py-[20px]">
      <div className="w-full space-y-4">
        <PageHeader 
          title="Request 1"
          description="Manage data access workflows"
        />

        {/* Requests Tabs */}
        <div className="bg-white rounded-[16px] px-4 md:px-[24px] pt-4 md:pt-[20px] pb-6 md:pb-[24px]">
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
              .status-badge { padding: 4px 12px; border-radius: 999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; width: fit-content; display: inline-flex; align-items: center; justify-content: center; border: 1px solid transparent; }
              .status-badge.approved { background: #ECFDF5; color: #065F46; border-color: #A7F3D0; }
              .status-badge.forward { background: #FFFBEB; color: #92400E; border-color: #FDE68A; }
              .status-badge.reject { background: #FEF2F2; color: #991B1B; border-color: #FECACA; }
              .status-badge.created-green { background: #ECFDF5 !important; color: #065F46 !important; border-color: #A7F3D0 !important; }

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
                background-color: #EF4444 !important;
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

              /* Responsive Adjustments */
              @media (max-width: 1024px) {
                .tab-item {
                  padding: 8px 16px !important;
                  font-size: 13px !important;
                }
                .sub-tabs-container {
                  gap: 10px;
                  overflow-x: auto;
                  scrollbar-width: none;
                }
                .sub-tabs-container::-webkit-scrollbar {
                  display: none;
                }
              }

              @media (max-width: 768px) {
                .tab-item {
                  padding: 6px 12px !important;
                  height: 32px !important;
                }
                .scrollable-table-container {
                  border-radius: 8px;
                }
                .org-completed-table th, .dept-pending-table th, .user-requests-table th {
                  padding: 10px 12px;
                  font-size: 12px;
                }
                .org-completed-table td, .dept-pending-table td, .user-requests-table td {
                  padding: 10px 12px;
                  font-size: 12px;
                }
                .status-badge {
                  padding: 2px 8px;
                  font-size: 10px;
                }
              }
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
                <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-[#E5E7EB] mb-4 pr-1 gap-4">
<TabsList className="bg-transparent h-auto p-0 gap-0">
                     <TabsTrigger
                      value="org-pending"
                      className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#EF4444] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#EF4444] after:opacity-0 data-[state=active]:after:opacity-100"
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>
                        Pending
                      </span>
                    </TabsTrigger>
                    
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


<TabsContent value="org-pending" className="mt-0 !m-0 p-0 border-0 flex-1 flex flex-col md:flex-row justify-end md:justify-start lg:justify-end" tabIndex={-1}>
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full justify-end md:justify-start lg:justify-end">
        <div className="flex items-center gap-2 w-full sm:max-w-[320px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search pending requests..."
              value={orgPendingSearch}
              onChange={(e) => setOrgPendingSearch(e.target.value)}
              className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px]"
            />
          </div>
          {/* Mobile Date Filter Icon */}
          <div className="sm:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-[36px] w-[36px] rounded-[10px] border-[#E5E7EB] bg-white">
                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-4" align="end">
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Filter by Date</h4>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">From Date</Label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="dd-mm-yyyy"
                          onFocus={(e) => e.target.type = 'date'}
                          onBlur={(e) => e.target.type = 'text'}
                          value={orgPendingDateRange.from}
                          onChange={(e) => setOrgPendingDateRange({ ...orgPendingDateRange, from: e.target.value })}
                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">To Date</Label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="dd-mm-yyyy"
                          onFocus={(e) => e.target.type = 'date'}
                          onBlur={(e) => e.target.type = 'text'}
                          value={orgPendingDateRange.to}
                          onChange={(e) => setOrgPendingDateRange({ ...orgPendingDateRange, to: e.target.value })}
                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Desktop Date Range */}
        <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={orgPendingDateRange.from}
              onChange={(e) => setOrgPendingDateRange({ ...orgPendingDateRange, from: e.target.value })}
              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={orgPendingDateRange.to}
              onChange={(e) => setOrgPendingDateRange({ ...orgPendingDateRange, to: e.target.value })}
              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>

<TabsContent value="org-completed" className="mt-0 !m-0 p-0 border-0 flex-1 flex flex-col md:flex-row justify-end md:justify-start lg:justify-end" tabIndex={-1}>
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full justify-end md:justify-start lg:justify-end">
        <div className="flex items-center gap-2 w-full sm:max-w-[320px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search completed requests..."
              value={orgCompletedSearch}
              onChange={(e) => setOrgCompletedSearch(e.target.value)}
              className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
            />
          </div>
          {/* Mobile Date Filter Icon */}
          <div className="sm:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-[36px] w-[36px] rounded-[10px] border-[#E5E7EB] bg-white">
                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-4" align="end">
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Filter by Date</h4>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">From Date</Label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="dd-mm-yyyy"
                          onFocus={(e) => e.target.type = 'date'}
                          onBlur={(e) => e.target.type = 'text'}
                          value={orgCompletedDateRange.from}
                          onChange={(e) => setOrgCompletedDateRange({ ...orgCompletedDateRange, from: e.target.value })}
                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">To Date</Label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="dd-mm-yyyy"
                          onFocus={(e) => e.target.type = 'date'}
                          onBlur={(e) => e.target.type = 'text'}
                          value={orgCompletedDateRange.to}
                          onChange={(e) => setOrgCompletedDateRange({ ...orgCompletedDateRange, to: e.target.value })}
                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Status Select with Chevron */}
        <div className="relative w-full sm:w-[120px]">
          <select 
            value={orgCompletedStatusFilter} 
            onChange={(e) => setOrgCompletedStatusFilter(e.target.value)} 
            className="w-full px-3 pr-9 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none" 
            style={{cursor: 'pointer'}}
          >
            <option value="All">All</option>
            <option value="Approved">Approved</option>
            <option value="Forwarded">Forwarded</option>
            <option value="Rejected">Rejected</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
        </div>

        {/* Desktop Date Range */}
        <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={orgCompletedDateRange.from}
              onChange={(e) => setOrgCompletedDateRange({ ...orgCompletedDateRange, from: e.target.value })}
              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={orgCompletedDateRange.to}
              onChange={(e) => setOrgCompletedDateRange({ ...orgCompletedDateRange, to: e.target.value })}
              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>
</div>
                <TabsContent value="org-pending" className="mt-0">
                  {/* Desktop Table View */}
                  <div className="hidden md:block scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                    <table className="dept-pending-table w-full">
                      <thead>
                        <tr>
                          <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Organization</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Business Description</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Requested by</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                          <th className="sticky-col-actions text-[11px] font-bold text-[#6B7280] text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <TooltipProvider delayDuration={100}>
                          {pendingRequests.filter(r => !orgPendingSearch || r.id.toLowerCase().includes(orgPendingSearch.toLowerCase()) || r.organization.toLowerCase().includes(orgPendingSearch.toLowerCase()) || r.submittedBy.toLowerCase().includes(orgPendingSearch.toLowerCase())).map((request) => (
                            <tr key={request.id}>
                              <td className="sticky-col-id font-medium text-[#111827]">
                                <div className="flex items-center gap-2 whitespace-nowrap">
                                  <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full"></div>
                                  {request.id}
                                </div>
                              </td>
                              <td className="font-semibold text-[#111827] whitespace-nowrap">{request.organization}</td>
                              <td className="max-w-[250px] truncate">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-help text-[#374151] whitespace-nowrap">{request.description}</span>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-gray-800 text-white text-xs p-2 max-w-[300px]">
                                    {request.description}
                                  </TooltipContent>
                                </Tooltip>
                              </td>
                              <td className="font-medium text-[#374151] whitespace-nowrap">{request.submittedBy}</td>
                              <td className="font-medium whitespace-nowrap">
                                <div className="flex items-center gap-2 text-[#374151]">
                                  <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                  {request.date}
                                </div>
                              </td>
                              <td className="sticky-col-actions text-right">
                                {!isReviewer && (
                                  <div className="flex items-center justify-end gap-2">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button 
                                          className="flex items-center justify-center w-7 h-7 bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20 rounded-full transition-colors font-bold border border-[#F59E0B]/20" 
                                          onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}
                                        >
                                          <Forward className="w-[18px] h-[18px]" strokeWidth={2.5} />
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
                                          <X className="w-4 h-4" />
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

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {pendingRequests.filter(r => !orgPendingSearch || r.id.toLowerCase().includes(orgPendingSearch.toLowerCase()) || r.organization.toLowerCase().includes(orgPendingSearch.toLowerCase()) || r.submittedBy.toLowerCase().includes(orgPendingSearch.toLowerCase())).map((request) => (
                      <div key={request.id} className="mobile-card">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full"></div>
                              <span className="text-xs font-bold text-[#6B7280]">{request.id}</span>
                            </div>
                            <h4 className="text-sm font-bold text-[#111827]">{request.organization}</h4>
                          </div>
                          {!isReviewer && (
                            <div className="flex gap-2">
                              <button 
                                className="w-8 h-8 flex items-center justify-center bg-[#F59E0B]/10 text-[#F59E0B] rounded-full border border-[#F59E0B]/20"
                                onClick={() => setApproveDialog({open: true, requestId: request.id})}
                              >
                                <Forward className="w-4 h-4" />
                              </button>
                              <button 
                                className="w-8 h-8 flex items-center justify-center bg-[#EF4444]/10 text-[#EF4444] rounded-full border border-[#EF4444]/20"
                                onClick={() => setRejectDialog({open: true, requestId: request.id})}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between text-xs">
                            <span className="text-[#6B7280]">Requested By</span>
                            <span className="font-medium text-[#111827]">{request.submittedBy}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-[#6B7280]">Date</span>
                            <div className="flex items-center gap-1 font-medium text-[#111827]">
                              <Calendar className="w-3 h-3 text-[#6B7280]" />
                              {request.date}
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-2 bg-[#F9FAFB] rounded-lg border border-[#F1F5F9]">
                          <p className="text-[11px] text-[#374151] leading-relaxed line-clamp-2">
                            {request.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="org-completed" className="mt-0">
                  {/* Desktop Table View */}
                  <div className="hidden md:block scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                    <table className="org-completed-table w-full">
                      <thead>
                        <tr>
                          <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Organization</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Requested by</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Action by</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Action date</th>
                          <th className="col-desc text-[11px] font-bold text-[#6B7280]">Business Description</th>
                          <th className="sticky-col-status text-[11px] font-bold text-[#6B7280]">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <TooltipProvider delayDuration={100}>
                          {filteredCompletedRequests.filter(r => {
                            const searchMatch = !orgCompletedSearch || r.id.toLowerCase().includes(orgCompletedSearch.toLowerCase()) || r.organization.toLowerCase().includes(orgCompletedSearch.toLowerCase()) || r.submittedBy.toLowerCase().includes(orgCompletedSearch.toLowerCase());
                            const statusMatch = 
                              orgCompletedStatusFilter === "All" ||
                              (orgCompletedStatusFilter === "Approved" && (r.status?.toLowerCase() === "approved" || r.status?.toLowerCase() === "completed")) ||
                              (orgCompletedStatusFilter === "Forwarded" && r.status?.toLowerCase() === "forwarded") ||
                              (orgCompletedStatusFilter === "Rejected" && r.status?.toLowerCase() === "rejected");
                            return searchMatch && statusMatch;
                          }).map((request) => (
                            <tr key={request.id}>
                              <td className="sticky-col-id font-medium text-[#111827]">
                                {request.id}
                              </td>
                              <td className="col-org font-semibold text-[#111827] whitespace-nowrap">
                                {request.organization}
                              </td>
                              <td className="font-medium text-[#374151] whitespace-nowrap">{request.submittedBy}</td>
                              <td className="font-medium whitespace-nowrap text-[#374151]">{request.requestedDate || request.date}</td>
                              <td className="font-medium whitespace-nowrap text-[#374151]">{request.approvedBy || request.rejectedBy || '—'}</td>
                              <td className="font-medium whitespace-nowrap text-[#374151]">{request.approvedDate || request.rejectedDate || request.date || '—'}</td>
                              <td className="col-desc max-w-[200px] truncate">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span className="cursor-help text-[#374151] whitespace-nowrap">{request.description}</span>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-gray-800 text-white text-xs p-2 max-w-[300px]">
                                    {request.description}
                                  </TooltipContent>
                                </Tooltip>
                              </td>
                              <td className="sticky-col-status">
                                <Badge className={`status-badge ${request.status === 'approved' ? 'approved' : request.status === 'forwarded' ? 'forward' : 'reject'}`}>
                                  {request.status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </TooltipProvider>
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {filteredCompletedRequests.filter(r => {
                      const searchMatch = !orgCompletedSearch || r.id.toLowerCase().includes(orgCompletedSearch.toLowerCase()) || r.organization.toLowerCase().includes(orgCompletedSearch.toLowerCase()) || r.submittedBy.toLowerCase().includes(orgCompletedSearch.toLowerCase());
                      const statusMatch = 
                        orgCompletedStatusFilter === "All" ||
                        (orgCompletedStatusFilter === "Approved" && (r.status?.toLowerCase() === "approved" || r.status?.toLowerCase() === "completed")) ||
                        (orgCompletedStatusFilter === "Forwarded" && r.status?.toLowerCase() === "forwarded") ||
                        (orgCompletedStatusFilter === "Rejected" && r.status?.toLowerCase() === "rejected");
                      return searchMatch && statusMatch;
                    }).map((request) => (
                      <div key={request.id} className="mobile-card">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <span className="text-xs font-bold text-[#6B7280]">{request.id}</span>
                            <h4 className="text-sm font-bold text-[#111827]">{request.organization}</h4>
                          </div>
                          <Badge className={`status-badge ${request.status === 'approved' ? 'approved' : request.status === 'forwarded' ? 'forward' : 'reject'}`}>
                            {request.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-3">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Requested By</span>
                            <span className="text-xs font-medium text-[#111827]">{request.submittedBy}</span>
                          </div>
                          <div className="flex flex-col text-right">
                            <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Req. Date</span>
                            <span className="text-xs font-medium text-[#111827]">{request.requestedDate || request.date}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Action By</span>
                            <span className="text-xs font-medium text-[#111827]">{request.approvedBy || request.rejectedBy || '—'}</span>
                          </div>
                          <div className="flex flex-col text-right">
                            <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Action Date</span>
                            <span className="text-xs font-medium text-[#111827]">{request.approvedDate || request.rejectedDate || request.date || '—'}</span>
                          </div>
                        </div>
                        
                        <div className="p-2 bg-[#F9FAFB] rounded-lg border border-[#F1F5F9]">
                          <p className="text-[11px] text-[#374151] leading-relaxed line-clamp-2">
                            {request.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Department Tab */}
            <TabsContent value="department">
              <Tabs defaultValue="dept-pending">
                {/* Secondary line tabs */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-[#E5E7EB] mb-4 pr-1 gap-4">
                  <TabsList className="bg-transparent h-auto p-0 gap-0">
                    <TabsTrigger value="dept-pending" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#EF4444] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#EF4444] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>Pending</span>
                    </TabsTrigger>
                    <TabsTrigger value="dept-completed" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#10B981] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#10B981] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span>Completed</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="dept-completed" className="mt-0 !m-0 p-0 border-0 flex-1 flex flex-col md:flex-row justify-end md:justify-start lg:justify-end" tabIndex={-1}>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full justify-end md:justify-start lg:justify-end">
                        <div className="flex items-center gap-2 w-full sm:max-w-[320px]">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                            <input
                              type="text"
                              placeholder="Search completed requests..."
                              value={deptCompletedSearch}
                              onChange={(e) => setDeptCompletedSearch(e.target.value)}
                              className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
                            />
                          </div>
                          {/* Mobile Date Filter Icon */}
                          <div className="sm:hidden">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="h-[36px] w-[36px] rounded-[10px] border-[#E5E7EB] bg-white">
                                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] p-4" align="end">
                                <div className="flex flex-col gap-4">
                                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Filter by Date</h4>
                                  <div className="space-y-3">
                                    <div className="space-y-1.5">
                                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">From Date</Label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="dd-mm-yyyy"
                                          onFocus={(e) => e.target.type = 'date'}
                                          onBlur={(e) => e.target.type = 'text'}
                                          value={deptCompletedDateRange.from}
                                          onChange={(e) => setDeptCompletedDateRange({ ...deptCompletedDateRange, from: e.target.value })}
                                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                      </div>
                                    </div>
                                    <div className="space-y-1.5">
                                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">To Date</Label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="dd-mm-yyyy"
                                          onFocus={(e) => e.target.type = 'date'}
                                          onBlur={(e) => e.target.type = 'text'}
                                          value={deptCompletedDateRange.to}
                                          onChange={(e) => setDeptCompletedDateRange({ ...deptCompletedDateRange, to: e.target.value })}
                                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>
                        
                        {/* Status Select with Chevron */}
                        <div className="relative w-full sm:w-[120px]">
                          <select 
                            value={deptCompletedStatusFilter} 
                            onChange={(e) => setDeptCompletedStatusFilter(e.target.value)} 
                            className="w-full px-3 pr-9 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none" 
                            style={{cursor: 'pointer'}}
                          >
                            <option value="All">All</option>
                            <option value="Approved">Approved</option>
                            <option value="Forwarded">Forwarded</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                        </div>

                        {/* Desktop Date Range */}
                        <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto">
                          <div className="relative flex-1 sm:flex-none">
                            <input
                              type="text"
                              placeholder="dd-mm-yyyy"
                              onFocus={(e) => e.target.type = 'date'}
                              onBlur={(e) => e.target.type = 'text'}
                              value={deptCompletedDateRange.from}
                              onChange={(e) => setDeptCompletedDateRange({ ...deptCompletedDateRange, from: e.target.value })}
                              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                          </div>
                          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
                          <div className="relative flex-1 sm:flex-none">
                            <input
                              type="text"
                              placeholder="dd-mm-yyyy"
                              onFocus={(e) => e.target.type = 'date'}
                              onBlur={(e) => e.target.type = 'text'}
                              value={deptCompletedDateRange.to}
                              onChange={(e) => setDeptCompletedDateRange({ ...deptCompletedDateRange, to: e.target.value })}
                              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                          </div>
                        </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="dept-pending" className="mt-0 !m-0 p-0 border-0 flex-1 flex flex-col md:flex-row justify-end md:justify-start lg:justify-end" tabIndex={-1}>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full justify-end md:justify-start lg:justify-end">
                        <div className="flex items-center gap-2 w-full sm:max-w-[320px]">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                            <input
                              type="text"
                              placeholder="Search pending requests..."
                              value={deptPendingSearch}
                              onChange={(e) => setDeptPendingSearch(e.target.value)}
                              className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px]"
                            />
                          </div>
                          {/* Mobile Date Filter Icon */}
                          <div className="sm:hidden">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="h-[36px] w-[36px] rounded-[10px] border-[#E5E7EB] bg-white">
                                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] p-4" align="end">
                                <div className="flex flex-col gap-4">
                                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Filter by Date</h4>
                                  <div className="space-y-3">
                                    <div className="space-y-1.5">
                                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">From Date</Label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="dd-mm-yyyy"
                                          onFocus={(e) => e.target.type = 'date'}
                                          onBlur={(e) => e.target.type = 'text'}
                                          value={deptPendingDateRange.from}
                                          onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, from: e.target.value })}
                                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                      </div>
                                    </div>
                                    <div className="space-y-1.5">
                                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">To Date</Label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="dd-mm-yyyy"
                                          onFocus={(e) => e.target.type = 'date'}
                                          onBlur={(e) => e.target.type = 'text'}
                                          value={deptPendingDateRange.to}
                                          onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, to: e.target.value })}
                                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        {/* Desktop Date Range */}
                        <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto">
                          <div className="relative flex-1 sm:flex-none">
                            <input
                              type="text"
                              placeholder="dd-mm-yyyy"
                              onFocus={(e) => e.target.type = 'date'}
                              onBlur={(e) => e.target.type = 'text'}
                              value={deptPendingDateRange.from}
                              onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, from: e.target.value })}
                              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                          </div>
                          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
                          <div className="relative flex-1 sm:flex-none">
                            <input
                              type="text"
                              placeholder="dd-mm-yyyy"
                              onFocus={(e) => e.target.type = 'date'}
                              onBlur={(e) => e.target.type = 'text'}
                              value={deptPendingDateRange.to}
                              onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, to: e.target.value })}
                              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                          </div>
                        </div>
                    </div>
                  </TabsContent>
                </div>
                
                <TabsContent value="dept-pending" className="mt-0">
                  {/* Desktop Table View */}
                  <div className="hidden md:block scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                    <table className="dept-pending-table w-full">
                      <thead>
                        <tr>
                          <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Department</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Type</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Organization</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Requested by</th>
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
                                  <div className="flex justify-end items-center h-full w-full">
                                    <span className={`inline-flex items-center justify-center px-3 py-1.5 min-w-[80px] text-[12px] font-semibold rounded-full capitalize shadow-sm transition-all duration-300 ${request?.status?.toLowerCase() === 'pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20' : 'bg-[#003F72]/10 text-[#003F72] border border-[#003F72]/20'}`}>
                                        {request?.status || "Pending"}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-end gap-2">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button 
                                          className="flex items-center justify-center w-8 h-8 bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20 rounded-full transition-colors font-bold border border-[#F59E0B]/20" 
                                          onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}
                                        >
                                          <Forward className="w-[18px] h-[18px]" strokeWidth={2.5} />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Forward</TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button 
                                          className="flex items-center justify-center w-8 h-8 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 rounded-full transition-colors font-bold border border-[#EF4444]/20" 
                                          onClick={(e) => { e.stopPropagation(); setRejectDialog({open: true, requestId: request.id}); }}
                                        >
                                          <X className="w-4 h-4" />
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

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {filteredDeptPending.filter(r => !deptPendingSearch || r.id.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.department?.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.organization?.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.submittedBy.toLowerCase().includes(deptPendingSearch.toLowerCase())).map((request) => (
                      <div key={request.id} className="mobile-card">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full"></div>
                              <span className="text-xs font-bold text-[#6B7280]">{request.id}</span>
                            </div>
                            <h4 className="text-sm font-bold text-[#111827]">{request.department}</h4>
                            <div className="text-[11px] text-[#6B7280]">{request.organization}</div>
                          </div>
                          {!isOrgAdmin && (
                            <div className="flex gap-2">
                              <button 
                                className="w-8 h-8 flex items-center justify-center bg-[#F59E0B]/10 text-[#F59E0B] rounded-full border border-[#F59E0B]/20"
                                onClick={() => setApproveDialog({open: true, requestId: request.id})}
                              >
                                <Forward className="w-4 h-4" />
                              </button>
                              <button 
                                className="w-8 h-8 flex items-center justify-center bg-[#EF4444]/10 text-[#EF4444] rounded-full border border-[#EF4444]/20"
                                onClick={() => setRejectDialog({open: true, requestId: request.id})}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                          <div className="p-2 bg-[#F9FAFB] rounded-lg border border-[#F1F5F9]">
                            <span className="text-[10px] text-[#9CA3AF] uppercase font-bold block mb-1">Type</span>
                            <span className="text-xs font-medium text-[#111827]">{request.type}</span>
                          </div>
                          <div className="p-2 bg-[#F9FAFB] rounded-lg border border-[#F1F5F9]">
                            <span className="text-[10px] text-[#9CA3AF] uppercase font-bold block mb-1">Requested By</span>
                            <span className="text-xs font-medium text-[#111827]">{request.submittedBy}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mb-3 text-xs">
                          <div className="flex items-center gap-1 text-[#6B7280]">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{request.requestedDate}</span>
                          </div>
                          {isOrgAdmin && (
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${request?.status?.toLowerCase() === 'pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' : 'bg-[#003F72]/10 text-[#003F72]'}`}>
                              {request?.status || "Pending"}
                            </span>
                          )}
                        </div>

                        <div className="p-2 bg-[#F5F7FA] rounded-lg">
                          <p className="text-[11px] text-[#374151] line-clamp-2">
                            {request.businessDescription}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                {/* Organization Completed Accordion (Reused in Department Tab) */}
                <TabsContent value="dept-completed" className="mt-0">
                  {/* Desktop Table View */}
                  <div className="hidden md:block scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                    <table className="org-completed-table w-full">
                      <thead>
                        <tr>
                          <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Department</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Type</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Organization</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Requested by</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Action by</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Action date</th>
                          <th className="sticky-col-status text-left text-[11px] font-bold text-[#6B7280]">Status</th>
                        </tr>
                      </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                            {filteredDeptCompleted.filter(r => {
                                const searchMatch = !deptCompletedSearch || r.id.toLowerCase().includes(deptCompletedSearch.toLowerCase()) || r.organization.toLowerCase().includes(deptCompletedSearch.toLowerCase()) || (r.submittedBy && r.submittedBy.toLowerCase().includes(deptCompletedSearch.toLowerCase()));
                                const statusMatch = 
                                  deptCompletedStatusFilter === "All" ||
                                  (deptCompletedStatusFilter === "Approved" && (r.status?.toLowerCase() === "approved" || r.status?.toLowerCase() === "completed")) ||
                                  (deptCompletedStatusFilter === "Forwarded" && r.status?.toLowerCase() === "forwarded") ||
                                  (deptCompletedStatusFilter === "Rejected" && r.status?.toLowerCase() === "rejected");
                                return searchMatch && statusMatch;
                              }).map((request) => (
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
                                  <td className="font-medium text-[#111827] whitespace-nowrap">{request.requestedBy || "Ahmed Al-Mansoori"}</td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.requestedDate || "10 Mar 2026"}
                                    </div>
                                  </td>
                                  <td className="font-medium text-[#111827] whitespace-nowrap">
                                    {request.status?.toLowerCase() === "approved" || request.status?.toLowerCase() === "completed" ? (request.approvedBy || "Jawaher Rashed") : 
                                     request.status?.toLowerCase() === "rejected" ? (request.rejectedBy || "Layla Ahmed") : 
                                     (request.forwardedBy || "Ahmed Al-Mansoori")}
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.status?.toLowerCase() === "approved" || request.status?.toLowerCase() === "completed" ? (request.approvedDate || "10 Mar 2026") : 
                                       request.status?.toLowerCase() === "rejected" ? (request.rejectedDate || "16 Mar 2026") : 
                                       (request.forwardedDate || "14 Mar 2026")}
                                    </div>
                                  </td>
                                   <td className="sticky-col-status">
                                     <span className={`status-badge ${request.status?.toLowerCase() === 'approved' || request.status?.toLowerCase() === 'completed' ? 'approved' : request.status?.toLowerCase() === 'forwarded' ? 'forward' : 'reject'}`}>
                                       {request.status?.toLowerCase() === 'approved' || request.status?.toLowerCase() === 'completed' ? 'Approved' : request.status?.toLowerCase() === 'forwarded' ? 'Forwarded' : 'Rejected'}
                                     </span>
                                   </td>
                                </tr>
                              ))}
                        </TooltipProvider>
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {filteredDeptCompleted.filter(r => {
                      const searchMatch = !deptCompletedSearch || r.id.toLowerCase().includes(deptCompletedSearch.toLowerCase()) || r.organization.toLowerCase().includes(deptCompletedSearch.toLowerCase()) || r.submittedBy.toLowerCase().includes(deptCompletedSearch.toLowerCase());
                      const statusMatch = 
                        deptCompletedStatusFilter === "All" ||
                        (deptCompletedStatusFilter === "Approved" && (r.status?.toLowerCase() === "approved" || r.status?.toLowerCase() === "completed")) ||
                        (deptCompletedStatusFilter === "Forwarded" && r.status?.toLowerCase() === "forwarded") ||
                        (deptCompletedStatusFilter === "Rejected" && r.status?.toLowerCase() === "rejected");
                      return searchMatch && statusMatch;
                    }).map((request) => (
                      <div key={request.id} className="mobile-card">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`w-1.5 h-1.5 rounded-full ${request.status?.toLowerCase() === 'rejected' ? 'bg-[#EF4444]' : 'bg-[#10B981]'}`}></div>
                              <span className="text-xs font-bold text-[#6B7280]">{request.id}</span>
                            </div>
                            <h4 className="text-sm font-bold text-[#111827]">{request.department}</h4>
                            <div className="text-[11px] text-[#6B7280]">{request.organization}</div>
                          </div>
                          <Badge className={`status-badge ${request.status?.toLowerCase() === 'approved' || request.status?.toLowerCase() === 'completed' ? 'approved' : request.status?.toLowerCase() === 'forwarded' ? 'forward' : 'reject'}`}>
                            {request.status}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-3">
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Requested By</span>
                            <span className="text-xs font-medium text-[#111827]">{request.submittedBy || request.requestedBy || "Ahmed Al-Mansoori"}</span>
                          </div>
                          <div className="flex flex-col text-right">
                            <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Req. Date</span>
                            <span className="text-xs font-medium text-[#111827]">{request.requestedDate || "10 Mar 2026"}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Action By</span>
                            <span className="text-xs font-medium text-[#111827]">
                              {request.status?.toLowerCase() === "approved" || request.status?.toLowerCase() === "completed" ? (request.approvedBy || "Jawaher Rashed") : 
                               request.status?.toLowerCase() === "rejected" ? (request.rejectedBy || "Layla Ahmed") : 
                               (request.forwardedBy || "Ahmed Al-Mansoori")}
                            </span>
                          </div>
                          <div className="flex flex-col text-right">
                            <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Action Date</span>
                            <span className="text-xs font-medium text-[#111827]">
                              {request.status?.toLowerCase() === "approved" || request.status?.toLowerCase() === "completed" ? (request.approvedDate || "10 Mar 2026") : 
                               request.status?.toLowerCase() === "rejected" ? (request.rejectedDate || "16 Mar 2026") : 
                               (request.forwardedDate || "14 Mar 2026")}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-2 bg-[#F9FAFB] rounded-lg border border-[#F1F5F9]">
                          <span className="text-[10px] text-[#9CA3AF] uppercase font-bold block mb-1">Type</span>
                          <span className="text-xs font-medium text-[#111827]">{request.type}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* User Request Tab */}
            <TabsContent value="user-request">
              <Tabs defaultValue="user-pending">
                {/* Secondary line tabs */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-[#E5E7EB] mb-4 pr-1 gap-4">
<TabsList className="bg-transparent h-auto p-0 gap-0">
                    <TabsTrigger value="user-pending" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#EF4444] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#EF4444] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>Pending</span>
                    </TabsTrigger>
                    
                    <TabsTrigger value="user-completed" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#10B981] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#10B981] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span>Completed</span>
                    </TabsTrigger>
</TabsList>


<TabsContent value="user-pending" className="mt-0 !m-0 p-0 border-0 flex-1 flex flex-col md:flex-row justify-end md:justify-start lg:justify-end" tabIndex={-1}>
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full justify-end md:justify-start lg:justify-end">
        <div className="flex items-center gap-2 w-full sm:max-w-[320px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search pending requests..."
              value={userRequestPendingSearch}
              onChange={(e) => setUserRequestPendingSearch(e.target.value)}
              className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px]"
            />
          </div>
          {/* Mobile Date Filter Icon */}
          <div className="sm:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-[36px] w-[36px] rounded-[10px] border-[#E5E7EB] bg-white">
                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-4" align="end">
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Filter by Date</h4>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">From Date</Label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="dd-mm-yyyy"
                          onFocus={(e) => e.target.type = 'date'}
                          onBlur={(e) => e.target.type = 'text'}
                          value={userRequestPendingDateRange.from}
                          onChange={(e) => setUserRequestPendingDateRange({ ...userRequestPendingDateRange, from: e.target.value })}
                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">To Date</Label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="dd-mm-yyyy"
                          onFocus={(e) => e.target.type = 'date'}
                          onBlur={(e) => e.target.type = 'text'}
                          value={userRequestPendingDateRange.to}
                          onChange={(e) => setUserRequestPendingDateRange({ ...userRequestPendingDateRange, to: e.target.value })}
                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        {/* Desktop Date Range */}
        <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={userRequestPendingDateRange.from}
              onChange={(e) => setUserRequestPendingDateRange({ ...userRequestPendingDateRange, from: e.target.value })}
              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={userRequestPendingDateRange.to}
              onChange={(e) => setUserRequestPendingDateRange({ ...userRequestPendingDateRange, to: e.target.value })}
              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>

<TabsContent value="user-completed" className="mt-0 !m-0 p-0 border-0 flex-1 flex flex-col md:flex-row justify-end md:justify-start lg:justify-end" tabIndex={-1}>
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full justify-end md:justify-start lg:justify-end">
        <div className="flex items-center gap-2 w-full sm:max-w-[320px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search completed requests..."
              value={userRequestCompletedSearch}
              onChange={(e) => setUserRequestCompletedSearch(e.target.value)}
              className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
            />
          </div>
          {/* Mobile Date Filter Icon */}
          <div className="sm:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-[36px] w-[36px] rounded-[10px] border-[#E5E7EB] bg-white">
                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-4" align="end">
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Filter by Date</h4>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">From Date</Label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="dd-mm-yyyy"
                          onFocus={(e) => e.target.type = 'date'}
                          onBlur={(e) => e.target.type = 'text'}
                          value={userRequestCompletedDateRange.from}
                          onChange={(e) => setUserRequestCompletedDateRange({ ...userRequestCompletedDateRange, from: e.target.value })}
                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">To Date</Label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="dd-mm-yyyy"
                          onFocus={(e) => e.target.type = 'date'}
                          onBlur={(e) => e.target.type = 'text'}
                          value={userRequestCompletedDateRange.to}
                          onChange={(e) => setUserRequestCompletedDateRange({ ...userRequestCompletedDateRange, to: e.target.value })}
                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Status Select with Chevron */}
        <div className="relative w-full sm:w-[120px]">
          <select 
            value={userRequestCompletedStatusFilter} 
            onChange={(e) => setUserRequestCompletedStatusFilter(e.target.value)} 
            className="w-full px-3 pr-9 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none" 
            style={{cursor: 'pointer'}}
          >
            <option value="All">All</option>
            <option value="Approved">Approved</option>
            <option value="Forwarded">Forwarded</option>
            <option value="Rejected">Rejected</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
        </div>

        {/* Desktop Date Range */}
        <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={userRequestCompletedDateRange.from}
              onChange={(e) => setUserRequestCompletedDateRange({ ...userRequestCompletedDateRange, from: e.target.value })}
              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={userRequestCompletedDateRange.to}
              onChange={(e) => setUserRequestCompletedDateRange({ ...userRequestCompletedDateRange, to: e.target.value })}
              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>
</div>
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
                  .user-group-table .grp-sticky-actions { position: sticky; right: 0; z-index: 3; background: inherit; text-align: left; }
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
                <TabsContent value="user-pending" className="mt-0">
                  {/* Desktop Table View */}
                  <div className="hidden md:block scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white" style={{position:'relative'}}>
                        <table className="user-group-table">
                          <thead>
                            <tr>
                              <th className="grp-sticky-expand" style={{width:'44px'}}></th>
                              <th className="grp-sticky-id" style={{left:'44px'}}>Group ID</th>
                              <th>Users</th>
                              <th>Requested by</th>
                              <th>Requested Date</th>
                              <th>Uploaded File</th>
                              <th className="grp-sticky-actions">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {filteredUserRequestPendingGroups.map((group) => (
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

                                    {/* Requested By */}
                                    <td className="font-medium whitespace-nowrap text-[#374151]">
                                      {group.users[0]?.name}
                                    </td>

                                    {/* Requested Date */}
                                    <td className="whitespace-nowrap">
                                      <div className="flex items-center gap-2 text-[#374151]">
                                        <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                        {group.dateCreated}
                                      </div>
                                    </td>

                                    {/* Uploaded File */}
                                    <td className="whitespace-nowrap">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            className="flex items-center gap-2 px-3 py-1.5 bg-[#F5F6F8] hover:bg-[#E5E7EB] rounded-lg border border-[#E5E7EB] text-[12px] font-medium text-[#374151] transition-colors"
                                            onClick={() => {
                                              setFileViewerOpen({open: true, fileName: group.fileName, fileSize: group.fileSize});
                                              setSelectedPrintData({
                                                requesterName: group.users[0]?.name || "Ahmed Al-Mansoori",
                                                designation: "Department Manager",
                                                contact: "33887711",
                                                email: group.users[0]?.email || "a.mansoori@gov.bh",
                                                organization: group.users[0]?.organization || "Department of GIS",
                                                users: group.users.map((u: any) => ({
                                                  cpr: "920101234",
                                                  name: u.name,
                                                  contact: "33221122",
                                                  email: u.email,
                                                  designation: "Technician",
                                                  department: u.department,
                                                  role: u.role
                                                }))
                                              });
                                            }}
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
                                              className="flex items-center justify-center w-8 h-8 bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20 rounded-full transition-colors font-bold border border-[#F59E0B]/20"
                                              onClick={(e) => { 
                                                e.stopPropagation(); 
                                                setSelectedForwardRequest({ id: group.id, service: 'User Request Group' }); 
                                                setForwardDialogOpen(true); 
                                              }}
                                            >
                                              <Forward className="w-4 h-4" />
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent className="bg-gray-800 text-white text-xs">Forward</TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button 
                                              className="flex items-center justify-center w-8 h-8 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 rounded-full transition-colors font-bold border border-[#EF4444]/20"
                                              onClick={(e) => { e.stopPropagation(); setRejectDialog({open: true, requestId: group.id}); }}
                                            >
                                              <X className="w-4 h-4" />
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

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {filteredUserRequestPendingGroups.map((group) => (
                      <div key={group.id} className="mobile-card !p-0 overflow-hidden">
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full"></div>
                                <span className="text-xs font-bold text-[#6B7280]">{group.id}</span>
                              </div>
                              <h4 className="text-sm font-bold text-[#111827]">{group.usersCount} Users Requested</h4>
                            </div>
                            <div className="flex gap-2">
                              <button 
                                className="w-8 h-8 flex items-center justify-center bg-[#F59E0B]/10 text-[#F59E0B] rounded-full border border-[#F59E0B]/20"
                                onClick={() => {
                                  setSelectedForwardRequest({ id: group.id, service: 'User Request Group' }); 
                                  setForwardDialogOpen(true);
                                }}
                              >
                                <Forward className="w-4 h-4" />
                              </button>
                              <button 
                                className="w-8 h-8 flex items-center justify-center bg-[#EF4444]/10 text-[#EF4444] rounded-full border border-[#EF4444]/20"
                                onClick={() => setRejectDialog({open: true, requestId: group.id})}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 mb-3">
                            <div className="p-2 bg-[#F9FAFB] rounded-lg border border-[#F1F5F9]">
                              <span className="text-[10px] text-[#9CA3AF] uppercase font-bold block mb-1">Requested By</span>
                              <span className="text-xs font-medium text-[#111827]">{group.users[0]?.name}</span>
                            </div>
                            <div className="p-2 bg-[#F9FAFB] rounded-lg border border-[#F1F5F9]">
                              <span className="text-[10px] text-[#9CA3AF] uppercase font-bold block mb-1">Date</span>
                              <span className="text-xs font-medium text-[#111827]">{group.dateCreated}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <button
                              className="flex items-center gap-2 px-3 py-1.5 bg-[#F5F6F8] rounded-lg border border-[#E5E7EB] text-[11px] font-medium text-[#374151]"
                              onClick={() => setFileViewerOpen({open: true, fileName: group.fileName, fileSize: group.fileSize})}
                            >
                              <FileText className="w-3.5 h-3.5 text-[#EF4444]" />
                              <span className="truncate max-w-[120px]">{group.fileName}</span>
                            </button>
                            
                            <button
                              className={`flex items-center gap-1 text-[11px] font-bold uppercase transition-colors ${expandedGroupRow === group.id ? 'text-[#3B82F6]' : 'text-[#6B7280]'}`}
                              onClick={() => setExpandedGroupRow(expandedGroupRow === group.id ? null : group.id)}
                            >
                              {expandedGroupRow === group.id ? 'Hide Members' : 'View Members'}
                              {expandedGroupRow === group.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>

                        {/* Mobile Expanded Members */}
                        {expandedGroupRow === group.id && (
                          <div className="bg-[#F9FAFB] border-t border-[#F1F5F9] p-4 space-y-3">
                            {group.users.map((member: any, idx: number) => (
                              <div key={idx} className="bg-white p-3 rounded-xl border border-[#F1F5F9] shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#DC2626] text-xs font-bold shrink-0">
                                    {member.name.charAt(0)}
                                  </div>
                                  <div>
                                    <h5 className="text-xs font-bold text-[#111827]">{member.name}</h5>
                                    <p className="text-[10px] text-[#6B7280]">{member.email}</p>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {member.role.split(',').map((role: string, ridx: number) => (
                                    <span key={ridx} className="px-2 py-0.5 bg-[#EFF6FF] text-[#3B82F6] border border-[#BFDBFE] rounded-full text-[9px] font-bold">
                                      {role.trim()}
                                    </span>
                                  ))}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-[10px]">
                                  <div>
                                    <span className="text-[#9CA3AF] font-bold uppercase block">Org</span>
                                    <span className="text-[#374151] font-medium">{member.organization}</span>
                                  </div>
                                  <div>
                                    <span className="text-[#9CA3AF] font-bold uppercase block text-right">Dept</span>
                                    <span className="text-[#374151] font-medium block text-right">{member.department}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>


                <TabsContent value="user-completed" className="mt-0">
                  {/* Desktop Table View */}
                  <div className="hidden md:block scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                        <table className="user-group-table">
                          <thead>
                            <tr>
                              <th className="grp-sticky-expand" style={{width:'44px'}}></th>
                              <th className="grp-sticky-id" style={{left:'44px'}}>Group ID</th>
                              <th>Users</th>
                              <th>Requested by</th>
                              <th>Requested Date</th>
                              <th>Action by</th>
                              <th>Action date</th>
                              <th>Uploaded File</th>
                              <th className="grp-sticky-actions" style={{paddingRight: '16px'}}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {filteredUserRequestCompletedGroups.filter(group => {
                                const searchMatch = !userRequestCompletedSearch || group.id.toLowerCase().includes(userRequestCompletedSearch.toLowerCase()) || group.users[0]?.name.toLowerCase().includes(userRequestCompletedSearch.toLowerCase());
                                const statusMatch = 
                                  (userRequestCompletedStatusFilter === "All" ||
                                  (userRequestCompletedStatusFilter === "Approved" && (group.status?.toLowerCase() === "approved" || group.status?.toLowerCase() === "completed")) ||
                                  (userRequestCompletedStatusFilter === "Forwarded" && group.status?.toLowerCase() === "forwarded") ||
                                  (userRequestCompletedStatusFilter === "Rejected" && group.status?.toLowerCase() === "rejected"));
                                return searchMatch && statusMatch;
                              }).map((group) => (
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
                                        <div className={`w-1.5 h-1.5 rounded-full ${group.status?.toLowerCase() === 'completed' || group.status?.toLowerCase() === 'approved' ? 'bg-[#10B981]' : group.status?.toLowerCase() === 'forwarded' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}></div>
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

                                    {/* Requested By */}
                                    <td className="font-medium whitespace-nowrap text-[#374151]">
                                      {group.users[0]?.name}
                                    </td>

                                    {/* Requested Date */}
                                    <td className="whitespace-nowrap">
                                      <div className="flex items-center gap-2 text-[#374151]">
                                        <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                        {group.dateCreated}
                                      </div>
                                    </td>

                                    <td className="font-medium whitespace-nowrap text-[#374151]">
                                      {group.status?.toLowerCase() === "approved" || group.status?.toLowerCase() === "completed" ? (group.approvedBy || "Jawaher Rashed") : 
                                       group.status?.toLowerCase() === "rejected" ? (group.rejectedBy || "Layla Ahmed") : 
                                       (group.forwardedBy || "Ahmed Al-Mansoori")}
                                    </td>
                                    <td className="whitespace-nowrap">
                                      <div className="flex items-center gap-2 text-[#374151]">
                                        <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                        {group.status?.toLowerCase() === "approved" || group.status?.toLowerCase() === "completed" ? (group.approvedDate || "20 Mar 2026") : 
                                         group.status?.toLowerCase() === "rejected" ? (group.rejectedDate || "21 Mar 2026") : 
                                         (group.forwardedDate || "19 Mar 2026")}
                                      </div>
                                    </td>

                                    {/* Uploaded File */}
                                    <td className="whitespace-nowrap">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button
                                            className="flex items-center gap-2 px-3 py-1.5 bg-[#F5F6F8] hover:bg-[#E5E7EB] rounded-lg border border-[#E5E7EB] text-[12px] font-medium text-[#374151] transition-colors"
                                            onClick={() => {
                                              setFileViewerOpen({open: true, fileName: group.fileName, fileSize: group.fileSize});
                                              setSelectedPrintData({
                                                requesterName: group.users[0]?.name || "Jawaher Rashed",
                                                designation: "Director",
                                                contact: "17245566",
                                                email: group.users[0]?.email || "j.rashed@nha.gov.bh",
                                                organization: "National Health Authority",
                                                users: group.users.map((u: any) => ({
                                                  cpr: "880412532",
                                                  name: u.name,
                                                  contact: "33445566",
                                                  email: u.email,
                                                  designation: "Officer",
                                                  department: u.department,
                                                  role: u.role
                                                }))
                                              });
                                            }}
                                          >
                                            <FileText className="w-3.5 h-3.5 text-[#EF4444]" />
                                            <span className="max-w-[100px] truncate">{group.fileName}</span>
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-800 text-white text-xs">
                                          {group.fileName} | {group.fileSize}
                                        </TooltipContent>
                                      </Tooltip>
                                    </td>

                                    {/* Status - sticky right */}
                                    <td className="grp-sticky-actions">
                                      <div className="flex items-center justify-end" style={{paddingRight: '16px'}}>
                                        <Badge className={`status-badge ${group.status?.toLowerCase() === 'approved' || group.status?.toLowerCase() === 'completed' ? 'approved' : group.status?.toLowerCase() === 'forwarded' ? 'forward' : 'reject'}`}>
                                          {group.status}
                                        </Badge>
                                      </div>
                                    </td>
                                  </tr>

                                  {expandedGroupRow === group.id && (
                                    <tr className="expanded-content-row">
                                      <td colSpan={9} style={{padding:'0 !important'}}>
                                        <div style={{animation: 'fadeIn 0.25s ease', padding: '16px 20px 20px 20px', background: '#F9FAFB'}}>
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

                  {/* Mobile Card View */}
                  <div className="md:hidden space-y-4">
                    {filteredUserRequestCompletedGroups.filter(group => {
                      const searchMatch = !userRequestCompletedSearch || group.id.toLowerCase().includes(userRequestCompletedSearch.toLowerCase()) || group.users[0]?.name.toLowerCase().includes(userRequestCompletedSearch.toLowerCase());
                      const statusMatch = 
                        (userRequestCompletedStatusFilter === "All" ||
                        (userRequestCompletedStatusFilter === "Approved" && (group.status?.toLowerCase() === "approved" || group.status?.toLowerCase() === "completed")) ||
                        (userRequestCompletedStatusFilter === "Forwarded" && group.status?.toLowerCase() === "forwarded") ||
                        (userRequestCompletedStatusFilter === "Rejected" && group.status?.toLowerCase() === "rejected"));
                      return searchMatch && statusMatch;
                    }).map((group) => (
                      <div key={group.id} className="mobile-card !p-0 overflow-hidden">
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${group.status?.toLowerCase() === 'completed' || group.status?.toLowerCase() === 'approved' ? 'bg-[#10B981]' : group.status?.toLowerCase() === 'forwarded' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}></div>
                                <span className="text-xs font-bold text-[#6B7280]">{group.id}</span>
                              </div>
                              <h4 className="text-sm font-bold text-[#111827]">{group.usersCount} Users Group</h4>
                            </div>
                            <Badge className={`status-badge ${group.status?.toLowerCase() === 'approved' || group.status?.toLowerCase() === 'completed' ? 'approved' : group.status?.toLowerCase() === 'forwarded' ? 'forward' : 'reject'}`}>
                              {group.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-3">
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Requested By</span>
                              <span className="text-xs font-medium text-[#111827]">{group.users[0]?.name}</span>
                            </div>
                            <div className="flex flex-col text-right">
                              <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Req. Date</span>
                              <span className="text-xs font-medium text-[#111827]">{group.dateCreated}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Action By</span>
                              <span className="text-xs font-medium text-[#111827]">
                                {group.status?.toLowerCase() === "approved" || group.status?.toLowerCase() === "completed" ? (group.approvedBy || "Jawaher Rashed") : 
                                 group.status?.toLowerCase() === "rejected" ? (group.rejectedBy || "Layla Ahmed") : 
                                 (group.forwardedBy || "Ahmed Al-Mansoori")}
                              </span>
                            </div>
                            <div className="flex flex-col text-right">
                              <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Action Date</span>
                              <span className="text-xs font-medium text-[#111827]">
                                {group.status?.toLowerCase() === "approved" || group.status?.toLowerCase() === "completed" ? (group.approvedDate || "20 Mar 2026") : 
                                 group.status?.toLowerCase() === "rejected" ? (group.rejectedDate || "21 Mar 2026") : 
                                 (group.forwardedDate || "19 Mar 2026")}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <button
                              className="flex items-center gap-2 px-3 py-1.5 bg-[#F5F6F8] rounded-lg border border-[#E5E7EB] text-[11px] font-medium text-[#374151]"
                              onClick={() => setFileViewerOpen({open: true, fileName: group.fileName, fileSize: group.fileSize})}
                            >
                              <FileText className="w-3.5 h-3.5 text-[#EF4444]" />
                              <span className="truncate max-w-[120px]">{group.fileName}</span>
                            </button>
                            
                            <button
                              className={`flex items-center gap-1 text-[11px] font-bold uppercase transition-colors ${expandedGroupRow === group.id ? 'text-[#3B82F6]' : 'text-[#6B7280]'}`}
                              onClick={() => setExpandedGroupRow(expandedGroupRow === group.id ? null : group.id)}
                            >
                              {expandedGroupRow === group.id ? 'Hide Members' : 'View Members'}
                              {expandedGroupRow === group.id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>

                        {/* Mobile Expanded Members */}
                        {expandedGroupRow === group.id && (
                          <div className="bg-[#F9FAFB] border-t border-[#F1F5F9] p-4 space-y-3">
                            {group.users.map((member: any, idx: number) => (
                              <div key={idx} className="bg-white p-3 rounded-xl border border-[#F1F5F9] shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                  <div className="w-8 h-8 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#DC2626] text-xs font-bold shrink-0">
                                    {member.name.charAt(0)}
                                  </div>
                                  <div>
                                    <h5 className="text-xs font-bold text-[#111827]">{member.name}</h5>
                                    <p className="text-[10px] text-[#6B7280]">{member.email}</p>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  {member.role.split(',').map((role: string, ridx: number) => (
                                    <span key={ridx} className="px-2 py-0.5 bg-[#EFF6FF] text-[#3B82F6] border border-[#BFDBFE] rounded-full text-[9px] font-bold">
                                      {role.trim()}
                                    </span>
                                  ))}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-[10px]">
                                  <div>
                                    <span className="text-[#9CA3AF] font-bold uppercase block">Org</span>
                                    <span className="text-[#374151] font-medium">{member.organization}</span>
                                  </div>
                                  <div>
                                    <span className="text-[#9CA3AF] font-bold uppercase block text-right">Dept</span>
                                    <span className="text-[#374151] font-medium block text-right">{member.department}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>
            {/* Data Access Tab (Duplicated from Department) */}
            <TabsContent value="data-access">
              <Tabs defaultValue="dept-pending">
                {/* Secondary line tabs */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-[#E5E7EB] mb-4 pr-1 gap-4">
<TabsList className="bg-transparent h-auto p-0 gap-0">
  <TabsTrigger value="dept-pending" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#EF4444] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#EF4444] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>Pending</span>
                    </TabsTrigger>
                    
                    <TabsTrigger value="dept-completed" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#10B981] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#10B981] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span>Completed</span>
                    </TabsTrigger>
</TabsList>

<TabsContent value="dept-completed" className="mt-0 !m-0 p-0 border-0 flex-1 flex flex-col md:flex-row justify-end md:justify-start lg:justify-end" tabIndex={-1}>
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full justify-end md:justify-start lg:justify-end">
        <div className="flex items-center gap-2 w-full sm:max-w-[320px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search completed requests..."
              value={dataAccessCompletedSearch}
              onChange={(e) => setDataAccessCompletedSearch(e.target.value)}
              className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
            />
          </div>
          {/* Mobile Date Filter Icon */}
          <div className="sm:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-[36px] w-[36px] rounded-[10px] border-[#E5E7EB] bg-white">
                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-4" align="end">
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Filter by Date</h4>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">From Date</Label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="dd-mm-yyyy"
                          onFocus={(e) => e.target.type = 'date'}
                          onBlur={(e) => e.target.type = 'text'}
                          value={dataAccessCompletedDateRange.from}
                          onChange={(e) => setDataAccessCompletedDateRange({ ...dataAccessCompletedDateRange, from: e.target.value })}
                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">To Date</Label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="dd-mm-yyyy"
                          onFocus={(e) => e.target.type = 'date'}
                          onBlur={(e) => e.target.type = 'text'}
                          value={dataAccessCompletedDateRange.to}
                          onChange={(e) => setDataAccessCompletedDateRange({ ...dataAccessCompletedDateRange, to: e.target.value })}
                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Status Select with Chevron */}
        <div className="relative w-full sm:w-[124px]">
          <select 
            value={dataAccessCompletedStatusFilter} 
            onChange={(e) => setDataAccessCompletedStatusFilter(e.target.value)} 
            className="w-full px-3 pr-9 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none" 
            style={{cursor: 'pointer'}}
          >
            <option value="All">All</option>
            <option value="Approved">Approved</option>
            <option value="Forwarded">Forwarded</option>
            <option value="Rejected">Rejected</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
        </div>

        {/* Desktop Date Range */}
        <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={dataAccessCompletedDateRange.from}
              onChange={(e) => setDataAccessCompletedDateRange({ ...dataAccessCompletedDateRange, from: e.target.value })}
              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={dataAccessCompletedDateRange.to}
              onChange={(e) => setDataAccessCompletedDateRange({ ...dataAccessCompletedDateRange, to: e.target.value })}
              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>

<TabsContent value="dept-pending" className="mt-0 !m-0 p-0 border-0 flex-1 flex flex-col md:flex-row justify-end md:justify-start lg:justify-end" tabIndex={-1}>
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full justify-end md:justify-start lg:justify-end">
        <div className="flex items-center gap-2 w-full sm:max-w-[320px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search pending requests..."
              value={deptPendingSearch}
              onChange={(e) => setDeptPendingSearch(e.target.value)}
              className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px]"
            />
          </div>
          {/* Mobile Date Filter Icon */}
          <div className="sm:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-[36px] w-[36px] rounded-[10px] border-[#E5E7EB] bg-white">
                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-4" align="end">
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Filter by Date</h4>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">From Date</Label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="dd-mm-yyyy"
                          onFocus={(e) => e.target.type = 'date'}
                          onBlur={(e) => e.target.type = 'text'}
                          value={deptPendingDateRange.from}
                          onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, from: e.target.value })}
                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">To Date</Label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="dd-mm-yyyy"
                          onFocus={(e) => e.target.type = 'date'}
                          onBlur={(e) => e.target.type = 'text'}
                          value={deptPendingDateRange.to}
                          onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, to: e.target.value })}
                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Desktop Date Range */}
        <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={deptPendingDateRange.from}
              onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, from: e.target.value })}
              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={deptPendingDateRange.to}
              onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, to: e.target.value })}
              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>

                </div>

                <TabsContent value="dept-pending" className="mt-0">
                  <div className="mt-4">
                    {/* Desktop Table View */}
                    <div className="hidden md:block scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white" style={{position:'relative'}}>
                      <table className="user-group-table w-full">
                        <thead>
                          <tr>
                            <th className="grp-sticky-expand" style={{width:'44px'}}></th>
                            <th className="grp-sticky-id" style={{left:'44px'}}>Requested Organization</th>
                            <th>Requested Department</th>
                            <th>Requested By</th>
                            <th>Requested Date</th>
                            <th>Uploaded File</th>
                            <th className="grp-sticky-actions">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <TooltipProvider delayDuration={100}>
                            {Array.from(new Set(dataAccessPendingRequests.map(r => r.entity))).map((entity) => {
                              const reqs = dataAccessPendingRequests.filter(r => r.entity === entity);
                              const firstReq = reqs[0];
                              return (
                                <React.Fragment key={entity}>
                                  <tr className={expandedDataAccessRow === entity ? 'is-expanded' : ''}>
                                    <td className="grp-sticky-expand" style={{left:'0', width:'44px', paddingRight:'0'}}>
                                      <button
                                        className={`expand-btn ${expandedDataAccessRow === entity ? 'active' : ''}`}
                                        onClick={() => setExpandedDataAccessRow(expandedDataAccessRow === entity ? null : entity)}
                                        title={expandedDataAccessRow === entity ? 'Collapse' : 'Expand services'}
                                      >
                                        {expandedDataAccessRow === entity ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                      </button>
                                    </td>
                                    <td className="grp-sticky-id font-semibold text-[#111827] whitespace-nowrap" style={{left:'44px'}}>
                                      <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full"></div>
                                        {entity === 'Information & eGovernment Authority' ? 'Urban Planning Dept' : 'Ministry of Housing'}
                                      </div>
                                    </td>
                                    <td className="whitespace-nowrap">
                                      <span className="text-[#374151] font-medium">{entity === 'Information & eGovernment Authority' ? 'GIS Section' : 'Infrastructure Unit'}</span>
                                    </td>
                                    <td className="whitespace-nowrap">
                                      <span className="font-medium text-[#374151]">{firstReq.requester}</span>
                                    </td>
                                    <td className="whitespace-nowrap">
                                      <div className="flex items-center gap-2 text-[#374151]">
                                        <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                        {firstReq.date}
                                      </div>
                                    </td>
                                    <td className="whitespace-nowrap">
                                      <div 
                                        className="flex items-center gap-2 px-3 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full w-max group cursor-pointer hover:bg-[#F3F4F6] transition-colors"
                                        onClick={() => {
                                          setPdfViewerOpen(true);
                                          setViewingFileName(`${(entity === 'Information & eGovernment Authority' ? 'Urban Planning Dept' : 'Ministry of Housing').replace(/\s+/g, '_')}_Docs.pdf`);
                                          setSelectedPrintData({
                                            requesterName: firstReq.requester,
                                            designation: "Department Admin",
                                            contact: "33884422",
                                            email: "requester@gov.bh",
                                            organization: entity,
                                            users: reqs.map(r => ({
                                              cpr: "960512842",
                                              name: r.requester, // Using requester as user for this example
                                              contact: "33445566",
                                              email: "user@gov.bh",
                                              designation: "Analyst",
                                              department: "GIS Section",
                                              role: "Reviewer"
                                            }))
                                          });
                                        }}
                                      >
                                        <FileText className="w-3.5 h-3.5 text-[#EF4444]" />
                                        <span className="text-[12px] font-medium text-[#374151] group-hover:text-[#111827] transition-colors truncate max-w-[150px]">{(entity === 'Information & eGovernment Authority' ? 'Urban Planning Dept' : 'Ministry of Housing').replace(/\s+/g, '_')}_Docs.pdf</span>
                                      </div>
                                    </td>
                                    <td className="grp-sticky-actions">
                                      <div className="flex items-center justify-end gap-2 pr-2">
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button 
                                              className="w-[32px] h-[32px] flex items-center justify-center rounded-full bg-[#FEF3C7] text-[#F59E0B] hover:bg-[#F59E0B] hover:text-white transition-colors shadow-sm"
                                              onClick={(e) => { 
                                                e.stopPropagation(); 
                                                setForwardingEntity(entity);
                                                setDataAccessForwardDialogOpen(true); 
                                              }}
                                            >
                                              <Forward className="w-[16px] h-[16px]" strokeWidth={2.5} />
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Forward</TooltipContent>
                                        </Tooltip>
                                        
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <button 
                                              className="w-[32px] h-[32px] flex items-center justify-center rounded-full bg-[#FEF2F2] text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-colors shadow-sm"
                                              onClick={(e) => { e.stopPropagation(); setRejectDialog({open: true, requestId: entity}); }}
                                            >
                                              <X className="w-[18px] h-[18px]" strokeWidth={2.5} />
                                            </button>
                                          </TooltipTrigger>
                                          <TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Reject</TooltipContent>
                                        </Tooltip>
                                      </div>
                                    </td>
                                  </tr>

                                  {/* Expanded Dropdown Content */}
                                  {expandedDataAccessRow === entity && (
                                    <tr className="expanded-content-row">
                                      <td colSpan={7} style={{padding: '0 !important'}}>
                                        <div style={{animation: 'fadeIn 0.25s ease', padding: '16px 20px 20px 20px', background: '#F9FAFB'}}>
                                          <div className="flex items-center justify-between mb-4 px-2">
                                            <div>
                                              <h4 className="font-bold text-[#111827] text-[15px]">Requested Services</h4>
                                              <p className="text-[#6B7280] text-[13px] mt-0.5">Full list of services requested by {entity === 'Information & eGovernment Authority' ? 'Urban Planning Dept' : 'Ministry of Housing'}</p>
                                            </div>
                                            <div className="px-3 py-1.5 bg-[#EFF6FF] text-[#3B82F6] rounded-full text-[12px] font-bold border border-[#BFDBFE]">
                                              3 Services
                                            </div>
                                          </div>

                                          <div className="rounded-xl border border-[#F3F4F6] overflow-hidden bg-white shadow-sm">
                                            <table className="nested-member-table" style={{tableLayout:'fixed', width:'100%'}}>
                                              <colgroup>
                                                <col style={{width: (isSuperAdmin || isOrgAdmin) ? '35%' : '85%'}} />
                                                {(isSuperAdmin || isOrgAdmin) && <col style={{width: '25%'}} />}
                                                {(isSuperAdmin || isOrgAdmin) && <col style={{width: '25%'}} />}
                                                <col style={{width: '15%'}} />
                                              </colgroup>
                                              <thead>
                                                <tr>
                                                  <th style={{textAlign:'left'}}>Service Name</th>
                                                  {(isSuperAdmin || isOrgAdmin) && <th style={{textAlign:'left'}}>Requested Org</th>}
                                                  {(isSuperAdmin || isOrgAdmin) && <th style={{textAlign:'left'}}>Requested Dept</th>}
                                                  <th style={{textAlign:'center'}}>Active</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {['Addresses', 'AdminBoundary', 'Administrative_Boundary_UPDA'].map((svc, idx) => {
                                                  const isChecked = true; // All displayed are active
                                                  return (
                                                    <tr key={idx}>
                                                      <td className="font-semibold text-[#111827]">{svc}</td>
                                                      {(isSuperAdmin || isOrgAdmin) && <td className="text-[#374151]">{entity === 'Information & eGovernment Authority' ? 'Urban Planning Dept' : 'Ministry of Housing'}</td>}
                                                      {(isSuperAdmin || isOrgAdmin) && <td className="text-[#374151]">{entity === 'Information & eGovernment Authority' ? 'GIS Section' : 'Infrastructure Unit'}</td>}
                                                      <td style={{textAlign:'center', paddingRight:'20px'}}>
                                                        <div className={`mx-auto w-[18px] h-[18px] rounded border flex items-center justify-center cursor-pointer transition-all ${isChecked ? 'bg-[#EF4444] border-none shadow-sm' : 'border-[#D1D5DB] hover:border-[#6B7280]'}`}>
                                                          {isChecked && <Check className="w-3.5 h-3.5 text-white stroke-[3.5px]" />}
                                                        </div>
                                                      </td>
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
                              );
                            })}
                          </TooltipProvider>
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                      {Array.from(new Set(dataAccessPendingRequests.map(r => r.entity))).map((entity) => {
                        const reqs = dataAccessPendingRequests.filter(r => r.entity === entity);
                        const firstReq = reqs[0];
                        const displayOrg = entity === 'Information & eGovernment Authority' ? 'Urban Planning Dept' : 'Ministry of Housing';
                        const displayDept = entity === 'Information & eGovernment Authority' ? 'GIS Section' : 'Infrastructure Unit';
                        
                        return (
                          <div key={entity} className="mobile-card !p-0 overflow-hidden">
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full"></div>
                                    <span className="text-xs font-bold text-[#6B7280]">{displayOrg}</span>
                                  </div>
                                  <h4 className="text-sm font-bold text-[#111827]">{displayDept}</h4>
                                </div>
                                <div className="flex gap-2">
                                  <button 
                                    className="w-8 h-8 flex items-center justify-center bg-[#F59E0B]/10 text-[#F59E0B] rounded-full border border-[#F59E0B]/20"
                                    onClick={() => {
                                      setForwardingEntity(entity);
                                      setDataAccessForwardDialogOpen(true);
                                    }}
                                  >
                                    <Forward className="w-4 h-4" />
                                  </button>
                                  <button 
                                    className="w-8 h-8 flex items-center justify-center bg-[#EF4444]/10 text-[#EF4444] rounded-full border border-[#EF4444]/20"
                                    onClick={() => setRejectDialog({open: true, requestId: entity})}
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2 mb-3">
                                <div className="p-2 bg-[#F9FAFB] rounded-lg border border-[#F1F5F9]">
                                  <span className="text-[10px] text-[#9CA3AF] uppercase font-bold block mb-1">Requested By</span>
                                  <span className="text-xs font-medium text-[#111827]">{firstReq.requester}</span>
                                </div>
                                <div className="p-2 bg-[#F9FAFB] rounded-lg border border-[#F1F5F9]">
                                  <span className="text-[10px] text-[#9CA3AF] uppercase font-bold block mb-1">Date</span>
                                  <span className="text-xs font-medium text-[#111827]">{firstReq.date}</span>
                                </div>
                              </div>

                              <div className="flex justify-between items-center">
                                <button
                                  className="flex items-center gap-2 px-3 py-1.5 bg-[#F5F6F8] rounded-lg border border-[#E5E7EB] text-[11px] font-medium text-[#374151]"
                                  onClick={() => {
                                    setPdfViewerOpen(true);
                                    setViewingFileName(`${displayOrg.replace(/\s+/g, '_')}_Docs.pdf`);
                                  }}
                                >
                                  <FileText className="w-3.5 h-3.5 text-[#EF4444]" />
                                  <span className="truncate max-w-[120px]">{displayOrg.replace(/\s+/g, '_')}_Docs.pdf</span>
                                </button>
                                
                                <button
                                  className={`flex items-center gap-1 text-[11px] font-bold uppercase transition-colors ${expandedDataAccessRow === entity ? 'text-[#3B82F6]' : 'text-[#6B7280]'}`}
                                  onClick={() => setExpandedDataAccessRow(expandedDataAccessRow === entity ? null : entity)}
                                >
                                  {expandedDataAccessRow === entity ? 'Hide Services' : 'View Services'}
                                  {expandedDataAccessRow === entity ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                                </button>
                              </div>
                            </div>

                            {/* Mobile Expanded Services */}
                            {expandedDataAccessRow === entity && (
                              <div className="bg-[#F9FAFB] border-t border-[#F1F5F9] p-4 space-y-2">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-[10px] font-bold text-[#9CA3AF] uppercase">Service Name</span>
                                  <span className="text-[10px] font-bold text-[#9CA3AF] uppercase">Active</span>
                                </div>
                                {['Addresses', 'AdminBoundary', 'Administrative_Boundary_UPDA'].map((svc, idx) => (
                                  <div key={idx} className="bg-white p-3 rounded-lg border border-[#F1F5F9] flex justify-between items-center shadow-sm">
                                    <span className="text-xs font-bold text-[#111827]">{svc}</span>
                                    <div className="w-5 h-5 rounded bg-[#EF4444] flex items-center justify-center">
                                      <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="dept-completed" className="mt-0">
                  <div className="mt-4">
                    {/* Desktop Table View */}
                    <div className="hidden md:block scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white" style={{position:'relative'}}>
                      <table className="user-group-table w-full">
                        <thead>
                          <tr>
                            <th className="grp-sticky-expand" style={{width:'44px'}}></th>
                            <th className="grp-sticky-id" style={{left:'44px'}}>Requested Organization</th>
                            <th>Requested Department</th>
                            <th>Requested By</th>
                            <th>Requested Date</th>
                            <th>Action by</th>
                            <th>Action date</th>
                            <th>Uploaded File</th>
                            <th className="grp-sticky-actions">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <TooltipProvider delayDuration={100}>
                            {Array.from(new Set(dataAccessCompletedRequests.filter(r => {
                                const searchMatch = !dataAccessCompletedSearch || r.id.toLowerCase().includes(dataAccessCompletedSearch.toLowerCase()) || (r.requester && r.requester.toLowerCase().includes(dataAccessCompletedSearch.toLowerCase())) || (r.service && r.service.toLowerCase().includes(dataAccessCompletedSearch.toLowerCase()));
                                const statusValue = r.status || "Approved";
                                const statusMatch = dataAccessCompletedStatusFilter === 'All' || statusValue.toLowerCase() === dataAccessCompletedStatusFilter.toLowerCase();
                                const fromDateMatch = !dataAccessCompletedDateRange.from || new Date(r.appDate || r.approvedDate || r.requestedDate) >= new Date(dataAccessCompletedDateRange.from);
                                const toDateMatch = !dataAccessCompletedDateRange.to || new Date(r.appDate || r.approvedDate || r.requestedDate) <= new Date(dataAccessCompletedDateRange.to);
                                return searchMatch && statusMatch && fromDateMatch && toDateMatch;
                            }).map(r => r.id))).map((id) => {
                              const request = dataAccessCompletedRequests.find(r => r.id === id)!;
                              return (
                                <React.Fragment key={id}>
                                  <tr className={expandedDataAccessCmpRow === id ? 'is-expanded' : ''}>
                                    <td className="grp-sticky-expand" style={{left:'0', width:'44px', paddingRight:'0'}}>
                                      <button
                                        className={`expand-btn ${expandedDataAccessCmpRow === id ? 'active' : ''}`}
                                        onClick={() => setExpandedDataAccessCmpRow(expandedDataAccessCmpRow === id ? null : id)}
                                        title={expandedDataAccessCmpRow === id ? 'Collapse' : 'Expand services'}
                                      >
                                        {expandedDataAccessCmpRow === id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                      </button>
                                    </td>
                                    <td className="grp-sticky-id font-semibold text-[#111827] whitespace-nowrap" style={{left:'44px'}}>
                                      <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
                                        National Health Authority
                                      </div>
                                    </td>
                                    <td className="whitespace-nowrap">
                                      <span className="text-[#374151] font-medium">Public Health Unit</span>
                                    </td>
                                    <td className="whitespace-nowrap">
                                      <span className="font-medium text-[#374151]">{request.requester || "Jawaher Rashed"}</span>
                                    </td>
                                    <td className="whitespace-nowrap">
                                      <div className="flex items-center gap-2 text-[#374151]">
                                        <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                        {request.requestedDate}
                                      </div>
                                    </td>
                                    <td className="whitespace-nowrap">
                                      <span className="inline-flex items-center px-[10px] py-[4px] rounded-full text-[12px] font-medium bg-[#E6F0FA] text-[#3D72A2]">
                                        {request.status?.toLowerCase() === "approved" || !request.status ? (request.approvedBy || "Jawaher Rashed") : 
                                         request.status?.toLowerCase() === "rejected" ? (request.rejectedBy || "Layla Ahmed") : 
                                         (request.forwardedBy || "Ahmed Al-Mansoori")}
                                      </span>
                                    </td>
                                    <td className="whitespace-nowrap">
                                      <div className="flex items-center gap-2 text-[#374151]">
                                        <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                        {request.status?.toLowerCase() === "approved" || !request.status ? (request.appDate || request.approvedDate || "20 Jan 2025") : 
                                         request.status?.toLowerCase() === "rejected" ? (request.rejDate || request.rejectedDate || "21 Jan 2025") : 
                                         (request.fwdDate || request.forwardedDate || "18 Jan 2025")}
                                      </div>
                                    </td>
                                    <td className="whitespace-nowrap">
                                      <div 
                                        className="flex items-center gap-2 px-3 py-1.5 bg-[#F9FAFB] border border-[#E5E7EB] rounded-full w-max group cursor-pointer hover:bg-[#F3F4F6] transition-colors"
                                        onClick={() => {
                                          setPdfViewerOpen(true);
                                          setViewingFileName("National_Health_Authority_Docs.pdf");
                                          setSelectedPrintData({
                                            requesterName: request.requester || "Jawaher Rashed",
                                            designation: "Director",
                                            contact: "17245566",
                                            email: "j.rashed@nha.gov.bh",
                                            organization: "National Health Authority",
                                            users: [
                                              {
                                                cpr: "880412532",
                                                name: request.requester || "Jawaher Rashed",
                                                contact: "33221144",
                                                email: "user@nha.gov.bh",
                                                designation: "Officer",
                                                department: "Public Health Unit",
                                                role: "Contributor"
                                              }
                                            ]
                                          });
                                        }}
                                      >
                                        <FileText className="w-3.5 h-3.5 text-[#EF4444]" />
                                        <span className="text-[12px] font-medium text-[#374151] truncate max-w-[120px]">National_Health_Authority_Docs.pdf</span>
                                      </div>
                                    </td>
                                    <td className="grp-sticky-actions">
                                      <div className="flex items-center justify-end pr-2">
                                        <span className={`status-badge ${(request.status || "Approved").toLowerCase().includes("approve") ? "approved" : (request.status || "Approved").toLowerCase() === "forwarded" ? "forward" : "reject"}`}>
                                          {request.status || "Approved"}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>

                                  {expandedDataAccessCmpRow === id && (
                                    <tr className="expanded-content-row">
                                      <td colSpan={9} style={{padding: '0 !important'}}>
                                        <div style={{animation: 'fadeIn 0.25s ease', padding: '16px 20px 20px 20px', background: '#F9FAFB'}}>
                                          <div className="flex items-center justify-between mb-4 px-2">
                                            <div>
                                              <h4 className="font-bold text-[#111827] text-[15px]">Approved Services</h4>
                                              <p className="text-[#6B7280] text-[13px] mt-0.5">Full list of services approved for National Health Authority</p>
                                            </div>
                                            <div className="px-3 py-1.5 bg-[#ECFDF5] text-[#065F46] rounded-full text-[12px] font-bold border border-[#A7F3D0]">
                                              3 Services
                                            </div>
                                          </div>
                                          <div className="rounded-xl border border-[#F3F4F6] overflow-hidden bg-white shadow-sm">
                                            <table className="nested-member-table" style={{tableLayout:'fixed', width:'100%'}}>
                                              <colgroup>
                                                <col style={{width: (isSuperAdmin || isOrgAdmin) ? '25%' : '40%'}} />
                                                {(isSuperAdmin || isOrgAdmin) && <col style={{width:'15%'}} />}
                                                {(isSuperAdmin || isOrgAdmin) && <col style={{width:'15%'}} />}
                                                <col style={{width: (isSuperAdmin || isOrgAdmin) ? '15%' : '20%'}} />
                                                <col style={{width: (isSuperAdmin || isOrgAdmin) ? '15%' : '25%'}} />
                                                <col style={{width: (isSuperAdmin || isOrgAdmin) ? '15%' : '15%'}} />
                                              </colgroup>
                                              <thead>
                                                <tr>
                                                  <th style={{textAlign:'left'}}>Service Name</th>
                                                  {(isSuperAdmin || isOrgAdmin) && <th style={{textAlign:'left'}}>Requested Org</th>}
                                                  {(isSuperAdmin || isOrgAdmin) && <th style={{textAlign:'left'}}>Requested Dept</th>}
                                                  <th style={{textAlign:'left'}}>Action date</th>
                                                  <th style={{textAlign:'left'}}>Action by</th>
                                                  <th style={{textAlign:'center'}}>Active</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {['Addresses', 'AdminBoundary', 'Administrative_Boundary_UPDA'].map((svc, idx) => (
                                                  <tr key={idx}>
                                                    <td className="font-semibold text-[#111827]">{svc}</td>
                                                    {(isSuperAdmin || isOrgAdmin) && <td className="text-[#374151]">National Health Authority</td>}
                                                    {(isSuperAdmin || isOrgAdmin) && <td className="text-[#374151]">Public Health Unit</td>}
                                                    <td>
                                                      <div className="flex items-center gap-2 text-[13px] text-[#374151]">
                                                        <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                                        {request.status?.toLowerCase() === "approved" || !request.status ? (request.appDate || request.approvedDate || "15 Mar 2026") : 
                                                         request.status?.toLowerCase() === "rejected" ? (request.rejDate || request.rejectedDate || "16 Mar 2026") : 
                                                         (request.fwdDate || request.forwardedDate || "14 Mar 2026")}
                                                      </div>
                                                    </td>
                                                    <td className="text-[#374151]">
                                                      {request.status?.toLowerCase() === "approved" || !request.status ? (request.approvedBy || "Jawaher Rashed") : 
                                                       request.status?.toLowerCase() === "rejected" ? (request.rejectedBy || "Layla Ahmed") : 
                                                       (request.forwardedBy || "Ahmed Al-Mansoori")}
                                                    </td>
                                                    <td style={{textAlign:'center', paddingRight:'20px'}}>
                                                      <div className="mx-auto w-[18px] h-[18px] rounded bg-[#EF4444] border-none shadow-sm flex items-center justify-center">
                                                        <Check className="w-3.5 h-3.5 text-white stroke-[3.5px]" />
                                                      </div>
                                                    </td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </TooltipProvider>
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4 mt-4">
                  {Array.from(new Set(dataAccessCompletedRequests.filter(r => {
                      const searchMatch = !dataAccessCompletedSearch || r.id.toLowerCase().includes(dataAccessCompletedSearch.toLowerCase()) || (r.requester && r.requester.toLowerCase().includes(dataAccessCompletedSearch.toLowerCase())) || (r.service && r.service.toLowerCase().includes(dataAccessCompletedSearch.toLowerCase()));
                      const statusValue = r.status || "Approved";
                      const statusMatch = dataAccessCompletedStatusFilter === 'All' || statusValue.toLowerCase() === dataAccessCompletedStatusFilter.toLowerCase();
                      const fromDateMatch = !dataAccessCompletedDateRange.from || new Date(r.appDate || r.approvedDate || r.requestedDate) >= new Date(dataAccessCompletedDateRange.from);
                      const toDateMatch = !dataAccessCompletedDateRange.to || new Date(r.appDate || r.approvedDate || r.requestedDate) <= new Date(dataAccessCompletedDateRange.to);
                      return searchMatch && statusMatch && fromDateMatch && toDateMatch;
                  }).map(r => r.id))).map((id) => {
                    const request = dataAccessCompletedRequests.find(r => r.id === id)!;
                    const status = request.status || "Approved";
                    const actionBy = status.toLowerCase() === "approved" || status.toLowerCase() === "completed" ? (request.approvedBy || "Jawaher Rashed") : 
                                     status.toLowerCase() === "rejected" ? (request.rejectedBy || "Layla Ahmed") : 
                                     (request.forwardedBy || "Ahmed Al-Mansoori");
                    const actionDate = status.toLowerCase() === "approved" || status.toLowerCase() === "completed" ? (request.appDate || request.approvedDate || "20 Jan 2025") : 
                                       status.toLowerCase() === "rejected" ? (request.rejDate || request.rejectedDate || "21 Jan 2025") : 
                                       (request.fwdDate || request.forwardedDate || "18 Jan 2025");

                    return (
                      <div key={id} className="mobile-card !p-0 overflow-hidden">
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`w-1.5 h-1.5 rounded-full ${status.toLowerCase().includes('approve') || status.toLowerCase() === 'completed' ? 'bg-[#10B981]' : status.toLowerCase() === 'forwarded' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}></div>
                                <span className="text-xs font-bold text-[#6B7280]">National Health Authority</span>
                              </div>
                              <h4 className="text-sm font-bold text-[#111827]">Public Health Unit</h4>
                            </div>
                            <Badge className={`status-badge ${status.toLowerCase().includes('approve') || status.toLowerCase() === 'completed' ? 'approved' : status.toLowerCase() === 'forwarded' ? 'forward' : 'reject'}`}>
                              {status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-y-2 gap-x-4 mb-3">
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Requested By</span>
                              <span className="text-xs font-medium text-[#111827]">{request.requester || "Jawaher Rashed"}</span>
                            </div>
                            <div className="flex flex-col text-right">
                              <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Req. Date</span>
                              <span className="text-xs font-medium text-[#111827]">{request.requestedDate}</span>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Action By</span>
                              <span className="text-xs font-medium text-[#111827]">{actionBy}</span>
                            </div>
                            <div className="flex flex-col text-right">
                              <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Action Date</span>
                              <span className="text-xs font-medium text-[#111827]">{actionDate}</span>
                            </div>
                          </div>

                          <div className="flex justify-between items-center">
                            <button
                              className="flex items-center gap-2 px-3 py-1.5 bg-[#F5F6F8] rounded-lg border border-[#E5E7EB] text-[11px] font-medium text-[#374151]"
                              onClick={() => {
                                setPdfViewerOpen(true);
                                setViewingFileName("National_Health_Authority_Docs.pdf");
                              }}
                            >
                              <FileText className="w-3.5 h-3.5 text-[#EF4444]" />
                              <span className="truncate max-w-[120px]">NHA_Docs.pdf</span>
                            </button>
                            
                            <button
                              className={`flex items-center gap-1 text-[11px] font-bold uppercase transition-colors ${expandedDataAccessCmpRow === id ? 'text-[#3B82F6]' : 'text-[#6B7280]'}`}
                              onClick={() => setExpandedDataAccessCmpRow(expandedDataAccessCmpRow === id ? null : id)}
                            >
                              {expandedDataAccessCmpRow === id ? 'Hide Services' : 'View Services'}
                              {expandedDataAccessCmpRow === id ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>

                        {/* Mobile Expanded Services */}
                        {expandedDataAccessCmpRow === id && (
                          <div className="bg-[#F9FAFB] border-t border-[#F1F5F9] p-4 space-y-3">
                            {['Addresses', 'AdminBoundary', 'Administrative_Boundary_UPDA'].map((svc, idx) => (
                              <div key={idx} className="bg-white p-3 rounded-xl border border-[#F1F5F9] shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                                  <h5 className="text-xs font-bold text-[#111827]">{svc}</h5>
                                  <div className="w-5 h-5 rounded bg-[#EF4444] flex items-center justify-center">
                                    <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-[10px]">
                                  <div>
                                    <span className="text-[#9CA3AF] font-bold uppercase block">Action By</span>
                                    <span className="text-[#374151] font-medium">{actionBy}</span>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[#9CA3AF] font-bold uppercase block">Action Date</span>
                                    <span className="text-[#374151] font-medium">{actionDate}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Spatial Permission Tab */}
            <TabsContent value="spatial-permission">
              <Tabs defaultValue="spatial-pending">
                {/* Secondary line tabs */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-[#E5E7EB] mb-4 pr-1 gap-4">
                  <TabsList className="bg-transparent h-auto p-0 gap-0">
                    <TabsTrigger value="spatial-pending" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#EF4444] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#EF4444] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>Pending</span>
                    </TabsTrigger>
                    <TabsTrigger value="spatial-completed" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#10B981] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#10B981] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span>Completed</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Pending search filters */}
                  <TabsContent value="spatial-pending" className="mt-0 !m-0 p-0 border-0 flex-1 flex flex-col md:flex-row justify-end md:justify-start lg:justify-end" tabIndex={-1}>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 justify-end md:justify-start lg:justify-end w-full">
                        <div className="flex items-center gap-2 w-full sm:max-w-[320px]">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                            <input
                              type="text"
                              placeholder="Search pending requests..."
                              value={spatialPendingSearch}
                              onChange={(e) => setSpatialPendingSearch(e.target.value)}
                              className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px]"
                            />
                          </div>
                          {/* Mobile Date Filter Icon */}
                          <div className="sm:hidden">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="h-[36px] w-[36px] rounded-[10px] border-[#E5E7EB] bg-white">
                                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] p-4" align="end">
                                <div className="flex flex-col gap-4">
                                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Filter by Date</h4>
                                  <div className="space-y-3">
                                    <div className="space-y-1.5">
                                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">From Date</Label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="dd-mm-yyyy"
                                          onFocus={(e) => e.target.type = 'date'}
                                          onBlur={(e) => e.target.type = 'text'}
                                          value={spatialPendingDateRange.from}
                                          onChange={(e) => setSpatialPendingDateRange({ ...spatialPendingDateRange, from: e.target.value })}
                                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                      </div>
                                    </div>
                                    <div className="space-y-1.5">
                                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">To Date</Label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="dd-mm-yyyy"
                                          onFocus={(e) => e.target.type = 'date'}
                                          onBlur={(e) => e.target.type = 'text'}
                                          value={spatialPendingDateRange.to}
                                          onChange={(e) => setSpatialPendingDateRange({ ...spatialPendingDateRange, to: e.target.value })}
                                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        {/* Desktop Date Range */}
                        <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto">
                          <div className="relative flex-1 sm:flex-none">
                            <input
                              type="text"
                              placeholder="dd-mm-yyyy"
                              onFocus={(e) => e.target.type = 'date'}
                              onBlur={(e) => e.target.type = 'text'}
                              value={spatialPendingDateRange.from}
                              onChange={(e) => setSpatialPendingDateRange({ ...spatialPendingDateRange, from: e.target.value })}
                              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                          </div>
                          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
                          <div className="relative flex-1 sm:flex-none">
                            <input
                              type="text"
                              placeholder="dd-mm-yyyy"
                              onFocus={(e) => e.target.type = 'date'}
                              onBlur={(e) => e.target.type = 'text'}
                              value={spatialPendingDateRange.to}
                              onChange={(e) => setSpatialPendingDateRange({ ...spatialPendingDateRange, to: e.target.value })}
                              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                          </div>
                        </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="spatial-completed" className="mt-0 !m-0 p-0 border-0 flex-1 flex flex-col md:flex-row justify-end md:justify-start lg:justify-end" tabIndex={-1}>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 justify-end md:justify-start lg:justify-end w-full">
                        <div className="flex items-center gap-2 w-full sm:max-w-[320px]">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                            <input
                              type="text"
                              placeholder="Search completed requests..."
                              value={spatialCompletedSearch}
                              onChange={(e) => setSpatialCompletedSearch(e.target.value)}
                              className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
                            />
                          </div>
                          {/* Mobile Date Filter Icon */}
                          <div className="sm:hidden">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="h-[36px] w-[36px] rounded-[10px] border-[#E5E7EB] bg-white">
                                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] p-4" align="end">
                                <div className="flex flex-col gap-4">
                                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Filter by Date</h4>
                                  <div className="space-y-3">
                                    <div className="space-y-1.5">
                                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">From Date</Label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="dd-mm-yyyy"
                                          onFocus={(e) => e.target.type = 'date'}
                                          onBlur={(e) => e.target.type = 'text'}
                                          value={spatialCompletedDateRange.from}
                                          onChange={(e) => setSpatialCompletedDateRange({ ...spatialCompletedDateRange, from: e.target.value })}
                                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                      </div>
                                    </div>
                                    <div className="space-y-1.5">
                                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">To Date</Label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="dd-mm-yyyy"
                                          onFocus={(e) => e.target.type = 'date'}
                                          onBlur={(e) => e.target.type = 'text'}
                                          value={spatialCompletedDateRange.to}
                                          onChange={(e) => setSpatialCompletedDateRange({ ...spatialCompletedDateRange, to: e.target.value })}
                                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        {/* Status Select with Chevron */}
                        <div className="relative w-full sm:w-[124px]">
                          <select 
                            value={spatialAccessCompletedStatusFilter} 
                            onChange={(e) => setSpatialAccessCompletedStatusFilter(e.target.value)} 
                            className="w-full px-3 pr-9 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none" 
                            style={{cursor: 'pointer'}}
                          >
                            <option value="Approved">Approved</option>
                            <option value="Forwarded">Forwarded</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                        </div>

                        {/* Desktop Date Range */}
                        <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto">
                          <div className="relative flex-1 sm:flex-none">
                            <input
                              type="text"
                              placeholder="dd-mm-yyyy"
                              onFocus={(e) => e.target.type = 'date'}
                              onBlur={(e) => e.target.type = 'text'}
                              value={spatialCompletedDateRange.from}
                              onChange={(e) => setSpatialCompletedDateRange({ ...spatialCompletedDateRange, from: e.target.value })}
                              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                          </div>
                          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
                          <div className="relative flex-1 sm:flex-none">
                            <input
                              type="text"
                              placeholder="dd-mm-yyyy"
                              onFocus={(e) => e.target.type = 'date'}
                              onBlur={(e) => e.target.type = 'text'}
                              value={spatialCompletedDateRange.to}
                              onChange={(e) => setSpatialCompletedDateRange({ ...spatialCompletedDateRange, to: e.target.value })}
                              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                          </div>
                        </div>
                    </div>
                  </TabsContent>
                </div>

                {/* Pending Table */}
                <TabsContent value="spatial-pending" className="mt-0">
                  <div className="mt-4">
                    {/* Desktop Table View */}
                    <div className="hidden md:block scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                      <table className="dept-pending-table">
                        <thead>
                          <tr>
                            <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Permission Name</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Organization</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Layers</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                            <th className="sticky-col-actions text-[11px] font-bold text-[#6B7280] text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <TooltipProvider delayDuration={100}>
                            {filteredSpatialPending.map((request) => (
                              <tr key={request.id}>
                                <td className="sticky-col-id font-medium text-[#111827] whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full animate-pulse"></div>
                                    {request.id}
                                  </div>
                                </td>
                                <td className="whitespace-nowrap font-medium">{request.permissionName}</td>
                                <td className="whitespace-nowrap">{request.organization}</td>
                                <td className="whitespace-nowrap">
                                  <span className="px-2.5 py-1 bg-[#3D72A2]/10 text-[#3D72A2] rounded-full text-[12px] font-medium border border-[#3D72A2]/20">{request.layers}</span>
                                </td>
                                <td className="font-medium whitespace-nowrap text-[#374151]">
                                  <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-[#6B7280]" />{request.date}</div>
                                </td>
                                <td className="sticky-col-actions">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <Tooltip><TooltipTrigger asChild>
                                      <button className="flex items-center justify-center w-8 h-8 bg-[#FEF3C7] text-[#F59E0B] hover:bg-[#F59E0B] hover:text-white rounded-full transition-all duration-300 shadow-sm border border-[#F59E0B]/20" onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}>
                                        <Forward className="w-4 h-4" strokeWidth={3} />
                                      </button>
                                    </TooltipTrigger><TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Forward</TooltipContent></Tooltip>
                                    <Tooltip><TooltipTrigger asChild>
                                      <button className="flex items-center justify-center w-8 h-8 bg-[#FEF2F2] text-[#EF4444] hover:bg-[#EF4444] hover:text-white rounded-full transition-all duration-300 shadow-sm border border-[#EF4444]/20" onClick={(e) => { e.stopPropagation(); setRejectDialog({open: true, requestId: request.id}); }}>
                                        <X className="w-4 h-4" strokeWidth={3} />
                                      </button>
                                    </TooltipTrigger><TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Reject</TooltipContent></Tooltip>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </TooltipProvider>
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                      {filteredSpatialPending.map((request) => (
                        <div key={request.id} className="mobile-card">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full animate-pulse"></div>
                                <span className="text-xs font-bold text-[#6B7280]">{request.organization}</span>
                              </div>
                              <h4 className="text-sm font-bold text-[#111827]">{request.permissionName}</h4>
                            </div>
                            <span className="px-2.5 py-1 bg-[#3D72A2]/10 text-[#3D72A2] rounded-full text-[10px] font-bold border border-[#3D72A2]/20">{request.layers} Layers</span>
                          </div>

                          <div className="flex justify-between items-center mb-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Requested Date</span>
                              <div className="flex items-center gap-1.5 text-xs font-medium text-[#111827]">
                                <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                {request.date}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button 
                              className="flex-1 flex items-center justify-center gap-2 h-10 bg-[#FEF3C7] text-[#F59E0B] rounded-xl font-bold text-xs border border-[#F59E0B]/20 transition-colors active:bg-[#F59E0B] active:text-white"
                              onClick={() => setApproveDialog({open: true, requestId: request.id})}
                            >
                              <Forward className="w-4 h-4" strokeWidth={2.5} />
                              FORWARD
                            </button>
                            <button 
                              className="flex-1 flex items-center justify-center gap-2 h-10 bg-[#FEF2F2] text-[#EF4444] rounded-xl font-bold text-xs border border-[#EF4444]/20 transition-colors active:bg-[#EF4444] active:text-white"
                              onClick={() => setRejectDialog({open: true, requestId: request.id})}
                            >
                              <X className="w-4 h-4" strokeWidth={2.5} />
                              REJECT
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Completed Table */}
                <TabsContent value="spatial-completed" className="mt-0">
                  <div className="mt-4">
                    {/* Desktop Table View */}
                    <div className="hidden md:block scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                      <table className="org-completed-table">
                        <thead>
                          <tr>
                            <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Permission Name</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Organization</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Layers</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Action by</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Action date</th>
                            <th className="sticky-col-status text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <TooltipProvider delayDuration={100}>
                            {filteredSpatialCompleted.map((request) => (
                              <tr key={request.id}>
                                <td className="sticky-col-id font-medium text-[#111827] whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
                                    {request.id}
                                  </div>
                                </td>
                                <td className="whitespace-nowrap font-medium">{request.permissionName}</td>
                                <td className="whitespace-nowrap">{request.organization}</td>
                                <td className="whitespace-nowrap">
                                  <span className="px-2.5 py-1 bg-[#3D72A2]/10 text-[#3D72A2] rounded-full text-[12px] font-medium border border-[#3D72A2]/20">{request.layers}</span>
                                </td>
                                <td className="font-medium whitespace-nowrap text-[#374151]">
                                  <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-[#6B7280]" />{request.date}</div>
                                </td>
                                <td className="whitespace-nowrap">
                                  {request.status?.toLowerCase() === "approved" || request.status?.toLowerCase() === "completed" ? (request.approvedBy || "Lulwa Saad Mujaddam") : 
                                   request.status?.toLowerCase() === "rejected" ? (request.rejectedBy || "Layla Ahmed") : 
                                   (request.forwardedBy || "Ahmed Al-Mansoori")}
                                </td>
                                <td className="whitespace-nowrap">
                                  <div className="flex items-center gap-2 text-[#374151]">
                                    <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                    {request.status?.toLowerCase() === "approved" || request.status?.toLowerCase() === "completed" ? (request.approvedDate || "15 Mar 2026") : 
                                     request.status?.toLowerCase() === "rejected" ? (request.rejectedDate || "16 Mar 2026") : 
                                     (request.forwardedDate || "14 Mar 2026")}
                                  </div>
                                </td>
                                <td className="sticky-col-status">
                                  <span className={`status-badge ${request.status?.toLowerCase() === 'approved' || request.status?.toLowerCase() === 'completed' ? 'approved' : request.status?.toLowerCase() === 'forwarded' ? 'forward' : 'reject'}`}>
                                    {request.status?.toLowerCase() === 'approved' || request.status?.toLowerCase() === 'completed' ? 'Approved' : request.status?.toLowerCase() === 'forwarded' ? 'Forwarded' : 'Rejected'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </TooltipProvider>
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                      {filteredSpatialCompleted.map((request) => {
                        const status = request.status?.toLowerCase() || 'approved';
                        const actionBy = status === 'approved' || status === 'completed' ? (request.approvedBy || "Lulwa Saad Mujaddam") : 
                                         status === 'rejected' ? (request.rejectedBy || "Layla Ahmed") : 
                                         (request.forwardedBy || "Ahmed Al-Mansoori");
                        const actionDate = status === 'approved' || status === 'completed' ? (request.approvedDate || "15 Mar 2026") : 
                                           status === 'rejected' ? (request.rejectedDate || "16 Mar 2026") : 
                                           (request.forwardedDate || "14 Mar 2026");

                        return (
                          <div key={request.id} className="mobile-card">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <div className={`w-1.5 h-1.5 rounded-full ${status === 'approved' || status === 'completed' ? 'bg-[#10B981]' : status === 'forwarded' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}></div>
                                  <span className="text-xs font-bold text-[#6B7280]">{request.organization}</span>
                                </div>
                                <h4 className="text-sm font-bold text-[#111827]">{request.permissionName}</h4>
                              </div>
                              <Badge className={`status-badge ${status === 'approved' || status === 'completed' ? 'approved' : status === 'forwarded' ? 'forward' : 'reject'}`}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-3">
                              <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Layers</span>
                                <span className="text-xs font-medium text-[#3D72A2]">{request.layers} Total</span>
                              </div>
                              <div className="flex flex-col text-right">
                                <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Requested</span>
                                <span className="text-xs font-medium text-[#111827]">{request.date}</span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Action By</span>
                                <span className="text-xs font-medium text-[#111827] truncate max-w-[120px]">{actionBy}</span>
                              </div>
                              <div className="flex flex-col text-right">
                                <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Action Date</span>
                                <span className="text-xs font-medium text-[#111827]">{actionDate}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Services Creation Tab */}
            <TabsContent value="department-2">
              <Tabs defaultValue="svc-pending">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-[#E5E7EB] mb-4 pr-1 gap-4">
                  <TabsList className="bg-transparent h-auto p-0 gap-0">
                    <TabsTrigger value="svc-pending" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#EF4444] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#EF4444] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>Pending</span>
                    </TabsTrigger>
                    <TabsTrigger value="svc-completed" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#10B981] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#10B981] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span>Completed</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="svc-pending" className="mt-0 !m-0 p-0 border-0 flex-1 flex flex-col md:flex-row justify-end md:justify-start lg:justify-end" tabIndex={-1}>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 justify-end md:justify-start lg:justify-end w-full">
                        <div className="flex items-center gap-2 w-full sm:max-w-[320px]">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                            <input
                              type="text"
                              placeholder="Search pending services..."
                              value={servicesPendingSearch}
                              onChange={(e) => setServicesPendingSearch(e.target.value)}
                              className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px]"
                            />
                          </div>
                          {/* Mobile Date Filter Icon */}
                          <div className="sm:hidden">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="h-[36px] w-[36px] rounded-[10px] border-[#E5E7EB] bg-white">
                                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] p-4" align="end">
                                <div className="flex flex-col gap-4">
                                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Filter by Date</h4>
                                  <div className="space-y-3">
                                    <div className="space-y-1.5">
                                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">From Date</Label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="dd-mm-yyyy"
                                          onFocus={(e) => e.target.type = 'date'}
                                          onBlur={(e) => e.target.type = 'text'}
                                          value={servicesPendingDateRange.from}
                                          onChange={(e) => setServicesPendingDateRange({ ...servicesPendingDateRange, from: e.target.value })}
                                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                      </div>
                                    </div>
                                    <div className="space-y-1.5">
                                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">To Date</Label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="dd-mm-yyyy"
                                          onFocus={(e) => e.target.type = 'date'}
                                          onBlur={(e) => e.target.type = 'text'}
                                          value={servicesPendingDateRange.to}
                                          onChange={(e) => setServicesPendingDateRange({ ...servicesPendingDateRange, to: e.target.value })}
                                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        {/* Desktop Date Range */}
                        <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto">
                          <div className="relative flex-1 sm:flex-none">
                            <input
                              type="text"
                              placeholder="dd-mm-yyyy"
                              onFocus={(e) => e.target.type = 'date'}
                              onBlur={(e) => e.target.type = 'text'}
                              value={servicesPendingDateRange.from}
                              onChange={(e) => setServicesPendingDateRange({ ...servicesPendingDateRange, from: e.target.value })}
                              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                          </div>
                          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
                          <div className="relative flex-1 sm:flex-none">
                            <input
                              type="text"
                              placeholder="dd-mm-yyyy"
                              onFocus={(e) => e.target.type = 'date'}
                              onBlur={(e) => e.target.type = 'text'}
                              value={servicesPendingDateRange.to}
                              onChange={(e) => setServicesPendingDateRange({ ...servicesPendingDateRange, to: e.target.value })}
                              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                          </div>
                        </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="svc-completed" className="mt-0 !m-0 p-0 border-0 flex-1 flex flex-col md:flex-row justify-end md:justify-start lg:justify-end" tabIndex={-1}>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 justify-end md:justify-start lg:justify-end w-full">
                        <div className="flex items-center gap-2 w-full sm:max-w-[320px]">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                            <input
                              type="text"
                              placeholder="Search completed services..."
                              value={servicesCompletedSearch}
                              onChange={(e) => setServicesCompletedSearch(e.target.value)}
                              className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
                            />
                          </div>
                          {/* Mobile Date Filter Icon */}
                          <div className="sm:hidden">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="h-[36px] w-[36px] rounded-[10px] border-[#E5E7EB] bg-white">
                                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] p-4" align="end">
                                <div className="flex flex-col gap-4">
                                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Filter by Date</h4>
                                  <div className="space-y-3">
                                    <div className="space-y-1.5">
                                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">From Date</Label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="dd-mm-yyyy"
                                          onFocus={(e) => e.target.type = 'date'}
                                          onBlur={(e) => e.target.type = 'text'}
                                          value={servicesCompletedDateRange.from}
                                          onChange={(e) => setServicesCompletedDateRange({ ...servicesCompletedDateRange, from: e.target.value })}
                                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                      </div>
                                    </div>
                                    <div className="space-y-1.5">
                                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">To Date</Label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="dd-mm-yyyy"
                                          onFocus={(e) => e.target.type = 'date'}
                                          onBlur={(e) => e.target.type = 'text'}
                                          value={servicesCompletedDateRange.to}
                                          onChange={(e) => setServicesCompletedDateRange({ ...servicesCompletedDateRange, to: e.target.value })}
                                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        {/* Status Select with Chevron */}
                        <div className="relative w-full sm:w-[120px]">
                          <select 
                            value={servicesCreationCompletedStatusFilter} 
                            onChange={(e) => setServicesCreationCompletedStatusFilter(e.target.value)} 
                            className="w-full px-3 pr-9 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none" 
                            style={{cursor: 'pointer'}}
                          >
                            <option value="Approved">Approved</option>
                            <option value="Forwarded">Forwarded</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                        </div>

                        {/* Desktop Date Range */}
                        <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto">
                          <div className="relative flex-1 sm:flex-none">
                            <input
                              type="text"
                              placeholder="dd-mm-yyyy"
                              onFocus={(e) => e.target.type = 'date'}
                              onBlur={(e) => e.target.type = 'text'}
                              value={servicesCompletedDateRange.from}
                              onChange={(e) => setServicesCompletedDateRange({ ...servicesCompletedDateRange, from: e.target.value })}
                              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                          </div>
                          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
                          <div className="relative flex-1 sm:flex-none">
                            <input
                              type="text"
                              placeholder="dd-mm-yyyy"
                              onFocus={(e) => e.target.type = 'date'}
                              onBlur={(e) => e.target.type = 'text'}
                              value={servicesCompletedDateRange.to}
                              onChange={(e) => setServicesCompletedDateRange({ ...servicesCompletedDateRange, to: e.target.value })}
                              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                          </div>
                        </div>
                    </div>
                  </TabsContent>
                </div>

                {/* Pending Table */}
                <TabsContent value="svc-pending" className="mt-0">
                  <div className="scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                    <table className="dept-pending-table">
                      <thead>
                        <tr>
                          <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Service Name</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Type</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Organization / Dept</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Submitted By</th>
                          <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                          <th className="sticky-col-actions text-[11px] font-bold text-[#6B7280] text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <TooltipProvider delayDuration={100}>
                          {filteredServicesPending.map((request) => (
                            <tr key={request.id}>
                              <td className="sticky-col-id font-medium text-[#111827] whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full animate-pulse"></div>
                                  {request.id}
                                </div>
                              </td>
                              <td className="whitespace-nowrap font-medium">{request.serviceName}</td>
                              <td className="whitespace-nowrap">
                                <span className="px-2.5 py-1 bg-[#0099DD]/10 text-[#0099DD] rounded-full text-[12px] font-medium border border-[#0099DD]/20">{request.type}</span>
                              </td>
                              <td className="whitespace-nowrap">
                                <div>{request.organization}</div>
                                <div className="text-[11px] text-[#9CA3AF] mt-0.5">{request.department}</div>
                              </td>
                              <td className="font-medium whitespace-nowrap">{request.requestor}</td>
                              <td className="font-medium whitespace-nowrap text-[#374151]">
                                <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-[#6B7280]" />{request.date}</div>
                              </td>
                              <td className="sticky-col-actions">
                                {isOrgAdmin ? (
                                  <div className="flex justify-center items-center gap-1.5 h-full w-full">
                                    <Tooltip><TooltipTrigger asChild>
                                      <button className="flex items-center justify-center w-8 h-8 bg-[#FEF3C7] text-[#F59E0B] hover:bg-[#F59E0B] hover:text-white rounded-full transition-all duration-300 shadow-sm border border-[#F59E0B]/20" onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}>
                                        <Forward className="w-4 h-4" strokeWidth={3} />
                                      </button>
                                    </TooltipTrigger><TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Forward</TooltipContent></Tooltip>
                                    <Tooltip><TooltipTrigger asChild>
                                      <button className="flex items-center justify-center w-8 h-8 bg-[#FEF2F2] text-[#EF4444] hover:bg-[#EF4444] hover:text-white rounded-full transition-all duration-300 shadow-sm border border-[#EF4444]/20" onClick={(e) => { e.stopPropagation(); setRejectDialog({open: true, requestId: request.id}); }}>
                                        <X className="w-4 h-4" strokeWidth={3} />
                                      </button>
                                    </TooltipTrigger><TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Reject</TooltipContent></Tooltip>
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-end gap-1.5">
                                    {!isReviewer && (<>
                                      <Tooltip><TooltipTrigger asChild>
                                        <button className="flex items-center justify-center w-8 h-8 bg-[#FEF3C7] text-[#F59E0B] hover:bg-[#F59E0B] hover:text-white rounded-full transition-all duration-300 shadow-sm border border-[#F59E0B]/20" onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}>
                                          <Forward className="w-4 h-4" strokeWidth={3} />
                                        </button>
                                      </TooltipTrigger><TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Forward</TooltipContent></Tooltip>
                                      <Tooltip><TooltipTrigger asChild>
                                        <button className="flex items-center justify-center w-8 h-8 bg-[#FEF2F2] text-[#EF4444] hover:bg-[#EF4444] hover:text-white rounded-full transition-all duration-300 shadow-sm border border-[#EF4444]/20" onClick={(e) => { e.stopPropagation(); setRejectDialog({open: true, requestId: request.id}); }}>
                                          <X className="w-4 h-4" strokeWidth={3} />
                                        </button>
                                      </TooltipTrigger><TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Reject</TooltipContent></Tooltip>
                                    </>)}
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

                {/* Completed Table */}
                <TabsContent value="svc-completed" className="mt-0">
                  <div className="pb-6 pt-2">
                    <div className="scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                      <table className="org-completed-table">
                        <thead>
                          <tr>
                            <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Service Name</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Service URL</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Type</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Organization</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Action by</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Action date</th>
                            <th className="sticky-col-status text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <TooltipProvider delayDuration={100}>
                            {filteredServicesCompleted.map((request) => (
                              <tr key={request.id}>
                                <td className="sticky-col-id font-medium text-[#111827] whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
                                    {request.id}
                                  </div>
                                </td>
                                <td className="whitespace-nowrap font-medium">{request.serviceName}</td>
                                <td className="whitespace-nowrap">
                                  <span className="text-[11px] font-mono text-[#0099DD] truncate max-w-[180px] block">{request.url}</span>
                                </td>
                                <td className="whitespace-nowrap">
                                  <span className="px-2.5 py-1 bg-[#0099DD]/10 text-[#0099DD] rounded-full text-[12px] font-medium border border-[#0099DD]/20">{request.type}</span>
                                </td>
                                <td className="whitespace-nowrap">{request.organization}</td>
                                <td className="font-medium whitespace-nowrap text-[#374151]">
                                  <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-[#6B7280]" />{request.date}</div>
                                </td>
                                <td className="whitespace-nowrap">
                                  {request.status?.toLowerCase() === "approved" || request.status?.toLowerCase() === "completed" ? (request.approvedBy || "Lulwa Saad Mujaddam") : 
                                   request.status?.toLowerCase() === "rejected" ? (request.rejectedBy || "Layla Ahmed") : 
                                   (request.forwardedBy || "Ahmed Al-Mansoori")}
                                </td>
                                <td className="whitespace-nowrap">
                                  <div className="flex items-center gap-2 text-[#374151]">
                                    <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                    {request.status?.toLowerCase() === "approved" || request.status?.toLowerCase() === "completed" ? (request.approvedDate || "15 Mar 2026") : 
                                     request.status?.toLowerCase() === "rejected" ? (request.rejectedDate || "16 Mar 2026") : 
                                     (request.forwardedDate || "14 Mar 2026")}
                                  </div>
                                </td>
                                <td className="sticky-col-status">
                                  <span className={`status-badge ${request.status?.toLowerCase() === 'approved' || request.status?.toLowerCase() === 'completed' ? 'approved' : request.status?.toLowerCase() === 'forwarded' ? 'forward' : 'reject'}`}>
                                    {request.status?.toLowerCase() === 'approved' || request.status?.toLowerCase() === 'completed' ? 'Approved' : request.status?.toLowerCase() === 'forwarded' ? 'Forwarded' : 'Rejected'}
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


            <TabsContent value="data-download">
              <Tabs defaultValue="download-pending">
                {/* Secondary line tabs */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-[#E5E7EB] mb-4 pr-1 gap-4">
<TabsList className="bg-transparent h-auto p-0 gap-0">
                    <TabsTrigger value="download-pending" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#EF4444] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#EF4444] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>Pending</span>
                    </TabsTrigger>
                    
                    <TabsTrigger value="download-completed" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#10B981] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#10B981] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span>Completed</span>
                    </TabsTrigger>
</TabsList>


<TabsContent value="download-pending" className="mt-0 !m-0 p-0 border-0 flex-1 flex flex-col md:flex-row justify-end md:justify-start lg:justify-end" tabIndex={-1}>
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 justify-end md:justify-start lg:justify-end w-full">
        <div className="flex items-center gap-2 w-full sm:max-w-[320px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search pending requests..."
              value={deptPendingSearch}
              onChange={(e) => setDeptPendingSearch(e.target.value)}
              className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px]"
            />
          </div>
          {/* Mobile Date Filter Icon */}
          <div className="sm:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-[36px] w-[36px] rounded-[10px] border-[#E5E7EB] bg-white">
                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-4" align="end">
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Filter by Date</h4>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">From Date</Label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="dd-mm-yyyy"
                          onFocus={(e) => e.target.type = 'date'}
                          onBlur={(e) => e.target.type = 'text'}
                          value={deptPendingDateRange.from}
                          onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, from: e.target.value })}
                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">To Date</Label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="dd-mm-yyyy"
                          onFocus={(e) => e.target.type = 'date'}
                          onBlur={(e) => e.target.type = 'text'}
                          value={deptPendingDateRange.to}
                          onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, to: e.target.value })}
                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Desktop Date Range */}
        <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={deptPendingDateRange.from}
              onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, from: e.target.value })}
              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={deptPendingDateRange.to}
              onChange={(e) => setDeptPendingDateRange({ ...deptPendingDateRange, to: e.target.value })}
              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>

<TabsContent value="download-completed" className="mt-0 !m-0 p-0 border-0 flex-1 flex flex-col md:flex-row justify-end md:justify-start lg:justify-end" tabIndex={-1}>
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 justify-end md:justify-start lg:justify-end w-full">
        <div className="flex items-center gap-2 w-full sm:max-w-[320px]">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search completed requests..."
              value={dataDownloadCompletedSearch}
              onChange={(e) => setDataDownloadCompletedSearch(e.target.value)}
              className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
            />
          </div>
          {/* Mobile Date Filter Icon */}
          <div className="sm:hidden">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="icon" className="h-[36px] w-[36px] rounded-[10px] border-[#E5E7EB] bg-white">
                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-4" align="end">
                <div className="flex flex-col gap-4">
                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Filter by Date</h4>
                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">From Date</Label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="dd-mm-yyyy"
                          onFocus={(e) => e.target.type = 'date'}
                          onBlur={(e) => e.target.type = 'text'}
                          value={dataDownloadCompletedDateRange.from}
                          onChange={(e) => setDataDownloadCompletedDateRange({ ...dataDownloadCompletedDateRange, from: e.target.value })}
                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">To Date</Label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="dd-mm-yyyy"
                          onFocus={(e) => e.target.type = 'date'}
                          onBlur={(e) => e.target.type = 'text'}
                          value={dataDownloadCompletedDateRange.to}
                          onChange={(e) => setDataDownloadCompletedDateRange({ ...dataDownloadCompletedDateRange, to: e.target.value })}
                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Status Select with Chevron */}
        <div className="relative w-full sm:w-[120px]">
          <select 
            value={dataDownloadCompletedStatusFilter} 
            onChange={(e) => setDataDownloadCompletedStatusFilter(e.target.value)} 
            className="w-full px-3 pr-9 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none" 
            style={{cursor: 'pointer'}}
          >
            <option value="Approved">Approved</option>
            <option value="Forwarded">Forwarded</option>
            <option value="Rejected">Rejected</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
        </div>

        {/* Desktop Date Range */}
        <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={dataDownloadCompletedDateRange.from}
              onChange={(e) => setDataDownloadCompletedDateRange({ ...dataDownloadCompletedDateRange, from: e.target.value })}
              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="dd-mm-yyyy"
              onFocus={(e) => e.target.type = 'date'}
              onBlur={(e) => e.target.type = 'text'}
              value={dataDownloadCompletedDateRange.to}
              onChange={(e) => setDataDownloadCompletedDateRange({ ...dataDownloadCompletedDateRange, to: e.target.value })}
              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
          </div>
        </div>
    </div>
</TabsContent>
</div>
                
                {/* Pending Table */}
                <TabsContent value="download-pending" className="mt-0">
                  <div className="mt-4">
                    {/* Desktop Table View */}
                    <div className="hidden md:block scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                      <table className="dept-pending-table">
                        <thead>
                          <tr>
                            <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Dataset</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Format</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Requested by</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                            <th className="text-[11px] font-bold text-[#6B7280]" style={{minWidth: '240px'}}>Description</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Email</th>
                            <th className="sticky-col-actions text-[11px] font-bold text-[#6B7280] text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <TooltipProvider delayDuration={100}>
                            {dataDownloadPendingRequests.filter(r => !deptPendingSearch || r.id.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.dataset.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.requestor.toLowerCase().includes(deptPendingSearch.toLowerCase())).map((request) => (
                              <tr key={request.id}>
                                <td className="sticky-col-id font-medium text-[#111827] whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full animate-pulse"></div>
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
                                <td className="font-medium whitespace-nowrap text-[#374151]">
                                  <div className="flex items-center gap-2 text-[#374151]">
                                    <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                    {request.date}
                                  </div>
                                </td>
                                <td style={{minWidth: '240px'}}>
                                  <span className="text-[#374151] whitespace-normal inline-block max-w-[220px]">{request.description}</span>
                                </td>
                                <td className="whitespace-nowrap">
                                  <a href={"mailto:" + request.email} className="text-[#3D72A2] hover:underline text-[13px] flex items-center">
                                    {request.email} <span className="ml-1 text-[10px]">↗</span>
                                  </a>
                                </td>
                                <td className="sticky-col-actions">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <Tooltip><TooltipTrigger asChild>
                                      <button className="flex items-center justify-center w-8 h-8 bg-[#ECFDF5] text-[#10B981] hover:bg-[#10B981] hover:text-white rounded-full transition-all duration-300 shadow-sm border border-[#10B981]/20" onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}>
                                        <Check className="w-4 h-4" strokeWidth={3} />
                                      </button>
                                    </TooltipTrigger><TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Approve</TooltipContent></Tooltip>
                                    <Tooltip><TooltipTrigger asChild>
                                      <button className="flex items-center justify-center w-8 h-8 bg-[#FEF2F2] text-[#EF4444] hover:bg-[#EF4444] hover:text-white rounded-full transition-all duration-300 shadow-sm border border-[#EF4444]/20" onClick={(e) => { e.stopPropagation(); setRejectDialog({open: true, requestId: request.id}); }}>
                                        <X className="w-4 h-4" strokeWidth={3} />
                                      </button>
                                    </TooltipTrigger><TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Reject</TooltipContent></Tooltip>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </TooltipProvider>
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                      {dataDownloadPendingRequests.filter(r => !deptPendingSearch || r.id.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.dataset.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.requestor.toLowerCase().includes(deptPendingSearch.toLowerCase())).map((request) => (
                        <div key={request.id} className="mobile-card">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full animate-pulse"></div>
                                <span className="text-xs font-bold text-[#6B7280]">Pending Request</span>
                              </div>
                              <h4 className="text-sm font-bold text-[#111827]">{request.dataset}</h4>
                            </div>
                            <span className="px-2.5 py-1 bg-[#3D72A2]/10 text-[#3D72A2] rounded-full text-[10px] font-bold border border-[#3D72A2]/20">{request.format}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Requested By</span>
                              <span className="text-xs font-medium text-[#111827]">{request.requestor}</span>
                            </div>
                            <div className="flex flex-col text-right">
                              <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Date</span>
                              <span className="text-xs font-medium text-[#111827]">{request.date}</span>
                            </div>
                            <div className="col-span-2 flex flex-col">
                              <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Description</span>
                              <span className="text-xs text-[#4B5563] leading-relaxed">{request.description}</span>
                            </div>
                            <div className="col-span-2 flex flex-col">
                              <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Email</span>
                              <span className="text-xs font-medium text-[#3D72A2]">{request.email}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button 
                              className="flex-1 flex items-center justify-center gap-2 h-10 bg-[#ECFDF5] text-[#10B981] rounded-xl font-bold text-xs border border-[#10B981]/20 transition-colors active:bg-[#10B981] active:text-white"
                              onClick={() => setApproveDialog({open: true, requestId: request.id})}
                            >
                              <Check className="w-4 h-4" strokeWidth={2.5} />
                              APPROVE
                            </button>
                            <button 
                              className="flex-1 flex items-center justify-center gap-2 h-10 bg-[#FEF2F2] text-[#EF4444] rounded-xl font-bold text-xs border border-[#EF4444]/20 transition-colors active:bg-[#EF4444] active:text-white"
                              onClick={() => setRejectDialog({open: true, requestId: request.id})}
                            >
                              <X className="w-4 h-4" strokeWidth={2.5} />
                              REJECT
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>


                <TabsContent value="download-completed" className="mt-0">
                  <div className="mt-4">
                    {/* Desktop Table View */}
                    <div className="hidden md:block scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                      <table className="org-completed-table">
                        <thead>
                          <tr>
                            <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Dataset</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Format</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Requested by</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Action by</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Action date</th>
                            <th className="sticky-col-status text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <TooltipProvider delayDuration={100}>
                            {dataDownloadCompletedRequests.filter(r => {
                                const searchMatch = !dataDownloadCompletedSearch || 
                                  r.id.toLowerCase().includes(dataDownloadCompletedSearch.toLowerCase()) || 
                                  (r.dataset && r.dataset.toLowerCase().includes(dataDownloadCompletedSearch.toLowerCase())) || 
                                  (r.requestedBy && r.requestedBy.toLowerCase().includes(dataDownloadCompletedSearch.toLowerCase())) || 
                                  (r.approvedBy && r.approvedBy.toLowerCase().includes(dataDownloadCompletedSearch.toLowerCase()));
                                const statusMatch = 
                                  (dataDownloadCompletedStatusFilter === "Approved" && (r.status?.toLowerCase() === "approved" || r.status?.toLowerCase() === "completed")) ||
                                  (dataDownloadCompletedStatusFilter === "Forwarded" && r.status?.toLowerCase() === "forwarded") ||
                                  (dataDownloadCompletedStatusFilter === "Rejected" && r.status?.toLowerCase() === "rejected");
                                const dateMatch = (!dataDownloadCompletedDateRange.from || new Date(r.requestedDate) >= new Date(dataDownloadCompletedDateRange.from)) &&
                                                  (!dataDownloadCompletedDateRange.to || new Date(r.requestedDate) <= new Date(dataDownloadCompletedDateRange.to));
                                return searchMatch && statusMatch && dateMatch;
                              }).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2">
                                      <div className={`w-1.5 h-1.5 rounded-full ${request.status === 'Approved' ? 'bg-[#10B981]' : request.status === 'Forwarded' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap font-medium">{request.dataset}</td>
                                  <td className="whitespace-nowrap">
                                    <span className="px-2.5 py-1 bg-[#3D72A2]/10 text-[#3D72A2] rounded-full text-[12px] font-medium border border-[#3D72A2]/20">
                                      {request.format}
                                    </span>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">{request.requestedBy || "Jawaher Rashed"}</td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      {request.requestedDate}
                                    </div>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                      {request.status?.toLowerCase() === "approved" || request.status?.toLowerCase() === "completed" ? (request.approvedBy || "Layla Al-Qassimi") : 
                                       request.status?.toLowerCase() === "rejected" ? (request.rejectedBy || "Layla Ahmed") : 
                                       (request.forwardedBy || "Ahmed Al-Mansoori")}
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                      {request.status?.toLowerCase() === "approved" || request.status?.toLowerCase() === "completed" ? (request.approvedDate || "15 Mar 2026") : 
                                       request.status?.toLowerCase() === "rejected" ? (request.rejectedDate || "16 Mar 2026") : 
                                       (request.forwardedDate || "14 Mar 2026")}
                                  </td>
                                  <td className="sticky-col-status">
                                    <span className={`status-badge ${request.status?.toLowerCase() === 'approved' || request.status?.toLowerCase() === 'completed' ? 'approved' : request.status?.toLowerCase() === 'forwarded' ? 'forward' : 'reject'}`}>
                                      {request.status?.toLowerCase() === 'approved' || request.status?.toLowerCase() === 'completed' ? 'Approved' : request.status?.toLowerCase() === 'forwarded' ? 'Forwarded' : 'Rejected'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </TooltipProvider>
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                      {dataDownloadCompletedRequests.filter(r => {
                          const searchMatch = !dataDownloadCompletedSearch || 
                            r.id.toLowerCase().includes(dataDownloadCompletedSearch.toLowerCase()) || 
                            (r.dataset && r.dataset.toLowerCase().includes(dataDownloadCompletedSearch.toLowerCase()));
                          const statusMatch = 
                            (dataDownloadCompletedStatusFilter === "Approved" && (r.status?.toLowerCase() === "approved" || r.status?.toLowerCase() === "completed")) ||
                            (dataDownloadCompletedStatusFilter === "Forwarded" && r.status?.toLowerCase() === "forwarded") ||
                            (dataDownloadCompletedStatusFilter === "Rejected" && r.status?.toLowerCase() === "rejected");
                          return searchMatch && statusMatch;
                        }).map((request) => {
                          const status = request.status?.toLowerCase() || 'approved';
                          const actionBy = status === 'approved' || status === 'completed' ? (request.approvedBy || "Layla Al-Qassimi") : 
                                           status === 'rejected' ? (request.rejectedBy || "Layla Ahmed") : 
                                           (request.forwardedBy || "Ahmed Al-Mansoori");
                          const actionDate = status === 'approved' || status === 'completed' ? (request.approvedDate || "15 Mar 2026") : 
                                             status === 'rejected' ? (request.rejectedDate || "16 Mar 2026") : 
                                             (request.forwardedDate || "14 Mar 2026");

                          return (
                            <div key={request.id} className="mobile-card">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className={`w-1.5 h-1.5 rounded-full ${status === 'approved' || status === 'completed' ? 'bg-[#10B981]' : status === 'forwarded' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}></div>
                                    <span className="text-xs font-bold text-[#6B7280]">Completed Request</span>
                                  </div>
                                  <h4 className="text-sm font-bold text-[#111827]">{request.dataset}</h4>
                                </div>
                                <Badge className={`status-badge ${status === 'approved' || status === 'completed' ? 'approved' : status === 'forwarded' ? 'forward' : 'reject'}`}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                                <div className="flex flex-col">
                                  <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Requested By</span>
                                  <span className="text-xs font-medium text-[#111827] truncate">{request.requestedBy || "Jawaher Rashed"}</span>
                                </div>
                                <div className="flex flex-col text-right">
                                  <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Date</span>
                                  <span className="text-xs font-medium text-[#111827]">{request.requestedDate}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Action By</span>
                                  <span className="text-xs font-medium text-[#111827] truncate">{actionBy}</span>
                                </div>
                                <div className="flex flex-col text-right">
                                  <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Action Date</span>
                                  <span className="text-xs font-medium text-[#111827]">{actionDate}</span>
                                </div>
                                <div className="col-span-2 flex flex-col pt-1">
                                  <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Format</span>
                                  <span className="text-xs font-medium text-[#3D72A2]">{request.format}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Metadata Tab */}
            <TabsContent value="metadata">
              <Tabs defaultValue="metadata-pending">
                {/* Secondary line tabs */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-[#E5E7EB] mb-4 pr-1 gap-4">
                  <TabsList className="bg-transparent h-auto p-0 gap-0">
                    <TabsTrigger value="metadata-pending" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#EF4444] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#EF4444] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>Pending</span>
                    </TabsTrigger>
                    
                    <TabsTrigger value="metadata-completed" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#10B981] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#10B981] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span>Completed</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="metadata-pending" className="mt-0 !m-0 p-0 border-0 flex-1 flex flex-col md:flex-row justify-end md:justify-start lg:justify-end" tabIndex={-1}>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full justify-end md:justify-start lg:justify-end">
                        <div className="flex items-center gap-2 w-full sm:max-w-[320px]">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                            <input
                              type="text"
                              placeholder="Search pending metadata..."
                              value={metadataPendingSearch}
                              onChange={(e) => setMetadataPendingSearch(e.target.value)}
                              className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px]"
                            />
                          </div>
                          {/* Mobile Date Filter Icon */}
                          <div className="sm:hidden">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="h-[36px] w-[36px] rounded-[10px] border-[#E5E7EB] bg-white">
                                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] p-4" align="end">
                                <div className="flex flex-col gap-4">
                                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Filter by Date</h4>
                                  <div className="space-y-3">
                                    <div className="space-y-1.5">
                                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">From Date</Label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="dd-mm-yyyy"
                                          onFocus={(e) => e.target.type = 'date'}
                                          onBlur={(e) => e.target.type = 'text'}
                                          value={metadataPendingDateRange.from}
                                          onChange={(e) => setMetadataPendingDateRange({ ...metadataPendingDateRange, from: e.target.value })}
                                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                      </div>
                                    </div>
                                    <div className="space-y-1.5">
                                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">To Date</Label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="dd-mm-yyyy"
                                          onFocus={(e) => e.target.type = 'date'}
                                          onBlur={(e) => e.target.type = 'text'}
                                          value={metadataPendingDateRange.to}
                                          onChange={(e) => setMetadataPendingDateRange({ ...metadataPendingDateRange, to: e.target.value })}
                                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        {/* Desktop Date Range */}
                        <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto">
                          <div className="relative flex-1 sm:flex-none">
                            <input
                              type="text"
                              placeholder="dd-mm-yyyy"
                              onFocus={(e) => e.target.type = 'date'}
                              onBlur={(e) => e.target.type = 'text'}
                              value={metadataPendingDateRange.from}
                              onChange={(e) => setMetadataPendingDateRange({ ...metadataPendingDateRange, from: e.target.value })}
                              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                          </div>
                          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
                          <div className="relative flex-1 sm:flex-none">
                            <input
                              type="text"
                              placeholder="dd-mm-yyyy"
                              onFocus={(e) => e.target.type = 'date'}
                              onBlur={(e) => e.target.type = 'text'}
                              value={metadataPendingDateRange.to}
                              onChange={(e) => setMetadataPendingDateRange({ ...metadataPendingDateRange, to: e.target.value })}
                              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                          </div>
                        </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="metadata-completed" className="mt-0 !m-0 p-0 border-0 flex-1 flex flex-col md:flex-row justify-end md:justify-start lg:justify-end" tabIndex={-1}>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full justify-end md:justify-start lg:justify-end">
                        <div className="flex items-center gap-2 w-full sm:max-w-[320px]">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                            <input
                              type="text"
                              placeholder="Search completed metadata..."
                              value={metadataCompletedSearch}
                              onChange={(e) => setMetadataCompletedSearch(e.target.value)}
                              className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
                            />
                          </div>
                          {/* Mobile Date Filter Icon */}
                          <div className="sm:hidden">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="h-[36px] w-[36px] rounded-[10px] border-[#E5E7EB] bg-white">
                                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] p-4" align="end">
                                <div className="flex flex-col gap-4">
                                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Filter by Date</h4>
                                  <div className="space-y-3">
                                    <div className="space-y-1.5">
                                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">From Date</Label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="dd-mm-yyyy"
                                          onFocus={(e) => e.target.type = 'date'}
                                          onBlur={(e) => e.target.type = 'text'}
                                          value={metadataCompletedDateRange.from}
                                          onChange={(e) => setMetadataCompletedDateRange({ ...metadataCompletedDateRange, from: e.target.value })}
                                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                      </div>
                                    </div>
                                    <div className="space-y-1.5">
                                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">To Date</Label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="dd-mm-yyyy"
                                          onFocus={(e) => e.target.type = 'date'}
                                          onBlur={(e) => e.target.type = 'text'}
                                          value={metadataCompletedDateRange.to}
                                          onChange={(e) => setMetadataCompletedDateRange({ ...metadataCompletedDateRange, to: e.target.value })}
                                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        {/* Status Select with Chevron */}
                        <div className="relative w-full sm:w-[120px]">
                          <select 
                            value={metadataCompletedStatusFilter} 
                            onChange={(e) => setMetadataCompletedStatusFilter(e.target.value)} 
                            className="w-full px-3 pr-9 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none" 
                            style={{cursor: 'pointer'}}
                          >
                            <option value="All">All</option>
                            <option value="Approved">Approved</option>
                            <option value="Forwarded">Forwarded</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                        </div>

                        {/* Desktop Date Range */}
                        <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto">
                          <div className="relative flex-1 sm:flex-none">
                            <input
                              type="text"
                              placeholder="dd-mm-yyyy"
                              onFocus={(e) => e.target.type = 'date'}
                              onBlur={(e) => e.target.type = 'text'}
                              value={metadataCompletedDateRange.from}
                              onChange={(e) => setMetadataCompletedDateRange({ ...metadataCompletedDateRange, from: e.target.value })}
                              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                          </div>
                          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
                          <div className="relative flex-1 sm:flex-none">
                            <input
                              type="text"
                              placeholder="dd-mm-yyyy"
                              onFocus={(e) => e.target.type = 'date'}
                              onBlur={(e) => e.target.type = 'text'}
                              value={metadataCompletedDateRange.to}
                              onChange={(e) => setMetadataCompletedDateRange({ ...metadataCompletedDateRange, to: e.target.value })}
                              className="w-full sm:w-[130px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                          </div>
                        </div>
                    </div>
                  </TabsContent>
                </div>
                
                {/* Pending Table */}
                <TabsContent value="metadata-pending" className="mt-0">
                  <div className="mt-4">
                    {/* Desktop Table View */}
                    <div className="hidden md:block scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                      <table className="dept-pending-table w-full">
                        <thead>
                          <tr>
                            <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Layer Name</th>
                            <th className="text-[11px] font-bold text-[#6B7280]" style={{minWidth: '160px'}}>Layer Type</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Requested by</th>
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
                                    <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full animate-pulse"></div>
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
                                            className="flex items-center justify-center w-7 h-7 bg-[#FEF3C7] text-[#F59E0B] hover:bg-[#F59E0B] hover:text-white rounded-full transition-all duration-300 shadow-sm border border-[#F59E0B]/20" 
                                            onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}
                                          >
                                            <Forward className="w-[18px] h-[18px]" strokeWidth={2.5} />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Forward</TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button 
                                            className="flex items-center justify-center w-7 h-7 bg-[#FEF2F2] text-[#EF4444] hover:bg-[#EF4444] hover:text-white rounded-full transition-all duration-300 shadow-sm border border-[#EF4444]/20" 
                                            onClick={(e) => { e.stopPropagation(); setRejectDialog({open: true, requestId: request.id}); }}
                                          >
                                            <X className="w-4 h-4" />
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

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                      {metadataPendingRequests.filter(r => !metadataPendingSearch || r.id.toLowerCase().includes(metadataPendingSearch.toLowerCase()) || r.layerName.toLowerCase().includes(metadataPendingSearch.toLowerCase()) || r.requestor.toLowerCase().includes(metadataPendingSearch.toLowerCase())).map((request) => (
                        <div key={request.id} className="mobile-card">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full animate-pulse"></div>
                                <span className="text-xs font-bold text-[#6B7280]">Pending Metadata</span>
                              </div>
                              <h4 className="text-sm font-bold text-[#111827]">{request.layerName}</h4>
                            </div>
                            <span className="px-2.5 py-1 bg-[#3D72A2]/10 text-[#3D72A2] rounded-full text-[10px] font-bold border border-[#3D72A2]/20">{request.layerType}</span>
                          </div>

                          <div className="flex justify-between items-center mb-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Requested By</span>
                              <span className="text-xs font-medium text-[#111827]">{request.requestor}</span>
                            </div>
                            <div className="flex flex-col text-right">
                              <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Date</span>
                              <div className="flex items-center gap-1 text-xs font-medium text-[#111827]">
                                <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                {request.date}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button 
                              className="flex-1 flex items-center justify-center gap-2 h-10 bg-[#FEF3C7] text-[#F59E0B] rounded-xl font-bold text-xs border border-[#F59E0B]/20 transition-colors active:bg-[#F59E0B] active:text-white"
                              onClick={() => setApproveDialog({open: true, requestId: request.id})}
                            >
                              <Forward className="w-4 h-4" strokeWidth={2.5} />
                              FORWARD
                            </button>
                            <button 
                              className="flex-1 flex items-center justify-center gap-2 h-10 bg-[#FEF2F2] text-[#EF4444] rounded-xl font-bold text-xs border border-[#EF4444]/20 transition-colors active:bg-[#EF4444] active:text-white"
                              onClick={() => setRejectDialog({open: true, requestId: request.id})}
                            >
                              <X className="w-4 h-4" strokeWidth={2.5} />
                              REJECT
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Completed Table */}
                <TabsContent value="metadata-completed" className="mt-0">
                  <div className="mt-4">
                    {/* Desktop Table View */}
                    <div className="hidden md:block scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                      <table className="org-completed-table w-full">
                        <thead>
                          <tr>
                            <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Layer Name</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Layer Type</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Requested by</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Action by</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Action date</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Comments</th>
                            <th className="sticky-col-status text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <TooltipProvider delayDuration={100}>
                            {metadataCompletedRequests.filter(r => {
                                  const searchMatch = !metadataCompletedSearch || r.id.toLowerCase().includes(metadataCompletedSearch.toLowerCase()) || r.layerName.toLowerCase().includes(metadataCompletedSearch.toLowerCase()) || (r.requestor && r.requestor.toLowerCase().includes(metadataCompletedSearch.toLowerCase())) || (r.approvedBy && r.approvedBy.toLowerCase().includes(metadataCompletedSearch.toLowerCase()));
                                  const statusMatch = 
                                    (metadataCompletedStatusFilter === "Approved" && (r.status?.toLowerCase() === "approved" || r.status?.toLowerCase() === "completed")) ||
                                    (metadataCompletedStatusFilter === "Forwarded" && r.status?.toLowerCase() === "forwarded") ||
                                    (metadataCompletedStatusFilter === "Rejected" && r.status?.toLowerCase() === "rejected");
                                  return searchMatch && statusMatch;
                              }).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <div className={`w-1.5 h-1.5 rounded-full ${request.status === 'Approved' ? 'bg-[#10B981]' : request.status === 'Forwarded' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap font-medium">{request.layerName}</td>
                                  <td className="whitespace-nowrap">
                                    <span className="px-2.5 py-1 bg-[#3D72A2]/10 text-[#3D72A2] rounded-full text-[12px] font-medium border border-[#3D72A2]/20">
                                      {request.layerType}
                                    </span>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">{request.requestedBy || "Sara Mohammad"}</td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.requestedDate || "07 Mar 2025"}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap">
                                    {request.status?.toLowerCase() === "approved" || request.status?.toLowerCase() === "completed" ? (request.approvedBy || "Noor Al-Hashimi") : 
                                     request.status?.toLowerCase() === "rejected" ? (request.rejectedBy || "Layla Ahmed") : 
                                     (request.forwardedBy || "Ahmed Al-Mansoori")}
                                  </td>
                                  <td className="whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.status?.toLowerCase() === "approved" || request.status?.toLowerCase() === "completed" ? (request.approvedDate || "13 Mar 2025") : 
                                       request.status?.toLowerCase() === "rejected" ? (request.rejectedDate || "21 Mar 2026") : 
                                       (request.forwardedDate || "19 Mar 2026")}
                                    </div>
                                  </td>
                                  <td><span className="text-[#374151] text-[13px]">Some comments</span></td>
                                  <td className="sticky-col-status">
                                    <span className={`status-badge ${request.status?.toLowerCase() === 'approved' || request.status?.toLowerCase() === 'completed' ? 'approved' : request.status?.toLowerCase() === 'forwarded' ? 'forward' : 'reject'}`}>
                                      {request.status?.toLowerCase() === 'approved' || request.status?.toLowerCase() === 'completed' ? 'Approved' : request.status?.toLowerCase() === 'forwarded' ? 'Forwarded' : 'Rejected'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </TooltipProvider>
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                      {metadataCompletedRequests.filter(r => {
                          const searchMatch = !metadataCompletedSearch || r.id.toLowerCase().includes(metadataCompletedSearch.toLowerCase()) || r.layerName.toLowerCase().includes(metadataCompletedSearch.toLowerCase());
                          const statusMatch = 
                            (metadataCompletedStatusFilter === "Approved" && (r.status?.toLowerCase() === "approved" || r.status?.toLowerCase() === "completed")) ||
                            (metadataCompletedStatusFilter === "Forwarded" && r.status?.toLowerCase() === "forwarded") ||
                            (metadataCompletedStatusFilter === "Rejected" && r.status?.toLowerCase() === "rejected");
                          return searchMatch && statusMatch;
                        }).map((request) => {
                          const status = request.status?.toLowerCase() || 'approved';
                          const actionBy = status === 'approved' || status === 'completed' ? (request.approvedBy || "Noor Al-Hashimi") : 
                                           status === 'rejected' ? (request.rejectedBy || "Layla Ahmed") : 
                                           (request.forwardedBy || "Ahmed Al-Mansoori");
                          const actionDate = status === 'approved' || status === 'completed' ? (request.approvedDate || "13 Mar 2025") : 
                                             status === 'rejected' ? (request.rejectedDate || "21 Mar 2026") : 
                                             (request.forwardedDate || "19 Mar 2026");

                          return (
                            <div key={request.id} className="mobile-card">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className={`w-1.5 h-1.5 rounded-full ${status === 'approved' || status === 'completed' ? 'bg-[#10B981]' : status === 'forwarded' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}></div>
                                    <span className="text-xs font-bold text-[#6B7280]">Completed Metadata</span>
                                  </div>
                                  <h4 className="text-sm font-bold text-[#111827]">{request.layerName}</h4>
                                </div>
                                <Badge className={`status-badge ${status === 'approved' || status === 'completed' ? 'approved' : status === 'forwarded' ? 'forward' : 'reject'}`}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-3">
                                <div className="flex flex-col">
                                  <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Requested By</span>
                                  <span className="text-xs font-medium text-[#111827] truncate">{request.requestedBy || "Sara Mohammad"}</span>
                                </div>
                                <div className="flex flex-col text-right">
                                  <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Date</span>
                                  <span className="text-xs font-medium text-[#111827]">{request.requestedDate || "07 Mar 2025"}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Action By</span>
                                  <span className="text-xs font-medium text-[#111827] truncate">{actionBy}</span>
                                </div>
                                <div className="flex flex-col text-right">
                                  <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Action Date</span>
                                  <span className="text-xs font-medium text-[#111827]">{actionDate}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Type:</span>
                                <span className="text-xs font-medium text-[#3D72A2]">{request.layerType}</span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* Application Users Tab */}
            <TabsContent value="app-users">
              <Tabs defaultValue="app-users-pending">
                {/* Secondary line tabs */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-[#E5E7EB] mb-4 pr-1 gap-4">
                  <TabsList className="bg-transparent h-auto p-0 gap-0">
                    <TabsTrigger value="app-users-pending" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#EF4444] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#EF4444] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#EF4444]"></span>Pending</span>
                    </TabsTrigger>
                    
                    <TabsTrigger value="app-users-completed" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[#10B981] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#10B981] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#10B981]"></span>Completed</span>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="app-users-pending" className="mt-0 !m-0 p-0 border-0 flex-1 flex flex-col md:flex-row justify-end md:justify-start lg:justify-end" tabIndex={-1}>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 justify-end md:justify-start lg:justify-end w-full">
                        <div className="flex items-center gap-2 w-full sm:max-w-[280px]">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                            <input
                              type="text"
                              placeholder="Search pending requests..."
                              value={appUsersPendingSearch}
                              onChange={(e) => setAppUsersPendingSearch(e.target.value)}
                              className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px]"
                            />
                          </div>
                          {/* Mobile Date Filter Icon */}
                          <div className="sm:hidden">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="h-[36px] w-[36px] rounded-[10px] border-[#E5E7EB] bg-white">
                                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] p-4" align="end">
                                <div className="flex flex-col gap-4">
                                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Filter by Date</h4>
                                  <div className="space-y-3">
                                    <div className="space-y-1.5">
                                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">From Date</Label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="dd-mm-yyyy"
                                          onFocus={(e) => e.target.type = 'date'}
                                          onBlur={(e) => e.target.type = 'text'}
                                          value={appUsersPendingDateRange.from}
                                          onChange={(e) => setAppUsersPendingDateRange({ ...appUsersPendingDateRange, from: e.target.value })}
                                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                      </div>
                                    </div>
                                    <div className="space-y-1.5">
                                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">To Date</Label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="dd-mm-yyyy"
                                          onFocus={(e) => e.target.type = 'date'}
                                          onBlur={(e) => e.target.type = 'text'}
                                          value={appUsersPendingDateRange.to}
                                          onChange={(e) => setAppUsersPendingDateRange({ ...appUsersPendingDateRange, to: e.target.value })}
                                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        {/* Desktop Date Range */}
                        <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto">
                          <div className="relative flex-1 sm:flex-none">
                            <input
                              type="text"
                              placeholder="dd-mm-yyyy"
                              onFocus={(e) => e.target.type = 'date'}
                              onBlur={(e) => e.target.type = 'text'}
                              value={appUsersPendingDateRange.from}
                              onChange={(e) => setAppUsersPendingDateRange({ ...appUsersPendingDateRange, from: e.target.value })}
                              className="w-full sm:w-[120px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                          </div>
                          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
                          <div className="relative flex-1 sm:flex-none">
                            <input
                              type="text"
                              placeholder="dd-mm-yyyy"
                              onFocus={(e) => e.target.type = 'date'}
                              onBlur={(e) => e.target.type = 'text'}
                              value={appUsersPendingDateRange.to}
                              onChange={(e) => setAppUsersPendingDateRange({ ...appUsersPendingDateRange, to: e.target.value })}
                              className="w-full sm:w-[120px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                          </div>
                        </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="app-users-completed" className="mt-0 !m-0 p-0 border-0 flex-1 flex flex-col md:flex-row justify-end md:justify-start lg:justify-end" tabIndex={-1}>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1 justify-end md:justify-start lg:justify-end w-full">
                        <div className="flex items-center gap-2 w-full sm:max-w-[280px]">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                            <input
                              type="text"
                              placeholder="Search completed requests..."
                              value={appUsersCompletedSearch}
                              onChange={(e) => setAppUsersCompletedSearch(e.target.value)}
                              className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
                            />
                          </div>
                          {/* Mobile Date Filter Icon */}
                          <div className="sm:hidden">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" size="icon" className="h-[36px] w-[36px] rounded-[10px] border-[#E5E7EB] bg-white">
                                  <Calendar className="w-4 h-4 text-[#6B7280]" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-[300px] p-4" align="end">
                                <div className="flex flex-col gap-4">
                                  <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">Filter by Date</h4>
                                  <div className="space-y-3">
                                    <div className="space-y-1.5">
                                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">From Date</Label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="dd-mm-yyyy"
                                          onFocus={(e) => e.target.type = 'date'}
                                          onBlur={(e) => e.target.type = 'text'}
                                          value={appUsersCompletedDateRange.from}
                                          onChange={(e) => setAppUsersCompletedDateRange({ ...appUsersCompletedDateRange, from: e.target.value })}
                                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                      </div>
                                    </div>
                                    <div className="space-y-1.5">
                                      <Label className="text-[11px] font-bold text-[#6B7280] uppercase">To Date</Label>
                                      <div className="relative">
                                        <input
                                          type="text"
                                          placeholder="dd-mm-yyyy"
                                          onFocus={(e) => e.target.type = 'date'}
                                          onBlur={(e) => e.target.type = 'text'}
                                          value={appUsersCompletedDateRange.to}
                                          onChange={(e) => setAppUsersCompletedDateRange({ ...appUsersCompletedDateRange, to: e.target.value })}
                                          className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                                        />
                                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          </div>
                        </div>

                        {/* Status Select with Chevron */}
                        <div className="relative w-full sm:w-[120px]">
                          <select 
                            value={appUsersCompletedStatusFilter} 
                            onChange={(e) => setAppUsersCompletedStatusFilter(e.target.value)} 
                            className="w-full px-3 pr-9 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none" 
                            style={{cursor: 'pointer'}}
                          >
                            <option value="Approved">Approved</option>
                            <option value="Forwarded">Forwarded</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                        </div>

                        {/* Desktop Date Range */}
                        <div className="hidden sm:flex items-center gap-2 w-full sm:w-auto">
                          <div className="relative flex-1 sm:flex-none">
                            <input
                              type="text"
                              placeholder="dd-mm-yyyy"
                              onFocus={(e) => e.target.type = 'date'}
                              onBlur={(e) => e.target.type = 'text'}
                              value={appUsersCompletedDateRange.from}
                              onChange={(e) => setAppUsersCompletedDateRange({ ...appUsersCompletedDateRange, from: e.target.value })}
                              className="w-full sm:w-[120px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                          </div>
                          <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
                          <div className="relative flex-1 sm:flex-none">
                            <input
                              type="text"
                              placeholder="dd-mm-yyyy"
                              onFocus={(e) => e.target.type = 'date'}
                              onBlur={(e) => e.target.type = 'text'}
                              value={appUsersCompletedDateRange.to}
                              onChange={(e) => setAppUsersCompletedDateRange({ ...appUsersCompletedDateRange, to: e.target.value })}
                              className="w-full sm:w-[120px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none"
                            />
                            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                          </div>
                        </div>
                    </div>
                  </TabsContent>
</div>
                
                {/* Pending Table */}
                <TabsContent value="app-users-pending" className="mt-0">
                  <div className="mt-4">
                    {/* Desktop Table View */}
                    <div className="hidden md:block scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                      <table className="dept-pending-table w-full">
                        <thead>
                          <tr>
                            <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                            <th className="text-[11px] font-bold text-[#6B7280] min-w-[200px]">User Details</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Organization / Dept</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Role</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Requested by</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                            <th className="sticky-col-actions text-[11px] font-bold text-[#6B7280]">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          <TooltipProvider delayDuration={100}>
                            {appUsersPendingRequests.filter(r => !appUsersPendingSearch || r.id.toLowerCase().includes(appUsersPendingSearch.toLowerCase()) || r.name.toLowerCase().includes(appUsersPendingSearch.toLowerCase()) || r.orgDept.toLowerCase().includes(appUsersPendingSearch.toLowerCase())).map((request) => (
                              <tr key={request.id}>
                                <td className="sticky-col-id font-medium text-[#111827]">
                                  <div className="flex items-center gap-2 whitespace-nowrap">
                                    <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full animate-pulse"></div>
                                    {request.id}
                                  </div>
                                </td>
                                <td className="whitespace-nowrap">
                                  {request.name !== 'â€”' ? (
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
                                <td className="font-medium whitespace-nowrap text-[#374151]">{request.requestedBy}</td>
                                <td>
                                  <div className="flex items-center gap-2 text-[#374151]">
                                    <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                    {request.requestedDate}
                                  </div>
                                </td>
                                <td className="sticky-col-actions">
                                  {!isReviewer && (
                                    <div className="flex items-center gap-2">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button 
                                            className="flex items-center justify-center w-7 h-7 bg-[#FEF3C7] text-[#F59E0B] hover:bg-[#F59E0B] hover:text-white rounded-full transition-all duration-300 shadow-sm border border-[#F59E0B]/20" 
                                            onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}
                                          >
                                            <Forward className="w-[18px] h-[18px]" strokeWidth={2.5} />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-800 text-white text-[11px] py-1 px-2.5 rounded-md border-0 shadow-lg">Forward</TooltipContent>
                                      </Tooltip>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button 
                                            className="flex items-center justify-center w-7 h-7 bg-[#FEF2F2] text-[#EF4444] hover:bg-[#EF4444] hover:text-white rounded-full transition-all duration-300 shadow-sm border border-[#EF4444]/20" 
                                            onClick={(e) => { e.stopPropagation(); setRejectDialog({open: true, requestId: request.id}); }}
                                          >
                                            <X className="w-4 h-4" />
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

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                      {appUsersPendingRequests.filter(r => !appUsersPendingSearch || r.id.toLowerCase().includes(appUsersPendingSearch.toLowerCase()) || r.name.toLowerCase().includes(appUsersPendingSearch.toLowerCase()) || r.orgDept.toLowerCase().includes(appUsersPendingSearch.toLowerCase())).map((request) => (
                        <div key={request.id} className="mobile-card">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full animate-pulse"></div>
                                <span className="text-xs font-bold text-[#6B7280]">User Access Request</span>
                              </div>
                              <h4 className="text-sm font-bold text-[#111827]">{request.name}</h4>
                              <p className="text-xs text-[#3D72A2]">{request.email}</p>
                            </div>
                            <span className="px-2.5 py-1 bg-[#F3F4F6] text-[#4B5563] rounded-full text-[10px] font-bold border border-[#E5E7EB]">{request.role}</span>
                          </div>

                          <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-4">
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Organization</span>
                              <span className="text-xs font-medium text-[#111827] truncate">{request.orgDept}</span>
                            </div>
                            <div className="flex flex-col text-right">
                              <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Requested Date</span>
                              <span className="text-xs font-medium text-[#111827]">{request.requestedDate}</span>
                            </div>
                            <div className="col-span-2 flex flex-col">
                              <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Requested By</span>
                              <span className="text-xs font-medium text-[#111827]">{request.requestedBy}</span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button 
                              className="flex-1 flex items-center justify-center gap-2 h-10 bg-[#FEF3C7] text-[#F59E0B] rounded-xl font-bold text-xs border border-[#F59E0B]/20 transition-colors active:bg-[#F59E0B] active:text-white"
                              onClick={() => setApproveDialog({open: true, requestId: request.id})}
                            >
                              <Forward className="w-4 h-4" strokeWidth={2.5} />
                              FORWARD
                            </button>
                            <button 
                              className="flex-1 flex items-center justify-center gap-2 h-10 bg-[#FEF2F2] text-[#EF4444] rounded-xl font-bold text-xs border border-[#EF4444]/20 transition-colors active:bg-[#EF4444] active:text-white"
                              onClick={() => setRejectDialog({open: true, requestId: request.id})}
                            >
                              <X className="w-4 h-4" strokeWidth={2.5} />
                              REJECT
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* Completed Table */}
                <TabsContent value="app-users-completed" className="mt-0">
                  <div className="mt-4">
                    {/* Desktop Table View */}
                    <div className="hidden md:block scrollable-table-container shadow-sm border border-[#E5E7EB] rounded-xl overflow-hidden bg-white">
                      <table className="org-completed-table w-full">
                        <thead>
                          <tr>
                            <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">User Details</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Organization / Dept</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Role</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Requested by</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Action by</th>
                            <th className="text-[11px] font-bold text-[#6B7280]">Action date</th>
                            <th className="sticky-col-status text-left">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          <TooltipProvider delayDuration={100}>
                            {appUsersCompletedRequests.filter(r => {
                                  const searchMatch = !appUsersCompletedSearch || r.id.toLowerCase().includes(appUsersCompletedSearch.toLowerCase()) || r.name.toLowerCase().includes(appUsersCompletedSearch.toLowerCase()) || r.orgDept.toLowerCase().includes(appUsersCompletedSearch.toLowerCase());
                                  const statusMatch = 
                                    (appUsersCompletedStatusFilter === "Approved" && (r.status?.toLowerCase() === "approved" || r.status?.toLowerCase() === "completed")) ||
                                    (appUsersCompletedStatusFilter === "Forwarded" && r.status?.toLowerCase() === "forwarded") ||
                                    (appUsersCompletedStatusFilter === "Rejected" && r.status?.toLowerCase() === "rejected");
                                  return searchMatch && statusMatch;
                              }).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <div className={`w-1.5 h-1.5 rounded-full ${request.status === 'Approved' ? 'bg-[#10B981]' : request.status === 'Forwarded' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap">
                                      <div className="flex flex-col gap-0.5">
                                        <span className="font-bold text-[#111827] text-[13px]">{request.name}</span>
                                        <span className="text-[#3D72A2] text-[12px]">{request.email}</span>
                                      </div>
                                  </td>
                                  <td className="font-medium whitespace-nowrap text-[#374151]">{request.orgDept}</td>
                                  <td className="whitespace-nowrap">
                                    <span className="px-2.5 py-1 bg-[#F3F4F6] text-[#4B5563] rounded-full text-[12px] font-medium border border-[#E5E7EB]">
                                      {request.role}
                                    </span>
                                  </td>
                                  <td className="font-medium whitespace-nowrap text-[#374151]">
                                      {request.requestedBy || "Khalid Ali"}
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.requestedDate}
                                    </div>
                                  </td>
                                  <td className="font-medium whitespace-nowrap text-[#374151]">
                                      {request.status?.toLowerCase() === "approved" || request.status?.toLowerCase() === "completed" ? (request.approvedBy || "Jawaher Rashed") : 
                                       request.status?.toLowerCase() === "rejected" ? (request.rejectedBy || "Layla Ahmed") : 
                                       (request.forwardedBy || "Ahmed Al-Mansoori")}
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
                                      {request.status?.toLowerCase() === "approved" || request.status?.toLowerCase() === "completed" ? (request.approvedDate || "24 Mar 2026") : 
                                       request.status?.toLowerCase() === "rejected" ? (request.rejectedDate || "25 Mar 2026") : 
                                       (request.forwardedDate || "23 Mar 2026")}
                                    </div>
                                  </td>
                                  <td className="sticky-col-status">
                                    <span className={`status-badge ${request.status?.toLowerCase() === 'approved' || request.status?.toLowerCase() === 'completed' ? 'approved' : request.status?.toLowerCase() === 'forwarded' ? 'forward' : 'reject'}`}>
                                      {request.status?.toLowerCase() === 'approved' || request.status?.toLowerCase() === 'completed' ? 'Approved' : request.status?.toLowerCase() === 'forwarded' ? 'Forwarded' : 'Rejected'}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                          </TooltipProvider>
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                      {appUsersCompletedRequests.filter(r => {
                          const searchMatch = !appUsersCompletedSearch || r.id.toLowerCase().includes(appUsersCompletedSearch.toLowerCase()) || r.name.toLowerCase().includes(appUsersCompletedSearch.toLowerCase()) || r.orgDept.toLowerCase().includes(appUsersCompletedSearch.toLowerCase());
                          const statusMatch = 
                            (appUsersCompletedStatusFilter === "Approved" && (r.status?.toLowerCase() === "approved" || r.status?.toLowerCase() === "completed")) ||
                            (appUsersCompletedStatusFilter === "Forwarded" && r.status?.toLowerCase() === "forwarded") ||
                            (appUsersCompletedStatusFilter === "Rejected" && r.status?.toLowerCase() === "rejected");
                          return searchMatch && statusMatch;
                        }).map((request) => {
                          const status = request.status?.toLowerCase() || 'approved';
                          const actionBy = status === 'approved' || status === 'completed' ? (request.approvedBy || "Jawaher Rashed") : 
                                           status === 'rejected' ? (request.rejectedBy || "Layla Ahmed") : 
                                           (request.forwardedBy || "Ahmed Al-Mansoori");
                          const actionDate = status === 'approved' || status === 'completed' ? (request.approvedDate || "24 Mar 2026") : 
                                             status === 'rejected' ? (request.rejectedDate || "25 Mar 2026") : 
                                             (request.forwardedDate || "23 Mar 2026");

                          return (
                            <div key={request.id} className="mobile-card">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <div className="flex items-center gap-2 mb-1">
                                    <div className={`w-1.5 h-1.5 rounded-full ${status === 'approved' || status === 'completed' ? 'bg-[#10B981]' : status === 'forwarded' ? 'bg-[#F59E0B]' : 'bg-[#EF4444]'}`}></div>
                                    <span className="text-xs font-bold text-[#6B7280]">Completed Access Request</span>
                                  </div>
                                  <h4 className="text-sm font-bold text-[#111827]">{request.name}</h4>
                                  <p className="text-xs text-[#3D72A2]">{request.email}</p>
                                </div>
                                <Badge className={`status-badge ${status === 'approved' || status === 'completed' ? 'approved' : status === 'forwarded' ? 'forward' : 'reject'}`}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-3">
                                <div className="flex flex-col">
                                  <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Organization</span>
                                  <span className="text-xs font-medium text-[#111827] truncate">{request.orgDept}</span>
                                </div>
                                <div className="flex flex-col text-right">
                                  <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Date</span>
                                  <span className="text-xs font-medium text-[#111827]">{request.requestedDate}</span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Action By</span>
                                  <span className="text-xs font-medium text-[#111827] truncate">{actionBy}</span>
                                </div>
                                <div className="flex flex-col text-right">
                                  <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Action Date</span>
                                  <span className="text-xs font-medium text-[#111827]">{actionDate}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                                <span className="text-[10px] uppercase font-bold text-[#9CA3AF]">Role:</span>
                                <span className="text-xs font-medium text-[#3D72A2]">{request.role}</span>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>


            {/* User Request Tab */}
            


            <Dialog open={approveDialog.open} onOpenChange={(o) => setApproveDialog({...approveDialog, open: o})}>
              <DialogContent className="p-0 overflow-hidden" style={{maxWidth:'450px', borderRadius:'24px'}}>
                <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                  <X className="h-4 w-4 text-gray-400" />
                </DialogClose>
                <div className="p-10 pb-6 flex flex-col items-center text-center relative">
                  <div className="relative w-24 h-24 mb-6">
                    <div className="absolute inset-0 bg-[#F59E0B] rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,192,127,0.25)]">
                      <div className="w-12 h-12 rounded-full border-4 border-white flex items-center justify-center">
                        <Forward className="w-7 h-7 text-white" strokeWidth={4} />
                      </div>
                    </div>
                  </div>
                  <h3 className="text-[22px] font-bold text-[#1A1A1A] mb-2">Forward Request</h3>
                  <p className="text-[15px] text-[#6B7280] mb-8 leading-relaxed">Are you sure you want to forward request {approveDialog.requestId}?</p>
                  
                  <div className="w-full text-left">
                    <label className="text-[11px] font-bold text-[#6B7280] uppercase tracking-[0.05em] mb-3 block px-1">COMMENTS (OPTIONAL)</label>
                    <textarea 
                      placeholder="Add any additional notes here..."
                      className="w-full min-h-[120px] p-4 rounded-[16px] border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#00C07F] focus:border-[#00C07F] text-[14px] resize-none transition-all placeholder:text-gray-300"
                    />
                  </div>
                </div>
                <div className="px-10 pb-10 flex flex-row gap-4">
                  <Button
                    onClick={() => setApproveDialog({open: false, requestId: ''})}
                    variant="outline"
                    className="flex-1 bg-[#FFFFFF] border border-[#E5E7EB] text-[#6B7280] rounded-full h-[48px] px-6 font-semibold hover:bg-gray-50 transition-all shadow-none text-[15px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setApproveDialog({open: false, requestId: ''})}
                    className="flex-1 bg-[#F59E0B] hover:bg-[#D97706] text-white rounded-full h-[48px] px-6 font-semibold transition-all border-0 shadow-[0_4px_14px_rgba(245,158,11,0.25)] text-[15px]"
                  >
                    Yes, Forward
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* â”€â”€â”€ Reject Dialog â”€â”€â”€ */}
            <Dialog open={rejectDialog.open} onOpenChange={(o) => { 
                if(o) setRejectionReason("");
                setRejectDialog({...rejectDialog, open: o}); 
                if(!o) setRejectionReason(""); 
            }}>
              <DialogContent className="p-0 overflow-hidden" style={{maxWidth:'400px', borderRadius:'16px'}}>
                <div className="p-8 pb-4 flex flex-col items-center text-center relative">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 bg-[#EF4444] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(237,28,36,0.3)]">
                      <XCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Reject Request</h3>
                  <p className="text-[14px] text-[#6B7280]">Please provide a reason for rejecting request {rejectDialog.requestId}</p>
                </div>
                <div className="px-6 pb-6 space-y-5">
                  <div className="space-y-2 text-left">
                    <label className="text-[14px] font-medium text-[#111827]">
                      Rejection Reason <span className="text-[#EF4444]">*</span>
                    </label>
                    <textarea 
                      className="w-full min-h-[100px] p-3 rounded-lg border focus:outline-none transition-colors border-[#E5E7EB] focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]/20 bg-[#F9FAFB] text-[14px] resize-none"
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

            {/* â”€â”€â”€ Document Viewer Dialog â”€â”€â”€ */}
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
                <div className="px-6 py-4 border-t border-[#E5E7EB] bg-white flex justify-end gap-3 flex-shrink-0">
                  <Button 
                    onClick={() => setFileViewerOpen({...fileViewerOpen, open: false})}
                    variant="outline"
                    className="text-[#6B7280] border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-[10px] h-[36px] px-6 font-medium transition-colors"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      if (selectedPrintData) {
                        const html = generateAccessFormHtml(selectedPrintData);
                        const printWindow = window.open('', '_blank');
                        if (printWindow) {
                          printWindow.document.write(html);
                          printWindow.document.close();
                        }
                      }
                    }}
                    className="bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-[10px] h-[36px] px-6 font-medium transition-colors border-0 shadow-sm"
                  >
                    Print
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* â”€â”€â”€ Roles Popover Dialog â”€â”€â”€ */}
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
              <DialogTitle>Forward Request</DialogTitle>
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
                {activeTab === "department-2" && (
                  <div className="text-left space-y-2 pt-2">
                    <Label htmlFor="service-url" className="text-sm font-semibold text-[#1A1A1A]">
                      Add URL <span className="text-[#EF4444]">*</span>
                    </Label>
                    <div className="relative group">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] group-focus-within:text-[#EF4444] transition-colors">
                        <Globe className="w-4 h-4" />
                      </div>
                      <Input
                        id="service-url"
                        placeholder="https://mapservices.geoportal.gov.bh/..."
                        value={serviceUrl}
                        onChange={(e) => setServiceUrl(e.target.value)}
                        className="pl-10 bg-[#F9FAFB] border-[#E5E7EB] focus:ring-[#EF4444] focus:border-[#EF4444] rounded-xl h-11 text-[14px] transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-row gap-3 pt-4">
                <Button
                  onClick={handleApprovalCancel}
                  variant="outline"
                  className="flex-1 bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151] rounded-[10px] h-[36px] px-4 font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApprovalConfirm}
                  className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white rounded-[10px] h-[36px] px-4 font-medium transition-colors border-0 shadow-sm"
                >
                    Yes, Forward
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
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B6B]/20 to-[#EF4444]/20 rounded-full blur-2xl scale-150"></div>

                  {/* Main circle with alert illustration */}
                  <div className="relative w-24 h-24 bg-gradient-to-br from-[#FF6B6B] to-[#EF4444] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(237,28,36,0.4)]">
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
                    Rejection Reason <span className="text-[#EF4444]">*</span>
                  </Label>
                  <Textarea
                    id="rejection-comment"
                    value={rejectionComment}
                    onChange={(e) => setRejectionComment(e.target.value)}
                    placeholder="Enter the reason for rejection..."
                    className="min-h-[120px] bg-[#EBECE8]/30 border-[#B0AAA2]/30 rounded-xl resize-none focus:ring-2 focus:ring-[#EF4444]"
                  />
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-row gap-3 pt-4">
                <Button
                  onClick={handleRejectionCancel}
                  variant="outline"
                  className="flex-1 bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151] rounded-[10px] h-[36px] px-4 font-medium hover:bg-gray-50 transition-colors shadow-sm"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRejectionConfirm}
                  className="flex-1 bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#991B1B] text-white rounded-[10px] h-[36px] shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300 font-bold"
                >
                  Confirm Rejection
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
                    <FileText className="w-4 h-4 text-[#EF4444]" />
                    <span className="font-medium">{groupUploadedFile.name}</span>
                    <span className="text-[#666666]">({(groupUploadedFile.size / 1024).toFixed(2)} KB)</span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleUserGroupUpload}
                  disabled={!groupUploadedFile}
                  className="flex-1 bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#991B1B] text-white rounded-[10px] h-[36px] shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="w-full bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#991B1B] text-white rounded-[10px] h-[36px] shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300 font-semibold"
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
          
          <div className="px-6 py-4 border-t border-[#E5E7EB] bg-white flex justify-end gap-3 flex-shrink-0">
            <Button 
              onClick={() => setPdfViewerOpen(false)}
              variant="outline"
              className="text-[#6B7280] border-[#E5E7EB] hover:bg-[#F9FAFB] rounded-[10px] h-[36px] px-6 font-medium transition-colors"
            >
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (selectedPrintData) {
                  const html = generateAccessFormHtml(selectedPrintData);
                  const printWindow = window.open('', '_blank');
                  if (printWindow) {
                    printWindow.document.write(html);
                    printWindow.document.close();
                  }
                } else {
                  setTimeout(() => window.print(), 100);
                }
              }}
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-[10px] h-[36px] px-6 font-medium transition-colors border-0 shadow-sm"
            >
              Print
            </Button>
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
                  Organization Name <span className="text-[#EF4444]">*</span>
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
                  Organization Name (Arabic) <span className="text-[#EF4444]">*</span>
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
                  value="Information & eGovernment Authority"
                  readOnly
                  className="bg-[#F5F5F5] border border-[#E5E5E5] rounded-[10px] h-[36px] px-4 text-[#1A1A1A]"
                />
              </div>

              {/* Point of Contact */}
              <div className="space-y-2">
                <Label className="text-[#4A4A4A] font-medium text-sm">
                  Point of Contact <span className="text-[#EF4444]">*</span>
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
                  Email <span className="text-[#EF4444]">*</span>
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
                  Phone Number <span className="text-[#EF4444]">*</span>
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
                  Business Description <span className="text-[#EF4444]">*</span>
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

      {/* Forward Data Access Dialog (Upload Signed Document) */}
      <Dialog open={dataAccessForwardDialogOpen} onOpenChange={setDataAccessForwardDialogOpen}>
        <DialogContent className="sm:max-w-[480px] bg-white rounded-2xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0 overflow-hidden">
          {/* Header */}
          <div className="px-7 pt-7 pb-5 border-b border-[#F3F4F6]">
            <DialogTitle className="text-[20px] font-bold text-[#1A1A1A] mb-1">
              Upload Signed Document
            </DialogTitle>
            <DialogDescription className="text-[13px] text-[#6B7280] mt-1">
              Upload the signed document to forward the data access request for{" "}
              <span className="font-semibold text-[#111827]">{forwardingEntity}</span>.
            </DialogDescription>
          </div>

          {/* Body */}
          <div className="px-7 py-6">
            <label
              htmlFor="da-forward-file-input"
              className={`flex flex-col items-center justify-center gap-3 w-full rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 py-10
                ${forwardDataAccessFile
                  ? 'border-[#EF4444] bg-[#FFF5F5]'
                  : 'border-[#D1D5DB] bg-[#F9FAFB] hover:border-[#EF4444] hover:bg-[#FFF5F5]'
                }`}
            >
              {forwardDataAccessFile ? (
                <>
                  <div className="w-12 h-12 rounded-full bg-[#EF4444]/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-[#EF4444]" />
                  </div>
                  <div className="text-center px-4">
                    <p className="text-[14px] font-semibold text-[#111827] truncate max-w-[300px]">{forwardDataAccessFile.name}</p>
                    <p className="text-[12px] text-[#6B7280] mt-1">{(forwardDataAccessFile.size / 1024).toFixed(2)} KB &middot; Click to change file</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-full bg-[#F3F4F6] flex items-center justify-center">
                    <Upload className="w-6 h-6 text-[#6B7280]" />
                  </div>
                  <div className="text-center">
                    <p className="text-[14px] font-semibold text-[#374151]">Click to upload or drag & drop</p>
                    <p className="text-[12px] text-[#9CA3AF] mt-1">PDF, DOC, DOCX &bull; Max 10MB</p>
                  </div>
                </>
              )}
              <input
                id="da-forward-file-input"
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setForwardDataAccessFile(file);
                }}
              />
            </label>
          </div>

          {/* Footer */}
          <div className="px-7 pb-7 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDataAccessForwardDialogOpen(false);
                setForwardDataAccessFile(null);
              }}
              className="px-6 h-[38px] rounded-[10px] border-[#E5E7EB] text-[#374151] text-[13px] font-semibold hover:bg-[#F9FAFB] transition-all"
            >
              Cancel
            </Button>
            <Button
              disabled={!forwardDataAccessFile}
              onClick={() => {
                toast.success(`Request for ${forwardingEntity} forwarded successfully.`);
                setDataAccessForwardDialogOpen(false);
                setForwardDataAccessFile(null);
              }}
              className="px-6 h-[38px] rounded-[10px] bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#991B1B] text-white text-[13px] font-semibold shadow-[0_4px_14px_rgba(237,28,36,0.35)] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Forward className="w-4 h-4" />
              Forward
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
        <DialogContent className="w-[95vw] max-w-[1400px] h-[600px] bg-white rounded-[16px] border-0 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-0 overflow-hidden flex flex-col sm:w-[95vw]">

          <div className="flex-1 flex flex-col px-6 pt-6 overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col gap-0.5 mb-5">
              <h3 className="text-[18px] font-semibold text-[#EF4444]">Dataset Preview</h3>
              <p className="text-[14px] text-[#6B7280]">
                Visual representation of the requested spatial boundary and dataset layers.
              </p>
            </div>

            {/* Info Cards Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
              <div className="bg-[#F9FAFB] rounded-[12px] p-3 border border-[#F3F4F6]">
                <div className="flex items-center gap-2 mb-1.5 text-[#6B7280]">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Request ID</span>
                </div>
                <div className="text-[13px] font-bold text-[#111827]">{previewingRequest?.id || "â€”"}</div>
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
