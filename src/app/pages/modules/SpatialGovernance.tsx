import { useState, useRef, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { Switch } from "../../components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "../../components/ui/dropdown-menu";
import { 
  MapPin, Anchor, AlertTriangle, Grid, ChevronRight, Edit, Check,
  ZoomIn, ZoomOut, Layers, ChevronDown, Square, Circle, Minus, Pentagon, Search, X, Eye, EyeOff, Plus, ChevronUp, ChevronLeft, Shield, Users, Trash2, Printer, FileText, Download, Sun, Moon, Undo2, Redo2, RotateCcw, Move, Scissors, Merge
} from "lucide-react";
import { toast } from "sonner";
import { OpenStreetMap } from "../../components/OpenStreetMap";
import type Map from 'ol/Map';

// Spatial Governance Module
const entities = [
  {
    id: 1,
    name: "Ministry of Housing",
    type: "Application",
    lastModified: "2024-02-18",
    status: "Active",
  },
  {
    id: 2,
    name: "Electricity Authority",
    type: "Data",
    lastModified: "2024-02-15",
    status: "Active",
  },
  {
    id: 3,
    name: "Environment Council",
    type: "Custom",
    lastModified: "2024-02-10",
    status: "Under Review",
  },
  {
    id: 4,
    name: "Transport Ministry",
    type: "Application",
    lastModified: "2024-02-08",
    status: "Active",
  },
  {
    id: 5,
    name: "Coast Guard",
    type: "Data",
    lastModified: "2024-01-30",
    status: "Active",
  },
];

const registeredEntitiesList = [
  { 
    name: "Ministry of Housing", 
    description: "Residential Zoning",
    details: {
      datasets: 12,
      lastUpdate: "2024-02-18",
      coordinator: "Jawaher Rashed",
      coverage: "95%"
    }
  },
  { 
    name: "Electricity Authority", 
    description: "Infrastructure Grid",
    details: {
      datasets: 8,
      lastUpdate: "2024-02-15",
      coordinator: "Sara Abdulla",
      coverage: "88%"
    }
  },
  { 
    name: "Environment Council", 
    description: "Protected Zones",
    details: {
      datasets: 6,
      lastUpdate: "2024-02-10",
      coordinator: "Khalid Mohamed",
      coverage: "92%"
    }
  },
  { 
    name: "Transport Ministry", 
    description: "Road Networks",
    details: {
      datasets: 15,
      lastUpdate: "2024-02-08",
      coordinator: "Muneera Khamis",
      coverage: "98%"
    }
  },
  { 
    name: "Coast Guard", 
    description: "Coastal Borders",
    details: {
      datasets: 5,
      lastUpdate: "2024-01-30",
      coordinator: "Ali Salman",
      coverage: "100%"
    }
  },
];

const mapLayers = [
  { 
    name: "Addresses", 
    hasSubLayers: true,
    subLayers: ["ADDRESSES"]
  },
  { name: "Streetcenterlines", hasSubLayers: false },
  { name: "wip_ministrialroads", hasSubLayers: false },
  { name: "Mtt_network", hasSubLayers: false },
  { name: "Tse_network", hasSubLayers: false },
  { name: "District_cooling", hasSubLayers: false },
  { name: "Ewc_wdd", hasSubLayers: false },
  { 
    name: "WaterDistributionDataset", 
    hasSubLayers: true,
    subLayers: [
      "SystemValve",
      "AirValve",
      "ServiceValve",
      "Fitting",
      "Hydrant",
      "WServicePoint",
      "Meter",
      "CasingProtection",
      "ServicePipe",
      "MainPipe"
    ]
  },
];

// Access Roles data for the new table
const accessRoles: Array<{
  id: number;
  permissionName: string;
  accessType: "Application" | "Data" | "Spatial";
  assignedArea: string;
  status: string;
  lastUpdated: string;
}> = [
  {
    id: 1,
    permissionName: "View Building Records",
    accessType: "Application",
    assignedArea: "All Governorates",
    status: "Active",
    lastUpdated: "2024-03-08",
  },
  {
    id: 2,
    permissionName: "Edit Infrastructure Data",
    accessType: "Data",
    assignedArea: "Capital Governorate",
    status: "Active",
    lastUpdated: "2024-03-07",
  },
  {
    id: 3,
    permissionName: "Manage Protected Zones",
    accessType: "Spatial",
    assignedArea: "Northern Region",
    status: "Active",
    lastUpdated: "2024-03-06",
  },
  {
    id: 4,
    permissionName: "Access Road Network Data",
    accessType: "Data",
    assignedArea: "Muharraq Governorate",
    status: "Active",
    lastUpdated: "2024-03-05",
  },
  {
    id: 5,
    permissionName: "Edit Coastal Boundaries",
    accessType: "Spatial",
    assignedArea: "Coastal Zone",
    status: "Active",
    lastUpdated: "2024-03-04",
  },
  {
    id: 6,
    permissionName: "View Dashboard Analytics",
    accessType: "Application",
    assignedArea: "All Areas",
    status: "Active",
    lastUpdated: "2024-03-03",
  },
  {
    id: 7,
    permissionName: "Manage Utility Networks",
    accessType: "Data",
    assignedArea: "Southern Governorate",
    status: "Active",
    lastUpdated: "2024-03-02",
  },
  {
    id: 8,
    permissionName: "Define Administrative Boundaries",
    accessType: "Spatial",
    assignedArea: "Central District",
    status: "Active",
    lastUpdated: "2024-03-01",
  },
];

const permissionGroups = [
  { id: 1, name: "GIS Access Team", users: 142, status: "Active" },
  { id: 2, name: "Map Editing Team", users: 89, status: "Active" },
  { id: 3, name: "Spatial Review Team", users: 67, status: "Active" },
  { id: 4, name: "Data Access Group", users: 56, status: "Active" },
];

const permissionUsers = [
  { id: 1, name: "Ahmed Hassan", organization: "Ministry of Housing", role: "GIS Analyst", accessLevel: "Edit", status: "Active" },
  { id: 2, name: "Fatima Ali", organization: "Urban Planning Authority", role: "Reviewer", accessLevel: "View", status: "Active" },
  { id: 3, name: "Khalid Noor", organization: "Transport Authority", role: "Analyst", accessLevel: "View", status: "Active" },
  { id: 4, name: "Lulwa Saad Mujaddam", organization: "Ministry of Housing", role: "Data Manager", accessLevel: "Approve", status: "Active" },
  { id: 5, name: "Omar Rashid", organization: "Urban Planning Authority", role: "GIS Specialist", accessLevel: "Edit", status: "Active" },
  { id: 6, name: "Noor Salman", organization: "Environment Authority", role: "Spatial Analyst", accessLevel: "View", status: "Active" },
];

const availableOrgUsers = [
  { id: 101, name: "Ahmed Hassan", role: "GIS Analyst" },
  { id: 102, name: "Fatima Ali", role: "Data Reviewer" },
  { id: 103, name: "Khalid Noor", role: "Metadata Editor" },
  { id: 104, name: "Noor Salman", role: "Department Admin" },
  { id: 105, name: "Lulwa Saad Mujaddam", role: "GIS Specialist" },
  { id: 106, name: "Ali Hussain", role: "Spatial Analyst" },
];

// Mock users for boundary assignment
const allUsers = [
  { id: 1, name: "Ahmed Khalid", organization: "Ministry of Housing", email: "ahmed.k@housing.gov.bh" },
  { id: 2, name: "Lulwa Saad Mujaddam", organization: "Electricity Authority", email: "sara.m@electricity.gov.bh" },
  { id: 3, name: "Mohammed Hassan", organization: "Environment Council", email: "m.hassan@environment.gov.bh" },
  { id: 4, name: "Fatima Ibrahim", organization: "Transport Ministry", email: "f.ibrahim@transport.gov.bh" },
  { id: 5, name: "Ali Mansoor", organization: "Ministry of Housing", email: "ali.m@housing.gov.bh" },
  { id: 6, name: "Noor Salman", organization: "Coast Guard", email: "n.salman@coastguard.gov.bh" },
  { id: 7, name: "Khalid Ahmed", organization: "Environment Council", email: "k.ahmed@environment.gov.bh" },
  { id: 8, name: "Layla Hassan", organization: "Electricity Authority", email: "l.hassan@electricity.gov.bh" },
  { id: 9, name: "Omar Rashid", organization: "Transport Ministry", email: "o.rashid@transport.gov.bh" },
  { id: 10, name: "Aisha Mohammed", organization: "Ministry of Housing", email: "a.mohammed@housing.gov.bh" },
];

const organizations = [
  "Ministry of Housing",
  "Electricity Authority",
  "Environment Council",
  "Transport Ministry",
  "Coast Guard",
  "Transport Authority"
];

const boundaryTypes = [
  "Residential Zoning",
  "Infrastructure Grid",
  "Protected Zones",
  "Road Networks",
  "Coastal Borders"
];

// Mock data for blocks/districts/areas
const blocksData = [
  { id: 1, name: "Block 301 - Manama", district: "Manama", type: "Residential", coordinates: [26.2285, 50.5860] },
  { id: 2, name: "Block 215 - Muharraq", district: "Muharraq", type: "Commercial", coordinates: [26.2572, 50.6110] },
  { id: 3, name: "Block 410 - Riffa", district: "Riffa", type: "Mixed Use", coordinates: [26.1300, 50.5550] },
  { id: 4, name: "Block 102 - Isa Town", district: "Isa Town", type: "Residential", coordinates: [26.1736, 50.5478] },
  { id: 5, name: "Block 520 - Hamad Town", district: "Hamad Town", type: "Industrial", coordinates: [26.1147, 50.5035] },
  { id: 6, name: "Block 713 - Sitra", district: "Sitra", type: "Industrial", coordinates: [26.1502, 50.6174] },
  { id: 7, name: "Block 805 - Tubli", district: "Tubli", type: "Commercial", coordinates: [26.2089, 50.6090] },
  { id: 8, name: "Block 901 - Budaiya", district: "Budaiya", type: "Agricultural", coordinates: [26.1469, 50.4822] },
  { id: 9, name: "Block 1105 - Jidhafs", district: "Jidhafs", type: "Residential", coordinates: [26.2098, 50.4789] },
  { id: 10, name: "Block 1250 - Sanad", district: "Sanad", type: "Mixed Use", coordinates: [26.1031, 50.5925] },
];

// Field mappings for each layer type
const layerFieldMappings: Record<string, string[]> = {
  governorate: ["Name", "Code", "Population", "Area"],
  district: ["Name", "Code", "Governorate", "Type"],
  block: ["Name", "District", "Type", "Status"]
};

// Mock search data for governorates, districts, and blocks
const governorateData = [
  { name: "Capital Governorate", code: "CAP", population: "620,000", area: "30 km²", coordinates: [26.2285, 50.5860] },
  { name: "Muharraq Governorate", code: "MUH", population: "210,000", area: "56 km²", coordinates: [26.2572, 50.6110] },
  { name: "Northern Governorate", code: "NOR", population: "350,000", area: "142 km²", coordinates: [26.1469, 50.4822] },
  { name: "Southern Governorate", code: "SOU", population: "180,000", area: "520 km²", coordinates: [26.0560, 50.5577] },
];

const districtData = [
  { name: "Manama", code: "MAN", governorate: "Capital Governorate", type: "Urban", coordinates: [26.2285, 50.5860] },
  { name: "Muharraq", code: "MUH", governorate: "Muharraq Governorate", type: "Urban", coordinates: [26.2572, 50.6110] },
  { name: "Riffa", code: "RIF", governorate: "Southern Governorate", type: "Urban", coordinates: [26.1300, 50.5550] },
  { name: "Budaiya", code: "BUD", governorate: "Northern Governorate", type: "Suburban", coordinates: [26.1469, 50.4822] },
  { name: "Isa Town", code: "ISA", governorate: "Central Governorate", type: "Residential", coordinates: [26.1736, 50.5478] },
  { name: "Hamad Town", code: "HAM", governorate: "Central Governorate", type: "Residential", coordinates: [26.1147, 50.5035] },
];

export default function SpatialGovernance() {
  const [selectedEntity, setSelectedEntity] = useState<string | null>(null);
  const [expandedEntity, setExpandedEntity] = useState<string | null>(null);
  const [selectDataOpen, setSelectDataOpen] = useState(false);
  const [selectedShape, setSelectedShape] = useState<string>("rectangle");
  const [activeTab, setActiveTab] = useState<"identify" | "layers" | "results">("identify");
  const [layersOpen, setLayersOpen] = useState(false);
  const [expandedLayer, setExpandedLayer] = useState<string | null>("WaterDistributionDataset");
  const [layerSearch, setLayerSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("Super Admin");
  const [layerVisibility, setLayerVisibility] = useState<Record<string, boolean>>({
    "Addresses": false,
    "ADDRESSES": false,
    "Streetcenterlines": false,
    "wip_ministrialroads": false,
    "Mtt_network": false,
    "Tse_network": false,
    "District_cooling": false,
    "Ewc_wdd": false,
    "WaterDistributionDataset": false,
    "SystemValve": false,
    "AirValve": false,
    "ServiceValve": false,
    "Fitting": false,
    "Hydrant": false,
    "WServicePoint": false,
    "Meter": false,
    "CasingProtection": false,
    "ServicePipe": false,
    "MainPipe": false,
  });
  
  // New state for map interactions
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [polygonPoints, setPolygonPoints] = useState<Array<{x: number, y: number}>>([]);
  const [drawnPolygons, setDrawnPolygons] = useState<Array<Array<{x: number, y: number}>>>([]);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{x: number, y: number} | null>(null);

  // Table state
  const [tableSearch, setTableSearch] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<typeof entities>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Permission management state
  const [selectedPermissionGroup, setSelectedPermissionGroup] = useState<number | null>(null);
  const [addUsersOpen, setAddUsersOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [removeUserOpen, setRemoveUserOpen] = useState(false);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<typeof permissionUsers[0] | null>(null);
  const [selectedUserForRemove, setSelectedUserForRemove] = useState<typeof permissionUsers[0] | null>(null);
  const [selectedOrgForAdd, setSelectedOrgForAdd] = useState("");
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState<number[]>([]);
  const [permissionUserSearch, setPermissionUserSearch] = useState("");
  
  // Map mode state (Spatial vs Data)
  const [mapMode, setMapMode] = useState<"spatial" | "data">("spatial");
  
  // Blocks mode state
  const [blockSearch, setBlockSearch] = useState("");
  const [blockSuggestions, setBlockSuggestions] = useState<typeof blocksData>([]);
  const [showBlockSuggestions, setShowBlockSuggestions] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<typeof blocksData[0] | null>(null);
  const blockSearchRef = useRef<HTMLDivElement>(null);
  
  // Auto renewal state
  const [autoRenewal, setAutoRenewal] = useState(false);
  
  const [orgFilterPermission, setOrgFilterPermission] = useState("all");
  const [roleFilterPermission, setRoleFilterPermission] = useState("all");
  const [editAccessLevel, setEditAccessLevel] = useState("View");
  const [editUserActive, setEditUserActive] = useState(true);

  // Edit Boundary Modal State
  const [editBoundaryOpen, setEditBoundaryOpen] = useState(false);
  const [selectedBoundary, setSelectedBoundary] = useState<typeof entities[0] | null>(null);
  const [editBoundaryName, setEditBoundaryName] = useState("");
  const [editBoundaryType, setEditBoundaryType] = useState("");
  const [editBoundaryOrg, setEditBoundaryOrg] = useState("");
  const [assignedUsers, setAssignedUsers] = useState<typeof allUsers>([]);
  const [searchAddUser, setSearchAddUser] = useState("");
  const [orgFilterAddUser, setOrgFilterAddUser] = useState("all");
  const [selectedUsersForBoundary, setSelectedUsersForBoundary] = useState<number[]>([]);

  // View Boundary Modal State
  const [viewBoundaryOpen, setViewBoundaryOpen] = useState(false);
  const [viewedBoundary, setViewedBoundary] = useState<typeof entities[0] | null>(null);

  // Access Roles state - for editing on the map
  const [editingRoleId, setEditingRoleId] = useState<number | null>(null);
  const [isMapEditMode, setIsMapEditMode] = useState(false);
  
  // Entity toggle state - tracks whether each entity is enabled/disabled
  const [entityToggles, setEntityToggles] = useState<Record<number, boolean>>(
    entities.reduce((acc, entity) => ({ ...acc, [entity.id]: entity.status === "Active" }), {})
  );
  
  // Access Type filter state
  const [accessTypeFilter, setAccessTypeFilter] = useState<"Application" | "Data" | "Spatial">("Application");
  
  // Map theme state
  const [mapTheme, setMapTheme] = useState<"light" | "dark">("light");
  
  // Basemap selection state
  const [selectedBasemap, setSelectedBasemap] = useState<string>("osm");
  
  // Map instance state
  const [mapInstance, setMapInstance] = useState<Map | null>(null);
  
  // Boundary editing tools state
  const [activeTool, setActiveTool] = useState<"polygon" | "edit" | "merge" | "cut" | "vertex" | null>(null);
  const [boundaryHistory, setBoundaryHistory] = useState<any[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [currentBoundary, setCurrentBoundary] = useState<any>(null);
  const [boundaryArea, setBoundaryArea] = useState<number>(0);
  const [originalBoundary, setOriginalBoundary] = useState<any>(null);

  // Confirmation Dialog States
  const [assignConfirmOpen, setAssignConfirmOpen] = useState(false);
  const [updateBoundaryConfirmOpen, setUpdateBoundaryConfirmOpen] = useState(false);
  const [saveBoundaryConfirmOpen, setSaveBoundaryConfirmOpen] = useState(false);
  const [resetBoundaryConfirmOpen, setResetBoundaryConfirmOpen] = useState(false);

  // Advanced search filter states
  const [filterLayer, setFilterLayer] = useState<"governorate" | "district" | "block" | "">(""); 
  const [filterField, setFilterField] = useState("");
  const [filterOperator, setFilterOperator] = useState("=");
  const [filterValue, setFilterValue] = useState("");
  const [fieldOptions, setFieldOptions] = useState<string[]>([]);

  // Handle search suggestions
  useEffect(() => {
    if (tableSearch.trim()) {
      const suggestions = entities.filter(entity =>
        entity.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
        entity.type.toLowerCase().includes(tableSearch.toLowerCase())
      ).slice(0, 5);
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [tableSearch]);

  // Sorting functions
  const handleSort = (column: string) => {
    if (sortField === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: string) => {
    if (sortField !== column) return null;
    return sortDirection === "asc" ? <ChevronUp className="w-4 h-4 inline ml-1" /> : <ChevronDown className="w-4 h-4 inline ml-1" />;
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (blockSearchRef.current && !blockSearchRef.current.contains(event.target as Node)) {
        setShowBlockSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle ESC key to cancel drawing
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDrawingMode) {
        setIsDrawingMode(false);
        setPolygonPoints([]);
        toast.info("Drawing cancelled");
      }
    };
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isDrawingMode]);

  // Update field options when layer changes
  useEffect(() => {
    if (filterLayer) {
      setFieldOptions(layerFieldMappings[filterLayer] || []);
      setFilterField(""); // Reset field selection
    } else {
      setFieldOptions([]);
    }
  }, [filterLayer]);







  // Handle drawing mode
  useEffect(() => {
    if (isDrawingMode) {
      toast.info("Drawing mode activated - Click on map to draw boundaries");
    }
  }, [isDrawingMode]);

  // Handle boundary editing mode
  useEffect(() => {
    if (isMapEditMode && editingRoleId !== null) {
      toast.info("Boundary editing mode activated");
    }
  }, [isMapEditMode, editingRoleId]);

  // Function to scroll to selected entity
  const handleSelectSuggestion = (entity: typeof entities[0]) => {
    setTableSearch(entity.name);
    setShowSuggestions(false);
    
    // Reset filters to ensure item is visible
    setStatusFilter("all");
    setTypeFilter("all");
    
    setTimeout(() => {
      const row = document.getElementById(`entity-row-${entity.id}`);
      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        row.classList.add('ring-2', 'ring-[#EF4444]', 'ring-offset-2');
        setTimeout(() => {
          row.classList.remove('ring-2', 'ring-[#EF4444]', 'ring-offset-2');
        }, 2000);
      }
    }, 100);
  };

  // Filter entities based on search and filters
  const filteredEntities = entities.filter(entity => {
    const matchesSearch = entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entity.type.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || entity.status === statusFilter;
    const matchesType = typeFilter === "all" || entity.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });
  
  // Filter access permissions based on search
  const filteredPermissions = accessRoles.filter(permission => {
    const matchesSearch = permission.permissionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         permission.assignedArea.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Handle zoom
  const handleZoomIn = () => {
    if (mapInstance) {
      const view = mapInstance.getView();
      const currentZoom = view.getZoom();
      if (currentZoom !== undefined) {
        view.animate({ zoom: currentZoom + 1, duration: 250 });
      }
    }
  };

  const handleZoomOut = () => {
    if (mapInstance) {
      const view = mapInstance.getView();
      const currentZoom = view.getZoom();
      if (currentZoom !== undefined) {
        view.animate({ zoom: currentZoom - 1, duration: 250 });
      }
    }
  };

  // Handle block search
  const handleBlockSearch = (value: string) => {
    setBlockSearch(value);
    if (value.trim()) {
      const filtered = blocksData.filter(block => 
        block.name.toLowerCase().includes(value.toLowerCase()) ||
        block.district.toLowerCase().includes(value.toLowerCase()) ||
        block.type.toLowerCase().includes(value.toLowerCase())
      );
      setBlockSuggestions(filtered);
      setShowBlockSuggestions(true);
    } else {
      setBlockSuggestions([]);
      setShowBlockSuggestions(false);
    }
  };

  const handleSelectBlock = (block: typeof blocksData[0]) => {
    setSelectedBlock(block);
    setBlockSearch(block.name);
    setShowBlockSuggestions(false);
    
    toast.success("Block Selected", {
      description: `${block.name} has been selected.`,
      duration: 3000,
    });
  };

  const handleAssignBlockClick = () => setAssignConfirmOpen(true);
  const handleAssignBlock = () => {
    if (selectedBlock && editingRoleId) {
      toast.success("Block Assigned", {
        description: `${selectedBlock.name} has been assigned to the selected role.`,
        duration: 3000,
      });
      setSelectedBlock(null);
      setBlockSearch("");
      setEditingRoleId(null);
      setIsMapEditMode(false);
      setAssignConfirmOpen(false);
    }
  };

  const handleClearBlockSelection = () => {
    setSelectedBlock(null);
    setBlockSearch("");
    toast.info("Selection Cleared", {
      description: "Block selection has been cleared.",
      duration: 2000,
    });
  };

  // Handle advanced search filter
  const handleAdvancedSearch = () => {
    if (!filterLayer || !filterField || !filterValue) {
      toast.error("Missing Search Criteria", {
        description: "Please select layer, field, and enter a value to search.",
        duration: 3000,
      });
      return;
    }

    let searchData: any[] = [];

    // Get the appropriate dataset based on layer
    if (filterLayer === "governorate") {
      searchData = governorateData;
    } else if (filterLayer === "district") {
      searchData = districtData;
    } else if (filterLayer === "block") {
      searchData = blocksData;
    }

    // Perform search based on operator
    const searchValue = filterValue.toLowerCase();
    const result = searchData.find((item: any) => {
      const fieldValue = String(item[filterField.toLowerCase()] || "").toLowerCase();
      
      if (filterOperator === "=") {
        return fieldValue === searchValue;
      } else if (filterOperator === "Like") {
        return fieldValue.includes(searchValue);
      } else if (filterOperator === "Contains") {
        return fieldValue.includes(searchValue);
      }
      return false;
    });

    if (result) {
      toast.success("Location Found", {
        description: `${result.name || result.Name} has been found.`,
        duration: 3000,
      });
    } else {
      toast.error("No Matching Location Found", {
        description: "No results found for the specified criteria.",
        duration: 3000,
      });
    }
  };

  // Handle polygon drawing
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!isDrawingMode) return;
    
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 1200;
    const y = ((e.clientY - rect.top) / rect.height) * 600;
    
    setPolygonPoints(prev => [...prev, { x, y }]);
  };

  // Handle double-click to complete polygon
  const handleMapDoubleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDrawingMode && polygonPoints.length >= 3) {
      completePolygon();
    }
  };

  // Handle view boundary
  const handleViewBoundary = (entity: typeof entities[0]) => {
    setViewedBoundary(entity);
    // Mock some assigned users based on the entity
    const mockAssigned = allUsers.filter((_, idx) => idx < 3);
    setAssignedUsers(mockAssigned);
    setViewBoundaryOpen(true);
  };

  // Handle edit boundary
  const handleEditBoundary = (entity: typeof entities[0]) => {
    setSelectedBoundary(entity);
    setEditBoundaryName(entity.name);
    setEditBoundaryType(entity.type);
    setEditBoundaryOrg(entity.name);
    // Mock some assigned users based on the entity
    const mockAssigned = allUsers.filter((_, idx) => idx < 2);
    setAssignedUsers(mockAssigned);
    setEditBoundaryOpen(true);
    // Enable map edit mode
    setIsMapEditMode(true);
    setEditingRoleId(entity.id);
    toast.info("Map editing mode enabled");
  };

  // Handle remove user from boundary
  const handleRemoveUserFromBoundary = (userId: number) => {
    setAssignedUsers(prev => prev.filter(u => u.id !== userId));
  };

  // Handle add users to boundary
  const handleAddUsersToBoundary = () => {
    const usersToAdd = allUsers.filter(u => selectedUsersForBoundary.includes(u.id));
    setAssignedUsers(prev => [...prev, ...usersToAdd.filter(u => !prev.find(p => p.id === u.id))]);
    setSelectedUsersForBoundary([]);
    setSearchAddUser("");
  };

  // Handle save boundary changes
  const handleSaveBoundaryChangesClick = () => setSaveBoundaryConfirmOpen(true);
  const handleSaveBoundaryChanges = () => {
    toast.success("✔ Boundary updated successfully");
    setEditBoundaryOpen(false);
    setSaveBoundaryConfirmOpen(false);
  };

  // Complete polygon drawing
  const completePolygon = () => {
    if (polygonPoints.length >= 3) {
      setDrawnPolygons(prev => [...prev, polygonPoints]);
      setPolygonPoints([]);
      setIsDrawingMode(false);
    }
  };

  // Toggle drawing mode
  const toggleDrawingMode = () => {
    const newDrawingMode = !isDrawingMode;
    setIsDrawingMode(newDrawingMode);
    setPolygonPoints([]);
    
    if (newDrawingMode) {
      toast.info("Drawing mode activated. Click on the map to draw boundaries.");
    }
  };

  const toggleLayerVisibility = (layerName: string) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  const toggleAllLayers = (checked: boolean) => {
    const newVisibility: Record<string, boolean> = {};
    mapLayers.forEach(layer => {
      newVisibility[layer.name] = checked;
      if (layer.subLayers) {
        layer.subLayers.forEach(sub => {
          newVisibility[sub] = checked;
        });
      }
    });
    setLayerVisibility(newVisibility);
  };

  // Handle edit access role - enables map editing mode
  const handleEditAccessRole = (roleId: number) => {
    setEditingRoleId(roleId);
    setIsMapEditMode(true);
    setIsDrawingMode(true);
    toast.info("Map editing mode activated. Edit the spatial boundary for this role.");
  };

  // Handle update access role boundary
  const handleUpdateRoleBoundary = () => {
    setEditingRoleId(null);
    setIsMapEditMode(false);
    setIsDrawingMode(false);
    toast.success("✔ Spatial boundary updated successfully");
  };

  const toggleLayerExpansion = (layerName: string) => {
    setExpandedLayer(expandedLayer === layerName ? null : layerName);
  };

  // Boundary Editing Tools Functions
  const handleSelectTool = (tool: "polygon" | "edit" | "merge" | "cut" | "vertex" | null) => {
    setActiveTool(tool);
    
    if (tool === "polygon") {
      toast.info("Draw Polygon Tool: Click on the map to draw a new boundary");
      enableDrawPolygon();
    } else if (tool === "edit") {
      toast.info("Edit Tool: Drag vertices to adjust the boundary");
      enableEditMode();
    } else if (tool === "vertex") {
      toast.info("Vertex Edit Mode: Add or remove vertices");
      enableVertexEdit();
    } else if (tool === "cut") {
      toast.info("Cut Tool: Draw inside the polygon to remove area");
    } else if (tool === "merge") {
      toast.info("Merge Tool: Draw overlapping shapes to merge with existing boundary");
    }
  };

  const enableDrawPolygon = () => {
    // Map functionality removed - placeholder for future implementation
    toast.info("Draw Polygon Tool: Map integration coming soon");
    setActiveTool(null);
  };

  const enableEditMode = () => {
    if (!currentBoundary) {
      toast.error("No boundary to edit. Please draw a boundary first.");
      setActiveTool(null);
      return;
    }

    // Map functionality removed - placeholder for future implementation
    toast.info("Edit Mode: Map integration coming soon");
  };

  const enableVertexEdit = () => {
    if (!currentBoundary) {
      toast.error("No boundary to edit. Please draw a boundary first.");
      setActiveTool(null);
      return;
    }

    enableEditMode();
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      restoreBoundaryFromHistory(boundaryHistory[newIndex]);
      toast.info("Undo successful");
    } else {
      toast.error("Nothing to undo");
    }
  };

  const handleRedo = () => {
    if (historyIndex < boundaryHistory.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      restoreBoundaryFromHistory(boundaryHistory[newIndex]);
      toast.info("Redo successful");
    } else {
      toast.error("Nothing to redo");
    }
  };

  const handleResetBoundaryClick = () => setResetBoundaryConfirmOpen(true);
  const handleResetBoundary = () => {
    if (originalBoundary) {
      setCurrentBoundary(null);
      setBoundaryArea(0);
      toast.success("Boundary reset to original state");
      setResetBoundaryConfirmOpen(false);
    }
  };

  const handleUpdateBoundaryClick = () => setUpdateBoundaryConfirmOpen(true);
  const handleUpdateBoundary = () => {
    if (!currentBoundary) {
      toast.error("No boundary to save");
      return;
    }

    toast.success("Boundary updated successfully!");
    setActiveTool(null);
    setIsMapEditMode(false);
    setEditingRoleId(null);
    setUpdateBoundaryConfirmOpen(false);
  };

  const handleCancelEdit = () => {
    setActiveTool(null);
    setCurrentBoundary(null);
    setBoundaryArea(0);
    setIsMapEditMode(false);
    setEditingRoleId(null);
    toast.info("Edit cancelled");
  };

  const handleClearBoundary = () => {
    setCurrentBoundary(null);
    setBoundaryArea(0);
    setBoundaryHistory([]);
    setHistoryIndex(-1);
    setActiveTool(null);
    toast.info("Boundary cleared");
  };

  const restoreBoundaryFromHistory = (boundaryData: any) => {
    if (!boundaryData) return;
    
    // Map functionality removed - placeholder for future implementation
    setCurrentBoundary(boundaryData);
  };

  const calculateArea = (polygon: any) => {
    // Map functionality removed - placeholder for future implementation
    setBoundaryArea(0);
  };

  const addToHistory = (boundaryData: any) => {
    const newHistory = boundaryHistory.slice(0, historyIndex + 1);
    newHistory.push(boundaryData);
    setBoundaryHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Map initialization removed - placeholder for future implementation

  const resetLayers = () => {
    setLayerVisibility({
      "Addresses": false,
      "ADDRESSES": false,
      "Streetcenterlines": false,
      "wip_ministrialroads": false,
      "Mtt_network": false,
      "Tse_network": false,
      "District_cooling": false,
      "Ewc_wdd": false,
      "WaterDistributionDataset": false,
      "SystemValve": false,
      "AirValve": false,
      "ServiceValve": false,
      "Fitting": false,
      "Hydrant": false,
      "WServicePoint": false,
      "Meter": false,
      "CasingProtection": false,
      "ServicePipe": false,
      "MainPipe": false,
    });
  };

  const toggleEntity = (entityName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedEntity(expandedEntity === entityName ? null : entityName);
  };

  // Handle export functionality
  const handleExportPDF = (format: string) => {
    toast.success(`✔ Exporting ${format}...`);
    // Mock PDF export logic
    setTimeout(() => {
      toast.success(`✔ ${format} exported successfully!`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-[#e8ecf1] to-[#dfe4ea] px-10 py-6">
      <div className="max-w-[1800px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-[26px] font-bold text-[#EF4444]">Spatial Governance</h1>
            <p className="text-[#4A5565] text-[14px] font-normal">Manage spatial boundaries and governance frameworks</p>
          </div>
        </div>

        {/* KPI Cards with Neumorphism */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          {/* Total Roles */}
          <Card className="relative h-[106px] bg-white/90 backdrop-blur-xl border-0 rounded-[24px] shadow-[8px_8px_24px_rgba(163,177,198,0.3),-8px_-8px_24px_rgba(255,255,255,0.8)] hover:shadow-[12px_12px_32px_rgba(163,177,198,0.4),-12px_-12px_32px_rgba(255,255,255,1)] transition-all duration-300 hover:translate-y-[-4px] overflow-hidden">
            <div className="absolute right-[24px] top-[37px] w-[30px] h-[30px] flex items-center justify-center">
              <Anchor className="w-[30px] h-[30px] text-[#EF4444]" style={{ strokeWidth: 2 }} />
            </div>
            <div className="absolute left-[23.88px] top-[18px] flex flex-col gap-0.5">
              <div className="text-[26px] leading-tight font-bold text-[#EF4444]">
                12
              </div>
              <div className="text-[14px] font-normal text-[#4A5565]">
                Total Roles
              </div>
            </div>
          </Card>

          {/* Active Boundaries */}
          <Card className="relative h-[106px] bg-white/90 backdrop-blur-xl border-0 rounded-[24px] shadow-[8px_8px_24px_rgba(163,177,198,0.3),-8px_-8px_24px_rgba(255,255,255,0.8)] hover:shadow-[12px_12px_32px_rgba(163,177,198,0.4),-12px_-12px_32px_rgba(255,255,255,1)] transition-all duration-300 hover:translate-y-[-4px] overflow-hidden">
            <div className="absolute right-[24px] top-[37px] w-[30px] h-[30px] flex items-center justify-center">
              <MapPin className="w-[30px] h-[30px] text-[#003F72]" style={{ strokeWidth: 2 }} />
            </div>
            <div className="absolute left-[23.88px] top-[18px] flex flex-col gap-0.5">
              <div className="text-[26px] leading-tight font-bold text-[#EF4444]">
                48
              </div>
              <div className="text-[14px] font-normal text-[#4A5565]">
                Active Boundaries
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid - Table Left (40%) / Map Right (60%) */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Section - Spatial Boundaries Registry Table (40%) */}
          <div className="lg:col-span-2">
            <Card className="bg-white/90 backdrop-blur-xl border-0 rounded-3xl shadow-[8px_8px_24px_rgba(163,177,198,0.3),-8px_-8px_24px_rgba(255,255,255,0.8)] overflow-hidden h-[700px] flex flex-col">
              {/* Table Header */}
              <div className="px-6 pt-5 pb-5 border-b border-[#E5E5E5] flex-shrink-0">
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EF4444]/10 to-[#FF6B6B]/10 flex items-center justify-center">
                      <Grid className="w-6 h-6 text-[#EF4444]" />
                    </div>
                    <div>
                      <h3 className="text-[26px] font-bold text-[#EF4444]">Access Area</h3>
                    </div>
                  </div>
                  
                <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full mt-4">
                  {/* Search Bar */}
                  <div className="relative w-full lg:flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999999]" />
                    <Input
                      type="text"
                      placeholder="Search boundaries..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-10 h-10 w-full border border-[#E0E0E0] rounded-xl bg-[#F5F5F5] focus:bg-white focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444] transition-all text-sm"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#EF4444] transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Filter Dropdowns */}
                  <div className="grid grid-cols-2 md:flex items-center gap-3 w-full lg:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-full md:w-40 h-10 bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl text-sm">
                        <SelectValue placeholder="All Statuses" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Under Review">Under Review</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={typeFilter} onValueChange={setTypeFilter}>
                      <SelectTrigger className="w-full md:w-40 h-10 bg-[#F5F5F5] border border-[#E0E0E0] rounded-xl text-sm">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="Application">Application</SelectItem>
                        <SelectItem value="Data">Data</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Data Table - Scrollable with Fixed Actions Column */}
              <div className="flex-1 overflow-x-auto relative">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="border-b-2 border-[#E5E5E5] bg-gradient-to-r from-gray-50 to-white">
                      <th className="text-left py-3 px-4 text-xs font-bold text-[#EF4444] uppercase tracking-wider min-w-[180px] cursor-pointer hover:bg-red-50/30 transition-colors" onClick={() => handleSort("name")}>Name {getSortIcon("name")}</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-[#EF4444] uppercase tracking-wider min-w-[140px] cursor-pointer hover:bg-red-50/30 transition-colors" onClick={() => handleSort("type")}>Permission Type {getSortIcon("type")}</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-[#EF4444] uppercase tracking-wider min-w-[140px]">Created By</th>
                      <th className="text-left py-3 px-4 text-xs font-bold text-[#EF4444] uppercase tracking-wider min-w-[120px] cursor-pointer hover:bg-red-50/30 transition-colors" onClick={() => handleSort("lastModified")}>Updated {getSortIcon("lastModified")}</th>
                      <th className="text-center py-3 px-4 text-xs font-bold text-[#EF4444] uppercase tracking-wider min-w-[100px] cursor-pointer hover:bg-red-50/30 transition-colors" onClick={() => handleSort("status")}>Status {getSortIcon("status")}</th>
                      <th className="text-center py-3 text-xs font-bold text-[#EF4444] uppercase tracking-wider sticky right-0 bg-gradient-to-r from-gray-50 to-white min-w-[120px] w-[120px] shadow-[-4px_0_8px_rgba(0,0,0,0.1)] z-20">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {entities.filter(entity => {
                      const matchesSearch = entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                           entity.type.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesStatus = statusFilter === "all" || entity.status === statusFilter;
                      const matchesType = typeFilter === "all" || entity.type === typeFilter;
                      return matchesSearch && matchesStatus && matchesType;
                    }).sort((a, b) => {
                      if (!sortField) return 0;
                      const aVal = a[sortField as keyof typeof a];
                      const bVal = b[sortField as keyof typeof b];
                      if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
                      if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
                      return 0;
                    }).map((entity, index) => (
                      <tr 
                        id={`entity-row-${entity.id}`}
                        key={entity.id}
                        className={`border-b border-[#E5E5E5]/50 transition-all group ${
                          index % 2 === 0 
                            ? 'bg-white hover:bg-gray-50/50' 
                            : 'bg-gray-50/20 hover:bg-gray-50/50'
                        }`}
                      >
                        <td className="py-4 px-4">
                          <div className="text-sm text-[#1a1a1a]">{entity.name}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-[#666666]">{entity.type}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-[#666666]">System Admin</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-[#666666]">{entity.lastModified}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center">
                            <Switch
                              checked={entityToggles[entity.id]}
                              onCheckedChange={(checked) => {
                                setEntityToggles(prev => ({ ...prev, [entity.id]: checked }));
                                toast.success(`${entity.name} ${checked ? 'enabled' : 'disabled'}`);
                              }}
                              className="data-[state=checked]:bg-[#EF4444]"
                            />
                          </div>
                        </td>
                        <td className={`py-4 sticky right-0 shadow-[-4px_0_8px_rgba(0,0,0,0.1)] z-10 w-[120px] ${
                          index % 2 === 0 
                            ? 'bg-white group-hover:bg-gray-50/50' 
                            : 'bg-[#F9FAFB] group-hover:bg-gray-50/50'
                        }`}>
                          <div className="flex items-center justify-center gap-1">
                            <Button 
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                              onClick={() => handleViewBoundary(entity)}
                            >
                              <Eye className="w-4 h-4 text-[#666666]" />
                            </Button>
                            <Button 
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                              onClick={() => handleEditBoundary(entity)}
                            >
                              <Edit className="w-4 h-4 text-[#666666]" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 border-t border-[#E5E5E5] bg-gray-50/30 flex-shrink-0">
                {/* Desktop Pagination */}
                <div className="hidden md:flex items-center justify-between text-xs">
                  <div className="text-[#666666]">
                    Showing {entities.filter(entity => {
                      const matchesSearch = entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                           entity.type.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesStatus = statusFilter === "all" || entity.status === statusFilter;
                      const matchesType = typeFilter === "all" || entity.type === typeFilter;
                      return matchesSearch && matchesStatus && matchesType;
                    }).length} of {entities.length} roles
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 rounded-lg border-[#E0E0E0] text-xs"
                      disabled
                    >
                      <ChevronLeft className="w-3 h-3" />
                    </Button>
                    <div className="text-[#666666] px-2">
                      Page 1 of 1
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2 rounded-lg border-[#E0E0E0] text-xs"
                      disabled
                    >
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Mobile Pagination */}
                <div className="flex flex-col items-center justify-center gap-4 md:hidden">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 rounded-xl border-[#E5E7EB] text-[#6B7280] font-medium"
                      disabled
                    >
                      Previous
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="h-9 w-9 p-0 rounded-xl bg-[#EF4444] text-white font-bold"
                    >
                      1
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-4 rounded-xl border-[#E5E7EB] text-[#6B7280] font-medium"
                      disabled
                    >
                      Next
                    </Button>
                  </div>
                  <div className="text-sm font-medium text-[#6B7280]">
                    Showing <span className="font-bold text-[#111827]">{entities.filter(entity => {
                      const matchesSearch = entity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                           entity.type.toLowerCase().includes(searchQuery.toLowerCase());
                      const matchesStatus = statusFilter === "all" || entity.status === statusFilter;
                      const matchesType = typeFilter === "all" || entity.type === typeFilter;
                      return matchesSearch && matchesStatus && matchesType;
                    }).length}</span> results
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Section - Map View (60%) */}
          <div className="lg:col-span-3">
            <Card className="bg-white/90 backdrop-blur-xl border-0 rounded-3xl shadow-[8px_8px_24px_rgba(163,177,198,0.3),-8px_-8px_24px_rgba(255,255,255,0.8)] p-5 h-[700px]">
                <Card className="p-0 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg overflow-hidden relative h-full">
                  {/* Map View */}
                  <div className="relative w-full h-full">
                    {/* Basemap Selector - Top Left - Only visible in Spatial mode */}
                    {mapMode === "spatial" && (
                      <div className="absolute top-4 left-4 z-[900]">
                        <Select value={selectedBasemap} onValueChange={setSelectedBasemap}>
                          <SelectTrigger className="w-52 bg-white/95 backdrop-blur-md border-[#E5E5E5] rounded-xl shadow-lg h-[42px]">
                            <SelectValue placeholder="Select basemap" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl bg-white border border-[#E5E5E5]">
                            <SelectItem value="osm">OpenStreetMap</SelectItem>
                            <SelectItem value="terrain">Terrain</SelectItem>
                            <SelectItem value="satellite">Satellite</SelectItem>
                            <SelectItem value="dark">Dark Mode</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Spatial/Data Radio Buttons - Top Right */}
                    <div className="absolute top-4 right-4 z-[1100]">
                      <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-[#E5E5E5] p-1 h-[42px]">
                        <button
                          onClick={() => setMapMode("spatial")}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all h-[34px] flex items-center ${
                            mapMode === "spatial"
                              ? "bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white shadow-md"
                              : "text-[#666666] hover:bg-gray-100"
                          }`}
                        >
                          Spatial
                        </button>
                        <button
                          onClick={() => setMapMode("data")}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all h-[34px] flex items-center ${
                            mapMode === "data"
                              ? "bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white shadow-md"
                              : "text-[#666666] hover:bg-gray-100"
                          }`}
                        >Data</button>
                      </div>
                    </div>

                    {/* Advanced Search Filter Panel - Only visible in Data mode, positioned below tabs */}
                    {mapMode === "data" && (
                      <div className="absolute top-16 right-4 z-[1000] flex items-center gap-1.5 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-[#E5E5E5] p-2 max-w-[calc(100%-2rem)]">
                        {/* Layer Dropdown */}
                        <div className="flex flex-col gap-1">
                          <Label className="text-[10px] text-[#666666] font-medium px-1">Layer</Label>
                          <Select value={filterLayer} onValueChange={(value: any) => setFilterLayer(value)}>
                            <SelectTrigger className="w-24 h-8 text-xs bg-white border-[#E5E5E5] rounded-lg">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg">
                              <SelectItem value="governorate">Governorate</SelectItem>
                              <SelectItem value="district">District</SelectItem>
                              <SelectItem value="block">Block</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Field Dropdown */}
                        <div className="flex flex-col gap-1">
                          <Label className="text-[10px] text-[#666666] font-medium px-1">Field</Label>
                          <Select value={filterField} onValueChange={setFilterField} disabled={!filterLayer}>
                            <SelectTrigger className="w-24 h-8 text-xs bg-white border-[#E5E5E5] rounded-lg">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg">
                              {fieldOptions.map((field) => (
                                <SelectItem key={field} value={field}>{field}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Operator Dropdown */}
                        <div className="flex flex-col gap-1">
                          <Label className="text-[10px] text-[#666666] font-medium px-1">Operator</Label>
                          <Select value={filterOperator} onValueChange={setFilterOperator}>
                            <SelectTrigger className="w-20 h-8 text-xs bg-white border-[#E5E5E5] rounded-lg">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg">
                              <SelectItem value="=">=</SelectItem>
                              <SelectItem value="Like">Like</SelectItem>
                              <SelectItem value="Contains">Contains</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Value Input */}
                        <div className="flex flex-col gap-1">
                          <Label className="text-[10px] text-[#666666] font-medium px-1">Value</Label>
                          <Input
                            type="text"
                            placeholder="Enter value"
                            value={filterValue}
                            onChange={(e) => setFilterValue(e.target.value)}
                            className="w-28 h-8 text-xs bg-white border-[#E5E5E5] rounded-lg px-2"
                          />
                        </div>

                        {/* Search Button */}
                        <div className="flex flex-col gap-1">
                          <Label className="text-[10px] text-transparent font-medium px-1">.</Label>
                          <Button
                            size="sm"
                            onClick={handleAdvancedSearch}
                            className="h-8 px-3 text-xs bg-gradient-to-r from-[#003F72] to-[#004A8A] hover:from-[#002d4d] hover:to-[#003d71] text-white rounded-lg shadow-md"
                          >
                            <Search className="w-3 h-3 mr-1" />
                            Search
                          </Button>
                        </div>
                      </div>
                    )}



                    {/* Block Action Buttons - Only visible when block is selected */}
                    {mapMode === "data" && selectedBlock && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] flex items-center gap-3">
                        <Button
                          onClick={handleAssignBlockClick}
                          className="bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#991B1B] text-white rounded-lg px-6 py-2 text-sm font-medium shadow-lg transition-all"
                        >
                          Assign Block
                        </Button>
                        <Button
                          onClick={handleClearBlockSelection}
                          variant="outline"
                          className="bg-white hover:bg-gray-50 text-[#666666] border-[#E0E0E0] rounded-lg px-6 py-2 text-sm font-medium shadow-lg transition-all"
                        >
                          Clear Selection
                        </Button>
                      </div>
                    )}

                    {/* OpenStreetMap */}
                    <div className="w-full h-full">
                      <OpenStreetMap
                        center={[50.5860, 26.2285]} // Bahrain center
                        zoom={11}
                        height="100%"
                        basemap={selectedBasemap}
                        onMapReady={(map) => setMapInstance(map)}
                        enableDrawing={isDrawingMode || activeTool === 'polygon'}
                        drawingType="Polygon"
                        onDrawEnd={(geometry) => {
                          toast.success("Boundary drawn successfully");
                          setIsDrawingMode(false);
                          setActiveTool(null);
                        }}
                      />
                    </div>
                    
                    {/* Drawing mode indicator overlay - Only for Spatial mode */}
                    {mapMode === "spatial" && isDrawingMode && (
                      <div className="absolute top-20 left-4 bg-[#EF4444] text-white rounded-xl px-6 py-3 shadow-lg z-[1000]">
                        <div className="font-bold text-sm">DRAWING MODE ACTIVE</div>
                        <div className="text-xs opacity-90 mt-1">Click on the map to draw boundaries</div>
                        <div className="text-xs opacity-80">Double-click or press ESC to complete</div>
                      </div>
                    )}

                    {/* Edit mode indicator overlay - Only for Spatial mode */}
                    {mapMode === "spatial" && isMapEditMode && editingRoleId !== null && (
                      <div className="absolute top-20 left-4 bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white rounded-xl px-6 py-3 shadow-lg z-[1000]">
                        <div className="font-bold text-sm">Boundary Editing Mode</div>
                        <div className="text-xs opacity-90 mt-1">Editing role boundary</div>
                        <div className="text-xs opacity-80">Use the tools to modify the boundary</div>
                      </div>
                    )}
                    
                    {/* Map Controls */}
                    <div className="absolute top-[136px] right-4 flex flex-col gap-2 z-[1000]">
                      <Button 
                        size="sm" 
                        onClick={handleZoomIn}
                        className="bg-white/90 hover:bg-white text-[#252628] rounded-lg shadow-lg w-10 h-10 p-0"
                      >
                        <ZoomIn className="w-5 h-5" />
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={handleZoomOut}
                        className="bg-white/90 hover:bg-white text-[#252628] rounded-lg shadow-lg w-10 h-10 p-0"
                      >
                        <ZoomOut className="w-5 h-5" />
                      </Button>
                      {mapMode === "spatial" && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => setLayersOpen(!layersOpen)}
                            className="bg-white/90 hover:bg-white text-[#252628] rounded-lg shadow-lg w-10 h-10 p-0"
                          >
                            <Layers className="w-5 h-5" />
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={toggleDrawingMode}
                            disabled={isMapEditMode}
                            className="bg-white/90 hover:bg-white text-[#252628] rounded-lg shadow-lg w-10 h-10 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Pentagon className="w-5 h-5" />
                          </Button>
                        </>
                      )}
                    </div>


                    
                    {/* Data Mode Indicator - Only visible for Data mode */}
                    {mapMode === "data" && !isMapEditMode && (
                      null
                    )}
                    
                    {/* Spatial Mode Indicator - Only visible for Spatial mode when not drawing or editing */}
                    {mapMode === "spatial" && !isDrawingMode && !isMapEditMode && (
                      null
                    )}

                    {/* Map Editing Toolbar - Only visible for Spatial mode and edit mode, positioned below existing controls */}
                    {mapMode === "spatial" && isMapEditMode && (
                      <div className="absolute top-32 left-4 z-[1000] bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-[#E5E5E5] p-3 w-52">
                        <div className="text-xs font-semibold text-[#666666] mb-3 px-1">Boundary Editing Tools</div>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSelectTool("polygon")}
                            className={`justify-start gap-2 h-9 ${
                              activeTool === "polygon"
                                ? "bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white"
                                : "bg-white hover:bg-gray-50 text-[#252628] border border-[#E5E5E5]"
                            }`}
                          >
                            <Pentagon className="w-4 h-4" />
                            <span className="text-xs">Draw Polygon</span>
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => handleSelectTool("edit")}
                            className={`justify-start gap-2 h-9 ${
                              activeTool === "edit"
                                ? "bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white"
                                : "bg-white hover:bg-gray-50 text-[#252628] border border-[#E5E5E5]"
                            }`}
                          >
                            <Move className="w-4 h-4" />
                            <span className="text-xs">Edit Boundary</span>
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => handleSelectTool("vertex")}
                            className={`justify-start gap-2 h-9 ${
                              activeTool === "vertex"
                                ? "bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white"
                                : "bg-white hover:bg-gray-50 text-[#252628] border border-[#E5E5E5]"
                            }`}
                          >
                            <Edit className="w-4 h-4" />
                            <span className="text-xs">Vertex Edit</span>
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => handleSelectTool("merge")}
                            className={`justify-start gap-2 h-9 ${
                              activeTool === "merge"
                                ? "bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white"
                                : "bg-white hover:bg-gray-50 text-[#252628] border border-[#E5E5E5]"
                            }`}
                          >
                            <Merge className="w-4 h-4" />
                            <span className="text-xs">Merge Boundary</span>
                          </Button>

                          <Button
                            size="sm"
                            onClick={() => handleSelectTool("cut")}
                            className={`justify-start gap-2 h-9 ${
                              activeTool === "cut"
                                ? "bg-gradient-to-r from-[#EF4444] to-[#DC2626] text-white"
                                : "bg-white hover:bg-gray-50 text-[#252628] border border-[#E5E5E5]"
                            }`}
                          >
                            <Scissors className="w-4 h-4" />
                            <span className="text-xs">Cut Area</span>
                          </Button>

                          <div className="border-t border-[#E5E5E5] my-1"></div>

                          <Button
                            size="sm"
                            onClick={handleUndo}
                            disabled={historyIndex <= 0}
                            className="justify-start gap-2 h-9 bg-white hover:bg-gray-50 text-[#252628] border border-[#E5E5E5] disabled:opacity-50"
                          >
                            <Undo2 className="w-4 h-4" />
                            <span className="text-xs">Undo</span>
                          </Button>

                          <Button
                            size="sm"
                            onClick={handleRedo}
                            disabled={historyIndex >= boundaryHistory.length - 1}
                            className="justify-start gap-2 h-9 bg-white hover:bg-gray-50 text-[#252628] border border-[#E5E5E5] disabled:opacity-50"
                          >
                            <Redo2 className="w-4 h-4" />
                            <span className="text-xs">Redo</span>
                          </Button>

                          <Button
                            size="sm"
                            onClick={handleResetBoundaryClick}
                            className="justify-start gap-2 h-9 bg-white hover:bg-gray-50 text-[#252628] border border-[#E5E5E5]"
                          >
                            <RotateCcw className="w-4 h-4" />
                            <span className="text-xs">Reset Boundary</span>
                          </Button>

                          {boundaryArea > 0 && (
                            <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="text-[10px] text-blue-600 font-medium">Area</div>
                              <div className="text-sm font-bold text-blue-700">{boundaryArea} km²</div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Floating Action Buttons - Only in Spatial Edit Mode */}
                    {mapMode === "spatial" && isMapEditMode && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-[1000] flex items-center gap-3">
                        <Button
                          onClick={handleUpdateBoundaryClick}
                          className="bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white rounded-lg px-6 py-2 text-sm font-medium shadow-lg transition-all"
                        >
                          <Check className="w-4 h-4 mr-2" />
                          Update
                        </Button>
                        <Button
                          onClick={handleCancelEdit}
                          variant="outline"
                          className="bg-white hover:bg-gray-50 text-[#666666] border-[#E0E0E0] rounded-lg px-6 py-2 text-sm font-medium shadow-lg transition-all"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button
                          onClick={handleClearBoundary}
                          variant="outline"
                          className="bg-white hover:bg-red-50 text-[#EF4444] border-[#E0E0E0] rounded-lg px-6 py-2 text-sm font-medium shadow-lg transition-all"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Clear Selection
                        </Button>
                      </div>
                    )}

                    {/* Map Theme Toggle - Bottom Right */}
                    <div className="absolute bottom-4 right-4 z-[1000]">
                      
                    </div>

                    {/* Select Data Side Menu */}
                    {selectDataOpen && (
                      <div className="absolute top-4 right-16 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-[#E5E5E5] overflow-hidden">
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-[#E5E5E5]">
                          <h3 className="font-semibold text-[#1A1A1A] text-sm">Select Data</h3>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-[#E5E5E5]">
                          <button 
                            onClick={() => setActiveTab("identify")}
                            className={`flex-1 px-2 py-2.5 text-xs font-medium transition-colors ${
                              activeTab === "identify" 
                                ? "text-[#1A1A1A] bg-white border-b-2 border-[#EF4444]" 
                                : "text-[#6B6B6B] hover:bg-gray-50"
                            }`}
                          >
                            Identify
                          </button>
                          <button 
                            onClick={() => setActiveTab("layers")}
                            className={`flex-1 px-2 py-2.5 text-xs font-medium transition-colors ${
                              activeTab === "layers" 
                                ? "text-[#1A1A1A] bg-white border-b-2 border-[#EF4444]" 
                                : "text-[#6B6B6B] hover:bg-gray-50"
                            }`}
                          >
                            Identified Layers
                          </button>
                          <button 
                            onClick={() => setActiveTab("results")}
                            className={`flex-1 px-2 py-2.5 text-xs font-medium transition-colors ${
                              activeTab === "results" 
                                ? "text-[#1A1A1A] bg-white border-b-2 border-[#EF4444]" 
                                : "text-[#6B6B6B] hover:bg-gray-50"
                            }`}
                          >
                            Results
                          </button>
                        </div>

                        {/* Tab Content */}
                        <>
                        {activeTab === "identify" && (
                          <div className="p-4 space-y-3">
                            <p className="text-xs text-[#6B6B6B]">Select a tool to identify features on the map</p>
                            
                            {/* Shape Selection Grid */}
                            <div className="grid grid-cols-2 gap-2">
                              {/* Point */}
                              <button
                                onClick={() => setSelectedShape("point")}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                                  selectedShape === "point" 
                                    ? "border-[#EF4444] bg-[#FFF5F5]" 
                                    : "border-[#E5E5E5] hover:border-[#EF4444]/50 bg-white"
                                }`}
                              >
                                <Circle className={selectedShape === "point" ? "w-5 h-5 mb-1.5 text-[#EF4444]" : "w-5 h-5 mb-1.5 text-[#6B6B6B]"} fill="currentColor" />
                                <span className={selectedShape === "point" ? "text-[10px] font-medium text-[#EF4444]" : "text-[10px] font-medium text-[#6B6B6B]"}>Point</span>
                              </button>

                              {/* Rectangle */}
                              <button
                                onClick={() => setSelectedShape("rectangle")}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                                  selectedShape === "rectangle" 
                                    ? "border-[#EF4444] bg-[#FFF5F5]" 
                                    : "border-[#E5E5E5] hover:border-[#EF4444]/50 bg-white"
                                }`}
                              >
                                <Square className={selectedShape === "rectangle" ? "w-5 h-5 mb-1.5 text-[#EF4444]" : "w-5 h-5 mb-1.5 text-[#6B6B6B]"} />
                                <span className={selectedShape === "rectangle" ? "text-[10px] font-medium text-[#EF4444]" : "text-[10px] font-medium text-[#6B6B6B]"}>Rectangle</span>
                              </button>

                              {/* Polygon */}
                              <button
                                onClick={() => setSelectedShape("polygon")}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                                  selectedShape === "polygon" 
                                    ? "border-[#EF4444] bg-[#FFF5F5]" 
                                    : "border-[#E5E5E5] hover:border-[#EF4444]/50 bg-white"
                                }`}
                              >
                                <Pentagon className={selectedShape === "polygon" ? "w-5 h-5 mb-1.5 text-[#EF4444]" : "w-5 h-5 mb-1.5 text-[#6B6B6B]"} />
                                <span className={selectedShape === "polygon" ? "text-[10px] font-medium text-[#EF4444]" : "text-[10px] font-medium text-[#6B6B6B]"}>Polygon</span>
                              </button>

                              {/* Circle */}
                              <button
                                onClick={() => setSelectedShape("circle")}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                                  selectedShape === "circle" 
                                    ? "border-[#EF4444] bg-[#FFF5F5]" 
                                    : "border-[#E5E5E5] hover:border-[#EF4444]/50 bg-white"
                                }`}
                              >
                                <Circle className={selectedShape === "circle" ? "w-5 h-5 mb-1.5 text-[#EF4444]" : "w-5 h-5 mb-1.5 text-[#6B6B6B]"} />
                                <span className={selectedShape === "circle" ? "text-[10px] font-medium text-[#EF4444]" : "text-[10px] font-medium text-[#6B6B6B]"}>Circle</span>
                              </button>

                              {/* Line */}
                              <button
                                onClick={() => setSelectedShape("line")}
                                className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 transition-all ${
                                  selectedShape === "line" 
                                    ? "border-[#EF4444] bg-[#FFF5F5]" 
                                    : "border-[#E5E5E5] hover:border-[#EF4444]/50 bg-white"
                                }`}
                              >
                                <Minus className={selectedShape === "line" ? "w-5 h-5 mb-1.5 text-[#EF4444]" : "w-5 h-5 mb-1.5 text-[#6B6B6B]"} />
                                <span className={selectedShape === "line" ? "text-[10px] font-medium text-[#EF4444]" : "text-[10px] font-medium text-[#6B6B6B]"}>Line</span>
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Layers Tab */}
                        {activeTab === "layers" && (
                          <div className="p-4">
                            <p className="text-xs text-[#6B6B6B]">No layers identified yet</p>
                          </div>
                        )}

                        {/* Results Tab */}
                        {activeTab === "results" && (
                          <div className="p-4">
                            <p className="text-xs text-[#6B6B6B]">No results available</p>
                          </div>
                        )}
                        </>
                      </div>
                    )}

                    {/* Layers Side Menu - GIS Style */}
                    {layersOpen && (
                      <div className="absolute top-0 right-0 w-[320px] h-full bg-white/98 backdrop-blur-lg shadow-2xl border-l border-[#E5E5E5] z-[999] flex flex-col">
                        {/* Header */}
                        <div className="px-4 py-4 border-b border-[#E5E5E5] flex-shrink-0">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <Layers className="w-5 h-5 text-[#EF4444]" />
                              <h3 className="font-bold text-[#1A1A1A] text-base">Map Layers</h3>
                            </div>
                            <button
                              onClick={() => setLayersOpen(false)}
                              className="text-[#666666] hover:text-[#EF4444] transition-colors p-1 hover:bg-gray-100 rounded"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          
                          {/* Search Bar */}
                          <div className="relative mb-3">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#999999]" />
                            <Input
                              type="text"
                              placeholder="Search layers..."
                              value={layerSearch}
                              onChange={(e) => setLayerSearch(e.target.value)}
                              className="pl-9 pr-3 h-9 bg-gray-50 border border-[#E5E5E5] rounded-lg text-sm focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]"
                            />
                          </div>

                          {/* Select All */}
                          <div className="flex items-center justify-between bg-gray-50/50 p-2 rounded-lg border border-dashed border-[#E5E5E5]">
                             <div className="flex items-center gap-2">
                               <Checkbox 
                                 id="select-all-layers"
                                 checked={Object.values(layerVisibility).every(v => v)}
                                 onCheckedChange={(checked) => toggleAllLayers(!!checked)}
                                 className="border-[#B0AAA2] data-[state=checked]:bg-[#EF4444] data-[state=checked]:border-[#EF4444]"
                               />
                               <Label htmlFor="select-all-layers" className="text-xs font-semibold text-[#1A1A1A] cursor-pointer">
                                 Select All Layers
                               </Label>
                             </div>
                             <span className="text-[10px] text-[#666666] font-medium">
                               {Object.values(layerVisibility).filter(v => v).length} / {Object.keys(layerVisibility).length}
                             </span>
                          </div>
                        </div>

                        {/* Layer List - Scrollable */}
                        <div className="flex-1 overflow-y-auto px-3 py-3">
                          <div className="space-y-1">
                            {mapLayers
                              .filter(layer => 
                                layerSearch === "" || 
                                layer.name.toLowerCase().includes(layerSearch.toLowerCase()) ||
                                (layer.subLayers && layer.subLayers.some(sub => sub.toLowerCase().includes(layerSearch.toLowerCase())))
                              )
                              .map((layer) => (
                                <div key={layer.name}>
                                  {/* Parent Layer */}
                                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-all group">
                                    {layer.hasSubLayers && (
                                      <button
                                        onClick={() => toggleLayerExpansion(layer.name)}
                                        className="flex-shrink-0 text-[#666666] hover:text-[#EF4444] transition-colors"
                                      >
                                        {expandedLayer === layer.name ? (
                                          <ChevronDown className="w-4 h-4" />
                                        ) : (
                                          <ChevronRight className="w-4 h-4" />
                                        )}
                                      </button>
                                    )}
                                    {!layer.hasSubLayers && (
                                      <div className="w-4" />
                                    )}
                                    
                                    <Checkbox
                                      checked={layerVisibility[layer.name] !== false}
                                      onCheckedChange={() => toggleLayerVisibility(layer.name)}
                                      className="border-[#B0AAA2] data-[state=checked]:bg-[#EF4444] data-[state=checked]:border-[#EF4444] flex-shrink-0"
                                    />
                                    
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      <Grid className="w-4 h-4 text-[#666666] flex-shrink-0" />
                                      <span className="text-sm text-[#252628] font-medium truncate">{layer.name}</span>
                                    </div>
                                    
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                      {layerVisibility[layer.name] !== false ? (
                                        <Eye className="w-4 h-4 text-[#10B981]" />
                                      ) : (
                                        <EyeOff className="w-4 h-4 text-[#999999]" />
                                      )}
                                    </div>
                                  </div>

                                  {/* Sub Layers */}
                                  {layer.hasSubLayers && expandedLayer === layer.name && layer.subLayers && (
                                    <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-200 pl-2">
                                      {layer.subLayers.map((subLayer) => (
                                        <div
                                          key={subLayer}
                                          className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-all group"
                                        >
                                          <Checkbox
                                            checked={layerVisibility[subLayer] !== false}
                                            onCheckedChange={() => toggleLayerVisibility(subLayer)}
                                            className="border-[#B0AAA2] data-[state=checked]:bg-[#003F72] data-[state=checked]:border-[#003F72] flex-shrink-0"
                                          />
                                          
                                          <div className="flex items-center gap-2 flex-1 min-w-0">
                                            <Minus className="w-3 h-3 text-[#999999] flex-shrink-0" />
                                            <span className="text-xs text-[#4A5568] truncate">{subLayer}</span>
                                          </div>
                                          
                                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                                            {layerVisibility[subLayer] !== false ? (
                                              <Eye className="w-3 h-3 text-[#10B981]" />
                                            ) : (
                                              <EyeOff className="w-3 h-3 text-[#999999]" />
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-4 py-3 border-t border-[#E5E5E5] bg-gray-50/50 flex-shrink-0">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={resetLayers}
                              variant="outline"
                              className="flex-1 border-[#E0E0E0] hover:bg-gray-100 text-[#666666] rounded-lg px-3 py-2 text-xs font-medium h-auto"
                            >
                              <RotateCcw className="w-3 h-3 mr-1" />
                              Reset
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                const allLayers = mapLayers.reduce((acc, layer) => {
                                  acc[layer.name] = true;
                                  if (layer.subLayers) {
                                    layer.subLayers.forEach(sub => acc[sub] = true);
                                  }
                                  return acc;
                                }, {} as Record<string, boolean>);
                                setLayerVisibility(allLayers);
                                toast.success("All layers enabled");
                              }}
                              className="flex-1 bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#991B1B] text-white rounded-lg px-3 py-2 text-xs font-medium shadow-md h-auto"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Ok
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </Card>
            </div>
          </div>
        </div>

        {/* Edit Boundary Modal */}
        <Dialog open={editBoundaryOpen} onOpenChange={setEditBoundaryOpen}>
        <DialogContent className="max-w-[640px] p-0 rounded-xl h-[90vh] max-h-[90vh] flex flex-col overflow-hidden">
          {/* Fixed Header */}
          <div className="p-6 pb-4 border-b border-[#E5E5E5] shrink-0">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#1a1a1a]">Edit Boundary</DialogTitle>
              <DialogDescription className="text-[#666666]">
                Update spatial boundary information and manage access.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Scrollable Content Area */}
          <div className="space-y-6 px-6 py-4 overflow-y-auto flex-1 min-h-0 scroll-smooth">
            {/* Section 1 - Boundary Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#1a1a1a] pb-2 border-b border-[#E5E5E5]">
                Boundary Details
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="boundary-name" className="text-sm font-medium text-[#1a1a1a]">
                  Boundary Name
                </Label>
                <Input
                  id="boundary-name"
                  value={editBoundaryName}
                  onChange={(e) => setEditBoundaryName(e.target.value)}
                  className="h-10 rounded-lg border-[#E0E0E0]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="boundary-type" className="text-sm font-medium text-[#1a1a1a]">
                  Boundary Type
                </Label>
                <Select value={editBoundaryType} onValueChange={setEditBoundaryType}>
                  <SelectTrigger className="h-10 rounded-lg border-[#E0E0E0]">
                    <SelectValue placeholder="Select boundary type" />
                  </SelectTrigger>
                  <SelectContent>
                    {boundaryTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="boundary-org" className="text-sm font-medium text-[#1a1a1a]">
                  Organization
                </Label>
                <Select value={editBoundaryOrg} onValueChange={setEditBoundaryOrg}>
                  <SelectTrigger className="h-10 rounded-lg border-[#E0E0E0]">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map((org) => (
                      <SelectItem key={org} value={org}>
                        {org}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Section 2 - Assigned Users */}
            <div className="space-y-4 pb-4">
              <h3 className="text-sm font-semibold text-[#1a1a1a] pb-2 border-b border-[#E5E5E5]">
                Assigned Users
              </h3>

              {/* Assigned users list and add users functionality continues... */}
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-[#E5E5E5] bg-white shrink-0 shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">
            <Button
              variant="outline"
              onClick={() => setEditBoundaryOpen(false)}
              className="h-10 px-6 rounded-lg border-[#E0E0E0] text-[#666666] hover:bg-gray-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveBoundaryChangesClick}
              className="h-10 px-6 bg-gradient-to-r from-[#EF4444] to-[#FF6B6B] hover:from-[#DC2626] hover:to-[#e85555] text-white rounded-lg shadow-lg"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Permission Details Modal */}
      <Dialog open={viewBoundaryOpen} onOpenChange={setViewBoundaryOpen}>
        <DialogContent className="max-w-[640px] p-0 rounded-xl h-[85vh] max-h-[85vh] flex flex-col overflow-hidden">
          {/* Fixed Header */}
          <div className="p-6 pb-4 border-b border-[#E5E5E5] shrink-0">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#1a1a1a]">Permission Details</DialogTitle>
              <DialogDescription className="text-[#666666]">
                View spatial boundary permission information and assigned users.
              </DialogDescription>
            </DialogHeader>
          </div>

          {/* Scrollable Content Area */}
          <div className="space-y-6 px-6 py-4 overflow-y-auto flex-1 min-h-0 scroll-smooth">
            {viewedBoundary && (
              <>
                {/* Section 1 - Permission Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-[#1a1a1a] pb-2 border-b border-[#E5E5E5]">
                    Permission Information
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-[#666666]">Permission Name</Label>
                      <div className="text-sm text-[#1a1a1a] font-medium">{viewedBoundary.name}</div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-[#666666]">Permission Type</Label>
                      <div className="text-sm text-[#1a1a1a] font-medium">{viewedBoundary.type}</div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-[#666666]">Organization/Department</Label>
                      <div className="text-sm text-[#1a1a1a] font-medium">{viewedBoundary.name}</div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-[#666666]">Last Modified</Label>
                      <div className="text-sm text-[#1a1a1a] font-medium">{viewedBoundary.lastModified}</div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-[#666666]">Status</Label>
                      <Badge className={`${
                        viewedBoundary.status === "Active" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-orange-100 text-orange-700"
                      } border-0`}>
                        {viewedBoundary.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Section 2 - Users in this Permission */}
                <div className="space-y-4 pb-4">
                  <h3 className="text-sm font-semibold text-[#1a1a1a] pb-2 border-b border-[#E5E5E5]">
                    Users in this Permission
                  </h3>

                  {/* Users List */}
                  <div className="space-y-2">
                    {assignedUsers.length > 0 ? (
                      assignedUsers.map((user) => (
                        <div 
                          key={user.id} 
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-[#E5E5E5]"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EF4444]/20 to-[#FF6B6B]/20 flex items-center justify-center">
                              <Users className="w-5 h-5 text-[#EF4444]" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-[#1a1a1a]">{user.name}</div>
                              <div className="text-xs text-[#666666]">{user.organization} • {user.email}</div>
                            </div>
                          </div>
                          <Badge className="bg-green-100 text-green-700 border-0">
                            Active
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-[#999999] text-sm">
                        No users assigned to this permission
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Fixed Footer */}
          <div className="flex items-center justify-end gap-3 p-6 pt-4 border-t border-[#E5E5E5] bg-white shrink-0 shadow-[0_-2px_8px_rgba(0,0,0,0.05)]">
            <Button
              variant="outline"
              onClick={() => setViewBoundaryOpen(false)}
              className="h-10 px-6 rounded-lg border-[#E0E0E0] text-[#666666] hover:bg-gray-50"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Assign Block Confirmation Dialog */}
      <Dialog open={assignConfirmOpen} onOpenChange={setAssignConfirmOpen}>
        <DialogContent className="max-w-md bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
          <div className="px-8 pt-8 pb-8">
            <DialogHeader className="sr-only">
              <DialogTitle>Assign Block</DialogTitle>
              <DialogDescription>Confirm assigning block</DialogDescription>
            </DialogHeader>
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 rounded-full blur-2xl scale-150"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(16,185,129,0.4)]">
                    <Check className="w-10 h-10 text-white" strokeWidth={2} />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-[#10B981]/30 animate-ping"></div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#1A1A1A]">Assign Block</h3>
                <p className="text-[#6B6B6B] text-sm">
                  Are you sure you want to assign this block to the selected role?
                </p>
              </div>
              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleAssignBlock}
                  className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_32px_rgba(16,185,129,0.4)] transition-all duration-300 font-semibold"
                >
                  Yes, Assign
                </Button>
                <Button
                  onClick={() => setAssignConfirmOpen(false)}
                  variant="outline"
                  className="w-full border-2 border-[#E0E0E0] rounded-xl h-12 hover:bg-[#F5F5F5] transition-all font-semibold text-[#4A4A4A]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Update Boundary Confirmation Dialog */}
      <Dialog open={updateBoundaryConfirmOpen} onOpenChange={setUpdateBoundaryConfirmOpen}>
        <DialogContent className="max-w-md bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
          <div className="px-8 pt-8 pb-8">
            <DialogHeader className="sr-only">
              <DialogTitle>Update Boundary</DialogTitle>
              <DialogDescription>Confirm updating boundary</DialogDescription>
            </DialogHeader>
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#3B82F6]/20 to-[#2563EB]/20 rounded-full blur-2xl scale-150"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-[#3B82F6] to-[#2563EB] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(59,130,246,0.4)]">
                    <Check className="w-10 h-10 text-white" strokeWidth={2} />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-[#3B82F6]/30 animate-ping"></div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#1A1A1A]">Update Boundary</h3>
                <p className="text-[#6B6B6B] text-sm">
                  Are you sure you want to update the spatial boundary for this role?
                </p>
              </div>
              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleUpdateBoundary}
                  className="w-full bg-gradient-to-r from-[#3B82F6] to-[#2563EB] hover:from-[#2563EB] hover:to-[#1D4ED8] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(59,130,246,0.3)] hover:shadow-[0_8px_32px_rgba(59,130,246,0.4)] transition-all duration-300 font-semibold"
                >
                  Yes, Update
                </Button>
                <Button
                  onClick={() => setUpdateBoundaryConfirmOpen(false)}
                  variant="outline"
                  className="w-full border-2 border-[#E0E0E0] rounded-xl h-12 hover:bg-[#F5F5F5] transition-all font-semibold text-[#4A4A4A]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Boundary Changes Confirmation Dialog */}
      <Dialog open={saveBoundaryConfirmOpen} onOpenChange={setSaveBoundaryConfirmOpen}>
        <DialogContent className="max-w-md bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
          <div className="px-8 pt-8 pb-8">
            <DialogHeader className="sr-only">
              <DialogTitle>Save Changes</DialogTitle>
              <DialogDescription>Confirm saving boundary changes</DialogDescription>
            </DialogHeader>
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 rounded-full blur-2xl scale-150"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(16,185,129,0.4)]">
                    <Check className="w-10 h-10 text-white" strokeWidth={2} />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-[#10B981]/30 animate-ping"></div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#1A1A1A]">Save Boundary Details</h3>
                <p className="text-[#6B6B6B] text-sm">
                  Are you sure you want to save the modifications to this boundary?
                </p>
              </div>
              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleSaveBoundaryChanges}
                  className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_32px_rgba(16,185,129,0.4)] transition-all duration-300 font-semibold"
                >
                  Yes, Save 
                </Button>
                <Button
                  onClick={() => setSaveBoundaryConfirmOpen(false)}
                  variant="outline"
                  className="w-full border-2 border-[#E0E0E0] rounded-xl h-12 hover:bg-[#F5F5F5] transition-all font-semibold text-[#4A4A4A]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Boundary Confirmation Dialog */}
      <Dialog open={resetBoundaryConfirmOpen} onOpenChange={setResetBoundaryConfirmOpen}>
        <DialogContent className="max-w-md bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
          <div className="px-8 pt-8 pb-8">
            <DialogHeader className="sr-only">
              <DialogTitle>Reset Boundary</DialogTitle>
              <DialogDescription>Confirm resetting boundary</DialogDescription>
            </DialogHeader>
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B6B]/20 to-[#EF4444]/20 rounded-full blur-2xl scale-150"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-[#FF6B6B] to-[#EF4444] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(237,28,36,0.4)]">
                    <RotateCcw className="w-10 h-10 text-white" strokeWidth={2} />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-[#FF6B6B]/30 animate-ping"></div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-[#1A1A1A]">Reset Boundary</h3>
                <p className="text-[#6B6B6B] text-sm">
                  Are you sure you want to reset the boundary back to its original state? All current unsaved edits will be lost.
                </p>
              </div>
              <div className="space-y-3 pt-4">
                <Button
                  onClick={handleResetBoundary}
                  className="w-full bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#991B1B] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300 font-semibold"
                >
                  Yes, Reset
                </Button>
                <Button
                  onClick={() => setResetBoundaryConfirmOpen(false)}
                  variant="outline"
                  className="w-full border-2 border-[#E0E0E0] rounded-xl h-12 hover:bg-[#F5F5F5] transition-all font-semibold text-[#4A4A4A]"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
