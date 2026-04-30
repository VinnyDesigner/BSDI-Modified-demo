import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router';
import { 
  Search, 
  ChevronDown, 
  ChevronRight,
  Download, 
  Upload, 
  Check,
  FileSpreadsheet,
  Settings,
  SlidersHorizontal,
  X,
  XCircle,
  ArrowRight,
  ArrowLeft,
  FileText,
  FileBox,
  FileUp,
  Loader2,
  Calendar,
  Building2,
  LayoutGrid
} from 'lucide-react';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { PageHeader } from "@/app/components/PageHeader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/app/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/app/components/ui/accordion";
import { Card } from "../../components/ui/card";
import { toast } from 'sonner';

// --- DATA STRUCTURES ---

interface ServiceNode {
  id: string;
  resource: string;
  access: boolean[];
  level: number;
  parentId: string | null;
  children?: ServiceNode[];
}

interface ExcelRow {
  sourceOrg: string;
  service: string;
  targetOrg: string;
  access: boolean;
}

const DEPARTMENTS = [
  "Ministry Of Housing",
  "Transport Authority",
  "Urban Planning Dept",
  "Ministry Of Interior",
  "Meteorological Directorate",
  "Municipality",
  "Ministry Of Works"
];

const SOURCE_ORGS = [
  "Urban Planning Authority",
  "Transport Authority",
  "Environmental Agency",
  "Digital Government"
];

const INITIAL_SERVICES: ServiceNode[] = [
  { id: "1", resource: "Addresses", access: [true,true,false,false,false,false,false], level: 0, parentId: null },
  { id: "2", resource: "AdminBoundary", access: [false,false,true,false,false,false,false], level: 0, parentId: null },
  { id: "3", resource: "Administrative_Boundary_UPDA", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "4", resource: "BACA", access: [true,false,false,true,false,false,false], level: 0, parentId: null },
  { id: "5", resource: "BACA_WFS", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "6", resource: "BACA_ZONE", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "7", resource: "BBU", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "8", resource: "BBU_FENCE", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "9", resource: "BIX_WL", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "10", resource: "BP_PARCEL_QUERY", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "11", resource: "BSDILOCATOR (GeocodeServer)", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "12", resource: "Batelco_AddressesWFS", access: [false,false,false,false,true,false,false], level: 0, parentId: null },
  { id: "13", resource: "Buildings_UPDA", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "14", resource: "CADASTRAL", access: [true,true,true,true,true,true,false], level: 0, parentId: null },
  { id: "15", resource: "DISTRICT_COOLING", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "16", resource: "ELECTRICITYDISTRIBUTION", access: [false,true,false,false,true,false,false], level: 0, parentId: null },
  { id: "17", resource: "ELECTRICITYTRANSMISSION", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "18", resource: "EWA_EDD", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "19", resource: "EWA_EDD_INFRA", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "20", resource: "EWA_EDD_QUERY", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "21", resource: "EWA_ETD", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "22", resource: "EWA_ETD_N", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "23", resource: "EWA_FD", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "24", resource: "EWA_SLD", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "25", resource: "EWA_WDD", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "26", resource: "EWA_WTD", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "27", resource: "ElectricityDistribution", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "28", resource: "ElectricityTransmission", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "29", resource: "FD", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "30", resource: "MOC_RESERVED_SITES", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "31", resource: "MOICT", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "32", resource: "MOIC_PARCELS", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "33", resource: "MOIC_RESERVED_LOCATIONS", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "34", resource: "MUHARRAQ_DGS_ROUTE", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "35", resource: "Muharraq_DGS_WWCN", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "36", resource: "NSA_DayBaseMap", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "37", resource: "NSA_GeoCode", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "38", resource: "NSA_Grids", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "39", resource: "NSA_NightBaseMap", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "40", resource: "NSA_POI", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "41", resource: "NSA_querymap", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "42", resource: "OIL_GAS", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "43", resource: "POIS", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "44", resource: "POIS_UPDA", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "45", resource: "PSDProposed", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "46", resource: "Pavements", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "47", resource: "ROUTING_SERVICE", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "48", resource: "ROUTING_SERVICE (NAServer)", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "49", resource: "Road_Ducts", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "50", resource: "SEWERAGEANDDRAINAGE", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "51", resource: "SLRB_CADASTRAL_LATEST", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "52", resource: "SLRB_PARCEL", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "53", resource: "STREETLIGHT", access: [true,false,true,false,false,true,false], level: 0, parentId: null },
  { id: "54", resource: "Satellite2005", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "55", resource: "Satellite2006", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "56", resource: "Satellite2014C", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "57", resource: "Satellite2015", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "58", resource: "Satellite2020_aerial_mosic", access: [true,true,true,true,true,true,false], level: 0, parentId: null },
  { id: "59", resource: "StreetCenterLines", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "60", resource: "Street_Centerlines_UPDA", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "61", resource: "TATWEER", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "62", resource: "TOPOGRAPHIC", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "63", resource: "TRA_WFS", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "64", resource: "TSE_MAP", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "65", resource: "Tatweer_Data", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "66", resource: "Telecom", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "67", resource: "Telecom_INFRA", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "68", resource: "Telecom_QUERY", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "69", resource: "Topo_2016v1", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "70", resource: "WATERDISTRIBUTION", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "71", resource: "WATERTRANSMISSION", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "72", resource: "WaterDistribution", access: [false,false,false,false,false,false,false], level: 0, parentId: null },
  { id: "73", resource: "WaterTransmission", access: [false,false,false,false,false,false,false], level: 0, parentId: null }
];

const GRANTED_SERVICES = [
  { id: 2, name: "Land Use Masterplan", type: "WMS", owner: "Urban Planning Authority", date: "05 Feb 2025" },
  { id: 3, name: "Traffic Flow API", type: "API", owner: "Transport Authority", date: "22 Jan 2025" },
  { id: 4, name: "Environment Protected Areas", type: "WMS", owner: "Environmental Agency", date: "15 Dec 2024" },
  { id: 5, name: "Digital Identity Service", type: "REST", owner: "iGA Digital Government", date: "10 Nov 2024" }
];

const organizations = [
  "Ministry of Health",
  "Municipality",
  "Transport Ministry",
  "Defense Force",
  "Education Ministry",
  "Interior Ministry"
];

const EntityAccessMatrix: React.FC = () => {
  const location = useLocation();
  const isReviewer = location.pathname.includes("/reviewer");
  const isOrgAdmin = location.pathname.includes("/entity-admin");
  const isDeptAdmin = location.pathname.includes("/department");
  const isReadOnly = isReviewer; // Reviewer is always read-only
  const adminOrg = "Urban Planning Authority";

  // --- CORE STATE ---
  const [selectedOrg, setSelectedOrg] = useState<string>(isDeptAdmin ? adminOrg : "Ministry of Health");
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [matrixSearchTerm, setMatrixSearchTerm] = useState("");
  
  const [services, setServices] = useState<ServiceNode[]>(INITIAL_SERVICES);
  const [originalServices, setOriginalServices] = useState<ServiceNode[]>(JSON.parse(JSON.stringify(INITIAL_SERVICES)));
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["5"]));
  const [isSaving, setIsSaving] = useState(false);
  const [saveUploadOpen, setSaveUploadOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [activeMatrixTab, setActiveMatrixTab] = useState("owned");

  const isOwnedTabReadOnly = isReadOnly || ((isOrgAdmin || isDeptAdmin) && activeMatrixTab === 'owned');
  const [matrixFilterServices, setMatrixFilterServices] = useState<string[]>([]);
  
  // Requested Services State
  const [requestedServices, setRequestedServices] = useState<ServiceNode[]>(INITIAL_SERVICES);
  const [originalRequestedServices, setOriginalRequestedServices] = useState<ServiceNode[]>(JSON.parse(JSON.stringify(INITIAL_SERVICES)));
  const [requestedMatrixFilterServices, setRequestedMatrixFilterServices] = useState<string[]>([]);
  const [requestedSourceOrgs, setRequestedSourceOrgs] = useState<string[]>([]);

  const [orgUploads, setOrgUploads] = useState<Record<string, File | null>>({});
  const [showErrors, setShowErrors] = useState(false);

  // Deny Access Flow
  const [denyDialogOpen, setDenyDialogOpen] = useState(false);
  const [pendingDeny, setPendingDeny] = useState<{ id: string, dIdx: number } | null>(null);
  const [expandedOrg, setExpandedOrg] = useState<string | null>("Transport Authority");
  const [expandedGrantedOrg, setExpandedGrantedOrg] = useState<string | null>(null);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [activeUploadOrg, setActiveUploadOrg] = useState<string | null>(null);
  const [grantedFilterOrgs, setGrantedFilterOrgs] = useState<string[]>([]);
  const [grantedSearchQuery, setGrantedSearchQuery] = useState("");
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [grantReason, setGrantReason] = useState("");
  const [revokeReason, setRevokeReason] = useState("");
  const [grantReasonFile, setGrantReasonFile] = useState<File | null>(null);
  const [revokeReasonFile, setRevokeReasonFile] = useState<File | null>(null);
  const [changeType, setChangeType] = useState<"grant" | "revoke" | "both">("grant");

  // --- PROGRESSIVE IMPORT WIZARD STATE ---
  const [importWizardOpen, setImportWizardOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [excelData, setExcelData] = useState<ExcelRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepStatuses, setStepStatuses] = useState<('idle'|'loading'|'done')[]>(['idle', 'idle', 'idle', 'idle']);
  
  const [importSource, setImportSource] = useState("");
  const [importServices, setImportServices] = useState<string[]>([]);
  const [importTargets, setImportTargets] = useState<string[]>([]);

  // --- HELPERS ---

  const getLabel = (count: number, singleName: string | undefined, defaultLabel: string) => {
    if (count === 0) return defaultLabel;
    if (count === 1) return singleName || defaultLabel;
    return `${defaultLabel} (${count})`;
  };

  const flattenServices = (nodes: ServiceNode[], result: ServiceNode[] = []): ServiceNode[] => {
    nodes.forEach(node => {
      result.push(node);
      if (node.children && expandedIds.has(node.id)) {
        flattenServices(node.children, result);
      }
    });
    return result;
  };

  const updateNodeInTree = (nodes: ServiceNode[], id: string, updater: (node: ServiceNode) => ServiceNode): ServiceNode[] => {
    return nodes.map(node => {
      if (node.id === id) return updater(node);
      if (node.children) return { ...node, children: updateNodeInTree(node.children, id, updater) };
      return node;
    });
  };

  const hasChanges = JSON.stringify(services) !== JSON.stringify(originalServices);

  // --- HANDLERS ---

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) newExpanded.delete(id);
    else newExpanded.add(id);
    setExpandedIds(newExpanded);
  };

  const toggleAccess = (id: string, dIdx: number) => {
    const findNode = (nodes: ServiceNode[], id: string): ServiceNode | undefined => {
      for (const node of nodes) {
        if (node.id === id) return node;
        if (node.children) {
          const found = findNode(node.children, id);
          if (found) return found;
        }
      }
    };

    const targetSvc = activeMatrixTab === 'owned' ? services : requestedServices;
    const originalSvc = activeMatrixTab === 'owned' ? originalServices : originalRequestedServices;
    
    const node = findNode(targetSvc, id);
    const originalNode = findNode(originalSvc, id);
    if (!node || !originalNode) return;

    const currentValue = node.access[dIdx];
    const wasOriginallyTrue = originalNode.access[dIdx];



    const updater = (prev: ServiceNode[]) => updateNodeInTree(prev, id, (n) => {
      const newAccess = [...n.access];
      newAccess[dIdx] = !currentValue;
      return { ...n, access: newAccess };
    });

    if (activeMatrixTab === 'owned') setServices(updater);
    else setRequestedServices(updater);
  };

  const toggleColumn = (dIdx: number, targetValue: boolean) => {
    const updateAllNodes = (nodes: ServiceNode[]): ServiceNode[] => {
      return nodes.map(node => {
        const newAccess = [...node.access];
        newAccess[dIdx] = targetValue;
        const newNode: ServiceNode = { ...node, access: newAccess };
        if (node.children) newNode.children = updateAllNodes(node.children);
        return newNode;
      });
    };
    if (activeMatrixTab === 'owned') setServices(prev => updateAllNodes(prev));
    else setRequestedServices(prev => updateAllNodes(prev));
  };

  const confirmDenyAccess = () => {
    if (pendingDeny) {
      const updater = (prev: ServiceNode[]) => updateNodeInTree(prev, pendingDeny.id, (n) => {
        const newAccess = [...n.access];
        newAccess[pendingDeny.dIdx] = false;
        return { ...n, access: newAccess };
      });
      if (activeMatrixTab === 'owned') setServices(updater);
      else setRequestedServices(updater);
      
      toast.success("Access revoked successfully");
      setDenyDialogOpen(false);
      setPendingDeny(null);
    }
  };

  const saveChanges = () => {
    setIsSaving(true);
    setTimeout(() => {
      if (activeMatrixTab === 'owned') setOriginalServices(JSON.parse(JSON.stringify(services)));
      else setOriginalRequestedServices(JSON.parse(JSON.stringify(requestedServices)));
      
      setIsSaving(false);
      setSuccessModalOpen(true);
    }, 800);
  };

  const handleFinalSave = () => {
    setIsSaving(true);
    setSaveUploadOpen(false);
    setTimeout(() => {
      if (activeMatrixTab === 'owned') setOriginalServices(JSON.parse(JSON.stringify(services)));
      else setOriginalRequestedServices(JSON.parse(JSON.stringify(requestedServices)));
      
      setIsSaving(false);
      setOrgUploads({});
      toast.success("Changes saved and configuration uploaded successfully");
    }, 1000);
  };

  const cancelChanges = () => {
    if (activeMatrixTab === 'owned') setServices(JSON.parse(JSON.stringify(originalServices)));
    else setRequestedServices(JSON.parse(JSON.stringify(originalRequestedServices)));
  };

  // --- PROGRESSIVE STEP-BY-STEP ANIMATION LOGIC ---

  const handleFileUpload = (file: File) => {
    setUploadedFile(file);
    setIsProcessing(true);
    
    // Create local sequence for data-driven results
    const mockParsedData: ExcelRow[] = [
      { sourceOrg: "Ministry of Health", service: "Addresses", targetOrg: "Municipality", access: true },
      { sourceOrg: "Ministry of Health", service: "Meter", targetOrg: "Transport Ministry", access: true },
      { sourceOrg: "Ministry of Health", service: "Manhole", targetOrg: "Defense Force", access: false },
      { sourceOrg: "Ministry of Health", service: "HydrantValve", targetOrg: "Education Ministry", access: true },
      { sourceOrg: "Ministry of Health", service: "SystemValve", targetOrg: "Municipality", access: true },
    ];

    const sequence = async () => {
      // Step 1: Source Detection
      setStepStatuses(['loading', 'idle', 'idle', 'idle']);
      setActiveStep(0);
      await new Promise(r => setTimeout(r, 800));
      setStepStatuses(['done', 'idle', 'idle', 'idle']);
      setImportSource(mockParsedData[0].sourceOrg);

      // Step 2: Mapping Services
      setStepStatuses(['done', 'loading', 'idle', 'idle']);
      setActiveStep(1);
      await new Promise(r => setTimeout(r, 900));
      setStepStatuses(['done', 'done', 'idle', 'idle']);
      setImportServices(Array.from(new Set(mockParsedData.map(r => r.service))));

      // Step 3: Mapping Targets
      setStepStatuses(['done', 'done', 'loading', 'idle']);
      setActiveStep(2);
      await new Promise(r => setTimeout(r, 800));
      setStepStatuses(['done', 'done', 'done', 'idle']);
      setImportTargets(Array.from(new Set(mockParsedData.map(r => r.targetOrg))));

      // Step 4: Access Rules
      setStepStatuses(['done', 'done', 'done', 'loading']);
      setActiveStep(3);
      await new Promise(r => setTimeout(r, 1000));
      setStepStatuses(['done', 'done', 'done', 'done']);
      setExcelData(mockParsedData);
      setIsProcessing(false);
      toast.success(`${file.name} uploaded and processed`);
    };

    sequence();
  };

  // --- FILTERED DATA (OWNED) ---
  const fullList = flattenServices(services);
  const filteredList = fullList.filter(s => {
    const matchesSearch = s.resource.toLowerCase().includes(matrixSearchTerm.toLowerCase());
    const matchesFilter = selectedServices.length === 0 || selectedServices.includes(s.resource);
    const matchesMatrixFilter = matrixFilterServices.length === 0 || matrixFilterServices.includes(s.resource);
    return matchesSearch && matchesFilter && matchesMatrixFilter;
  });

  const filteredDepts = DEPARTMENTS.map((d, idx) => ({ name: d, idx })).filter(d => 
    (selectedDepts.length === 0 || selectedDepts.includes(d.name)) && d.name !== "Ministry Of Works"
  );

  // --- FILTERED DATA (REQUESTED) ---
  const fullRequestedList = flattenServices(requestedServices);
  const filteredRequestedList = fullRequestedList.filter(s => {
    const matchesSearch = s.resource.toLowerCase().includes(matrixSearchTerm.toLowerCase());
    const matchesFilter = selectedServices.length === 0 || selectedServices.includes(s.resource);
    const matchesMatrixFilter = requestedMatrixFilterServices.length === 0 || requestedMatrixFilterServices.includes(s.resource);
    return matchesSearch && matchesFilter && matchesMatrixFilter;
  });

  const filteredRequestedDepts = DEPARTMENTS.map((d, idx) => ({ name: d, idx })).filter(d => 
    d.name === "Ministry Of Works"
  );

  // --- GRANTED SERVICES LOGIC ---
  const allGrantedOrgs = useMemo(() => {
    return Array.from(new Set(GRANTED_SERVICES.map(s => s.owner))).sort();
  }, []);

  const searchedGrantedOrgs = useMemo(() => {
    return allGrantedOrgs.filter(org => 
      org.toLowerCase().includes(grantedSearchQuery.toLowerCase())
    );
  }, [allGrantedOrgs, grantedSearchQuery]);

  const displayGrantedServices = useMemo(() => {
    return GRANTED_SERVICES.filter(s => 
      grantedFilterOrgs.length === 0 || grantedFilterOrgs.includes(s.owner)
    );
  }, [grantedFilterOrgs]);

  const groupedGrantedServices = useMemo(() => {
    return displayGrantedServices.reduce((acc, s) => {
      if (!acc[s.owner]) acc[s.owner] = [];
      acc[s.owner].push(s);
      return acc;
    }, {} as Record<string, typeof GRANTED_SERVICES>);
  }, [displayGrantedServices]);

  // --- CHANGED ORGANIZATIONS TRACKING ---
  const changedOrgs = useMemo(() => {
    const changed: { name: string, idx: number }[] = [];
    const targetSvc = activeMatrixTab === 'owned' ? services : requestedServices;
    const originalSvc = activeMatrixTab === 'owned' ? originalServices : originalRequestedServices;
    
    // Check which columns in filteredDepts (or the full DEPARTMENTS) have changed
    const currentDepts = activeMatrixTab === 'requested' ? (!filteredRequestedDepts ? [] : filteredRequestedDepts) : (!filteredDepts ? [] : filteredDepts);

    currentDepts.forEach(dept => {
      const isDeptChanged = (nodes: ServiceNode[], origNodes: ServiceNode[]): boolean => {
        for (let i = 0; i < nodes.length; i++) {
          if (nodes[i].access[dept.idx] !== origNodes[i].access[dept.idx]) return true;
          if (nodes[i].children && nodes[i].children!.length > 0) {
            const foundOrig = origNodes.find(on => on.id === nodes[i].id);
            if (foundOrig && foundOrig.children && foundOrig.children.length > 0) {
              if (isDeptChanged(nodes[i].children!, foundOrig.children)) return true;
            }
          }
        }
        return false;
      };

      if (isDeptChanged(targetSvc, originalSvc)) {
        changed.push({ name: dept.name, idx: dept.idx });
      }
    });
    return changed;
  }, [services, originalServices, requestedServices, originalRequestedServices, activeMatrixTab, filteredDepts, filteredRequestedDepts]);

  const hasOwnedChanges = JSON.stringify(services) !== JSON.stringify(originalServices);
  const hasRequestedChanges = JSON.stringify(requestedServices) !== JSON.stringify(originalRequestedServices);

  const resetImport = () => {
    setImportWizardOpen(false);
    setUploadedFile(null);
    setExcelData([]);
    setActiveStep(0);
    setIsProcessing(false);
    setStepStatuses(['idle', 'idle', 'idle', 'idle']);
  };

  const handleSaveClick = () => {
    let grants = false;
    let revokes = false;

    const targetSvc = activeMatrixTab === 'owned' ? services : requestedServices;
    const originalSvc = activeMatrixTab === 'owned' ? originalServices : originalRequestedServices;

    const traverse = (currNodes: typeof services, origNodes: typeof originalServices) => {
      for (let i = 0; i < currNodes.length; i++) {
        const cNode = currNodes[i];
        const oNode = origNodes.find(n => n.id === cNode.id);
        if (oNode) {
          for (let j = 0; j < cNode.access.length; j++) {
            if (cNode.access[j] === true && oNode.access[j] === false) grants = true;
            if (cNode.access[j] === false && oNode.access[j] === true) revokes = true;
          }
        }
        if (cNode.children && oNode?.children) {
          traverse(cNode.children, oNode.children);
        }
      }
    };
    
    traverse(targetSvc, originalSvc);

    if (grants && revokes) setChangeType("both");
    else if (grants) setChangeType("grant");
    else if (revokes) setChangeType("revoke");
    else return;

    setGrantReason("");
    setRevokeReason("");
    setGrantReasonFile(null);
    setRevokeReasonFile(null);
    setReasonDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex flex-col font-sans px-6 py-5">
      <div className="max-w-[1700px] mx-auto space-y-6 w-full">
        {/* 1. Standardized Header */}
      <PageHeader 
        title={isDeptAdmin ? "Service Access Matrix" : "Entity Access Matrix"}
        description="Standardize security across all modules and applications"
      />

        {/* 2. MATRIX SECTION CONTAINER */}
        <Tabs value={activeMatrixTab} onValueChange={setActiveMatrixTab} className="w-full">
          {(isOrgAdmin || isDeptAdmin) && (
            <div className="mb-6 w-full overflow-x-auto custom-scrollbar pb-1">
              <style>{`
                .custom-tabs-container {
                  display: flex;
                  gap: 8px;
                  background: transparent;
                  padding: 4px;
                  width: fit-content;
                }
                .tab-item {
                  height: 32px;
                  padding: 0 16px;
                  font-size: 13px;
                  font-weight: 500;
                  color: #6B7280;
                  background: white;
                  border: 1px solid #E5E7EB;
                  border-radius: 10px;
                  transition: all 0.2s ease;
                }
                .tab-item:hover {
                  background: #F9FAFB;
                  color: #111827;
                }
                .tab-item[data-state="active"] {
                  background: #EF4444;
                  color: #FFFFFF;
                  font-weight: 600;
                  border-color: transparent;
                  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.2);
                }
                @media print {
                  body * {
                    visibility: hidden;
                  }
                  #print-report, #print-report * {
                    visibility: visible;
                  }
                  #print-report {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    padding: 40px;
                    background: white;
                    color: black;
                  }
                  .page-break {
                    page-break-after: always;
                  }
                }
              `}</style>
              <TabsList className="custom-tabs-container flex-nowrap justify-start h-auto py-1 shadow-none">
                <TabsTrigger value="owned" className="tab-item whitespace-nowrap">Owned Services</TabsTrigger>
                <TabsTrigger value="requested" className="tab-item whitespace-nowrap">Requested Services</TabsTrigger>
                <TabsTrigger value="granted" className="tab-item whitespace-nowrap">Granted Services</TabsTrigger>
              </TabsList>
            </div>
          )}

          <TabsContent value="owned" className="mt-0 md:flex-1 md:flex md:flex-col">
            <div className="bg-white border-0 rounded-2xl shadow-[0px_1px_2px_rgba(0,0,0,0.04)] overflow-hidden md:flex-1 md:flex md:flex-col md:min-h-[calc(100vh-250px)]">
              {/* Header & Filters Grid */}
              <div className="px-6 py-6 border-b border-[#F3F4F6] bg-white">
                <div className="flex flex-col gap-6">
                  {/* Row 1: Title & Main Actions */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-[18px] font-bold text-[#111827]">Access Configuration</h3>
                      <p className="text-sm text-[#6B7280]">Manage service access across entities, source organizations and target organizations.</p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isReadOnly && !isOrgAdmin && !isDeptAdmin && (
                        <Button 
                          variant="outline" 
                          onClick={() => setImportWizardOpen(true)}
                          className="h-[36px] px-4 rounded-[10px] border-[#E5E7EB] text-[13px] font-semibold text-[#374151] hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4 text-[#EF4444]" />
                          Import
                        </Button>
                      )}
                      <Button 
                        variant="outline"
                        className="h-[36px] px-4 rounded-[10px] border-[#E5E7EB] text-[13px] font-semibold text-[#374151] hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Download className="w-4 h-4 text-[#EF4444]" />
                        Export
                      </Button>
                    </div>
                  </div>

                  {/* Row 2: Search & Dynamic Filters */}
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    <div className="relative w-full lg:w-72">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                      <Input
                        type="text"
                        placeholder="Search services..."
                        value={matrixSearchTerm}
                        onChange={(e) => setMatrixSearchTerm(e.target.value)}
                        className="w-full h-[38px] pl-10 rounded-[10px] border-[#E5E7EB] bg-[#F9FAFB] text-sm focus:border-[#EF4444] transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:flex items-center gap-3 w-full lg:w-auto">
                      {!(isOrgAdmin || isDeptAdmin) && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild disabled={isDeptAdmin}>
                            <Button 
                              variant="outline" 
                              className={`h-[38px] px-[12px] bg-white border-[#E5E7EB] rounded-[10px] text-[13px] font-semibold text-[#374151] flex items-center gap-6 w-full lg:min-w-[190px] justify-between shadow-sm hover:border-[#EF4444]/30 transition-all ${isDeptAdmin ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                              <span className="truncate">
                                {selectedOrg === "Ministry of Health" ? "Source Organization" : selectedOrg}
                              </span>
                              {!isDeptAdmin && <ChevronDown className="w-4 h-4 text-[#6B7280]" />}
                            </Button>
                          </DropdownMenuTrigger>
                          {!isDeptAdmin && (
                            <DropdownMenuContent className="w-[220px] rounded-xl border border-gray-100 shadow-xl p-2 bg-white z-[100]">
                              {organizations.map((org) => (
                                <DropdownMenuItem 
                                  key={org} 
                                  onClick={() => setSelectedOrg(org)}
                                  className={`cursor-pointer rounded-lg px-3 py-2 text-sm font-medium ${selectedOrg === org ? 'bg-red-50 text-[#EF4444]' : 'text-gray-700 hover:bg-gray-50'}`}
                                >
                                  {org}
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          )}
                        </DropdownMenu>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="h-[38px] px-[12px] bg-white border-[#E5E7EB] rounded-[10px] text-[13px] font-semibold text-[#374151] flex items-center gap-6 w-full lg:min-w-[170px] justify-between shadow-sm hover:border-[#EF4444]/30 transition-all">
                            <span className="truncate">
                              {getLabel(selectedDepts.length, selectedDepts[0], "Target Organization")}
                            </span>
                            <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[240px] rounded-xl border border-gray-100 shadow-xl p-2 bg-white max-h-64 overflow-y-auto z-[100]">
                          {DEPARTMENTS.map((d) => (
                            <div 
                              key={d} 
                              className="flex items-center gap-2 px-3 py-2 hover:bg-red-50/30 cursor-pointer rounded-lg transition-colors font-medium"
                              onClick={() => {
                                setSelectedDepts(prev => 
                                  prev.includes(d) ? prev.filter(item => item !== d) : [...prev, d]
                                );
                              }}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${selectedDepts.includes(d) ? 'bg-[#EF4444] border-none' : 'border-gray-300'}`}>
                                {selectedDepts.includes(d) && <Check className="w-3 h-3 text-white" />}
                              </div>
                              <span className="text-sm font-medium text-gray-700">{d}</span>
                            </div>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              </div>

              {/* Matrix Content Area */}
              <div className="px-6 pb-6 pt-2 md:flex-1 md:flex md:flex-col">
                <div className="rounded-xl border border-[#F3F4F6] overflow-hidden md:flex-1 md:flex md:flex-col">
                  <div className={`overflow-auto scrollbar-thin scrollbar-thumb-gray-200 md:h-[calc(100vh-450px)] md:max-h-none ${(isOrgAdmin || isDeptAdmin) ? 'max-h-[400px] pr-[10px]' : 'max-h-[450px]'}`}>
                    <table className="w-full border-separate border-spacing-0">
                      <thead className="sticky top-0 z-40 bg-white shadow-[0_1px_0_#F3F4F6]">
                        <tr>
                          <th className="lg:sticky lg:left-0 lg:z-50 bg-white border-b border-r border-[#F3F4F6] px-3 md:px-4 py-4 w-[140px] md:w-[220px] min-w-[120px] md:min-w-[200px] max-w-[240px] text-left text-[13px] font-semibold text-[#6B7280] lg:shadow-[1px_0_0_#F3F4F6]">
                             <div className="flex items-center justify-between gap-2">
                               <span>Services</span>
                               <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                   <div className={`p-1 rounded hover:bg-gray-100 cursor-pointer transition-colors ${matrixFilterServices.length > 0 ? 'text-[#EF4444]' : 'text-gray-400'}`}>
                                     <SlidersHorizontal className="w-3.5 h-3.5" />
                                   </div>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align="start" className="w-[350px] rounded-xl border border-gray-100 shadow-xl p-0 bg-white max-h-64 overflow-y-auto">
                                   <div className="sticky top-0 bg-white z-10 px-4 py-3 border-b border-gray-100 mb-1 flex items-center justify-between">
                                     <span className="text-[12px] font-bold text-gray-500 uppercase tracking-tight">Filter Services</span>
                                     {matrixFilterServices.length > 0 && (
                                       <button onClick={() => setMatrixFilterServices([])} className="text-[11px] font-bold text-[#EF4444] hover:underline">Clear</button>
                                     )}
                                   </div>
                                   <div className="p-2 pt-0">
                                   {INITIAL_SERVICES.map((s) => (
                                     <div 
                                       key={s.id} 
                                       className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors font-medium border-0"
                                       onClick={() => {
                                         setMatrixFilterServices(prev => 
                                           prev.includes(s.resource) ? prev.filter(item => item !== s.resource) : [...prev, s.resource]
                                         );
                                       }}
                                     >
                                       <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${matrixFilterServices.includes(s.resource) ? 'bg-[#EF4444] border-none' : 'border-gray-300'}`}>
                                         {matrixFilterServices.includes(s.resource) && <Check className="w-3 h-3 text-white" />}
                                       </div>
                                       <span className="text-sm font-medium text-gray-700">{s.resource}</span>
                                     </div>
                                   ))}
                                   </div>
                                 </DropdownMenuContent>
                               </DropdownMenu>
                             </div>
                            {matrixFilterServices.length > 0 && (
                              <div className="mt-1 flex items-center gap-1.5">
                                <span className="bg-red-50 text-[#EF4444] text-[10px] px-2 py-0.5 rounded-full font-bold border border-red-100 uppercase tracking-tighter">
                                  {matrixFilterServices.length} Selected
                                </span>
                              </div>
                            )}
                          </th>
                          {filteredDepts.map((d) => {
                            const allChecked = filteredList.every(s => s.access[d.idx]);
                            return (
                              <th key={d.idx} className="border-b border-[#F3F4F6] px-4 py-4 min-w-[185px] text-center">
                                <div className="flex flex-col items-center gap-3">
                                  <span className="text-[12px] font-semibold text-[#6B7280] leading-tight max-w-[120px]">{d.name}</span>
                                   <div 
                                    className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${isOwnedTabReadOnly ? 'cursor-default transition-none' : 'cursor-pointer'} ${allChecked ? 'bg-[#EF4444] border-none scale-110 shadow-sm' : (isOwnedTabReadOnly ? 'bg-[#F3F4F6] border-[#D1D5DB]' : 'border-[#D1D5DB] hover:border-[#6A7280]')}`}
                                    onClick={() => !isOwnedTabReadOnly && toggleColumn(d.idx, !allChecked)}
                                  >
                                    {allChecked && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                                  </div>
                                </div>
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody className="bg-white text-[#111827]">
                        {filteredList.map((node) => (
                          <tr key={node.id} className={`group ${isReadOnly ? '' : 'hover:bg-[#F9FAFB]'} transition-colors border-b border-[#F3F4F6]`}>
                            <td className={`lg:sticky lg:left-0 lg:z-30 bg-white ${isReadOnly ? '' : 'group-hover:bg-[#F9FAFB]'} border-b border-r border-[#F3F4F6] py-3 pl-2 pr-3 md:pr-4 w-[140px] md:w-[220px] min-w-[120px] md:min-w-[200px] max-w-[240px] transition-colors lg:shadow-[1px_0_0_#F3F4F6]`}>
                              <div 
                                className="flex items-center relative gap-1" 
                                style={{ paddingLeft: `${node.level * 18}px` }}
                              >
                                {node.children && (
                                  <div onClick={() => toggleExpand(node.id)} className="cursor-pointer text-[#6B7280] hover:text-[#111827] flex-shrink-0">
                                    {expandedIds.has(node.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                  </div>
                                )}
                                {!node.children && <div className="w-4 flex-shrink-0" />}
                                <span className={`text-[14px] truncate flex-1 ${node.level === 0 ? 'font-semibold text-[#111827]' : 'text-[#374151]'}`} title={node.resource}>
                                  {node.resource}
                                </span>
                              </div>
                            </td>
                            {filteredDepts.map((d) => (
                              <td key={d.idx} className="border-b border-[#F3F4F6] px-4 py-3 h-[48px] text-center">
                                <div className="flex justify-center items-center h-full">
                                   <div 
                                    onClick={() => !isOwnedTabReadOnly && toggleAccess(node.id, d.idx)}
                                    className={`w-[18px] h-[18px] rounded border flex items-center justify-center transition-all ${isOwnedTabReadOnly ? 'cursor-default transition-none' : 'cursor-pointer active:scale-90'} ${node.access[d.idx] ? 'bg-[#EF4444] border-none shadow-sm' : (isOwnedTabReadOnly ? 'bg-[#F3F4F6] border-[#D1D5DB]' : 'border-[#D1D5DB] hover:border-[#6B7280]')}`}
                                  >
                                    {node.access[d.idx] && <Check className="w-3.5 h-3.5 text-white stroke-[3.5px]" />}
                                  </div>
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="requested" className="mt-0">
            <Card className="bg-white border border-[#E5E7EB] rounded-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] overflow-hidden" style={{ padding: '20px 24px 24px' }}>
              {/* Global Matrix Header / Filters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-[#111827]">Request Configuration</h3>
                  <p className="text-sm text-[#6B7280]">Toggle service access for your organization's departments across all entities</p>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <Input
                      type="text"
                      placeholder="Search requests..."
                      value={matrixSearchTerm}
                      onChange={(e) => setMatrixSearchTerm(e.target.value)}
                      className="w-full h-[36px] pl-10 rounded-[10px] border-[#E5E7EB] bg-[#F9FAFB] text-sm focus:border-[#EF4444] transition-all"
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-[36px] px-4 bg-white border border-[#E5E7EB] rounded-[10px] text-[14px] font-medium text-[#374151] flex items-center gap-6 w-full md:min-w-[180px] justify-between shadow-sm hover:border-[#EF4444]/30 hover:bg-gray-50 transition-all focus:ring-0">
                        <span className="truncate">
                          {getLabel(requestedSourceOrgs.length, requestedSourceOrgs[0], "Source Organization")}
                        </span>
                        <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[240px] rounded-xl border border-gray-100 shadow-xl p-2 bg-white max-h-64 overflow-y-auto z-[100]">
                      {SOURCE_ORGS.map((org) => (
                        <div 
                          key={org} 
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors font-medium"
                          onClick={() => {
                            setRequestedSourceOrgs(prev => 
                              prev.includes(org) ? prev.filter(item => item !== org) : [...prev, org]
                            );
                          }}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${requestedSourceOrgs.includes(org) ? 'bg-[#EF4444] border-none' : 'border-gray-300'}`}>
                            {requestedSourceOrgs.includes(org) && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{org}</span>
                        </div>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="space-y-4">
                {SOURCE_ORGS.filter(org => requestedSourceOrgs.length === 0 || requestedSourceOrgs.includes(org)).map((org) => (
                <div key={org} className="bg-white border border-[#F3F4F6] rounded-2xl shadow-sm overflow-hidden">
                  {/* Accordion Header */}
                  <div 
                    className={`px-6 py-4 flex items-center justify-between cursor-pointer transition-all ${expandedOrg === org ? 'bg-red-50/30' : 'hover:bg-gray-50'}`}
                    onClick={() => setExpandedOrg(expandedOrg === org ? null : org)}
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <h3 className={`text-[16px] font-bold transition-colors ${expandedOrg === org ? 'text-[#111827]' : 'text-[#374151]'}`}>{org}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {orgUploads[org] ? (
                        <div className="flex items-center gap-2 mr-2 animate-in fade-in duration-300">
                          <button
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              toast.success("Request submitted successfully!"); 
                              cancelChanges();
                              setOrgUploads(prev => { const n = {...prev}; delete n[org]; return n; });
                            }}
                            className="h-[32px] px-5 bg-[#EF4444] text-white rounded-[8px] text-[12px] font-bold hover:bg-[#DC2626] transition-all shadow-md"
                          >
                            Submit Request
                          </button>
                        </div>
                      ) : (hasRequestedChanges && expandedOrg === org) && (
                        <div className="flex items-center gap-2 mr-2 animate-in fade-in duration-300">
                          <button 
                            onClick={(e) => { e.stopPropagation(); cancelChanges(); }} 
                            className="h-[32px] px-4 bg-white border border-[#D1D5DB] rounded-[8px] text-[12px] font-medium text-[#374151] hover:bg-gray-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); window.print(); }} 
                            className="h-[32px] px-5 bg-[#EF4444] text-white rounded-[8px] text-[12px] font-medium hover:bg-[#DC2626] transition-all shadow-md"
                          >
                            Print
                          </button>
                        </div>
                      )}
                      {orgUploads[org] ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-[8px]" title={orgUploads[org]?.name}>
                            <Check className="w-3.5 h-3.5 text-green-600" />
                            <span className="text-[12px] font-bold text-green-700 max-w-[120px] truncate">{orgUploads[org]?.name}</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-[32px] px-3 bg-white border border-[#E5E7EB] rounded-[8px] text-[12px] font-bold text-[#374151] hover:bg-gray-50 transition-all shadow-sm"
                            onClick={(e: React.MouseEvent) => {
                              e.stopPropagation();
                              setActiveUploadOrg(org);
                              setConfigModalOpen(true);
                            }}
                          >
                            Re-Upload
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="h-[32px] px-4 bg-white border border-[#E5E7EB] rounded-[10px] text-[13px] font-bold text-[#374151] flex items-center gap-2 hover:bg-[#F9FAFB] hover:border-[#EF4444]/50 transition-all shadow-sm"
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            setActiveUploadOrg(org);
                            setConfigModalOpen(true);
                          }}
                        >
                          <Upload className="w-4 h-4 text-[#EF4444]" />
                          Upload File
                        </Button>
                      )}

                      <div className={`p-1.5 rounded-full bg-white border border-[#E5E7EB] text-[#6B7280] shadow-sm transition-transform duration-300 ${expandedOrg === org ? 'rotate-180 border-red-100 text-[#EF4444]' : ''}`}>
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Accordion Content */}
                  {expandedOrg === org && (
                    <div className="px-6 pb-6 pt-4 border-t border-[#F3F4F6] animate-in slide-in-from-top-2 duration-300">

                      {/* Matrix Grid */}
                      <div className="rounded-xl border border-[#F3F4F6] overflow-hidden">
                        <div className="overflow-auto scrollbar-thin scrollbar-thumb-gray-200 max-h-[400px]">
                          <table className="w-full border-separate border-spacing-0">
                            <thead className="sticky top-0 z-40 bg-white shadow-[0_1px_0_#F3F4F6]">
                              <tr>
                                <th className="lg:sticky lg:left-0 lg:z-50 bg-white border-b border-r border-[#F3F4F6] px-3 md:px-4 py-4 w-[140px] md:w-[220px] min-w-[120px] md:min-w-[200px] text-left text-[12px] font-semibold text-[#6B7280] lg:shadow-[1px_0_0_#F3F4F6]">
                                  Services
                                </th>
                                {filteredRequestedDepts.map((d) => (
                                  <th key={d.idx} className="border-b border-[#F3F4F6] px-4 py-4 min-w-[150px] text-center">
                                    <span className="text-[12px] font-semibold text-[#6B7280]"></span>
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white">
                              {filteredRequestedList.map((node) => (
                                <tr key={node.id} className="hover:bg-[#F9FAFB] transition-colors border-b border-[#F3F4F6] group">
                                  <td className="lg:sticky lg:left-0 lg:z-30 bg-white group-hover:bg-[#F9FAFB] border-b border-r border-[#F3F4F6] py-3 pl-2 pr-3 md:pr-4 w-[140px] md:w-[220px] min-w-[120px] md:min-w-[200px] lg:shadow-[1px_0_0_#F3F4F6]">
                                    <div className="flex items-center gap-1" style={{ paddingLeft: `${node.level * 18}px` }}>
                                      {node.children && (
                                        <div onClick={() => toggleExpand(node.id)} className="cursor-pointer text-[#6B7280]">
                                          {expandedIds.has(node.id) ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                        </div>
                                      )}
                                      {!node.children && <div className="w-4" />}
                                      <span className={`text-[13px] truncate ${node.level === 0 ? 'font-bold' : ''}`}>{node.resource}</span>
                                    </div>
                                  </td>
                                  {filteredRequestedDepts.map((d) => (
                                    <td key={d.idx} className="border-b border-[#F3F4F6] px-4 py-3 text-center">
                                      <div className="flex justify-center items-center">
                                        <div 
                                          onClick={() => toggleAccess(node.id, d.idx)}
                                          className={`w-[18px] h-[18px] rounded border flex items-center justify-center cursor-pointer transition-all ${node.access[d.idx] ? 'bg-[#EF4444] border-none shadow-sm' : 'border-[#D1D5DB] hover:border-[#6B7280]'}`}
                                        >
                                          {node.access[d.idx] && <Check className="w-3.5 h-3.5 text-white stroke-[3.5px]" />}
                                        </div>
                                      </div>
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      {/* Action Bar moved to accordion header */}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

          <TabsContent value="granted" className="mt-0">
            <div className="bg-white border border-[#E5E7EB] rounded-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] overflow-hidden p-[20px]">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-bold text-[#111827]">Granted External Services</h3>
                  <p className="text-sm text-[#6B7280]">View all services that other organizations have shared with you.</p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                    <Input
                      type="text"
                      placeholder="Search shared services..."
                      value={grantedSearchQuery}
                      onChange={(e) => setGrantedSearchQuery(e.target.value)}
                      className="w-full h-[36px] pl-10 rounded-[10px] border-[#E5E7EB] bg-[#F9FAFB] text-sm focus:border-[#EF4444] transition-all"
                    />
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="h-[36px] px-4 bg-white border border-[#E5E7EB] rounded-[10px] text-[14px] font-medium text-[#374151] flex items-center gap-6 w-full md:min-w-[200px] justify-between shadow-sm hover:border-[#EF4444]/30 hover:bg-gray-50 transition-all focus:ring-0">
                        <span className="truncate">
                          {getLabel(grantedFilterOrgs.length, grantedFilterOrgs[0], "Source Organization")}
                        </span>
                        <ChevronDown className="w-4 h-4 text-[#6B7280]" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[280px] rounded-xl border border-gray-100 shadow-xl p-0 bg-white z-[100] overflow-hidden">
                      {/* SEARCH BAR INSIDE DROPDOWN */}
                      <div className="p-3 border-b border-gray-100 bg-gray-50/50">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                          <input 
                            className="w-full bg-white border border-gray-200 rounded-lg py-1.5 pl-9 pr-3 text-[13px] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-[#EF4444]/30 transition-all"
                            placeholder="Search organization..."
                            value={grantedSearchQuery}
                            onChange={(e) => setGrantedSearchQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      
                      <div className="p-2 max-h-64 overflow-y-auto custom-scrollbar">
                        {searchedGrantedOrgs.length > 0 ? (
                          searchedGrantedOrgs.map((org) => (
                            <div 
                              key={org} 
                              className="flex items-center gap-2 px-3 py-2.5 hover:bg-red-50/30 cursor-pointer rounded-lg transition-colors group"
                              onClick={() => {
                                setGrantedFilterOrgs(prev => 
                                  prev.includes(org) ? prev.filter(item => item !== org) : [...prev, org]
                                );
                              }}
                            >
                              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${grantedFilterOrgs.includes(org) ? 'bg-[#EF4444] border-none shadow-sm' : 'border-gray-300 group-hover:border-[#EF4444]/50'}`}>
                                {grantedFilterOrgs.includes(org) && <Check className="w-3 h-3 text-white stroke-[3px]" />}
                              </div>
                              <span className={`text-[13px] font-medium transition-colors ${grantedFilterOrgs.includes(org) ? 'text-[#EF4444]' : 'text-gray-700'}`}>{org}</span>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 px-4 text-center">
                            <span className="text-[12px] text-gray-400 font-medium">No organizations found</span>
                          </div>
                        )}
                      </div>

                      {grantedFilterOrgs.length > 0 && (
                        <div className="p-2 border-t border-gray-100 bg-gray-50/50 flex justify-center">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setGrantedFilterOrgs([]);
                            }}
                            className="text-[11px] font-bold text-[#EF4444] hover:underline"
                          >
                            Clear Selection
                          </button>
                        </div>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="space-y-4">
                {Object.keys(groupedGrantedServices).length > 0 ? (
                  Object.entries(groupedGrantedServices).map(([owner, services]) => (
                    <div key={owner} className="bg-white border border-[#F3F4F6] rounded-2xl shadow-sm overflow-hidden">
                      {/* Accordion Header */}
                      <div 
                        className={`px-6 py-4 flex items-center justify-between cursor-pointer transition-all ${expandedGrantedOrg === owner ? 'bg-red-50/30' : 'hover:bg-gray-50'}`}
                        onClick={() => setExpandedGrantedOrg(expandedGrantedOrg === owner ? null : owner)}
                      >
                        <div className="flex items-center gap-4">
                           <h3 className={`text-[16px] font-bold transition-colors ${expandedGrantedOrg === owner ? 'text-[#111827]' : 'text-[#374151]'}`}>{owner}</h3>
                        </div>
                        <div className={`p-1.5 rounded-full bg-white border border-[#E5E7EB] text-[#6B7280] shadow-sm transition-transform duration-300 ${expandedGrantedOrg === owner ? 'rotate-180 border-red-100 text-[#EF4444]' : ''}`}>
                          <ChevronDown className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Accordion Content */}
                      {expandedGrantedOrg === owner && (
                        <div className="px-6 pb-6 pt-2 border-t border-[#F3F4F6] animate-in slide-in-from-top-2 duration-300">
                          <div className="overflow-x-auto border border-[#F1F1F1] rounded-[12px] overflow-hidden mt-4">
                            <table className="w-full border-collapse">
                              <thead className="bg-[#FAFAFA] border-b border-[#E5E7EB]">
                                <tr>
                                  <th className="text-left px-6 py-3.5 text-[12px] font-bold text-[#374151] uppercase tracking-wider">Service Name</th>
                                  <th className="text-left px-6 py-3.5 text-[12px] font-bold text-[#374151] uppercase tracking-wider">Service Type</th>
                                  <th className="text-left px-6 py-3.5 text-[12px] font-bold text-[#374151] uppercase tracking-wider">Access Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {services.map((s) => (
                                  <tr key={s.id} className="border-b border-[#F1F1F1] last:border-b-0 hover:bg-[#F9FAFB] transition-colors group">
                                    <td className="px-6 py-4 text-[14px] font-semibold text-[#111827]">{s.name}</td>
                                    <td className="px-6 py-4">
                                      <span className="inline-flex items-center justify-center px-[10px] py-[4px] text-[11px] font-bold text-[#3D72A2] bg-[#E6F0FA] rounded-full uppercase tracking-tight">
                                        {s.type}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                      <div className="flex items-center gap-[8px] text-[13px] font-medium text-[#374151]">
                                        <Calendar className="w-4 h-4 text-[#6B7280]" />
                                        {s.date}
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/50">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-4">
                      <Search className="w-6 h-6 text-gray-300" />
                    </div>
                    <h3 className="text-[16px] font-bold text-[#374151]">No services found</h3>
                    <p className="text-[13px] text-[#6B7280] mt-1">Try adjusting your filters to see more results.</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* --- BOTTOM CTAs --- Hidden for Organization Admin */}
        {!isOrgAdmin && (
          <div className="flex justify-end gap-3 mt-8 pb-8 md:sticky md:bottom-6 md:z-50 md:bg-white/80 md:backdrop-blur-md md:p-4 md:rounded-2xl md:shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:border md:border-white/20 lg:relative lg:bottom-0 lg:z-0 lg:bg-transparent lg:backdrop-blur-none lg:p-0 lg:shadow-none lg:border-0 lg:mt-8 lg:pb-8">
            <Button 
              variant="outline" 
              onClick={cancelChanges}
              disabled={!hasOwnedChanges && !hasRequestedChanges}
              className="h-11 px-8 rounded-xl font-bold border-gray-200 text-gray-500 hover:bg-gray-50 transition-all"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSaveClick}
              disabled={!hasOwnedChanges && !hasRequestedChanges}
              className="h-11 px-8 rounded-xl font-bold bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-lg shadow-red-100 transition-all active:scale-[0.98]"
            >
              Save Changes
            </Button>
          </div>
        )}

      {/* REDESIGNED CONFIGURATION UPLOAD MODAL */}
      <Dialog open={configModalOpen} onOpenChange={setConfigModalOpen}>
        <DialogContent className="max-w-[540px] bg-white rounded-[24px] border border-[#E5E7EB] shadow-2xl p-0 flex flex-col [&>button]:hidden overflow-hidden">
          
          {/* MODAL HEADER */}
          <div className="pt-8 px-8 pb-6 relative shrink-0">
            <div 
              className="absolute top-6 right-6 w-8 h-8 rounded-lg bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors z-50"
              onClick={() => setConfigModalOpen(false)}
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </div>
            <DialogTitle className="text-[22px] font-bold text-[#EF4444]">Configuration Upload</DialogTitle>
            <DialogDescription className="text-[#6B7280] text-[15px] font-medium mt-1.5">
              Add your matrix file to begin automated processing
            </DialogDescription>
          </div>

          {/* MODAL BODY / DROPZONE */}
          <div className="px-8 pb-8 shrink-0">
            <div className="p-8 border-2 border-dashed border-[#E5E7EB] rounded-[20px] bg-[#F9FAFB]/50 flex flex-col items-center justify-center gap-6 hover:border-[#EF4444] hover:bg-red-50/5 transition-all cursor-pointer group">
               <div className="w-16 h-16 bg-white rounded-2xl border border-[#E5E7EB] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                  <FileUp className="w-8 h-8 text-[#EF4444]" />
               </div>
               
               <div className="flex flex-col items-center gap-2 text-center">
                  <span className="text-[16px] font-bold text-[#374151]">
                     Drag & drop file or <span className="text-[#EF4444]">browse</span>
                  </span>
                  <div className="px-4 py-1.5 bg-white border border-[#E5E7EB] rounded-full shadow-sm">
                     <span className="text-[12px] text-[#6B7280] font-bold">Support: .xlsx, .xls, .csv (Max 10MB)</span>
                  </div>
               </div>

               <div className="flex items-center gap-6 pt-2">
                   <Button 
                      variant="outline" 
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = '.xlsx,.xls,.csv';
                        input.onchange = (e: any) => {
                          if (e.target.files?.[0]) {
                            const file = e.target.files[0];
                            if (activeUploadOrg) {
                              setOrgUploads(prev => ({ ...prev, [activeUploadOrg]: file }));
                              setActiveUploadOrg(null);
                              setConfigModalOpen(false);
                              toast.success(`File uploaded for ${activeUploadOrg}`);
                            } else {
                              handleFileUpload(file);
                              setConfigModalOpen(false);
                              setImportWizardOpen(true);
                            }
                          }
                        };
                        input.click();
                      }}
                      className="h-[40px] px-8 rounded-xl bg-white border-[#E5E7EB] text-[14px] font-bold text-[#111827] shadow-sm hover:bg-gray-50 transition-all border-2"
                   >
                      Choose File
                   </Button>
                   <button className="text-[14px] font-bold text-[#6B7280] hover:text-[#111827] underline decoration-gray-300 underline-offset-4 transition-colors">
                      Sample Template
                   </button>
               </div>
            </div>
          </div>

          {/* MODAL FOOTER */}
          <div className="px-8 py-6 border-t border-[#E5E7EB] bg-white flex justify-end gap-3 shrink-0">
             <Button 
                variant="outline" 
                onClick={() => setConfigModalOpen(false)}
                className="h-[42px] px-8 rounded-xl border-[#E5E7EB] text-[14px] font-bold text-[#374151] hover:bg-gray-50"
             >
                Cancel
             </Button>
             <Button 
                className="h-[42px] px-8 rounded-xl bg-[#F9FAFB] text-[#9CA3AF] text-[14px] font-bold cursor-not-allowed shadow-none border border-[#E5E7EB]"
                disabled
             >
                Confirm & Save
             </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* PROGRESSIVE AUTO-FLOW IMPORT WIZARD (STILL USED FOR RESULTS) */}
      <Dialog open={importWizardOpen} onOpenChange={setImportWizardOpen}>
        <DialogContent className="max-w-[740px] max-h-[85vh] bg-white rounded-[16px] border border-[#E5E7EB] shadow-2xl p-0 flex flex-col [&>button]:hidden overflow-hidden">
          
          {/* FIXED HEADER */}
          <div className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shrink-0">
            {/* Title & Close Button */}
            <div className="pt-[24px] px-[24px] pb-[16px] relative pr-[64px]">
              <div 
                className="absolute top-[16px] right-[16px] w-[32px] h-[32px] rounded-[8px] bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors z-50 px-0"
                onClick={resetImport}
              >
                <X className="w-4 h-4 text-[#6B7280]" />
              </div>
              <DialogTitle className="text-[18px] font-semibold text-[#EF4444]">Import Configuration</DialogTitle>
              <DialogDescription className="text-[#6B7280] text-[14px] font-normal mt-1 leading-tight">
                Add and configure role permissions via matrix file upload
              </DialogDescription>
            </div>
            
            {/* Stepper (Compact) */}
            <div className="flex items-center justify-between px-12 relative h-12 bg-[#F9FAFB]/50 border-t border-[#F3F4F6]">
              {[
                { n: 1, label: "Source" },
                { n: 2, label: "Services" },
                { n: 3, label: "Target" },
                { n: 4, label: "Access" }
              ].map((step, i) => (
                <React.Fragment key={step.n}>
                  <div className="flex flex-col items-center gap-1 z-10 transition-all duration-500">
                    <div className={`
                      w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all duration-500 shadow-sm
                      ${activeStep === i 
                        ? 'bg-[#EF4444] text-white ring-4 ring-red-50' 
                        : (activeStep > i || stepStatuses[i] === 'done') ? 'bg-[#EF4444] text-white' : 'bg-white border border-[#E5E7EB] text-[#6B7280]'}
                    `}>
                      {(activeStep > i || stepStatuses[i] === 'done') ? <Check className="w-4 h-4" /> : step.n}
                    </div>
                    <span className={`text-[11px] font-semibold tracking-tight ${activeStep === i ? 'text-[#EF4444]' : 'text-[#6B7280]'}`}>
                      {step.label}
                    </span>
                  </div>
                  {i < 3 && (
                    <div className={`h-[2px] flex-1 mx-2 rounded-full mb-4 ${activeStep >= i ? 'bg-[#EF4444]' : 'bg-[#E5E7EB]'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* SCROLLABLE BODY */}
          <div className="flex-1 overflow-y-auto px-[32px] py-[32px] custom-scrollbar bg-white">
            
            {/* PHASE 1: UPLOAD */}
            {!uploadedFile && (
              <div className="flex flex-col gap-6 animate-in fade-in duration-300 max-w-[620px] mx-auto">
                <div className="flex flex-col gap-1 text-center">
                   <h3 className="text-[17px] font-semibold text-[#111827]">Configuration Upload</h3>
                   <p className="text-[14px] text-[#6B7280]">Add your matrix file to begin automated processing</p>
                </div>
                
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (e.dataTransfer.files[0]) handleFileUpload(e.dataTransfer.files[0]);
                  }}
                  className="w-full h-56 border-2 border-dashed border-[#E5E7EB] rounded-[16px] bg-[#F9FAFB]/50 flex flex-col items-center justify-center gap-5 hover:border-[#EF4444] hover:bg-red-50/10 transition-all cursor-pointer shadow-sm group"
                >
                   <div className="w-14 h-14 bg-white rounded-2xl border border-[#E5E7EB] flex items-center justify-center text-gray-400 shadow-sm group-hover:scale-110 transition-transform">
                      <FileUp className="w-7 h-7 text-[#EF4444]" />
                   </div>
                   <div className="flex flex-col items-center gap-1.5">
                      <span className="text-[15px] font-medium text-[#374151]">Drag & drop file or <span className="text-[#EF4444] font-bold">browse</span></span>
                      <span className="text-[12px] text-[#6B7280] font-medium tracking-tight px-4 py-1.5 bg-white border border-[#E5E7EB] rounded-full shadow-sm">Support: .xlsx, .xls, .csv (Max 10MB)</span>
                   </div>
                   <div className="flex items-center gap-4 pt-2">
                       <Button 
                          variant="outline" 
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.onchange = (e: any) => handleFileUpload(e.target.files[0]);
                            input.click();
                          }}
                          className="h-[36px] px-6 rounded-[10px] bg-white border-[#E5E7EB] text-[13px] font-bold text-[#111827] shadow-sm active:scale-95 transition-all"
                       >
                          Choose File
                       </Button>
                       <a href="#" className="text-[13px] font-bold text-[#6B7280] hover:text-[#111827] underline decoration-gray-300 transition-all underline-offset-4">
                          Sample Template
                       </a>
                   </div>
                </div>
              </div>
            )}

            {/* PHASE 2: PROGRESSIVE PROCESSING */}
            {uploadedFile && stepStatuses[3] !== 'done' && (
              <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-400 max-w-[500px] mx-auto py-8">
                 <div className="flex flex-col items-center gap-1.5 mb-8 text-center bg-[#F9FAFB] p-8 rounded-[24px] border border-[#F3F4F6] shadow-sm">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-[#E5E7EB] flex items-center justify-center mb-2">
                       <FileText className="w-8 h-8 text-[#EF4444]" />
                    </div>
                    <span className="text-[16px] font-bold text-[#111827]">{uploadedFile?.name || "Matrix file"}</span>
                    <span className="text-[12px] text-[#059669] font-bold bg-[#DCFCE7] px-4 py-1 rounded-full border border-emerald-100 shadow-sm mt-1">Securely Uploaded</span>
                 </div>

                 <div className="flex flex-col gap-4 px-2">
                    {[
                      { idx: 0, textIdle: "Detecting source...", textActive: "Detecting source organization...", textDone: `Source detected: ${importSource || organizations[0]}` },
                      { idx: 1, textIdle: "Mapping services...", textActive: "Mapping services from data...", textDone: "5 services mapped successfully" },
                      { idx: 2, textIdle: "Mapping targets...", textActive: "Mapping target organizations...", textDone: "3 organizations identified" },
                      { idx: 3, textIdle: "Applying access rules...", textActive: "Applying final access permissions...", textDone: "Access rules fully applied" }
                    ].map((row, i) => (
                      <div key={i} className={`flex items-center gap-4 transition-all duration-300 ${stepStatuses[i] === 'idle' ? 'opacity-30' : 'opacity-100'}`}>
                         <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                            {stepStatuses[i] === 'loading' && <Loader2 className="w-5 h-5 text-[#EF4444] animate-spin" />}
                            {stepStatuses[i] === 'done' && (
                              <div className="w-6 h-6 rounded-full bg-[#DCFCE7] flex items-center justify-center">
                                <Check className="w-3.5 h-3.5 text-[#10B981] stroke-[4px]" />
                              </div>
                            )}
                            {stepStatuses[i] === 'idle' && <div className="w-2 h-2 rounded-full bg-gray-300" />}
                         </div>
                         <span className={`text-[14px] font-medium transition-all ${stepStatuses[i] === 'loading' ? 'text-[#EF4444] font-bold' : (stepStatuses[i] === 'done' ? 'text-[#374151]' : 'text-gray-400')}`}>
                            {stepStatuses[i] === 'loading' ? row.textActive : (stepStatuses[i] === 'done' ? row.textDone : row.textIdle)}
                         </span>
                      </div>
                    ))}
                 </div>
              </div>
            )}

            {/* PHASE 3: REVIEW SUMMARY */}
            {stepStatuses[3] === 'done' && (
              <div className="flex flex-col gap-8 animate-in zoom-in-95 duration-500 pb-4">
                 
                 {/* Compact Summary Cards */}
                <div className="bg-white p-6 rounded-[20px] border border-[#E5E7EB] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col gap-5 relative overflow-hidden">
                   <div className="flex items-center justify-between border-b border-[#F3F4F6] pb-5 mb-1">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider">Source Organization</span>
                        <span className="text-[18px] font-bold text-[#111827]">{importSource}</span>
                      </div>
                      <div className="bg-[#DCFCE7] px-4 py-1.5 rounded-full flex items-center gap-2 border border-emerald-100 shadow-sm">
                         <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
                         <span className="text-[11px] font-bold text-[#059669] uppercase tracking-tight">Sync Ready</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="flex flex-col bg-[#F9FAFB] p-4 rounded-[16px] border border-[#F3F4F6] shadow-sm">
                        <span className="text-[12px] font-semibold text-[#6B7280]">Services</span>
                        <span className="text-[15px] font-bold text-[#111827] mt-1">{importServices.length} Detected</span>
                      </div>
                      <div className="flex flex-col bg-[#F9FAFB] p-4 rounded-[16px] border border-[#F3F4F6] shadow-sm">
                        <span className="text-[12px] font-semibold text-[#6B7280]">Targets</span>
                        <span className="text-[15px] font-bold text-[#111827] mt-1">{importTargets.length} Units</span>
                      </div>
                      <div className="flex flex-col bg-[#F9FAFB] p-4 rounded-[16px] border border-[#F3F4F6] shadow-sm">
                        <span className="text-[12px] font-semibold text-[#6B7280]">{(isOrgAdmin || isDeptAdmin) ? "Target Orgs" : "Departments"}</span>
                        <span className="text-[15px] font-bold text-[#111827] mt-1">Automapped</span>
                      </div>
                   </div>
                </div>

                {/* Compact Preview Table */}
                <div className="flex flex-col gap-4">
                   <div className="flex items-center justify-between px-1">
                      <h4 className="text-[13px] font-bold text-[#4B5563] uppercase tracking-[0.1em]">Configuration Overview</h4>
                      <span className="text-[11px] font-bold text-[#6B7280] bg-gray-100 px-3 py-1 rounded-full">Top 5 Records</span>
                   </div>
                   <div className="bg-white rounded-[16px] border border-[#E5E7EB] overflow-hidden shadow-sm">
                      <table className="w-full">
                        <thead className="bg-[#F9FAFB] border-b border-[#F3F4F6]">
                          <tr>
                             <th className="px-5 py-3 text-left text-[12px] font-bold text-[#6B7280] uppercase">Service</th>
                             {importTargets.slice(0, 3).map(tg => (
                               <th key={tg} className="px-5 py-3 text-center text-[12px] font-bold text-[#6B7280] uppercase">{tg}</th>
                             ))}
                          </tr>
                        </thead>
                        <tbody>
                           {importServices.slice(0, 5).map((service, sIdx) => (
                             <tr key={service} className="border-b border-[#F9FAFB] last:border-0 hover:bg-gray-50/50 transition-all">
                                <td className="px-5 py-3 text-[14px] font-semibold text-[#374151]">{service}</td>
                                {importTargets.slice(0, 3).map((_, tIdx) => (
                                   <td key={tIdx} className="px-5 py-3 text-center">
                                      <div className={`w-5 h-5 mx-auto rounded-md flex items-center justify-center shadow-sm ${(sIdx + tIdx) % 2 === 0 ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#FEE2E2] text-[#991B1B]'}`}>
                                         {(sIdx + tIdx) % 2 === 0 ? <Check className="w-3.5 h-3.5 stroke-[4.5]" /> : <X className="w-3.5 h-3.5 stroke-[3]" />}
                                      </div>
                                   </td>
                                ))}
                             </tr>
                           ))}
                        </tbody>
                      </table>
                   </div>
                </div>
              </div>
            )}
          </div>

          {/* FOOTER ACTION BAR */}
          <div className="sticky bottom-0 z-40 bg-white py-[16px] px-[24px] border-t border-[#E5E7EB] shrink-0 flex justify-end gap-[12px] mt-auto">
            <Button 
              variant="outline" 
              onClick={resetImport}
              className="h-[36px] px-[16px] rounded-[10px] border border-[#E5E7EB] bg-white text-[14px] font-medium text-[#374151] hover:bg-gray-50 transition-colors shadow-none"
            >
              Cancel
            </Button>
            <Button 
              disabled={stepStatuses[3] !== 'done' || isProcessing}
              onClick={stepStatuses[3] === 'done' ? resetImport : undefined}
              className={`
                h-[36px] px-[16px] rounded-[10px] text-[14px] font-semibold flex items-center gap-2 transition-all shadow-md
                ${stepStatuses[3] === 'done' ? 'bg-[#EF4444] text-white hover:bg-[#DC2626]' : 'bg-[#F3F4F6] text-[#9CA3AF] cursor-not-allowed shadow-none'}
              `}
            >
              Import Matrix
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* KEEP PREVIOUS DIALOGS (DENY ACCESS) */}
      {/* UPLOAD SUPPORTING DOCUMENT DIALOG (Triggered on Deny Access) */}
      <Dialog open={denyDialogOpen} onOpenChange={setDenyDialogOpen}>
        <DialogContent className="max-w-[700px] h-[500px] bg-white rounded-[16px] border border-[#E5E7EB] shadow-2xl p-0 flex flex-col [&>button]:hidden overflow-hidden">
          
          {/* FIXED HEADER */}
          <div className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shrink-0">
            <div className="pt-[24px] px-[24px] pb-[16px] relative pr-[64px]">
              <div 
                className="absolute top-[16px] right-[16px] w-[32px] h-[32px] rounded-[8px] bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors z-50 px-0"
                onClick={() => setDenyDialogOpen(false)}
              >
                <X className="w-4 h-4 text-[#6B7280]" />
              </div>
              <DialogTitle className="text-[18px] font-semibold text-[#EF4444]">Upload Supporting Document</DialogTitle>
              <DialogDescription className="text-[#6B7280] text-[14px] font-normal mt-1 leading-tight">
                Please upload a supporting document to deny access for audit purposes
              </DialogDescription>
            </div>
          </div>

          {/* SCROLLABLE BODY */}
          <div className="flex-1 overflow-y-auto px-[32px] py-[32px] custom-scrollbar bg-white flex items-center justify-center">
            <div className="flex flex-col gap-6 w-full max-w-[580px]">
              
              <div 
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  // For simplicity in this demo, we'll just acknowledge the drop
                  toast.success("Document attached");
                }}
                className="w-full h-56 border-2 border-dashed border-[#E5E7EB] rounded-[16px] bg-[#F9FAFB]/50 flex flex-col items-center justify-center gap-5 hover:border-[#EF4444] hover:bg-red-50/10 transition-all cursor-pointer shadow-sm group"
              >
                 <div className="w-14 h-14 bg-white rounded-2xl border border-[#E5E7EB] flex items-center justify-center text-gray-400 shadow-sm group-hover:scale-110 transition-transform">
                    <FileSpreadsheet className="w-7 h-7 text-[#EF4444]" />
                 </div>
                 
                 <div className="flex flex-col items-center gap-1.5 text-center">
                    <span className="text-[15px] font-medium text-[#374151]">Drag & drop file or <span className="text-[#EF4444] font-bold">browse</span></span>
                    <span className="text-[12px] text-[#6B7280] font-medium tracking-tight px-4 py-1.5 bg-white border border-[#E5E7EB] rounded-full shadow-sm uppercase">PDF, DOC, DOCX, TXT (Max 10MB)</span>
                 </div>

                 <div className="flex items-center gap-4 pt-2">
                     <Button 
                        variant="outline" 
                        onClick={() => {
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.click();
                        }}
                        className="h-[36px] px-6 rounded-[10px] bg-white border-[#E5E7EB] text-[13px] font-bold text-[#111827] shadow-sm active:scale-95 transition-all"
                     >
                        Choose File
                     </Button>
                 </div>
              </div>
            </div>
          </div>

          {/* FOOTER ACTION BAR */}
          <div className="sticky bottom-0 z-40 bg-white py-[16px] px-[24px] border-t border-[#E5E7EB] shrink-0 flex justify-end gap-[12px] mt-auto">
            <Button 
              variant="outline" 
              onClick={() => setDenyDialogOpen(false)}
              className="h-[36px] px-[16px] rounded-[10px] border border-[#E5E7EB] bg-white text-[14px] font-medium text-[#374151] hover:bg-gray-50 transition-colors shadow-none"
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmDenyAccess}
              className="h-[36px] px-[16px] rounded-[10px] bg-[#EF4444] text-white text-[14px] font-semibold hover:bg-[#DC2626] transition-all shadow-md active:scale-95"
            >
              Confirm & Deny Access
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* SAVE CONFIGURATION UPLOAD DIALOG (Triggered on Save Changes) */}
      {/* SUCCESS MODAL (Replaces Configuration Upload) */}
      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className="p-0 overflow-hidden" style={{maxWidth:'450px', borderRadius:'24px'}}>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4 text-gray-400" />
          </DialogClose>
          <div className="p-10 pb-10 flex flex-col items-center text-center relative">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-[#00C07F] rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(0,192,127,0.25)]">
                <div className="w-12 h-12 rounded-full border-4 border-white flex items-center justify-center">
                  <Check className="w-7 h-7 text-white" strokeWidth={4} />
                </div>
              </div>
            </div>
            
            <h3 className="text-[22px] font-bold text-[#1A1A1A] mb-2">Changes Saved!</h3>
            <p className="text-[15px] text-[#6B7280] mb-8 leading-relaxed max-w-[320px]">
              Access matrix permissions have been updated and synchronized successfully across all departments.
            </p>

            <Button
              onClick={() => setSuccessModalOpen(false)}
              className="w-full bg-[#00C07F] hover:bg-[#00A86F] text-white rounded-full h-[52px] px-10 font-bold transition-all border-0 shadow-[0_8px_20px_rgba(0,192,127,0.2)] text-[16px] active:scale-95"
            >
              Great, thank you!
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* REASON FOR CHANGE DIALOG */}
      <Dialog open={reasonDialogOpen} onOpenChange={setReasonDialogOpen}>
        <DialogContent className="max-w-[500px] min-h-[500px] h-[500px] bg-white rounded-[24px] border border-[#E5E7EB] shadow-2xl p-0 flex flex-col [&>button]:hidden overflow-hidden">
          <div className="pt-8 px-8 pb-6 relative shrink-0">
            <div 
              className="absolute top-6 right-6 w-8 h-8 rounded-lg bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors z-50"
              onClick={() => setReasonDialogOpen(false)}
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </div>
            <DialogTitle className="text-[22px] font-bold text-[#EF4444]">Reason for Change</DialogTitle>
            <DialogDescription className="text-[#6B7280] text-[15px] font-medium mt-1.5">
              Please provide a reason for updating the access matrix permissions.
            </DialogDescription>
          </div>

          <div className="flex-1 overflow-y-auto px-1 pb-8 custom-scrollbar">
            <Accordion type="multiple" defaultValue={[]} className="w-full">
              {(changeType === 'grant' || changeType === 'both') && (
                <AccordionItem value="grant-section" className="border border-transparent rounded-[12px] px-7 transition-all duration-200 hover:border-green-200 hover:bg-green-50/30">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                        <Check className="w-4 h-4 text-green-600" />
                      </div>
                      <span className="text-[16px] font-bold text-[#111827]">Granting Access</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-2">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-bold text-[#374151]">Reason for granting access</label>
                        <Textarea 
                          placeholder="Enter the reason for granting access permissions..."
                          className="min-h-[100px] rounded-[16px] border-[#E5E7EB] focus:ring-[#EF4444]/10 focus:border-[#EF4444] text-[14px] font-medium p-4 bg-gray-50/30"
                          value={grantReason}
                          onChange={(e) => setGrantReason(e.target.value)}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[14px] font-bold text-[#374151]">Supporting Document</label>
                          <span className="text-[12px] font-medium text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-md">Optional</span>
                        </div>
                        
                        <div 
                          className={`
                            w-full border-2 border-dashed rounded-[20px] bg-[#F9FAFB]/30 flex flex-col items-center justify-center gap-4 py-8 transition-all cursor-pointer group relative
                            ${grantReasonFile ? 'border-[#059669]/30 bg-[#ECFDF5]/30' : 'border-[#E5E7EB] hover:border-[#EF4444]/30 hover:bg-red-50/5'}
                          `}
                          onClick={() => document.getElementById('grant-file-upload')?.click()}
                        >
                          {grantReasonFile ? (
                            <div className="flex flex-col items-center gap-3 w-full px-6 text-center animate-in fade-in zoom-in-95 duration-300">
                              <div className="w-12 h-12 bg-white rounded-2xl border border-green-100 flex items-center justify-center text-[#059669] shadow-sm group-hover:scale-105 transition-transform">
                                <Check className="w-6 h-6 stroke-[3px]" />
                              </div>
                              <div className="flex flex-col gap-1 items-center">
                                 <span className="text-[14px] font-bold text-[#065F46] max-w-[320px] truncate">{grantReasonFile.name}</span>
                                 <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] font-bold text-[#059669] uppercase tracking-tight">File ready</span>
                                    <div className="w-1 h-1 rounded-full bg-[#059669]/30" />
                                    <span className="text-[11px] font-medium text-[#6B7280]">{(grantReasonFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4 mt-2">
                                <button 
                                   onClick={(e) => { e.stopPropagation(); setGrantReasonFile(null); }}
                                   className="text-[12px] font-bold text-red-500 hover:text-red-700 transition-colors"
                                >
                                   Remove
                                </button>
                                <div className="w-px h-3 bg-gray-200" />
                                <button 
                                   onClick={(e) => { e.stopPropagation(); document.getElementById('grant-file-upload')?.click(); }}
                                   className="text-[12px] font-bold text-[#374151] hover:text-[#EF4444] transition-colors"
                                >
                                   Replace File
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-4 py-2">
                              <div className="w-12 h-12 bg-white rounded-2xl border border-[#E5E7EB] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <FileUp className="w-7 h-7 text-[#EF4444]" />
                              </div>
                              <div className="flex flex-col items-center gap-2 text-center px-4">
                                <span className="text-[15px] font-bold text-[#374151]">Drag & drop file or <span className="text-[#EF4444]">browse</span></span>
                                <div className="px-4 py-1.5 bg-white border border-[#E5E7EB] rounded-full shadow-sm">
                                  <span className="text-[11px] text-[#6B7280] font-bold uppercase tracking-wider">PDF, DOC, DOCX, TXT (MAX 10MB)</span>
                                </div>
                              </div>
                            </div>
                          )}
                          <input type="file" id="grant-file-upload" className="hidden" onChange={(e) => setGrantReasonFile(e.target.files?.[0] || null)} />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}

              {(changeType === 'revoke' || changeType === 'both') && (
                <AccordionItem value="revoke-section" className="border border-transparent rounded-[12px] px-7 transition-all duration-200 hover:border-red-200 hover:bg-red-50/30">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                        <X className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="text-[16px] font-bold text-[#111827]">Removing Access</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pt-2">
                    <div className="flex flex-col gap-6">
                      <div className="flex flex-col gap-2">
                        <label className="text-[14px] font-bold text-[#374151]">Reason for removing access</label>
                        <Textarea 
                          placeholder="Enter the reason for removing access permissions..."
                          className="min-h-[100px] rounded-[16px] border-[#E5E7EB] focus:ring-[#EF4444]/10 focus:border-[#EF4444] text-[14px] font-medium p-4 bg-gray-50/30"
                          value={revokeReason}
                          onChange={(e) => setRevokeReason(e.target.value)}
                        />
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[14px] font-bold text-[#374151]">Supporting Document</label>
                          <span className="text-[12px] font-medium text-[#6B7280] bg-[#F3F4F6] px-2 py-0.5 rounded-md">Optional</span>
                        </div>
                        
                        <div 
                          className={`
                            w-full border-2 border-dashed rounded-[20px] bg-[#F9FAFB]/30 flex flex-col items-center justify-center gap-4 py-8 transition-all cursor-pointer group relative
                            ${revokeReasonFile ? 'border-[#059669]/30 bg-[#ECFDF5]/30' : 'border-[#E5E7EB] hover:border-[#EF4444]/30 hover:bg-red-50/5'}
                          `}
                          onClick={() => document.getElementById('revoke-file-upload')?.click()}
                        >
                          {revokeReasonFile ? (
                            <div className="flex flex-col items-center gap-3 w-full px-6 text-center animate-in fade-in zoom-in-95 duration-300">
                              <div className="w-12 h-12 bg-white rounded-2xl border border-green-100 flex items-center justify-center text-[#059669] shadow-sm group-hover:scale-105 transition-transform">
                                <Check className="w-6 h-6 stroke-[3px]" />
                              </div>
                              <div className="flex flex-col gap-1 items-center">
                                 <span className="text-[14px] font-bold text-[#065F46] max-w-[320px] truncate">{revokeReasonFile.name}</span>
                                 <div className="flex items-center gap-1.5">
                                    <span className="text-[11px] font-bold text-[#059669] uppercase tracking-tight">File ready</span>
                                    <div className="w-1 h-1 rounded-full bg-[#059669]/30" />
                                    <span className="text-[11px] font-medium text-[#6B7280]">{(revokeReasonFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                 </div>
                              </div>
                              <div className="flex items-center gap-4 mt-2">
                                <button 
                                   onClick={(e) => { e.stopPropagation(); setRevokeReasonFile(null); }}
                                   className="text-[12px] font-bold text-red-500 hover:text-red-700 transition-colors"
                                >
                                   Remove
                                </button>
                                <div className="w-px h-3 bg-gray-200" />
                                <button 
                                   onClick={(e) => { e.stopPropagation(); document.getElementById('revoke-file-upload')?.click(); }}
                                   className="text-[12px] font-bold text-[#374151] hover:text-[#EF4444] transition-colors"
                                >
                                   Replace File
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-4 py-2">
                              <div className="w-12 h-12 bg-white rounded-2xl border border-[#E5E7EB] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <FileUp className="w-7 h-7 text-[#EF4444]" />
                              </div>
                              <div className="flex flex-col items-center gap-2 text-center px-4">
                                <span className="text-[15px] font-bold text-[#374151]">Drag & drop file or <span className="text-[#EF4444]">browse</span></span>
                                <div className="px-4 py-1.5 bg-white border border-[#E5E7EB] rounded-full shadow-sm">
                                  <span className="text-[11px] text-[#6B7280] font-bold uppercase tracking-wider">PDF, DOC, DOCX, TXT (MAX 10MB)</span>
                                </div>
                              </div>
                            </div>
                          )}
                          <input type="file" id="revoke-file-upload" className="hidden" onChange={(e) => setRevokeReasonFile(e.target.files?.[0] || null)} />
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>
          </div>

          <div className="px-8 py-6 border-t border-[#E5E7EB] bg-[#F9FAFB]/50 flex justify-end gap-3 shrink-0">
             <Button 
                variant="outline" 
                onClick={() => setReasonDialogOpen(false)}
                className="h-[42px] px-8 rounded-xl border-[#E5E7EB] text-[14px] font-bold text-[#374151] hover:bg-white"
             >
                Cancel
             </Button>
             <Button 
                onClick={() => {
                  setReasonDialogOpen(false);
                  saveChanges();
                }}
                disabled={
                  (changeType === 'grant' && !grantReason.trim()) ||
                  (changeType === 'revoke' && !revokeReason.trim()) ||
                  (changeType === 'both' && (!grantReason.trim() || !revokeReason.trim()))
                }
                className="h-[42px] px-8 rounded-xl bg-[#EF4444] text-white text-[14px] font-bold hover:bg-[#DC2626] shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
             >
                Confirm & Save
             </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Print Report Section (Only visible during printing) */}
      <div id="print-report" className="hidden print:block font-sans">
        <div className="flex flex-col gap-8">
          {/* Report Header */}
          <div className="flex justify-between items-start border-b-2 border-slate-200 pb-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Service Access Request Report</h1>
              <div className="flex items-center gap-3 text-slate-600 mt-1">
                <Building2 className="w-5 h-5" />
                <span className="text-lg font-semibold">{selectedOrg}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Report Date</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">{new Date().toLocaleDateString('en-GB')}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 py-2">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Module</p>
              <p className="text-sm font-semibold text-slate-700">Entity Access Matrix</p>
            </div>
            <div className="text-right">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
               <p className="text-sm font-semibold text-[#EF4444]">Pending Submission</p>
            </div>
          </div>

          {/* Requested Changes Details */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <LayoutGrid className="w-5 h-5 text-[#EF4444]" />
              <h2 className="text-xl font-bold text-slate-800">Detailed Request Configuration</h2>
            </div>
            
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Service Description</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Department / Unit</th>
                    <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Requested Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {(() => {
                    const printChanges: { service: string, dept: string, action: string }[] = [];
                    const collectChanges = (nodes: ServiceNode[], originals: ServiceNode[]) => {
                      nodes.forEach(node => {
                        const original = originals.find(o => o.id === node.id);
                        if (!original) return;
                        
                        node.access.forEach((access, idx) => {
                          if (access !== original.access[idx]) {
                            printChanges.push({
                              service: node.resource,
                              dept: DEPARTMENTS[idx],
                              action: access ? 'Grant Access' : 'Revoke Access'
                            });
                          }
                        });
                        
                        if (node.children && original.children) {
                          collectChanges(node.children, original.children);
                        }
                      });
                    };
                    
                    collectChanges(requestedServices, originalRequestedServices);
                    
                    if (printChanges.length === 0) {
                      return (
                        <tr>
                          <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">
                            No pending configuration changes found for printing.
                          </td>
                        </tr>
                      );
                    }

                    return printChanges.map((change, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 text-sm text-slate-500 font-mono">{String(idx + 1).padStart(2, '0')}</td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-bold text-slate-900">{change.service}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-medium text-slate-600">{change.dept}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight ${change.action === 'Grant Access' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                            {change.action}
                          </span>
                        </td>
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Disclaimer */}
          <div className="mt-12 border-t border-slate-100 pt-6">
            <div className="flex justify-between items-center text-[10px] text-slate-400 uppercase tracking-[2px] font-medium">
              <span>BSDI Management Console • Internal Audit Copy</span>
              <span>Proprietary & Confidential</span>
            </div>
            <div className="mt-20 flex justify-end">
              <div className="flex flex-col items-center">
                <div className="w-56 h-[1.5px] bg-slate-900 mb-3"></div>
                <p className="text-[11px] text-slate-900 font-bold uppercase tracking-[3px]">Authorizer Signature</p>
                <p className="text-[9px] text-slate-400 mt-1 italic font-medium">BSDI Approval Authority</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F9FAFB;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #D1D5DB;
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: #F9FAFB;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: #DC2626;
        }
      `}</style>
    </div>
  </div>
  );
};

export default EntityAccessMatrix;