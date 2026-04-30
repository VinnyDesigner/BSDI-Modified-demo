import { useState, useEffect, useRef } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { 
  LayoutDashboard, Building2, Users, FileText, Database, 
  Shield, Download, FileCheck, Settings, Bell, Search, 
  LogOut, Menu, X, MapPin, ChevronRight, Grid3x3, Zap, Map, Lock, LayoutGrid,
  SquareStack, Network, UserRound, FileBarChart, Table2, Orbit, ShieldCheck, AppWindow, ScrollText, Key
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { 
  Popover, PopoverContent, PopoverTrigger 
} from "./ui/popover";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { RoleIcon3D } from "./RoleIcon3D";
import bahrainCoatOfArms from "../../assets/bahrain-logo-new.png";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "" },
  { icon: Building2, label: "Organizations", path: "/organizations" },
  { icon: Network, label: "Departments", path: "/departments" },
  { icon: Users, label: "Users", path: "/users" },
  { icon: FileBarChart, label: "Requests", path: "/data-requests1" },
  { icon: Table2, label: "Entity Access Matrix", path: "/entity-access-matrix" },
  { icon: Orbit, label: "Services", path: "/services-apis" },
  { icon: ShieldCheck, label: "Roles", path: "/roles-management" },
  { icon: Lock, label: "Security Access Group", path: "/security-access-group" },
  { icon: LayoutGrid, label: "Applications", path: "/applications" },
  { icon: ScrollText, label: "Audit Logs", path: "/audit-logs" },
  // { icon: Settings, label: "Settings", path: "/settings" }, // Hidden as requested
];

// Mock notification data
const notifications = [
  {
    id: 1,
    requestId: "DAE-3042-893",
    title: "Data Access Request - Ministry of Works",
    description: "Requesting access to urban planning datasets",
    organization: "Ministry of Works",
    timestamp: "5 minutes ago",
    status: "pending",
    unread: true,
    tab: "data-access", // Tab to activate when clicked
  },
  {
    id: 2,
    requestId: "REQ-2024-002",
    title: "New Organization Registration",
    description: "Transport Authority submitted registration",
    organization: "Transport Authority",
    timestamp: "1 hour ago",
    status: "pending",
    unread: true,
    tab: "organization-creator", // Tab to activate when clicked
  },
  {
    id: 3,
    requestId: "REQ-2024-003",
    title: "User Access Approval Required",
    description: "3 users pending approval for data access",
    organization: "Environmental Agency",
    timestamp: "2 hours ago",
    status: "pending",
    unread: true,
    tab: "user-requests", // Tab to activate when clicked
  },
  {
    id: 4,
    requestId: "DAE-3042-941",
    title: "Dataset Update Notification",
    description: "Boundary data updated successfully",
    organization: "Urban Planning Authority",
    timestamp: "5 hours ago",
    status: "completed",
    unread: false,
    tab: "data-access", // Tab to activate when clicked
  },
  {
    id: 5,
    requestId: "REQ-2024-005",
    title: "API Access Request",
    description: "Request for spatial API integration",
    organization: "Digital Government",
    timestamp: "1 day ago",
    status: "pending",
    unread: false,
    tab: "data-access", // Tab to activate when clicked
  },
];

// Comprehensive search data from all screens
const searchData = {
  organizations: [
    { id: 1, name: "Ministry of Housing", type: "Ministry", status: "Active", path: "/organizations" },
    { id: 2, name: "Transport Authority", type: "Authority", status: "Active", path: "/organizations" },
    { id: 3, name: "Environmental Agency", type: "Agency", status: "Active", path: "/organizations" },
    { id: 4, name: "Ministry of Works", type: "Ministry", status: "Active", path: "/organizations" },
    { id: 5, name: "Urban Planning Authority", type: "Authority", status: "Active", path: "/organizations" },
    { id: 6, name: "Digital Government", type: "Authority", status: "Active", path: "/organizations" },
    { id: 7, name: "Electricity Authority", type: "Authority", status: "Active", path: "/organizations" },
    { id: 8, name: "Environment Council", type: "Council", status: "Active", path: "/organizations" },
    { id: 9, name: "Transport Ministry", type: "Ministry", status: "Active", path: "/organizations" },
    { id: 10, name: "Coast Guard", type: "Authority", status: "Active", path: "/organizations" },
  ],
  departments: [
    { id: 1, name: "GIS Department", organization: "Ministry of Housing", path: "/departments" },
    { id: 2, name: "Urban Planning Department", organization: "Urban Planning Authority", path: "/departments" },
    { id: 3, name: "Infrastructure Department", organization: "Electricity Authority", path: "/departments" },
    { id: 4, name: "Environmental Protection Department", organization: "Environment Council", path: "/departments" },
    { id: 5, name: "Transportation Planning Department", organization: "Transport Ministry", path: "/departments" },
  ],
  users: [
    { id: 1, name: "Ahmed Al-Khalifa", email: "ahmed.k@housing.gov.bh", organization: "Ministry of Housing", role: "Entity Admin", path: "/users" },
    { id: 2, name: "Fatima Al-Zayani", email: "fatima.z@transport.gov.bh", organization: "Transport Authority", role: "Department Reviewer", path: "/users" },
    { id: 3, name: "Mohammed Hassan", email: "m.hassan@environment.gov.bh", organization: "Environmental Agency", role: "Organization User", path: "/users" },
    { id: 4, name: "Sarah Ibrahim", email: "s.ibrahim@works.gov.bh", organization: "Ministry of Works", role: "Entity Admin", path: "/users" },
    { id: 5, name: "Ali Mansoor", email: "ali.m@urban.gov.bh", organization: "Urban Planning Authority", role: "Department Reviewer", path: "/users" },
    { id: 6, name: "Khalid Ahmed", email: "k.ahmed@electricity.gov.bh", organization: "Electricity Authority", role: "GIS Analyst", path: "/users" },
    { id: 7, name: "Noor Salman", email: "n.salman@coastguard.gov.bh", organization: "Coast Guard", role: "Data Manager", path: "/users" },
    { id: 8, name: "Layla Hassan", email: "l.hassan@environment.gov.bh", organization: "Environment Council", role: "Spatial Analyst", path: "/users" },
  ],
  requests: [
    { id: 1, title: "Urban Planning Dataset Access", organization: "Ministry of Works", status: "Pending", type: "Data Access", path: "/data-requests1" },
    { id: 2, title: "Transport Authority Registration", organization: "Transport Authority", status: "Pending", type: "Registration", path: "/data-requests1" },
    { id: 3, title: "User Access Approval", organization: "Environmental Agency", status: "Pending", type: "User Access", path: "/data-requests1" },
    { id: 4, title: "Boundary Data Update", organization: "Urban Planning Authority", status: "Completed", type: "Data Update", path: "/data-requests1" },
    { id: 5, title: "API Integration Request", organization: "Digital Government", status: "Pending", type: "API Access", path: "/data-requests1" },
    { id: 6, title: "Spatial Data Export Request", organization: "Ministry of Housing", status: "Approved", type: "Data Export", path: "/data-requests1" },
  ],
  roles: [
    { id: 1, name: "BSDI Super Admin", permissions: 156, users: 3, description: "Full system access", path: "/roles-management" },
    { id: 2, name: "Entity Admin", permissions: 89, users: 24, description: "Entity-level administration", path: "/roles-management" },
    { id: 3, name: "Department Reviewer", permissions: 45, users: 67, description: "Review and approve requests", path: "/roles-management" },
    { id: 4, name: "Organization User", permissions: 23, users: 142, description: "Basic data access", path: "/roles-management" },
    { id: 5, name: "GIS Analyst", permissions: 56, users: 34, description: "Spatial data analysis", path: "/roles-management" },
    { id: 6, name: "Data Manager", permissions: 67, users: 28, description: "Data management and curation", path: "/roles-management" },
  ],
  permissions: [
    { id: 1, name: "View Dashboard", module: "Dashboard", path: "/roles2" },
    { id: 2, name: "Manage Organizations", module: "Organizations", path: "/roles2" },
    { id: 3, name: "Create Users", module: "Users", path: "/roles2" },
    { id: 4, name: "Approve Requests", module: "Requests", path: "/roles2" },
    { id: 5, name: "Edit Spatial Data", module: "Spatial", path: "/roles2" },
    { id: 6, name: "Export Data", module: "Data", path: "/roles2" },
    { id: 7, name: "Manage Roles", module: "Roles", path: "/roles2" },
    { id: 8, name: "View Audit Logs", module: "Audit", path: "/roles2" },
  ],
  services: [
    { id: 1, name: "Spatial Data API", type: "REST API", status: "Active", path: "/services-apis" },
    { id: 2, name: "WMS Service", type: "Map Service", status: "Active", path: "/services-apis" },
    { id: 3, name: "WFS Service", type: "Feature Service", status: "Active", path: "/services-apis" },
    { id: 4, name: "Geocoding API", type: "REST API", status: "Active", path: "/services-apis" },
  ],
};

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<Array<{type: string; data: any}>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState("Ministry of Works");
  const [selectedDept, setSelectedDept] = useState("Urban Planning Department");
  const [isMobile, setIsMobile] = useState(false);

  // Handle window resize to detect mobile
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle search suggestions
  useEffect(() => {
    if (searchQuery.trim()) {
      const results: Array<{type: string; data: any}> = [];
      
      // Search organizations
      const matchingOrgs = searchData.organizations.filter(org =>
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.type.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3);
      matchingOrgs.forEach(org => results.push({ type: 'organization', data: org }));
      
      // Search departments
      const matchingDepts = searchData.departments.filter(dept =>
        dept.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dept.organization.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3);
      matchingDepts.forEach(dept => results.push({ type: 'department', data: dept }));
      
      // Search users
      const matchingUsers = searchData.users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.organization.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3);
      matchingUsers.forEach(user => results.push({ type: 'user', data: user }));
      
      // Search requests
      const matchingRequests = searchData.requests.filter(req =>
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.type.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3);
      matchingRequests.forEach(req => results.push({ type: 'request', data: req }));
      
      // Search roles
      const matchingRoles = searchData.roles.filter(role =>
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3);
      matchingRoles.forEach(role => results.push({ type: 'role', data: role }));
      
      // Search permissions
      const matchingPermissions = searchData.permissions.filter(permission =>
        permission.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        permission.module.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3);
      matchingPermissions.forEach(permission => results.push({ type: 'permission', data: permission }));
      
      // Search services
      const matchingServices = searchData.services.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.type.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3);
      matchingServices.forEach(service => results.push({ type: 'service', data: service }));
      
      setSearchSuggestions(results.slice(0, 8));
      setShowSuggestions(results.length > 0);
      
      // Calculate dropdown position
      if (searchRef.current && results.length > 0) {
        const rect = searchRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 4, // 4px gap below search box
          left: rect.left,
          width: rect.width
        });
      }
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

  // Determine current role based on path
  const getRoleInfo = () => {
    const path = location.pathname;
    if (path.includes("super-admin")) return { role: "BSDI Super Admin", name: "Mohammed Al Khalifa", initials: "MK", color: "bg-[#EF4444]", rolePrefix: "super-admin" };
    if (path.includes("reviewer")) return { role: "Reviewer Role", name: "Fatima Al-Zayani", initials: "FZ", color: "bg-[#003F72]", rolePrefix: "reviewer" };
    if (path.includes("entity-admin")) return { role: "Organization Admin", name: "Ahmed Al-Mansoori", initials: "AM", color: "bg-[#003F72]", rolePrefix: "entity-admin" };
    if (path.includes("department")) return { role: "Department Admin", name: "Sarah Ibrahim", initials: "SI", color: "bg-[#666666]", rolePrefix: "department" };
    if (path.includes("monitoring")) return { role: "Internal Monitoring", name: "Ali Mansoor", initials: "AM", color: "bg-[#B0AAA2]", rolePrefix: "monitoring" };
    return { role: "Organization User", name: "Khalid Ahmed", initials: "KA", color: "bg-[#252628]", rolePrefix: "user" };
  };

  const roleInfo = getRoleInfo();

  // Handle selecting a suggestion
  const handleSelectSuggestion = (suggestion: {type: string; data: any}) => {
    setSearchQuery('');
    setShowSuggestions(false);
    navigate(`/dashboard/${roleInfo.rolePrefix}${suggestion.data.path}`);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="h-screen flex overflow-hidden bg-[#F5F7FA] relative">
      {/* Mobile Sidebar Overlay/Backdrop */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[40] transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          ${isMobile ? 'fixed inset-y-0 left-0 z-[50] shadow-2xl' : 'relative'}
          ${sidebarOpen ? (isMobile ? 'w-72 translate-x-0' : 'w-72') : (isMobile ? 'w-72 -translate-x-full' : 'w-20')} 
          bg-gradient-to-b from-[#252628] to-[#003F72] 
          text-white transition-all duration-300 flex flex-col
        `}
      >
        {/* Sidebar Header */}
        <div className="p-6">
          <div className="flex items-center justify-center px-4">
            <img 
              src={bahrainCoatOfArms} 
              alt="Kingdom of Bahrain Coat of Arms" 
              className={`${sidebarOpen ? 'w-44 h-44' : 'w-22 h-22'} object-contain transition-all duration-300`}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => {
              // Show Organizations only for Super Admin and Reviewer
              if (item.label === "Organizations" && roleInfo.rolePrefix !== "super-admin" && roleInfo.rolePrefix !== "reviewer") {
                return null;
              }
              // Hide Departments for Department Admin role
              if (item.label === "Departments" && roleInfo.rolePrefix === "department") {
                return null;
              }
              const Icon = item.icon;
              // Use role-specific dashboard path for the Dashboard menu item
              const navPath = item.path === "" ? `/dashboard/${roleInfo.rolePrefix}` : `/dashboard/${roleInfo.rolePrefix}${item.path}`;
              const isActive = location.pathname === navPath || 
                             (item.path === "" && location.pathname.match(/\/dashboard\/(user|department|entity-admin|super-admin|monitoring)$/));
              
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(navPath)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300
                    ${isActive 
                      ? 'bg-[#EF4444] text-white shadow-lg shadow-[#EF4444]/30' 
                      : 'text-white/70 hover:bg-white/10 hover:text-white hover:translate-x-1'
                    }
                  `}
                >
                  <div className="flex items-center justify-center w-6 h-6 flex-shrink-0">
                    <Icon 
                      className={`
                        ${isActive ? 'w-6 h-6' : 'w-5 h-5'}
                        transition-all duration-300
                      `}
                      strokeWidth={isActive ? 2.5 : 2}
                      fill="none"
                    />
                  </div>
                  {sidebarOpen && (
                    <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                      {item.label}
                    </span>
                  )}
                  {sidebarOpen && isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 space-y-4">
          {/* Logout Button */}
          <Button
            onClick={handleLogout}
            variant="outline"
            className={`
              w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
              bg-transparent border border-white/30 text-white/80 hover:bg-white/10 hover:text-white hover:border-white/50
              ${!sidebarOpen && 'justify-center'}
            `}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="text-sm">Logout</span>}
          </Button>
          
          {sidebarOpen && (
            <div className="text-xs text-white/40 text-center">
              Kingdom of Bahrain
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-14 md:h-20 bg-gradient-to-r from-[#252628] to-[#003F72] flex items-center justify-between px-3 md:px-8 relative overflow-hidden shrink-0">
          {/* Mobile Menu Toggle */}
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mr-2 text-white hover:bg-white/10 z-[1001]"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          )}
          {/* Decorative Merged Shape Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-5">
            <div
              style={{
                position: 'absolute',
                right: -80,
                top: -50,
                width: 300,
                height: 210,
              }}
            >
              {/* Shape 1 - Rounded Rectangle */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 150,
                  height: 210,
                  backgroundColor: '#ffffff',
                  borderRadius: '24px 24px 24px 24px',
                }}
              />
              {/* Shape 2 - Right Panel */}
              <div
                style={{
                  position: 'absolute',
                  left: 150,
                  top: 37.5,
                  width: 150,
                  height: 105,
                  backgroundColor: '#ffffff',
                  borderRadius: '0px 24px 24px 0px',
                }}
              />
              {/* Bridge 1 - Top Curve */}
              <svg
                style={{
                  position: 'absolute',
                  left: 150,
                  top: 13.5,
                  width: 24,
                  height: 24,
                  pointerEvents: 'none',
                }}
                viewBox="0 0 32 32"
              >
                <path d="M 0 0 C 0 23.872 5.76 32 32 32 H 0 Z" fill="#ffffff" />
              </svg>
              {/* Bridge 2 - Bottom Curve */}
              <svg
                style={{
                  position: 'absolute',
                  left: 150,
                  top: 142.5,
                  width: 24,
                  height: 24,
                  pointerEvents: 'none',
                }}
                viewBox="0 -32 32 32"
              >
                <path d="M 0 0 C 0 -23.872 5.76 -32 32 -32 H 0 Z" fill="#ffffff" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-6 flex-1 relative z-[1000]">
            {['super-admin', 'reviewer', 'entity-admin', 'department'].includes(roleInfo.rolePrefix) ? (
              <div className="flex flex-col justify-center ml-2">
                {roleInfo.rolePrefix === 'super-admin' ? (
                  <h1 className="text-[14px] sm:text-[16px] md:text-[18px] font-bold text-white truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">BSDI Management Console</h1>
                ) : roleInfo.rolePrefix === 'reviewer' ? (
                  <h1 className="text-[14px] sm:text-[16px] md:text-[18px] font-bold text-white truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">BSDI Review Module</h1>
                ) : roleInfo.rolePrefix === 'entity-admin' ? (
                  <h1 className="text-[14px] sm:text-[16px] md:text-[18px] font-bold text-white truncate max-w-[120px] sm:max-w-[200px] md:max-w-none">Ministry of Works</h1>
                ) : roleInfo.rolePrefix === 'department' ? (
                  <div className="flex flex-col min-w-0">
                    <h1 className="text-[14px] sm:text-[16px] md:text-[18px] font-bold text-white truncate">Ministry of Works</h1>
                    <p className="text-[10px] md:text-[13px] font-normal text-[#D1D5DB] mt-0.5 truncate">Urban Planning Department</p>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="relative max-w-md w-full" ref={searchRef}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
                <Input
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => searchQuery && setShowSuggestions(true)}
                  placeholder="Search organizations, users, requests..."
                  className="pl-10 bg-white/10 border-white/20 rounded-xl h-11 text-white placeholder:text-white/50 focus:bg-white/15"
                />
                {showSuggestions && searchSuggestions.length > 0 && (
                  <div 
                    className="fixed bg-white border border-[#E0E0E0] rounded-xl shadow-2xl z-[99999] max-h-96 overflow-y-auto" 
                    style={{ 
                      top: `${dropdownPosition.top}px`, 
                      left: `${dropdownPosition.left}px`,
                      width: `${dropdownPosition.width}px`
                    }}
                  >
                    {searchSuggestions.map((suggestion, index) => {
                      // Determine icon based on type
                      const getIcon = () => {
                        switch (suggestion.type) {
                          case 'organization': return Building2;
                          case 'department': return Network;
                          case 'user': return Users;
                          case 'request': return FileBarChart;
                          case 'role': return ShieldCheck;
                          case 'permission': return Lock;
                          case 'service': return Orbit;
                          default: return FileText;
                        }
                      };
                      
                      const Icon = getIcon();
                      
                      // Determine badge label and color
                      const getBadgeInfo = () => {
                        switch (suggestion.type) {
                          case 'organization': return { label: 'Org', color: 'bg-[#003F72] text-white' };
                          case 'department': return { label: 'Dept', color: 'bg-[#666666] text-white' };
                          case 'user': return { label: 'User', color: 'bg-[#666666] text-white' };
                          case 'request': return { label: 'Request', color: 'bg-[#EF4444] text-white' };
                          case 'role': return { label: 'Role', color: 'bg-purple-600 text-white' };
                          case 'permission': return { label: 'Permission', color: 'bg-amber-600 text-white' };
                          case 'service': return { label: 'Service', color: 'bg-indigo-600 text-white' };
                          default: return { label: 'Item', color: 'bg-gray-600 text-white' };
                        }
                      };
                      
                      const badgeInfo = getBadgeInfo();
                      
                      // Determine subtitle text
                      const getSubtitle = () => {
                        switch (suggestion.type) {
                          case 'organization':
                            return `${suggestion.data.type} • ${suggestion.data.status}`;
                          case 'department':
                            return suggestion.data.organization;
                          case 'user':
                            return `${suggestion.data.email} • ${suggestion.data.role}`;
                          case 'request':
                            return `${suggestion.data.organization} • ${suggestion.data.type}`;
                          case 'role':
                            return `${suggestion.data.permissions} permissions • ${suggestion.data.users} users`;
                          case 'permission':
                            return `${suggestion.data.module} Module`;
                          case 'service':
                            return `${suggestion.data.type} • ${suggestion.data.status}`;
                          default:
                            return '';
                        }
                      };
                      
                      return (
                        <button
                          key={`${suggestion.type}-${suggestion.data.id}`}
                          onClick={() => handleSelectSuggestion(suggestion)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4 text-[#ED1C24] flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-[#1a1a1a] truncate">
                                {suggestion.data.name || suggestion.data.title}
                              </p>
                              <p className="text-xs text-[#666666] truncate">
                                {getSubtitle()}
                              </p>
                            </div>
                            <Badge 
                              className={`text-xs ${badgeInfo.color} flex-shrink-0`}
                            >
                              {badgeInfo.label}
                            </Badge>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Notifications */}
            <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="relative hover:bg-white/10 rounded-xl text-white"
                >
                  <Bell className="w-5 h-5" />
                  {notifications.filter(n => n.unread).length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full"></span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent 
                className="w-[420px] p-0 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20"
                align="end"
                sideOffset={12}
              >
                {/* Header */}
                <div className="px-5 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#1A1A1A]">Notifications</h3>
                    <Badge className="bg-[#EF4444] text-white text-xs px-2 py-1">
                      {notifications.filter(n => n.unread).length} New
                    </Badge>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-[480px] overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <button
                      key={notification.id}
                      onClick={() => {
                        setNotificationsOpen(false);
                        navigate(`/dashboard/${roleInfo.rolePrefix}/data-requests1?notificationId=${notification.requestId}&tab=${notification.tab}&status=${notification.status}`);
                      }}
                      className={`
                        w-full px-5 py-4 text-left transition-all duration-200
                        ${notification.unread ? 'bg-red-50/50' : 'bg-white'}
                        hover:bg-gray-50 border-b border-gray-100 last:border-b-0
                        ${index === 0 ? '' : ''}
                      `}
                    >
                      <div className="flex items-start gap-3">
                        {/* Unread Dot Indicator */}
                        {notification.unread && (
                          <div className="mt-1.5 w-2 h-2 bg-[#ED1C24] rounded-full flex-shrink-0"></div>
                        )}
                        
                        <div className="flex-1 min-w-0">
                          {/* Title */}
                          <h4 className={`text-sm mb-1 ${notification.unread ? 'font-bold text-[#1A1A1A]' : 'font-semibold text-[#4A4A4A]'}`}>
                            {notification.title}
                          </h4>
                          
                          {/* Description */}
                          <p className="text-xs text-[#6B6B6B] mb-2 line-clamp-2">
                            {notification.description}
                          </p>
                          
                          {/* Meta Info */}
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs text-[#003F72] font-medium">
                              {notification.organization}
                            </span>
                            <span className="text-xs text-[#999999]">
                              {notification.timestamp}
                            </span>
                            {notification.status === "pending" && (
                              <Badge className="bg-orange-100 text-orange-700 text-[10px] px-2 py-0.5 border-0">
                                Pending
                              </Badge>
                            )}
                            {notification.status === "completed" && (
                              <Badge className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 border-0">
                                Completed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t border-gray-200 bg-gray-50/50">
                  <button
                    onClick={() => navigate(`/dashboard/${roleInfo.rolePrefix}/data-requests1`)}
                    className="w-full text-center text-sm font-semibold text-[#EF4444] hover:text-[#DC2626] transition-colors"
                  >
                    View All Notifications
                  </button>
                </div>
              </PopoverContent>
            </Popover>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-4 border-l border-white/20">
              <Avatar className="h-8 w-8 md:h-9 md:w-9 border border-white/20 shadow-sm shrink-0">
                <AvatarFallback className={`${roleInfo.color} text-white text-[10px] md:text-xs font-bold`}>
                  {roleInfo.initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden lg:block">
                <p className="text-sm font-semibold text-white">{roleInfo.name}</p>
                <p className="text-[11px] font-medium text-white/70 tracking-wide uppercase mt-0.5">{roleInfo.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-[#F5F7FA]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}