import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  Globe, 
  Activity, 
  Database, 
  Plug, 
  TrendingUp, 
  ArrowUpRight,
  Settings, 
  Zap, 
  Cloud, 
  Webhook, 
  Plus, 
  X, 
  Building2, 
  Search, 
  Filter, 
  Maximize2, 
  Copy,
  Server,
  ServerOff,
  List,
  Grid3x3,
  ChevronDown,
  AlertTriangle,
  CheckCircle2,
  Eye,
  MoreVertical,
  Layout,
  Shield,
  Users,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Code2,
  ChevronLeft,
  ChevronRight,
  Monitor,
  Layers
} from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { MetricCard } from "../../components/ui/MetricCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "../../components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from "../../components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "../../components/ui/alert-dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";

const rawServiceNames = `
BACA/BACA
BAPCO/OIL_GAS
BATELCO/Telecom
BBU/BBU_FENCE
BBU/BBU
BIX/BIX_WL
CAA/CAA
CIO/Addresses
CIO/AdminBoundary
CIO/Buildings
CIO/Demographics
CIO/HealthServices
CIO/Landuse
CIO/PAVEMENTS
CIO/POIS
CIO/Population_Demography
CIO/StreetCenterLines
CIO/Vegetation
CIO/VVIP_MINISTRIALROADS
CLEARENCE/WLRedLining
CPO/DISTRICT_COOLING
CPO/MOC_RESERVED_SITES
CPO/MOIC_RESERVED_LOCATIONS
CPO/MUHARRAQ_DGS_ROUTE
CPO/Muharraq_DGS_WWCN
ELECTION_BOUNDARY/Election_boundary
EWA/ELECTRICITYDISTRIBUTION
EWA/ELECTRICITYTRANSMISSION
EWA/FD
EWA/PSDProposed
EWA/STREETLIGHT
EWA/WATERDISTRIBUTION
EWA/WATERTRANSMISSION
EWA_EDD/ELECTRICITYDISTRIBUTION
EWA_EDD/EWA_EDD_INFRA
EWA_EDD/EWA_EDD_QUERY
EWA_QUERY/EWA_EDD
EWA_QUERY/EWA_ETD_N
EWA_QUERY/EWA_ETD
EWA_QUERY/EWA_FD
EWA_QUERY/EWA_SLD
EWA_QUERY/EWA_WDD
EWA_QUERY/EWA_WTD
FENCE/BAPCO_GDN_FENCE
FENCE/BAPCO_REF_FENCE
FENCE/BIC_FENCE
FENCE/BTEA_FENCE
FENCE/MOIC_COMBINED_FENCE
FENCE/MOIC_FENCE
FENCE/MOIC_SALMAN_FENCE
FENCE/MUHARRAQ_STP
FENCE/MUNICIPALITY_FENCE
FENCE/NOGA
FENCE/TABREED_DC_FENCE
FENCE/TATWEER_FENCE
FENCE/TATWEER_GDN
FENCE/TB_DC_FENCE
FENCE_MUN/CAP_MUN_FENCE
FENCE_MUN/MUH_MUN_FENCE
FENCE_MUN/NOR_MUN_FENCE
FENCE_MUN/SOU_MUN_FENCE
GDUP/APPROVED_ZONE
GDUP/GDUP_ZONING_BP
MOBILE/WL_COMMENT
MOBILE_TOWERS/BIX
MOBILE_TOWERS/Mena
MOBILE_TOWERS/MLPS_Exact
MOBILE_TOWERS/Viva
MOBILE_TOWERS/Zain
MOH/Diabetes_patients_catgry
MOH/Diabetes_Patients
MOIC/MOIC_PARCELS
MOIC/MOICT
MOT/MTT_FENCE
MOT/MTT_NETWORK_MAP
MOT/MTT_Network
MOW/Road_Ducts
MOW/SEWERAGEANDDRAINAGE
MOW/TSE_MAP
MUN/Build_Permit
PERMITS/PermitRedLining
PMEW/MARGIS
SLRB/BP_PARCEL_QUERY
SLRB/CADASTRAL
SLRB/SLRB_CADASTRAL_LATEST
SLRB/SLRB_PARCEL
SLRB/Topo_2016v1
SLRB/TOPOGRAPHIC
TATWEER/Tatweer_Data
TATWEER/TATWEER
TRA_BATELCO/Telecom_INFRA
TRA_BATELCO/Telecom_QUERY
TRA_BATELCO/Telecom
WL_INFRA/EWA_EDD
WL_INFRA/EWA_ETD_N
WL_INFRA/EWA_ETD
WL_INFRA/EWA_FD
WL_INFRA/EWA_SLD
WL_INFRA/EWA_WDD
WL_INFRA/EWA_WTD
BACA_WFS/BACA_WFS
BAPCO/OIL_GAS
BATELCO/Telecom
CIO/Addresses
CIO/AddressesNSC
CIO/AdminBoundary
CIO/Buildings
CIO/HealthServices
CIO/Landuse
CIO/POIS
CIO/StreetCenterLines
CIO/VVIP_MinistrialRoads
CPO/DISTRICT_COOLING
CPO/MOC_RESERVED_LOCATIONS
CPO/MOIC_RESERVED_LOCATIONS
CPO/MUHARRAQ_DGS_ROUTE
EWA/ElectricityDistribution
EWA/ElectricityTransmission
EWA/STREETLIGHT
EWA/WaterDistribution
EWA/WaterTransmission
IGA_MOW/Building
MOBILE_TOWERS/BIX
MOBILE_TOWERS/MENA
MOBILE_TOWERS/MLPS_EXACT
MOBILE_TOWERS/VIVA
MOBILE_TOWERS/ZAIN
MOICT_WFS/MOICT
MOT/BUS_ROUTE
MOW/ROAD_DUCTS
MOW/SEWERAGEANDDRAINAGE
MOW_SEWERAGE_WFS/MOW_SEWERAGE_WFS
MUN/Building_Permit
NSA/Addresses
NSA/BSDILOCATOR (GeocodeServer)
NSA/NSA_DayBaseMap
NSA/NSA_GeoCode
NSA/NSA_Grids
NSA/NSA_NightBaseMap
NSA/NSA_POI
NSA/NSA_querymap
NSA/ROUTING_SERVICE
NSA/ROUTING_SERVICE (NAServer)
PMEW/MARGIS
RERA_SEPPD_WFS/RERA_SEPPD_WFS
SATELLITE/Satellite2005
SATELLITE/Satellite2006
SATELLITE/Satellite2014C
SATELLITE/Satellite2015
SATELLITE/Satellite2020_aerial_mosic
Satellite2020/Satellite2020
SLRB/CADASTRAL
SLRB/TOPOGRAPHIC
TATWEER/Tatweer_Data
TSE_WFS/TSE_WFS
UPDA_WFS/Administrative_Boundary_UPDA
UPDA_WFS/Buildings_UPDA
UPDA_WFS/POIS_UPDA
UPDA_WFS/Street_Centerlines_UPDA
UPDA_WFS/TRA_WFS
WFS/Addresses
WFS/AdminBoundary
WFS/Batelco_AddressesWFS
WFS/Pavements
WFS/POIS
WFS/StreetCenterLines
ZAIN/ZAIN_ADDR
BH_SATELLITE/Satellite1952 (MapServer)
BH_SATELLITE/Satellite1952papaermap (MapServer)
BH_SATELLITE/Satellite1964 (MapServer)
BH_SATELLITE/Satellite1986 (MapServer)
BH_SATELLITE/Satellite1990 (MapServer)
BH_SATELLITE/Satellite1998_other (MapServer)
BH_SATELLITE/Satellite2001 (MapServer)
BH_SATELLITE/Satellite2007 (MapServer)
BH_SATELLITE/Satellite2007SPT (MapServer)
BH_SATELLITE/Satellite2008 (MapServer)
BH_SATELLITE/Satellite2009 (MapServer)
BH_SATELLITE/Satellite2010 (MapServer)
BH_SATELLITE/Satellite2011dubai (MapServer)
BH_SATELLITE/Satellite2011 (MapServer)
BH_SATELLITE/Satellite2012 (MapServer)
BH_SATELLITE/Satellite2013 (MapServer)
BIX/Bix_Zones (MapServer)
BIX/BixEdit (FeatureServer)
BIX/BixEdit (MapServer)
BIX/BixProjects (MapServer)
BIX/ExportBIXMap (GPServer)
BSDI/BP_GATED_COMMUNITY (MapServer)
BSDI/INFRA_PLANS_IMPL (MapServer)
BSDI/MOICT_MAP_LATEST (MapServer)
BSDI/SCE (MapServer)
BSDI/TSE_NETWORK (MapServer)
CIO/Botanical_Atlas (MapServer)
CIO/Ports_SAT_2013 (MapServer)
CIO/SATELLITE2013C (MapServer)
CIO/SATELLITE2013 (MapServer)
CIO/SATELLITE_05_13 (MapServer)
CIO/SATELLITE_TA_15 (MapServer)
CIO/SATELLITE_TA (MapServer)
DTM/DTM
EAMS/Addresses (MapServer)
EAMS/BaseMap (MapServer)
EAMS/EAMS_BSDI (MapServer)
EAMS/EAMS_Edit (FeatureServer)
EAMS/EAMS_Edit (MapServer)
EAMS/EAMS_Label (MapServer)
EAMS/EAMS (MapServer)
EDITORS/SAT1964 (MapServer)
EDITORS/SLRB_TopoC (MapServer)
EDITORS/SLRB_TOPO (MapServer)
EDITORS/SLRB_Transportation (MapServer)
EWA/WDD_DESIGN_MAP_VIEW (MapServer)
`;

const serviceNames = rawServiceNames.split('\n').map(s => s.trim()).filter(s => s.length > 0);

const icons = [Globe, Activity, Database, Cloud, Webhook, Zap];
const types = ["WMS Service", "REST API", "Feature Layer", "External API", "Webhook"];

const services = serviceNames.map((name, index) => {
  const parts = name.split('/');
  const org = parts[0] ? parts[0].trim() : "Unknown Org";
  return {
    id: index + 1,
    name: name,
    type: types[index % types.length],
    organization: org,
    department: "Various Operations",
    icon: icons[index % icons.length],
    status: index % 11 === 0 ? "INACTIVE" : (index % 17 === 0 ? "MAINTENANCE" : "ACTIVE"),
    statusColor: index % 11 === 0 ? "gray" : (index % 17 === 0 ? "orange" : "green"),
    monthlyUsage: `${(index * 17 % 900) + 10}k`,
    lastUpdated: `${(index % 24) + 1}h ago`,
    endpoint: `https://api.bsdi.gov.bh/service/${index}`,
    version: `1.${(index % 5)}.${(index % 10)}`,
    authType: ["API Key", "OAuth", "Token", "None"][index % 4],
    visibility: index % 3 === 0 ? "Public" : (index % 4 === 0 ? "Restricted" : "Internal"),
    apiHealth: `${90 + (index % 10)}%`,
    isAccessible: index % 5 === 0 // Mock accessible services for demo
  };
});

export default function ServicesAPIs() {
  const location = useLocation();
  const isReviewer = location.pathname.includes("/reviewer");
  const isOrgAdmin = location.pathname.includes("/entity-admin");
  const isDeptAdmin = location.pathname.includes("/department");
  const adminOrg = isDeptAdmin ? "Urban Planning Authority" : "BSDI";
  const adminDept = "GIS Department";

  const [createServiceOpen, setCreateServiceOpen] = useState(false);
  const [serviceDetailOpen, setServiceDetailOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [filterOrg, setFilterOrg] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<typeof services>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;
  const [applicationIntegration, setApplicationIntegration] = useState(false);
  const [detailApplicationIntegration, setDetailApplicationIntegration] = useState(false);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [applicationDropdownOpen, setApplicationDropdownOpen] = useState(false);
  const [detailSelectedApplications, setDetailSelectedApplications] = useState<string[]>([]);
  const [detailApplicationDropdownOpen, setDetailApplicationDropdownOpen] = useState(false);

  // AlertDialog States
  const [createConfirmOpen, setCreateConfirmOpen] = useState(false);
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);

  // Handle search suggestions
  useEffect(() => {
    if (searchQuery.trim()) {
      const suggestions = services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.organization.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Function to scroll to selected service
  const handleSelectSuggestion = (service: typeof services[0]) => {
    setSearchQuery(service.name);
    setShowSuggestions(false);

    // Reset filters to ensure item is visible
    setFilterOrg("all");
    setFilterType("all");
    setFilterStatus("all");

    setTimeout(() => {
      const card = document.getElementById(`service-card-${service.id}`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        card.classList.add('ring-2', 'ring-[#EF4444]', 'ring-offset-2');
        setTimeout(() => {
          card.classList.remove('ring-2', 'ring-[#EF4444]', 'ring-offset-2');
        }, 2000);
      }
    }, 100);
  };

  // Logic Helpers
  const adminOrgServices = services.filter(s => s.organization === adminOrg);
  const adminDeptServices = services.filter(s => s.organization === adminOrg && s.department === adminDept);
  const accessibleServicesList = services.filter(s => s.isAccessible && s.organization !== adminOrg);
  
  const visibleServices = (isOrgAdmin || isDeptAdmin) 
    ? [...adminOrgServices, ...accessibleServicesList] 
    : services;

  const organizations = Array.from(new Set(visibleServices.map(s => s.organization)));
  const serviceTypes = Array.from(new Set(visibleServices.map(s => s.type)));

  // Filter services
  const filteredServices = visibleServices.filter(service => {
    const matchesOrg = filterOrg === "all" || service.organization === filterOrg;
    const matchesType = filterType === "all" || service.type === filterType;
    const matchesStatus = filterStatus === "all" || service.status === filterStatus;
    const matchesSearch = searchQuery === "" ||
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.organization.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesOrg && matchesType && matchesStatus && matchesSearch;
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterOrg, filterType, filterStatus]);

  const totalPages = Math.ceil(filteredServices.length / ITEMS_PER_PAGE);
  const paginatedServices = filteredServices.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleViewDetails = (service: any) => {
    setSelectedService(service);
    setServiceDetailOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-6 py-8">
      <div className="max-w-[1700px] w-full mx-auto space-y-6">
        <PageHeader
          title="Services & APIs"
          description="Manage and monitor all registered services and APIs"
        >
          {!isReviewer && (
            <Button
              variant="default"
              onClick={() => setCreateServiceOpen(true)}
              className="h-[36px] px-6 rounded-[10px] font-semibold bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              {(isOrgAdmin || isDeptAdmin) ? "Request New Service" : "Add New Service"}
            </Button>
          )}
        </PageHeader>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          <MetricCard 
            value={adminOrgServices.length} 
            label={isDeptAdmin ? "Organization Services" : (isOrgAdmin ? "Services Owned" : "Total Services")} 
            icon={<Server className="w-6 h-6" />} 
            variant="red" 
          />
          <MetricCard 
            value={isDeptAdmin ? adminDeptServices.length : accessibleServicesList.length} 
            label={isDeptAdmin ? "Department Services" : "Services Accessible"} 
            icon={isDeptAdmin ? <Monitor className="w-6 h-6" /> : <Shield className="w-6 h-6" />} 
            variant="green" 
          />
          <MetricCard 
            value={accessibleServicesList.length} 
            label={isDeptAdmin ? "Accessible Services" : (isOrgAdmin ? "Total Accessible" : "Organizations")} 
            icon={isDeptAdmin || isOrgAdmin ? <Globe className="w-6 h-6" /> : <Building2 className="w-6 h-6" />} 
            variant="yellow" 
          />
          <MetricCard 
            value={visibleServices.length} 
            label={isDeptAdmin ? "Total Services" : "Active APIs"} 
            icon={isDeptAdmin ? <Layers className="w-6 h-6" /> : <Activity className="w-6 h-6" />} 
            variant="purple" 
          />
        </div>

        {/* Main Content Card - Expands naturally with browser scroll */}
        <Card className="bg-white border border-[#F1F5F9] rounded-[20px] shadow-[0px_4px_20px_rgba(0,0,0,0.03)]" style={{ padding: '24px 28px' }}>
          {/* Card Header (Fixed) */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-3 shrink-0">
            <div>
              <h2 className="text-[18px] font-semibold text-[#111827]">Manage Services</h2>
              <p className="text-[13px] text-[#6B7280] mt-0.5">Manage and monitor all registered services and APIs</p>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto">
              <div className="relative w-full md:w-[280px]" ref={searchRef}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <Input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => searchQuery && setShowSuggestions(true)}
                  className="w-full h-[36px] pl-10 rounded-[10px] border-[#E5E7EB] bg-[#F9FAFB] text-sm focus:border-[#EF4444] transition-all"
                />

                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#F3F4F6] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-50 max-h-64 overflow-y-auto min-w-[350px]">
                    {searchSuggestions.map((service) => {
                      const Icon = service.icon;
                      return (
                        <button
                          key={service.id}
                          onClick={() => handleSelectSuggestion(service)}
                          className="w-full px-4 py-3 text-left hover:bg-[#F9FAFB] border-b border-[#F3F4F6] last:border-b-0 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#EF4444]/5 flex items-center justify-center shrink-0">
                              <Icon className="w-4 h-4 text-[#EF4444]" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-[#111827] truncate">{service.name}</p>
                              <p className="text-xs text-[#6B7280] truncate">{service.organization} • {service.type}</p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:flex md:items-center gap-2 md:gap-3 w-full md:w-auto">
                <div className="col-span-1">
                  <Select value={filterOrg} onValueChange={setFilterOrg}>
                    <SelectTrigger className="w-full md:w-[160px] h-[36px] rounded-[10px] border-[#E5E7EB] bg-white text-sm">
                      <SelectValue placeholder="Organization" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-[#F3F4F6] shadow-xl">
                      <SelectItem value="all">Organization</SelectItem>
                      {organizations.map(org => (
                        <SelectItem key={org} value={org}>{org}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-1">
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-full md:w-[150px] h-[36px] rounded-[10px] border-[#E5E7EB] bg-white text-sm">
                      <SelectValue placeholder="Service Type" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-[#F3F4F6] shadow-xl">
                      <SelectItem value="all">Service Type</SelectItem>
                      {serviceTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full md:w-[130px] h-[36px] rounded-[10px] border-[#E5E7EB] bg-white text-sm">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-[#F3F4F6] shadow-xl">
                      <SelectItem value="all">Status</SelectItem>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                      <SelectItem value="MAINTENANCE">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* List Section - No internal scroll, card grows with browser scroll */}
          <div className="space-y-4 mb-6">
            {paginatedServices.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  className="p-5 bg-white border border-[#E5E7EB] rounded-[18px] hover:border-[#EF4444]/30 hover:shadow-sm transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    {/* Top Row (Mobile) / Left Content (Desktop) */}
                    <div className="flex items-start justify-between sm:justify-start sm:items-center gap-4 w-full sm:w-auto">
                      <div className="min-w-0">
                        {/* Service Name */}
                        <p className="text-[15px] font-[700] text-[#3D72A2] leading-tight mb-2 hover:text-[#EF4444] transition-colors cursor-pointer">
                          {service.name.includes('/') ? service.name.split('/')[1] : service.name}
                        </p>
                        
                        {/* Owner Info */}
                        <div className="flex items-center gap-1.5 text-[#6B7280]">
                          <Building2 className="w-4 h-4 text-[#9CA3AF]" />
                          <span className="text-[13px] font-[500]">
                            {service.name.includes('/') ? service.name.split('/')[0] : service.organization}
                          </span>
                        </div>
                      </div>

                      {/* Manage Button (Top Right on Mobile) */}
                      <div className="sm:hidden shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-[34px] px-[12px] rounded-[10px] border-[#E5E7EB] bg-white text-[#374151] font-bold hover:bg-[#F9FAFB] hover:border-[#D1D5DB] active:bg-[#F3F4F6] transition-all flex items-center gap-1.5 shadow-sm text-[12px]"
                          onClick={() => handleViewDetails(service)}
                        >
                          <Settings className="w-[14px] h-[14px]" />
                          Manage
                        </Button>
                      </div>
                    </div>

                    {/* Bottom Row (Mobile) / Right Content (Desktop) */}
                    <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-center sm:gap-4 shrink-0">
                      {(isReviewer || isDeptAdmin) && (
                        <div className="hidden lg:block text-right min-w-[110px] mr-4">
                          <p className="text-[14px] font-bold text-[#111827]">Usage 1.2M</p>
                          <p className="text-[12px] text-[#6B7280] font-medium mt-0.5">updated {service.lastUpdated}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        {/* Service Type Chip */}
                        {(() => {
                          const typeStyles: Record<string, { bg: string; text: string }> = {
                            "REST API": { bg: "#DBEAFE", text: "#1D4ED8" },
                            "WMS Service": { bg: "#DCFCE7", text: "#166534" },
                            "Feature Layer": { bg: "#FEF3C7", text: "#92400E" },
                          };
                          const style = typeStyles[service.type] || { bg: "#F3E8FF", text: "#6B21A8" };
                          return (
                            <span 
                              className="px-[12px] py-[4px] rounded-full text-[11px] font-[700] leading-none whitespace-nowrap"
                              style={{ backgroundColor: style.bg, color: style.text }}
                            >
                              {service.type}
                            </span>
                          );
                        })()}

                        {/* Status Chip */}
                        <div className={`px-[12px] py-[5px] rounded-full text-[11px] font-[700] leading-none whitespace-nowrap ${
                          service.status === "ACTIVE" 
                            ? "bg-[#D1FAE5] text-[#065F46]" 
                            : "bg-[#FEE2E2] text-[#B91C1C]"
                        }`}>
                          {service.status === "ACTIVE" ? "Active" : (service.status === "MAINTENANCE" ? "Maintenance" : "Inactive")}
                        </div>
                      </div>

                      {/* Manage Button (Desktop Only) */}
                      <div className="hidden sm:block">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-[34px] px-[16px] rounded-[10px] border-[#E5E7EB] bg-white text-[#374151] font-bold hover:bg-[#F9FAFB] hover:border-[#D1D5DB] active:bg-[#F3F4F6] transition-all flex items-center gap-2 shadow-sm text-[13px]"
                          onClick={() => handleViewDetails(service)}
                        >
                          <Settings className="w-[14px] h-[14px]" />
                          Manage
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination (Fixed) */}
          {/* Desktop Pagination */}
          <div className="hidden md:flex items-center justify-between mt-4 pt-4 border-t border-[#F3F4F6] shrink-0">
            <div className="text-sm font-medium text-[#6B7280]">
              Showing {filteredServices.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredServices.length)} of {filteredServices.length} Services
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-9 w-9 p-0 rounded-xl border-[#E5E7EB] hover:bg-[#F3F4F6]"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-[#6B7280] px-3 text-sm font-bold">
                Page {currentPage} of {totalPages || 1}
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-9 w-9 p-0 rounded-xl border-[#E5E7EB] hover:bg-[#F3F4F6]"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage >= totalPages || totalPages === 0}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Pagination */}
          <div className="flex flex-col items-center justify-center gap-4 mt-4 pt-4 border-t border-[#F3F4F6] shrink-0 md:hidden">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 rounded-xl border-[#E5E7EB] text-[#6B7280] font-medium"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="default"
                size="sm"
                className="h-9 w-9 p-0 rounded-xl bg-[#EF4444] text-white font-bold"
              >
                {currentPage}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 rounded-xl border-[#E5E7EB] text-[#6B7280] font-medium"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage >= totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
            <div className="text-sm font-medium text-[#6B7280]">
              Showing <span className="font-bold text-[#111827]">{filteredServices.length}</span> results
            </div>
          </div>
        </Card>

        {/* Create Service Dialog */}
        <Dialog open={createServiceOpen} onOpenChange={setCreateServiceOpen}>
          <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:max-w-2xl h-[90vh] md:h-[500px] flex flex-col p-0 bg-white rounded-[16px] border-0 shadow-2xl">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white px-5 py-4 border-b border-[#F1F5F9] shrink-0 relative">
              <button 
                className="absolute right-4 top-4 p-1 text-[#9CA3AF] hover:text-[#111827] transition-colors cursor-pointer"
                onClick={() => setCreateServiceOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
              <DialogHeader className="gap-1">
                <DialogTitle className="text-[18px] font-semibold text-[#EF4444] leading-tight">
                  {isOrgAdmin || isDeptAdmin ? "Request New Service" : "Add New Service"}
                </DialogTitle>
                <DialogDescription className="text-[13px] text-[#6B7280]">
                  {isOrgAdmin || isDeptAdmin ? "Submit a request to add a new service to the registry." : "Add a new service to the registry."}
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Scrollable Body - Conditional Layout */}
            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
              {isOrgAdmin || isDeptAdmin ? (
                /* Branch B: Refined Request New Service (Org/Dept) */
                <div className="flex flex-col gap-4">
                  {/* Row 1: Service Name */}
                  <div className="space-y-1.5 text-left">
                    <Label htmlFor="name" className="text-[13px] font-medium text-[#374151]">
                      Proposed Service name <span className="text-[#EF4444]">*</span>
                    </Label>
                    <Input 
                      id="name" 
                      placeholder="Enter service name" 
                      className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 focus:border-[#EF4444] transition-all focus:ring-0"
                    />
                  </div>


                  {/* Row 3: Service Purpose */}
                  <div className="space-y-1.5 text-left">
                    <Label htmlFor="purpose" className="text-[13px] font-medium text-[#374151]">Service Purpose</Label>
                    <Textarea 
                      id="purpose" 
                      placeholder="Describe the purpose of this service" 
                      className="h-[80px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 py-2 focus:border-[#EF4444] transition-all focus:ring-0 resize-none overflow-y-auto"
                    />
                  </div>

                  {/* Row 4: Layer Details */}
                  <div className="space-y-1.5 text-left">
                    <Label htmlFor="layers" className="text-[13px] font-medium text-[#374151]">Layer Details (one or more layers)</Label>
                    <Textarea 
                      id="layers" 
                      placeholder="Enter layer names (e.g., Roads, Buildings)" 
                      className="h-[80px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 py-2 focus:border-[#EF4444] transition-all focus:ring-0 resize-none overflow-y-auto"
                    />
                  </div>

                  {/* Row 5: Additional Details */}
                  <div className="space-y-1.5 text-left">
                    <Label htmlFor="additional" className="text-[13px] font-medium text-[#374151]">Additional Details</Label>
                    <Textarea 
                      id="additional" 
                      placeholder="Any additional information" 
                      className="h-[80px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 py-2 focus:border-[#EF4444] transition-all focus:ring-0 resize-none overflow-y-auto"
                    />
                  </div>

                  {/* Row 6: Expected Service Type (Single Dropdown) */}
                  <div className="space-y-1.5 text-left">
                    <Label htmlFor="expectedType" className="text-[13px] font-medium text-[#374151]">Expected Service Type</Label>
                    <Select>
                      <SelectTrigger id="expectedType" className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 focus:border-[#EF4444] transition-all focus:ring-0">
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-[#F1F5F9] shadow-xl">
                        <SelectItem value="Map Service">Map Service</SelectItem>
                        <SelectItem value="Feature Service">Feature Service</SelectItem>
                        <SelectItem value="WMS / WFS">WMS / WFS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                /* Branch A: Legacy Add New Service (Super Admin Only) */
                <div className="flex flex-col gap-5">
                  {/* Row 1: Service Name + Service Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <Label htmlFor="name" className="text-[13px] font-medium text-[#374151]">
                        Service Name <span className="text-[#EF4444]">*</span>
                      </Label>
                      <Input 
                        id="name" 
                        placeholder="Enter service name" 
                        className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 focus:border-[#EF4444] transition-all focus:ring-0"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <Label htmlFor="type" className="text-[13px] font-medium text-[#374151]">
                        Service Type <span className="text-[#EF4444]">*</span>
                      </Label>
                      <Select>
                        <SelectTrigger className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 focus:border-[#EF4444] transition-all focus:ring-0">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-[#F1F5F9] shadow-xl z-[100]">
                          <SelectItem value="WMS Service">WMS Service</SelectItem>
                          <SelectItem value="REST API">REST API</SelectItem>
                          <SelectItem value="Feature Layer">Feature Layer</SelectItem>
                          <SelectItem value="External API">External API</SelectItem>
                          <SelectItem value="Webhook">Webhook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Row 2: Service URL */}
                  <div className="space-y-1.5 text-left">
                    <Label htmlFor="url" className="text-[13px] font-medium text-[#374151]">
                      Service URL <span className="text-[#EF4444]">*</span>
                    </Label>
                    <Input 
                      id="url" 
                      placeholder="https://api.example.com/service" 
                      className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 focus:border-[#EF4444] transition-all focus:ring-0"
                    />
                  </div>


                  {/* Row 3: Description (Textarea, Full Width) */}
                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-[13px] font-medium text-[#374151]">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Enter service description" 
                      className="h-[80px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 py-2 focus:border-[#EF4444] transition-all focus:ring-0 resize-none overflow-y-auto"
                    />
                  </div>

                  {/* Row 4: Organization (Dropdown) + Department (Dropdown) */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="organization" className="text-[13px] font-medium text-[#374151]">Organization</Label>
                      <Select>
                        <SelectTrigger className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 focus:border-[#EF4444] transition-all focus:ring-0">
                          <SelectValue placeholder="Select Organization" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-[#F1F5F9] shadow-xl z-[100]">
                          {organizations.map(org => (
                            <SelectItem key={org} value={org}>{org}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="department" className="text-[13px] font-medium text-[#374151]">Department</Label>
                      <Select>
                        <SelectTrigger className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 focus:border-[#EF4444] transition-all focus:ring-0">
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-[#F1F5F9] shadow-xl z-[100]">
                          <SelectItem value="GIS Department">GIS Department</SelectItem>
                          <SelectItem value="IT Department">IT Department</SelectItem>
                          <SelectItem value="Operation Department">Operation Department</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Row 5: Application Integration (Checkbox) */}
                  <div className="flex items-center space-x-3 py-1">
                    <Checkbox
                      id="applicationIntegration"
                      checked={applicationIntegration}
                      onCheckedChange={(checked) => setApplicationIntegration(checked as boolean)}
                      className="border-[#E5E7EB] h-4 w-4 rounded"
                    />
                    <Label 
                      htmlFor="applicationIntegration" 
                      className="text-[13px] font-medium text-[#374151] cursor-pointer"
                    >
                      Application Integration
                    </Label>
                  </div>

                  {/* Row 6: Application Dropdown - Shown when checkbox is checked */}
                  {applicationIntegration && (
                    <div className="space-y-1.5">
                      <Label htmlFor="application" className="text-[13px] font-medium text-[#374151]">
                        Application <span className="text-[#EF4444]">*</span>
                      </Label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setApplicationDropdownOpen(!applicationDropdownOpen)}
                          className="w-full border border-[#E5E7EB] rounded-[10px] h-[36px] px-3 focus:border-[#EF4444] transition-all flex items-center justify-between bg-white overflow-hidden focus:ring-0"
                        >
                          <span className="text-sm text-[#374151] truncate">
                            {selectedApplications.length === 0 
                              ? "Select applications" 
                              : `${selectedApplications.length} selected`}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-[#94A3B8] transition-transform shrink-0 ${applicationDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {applicationDropdownOpen && (
                          <div className="relative lg:absolute z-[100] w-full mt-1 bg-white border border-[#F1F5F9] rounded-xl shadow-xl max-h-40 overflow-y-auto scrollbar-hide">
                            {["BSDI Portal", "GIS Platform", "Data Hub", "Analytics Dashboard", "Mobile App"].map((app) => (
                              <label
                                key={app}
                                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                              >
                                <Checkbox
                                  checked={selectedApplications.includes(app)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedApplications([...selectedApplications, app]);
                                    } else {
                                      setSelectedApplications(selectedApplications.filter(a => a !== app));
                                    }
                                  }}
                                  className="h-4 w-4 rounded border-[#E5E7EB]"
                                />
                                <span className="text-[13px] text-[#374151]">{app}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 z-10 bg-white px-5 py-3 border-t border-[#F1F5F9] flex items-center justify-end gap-3 shrink-0 w-full">
              <Button 
                variant="outline" 
                className="h-[36px] px-5 rounded-[10px] border-[#E5E7EB] text-sm font-medium hover:bg-gray-50"
                onClick={() => setCreateServiceOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="h-[36px] px-6 rounded-[10px] bg-[#EF4444] hover:bg-[#D91B22] text-sm font-semibold text-white shadow-sm"
                onClick={() => setCreateConfirmOpen(true)}
              >
                {isOrgAdmin || isDeptAdmin ? "Request Service" : "Create Service"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* Service Detail Dialog (View Mode) */}
        <Dialog open={serviceDetailOpen} onOpenChange={setServiceDetailOpen}>
          <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:max-w-2xl h-[90vh] md:h-[500px] flex flex-col p-0 bg-white rounded-[16px] border-0 shadow-2xl">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white px-5 py-4 border-b border-[#F1F5F9] shrink-0 relative">
              <button 
                className="absolute right-4 top-4 p-1 text-[#9CA3AF] hover:text-[#111827] transition-colors cursor-pointer"
                onClick={() => setServiceDetailOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
              <DialogHeader>
                <DialogTitle className="text-[18px] font-semibold text-[#EF4444]">
                  Manage Details
                </DialogTitle>
                <DialogDescription className="text-[13px] text-[#6B7280]">
                  Viewing all registered information for this service.
                </DialogDescription>
              </DialogHeader>
            </div>

            {/* Scrollable Body (View Mode) - Conditional Layout */}
            <div className="flex-1 overflow-y-auto p-5 scrollbar-hide">
              {isOrgAdmin ? (
                /* Branch B: Refined Request Details - Edit Mode (Org Admin Only) */
                <div className="flex flex-col gap-4">
                  {/* Row 1: Service Name */}
                  <div className="space-y-1.5 text-left">
                    <Label htmlFor="editName" className="text-[13px] font-medium text-[#374151]">
                      Proposed Service name <span className="text-[#EF4444]">*</span>
                    </Label>
                    <Input 
                      id="editName" 
                      defaultValue={selectedService?.name.includes('/') ? selectedService?.name.split('/')[1] : selectedService?.name}
                      placeholder="Enter service name" 
                      className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 focus:border-[#EF4444] transition-all focus:ring-0"
                    />
                  </div>

                  {/* Row 3: Service Purpose */}
                  <div className="space-y-1.5 text-left">
                    <Label htmlFor="editPurpose" className="text-[13px] font-medium text-[#374151]">Service Purpose</Label>
                    <Textarea 
                      id="editPurpose" 
                      defaultValue={selectedService?.description || 'Registered service providing critical infrastructure endpoints and analytical data flow.'}
                      placeholder="Describe the purpose of this service" 
                      className="h-[80px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 py-2 focus:border-[#EF4444] transition-all focus:ring-0 resize-none overflow-y-auto"
                    />
                  </div>

                  {/* Row 4: Layer Details */}
                  <div className="space-y-1.5 text-left">
                    <Label htmlFor="editLayers" className="text-[13px] font-medium text-[#374151]">Layer Details (one or more layers)</Label>
                    <Textarea 
                      id="editLayers" 
                      defaultValue="Roads, Buildings, Infrastructure, Utilities"
                      placeholder="Enter layer names (e.g., Roads, Buildings)" 
                      className="h-[80px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 py-2 focus:border-[#EF4444] transition-all focus:ring-0 resize-none overflow-y-auto"
                    />
                  </div>

                  {/* Row 5: Additional Details */}
                  <div className="space-y-1.5 text-left">
                    <Label htmlFor="editAdditional" className="text-[13px] font-medium text-[#374151]">Additional Details</Label>
                    <Textarea 
                      id="editAdditional" 
                      defaultValue="No additional information provided for this service discovery."
                      placeholder="Any additional information" 
                      className="h-[80px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 py-2 focus:border-[#EF4444] transition-all focus:ring-0 resize-none overflow-y-auto"
                    />
                  </div>

                  {/* Row 6: Expected Service Type */}
                  <div className="space-y-1.5 text-left">
                    <Label htmlFor="editExpectedType" className="text-[13px] font-medium text-[#374151]">Expected Service Type</Label>
                    <Select defaultValue={selectedService?.type || "Map Service"}>
                      <SelectTrigger id="editExpectedType" className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 focus:border-[#EF4444] transition-all focus:ring-0">
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl border-[#F1F5F9] shadow-xl">
                        <SelectItem value="Map Service">Map Service</SelectItem>
                        <SelectItem value="Feature Service">Feature Service</SelectItem>
                        <SelectItem value="WMS / WFS">WMS / WFS</SelectItem>
                        <SelectItem value="External API">External API</SelectItem>
                        <SelectItem value="REST API">REST API</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : isDeptAdmin || isReviewer ? (
                /* Branch C: View Mode (Department Admin & Reviewer) */
                <div className="flex flex-col gap-4">
                  {/* Row 1: Service Name */}
                  <div className="flex flex-col">
                    <span className="text-[12px] font-normal text-[#6B7280] mb-1">Proposed Service name</span>
                    <span className="text-[14px] font-semibold text-[#111827]">
                      {selectedService?.name.includes('/') ? selectedService?.name.split('/')[1] : selectedService?.name}
                    </span>
                  </div>


                  {/* Row 3: Service Purpose */}
                  <div className="flex flex-col">
                    <span className="text-[12px] font-normal text-[#6B7280] mb-1">Service Purpose</span>
                    <span className="text-[14px] font-semibold text-[#111827] leading-relaxed">
                      {selectedService?.description || 'Registered service providing critical infrastructure endpoints and analytical data flow.'}
                    </span>
                  </div>

                  {/* Row 4: Layer Details */}
                  <div className="flex flex-col text-left">
                    <span className="text-[12px] font-normal text-[#6B7280] mb-1">Layer Details (one or more layers)</span>
                    <span className="text-[14px] font-semibold text-[#111827]">Roads, Buildings, Infrastructure, Utilities</span>
                  </div>

                  {/* Row 5: Additional Details */}
                  <div className="flex flex-col">
                    <span className="text-[12px] font-normal text-[#6B7280] mb-1">Additional Details</span>
                    <span className="text-[14px] font-semibold text-[#111827]">No additional information provided for this service discovery.</span>
                  </div>

                  {/* Row 6: Expected Service Type */}
                  <div className="flex flex-col">
                    <span className="text-[12px] font-normal text-[#6B7280] mb-1">Expected Service Type</span>
                    <span className="text-[14px] font-semibold text-[#111827]">{selectedService?.type || 'Map Service'}</span>
                  </div>
                </div>
              ) : (
                /* Branch A: Standard Admin Manage Details (Edit Mode - Super Admin Only) */
                <div className="flex flex-col gap-5">
                  {/* Row 1: Service Name + Service Type */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5 text-left">
                      <Label htmlFor="name" className="text-[13px] font-medium text-[#374151]">
                        Service Name <span className="text-[#EF4444]">*</span>
                      </Label>
                      <Input 
                        id="name" 
                        defaultValue={selectedService?.name.includes('/') ? selectedService?.name.split('/')[1] : selectedService?.name}
                        placeholder="Enter service name" 
                        className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 focus:border-[#EF4444] transition-all focus:ring-0"
                      />
                    </div>

                    <div className="space-y-1.5 text-left">
                      <Label htmlFor="type" className="text-[13px] font-medium text-[#374151]">
                        Service Type <span className="text-[#EF4444]">*</span>
                      </Label>
                      <Select defaultValue={selectedService?.type}>
                        <SelectTrigger className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 focus:border-[#EF4444] transition-all focus:ring-0">
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-[#F1F5F9] shadow-xl z-[100]">
                          <SelectItem value="WMS Service">WMS Service</SelectItem>
                          <SelectItem value="REST API">REST API</SelectItem>
                          <SelectItem value="Feature Layer">Feature Layer</SelectItem>
                          <SelectItem value="External API">External API</SelectItem>
                          <SelectItem value="Webhook">Webhook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Row 2: Service URL */}
                  <div className="space-y-1.5 text-left">
                    <Label htmlFor="url" className="text-[13px] font-medium text-[#374151]">
                      Service URL <span className="text-[#EF4444]">*</span>
                    </Label>
                    <Input 
                      id="url" 
                      defaultValue={selectedService?.endpoint}
                      placeholder="https://api.example.com/service" 
                      className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 focus:border-[#EF4444] transition-all focus:ring-0"
                    />
                  </div>

                  {/* Row 3: Description */}
                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-[13px] font-medium text-[#374151]">Description</Label>
                    <Textarea 
                      id="description" 
                      defaultValue={selectedService?.description || 'Registered service providing critical infrastructure endpoints and analytical data flow.'}
                      placeholder="Enter service description" 
                      className="h-[80px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 py-2 focus:border-[#EF4444] transition-all focus:ring-0 resize-none overflow-y-auto"
                    />
                  </div>

                  {/* Row 4: Organization + Department */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="organization" className="text-[13px] font-medium text-[#374151]">Organization</Label>
                      <Select defaultValue={selectedService?.name.includes('/') ? selectedService?.name.split('/')[0] : selectedService?.organization}>
                        <SelectTrigger className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 focus:border-[#EF4444] transition-all focus:ring-0">
                          <SelectValue placeholder="Select Organization" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-[#F1F5F9] shadow-xl z-[100]">
                          {organizations.map(org => (
                            <SelectItem key={org} value={org}>{org}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="department" className="text-[13px] font-medium text-[#374151]">Department</Label>
                      <Select defaultValue={selectedService?.department || "IT Operations"}>
                        <SelectTrigger className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white text-sm px-3 focus:border-[#EF4444] transition-all focus:ring-0">
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-[#F1F5F9] shadow-xl z-[100]">
                          <SelectItem value="GIS Department">GIS Department</SelectItem>
                          <SelectItem value="IT Operations">IT Operations</SelectItem>
                          <SelectItem value="IT Department">IT Department</SelectItem>
                          <SelectItem value="Operation Department">Operation Department</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Row 5: Application Integration */}
                  <div className="flex items-center space-x-3 py-1">
                    <Checkbox
                      id="editApplicationIntegration"
                      checked={detailApplicationIntegration}
                      onCheckedChange={(checked) => setDetailApplicationIntegration(checked as boolean)}
                      className="border-[#E5E7EB] h-4 w-4 rounded"
                    />
                    <Label 
                      htmlFor="editApplicationIntegration" 
                      className="text-[13px] font-medium text-[#374151] cursor-pointer"
                    >
                      Application Integration
                    </Label>
                  </div>

                  {/* Row 6: Application Dropdown - Shown when checkbox is checked */}
                  {detailApplicationIntegration && (
                    <div className="space-y-1.5">
                      <Label htmlFor="editApplication" className="text-[13px] font-medium text-[#374151]">
                        Application <span className="text-[#EF4444]">*</span>
                      </Label>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setDetailApplicationDropdownOpen(!detailApplicationDropdownOpen)}
                          className="w-full border border-[#E5E7EB] rounded-[10px] h-[36px] px-3 focus:border-[#EF4444] transition-all flex items-center justify-between bg-white overflow-hidden focus:ring-0"
                        >
                          <span className="text-sm text-[#374151] truncate">
                            {detailSelectedApplications.length === 0 
                              ? "Select applications" 
                              : `${detailSelectedApplications.length} selected`}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-[#94A3B8] transition-transform shrink-0 ${detailApplicationDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {detailApplicationDropdownOpen && (
                          <div className="relative lg:absolute z-[100] w-full mt-1 bg-white border border-[#F1F5F9] rounded-xl shadow-xl max-h-40 overflow-y-auto scrollbar-hide">
                            {["BSDI Management Console", "GIS Platform", "Data Hub", "Analytics Dashboard", "Mobile App"].map((app) => (
                              <label
                                key={app}
                                className="flex items-center gap-3 px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                              >
                                <Checkbox
                                  checked={detailSelectedApplications.includes(app)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setDetailSelectedApplications([...detailSelectedApplications, app]);
                                    } else {
                                      setDetailSelectedApplications(detailSelectedApplications.filter(a => a !== app));
                                    }
                                  }}
                                  className="h-4 w-4 rounded border-[#E5E7EB]"
                                />
                                <span className="text-[13px] text-[#374151]">{app}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 z-10 bg-white px-5 py-3 border-t border-[#F1F5F9] flex items-center justify-end gap-3 shrink-0 w-full">
              {isDeptAdmin || isReviewer ? (
                <Button 
                  variant="default" 
                  className="h-[36px] px-6 rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white text-sm font-medium transition-colors"
                  onClick={() => setServiceDetailOpen(false)}
                >
                  Close
                </Button>
              ) : (
                <>
                  <Button 
                    variant="outline" 
                    className="h-[36px] px-5 rounded-[10px] border-[#E5E7EB] text-sm font-medium hover:bg-gray-50"
                    onClick={() => setServiceDetailOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="h-[36px] px-6 rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-sm font-semibold text-white shadow-sm"
                    onClick={() => setEditConfirmOpen(true)}
                  >
                    Save Changes
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Confirmation & Success Dialogs */}

        {/* Create Service Confirmation */}
        <AlertDialog open={createConfirmOpen} onOpenChange={setCreateConfirmOpen}>
          <AlertDialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] pt-8 pb-5 px-5 bg-white rounded-[16px] border-0 shadow-2xl flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#FEE2E2] flex items-center justify-center mb-4 relative shrink-0">
              <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-[#EF4444]" />
              <AlertTriangle className="w-6 h-6 text-[#EF4444] relative z-10" />
            </div>
            
            <AlertDialogHeader className="w-full mb-5">
              <AlertDialogTitle className="text-[16px] font-semibold text-[#111827] mb-1 text-center">
                {isOrgAdmin || isDeptAdmin ? "Request New Service" : "Add New Service"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[13px] text-[#6B7280] text-center leading-normal px-2">
                {isOrgAdmin || isDeptAdmin ? "Are you sure you want to request this new service?" : "Are you sure you want to add this new service to the registry?"}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="w-full flex sm:flex-row flex-col gap-3 mt-0 sm:justify-center">
              <AlertDialogCancel className="w-full sm:w-[120px] h-[36px] px-4 rounded-[10px] border border-[#E5E7EB] text-[#4B5563] text-sm font-medium m-0 transition-all hover:bg-gray-50">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => {
                  setCreateConfirmOpen(false);
                  setCreateServiceOpen(false);
                }}
                className="w-full sm:w-[120px] h-[36px] px-4 rounded-[10px] bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-medium m-0 shadow-none transition-all"
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>


        {/* Edit Service Confirmation */}
        <AlertDialog open={editConfirmOpen} onOpenChange={setEditConfirmOpen}>
          <AlertDialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] pt-8 pb-5 px-5 bg-white rounded-[16px] border-0 shadow-2xl flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-[#FEE2E2] flex items-center justify-center mb-4 relative shrink-0">
              <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-[#EF4444]" />
              <AlertTriangle className="w-6 h-6 text-[#EF4444] relative z-10" />
            </div>
            
            <AlertDialogHeader className="w-full mb-5">
              <AlertDialogTitle className="text-[16px] font-semibold text-[#111827] mb-1 text-center">
                Update Service
              </AlertDialogTitle>
              <AlertDialogDescription className="text-[13px] text-[#6B7280] text-center leading-normal px-2">
                Are you sure you want to update this service's global registry details?
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter className="w-full flex sm:flex-row flex-col gap-3 mt-0 sm:justify-center">
              <AlertDialogCancel className="w-full sm:w-[120px] h-[36px] px-4 rounded-[10px] border border-[#E5E7EB] text-[#4B5563] text-sm font-medium m-0 transition-all hover:bg-gray-50">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => {
                  setEditConfirmOpen(false);
                  setServiceDetailOpen(false);
                }}
                className="w-full sm:w-[120px] h-[36px] px-4 rounded-[10px] bg-[#16A34A] hover:bg-[#15803D] text-white text-sm font-medium m-0 shadow-none transition-all"
              >
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
}
