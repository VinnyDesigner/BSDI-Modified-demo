import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { getStatusBadgeProps } from "../../lib/statusUtils";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "../../components/ui/alert-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../../components/ui/sheet";
import { 
  Building2, Plus, Search, Users, Calendar, CheckCircle, Clock, Edit, Trash2, Building, Mail, Phone, MapPin, Shield, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Filter, X, Landmark, Eye
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/PageHeader";
import { MetricCard } from "../../components/ui/MetricCard";

// Mock data for organization details
const organizationDetails: { [key: number]: { 
  departments: { id: number; name: string; head: string; users: number }[];
  users: { id: number; name: string; email: string; role: string; department: string }[];
  description: string;
  address: string;
  phone: string;
  email: string;
} } = {
  1: {
    description: "Ministry responsible for infrastructure development, urban planning, and public works across the Kingdom of Bahrain.",
    address: "Building 1234, Road 456, Block 789, Manama, Bahrain",
    phone: "+973 1234 5678",
    email: "info@mow.gov.bh",
    departments: [
      { id: 1, name: "Urban Planning", head: "Jawaher Rashed", users: 28 },
      { id: 2, name: "Infrastructure Development", head: "Lulwa Saad Mujaddam", users: 22 },
      { id: 3, name: "Road Maintenance", head: "Rana A.Majeed", users: 18 },
      { id: 4, name: "Building Control", head: "Muneera Khamis", users: 15 },
      { id: 5, name: "Project Management", head: "Mariam Rashed", users: 19 },
      { id: 6, name: "Engineering Services", head: "Muneera Khamis", users: 14 },
      { id: 7, name: "Quality Assurance", head: "Rana A.Majeed", users: 12 },
      { id: 8, name: "Technical Support", head: "Venkatesh Munusamy", users: 14 },
    ],
    users: [
      { id: 1, name: "Jawaher Rashed", email: "jawaher.albufalah@iga.gov.bh", role: "Department Head", department: "Urban Planning" },
      { id: 2, name: "Lulwa Saad Mujaddam", email: "s.mohammed@mow.gov.bh", role: "Department Head", department: "Infrastructure Development" },
      { id: 3, name: "Rana A.Majeed", email: "k.ali@mow.gov.bh", role: "Department Head", department: "Road Maintenance" },
      { id: 4, name: "Muneera Khamis", email: "f.hassan@mow.gov.bh", role: "Department Head", department: "Building Control" },
      { id: 5, name: "Mariam Rashed", email: "m.ahmed@mow.gov.bh", role: "Department Head", department: "Project Management" },
      { id: 6, name: "Muneera Khamis", email: "n.almansoori@mow.gov.bh", role: "Department Head", department: "Engineering Services" },
      { id: 7, name: "Rana A.Majeed", email: "h.ibrahim@mow.gov.bh", role: "Department Head", department: "Quality Assurance" },
      { id: 8, name: "Venkatesh Munusamy", email: "m.ali@mow.gov.bh", role: "Department Head", department: "Technical Support" },
      { id: 9, name: "Ali Hussain", email: "a.hussain@mow.gov.bh", role: "Senior Engineer", department: "Urban Planning" },
      { id: 10, name: "Venkatesh Munusamy", email: "l.abdullah@mow.gov.bh", role: "Project Manager", department: "Infrastructure Development" },
    ],
  },
  2: {
    description: "Authority responsible for strategic urban planning and development control across Bahrain.",
    address: "Building 567, Road 789, Block 123, Manama, Bahrain",
    phone: "+973 2345 6789",
    email: "info@upa.gov.bh",
    departments: [
      { id: 1, name: "Strategic Planning", head: "Lulwa Saad Mujaddam", users: 20 },
      { id: 2, name: "Development Control", head: "Omar Rashid", users: 18 },
      { id: 3, name: "GIS & Mapping", head: "Amina Khalil", users: 16 },
      { id: 4, name: "Policy Research", head: "Youssef Hassan", users: 14 },
      { id: 5, name: "Community Engagement", head: "Huda Ahmed", users: 15 },
      { id: 6, name: "Environmental Planning", head: "Tariq Saleh", users: 15 },
    ],
    users: [
      { id: 1, name: "Lulwa Saad Mujaddam", email: "s.mohammed@upa.gov.bh", role: "Director General", department: "Strategic Planning" },
      { id: 2, name: "Omar Rashid", email: "o.rashid@upa.gov.bh", role: "Department Head", department: "Development Control" },
      { id: 3, name: "Amina Khalil", email: "a.khalil@upa.gov.bh", role: "Department Head", department: "GIS & Mapping" },
      { id: 4, name: "Youssef Hassan", email: "y.hassan@upa.gov.bh", role: "Senior Analyst", department: "Policy Research" },
      { id: 5, name: "Huda Ahmed", email: "h.ahmed@upa.gov.bh", role: "Manager", department: "Community Engagement" },
    ],
  },
};

const organizations = [
  { 
    id: 1, 
    name: "Ministry of Works", 
    code: "MOW-2023-001",
    type: "Government", 
    sector: "Infrastructure",
    poc: "Jawaher Rashed", 
    departments: 8, 
    users: 142, 
    status: "active", 
    created: "2023-01-15",
    lastActive: "2024-03-04"
  },
  { 
    id: 2, 
    name: "Urban Planning Authority", 
    code: "UPA-2023-002",
    type: "Government", 
    sector: "Urban Development",
    poc: "Lulwa Saad Mujaddam", 
    departments: 6, 
    users: 98, 
    status: "active", 
    created: "2023-02-20",
    lastActive: "2024-03-03"
  },
  { 
    id: 3, 
    name: "Transport Authority", 
    code: "TRA-2023-003",
    type: "Semi-Government", 
    sector: "Transportation",
    poc: "Rana A.Majeed", 
    departments: 5, 
    users: 76, 
    status: "active", 
    created: "2023-03-10",
    lastActive: "2024-03-02"
  },
  { 
    id: 4, 
    name: "Environmental Agency", 
    code: "ENV-2023-004",
    type: "Government", 
    sector: "Environment",
    poc: "Muneera Khamis", 
    departments: 4, 
    users: 54, 
    status: "active", 
    created: "2023-04-05",
    lastActive: "2024-03-01"
  },
  { 
    id: 5, 
    name: "Digital Government", 
    code: "DIG-2024-005",
    type: "Government", 
    sector: "Technology",
    poc: "Mariam Rashed", 
    departments: 3, 
    users: 45, 
    status: "inactive", 
    created: "2024-03-01",
    lastActive: "2024-03-01"
  },
];

const workflowSteps = [
  { step: 1, title: "Create Organization", description: "Initialize organization structure", status: "completed" },
  { step: 2, title: "Assign Primary POC", description: "Designate point of contact", status: "completed" },
  { step: 3, title: "IGA Admin Approval", description: "BSDI governance review", status: "in_progress" },
  { step: 4, title: "Activate Organization", description: "Enable organization access", status: "pending" },
  { step: 5, title: "Record Audit Log", description: "Log creation event", status: "pending" },
];

export default function Organizations() {
  const navigate = useNavigate();
  const location = useLocation();
  const isReviewer = location.pathname.includes("/reviewer");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<typeof organizations>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [createOrgOpen, setCreateOrgOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [editOrgOpen, setEditOrgOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<typeof organizations[0] | null>(null);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [departmentsSheetOpen, setDepartmentsSheetOpen] = useState(false);
  const [usersSheetOpen, setUsersSheetOpen] = useState(false);
  const [selectedOrgForSheet, setSelectedOrgForSheet] = useState<typeof organizations[0] | null>(null);
  const [expandedDeptId, setExpandedDeptId] = useState<number | null>(null);
  
  // Confirmation states
  const [confirmCreateOpen, setConfirmCreateOpen] = useState(false);
  const [confirmUpdateOpen, setConfirmUpdateOpen] = useState(false);
  const [successUpdateOpen, setSuccessUpdateOpen] = useState(false);
  
  // Form fields
  const [orgNameEn, setOrgNameEn] = useState("");
  const [orgNameAr, setOrgNameAr] = useState("");
  const [pointOfContact, setPointOfContact] = useState("data_owner");
  const [businessDescription, setBusinessDescription] = useState("");
  const [isDataOwner, setIsDataOwner] = useState(false);
  const [isDataConsumer, setIsDataConsumer] = useState(false);
  const [isSuperUser, setIsSuperUser] = useState(false);
  
  // Function to clear form
  const clearForm = () => {
    setOrgNameEn("");
    setOrgNameAr("");
    setPointOfContact("data_owner");
    setBusinessDescription("");
    setIsDataOwner(false);
    setIsDataConsumer(false);
    setIsSuperUser(false);
  };
  
  // Function to handle form submission
  const handleSubmit = () => {
    setConfirmCreateOpen(true);
  };
  
  const executeCreate = () => {
    setConfirmCreateOpen(false);
    setCreateOrgOpen(false);
    clearForm();
    setSuccessDialogOpen(true);
  };
  
  const executeUpdate = () => {
    setConfirmUpdateOpen(false);
    setEditOrgOpen(false);
    setSuccessUpdateOpen(true);
  };
  
  // Function to navigate to data requests page
  const goToRequests = () => {
    setSuccessDialogOpen(false);
    // Determine the correct path based on current location
    const currentRole = location.pathname.split('/')[2]; // e.g., 'super-admin', 'entity-admin', etc.
    navigate(`/dashboard/${currentRole}/data-requests`);
  };
  
  // Table state
  const [tableSearch, setTableSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [organizationFilter, setOrganizationFilter] = useState("all");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [departmentsPopoverOrg, setDepartmentsPopoverOrg] = useState<number | null>(null);
  const [usersPopoverOrg, setUsersPopoverOrg] = useState<number | null>(null);
  const itemsPerPage = 5;

  // Handle search suggestions
  useEffect(() => {
    if (searchTerm.trim()) {
      const suggestions = organizations.filter(org =>
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.poc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.code.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5);
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Function to scroll to and highlight selected organization
  const handleSelectSuggestion = (org: typeof organizations[0]) => {
    setSearchTerm(org.name);
    setShowSuggestions(false);
    setTableSearch(org.name);
    
    // Reset filters and pagination to ensure item is visible
    setStatusFilter("all");
    setSectorFilter("all");
    setOrganizationFilter("all");
    setCurrentPage(1);
    
    // Scroll to the organization row in table
    setTimeout(() => {
      const row = document.getElementById(`org-row-${org.id}`);
      if (row) {
        row.scrollIntoView({ behavior: 'smooth', block: 'center' });
        row.classList.add('ring-2', 'ring-[#ED1C24]', 'ring-offset-2');
        setTimeout(() => {
          row.classList.remove('ring-2', 'ring-[#ED1C24]', 'ring-offset-2');
        }, 2000);
      }
    }, 100);
  };

  // Filter and sort data
  const filteredOrgs = organizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
                         org.poc.toLowerCase().includes(tableSearch.toLowerCase()) ||
                         org.code.toLowerCase().includes(tableSearch.toLowerCase());
    const matchesStatus = statusFilter === "all" || org.status === statusFilter;
    const matchesSector = sectorFilter === "all" || org.sector === sectorFilter;
    const matchesOrganization = organizationFilter === "all" || org.name === organizationFilter;
    return matchesSearch && matchesStatus && matchesSector && matchesOrganization;
  });

  const sortedOrgs = [...filteredOrgs].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn as keyof typeof a];
    const bVal = b[sortColumn as keyof typeof b];
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedOrgs.length / itemsPerPage);
  const paginatedOrgs = sortedOrgs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return null;
    return sortDirection === "asc" ? <ChevronUp className="w-4 h-4 inline ml-1" /> : <ChevronDown className="w-4 h-4 inline ml-1" />;
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-6 py-5">
      <div className="max-w-[1700px] mx-auto space-y-6">
        {/* Standardized Header */}
        <PageHeader 
          title="Organizations"
          description="Manage government and partner organizations"
        >
          <div className="flex items-center gap-3">
            {!isReviewer && (
              <Button
                className="gap-2"
                onClick={() => setCreateOrgOpen(true)}
              >
                <Plus className="w-4 h-4" />
                Create Organization
              </Button>
            )}
          </div>
        </PageHeader>
        {/* Standardized Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 org-metric-card-container">
          <style>{`.org-metric-card-container span { text-transform: capitalize !important; }`}</style>
          <MetricCard 
            value={organizations.length} 
            label="Total Organizations" 
            icon={<Building2 className="w-6 h-6" />} 
            variant="red" 
          />
          <MetricCard 
            value={organizations.filter(o => o.status === 'active').length} 
            label="Active Status" 
            icon={<CheckCircle className="w-6 h-6" />} 
            variant="green" 
          />
          <MetricCard 
            value="2,847" 
            label="Total Users" 
            icon={<Users className="w-6 h-6" />} 
            variant="blue" 
          />
          <MetricCard 
            value={organizations.filter(o => o.status === 'inactive').length} 
            label="Inactive" 
            icon={<Clock className="w-6 h-6" />} 
            variant="yellow" 
          />
        </div>

      {/* Standardized Create Organization Dialog */}
      <Dialog open={createOrgOpen} onOpenChange={setCreateOrgOpen}>
        <DialogContent className="w-[520px] max-w-[90vw] h-[500px] overflow-hidden bg-white rounded-[16px] border border-[#E5E7EB] shadow-2xl p-0 flex flex-col [&>button]:hidden">
          <div 
            className="absolute top-[16px] right-[16px] w-[32px] h-[32px] rounded-[8px] bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors z-50"
            onClick={() => setCreateOrgOpen(false)}
          >
            <X className="w-4 h-4 text-[#6B7280]" />
          </div>
          <DialogHeader className="sticky top-0 bg-white z-10 pt-[20px] px-[20px] pb-[12px] border-b border-[#E5E7EB] shrink-0 pr-[64px]">
            <DialogTitle className="text-[18px] font-semibold text-[#EF4444]">Create Organization</DialogTitle>
            <DialogDescription className="text-[#6B7280] text-[14px] font-normal mt-1 leading-tight">
              Add and register new organizational entities
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto px-[20px] py-[16px] flex-1 custom-scrollbar">
            <div className="flex flex-col gap-[16px]">
              {/* Organization Name - English */}
              <div className="space-y-2">
                <Label className="text-[#374151] font-medium text-[13px]">
                  Organization Name (English) <span className="text-[#EF4444]">*</span>
                </Label>
                <Input 
                  className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] font-normal text-[#111827] focus:border-[#EF4444] transition-all"
                  placeholder="e.g. Ministry of Interior"
                  value={orgNameEn}
                  onChange={(e) => setOrgNameEn(e.target.value)}
                />
              </div>

              {/* Organization Name - Arabic */}
              <div className="space-y-2">
                <Label className="text-[#374151] font-medium text-[13px]">
                  Organization Name (Arabic) <span className="text-[#EF4444]">*</span>
                </Label>
                <Input 
                  className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] font-normal text-[#111827] focus:border-[#EF4444] transition-all"
                  placeholder="اسم المنظمة"
                  dir="rtl"
                  value={orgNameAr}
                  onChange={(e) => setOrgNameAr(e.target.value)}
                />
              </div>

              {/* Organization Type */}
              <div className="space-y-3">
                <Label className="text-[#374151] font-medium text-[13px]">Organization Role</Label>
                <div className="flex items-center gap-8 bg-[#F9FAFB] p-4 rounded-xl border border-[#F3F4F6]">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="dataOwner"
                      checked={isDataOwner}
                      onCheckedChange={(checked) => setIsDataOwner(checked as boolean)}
                      className="border-[#D1D5DB] data-[state=checked]:bg-[#EF4444] data-[state=checked]:border-[#EF4444]"
                    />
                    <label htmlFor="dataOwner" className="text-[13px] font-medium text-[#4B5563] cursor-pointer">Data Owner</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="dataConsumer"
                      checked={isDataConsumer}
                      onCheckedChange={(checked) => setIsDataConsumer(checked as boolean)}
                      className="border-[#D1D5DB] data-[state=checked]:bg-[#EF4444] data-[state=checked]:border-[#EF4444]"
                    />
                    <label htmlFor="dataConsumer" className="text-[13px] font-medium text-[#4B5563] cursor-pointer">Data Consumer</label>
                  </div>
                </div>
              </div>

              {/* Point of Contact */}
              <div className="space-y-2">
                <Label className="text-[#374151] font-medium text-[13px]">Point of Contact</Label>
                <Select defaultValue={pointOfContact} onValueChange={setPointOfContact}>
                  <SelectTrigger className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] font-normal text-[#111827] focus:border-[#EF4444] transition-all">
                    <SelectValue placeholder="Select contact person" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jawaher_rashed" className="font-normal text-[14px]">Jawaher Rashed</SelectItem>
                    <SelectItem value="sara_mohammed" className="font-normal text-[14px]">Lulwa Saad Mujaddam</SelectItem>
                    <SelectItem value="khalid_ali" className="font-normal text-[14px]">Rana A.Majeed</SelectItem>
                    <SelectItem value="maryam_ali" className="font-normal text-[14px]">Venkatesh Munusamy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Business Description */}
              <div className="space-y-2">
                <Label className="text-[#374151] font-medium text-[13px]">Business Description</Label>
                <Textarea 
                  className="rounded-[10px] border border-[#E5E7EB] bg-white p-[12px] text-[14px] font-normal min-h-[100px] text-[#111827] focus:border-[#EF4444] transition-all resize-none"
                  placeholder="Provide a brief description of the organization's core activities..."
                  value={businessDescription}
                  onChange={(e) => setBusinessDescription(e.target.value)}
                />
              </div>

            </div>
          </div>

          <div className="sticky bottom-0 bg-white z-10 py-[16px] px-[30px] border-t border-[#E5E7EB] shrink-0 flex justify-end gap-[12px] mt-auto">
            <Button 
              variant="outline" 
              onClick={() => setCreateOrgOpen(false)}
              className="w-[140px] h-[40px] rounded-[10px]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="w-[180px] shadow-md h-[40px] rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white"
            >
              Create Organization
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Standardized View Details Dialog */}
      <Dialog open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <DialogContent className="w-[600px] max-w-[90vw] h-[500px] overflow-hidden bg-white rounded-[16px] border border-[#E5E7EB] shadow-2xl p-0 flex flex-col [&>button]:hidden">
          <div 
            className="absolute top-[16px] right-[16px] w-[32px] h-[32px] rounded-[8px] bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors z-50"
            onClick={() => setViewDetailsOpen(false)}
          >
            <X className="w-4 h-4 text-[#6B7280]" />
          </div>
          <DialogHeader className="sticky top-0 bg-white z-20 pt-[20px] px-[24px] pb-[6px] shrink-0 pr-[64px]">
            <DialogTitle className="text-[18px] font-semibold text-[#EF4444]">
              Organization Details: <span className="text-[#EF4444] font-semibold">{selectedOrg?.name}</span>
            </DialogTitle>
            <DialogDescription className="text-[#6B7280] text-[14px] mt-1 mb-[6px] leading-tight">
              Comprehensive overview of the selected organization's profiles and team
            </DialogDescription>
          </DialogHeader>
          
          <div className="overflow-y-auto flex-1 custom-scrollbar bg-white">
            {selectedOrg && (
              <Tabs defaultValue="overview" className="w-full h-full flex flex-col">
                <div className="sticky top-0 z-10 bg-white pb-[12px] pt-[8px] px-[24px] border-b border-[#F3F4F6]">
                  <TabsList className="inline-flex gap-[8px] items-center bg-transparent p-0">
                    <TabsTrigger 
                      value="overview" 
                      className="h-[36px] px-[16px] rounded-[10px] text-[13px] font-medium border transition-all duration-200 bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-[#F9FAFB] hover:text-[#111827] data-[state=active]:bg-[#EF4444] data-[state=active]:text-white data-[state=active]:border-transparent data-[state=active]:font-medium"
                    >
                      Overview
                    </TabsTrigger>
                    <TabsTrigger 
                      value="departments" 
                      className="h-[36px] px-[16px] rounded-[10px] text-[13px] font-medium border transition-all duration-200 bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-[#F9FAFB] hover:text-[#111827] data-[state=active]:bg-[#EF4444] data-[state=active]:text-white data-[state=active]:border-transparent data-[state=active]:font-medium"
                    >
                      Departments ({selectedOrg.departments})
                    </TabsTrigger>
                    <TabsTrigger 
                      value="users" 
                      className="h-[36px] px-[16px] rounded-[10px] text-[13px] font-medium border transition-all duration-200 bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-[#F9FAFB] hover:text-[#111827] data-[state=active]:bg-[#EF4444] data-[state=active]:text-white data-[state=active]:border-transparent data-[state=active]:font-medium"
                    >
                      Users ({selectedOrg.users})
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="px-[24px] py-[20px]">
                  {/* Overview Tab Content */}
                  <TabsContent value="overview" className="space-y-8 mt-0 outline-none">
                  <div className="grid grid-cols-2 gap-x-[24px] gap-y-[16px]">
                    <div className="flex flex-col gap-[4px]">
                      <span className="text-[12px] text-[#6B7280] font-normal">Organization Name</span>
                      <span className="text-[14px] text-[#111827] font-semibold">{selectedOrg.name}</span>
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <span className="text-[12px] text-[#6B7280] font-normal">Type</span>
                      <span className="text-[14px] text-[#111827] font-semibold">{selectedOrg.type}</span>
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <span className="text-[12px] text-[#6B7280] font-normal">Point Of Contact</span>
                      <span className="text-[14px] text-[#111827] font-semibold">{selectedOrg.poc}</span>
                    </div>
                    <div className="flex flex-col gap-[4px] items-start">
                      <span className="text-[12px] text-[#6B7280] font-normal">Status</span>
                      <Badge variant={getStatusBadgeProps(selectedOrg.status).variant}>
                        {getStatusBadgeProps(selectedOrg.status).label}
                      </Badge>
                    </div>
                    <div className="flex flex-col gap-[4px]">
                      <span className="text-[12px] text-[#6B7280] font-normal">Created Date</span>
                      <span className="text-[14px] text-[#111827] font-semibold">{selectedOrg.created}</span>
                    </div>
                  </div>
                  
                  {organizationDetails[selectedOrg.id] && (
                    <div className="space-y-6 pt-4 border-t border-[#F1F5F9]">
                      <div className="flex flex-col gap-[8px]">
                        <span className="text-[12px] text-[#6B7280] font-normal">Description</span>
                        <p className="text-[14px] text-[#111827] font-medium leading-[1.5] m-0">
                          {organizationDetails[selectedOrg.id].description}
                        </p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                {/* Departments Tab Content */}
                <TabsContent value="departments" className="mt-0 outline-none">
                  {organizationDetails[selectedOrg.id]?.departments ? (
                    <div className="flex flex-col gap-[12px] max-h-[420px] overflow-y-auto pr-[6px] custom-scrollbar">
                      <Accordion type="single" collapsible className="flex flex-col gap-[12px] pb-[12px]">
                        {organizationDetails[selectedOrg.id].departments.map((dept) => (
                          <AccordionItem 
                            key={dept.id} 
                            value={`dept-${dept.id}`}
                            className="relative z-1 bg-[#FFFFFF] border border-[#E5E7EB] rounded-[12px] overflow-hidden"
                          >
                            <AccordionTrigger className="px-[16px] py-[14px] hover:no-underline hover:bg-gray-50/50 transition-colors">
                            <div className="flex items-center justify-between w-full pr-[16px]">
                              <div className="flex flex-col gap-[4px] text-left">
                                <h4 className="text-[15px] font-semibold text-[#111827]">{dept.name}</h4>
                                <p className="text-[13px] text-[#6B7280]">Head: {dept.head}</p>
                              </div>
                              <div className="flex items-center gap-[8px]">
                                <span className="inline-flex items-center justify-center px-[10px] py-[4px] text-[12px] font-medium text-[#326594] bg-[#E6F0FA] rounded-[999px] min-w-[36px]">
                                  {dept.users} Users
                                </span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-[16px] pb-[16px]">
                            <div className="pt-[16px] border-t border-[#F3F4F6] grid grid-cols-2 gap-[12px]">
                              <div className="flex flex-col gap-[4px]">
                                <span className="text-[12px] text-[#6B7280] font-medium uppercase tracking-wider">Department Head</span>
                                <span className="text-[14px] text-[#111827] font-medium">{dept.head}</span>
                              </div>
                              <div className="flex flex-col gap-[4px]">
                                <span className="text-[12px] text-[#6B7280] font-medium uppercase tracking-wider">Team Size</span>
                                <span className="text-[14px] text-[#111827] font-medium">{dept.users} users</span>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                      </Accordion>
                    </div>
                  ) : (
                    <div className="bg-[#F9FAFB] border border-dashed border-[#E5E7EB] rounded-[12px] p-8 text-center text-[#6B7280] text-[13px]">
                      No detailed department information available
                    </div>
                  )}
                </TabsContent>

                {/* Users Tab Content */}
                <TabsContent value="users" className="space-y-4 mt-0 outline-none">
                  <div className="flex items-center justify-between mb-2 px-2">
                    <Label className="text-[#374151] font-semibold text-sm">Registered Users ({selectedOrg.users})</Label>
                  </div>
                  {organizationDetails[selectedOrg.id]?.users ? (
                    <div className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {organizationDetails[selectedOrg.id].users.map((user) => (
                        <div key={user.id} className="bg-white border border-[#E5E7EB] rounded-xl p-4 flex items-center justify-between hover:border-[#EF4444]/30 transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#EF4444]/5 flex items-center justify-center border border-[#EF4444]/10 group-hover:bg-[#EF4444]/10 transition-colors">
                              <Users className="w-5 h-5 text-[#EF4444]" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-[#111827]">{user.name}</h4>
                              <p className="text-xs text-[#6B7280]">{user.email}</p>
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-[4px]">
                            <span className="inline-flex items-center justify-center px-[10px] py-[4px] text-[10px] font-bold tracking-wider uppercase text-[#326594] bg-[#E6F0FA] rounded-[999px] min-w-[36px]">
                              {user.role}
                            </span>
                            <p className="text-[12px] text-[#6B7280] font-medium">{user.department}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-[#F9FAFB] border border-dashed border-[#D1D5DB] rounded-xl p-8 text-center">
                      <p className="text-[#6B7280] text-sm">No user information available for this organization.</p>
                    </div>
                  )}
                </TabsContent>
                </div>
              </Tabs>
            )}
          </div>

          <div className="sticky bottom-0 bg-white z-20 py-[16px] px-[24px] border-t border-[#E5E7EB] shrink-0 flex justify-end gap-[12px] mt-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <Button 
              className="h-[36px] px-[16px] rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium border-0 shadow-sm"
              onClick={() => setViewDetailsOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Standardized Edit Organization Dialog */}
      <Dialog open={editOrgOpen} onOpenChange={setEditOrgOpen}>
        <DialogContent className="w-[520px] max-w-[90vw] h-[500px] overflow-hidden bg-white rounded-[16px] border border-[#E5E7EB] shadow-2xl p-0 flex flex-col [&>button]:hidden">
          <div 
            className="absolute top-[16px] right-[16px] w-[32px] h-[32px] rounded-[8px] bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors z-50"
            onClick={() => setEditOrgOpen(false)}
          >
            <X className="w-4 h-4 text-[#6B7280]" />
          </div>
          <DialogHeader className="sticky top-0 bg-white z-10 pt-[20px] px-[20px] pb-[12px] border-b border-[#E5E7EB] shrink-0 pr-[64px]">
            <DialogTitle className="text-[18px] font-semibold text-[#EF4444]">
              Edit Organization
            </DialogTitle>
            <DialogDescription className="text-[#6B7280] text-[14px] mt-1 font-normal leading-tight">
              Modify existing organization profiles and settings
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto px-[20px] py-[16px] flex-1 custom-scrollbar">
            {selectedOrg && (
              <div className="flex flex-col gap-[16px]">
                <div className="space-y-2">
                  <Label className="text-[#374151] font-medium text-[13px]">
                    Organization Name (English) <span className="text-[#EF4444]">*</span>
                  </Label>
                  <Input
                    className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] font-normal text-[#111827] focus:border-[#EF4444] transition-all"
                    defaultValue={selectedOrg.name}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[#374151] font-medium text-[13px]">
                    Organization Name (Arabic) <span className="text-[#EF4444]">*</span>
                  </Label>
                  <Input
                    className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] font-normal text-[#111827] focus:border-[#EF4444] transition-all"
                    placeholder="اسم المنظمة بالعربية"
                    dir="rtl"
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-[#374151] font-medium text-[13px]">Organization Role</Label>
                  <div className="flex items-center gap-8 bg-[#F9FAFB] p-4 rounded-xl border border-[#F3F4F6]">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="editDataOwner"
                        defaultChecked={true}
                        className="border-[#D1D5DB] data-[state=checked]:bg-[#EF4444] data-[state=checked]:border-[#EF4444]"
                      />
                      <label htmlFor="editDataOwner" className="text-[13px] font-medium text-[#4B5563] cursor-pointer">Data Owner</label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id="editDataConsumer"
                        defaultChecked={false}
                        className="border-[#D1D5DB] data-[state=checked]:bg-[#EF4444] data-[state=checked]:border-[#EF4444]"
                      />
                      <label htmlFor="editDataConsumer" className="text-[13px] font-medium text-[#4B5563] cursor-pointer">Data Consumer</label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#374151] font-medium text-[13px]">
                    Point of Contact <span className="text-[#EF4444]">*</span>
                  </Label>
                  <Select defaultValue="user1">
                    <SelectTrigger className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] font-normal text-[#111827] focus:border-[#EF4444] transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user1" className="font-normal text-[14px]">{selectedOrg.poc}</SelectItem>
                      <SelectItem value="user2" className="font-normal text-[14px]">Jawaher Rashed</SelectItem>
                      <SelectItem value="user3" className="font-normal text-[14px]">Lulwa Saad Mujaddam</SelectItem>
                      <SelectItem value="user4" className="font-normal text-[14px]">Rana A.Majeed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#374151] font-medium text-[13px]">Status</Label>
                  <Select defaultValue={selectedOrg.status}>
                    <SelectTrigger className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] font-normal text-[#111827] focus:border-[#EF4444] transition-all">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active" className="font-normal text-[14px]">Active</SelectItem>
                      <SelectItem value="inactive" className="font-normal text-[14px]">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-[#374151] font-medium text-[13px]">Business Description</Label>
                  <Textarea
                    className="rounded-[10px] border border-[#E5E7EB] bg-white p-[12px] text-[14px] font-normal min-h-[100px] text-[#111827] focus:border-[#EF4444] transition-all resize-none"
                    defaultValue={organizationDetails[selectedOrg.id]?.description || ""}
                  />
                </div>

              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-white z-10 py-[16px] px-[30px] border-t border-[#E5E7EB] shrink-0 flex justify-end gap-[12px] mt-auto">
            <Button variant="outline" onClick={() => setEditOrgOpen(false)} className="w-[140px] h-[40px] rounded-[10px]">
              Cancel
            </Button>
            <Button onClick={() => setConfirmUpdateOpen(true)} className="w-[180px] shadow-md h-[40px] rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white">
              Update Organization
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Standardized Create Confirmation Dialog */}
      {/* Standardized Create Confirmation Dialog */}
      <AlertDialog open={confirmCreateOpen} onOpenChange={setConfirmCreateOpen}>
        <AlertDialogContent className="w-[420px] max-w-[90vw] p-[24px] rounded-[16px] bg-white border border-[#E5E7EB] shadow-2xl gap-0">
          <AlertDialogHeader className="space-y-0 p-0 text-center">
            <div className="mx-auto flex w-[64px] h-[64px] items-center justify-center rounded-full bg-[#EF4444]/10 mb-[12px]">
              <Building2 className="w-[32px] h-[32px] text-[#EF4444]" />
            </div>
            <AlertDialogTitle className="text-[18px] font-semibold text-center text-[#111827] mb-[8px]">
              Create Organization
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-[14px] text-[#6B7280] leading-relaxed mb-[20px]">
              Are you sure you want to create this new organization? This action will register the entity in the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row justify-center gap-[12px] mt-0 sm:justify-center w-full sm:space-x-0">
            <AlertDialogCancel className="flex-1 h-[36px] px-[16px] border border-[#E5E7EB] text-[#374151] hover:bg-gray-50 bg-white rounded-[10px] m-0 font-medium">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeCreate}
              className="flex-1 h-[36px] px-[16px] bg-[#EF4444] hover:bg-[#DC2626] text-white border-0 rounded-[10px] m-0 font-medium"
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Standardized Success Dialog */}
      {/* Standardized Success Dialog */}
      <AlertDialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
        <AlertDialogContent className="w-[420px] max-w-[90vw] p-[24px] rounded-[16px] bg-white border border-[#E5E7EB] shadow-2xl gap-0">
          <AlertDialogHeader className="space-y-0 p-0 text-center">
            <div className="mx-auto flex w-[64px] h-[64px] items-center justify-center rounded-full bg-[#ECFDF5] mb-[12px]">
              <CheckCircle className="w-[32px] h-[32px] text-[#10B981]" />
            </div>
            <AlertDialogTitle className="text-[18px] font-semibold text-center text-[#111827] mb-[8px]">
              Organization Registered
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-[14px] text-[#6B7280] leading-relaxed mb-[20px]">
              The organization has been successfully registered and is now pending final review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row justify-center gap-[12px] mt-0 sm:justify-center w-full sm:space-x-0">
            <AlertDialogCancel 
              onClick={() => setSuccessDialogOpen(false)}
              className="flex-1 h-[36px] px-[16px] border border-[#E5E7EB] text-[#374151] hover:bg-gray-50 bg-white rounded-[10px] m-0 font-medium"
            >
              Dismiss
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={goToRequests}
              className="flex-1 h-[36px] px-[16px] bg-[#EF4444] hover:bg-[#DC2626] text-white border-0 rounded-[10px] m-0 font-medium"
            >
              View Requests
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Standardized Update Confirmation Dialog */}
      <AlertDialog open={confirmUpdateOpen} onOpenChange={setConfirmUpdateOpen}>
        <AlertDialogContent className="max-w-[400px] p-8 rounded-2xl bg-white border border-[#E5E7EB] shadow-2xl">
          <AlertDialogHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-[#EF4444]/10 flex items-center justify-center">
              <Edit className="w-8 h-8 text-[#EF4444]" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-center text-[#111827]">
              Update Organization
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-[#6B7280] text-sm leading-relaxed">
              Are you sure you want to save these changes? This will update the organization profile immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3 sm:justify-center mt-8">
            <AlertDialogCancel className="flex-1 h-10 border-[#E5E7EB] text-[#374151] hover:bg-gray-50 rounded-xl">
              Discard Changes
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={executeUpdate}
              className="flex-1 h-10 bg-[#EF4444] hover:bg-[#DC2626] text-white border-0 rounded-xl"
            >
              Save Updates
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Update Success Dialog */}
      <AlertDialog open={successUpdateOpen} onOpenChange={setSuccessUpdateOpen}>
        <AlertDialogContent className="max-w-[400px] p-6 rounded-3xl">
          <AlertDialogHeader className="space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full animate-ping bg-emerald-50" />
              <CheckCircle className="w-8 h-8 text-emerald-600 relative z-10" />
            </div>
            <AlertDialogTitle className="text-2xl font-semibold text-center text-[#1A1A1A]">
              Successfully Updated
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-[#666666] text-sm">
              The organization details have been updated successfully.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-col gap-3 mt-6 sm:flex-col">
            <AlertDialogCancel className="w-full h-12 rounded-xl border-[#E0E0E0] text-[#666666] hover:bg-gray-50 m-0">
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Standardized Organizations Directory Table Container */}
      <Card className="bg-white border border-[#E5E7EB] rounded-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] overflow-hidden mt-8" style={{ padding: '20px 24px 24px' }}>
        {/* Table Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-[#111827]">Organizations Directory</h3>
            <p className="text-sm text-[#6B7280]">Manage and monitor all registered entities</p>
          </div>
          
          <div className="flex items-center gap-[12px]">
            <div className="relative" ref={searchRef}>
              <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
              <Input
                className="pl-[36px] pr-[12px] h-[36px] w-[240px] border border-[#E5E7EB] bg-[#F9FAFB] rounded-[10px] text-[14px] focus:border-[#EF4444] transition-all"
                placeholder="Search organization"
                value={tableSearch}
                onChange={(e) => {
                  setTableSearch(e.target.value);
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
              />
            </div>

            <Select value={organizationFilter} onValueChange={setOrganizationFilter}>
              <SelectTrigger className="w-[180px] h-[36px] border border-[#E5E7EB] bg-white rounded-[10px] px-[12px] text-[14px]">
                <SelectValue placeholder="Organization" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Organization</SelectItem>
                {organizations.map(org => (
                  <SelectItem key={org.id} value={org.name}>{org.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] h-[36px] border border-[#E5E7EB] bg-white rounded-[10px] px-[12px] text-[14px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Standardized Table Headers */}
        <div className="overflow-x-auto border border-[#F1F1F1] rounded-[12px] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FAFAFA] border-b border-[#E5E7EB]">
                <th 
                  onClick={() => handleSort("name")}
                  className="text-left px-6 py-4 text-[13px] font-semibold text-[#374151] cursor-pointer hover:text-[#EF4444] transition-colors"
                >
                  Organization Name {getSortIcon("name")}
                </th>
                <th 
                  onClick={() => handleSort("poc")}
                  className="text-left px-6 py-4 text-[13px] font-semibold text-[#374151] cursor-pointer hover:text-[#EF4444] transition-colors"
                >
                  Point Of Contact {getSortIcon("poc")}
                </th>
                <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#374151]">
                  Departments
                </th>
                <th className="text-left px-6 py-4 text-[13px] font-semibold text-[#374151]">
                  Users
                </th>
                <th 
                  onClick={() => handleSort("status")}
                  className="text-left px-6 py-4 text-[13px] font-semibold text-[#374151] cursor-pointer hover:text-[#EF4444] transition-colors"
                >
                  Status {getSortIcon("status")}
                </th>
                <th className="text-right px-6 py-4 text-[13px] font-semibold text-[#374151]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrgs.map((org) => (
                <tr key={org.id} id={`org-row-${org.id}`} className="border-b border-[#F1F1F1] last:border-b-0 hover:bg-[#F9FAFB] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-[2px]">
                      <div className="font-semibold text-[#111827] text-sm">{org.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#374151] font-medium">
                    {org.poc}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => {
                        setSelectedOrgForSheet(org);
                        setDepartmentsSheetOpen(true);
                      }}
                      className="text-[14px] text-[#326594] font-medium hover:underline"
                    >
                      {org.departments} Departments
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => {
                        setSelectedOrgForSheet(org);
                        setUsersSheetOpen(true);
                      }}
                      className="text-[14px] text-[#326594] font-medium hover:underline flex items-center gap-[6px]"
                    >
                      <Users className="w-4 h-4" />
                      {org.users} Users
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={getStatusBadgeProps(org.status).variant}>
                      {getStatusBadgeProps(org.status).label}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-[8px]">
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8 rounded-lg text-[#6B7280] hover:text-[#326594] hover:bg-[#326594]/5"
                        onClick={() => {
                          setSelectedOrg(org);
                          setViewDetailsOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {!isReviewer && (
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 rounded-lg text-[#6B7280] hover:text-[#EF4444] hover:bg-[#EF4444]/5"
                          onClick={() => {
                            setSelectedOrg(org);
                            setEditOrgOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Standardized Pagination Controls */}
        <div className="pt-6 border-t border-[#F3F4F6] mt-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#6B7280]">
              Showing <span className="text-[#111827]">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-[#111827]">{Math.min(currentPage * itemsPerPage, sortedOrgs.length)}</span> of <span className="text-[#111827]">{sortedOrgs.length}</span> organizations
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 rounded-lg border-[#E5E7EB] text-[#374151]"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    className={`h-8 w-8 rounded-lg text-xs font-bold ${
                      currentPage === page 
                        ? 'bg-[#EF4444] text-white border-[#EF4444]' 
                        : 'border-[#E5E7EB] text-[#6B7280] hover:border-[#EF4444] hover:text-[#EF4444]'
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 rounded-lg border-[#E5E7EB] text-[#374151]"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
      </div>

      {/* Standardized Departments Side Sheet */}
      <Sheet open={departmentsSheetOpen} onOpenChange={setDepartmentsSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[400px] overflow-hidden bg-white border-l border-[#E5E7EB] shadow-[0_8px_24px_rgba(0,0,0,0.08)] !p-0 flex flex-col [&>button]:hidden">
          <div 
            className="absolute top-[16px] right-[16px] w-[32px] h-[32px] rounded-[8px] bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors z-50 group"
            onClick={() => setDepartmentsSheetOpen(false)}
          >
            <X className="w-[18px] h-[18px] text-[#9CA3AF] group-hover:text-[#111827] transition-colors" />
          </div>
          <SheetHeader className="pb-[16px] pt-[20px] px-[24px] sticky top-0 z-20 bg-white border-b border-[#F1F5F9] shrink-0">
            <SheetTitle className="text-[18px] font-bold text-[#EF4444] mb-1">
              Organization Departments
            </SheetTitle>
            {selectedOrgForSheet && (
              <SheetDescription className="text-[#6B7280] text-[14px] mt-1 font-normal">
                {selectedOrgForSheet.name} • {selectedOrgForSheet.departments} Total Departments
              </SheetDescription>
            )}
          </SheetHeader>
          
          <div className="overflow-y-auto max-h-[calc(100vh-80px)] px-4 mt-4 pb-8 flex-1">
            {selectedOrgForSheet && organizationDetails[selectedOrgForSheet.id]?.departments ? (
              <div className="space-y-4">
                {organizationDetails[selectedOrgForSheet.id].departments.map((dept) => {
                  const isExpanded = expandedDeptId === dept.id;
                  return (
                    <div 
                      key={dept.id} 
                      className={`bg-white border transition-all duration-200 cursor-pointer shadow-sm relative overflow-hidden ${isExpanded ? 'border-[#E5E7EB] rounded-[12px] p-[14px]' : 'border-[#F1F5F9] rounded-[12px] p-[14px] hover:border-[#E5E7EB] hover:bg-[#F9FAFB]'}`}
                      onClick={() => setExpandedDeptId(isExpanded ? null : dept.id)}
                    >
                      {/* collapsed state primary row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <h4 className="font-semibold text-[#111827] text-[14px] leading-tight">{dept.name}</h4>
                            <div className="flex items-center gap-1.5 mt-1">
                              <p className="text-[13px] text-[#6B7280]">Department Head: <span className="font-medium text-[#374151]">{dept.head}</span></p>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-[#1F3A5F] text-white text-[12px] font-bold px-[8px] py-[4px] rounded-[8px] min-w-[32px] text-center">
                            {dept.users}
                          </div>
                          <ChevronDown className={`w-4 h-4 text-[#9CA3AF] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>

                      {/* Expanded Container */}
                      {isExpanded && (
                        <div className="mt-[16px] pt-[16px] border-t border-[#F1F5F9] animate-in slide-in-from-top-1 fade-in duration-200">
                          <div className="flex flex-col gap-[16px]">
                            {/* Head Details Card */}
                            <div className="bg-[#F9FAFB] rounded-[12px] py-[12px] px-[14px] flex items-center gap-3 border border-[#F1F5F9]">
                              <div className="w-10 h-10 rounded-full bg-[#EF4444]/10 text-[#EF4444] flex items-center justify-center font-bold text-sm shrink-0 border border-[#EF4444]/20 shadow-sm">
                                {dept.head.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <h5 className="text-[#111827] font-semibold text-[14px]">{dept.head}</h5>
                                <p className="text-[#6B7280] text-[12px]">Head of {dept.name}</p>
                              </div>
                            </div>
                            
                            {/* Team Description Card */}
                            <div className="bg-[#F9FAFB] rounded-[12px] py-[12px] px-[14px] border border-[#F1F5F9]">
                              <span className="text-[13px] text-[#374151] font-medium">Team Size: <span className="font-bold text-[#111827]">{dept.users} users</span></span>
                            </div>

                            {/* Triple Metrics Card Layout */}
                            <div className="grid grid-cols-3 gap-[12px]">
                              <div className="bg-[#EFF6FF] rounded-[12px] py-[12px] px-[10px] flex flex-col items-center justify-center border border-[#DBEAFE] transition-all">
                                <span className="text-[18px] font-bold text-[#1D4ED8] leading-none mb-1">{dept.users}</span>
                                <span className="text-[10px] text-[#1D4ED8] uppercase tracking-wider font-semibold">Total</span>
                              </div>
                              <div className="bg-[#DCFCE7] rounded-[12px] py-[12px] px-[10px] flex flex-col items-center justify-center border border-[#BBF7D0] transition-all">
                                <span className="text-[18px] font-bold text-[#166534] leading-none mb-1">{Math.floor(dept.users * 0.6)}</span>
                                <span className="text-[10px] text-[#166534] uppercase tracking-wider font-semibold">Active</span>
                              </div>
                              <div className="bg-[#FEE2E2] rounded-[12px] py-[12px] px-[10px] flex flex-col items-center justify-center border border-[#FECACA] transition-all">
                                <span className="text-[18px] font-bold text-[#991B1B] leading-none mb-1">{Math.ceil(dept.users * 0.4)}</span>
                                <span className="text-[10px] text-[#991B1B] uppercase tracking-wider font-semibold">Inactive</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#F9FAFB] rounded-3xl border border-dashed border-[#D1D5DB]">
                <Building2 className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4 opacity-50" />
                <p className="text-[#6B7280] font-medium">No Department Details Available</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Standardized Users Side Sheet */}
      <Sheet open={usersSheetOpen} onOpenChange={setUsersSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[380px] overflow-hidden bg-white border-l border-[#E5E7EB] shadow-[0_8px_24px_rgba(0,0,0,0.08)] !p-0 flex flex-col [&>button]:hidden">
          <div 
            className="absolute top-[16px] right-[16px] w-[32px] h-[32px] rounded-[8px] bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors z-50 group"
            onClick={() => setUsersSheetOpen(false)}
          >
            <X className="w-[18px] h-[18px] text-[#9CA3AF] group-hover:text-[#111827] transition-colors" />
          </div>
          <SheetHeader className="pb-[16px] pt-[20px] px-[24px] sticky top-0 z-20 bg-white border-b border-[#F1F5F9] shrink-0">
            <SheetTitle className="text-[18px] font-bold text-[#EF4444] mb-1">
              Registered Users
            </SheetTitle>
            {selectedOrgForSheet && (
              <SheetDescription className="text-[#6B7280] text-[14px] mt-1 font-normal">
                {selectedOrgForSheet.name} • {selectedOrgForSheet.users} Total Users
              </SheetDescription>
            )}
          </SheetHeader>
          
          <div className="overflow-y-auto max-h-[calc(100vh-100px)] px-[16px] pt-[16px] pb-[40px] flex-1 custom-scrollbar">
            {selectedOrgForSheet && organizationDetails[selectedOrgForSheet.id]?.users ? (
              <div className="flex flex-col gap-[12px]">
                {organizationDetails[selectedOrgForSheet.id].users.map((user) => {
                  const roleStyles = user.role === 'Department Head' 
                    ? 'bg-[#EEF2FF] text-[#4338CA]' 
                    : user.role === 'Admin' 
                    ? 'bg-[#DCFCE7] text-[#166534]' 
                    : 'bg-[#F1F5F9] text-[#334155]';
                  return (
                    <div key={user.id} className="bg-white border border-[#F1F5F9] rounded-[12px] p-[12px] flex items-start justify-between transition-all hover:border-[#E5E7EB] hover:bg-[#F9FAFB] min-h-[64px]">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="w-[40px] h-[40px] rounded-full bg-[#EF4444]/10 flex items-center justify-center font-semibold text-[#EF4444] text-[14px] border border-[#EF4444]/20 shrink-0">
                          {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-[#111827] text-[14px] leading-tight truncate">{user.name}</h4>
                          <div className="text-[13px] text-[#6B7280] mt-0.5 truncate">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <div className="shrink-0 ml-auto h-[24px] flex items-center mt-[1px]">
                        <span className={`text-[10px] font-medium px-[10px] py-[3px] rounded-full tracking-tight whitespace-nowrap flex items-center ${roleStyles}`}>
                          {user.role}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#F9FAFB] rounded-[24px] border border-dashed border-[#D1D5DB]">
                <Users className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4 opacity-50" />
                <p className="text-[#6B7280] font-medium">No User Details Available</p>
              </div>
            )}
          </div>
          
        </SheetContent>
      </Sheet>
    </div>
  );
}