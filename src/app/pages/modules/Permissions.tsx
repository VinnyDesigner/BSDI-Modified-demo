import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Checkbox } from "../../components/ui/checkbox";
import { 
  MapPin, Anchor, AlertTriangle, Grid, ChevronRight, Edit,
  ZoomIn, ZoomOut, Layers, ChevronDown, Square, Circle, Minus, Pentagon, Search, X, Eye, EyeOff, Plus, Server, Shield, Activity
} from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { MetricCard } from "../../components/ui/MetricCard";
import mapImage from "figma:asset/151aba0cecdc8f627ff198c217fe8b1fec102886.png";

const entities = [
  {
    id: 1,
    name: "Ministry of Housing",
    type: "Residential Zoning",
    lastModified: "2024-02-18",
    status: "Active",
  },
  {
    id: 2,
    name: "Electricity Authority",
    type: "Infrastructure Grid",
    lastModified: "2024-02-15",
    status: "Active",
  },
  {
    id: 3,
    name: "Environment Council",
    type: "Protected Zones",
    lastModified: "2024-02-10",
    status: "Under Review",
  },
  {
    id: 4,
    name: "Transport Ministry",
    type: "Road Networks",
    lastModified: "2024-02-08",
    status: "Active",
  },
  {
    id: 5,
    name: "Coast Guard",
    type: "Coastal Borders",
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

export default function Permissions() {
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
    "Addresses": true,
    "ADDRESSES": true,
    "Streetcenterlines": true,
    "wip_ministrialroads": true,
    "Mtt_network": true,
    "Tse_network": true,
    "District_cooling": true,
    "Ewc_wdd": true,
    "WaterDistributionDataset": true,
    "SystemValve": false,
    "AirValve": false,
    "ServiceValve": false,
    "Fitting": false,
    "Hydrant": false,
    "WServicePoint": false,
    "Meter": false,
    "CasingProtection": true,
    "ServicePipe": false,
    "MainPipe": true,
  });

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

  const toggleLayerVisibility = (layerName: string) => {
    setLayerVisibility(prev => ({
      ...prev,
      [layerName]: !prev[layerName]
    }));
  };

  const toggleLayerExpansion = (layerName: string) => {
    setExpandedLayer(expandedLayer === layerName ? null : layerName);
  };

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

  return (
    <div className="min-h-screen bg-[#F9FAFB] px-10 py-8">
      <div className="max-w-[1800px] mx-auto space-y-8">
        <PageHeader
          title="Spatial Governance & Boundaries"
          description="Manage and monitor all spatial boundaries and governance frameworks"
        >
          <Button
            variant="default"
            className="h-11 px-6 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all bg-[#003F72] hover:bg-[#00365d] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Boundary
          </Button>
        </PageHeader>

        {/* Standardized Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            value="12" 
            label="Total Roles" 
            icon={<Shield className="w-6 h-6" />} 
            variant="red" 
            trend={{ value: "+2", isPositive: true }}
          />
          <MetricCard 
            value="48" 
            label="Active Boundaries" 
            icon={<MapPin className="w-6 h-6" />} 
            variant="green" 
            statusText="Live"
          />
          <MetricCard 
            value="5" 
            label="Pending Reviews" 
            icon={<Anchor className="w-6 h-6" />} 
            variant="yellow" 
            statusText="In Progress"
          />
          <MetricCard 
            value="3" 
            label="System Updates" 
            icon={<Activity className="w-6 h-6" />} 
            variant="purple" 
            statusText="Critical"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Registered Entities */}
          

          {/* Right Content - Map View */}
          <div className="col-span-12">
            <div className="grid grid-cols-5 gap-6 h-[500px]">
              {/* Role List Panel - Left Side */}
              <Card className="col-span-1 bg-white border border-[#F3F4F6] rounded-[32px] shadow-[0px_4px_20px_rgba(0,0,0,0.03)] p-6 flex flex-col">
                <div className="mb-6 px-2">
                  <h3 className="text-[#111827] text-xs font-bold uppercase tracking-widest opacity-50">User Roles</h3>
                </div>
                
                <div className="flex-1 space-y-2">
                  {[
                    { id: "Super Admin", label: "Super Admin" },
                    { id: "Data Admin", label: "Data Admin" },
                    { id: "Org Admin", label: "Organization Admin" },
                    { id: "Data Manager", label: "Data Manager" },
                    { id: "Standard User", label: "Standard User" },
                  ].map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id)}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all ${
                        selectedRole === role.id 
                          ? "bg-[#EF4444]/5 border-2 border-[#EF4444] shadow-sm" 
                          : "hover:bg-gray-50 border-2 border-transparent"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedRole === role.id ? "border-[#EF4444]" : "border-[#D1D5DB]"
                      }`}>
                        {selectedRole === role.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" />
                        )}
                      </div>
                      <span className={`text-[13px] font-bold ${
                        selectedRole === role.id ? "text-[#111827]" : "text-[#6B7280]"
                      }`}>{role.label}</span>
                    </button>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-[#F3F4F6] px-2">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#6B7280]">Active Roles</span>
                      <span className="text-[11px] font-bold text-[#111827]">5</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#6B7280]">Total Users</span>
                      <span className="text-[11px] font-bold text-[#111827]">2,847</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">System Live</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Map View */}
              <Card className="col-span-4 p-0 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg overflow-hidden relative">
                {/* Map Image */}
                <div className="relative w-full h-full">
                  <svg 
                    viewBox="0 0 1200 600" 
                    className="w-full h-full"
                    style={{ background: '#1a1d23' }}
                  >
                    {/* Base Map with Subtle Terrain Texture */}
                    <defs>
                      <pattern id="terrain" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                        <circle cx="20" cy="20" r="0.5" fill="#2a2d33" opacity="0.3" />
                      </pattern>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                      <linearGradient id="redGlow" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#EF4444', stopOpacity: 0.8 }} />
                        <stop offset="100%" style={{ stopColor: '#EF4444', stopOpacity: 0.3 }} />
                      </linearGradient>
                    </defs>

                    {/* Terrain Texture Overlay */}
                    <rect width="1200" height="600" fill="url(#terrain)" />

                    {/* Grid Overlay - Subtle */}
                    <g stroke="#3a3d43" strokeWidth="0.5" opacity="0.3">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="600" />
                      ))}
                      {Array.from({ length: 6 }).map((_, i) => (
                        <line key={`h${i}`} x1="0" y1={i * 100} x2="1200" y2={i * 100} />
                      ))}
                    </g>

                    {/* District Boundaries - North Region */}
                    <path
                      d="M 150 80 L 380 70 L 420 150 L 380 220 L 200 200 Z"
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                    <path
                      d="M 380 70 L 580 90 L 620 180 L 580 240 L 420 150 Z"
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />

                    {/* District Boundaries - Central Region */}
                    <path
                      d="M 200 200 L 380 220 L 450 320 L 400 400 L 180 380 Z"
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                    <path
                      d="M 420 150 L 580 240 L 600 320 L 550 400 L 450 320 L 380 220 Z"
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                    <path
                      d="M 580 240 L 750 220 L 820 300 L 780 380 L 600 320 Z"
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />

                    {/* District Boundaries - East Region */}
                    <path
                      d="M 750 220 L 920 240 L 980 320 L 920 420 L 820 300 Z"
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                    <path
                      d="M 820 300 L 920 420 L 880 520 L 720 480 L 780 380 Z"
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />

                    {/* District Boundaries - South Region */}
                    <path
                      d="M 180 380 L 400 400 L 450 480 L 380 550 L 150 520 Z"
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                    <path
                      d="M 400 400 L 550 400 L 600 480 L 540 550 L 450 480 Z"
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />
                    <path
                      d="M 550 400 L 720 480 L 680 560 L 540 550 L 600 480 Z"
                      fill="none"
                      stroke="#6b7280"
                      strokeWidth="1.5"
                      opacity="0.6"
                    />

                    {/* Spatial Location Markers with Red Glow */}
                    <g filter="url(#glow)">
                      {/* Marker 1 */}
                      <circle cx="290" cy="140" r="6" fill="#EF4444" opacity="0.8" />
                      <circle cx="290" cy="140" r="3" fill="#fff" />
                      
                      {/* Marker 2 */}
                      <circle cx="500" cy="170" r="6" fill="#EF4444" opacity="0.8" />
                      <circle cx="500" cy="170" r="3" fill="#fff" />
                      
                      {/* Marker 3 */}
                      <circle cx="290" cy="290" r="6" fill="#EF4444" opacity="0.8" />
                      <circle cx="290" cy="290" r="3" fill="#fff" />
                      
                      {/* Marker 4 */}
                      <circle cx="515" cy="360" r="6" fill="#EF4444" opacity="0.8" />
                      <circle cx="515" cy="360" r="3" fill="#fff" />
                      
                      {/* Marker 5 */}
                      <circle cx="690" cy="290" r="6" fill="#EF4444" opacity="0.8" />
                      <circle cx="690" cy="290" r="3" fill="#fff" />
                      
                      {/* Marker 6 */}
                      <circle cx="850" cy="330" r="6" fill="#EF4444" opacity="0.8" />
                      <circle cx="850" cy="330" r="3" fill="#fff" />
                      
                      {/* Marker 7 */}
                      <circle cx="290" cy="455" r="6" fill="#EF4444" opacity="0.8" />
                      <circle cx="290" cy="455" r="3" fill="#fff" />
                      
                      {/* Marker 8 */}
                      <circle cx="475" cy="490" r="6" fill="#EF4444" opacity="0.8" />
                      <circle cx="475" cy="490" r="3" fill="#fff" />
                      
                      {/* Marker 9 */}
                      <circle cx="635" cy="520" r="6" fill="#EF4444" opacity="0.8" />
                      <circle cx="635" cy="520" r="3" fill="#fff" />
                    </g>

                    {/* Active Spatial Layer Indicators - Red Pulse */}
                    <g opacity="0.4">
                      <circle cx="290" cy="140" r="15" fill="none" stroke="url(#redGlow)" strokeWidth="2">
                        <animate attributeName="r" from="15" to="25" dur="2s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="515" cy="360" r="15" fill="none" stroke="url(#redGlow)" strokeWidth="2">
                        <animate attributeName="r" from="15" to="25" dur="2s" begin="0.5s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.6" to="0" dur="2s" begin="0.5s" repeatCount="indefinite" />
                      </circle>
                      <circle cx="850" cy="330" r="15" fill="none" stroke="url(#redGlow)" strokeWidth="2">
                        <animate attributeName="r" from="15" to="25" dur="2s" begin="1s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="0.6" to="0" dur="2s" begin="1s" repeatCount="indefinite" />
                      </circle>
                    </g>

                    {/* District Labels */}
                    <g fill="#9ca3af" fontSize="11" fontFamily="Inter, sans-serif" opacity="0.5">
                      <text x="290" y="145" textAnchor="middle" fontWeight="600">NORTH</text>
                      <text x="515" y="275" textAnchor="middle" fontWeight="600">CENTRAL</text>
                      <text x="850" y="330" textAnchor="middle" fontWeight="600">EAST</text>
                      <text x="290" y="455" textAnchor="middle" fontWeight="600">SOUTH</text>
                    </g>

                    {/* Coordinate Grid Reference */}
                    <g fill="#4b5563" fontSize="9" fontFamily="monospace" opacity="0.3">
                      <text x="10" y="20">25°N</text>
                      <text x="10" y="300">24°N</text>
                      <text x="10" y="580">23°N</text>
                      <text x="1150" y="590">51°E</text>
                    </g>
                  </svg>
                  
                  <div className="absolute top-4 right-4 flex flex-col gap-2.5">
                    <Button 
                      variant="outline"
                      size="icon" 
                      className="bg-white/90 backdrop-blur-md border-[#F3F4F6] text-[#6B7280] shadow-sm hover:text-[#EF4444] rounded-xl w-11 h-11 transition-all"
                    >
                      <ZoomIn className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="outline"
                      size="icon" 
                      className="bg-white/90 backdrop-blur-md border-[#F3F4F6] text-[#6B7280] shadow-sm hover:text-[#EF4444] rounded-xl w-11 h-11 transition-all"
                    >
                      <ZoomOut className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="outline"
                      size="icon" 
                      onClick={() => setLayersOpen(!layersOpen)}
                      className="bg-white/90 backdrop-blur-md border-[#F3F4F6] text-[#6B7280] shadow-sm hover:text-[#EF4444] rounded-xl w-11 h-11 transition-all"
                    >
                      <Layers className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="outline"
                      size="icon" 
                      className="bg-white/90 backdrop-blur-md border-[#F3F4F6] text-[#6B7280] shadow-sm hover:text-[#EF4444] rounded-xl w-11 h-11 transition-all"
                    >
                      <Pentagon className="w-5 h-5" />
                    </Button>
                  </div>

                  {/* Select Data Side Menu */}
                  {selectDataOpen && (
                    <div className="absolute top-4 right-16 w-80 bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-[#F3F4F6] overflow-hidden transition-all animate-in fade-in slide-in-from-right-4">
                      {/* Header */}
                      <div className="px-5 py-4 border-b border-[#F3F4F6] bg-[#F9FAFB]/50">
                        <h3 className="font-bold text-[#111827] text-sm">Select Data</h3>
                      </div>

                      {/* Tabs */}
                      <div className="flex bg-[#F9FAFB]/30">
                        {["Identify", "Layers", "Results"].map((tab) => (
                          <button 
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase() as any)}
                            className={`flex-1 px-2 py-3 text-[11px] font-bold uppercase tracking-wider transition-all border-b-2 ${
                              activeTab === tab.toLowerCase() 
                                ? "text-[#EF4444] border-[#EF4444] bg-white" 
                                : "text-[#9CA3AF] border-transparent hover:text-[#6B7280] hover:bg-gray-50"
                            }`}
                          >
                            {tab}
                          </button>
                        ))}
                      </div>

                      {/* Shape Selection Grid */}
                      {activeTab === "identify" && (
                        <div className="p-5 space-y-6">
                          <div className="grid grid-cols-3 gap-2.5">
                            {[
                              { id: "point", icon: Circle, label: "Point", filled: true },
                              { id: "rectangle", icon: Square, label: "Rectangle" },
                              { id: "polygon", icon: Pentagon, label: "Polygon" },
                              { id: "circle", icon: Circle, label: "Circle" },
                              { id: "line", icon: Minus, label: "Line" },
                            ].map((shape) => {
                              const Icon = shape.icon;
                              return (
                                <button
                                  key={shape.id}
                                  onClick={() => setSelectedShape(shape.id)}
                                  className={`flex flex-col items-center justify-center aspect-square p-2 rounded-xl border-2 transition-all ${
                                    selectedShape === shape.id 
                                      ? "border-[#EF4444] bg-[#EF4444]/5 text-[#EF4444]" 
                                      : "border-[#F3F4F6] hover:border-[#EF4444]/20 bg-white text-[#6B7280] hover:text-[#EF4444]/60"
                                  }`}
                                >
                                  <Icon className="w-5 h-5 mb-1.5" />
                                  <span className="text-[10px] font-bold uppercase tracking-tight">{shape.label}</span>
                                </button>
                              );
                            })}
                          </div>

                          {/* Active Button Section */}
                          <div className="flex items-center justify-between pt-4 border-t border-[#F3F4F6]">
                            <span className="text-[11px] font-bold text-[#6B7280] uppercase">Selection Type</span>
                            <Button
                              onClick={() => {
                                setSelectDataOpen(false);
                                setSelectedShape("rectangle");
                              }}
                              variant="outline"
                              className="h-8 px-4 rounded-lg text-[10px] font-bold bg-[#EF4444]/5 border-[#EF4444]/20 text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all shadow-sm"
                            >
                              Clear Selection
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Identified Layers Tab Content */}
                      {activeTab === "layers" && (
                        <div className="p-10 text-center space-y-3">
                          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto opacity-50">
                            <Layers className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">No Layers Identified</p>
                        </div>
                      )}

                      {/* Identified Results Tab Content */}
                      {activeTab === "results" && (
                        <div className="p-10 text-center space-y-3">
                          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mx-auto opacity-50">
                            <Search className="w-6 h-6 text-gray-400" />
                          </div>
                          <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">No Results Found</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Layers Side Menu */}
                  {layersOpen && (
                    <div className="absolute top-4 right-16 w-64 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-[#E5E5E5] overflow-hidden">
                      {/* Header */}
                      <div className="px-4 py-3 border-b border-[#E5E5E5]">
                        <h3 className="font-semibold text-[#1A1A1A] text-sm">Layers</h3>
                      </div>

                      {/* Search Input */}
                      <div className="px-4 py-2">
                        <input
                          type="text"
                          value={layerSearch}
                          onChange={(e) => setLayerSearch(e.target.value)}
                          placeholder="Search layers..."
                          className="w-full px-3 py-2 border border-[#E5E5E5] rounded-lg focus:outline-none focus:border-[#EF4444]"
                        />
                      </div>

                      {/* Layer List */}
                      <div className="h-[300px] overflow-y-auto px-4 py-2">
                        {mapLayers
                          .filter(layer => layer.name.toLowerCase().includes(layerSearch.toLowerCase()))
                          .map(layer => (
                            <div key={layer.name} className="mb-2">
                              <div
                                className={`
                                  flex items-center justify-between cursor-pointer
                                  ${expandedLayer === layer.name ? 'bg-[#EBECE8] border-[#B0AAA2]/30' : 'bg-white hover:bg-[#EBECE8]/50'}
                                `}
                                onClick={() => toggleLayerExpansion(layer.name)}
                              >
                                <div className="flex items-center">
                                  <Checkbox
                                    checked={layerVisibility[layer.name]}
                                    onCheckedChange={() => toggleLayerVisibility(layer.name)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="mr-2 border-[#B0AAA2] data-[state=checked]:bg-[#EF4444] data-[state=checked]:border-[#EF4444]"
                                  />
                                  <p className="text-sm font-semibold text-[#252628]">{layer.name}</p>
                                </div>
                                {layer.hasSubLayers && (
                                  <ChevronDown 
                                    className={`w-4 h-4 text-[#666666] transition-transform duration-300 ${
                                      expandedLayer === layer.name ? 'rotate-180' : 'rotate-0'
                                    }`}
                                  />
                                )}
                              </div>

                              {/* Sub Layers */}
                              {expandedLayer === layer.name && layer.hasSubLayers && (
                                <div className="ml-4 mt-2">
                                  {layer.subLayers.map(subLayer => (
                                    <div key={subLayer} className="flex items-center mb-1">
                                      <Checkbox
                                        checked={layerVisibility[subLayer]}
                                        onCheckedChange={() => toggleLayerVisibility(subLayer)}
                                        onClick={(e) => e.stopPropagation()}
                                        className="mr-2 border-[#B0AAA2] data-[state=checked]:bg-[#EF4444] data-[state=checked]:border-[#EF4444]"
                                      />
                                      <p className="text-xs text-[#666666]">{subLayer}</p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                      </div>

                      {/* Reset Button */}
                      <div className="px-4 py-2">
                        <Button
                          size="sm"
                          onClick={resetLayers}
                          className="bg-gradient-to-r from-[#EF4444] to-[#D91B22] hover:from-[#D91B22] hover:to-[#991B1B] text-white rounded-lg px-3 py-1.5 text-xs shadow-md transition-all h-auto"
                        >
                          Reset Layers
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Boundaries Table */}
        <Card className="relative p-6 bg-white/80 backdrop-blur-sm border border-[#EF4444]/20 rounded-2xl shadow-lg overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#EF4444] via-[#F87171] to-[#EF4444]" />
          
          {/* Table Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#1a1a1a]">Spatial Boundaries Registry</h2>
              <p className="text-sm text-[#666666] mt-1">Manage and monitor boundary entities</p>
            </div>
            <Button className="bg-gradient-to-r from-[#EF4444] to-[#F87171] hover:from-[#D91B22] hover:to-[#F87171] text-white rounded-full shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Add Boundary
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#EF4444]/20 bg-gradient-to-r from-red-50/50 to-transparent">
                  <th className="text-left py-4 px-4 text-xs font-bold text-[#EF4444] uppercase tracking-wider">
                    Entity Name
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-[#EF4444] uppercase tracking-wider">
                    Boundary Type
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-[#EF4444] uppercase tracking-wider">
                    Last Modified
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-[#EF4444] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-4 px-4 text-xs font-bold text-[#EF4444] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {entities.map((entity, index) => (
                  <tr 
                    key={entity.id}
                    className={`border-b border-[#B0AAA2]/10 hover:bg-gradient-to-r hover:from-red-50/30 hover:to-transparent transition-all group ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#EF4444] to-[#F87171] opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="text-sm font-semibold text-[#1a1a1a]">{entity.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-[#666666] font-medium">
                      {entity.type}
                    </td>
                    <td className="py-4 px-4 text-sm text-[#666666]">
                      {entity.lastModified}
                    </td>
                    <td className="py-4 px-4">
                      <Badge 
                        className={`
                          ${entity.status === 'Active' 
                            ? 'bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200' 
                            : 'bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 border-orange-200'
                          }
                          border text-xs font-semibold px-3 py-1.5 shadow-sm
                        `}
                      >
                        {entity.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Button 
                        size="sm"
                        className="bg-white hover:bg-gradient-to-r hover:from-[#EF4444] hover:to-[#F87171] text-[#252628] hover:text-white border border-[#EF4444]/30 hover:border-transparent rounded-full h-9 transition-all shadow-sm"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

