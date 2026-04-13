import { useState, useRef, useEffect, Fragment } from "react";
import { useLocation } from "react-router";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "../../components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../../components/ui/sheet";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "../../components/ui/select";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "../../components/ui/command";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../../components/ui/alert-dialog";
import { Building2, Users, Check, Plus, Edit, Search, Filter, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X, AlertTriangle, CheckCircle2, Eye, Building, CheckCircle, Shield, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/PageHeader";
import { MetricCard } from "../../components/ui/MetricCard";
import { getStatusBadgeProps } from "../../lib/statusUtils";

// Mock user data for departments
const departmentUsers: { [key: number]: { id: number; name: string; email: string; role: string }[] } = {
  1: [
    { id: 1, name: "Jawaher Rashed", email: "jawaher.albufalah@iga.gov.bh", role: "Department Head" },
    { id: 2, name: "Ali Hussain", email: "a.hussain@mow.gov.bh", role: "Senior Engineer" },
    { id: 3, name: "Muneera Khamis", email: "n.almansoori@mow.gov.bh", role: "Planning Officer" },
    { id: 4, name: "Rana A.Majeed", email: "h.ibrahim@mow.gov.bh", role: "Technical Lead" },
    { id: 5, name: "Maryam Al-Dosari", email: "m.aldosari@mow.gov.bh", role: "GIS Specialist" },
    { id: 6, name: "Khalid Mohammed", email: "k.mohammed@mow.gov.bh", role: "Urban Planner" },
    { id: 7, name: "Fatima Al-Thani", email: "f.althani@mow.gov.bh", role: "Project Coordinator" },
    { id: 8, name: "Omar Abdullah", email: "o.abdullah@mow.gov.bh", role: "Design Engineer" },
    { id: 9, name: "Layla Hassan", email: "l.hassan@mow.gov.bh", role: "Planning Analyst" },
    { id: 10, name: "Youssef Ahmed", email: "y.ahmed@mow.gov.bh", role: "Survey Engineer" },
    { id: 11, name: "Aisha Al-Mansoori", email: "a.almansoori@mow.gov.bh", role: "Data Analyst" },
    { id: 12, name: "Mohammed Rashid", email: "m.rashid@mow.gov.bh", role: "CAD Technician" },
    { id: 13, name: "Sara Ali", email: "s.ali@mow.gov.bh", role: "Environmental Planner" },
    { id: 14, name: "Hamad Al-Kuwari", email: "h.alkuwari@mow.gov.bh", role: "Transport Planner" },
    { id: 15, name: "Noora Ibrahim", email: "n.ibrahim@mow.gov.bh", role: "Development Officer" },
    { id: 16, name: "Abdullah Khalil", email: "a.khalil@mow.gov.bh", role: "Planning Assistant" },
    { id: 17, name: "Hessa Mohammed", email: "h.mohammed@mow.gov.bh", role: "Research Officer" },
    { id: 18, name: "Rashid Al-Baker", email: "r.albaker@mow.gov.bh", role: "Site Engineer" },
    { id: 19, name: "Sheikha Hassan", email: "s.hassan@mow.gov.bh", role: "Planning Technician" },
    { id: 20, name: "Jassim Ali", email: "j.ali@mow.gov.bh", role: "Quality Control Engineer" },
    { id: 21, name: "Latifa Ahmed", email: "l.ahmed@mow.gov.bh", role: "Documentation Specialist" },
    { id: 22, name: "Salman Abdullah", email: "s.abdullah@mow.gov.bh", role: "Field Engineer" },
    { id: 23, name: "Moza Al-Ansari", email: "m.alansari@mow.gov.bh", role: "Planning Coordinator" },
    { id: 24, name: "Fahad Al-Mutawa", email: "f.almutawa@mow.gov.bh", role: "Infrastructure Analyst" },
    { id: 25, name: "Amna Khalifa", email: "a.khalifa@mow.gov.bh", role: "Design Coordinator" },
    { id: 26, name: "Tariq Mohammed", email: "t.mohammed@mow.gov.bh", role: "Planning Engineer" },
    { id: 27, name: "Reem Al-Sulaiti", email: "r.alsulaiti@mow.gov.bh", role: "Project Assistant" },
    { id: 28, name: "Nasser Ibrahim", email: "n.ibrahim2@mow.gov.bh", role: "Technical Officer" },
  ],
  2: [
    { id: 1, name: "Lulwa Saad Mujaddam", email: "s.mohammed@mow.gov.bh", role: "Department Head" },
    { id: 2, name: "Venkatesh Munusamy", email: "l.abdullah@mow.gov.bh", role: "Project Manager" },
    { id: 3, name: "Mariam Rashed", email: "m.ahmed@mow.gov.bh", role: "Infrastructure Engineer" },
    { id: 4, name: "Ali Hassan", email: "a.hassan@mow.gov.bh", role: "Civil Engineer" },
    { id: 5, name: "Fatima Khalil", email: "f.khalil@mow.gov.bh", role: "Structural Engineer" },
    { id: 6, name: "Omar Al-Sayed", email: "o.alsayed@mow.gov.bh", role: "Construction Manager" },
    { id: 7, name: "Mariam Ibrahim", email: "m.ibrahim@mow.gov.bh", role: "Quality Engineer" },
    { id: 8, name: "Khalid Ahmed", email: "k.ahmed@mow.gov.bh", role: "Road Engineer" },
    { id: 9, name: "Noora Hassan", email: "n.hassan@mow.gov.bh", role: "Bridge Engineer" },
    { id: 10, name: "Hamad Ali", email: "h.ali@mow.gov.bh", role: "Project Coordinator" },
    { id: 11, name: "Aisha Rashid", email: "a.rashid@mow.gov.bh", role: "Site Supervisor" },
    { id: 12, name: "Youssef Khalifa", email: "y.khalifa@mow.gov.bh", role: "Maintenance Engineer" },
    { id: 13, name: "Moza Abdullah", email: "m.abdullah@mow.gov.bh", role: "Safety Officer" },
    { id: 14, name: "Abdullah Mohammed", email: "a.mohammed@mow.gov.bh", role: "Technical Supervisor" },
    { id: 15, name: "Hessa Al-Jaber", email: "h.aljaber@mow.gov.bh", role: "Contract Engineer" },
    { id: 16, name: "Jassim Hassan", email: "j.hassan@mow.gov.bh", role: "Inspection Engineer" },
    { id: 17, name: "Sheikha Ali", email: "s.ali@mow.gov.bh", role: "Materials Engineer" },
    { id: 18, name: "Rashid Ibrahim", email: "r.ibrahim@mow.gov.bh", role: "Planning Engineer" },
    { id: 19, name: "Latifa Ahmed", email: "l.ahmed2@mow.gov.bh", role: "Design Engineer" },
    { id: 20, name: "Salman Khalil", email: "s.khalil@mow.gov.bh", role: "Network Engineer" },
    { id: 21, name: "Amna Hassan", email: "a.hassan2@mow.gov.bh", role: "Utilities Engineer" },
    { id: 22, name: "Fahad Abdullah", email: "f.abdullah@mow.gov.bh", role: "Asset Manager" },
  ],
  3: [
    { id: 1, name: "Rana A.Majeed", email: "k.ali@env.gov.bh", role: "Department Head" },
    { id: 2, name: "Muneera Khamis", email: "f.hassan@env.gov.bh", role: "Environmental Specialist" },
    { id: 3, name: "Ahmed Mohammed", email: "a.mohammed@env.gov.bh", role: "Sustainability Officer" },
    { id: 4, name: "Noora Abdullah", email: "n.abdullah@env.gov.bh", role: "Environmental Analyst" },
    { id: 5, name: "Omar Al-Khalifa", email: "o.alkhalifa@env.gov.bh", role: "Conservation Officer" },
    { id: 6, name: "Maryam Ibrahim", email: "m.ibrahim@env.gov.bh", role: "Waste Management Specialist" },
    { id: 7, name: "Hassan Ahmed", email: "h.ahmed@env.gov.bh", role: "Air Quality Engineer" },
    { id: 8, name: "Layla Rashid", email: "l.rashid@env.gov.bh", role: "Water Resources Specialist" },
    { id: 9, name: "Abdullah Ali", email: "a.ali@env.gov.bh", role: "Environmental Inspector" },
    { id: 10, name: "Sara Khalil", email: "s.khalil@env.gov.bh", role: "Ecology Officer" },
    { id: 11, name: "Hamad Hassan", email: "h.hassan@env.gov.bh", role: "Pollution Control Officer" },
    { id: 12, name: "Aisha Mohammed", email: "a.mohammed2@env.gov.bh", role: "Environmental Coordinator" },
    { id: 13, name: "Youssef Ibrahim", email: "y.ibrahim@env.gov.bh", role: "Climate Change Analyst" },
    { id: 14, name: "Moza Ali", email: "m.ali@env.gov.bh", role: "Biodiversity Officer" },
    { id: 15, name: "Rashid Ahmed", email: "r.ahmed@env.gov.bh", role: "Environmental Planner" },
    { id: 16, name: "Hessa Abdullah", email: "h.abdullah@env.gov.bh", role: "Compliance Officer" },
    { id: 17, name: "Jassim Khalifa", email: "j.khalifa@env.gov.bh", role: "Field Technician" },
    { id: 18, name: "Sheikha Hassan", email: "s.hassan2@env.gov.bh", role: "Lab Technician" },
  ],
  4: [
    { id: 1, name: "Muneera Khamis", email: "f.hassan@upa.gov.bh", role: "Department Head" },
    { id: 2, name: "Omar Rashid", email: "o.rashid@upa.gov.bh", role: "Development Officer" },
    { id: 3, name: "Ali Mohammed", email: "a.mohammed2@upa.gov.bh", role: "Planning Inspector" },
    { id: 4, name: "Noora Ahmed", email: "n.ahmed@upa.gov.bh", role: "Building Control Officer" },
    { id: 5, name: "Khalid Ibrahim", email: "k.ibrahim@upa.gov.bh", role: "Development Analyst" },
    { id: 6, name: "Sara Abdullah", email: "s.abdullah@upa.gov.bh", role: "Zoning Specialist" },
    { id: 7, name: "Mohammed Ali", email: "m.ali@upa.gov.bh", role: "Permit Coordinator" },
    { id: 8, name: "Maryam Hassan", email: "m.hassan@upa.gov.bh", role: "Urban Designer" },
    { id: 9, name: "Abdullah Rashid", email: "a.rashid2@upa.gov.bh", role: "Land Use Planner" },
    { id: 10, name: "Layla Mohammed", email: "l.mohammed@upa.gov.bh", role: "Development Coordinator" },
    { id: 11, name: "Hassan Khalifa", email: "h.khalifa@upa.gov.bh", role: "Code Enforcement Officer" },
    { id: 12, name: "Aisha Ibrahim", email: "a.ibrahim@upa.gov.bh", role: "Compliance Inspector" },
    { id: 13, name: "Hamad Ahmed", email: "h.ahmed2@upa.gov.bh", role: "Permit Analyst" },
    { id: 14, name: "Moza Rashid", email: "m.rashid@upa.gov.bh", role: "Development Assistant" },
    { id: 15, name: "Youssef Ali", email: "y.ali@upa.gov.bh", role: "Planning Technician" },
  ],
};

const departments = [
  { 
    id: 1, 
    name: "Water Distribution Department", 
    code: "UPD-001",
    org: "Ministry of Works", 
    head: "Jawaher Rashed", 
    users: 28, 
    status: "active",
    created: "2023-01-15",
    location: "Building A, Floor 3",
    description: "Responsible for managing and maintaining the water distribution networks across the country, ensuring safe and reliable water supply to all citizens."
  },

  { 
    id: 2, 
    name: "Water Transmission Department", 
    code: "INF-002",
    org: "Ministry of Works", 
    head: "Lulwa Saad Mujaddam", 
    users: 22, 
    status: "active",
    created: "2023-02-10",
    location: "Building B, Floor 2",
    description: "Oversees the high-pressure water transmission pipelines, pumping stations, and bulk storage reservoirs that form the backbone of the national water grid."
  },

  { 
    id: 3, 
    name: "Electricity Distribution Department", 
    code: "ENV-003",
    org: "Environmental Agency", 
    head: "Rana A.Majeed", 
    users: 18, 
    status: "active",
    created: "2023-03-05",
    location: "Building C, Floor 1"
  },

  { 
    id: 4, 
    name: "Electricity Transmission Department", 
    code: "DEV-004",
    org: "Urban Planning Authority", 
    head: "Muneera Khamis", 
    users: 15, 
    status: "pending",
    created: "2024-03-01",
    location: "Building D, Floor 4",
    description: "Handles the maintenance and expansion of electricity transmission towers and underground cable systems to support increasing urban demand."

  }
];


const PointOfContactSelector = ({ value, onChange, placeholder = "Select point of contact" }: any) => {
    const [open, setOpen] = useState(false);
    
    // Hardcoded groups
    const orgPoc = [
      { name: "Jawaher Rashed", email: "jawaher.albufalah@iga.gov.bh" }
    ];
    const users = [
      { name: "Lulwa Saad Mujaddam", email: "s.mohammed@mow.gov.bh" },
      { name: "Rana A.Majeed", email: "h.ibrahim@mow.gov.bh" }
    ];
  
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox" 
            aria-expanded={open}
            className="w-full justify-between bg-white border border-[#E5E7EB] rounded-[10px] h-[36px] px-[12px] text-[14px] text-[#111827] focus:ring-1 focus:ring-[#EF4444] font-normal hover:bg-white"
          >
            {value || <span className="text-[#6B7280]">{placeholder}</span>}
            <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
          </Button>
        </PopoverTrigger>
        <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-0 rounded-[12px] shadow-lg border-[#E5E7EB] overflow-hidden" 
        align="start"
        sideOffset={4}
      >
          <Command className="bg-white w-full">
            <div className="m-[8px_12px]">
              <div className="flex items-center h-[36px] px-[12px] bg-white border border-[#E5E7EB] rounded-[10px] overflow-hidden">
                <Search className="w-4 h-4 text-[#9CA3AF] mr-2 shrink-0" />
                <input
                  className="flex-1 bg-transparent min-w-0 outline-none text-[14px] text-[#111827] placeholder:text-[#9CA3AF]"
                  placeholder="Search users..."
                  onChange={(e) => {
                     const evt = new Event("input", { bubbles: true });
                     const cmndInput = document.querySelector('[cmdk-input]') as HTMLInputElement;
                     if (cmndInput) {
                       cmndInput.value = e.target.value;
                       cmndInput.dispatchEvent(evt);
                     }
                  }}
                />
              </div>
            </div>
            {/* Hidden true cmdk input since styling it directly is tricky */}
            <div className="hidden">
               <CommandInput />
            </div>
            <CommandList className="max-h-[240px] overflow-y-auto custom-scrollbar p-0">
              <CommandEmpty className="py-6 text-center text-[13px] text-[#6B7280]">No users found.</CommandEmpty>
              <CommandGroup heading="Organization POC" className="[&_[cmdk-group-heading]]:text-[12px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[#6B7280] [&_[cmdk-group-heading]]:px-[12px] [&_[cmdk-group-heading]]:py-[8px]">
                {orgPoc.map((user) => (
                <CommandItem 
                  key={user.name} 
                  value={user.name + " " + user.email}
                  onSelect={(currentValue) => {
                    onChange(user.name);
                    setOpen(false);
                  }}
                  className="flex items-center gap-[12px] px-[12px] py-[10px] cursor-pointer rounded-[8px] data-[selected=true]:bg-[#F9FAFB] aria-selected:bg-[#F9FAFB] mx-[4px] mb-[2px]"
                >
                  <Checkbox 
                    checked={value === user.name}
                    className="w-[18px] h-[18px] rounded-[4px] border-[#D1D5DB] data-[state=checked]:bg-[#EF4444] data-[state=checked]:border-[#EF4444] shrink-0"
                  />
                  <div className="w-[32px] h-[32px] rounded-full bg-[#FEE2E2] flex items-center justify-center font-semibold text-[#EF4444] text-[12px] shrink-0 border border-[#FEE2E2]">
                    {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start gap-[1px] min-w-0">
                    <span className="text-[14px] font-medium text-[#111827] truncate">{user.name}</span>
                    <span className="text-[12px] text-[#6B7280] truncate">{user.email}</span>
                  </div>
                </CommandItem>
              ))}
              </CommandGroup>
              <CommandGroup heading="Users" className="[&_[cmdk-group-heading]]:text-[12px] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-[#6B7280] [&_[cmdk-group-heading]]:px-[12px] [&_[cmdk-group-heading]]:py-[8px]">
                {users.map((user) => (
                <CommandItem 
                  key={user.name} 
                  value={user.name + " " + user.email}
                  onSelect={(currentValue) => {
                    onChange(user.name);
                    setOpen(false);
                  }}
                  className="flex items-center gap-[12px] px-[12px] py-[10px] cursor-pointer rounded-[8px] data-[selected=true]:bg-[#F9FAFB] aria-selected:bg-[#F9FAFB] mx-[4px] mb-[2px]"
                >
                  <Checkbox 
                    checked={value === user.name}
                    className="w-[18px] h-[18px] rounded-[4px] border-[#D1D5DB] data-[state=checked]:bg-[#EF4444] data-[state=checked]:border-[#EF4444] shrink-0"
                  />
                  <div className="w-[32px] h-[32px] rounded-full bg-[#FEE2E2] flex items-center justify-center font-semibold text-[#EF4444] text-[12px] shrink-0 border border-[#FEE2E2]">
                    {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex flex-col items-start gap-[1px] min-w-0">
                    <span className="text-[14px] font-medium text-[#111827] truncate">{user.name}</span>
                    <span className="text-[12px] text-[#6B7280] truncate">{user.email}</span>
                  </div>
                </CommandItem>
              ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  };

export default function Departments() {
  const location = useLocation();
  const isReviewer = location.pathname.includes("/reviewer");
  const isOrgAdmin = location.pathname.includes("/entity-admin");
  const userOrg = "Ministry of Works";

  const [createDeptOpen, setCreateDeptOpen] = useState(false);
  const [createConfirmOpen, setCreateConfirmOpen] = useState(false);
  const [createSuccessOpen, setCreateSuccessOpen] = useState(false);
  
  const [editDeptOpen, setEditDeptOpen] = useState(false);
  const [viewDeptOpen, setViewDeptOpen] = useState(false);
  const [editConfirmOpen, setEditConfirmOpen] = useState(false);
  const [editSuccessOpen, setEditSuccessOpen] = useState(false);
  
  const [selectedDept, setSelectedDept] = useState<typeof departments[0] | null>(null);
  const [usersSheetOpen, setUsersSheetOpen] = useState(false);
  const [selectedDeptForSheet, setSelectedDeptForSheet] = useState<typeof departments[0] | null>(null);
  
  // Point of Contact states
  const [selectedCreatePoc, setSelectedCreatePoc] = useState("");
  const [selectedEditPoc, setSelectedEditPoc] = useState("");

  // Sync edit POC when selection changes
  useEffect(() => {
    if (selectedDept) {
      setSelectedEditPoc(selectedDept.head);
    }
  }, [selectedDept]);
  
  // Table state
  const [tableSearch, setTableSearch] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<typeof departments>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [orgFilter, setOrgFilter] = useState(isOrgAdmin ? userOrg : "all");
  const [departmentFilter, setDepartmentFilter] = useState("all"); // Added department name filter
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [expandedDeptId, setExpandedDeptId] = useState<number | null>(null);
  
  // Calculate stats dynamically
  const stats = {
    total: isOrgAdmin ? departments.filter(d => d.org === userOrg).length : 487,
    active: isOrgAdmin ? departments.filter(d => d.org === userOrg && d.status === 'active').length : 465,
    pending: isOrgAdmin ? departments.filter(d => d.org === userOrg && d.status === 'pending').length : 22
  };

  // Dynamic department names for the filter dropdown
  const availableDeptNames = Array.from(new Set(
    departments
      .filter(d => isOrgAdmin ? d.org === userOrg : true)
      .map(d => d.name)
  ));

  // Handle search suggestions
  useEffect(() => {
    if (tableSearch.trim()) {
      const suggestions = departments.filter(dept =>
        dept.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
        dept.head.toLowerCase().includes(tableSearch.toLowerCase()) ||
        dept.code.toLowerCase().includes(tableSearch.toLowerCase())
      ).slice(0, 5);
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [tableSearch]);

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

  // Function to scroll to selected department
  const handleSelectSuggestion = (dept: typeof departments[0]) => {
    setTableSearch(dept.name);
    setShowSuggestions(false);
    
    // Reset filters and pagination to ensure item is visible
    setStatusFilter("all");
    setOrgFilter("all");
    setCurrentPage(1);
    
    setTimeout(() => {
      const row = document.getElementById(`dept-row-${dept.id}`);
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
  const filteredDepts = departments.filter(dept => {
    const matchesSearch = dept.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
                         dept.head.toLowerCase().includes(tableSearch.toLowerCase()) ||
                         dept.code.toLowerCase().includes(tableSearch.toLowerCase());
    const matchesStatus = statusFilter === "all" || dept.status === statusFilter;
    const matchesOrg = isOrgAdmin ? (dept.org === userOrg) : (orgFilter === "all" || dept.org === orgFilter);
    const matchesDepartment = departmentFilter === "all" || dept.name === departmentFilter;
    return matchesSearch && matchesStatus && matchesOrg && matchesDepartment;
  });

  const sortedDepts = [...filteredDepts].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = (a[sortColumn as keyof typeof a] ?? "") as string | number;
    const bVal = (b[sortColumn as keyof typeof b] ?? "") as string | number;
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedDepts.length / itemsPerPage);
  const paginatedDepts = sortedDepts.slice(
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
        <PageHeader 
          title="Departments"
          description="Manage organizational departments and their respective points of contact"
        >
          {!isReviewer && !isOrgAdmin && (
            <Button 
              onClick={() => setCreateDeptOpen(true)}
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white h-9 px-4 rounded-[10px] font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Department
            </Button>
          )}
        </PageHeader>

        {/* Standardized Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8 [&_.uppercase]:normal-case">
          <MetricCard 
            value={stats.total} 
            label="Total Departments" 
            icon={<Building2 className="w-6 h-6" />} 
            variant="red"
          />
          <MetricCard 
            value={stats.active} 
            label="Active Status" 
            icon={<CheckCircle className="w-6 h-6" />} 
            variant="green" 
          />
          <MetricCard 
            value={stats.pending} 
            label="Pending Approval" 
            icon={<Shield className="w-6 h-6" />} 
            variant="yellow" 
          />
          <MetricCard 
            value="24" 
            label="Organization Units" 
            icon={<LayoutGrid className="w-6 h-6" />} 
            variant="purple" 
          />
        </div>

        {/* Departments Directory */}
        <Card className="bg-white border border-[#E5E7EB] rounded-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] overflow-hidden" style={{ padding: '20px 24px 24px' }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-semibold text-[#111827]">Departments Directory</h3>
              <p className="text-sm text-[#6B7280]">Manage and monitor all organizational departments</p>
            </div>
            
            <div className="flex items-center gap-[12px]">
              <div className="relative" ref={searchRef}>
                <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                <Input
                  className="pl-[36px] pr-[12px] h-[36px] w-[240px] border border-[#E5E7EB] bg-[#F9FAFB] rounded-[10px] text-[14px] focus:border-[#EF4444] transition-all"
                  placeholder="Search"
                  value={tableSearch}
                  onChange={(e) => {
                    setTableSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                />
              </div>

              <Select defaultValue="all">
                <SelectTrigger className="w-[160px] h-[36px] border border-[#E5E7EB] bg-white rounded-[10px] px-[12px] text-[14px]">
                  <SelectValue placeholder="Organization" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Organization</SelectItem>
                  <SelectItem value="mow">Ministry of Works</SelectItem>
                  <SelectItem value="upa">Urban Planning Authority</SelectItem>
                  <SelectItem value="ta">Transport Authority</SelectItem>
                  <SelectItem value="ea">Environmental Agency</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-[160px] h-[36px] border border-[#E5E7EB] bg-white rounded-[10px] px-[12px] text-[14px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Department</SelectItem>
                  <SelectItem value="wd">Water Distribution</SelectItem>
                  <SelectItem value="ed">Electricity Distribution</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] h-[36px] border border-[#E5E7EB] bg-white rounded-[10px] px-[12px] text-[14px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
            <div className="overflow-x-auto border border-[#F3F4F6] rounded-xl">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#374151] cursor-pointer" onClick={() => handleSort("name")}>
                      Department Name {getSortIcon("name")}
                    </th>
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#374151] cursor-pointer" onClick={() => handleSort("org")}>
                      Organization {getSortIcon("org")}
                    </th>
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#374151] cursor-pointer" onClick={() => handleSort("head")}>
                      Head {getSortIcon("head")}
                    </th>
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#374151] cursor-pointer" onClick={() => handleSort("users")}>
                      Users {getSortIcon("users")}
                    </th>
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#374151] cursor-pointer" onClick={() => handleSort("status")}>
                      Status {getSortIcon("status")}
                    </th>
                    <th className="px-6 py-4 text-right text-[13px] font-semibold text-[#374151]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedDepts.map((dept) => (
                    <tr key={dept.id} id={`dept-row-${dept.id}`} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB] transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-[#111827] text-sm">{dept.name}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#374151] font-medium">{dept.org}</td>
                      <td className="px-6 py-4 text-sm text-[#6B7280]">{dept.head}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedDeptForSheet(dept);
                            setUsersSheetOpen(true);
                          }}
                          className="text-[14px] text-[#326594] font-medium hover:underline flex items-center gap-[6px]"
                        >
                          <Users className="w-4 h-4" />
                          {dept.users} Users
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant={getStatusBadgeProps(dept.status).variant}>
                          {getStatusBadgeProps(dept.status).label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-[8px]">
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 rounded-lg text-[#6B7280] hover:text-[#326594] hover:bg-[#326594]/5"
                            onClick={() => {
                              setSelectedDept(dept);
                              setViewDeptOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          {!(isReviewer || isOrgAdmin) && (
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8 rounded-lg text-[#6B7280] hover:text-[#EF4444] hover:bg-[#EF4444]/5"
                              onClick={() => {
                                setSelectedDept(dept);
                                setEditDeptOpen(true);
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
            <div className="flex items-center justify-between pt-6 border-t border-[#F3F4F6] mt-6">
              <span className="text-xs font-medium text-[#6B7280]">
                Showing <span className="text-[#111827]">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-[#111827]">{Math.min(currentPage * itemsPerPage, sortedDepts.length)}</span> of <span className="text-[#111827]">{sortedDepts.length}</span> departments
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
          </Card>

      {/* Create Department Dialog */}
      <Dialog open={createDeptOpen} onOpenChange={setCreateDeptOpen}>
        <DialogContent className="max-w-[480px] w-[480px] h-[500px] p-0 overflow-hidden bg-white rounded-[16px] border border-[#E5E7EB] shadow-2xl flex flex-col [&>button]:hidden">
          <div 
            className="absolute top-[16px] right-[16px] w-[32px] h-[32px] rounded-[8px] bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors z-50"
            onClick={() => setCreateDeptOpen(false)}
          >
            <X className="w-4 h-4 text-[#6B7280]" />
          </div>
          <DialogHeader className="sticky top-0 bg-white z-10 pt-[20px] px-[24px] pb-[12px] border-b border-[#F1F1F1] shrink-0 text-left items-start">
            <DialogTitle className="text-[18px] font-semibold text-[#EF4444]">Create New Department</DialogTitle>
            <DialogDescription className="text-[14px] text-[#6B7280] mt-1 leading-tight">Add a new department to your organizational structure</DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto px-[24px] flex-1 min-h-0 bg-white" style={{ maxHeight: "calc(80vh - 140px)" }}>
            <div className="py-[16px] flex flex-col gap-[20px]">
              <div className="flex flex-col gap-[12px]">
                <Label className="text-[13px] font-medium text-[#374151]">
                  Organization<span className="text-[#EF4444] ml-1">*</span>
                </Label>
                <Select>
                  <SelectTrigger className="bg-white border-[#E5E7EB] rounded-[10px] h-[36px] px-[12px] text-[14px] focus:ring-1 focus:ring-[#EF4444]">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mow">Ministry of Works</SelectItem>
                    <SelectItem value="moe">Ministry of Education</SelectItem>
                    <SelectItem value="iga">Information & eGovernment Authority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-[12px]">
                <Label className="text-[13px] font-medium text-[#374151]">
                  Department Name - English<span className="text-[#EF4444] ml-1">*</span>
                </Label>
                <Input 
                  className="bg-white border border-[#E5E7EB] rounded-[10px] h-[36px] px-[12px] text-[14px] text-[#111827] focus:ring-1 focus:ring-[#EF4444] font-normal"
                  placeholder="Type department name"
                />
              </div>

              <div className="flex flex-col gap-[12px]">
                <Label className="text-[13px] font-medium text-[#374151]">
                  Department Name - Arabic<span className="text-[#EF4444] ml-1">*</span>
                </Label>
                <Input 
                  dir="rtl"
                  className="bg-white border border-[#E5E7EB] rounded-[10px] h-[36px] px-[12px] text-[14px] text-[#111827] focus:ring-1 focus:ring-[#EF4444] font-normal text-right placeholder:text-right"
                  placeholder="اكتب اسم القسم"
                />
              </div>

              <div className="grid grid-cols-2 gap-[16px] p-[16px] bg-[#F9FAFB] rounded-[12px] border border-[#F3F4F6]">
                <div className="flex items-center space-x-[12px]">
                  <Checkbox id="create-data-owner" className="w-[18px] h-[18px] rounded-[4px] border-[#D1D5DB] data-[state=checked]:bg-[#EF4444] data-[state=checked]:border-[#EF4444]" />
                  <label htmlFor="create-data-owner" className="text-[13px] font-medium text-[#374151] cursor-pointer">
                    Data Owner
                  </label>
                </div>
                <div className="flex items-center space-x-[12px]">
                  <Checkbox id="create-data-consumer" className="w-[18px] h-[18px] rounded-[4px] border-[#D1D5DB] data-[state=checked]:bg-[#EF4444] data-[state=checked]:border-[#EF4444]" />
                  <label htmlFor="create-data-consumer" className="text-[13px] font-medium text-[#374151] cursor-pointer">
                    Data Consumer
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-[12px]">
                <Label className="text-[13px] font-medium text-[#374151]">
                  Point of Contact<span className="text-[#EF4444] ml-1">*</span>
                </Label>
                <PointOfContactSelector value={selectedCreatePoc} onChange={setSelectedCreatePoc} placeholder="Select point of contact" />
              </div>

              <div className="flex flex-col gap-[12px]">
                <Label className="text-[13px] font-medium text-[#374151]">Business Description</Label>
                <Textarea 
                  className="bg-white border border-[#E5E7EB] rounded-[10px] min-h-[80px] px-[12px] py-[10px] text-[14px] text-[#111827] font-normal focus:ring-1 focus:ring-[#EF4444] resize-none"
                  placeholder="Describe the department's responsibilities"
                />
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white z-10 py-[16px] px-[24px] border-t border-[#F1F1F1] shrink-0 flex justify-end gap-[12px]">
            <Button variant="outline" className="h-[36px] px-[20px] rounded-[10px] border-[#E5E7EB] text-[#374151] font-medium" onClick={() => setCreateDeptOpen(false)}>Cancel</Button>
            <Button onClick={() => setCreateConfirmOpen(true)} className="h-[36px] px-[20px] rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium">Create Department</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={editDeptOpen} onOpenChange={setEditDeptOpen}>
        <DialogContent className="max-w-[480px] w-[480px] h-[500px] p-0 overflow-hidden bg-white rounded-[16px] border border-[#E5E7EB] shadow-2xl flex flex-col [&>button]:hidden">
          <div 
            className="absolute top-[16px] right-[16px] w-[32px] h-[32px] rounded-[8px] bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors z-50"
            onClick={() => setEditDeptOpen(false)}
          >
            <X className="w-4 h-4 text-[#6B7280]" />
          </div>
          <DialogHeader className="sticky top-0 bg-white z-10 pt-[20px] px-[24px] pb-[12px] border-b border-[#F1F1F1] shrink-0 text-left items-start">
            <DialogTitle className="text-[18px] font-semibold text-[#EF4444]">
              Edit Department
            </DialogTitle>
            <DialogDescription className="text-[14px] text-[#6B7280] mt-1 leading-tight">
              Update department details and accessibility roles
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto px-[24px] flex-1 min-h-0 bg-white" style={{ maxHeight: "calc(80vh - 140px)" }}>
            <div className="py-[16px] flex flex-col gap-[20px]">
              
              <div className="flex flex-col gap-[12px]">
                <Label className="text-[13px] font-medium text-[#374151]">Organization</Label>
                <div className="h-[36px] flex items-center px-[12px] bg-[#F9FAFB] border border-[#F3F4F6] rounded-[10px] text-[14px] text-[#6B7280]">
                  {selectedDept?.org}
                </div>
              </div>

              <div className="flex flex-col gap-[12px]">
                <Label className="text-[13px] font-medium text-[#374151]">Status</Label>
                <div className="flex items-center h-[36px]">
                  <Badge variant={getStatusBadgeProps(selectedDept?.status || "").variant}>
                    {getStatusBadgeProps(selectedDept?.status || "").label}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-col gap-[12px]">
                <Label className="text-[13px] font-medium text-[#374151]">Department Name (English)</Label>
                <Input 
                  defaultValue={selectedDept?.name}
                  className="bg-white border border-[#E5E7EB] rounded-[10px] h-[36px] px-[12px] text-[14px] text-[#111827] focus:ring-1 focus:ring-[#EF4444] font-normal"
                />
              </div>

              <div className="flex flex-col gap-[12px]">
                <Label className="text-[13px] font-medium text-[#374151]">Department Name (Arabic)</Label>
                <Input 
                  className="bg-white border border-[#E5E7EB] rounded-[10px] h-[36px] px-[12px] text-[14px] text-[#111827] focus:ring-1 focus:ring-[#EF4444] font-normal text-right"
                  dir="rtl"
                />
              </div>

              <div className="grid grid-cols-2 gap-[16px] p-[16px] bg-[#F9FAFB] rounded-[12px] border border-[#F3F4F6]">
                <div className="flex items-center space-x-[12px]">
                  <Checkbox 
                    id="edit-data-owner" 
                    className="w-5 h-5 border-[#E5E7EB] data-[state=checked]:bg-[#EF4444] data-[state=checked]:border-[#EF4444]"
                  />
                  <label htmlFor="edit-data-owner" className="text-[14px] font-medium text-[#374151] cursor-pointer">
                    Data Owner
                  </label>
                </div>
                <div className="flex items-center space-x-[12px]">
                  <Checkbox 
                    id="edit-data-consumer" 
                    className="w-5 h-5 border-[#E5E7EB] data-[state=checked]:bg-[#EF4444] data-[state=checked]:border-[#EF4444]"
                  />
                  <label htmlFor="edit-data-consumer" className="text-[14px] font-medium text-[#374151] cursor-pointer">
                    Data Consumer
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-[12px]">
                <Label className="text-[13px] font-medium text-[#374151]">
                  Point of Contact<span className="text-[#EF4444]">*</span>
                </Label>
                <PointOfContactSelector value={selectedEditPoc} onChange={setSelectedEditPoc} />
              </div>

              <div className="flex flex-col gap-[12px]">
                <Label className="text-[13px] font-medium text-[#374151]">Business Description</Label>
                <Textarea 
                  className="bg-white border border-[#E5E7EB] rounded-[10px] min-h-[80px] px-[12px] py-[10px] text-[14px] text-[#111827] font-normal focus:ring-1 focus:ring-[#EF4444] resize-none"
                  placeholder="Describe the department's responsibilities"
                />
              </div>

            </div>
          </div>

          <div className="sticky bottom-0 bg-white z-10 py-[16px] px-[24px] border-t border-[#F1F1F1] shrink-0 flex justify-end gap-[12px]">
            <Button variant="outline" className="h-[36px] px-[20px] rounded-[10px] border-[#E5E7EB] text-[#374151] font-medium" onClick={() => setEditDeptOpen(false)}>Cancel</Button>
            <Button onClick={() => { setEditConfirmOpen(true); }} className="h-[36px] px-[20px] rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium">Save Changes</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Department Details Dialog */}
      <Dialog open={viewDeptOpen} onOpenChange={setViewDeptOpen}>
        <DialogContent className="max-w-[480px] w-[480px] h-[500px] p-0 overflow-hidden bg-white rounded-[16px] border border-[#E5E7EB] shadow-2xl flex flex-col [&>button]:hidden">
          <div 
            className="absolute top-[16px] right-[16px] w-[32px] h-[32px] rounded-[8px] bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors z-50"
            onClick={() => setViewDeptOpen(false)}
          >
            <X className="w-4 h-4 text-[#6B7280]" />
          </div>
          <DialogHeader className="sticky top-0 bg-white z-10 pt-[20px] px-[24px] pb-[12px] border-b border-[#F1F1F1] shrink-0 text-left items-start">
            <DialogTitle className="text-[18px] font-semibold text-[#EF4444]">
              Department Details
            </DialogTitle>
            <DialogDescription className="text-[14px] text-[#6B7280] mt-1 leading-tight">
              View department information and assignments
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-y-auto px-[24px] flex-1 min-h-0 bg-white" style={{ maxHeight: "calc(80vh - 80px)" }}>
            <div className="py-[20px] grid grid-cols-1 sm:grid-cols-2 gap-x-[24px] gap-y-[16px]">
              
              {/* Row 1 */}
              <div className="flex flex-col gap-[4px]">
                <span className="text-[12px] text-[#6B7280]">Organization</span>
                <span className="text-[14px] font-medium text-[#111827]">{selectedDept?.org}</span>
              </div>
              <div className="flex flex-col gap-[4px]">
                <span className="text-[12px] text-[#6B7280]">Department Name</span>
                <span className="text-[14px] font-medium text-[#111827]">{selectedDept?.name}</span>
              </div>


              <div className="flex flex-col gap-[4px]">
                <span className="text-[12px] text-[#6B7280]">Point of Contact</span>
                <span className="text-[14px] font-medium text-[#111827]">{selectedDept?.head}</span>
              </div>

              {/* Row 3 */}
              <div className="flex flex-col gap-[4px]">
                <span className="text-[12px] text-[#6B7280]">Created Date</span>
                <span className="text-[14px] font-medium text-[#111827]">{selectedDept?.created || "N/A"}</span>
              </div>
              <div className="flex flex-col gap-[4px]">
                <span className="text-[12px] text-[#6B7280]">Members</span>
                <div className="mt-[2px]">
                  <span className="inline-flex items-center justify-center px-[10px] py-[4px] text-[12px] font-medium text-[#1D4E7B] bg-[#E8F0FE] rounded-[20px]">
                    {selectedDept?.users} Users
                  </span>
                </div>
              </div>

              {/* Row 4 */}
              <div className="flex flex-col gap-[4px]">
                <span className="text-[12px] text-[#6B7280]">Status</span>
                <div className="mt-[2px]">
                  <Badge variant={getStatusBadgeProps(selectedDept?.status || "").variant}>
                    {getStatusBadgeProps(selectedDept?.status || "").label}
                  </Badge>
                </div>
              </div>

              {/* Row 5 - Full Width Description */}
              <div className="flex flex-col gap-[4px] col-span-full mt-[12px]">
                <span className="text-[12px] text-[#6B7280]">Business Description</span>
                <p className="text-[14px] font-medium leading-relaxed text-[#111827] mt-[4px]">
                  {selectedDept?.description || "Providing infrastructure and engineering services to support the growth and development of the Kingdom. Responsible for public works, roads, and urban drainage systems."}
                </p>
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white z-10 py-[16px] px-[24px] border-t border-[#F1F1F1] shrink-0 flex justify-end">
            <Button 
              onClick={() => setViewDeptOpen(false)} 
              className="h-[36px] px-[32px] rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation & Success Dialogs */}

      {/* Create Department Confirmation */}
      <AlertDialog open={createConfirmOpen} onOpenChange={setCreateConfirmOpen}>
        <AlertDialogContent className="w-[420px] max-w-[90vw] p-[24px] bg-white rounded-[16px] border border-[#E5E7EB] shadow-2xl flex flex-col items-center text-center gap-0">
          <div className="w-16 h-16 rounded-full bg-[#FEF2F2] flex items-center justify-center mb-[12px]">
            <AlertTriangle className="w-8 h-8 text-[#EF4444]" />
          </div>
          
          <AlertDialogHeader className="mb-[20px] p-0 w-full">
            <AlertDialogTitle className="text-[18px] font-semibold text-[#111827] text-center w-full">Create Department</AlertDialogTitle>
            <AlertDialogDescription className="text-[14px] text-[#6B7280] text-center w-full mt-2">Are you sure you want to create this new department?</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="w-full flex-row justify-center gap-[16px] sm:space-x-0 mt-0">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="flex-1 max-w-[160px] h-[36px] rounded-[10px] border-[#E5E7EB] text-[#374151] font-medium m-0">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button 
                onClick={() => {
                  setCreateConfirmOpen(false);
                  setCreateDeptOpen(false);
                  setTimeout(() => setCreateSuccessOpen(true), 150);
                }}
                className="flex-1 max-w-[160px] h-[36px] rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium m-0"
              >
                Confirm
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Create Department Success */}
      <AlertDialog open={createSuccessOpen} onOpenChange={setCreateSuccessOpen}>
        <AlertDialogContent className="w-[420px] max-w-[90vw] p-[24px] bg-white rounded-[16px] border border-[#E5E7EB] shadow-2xl flex flex-col items-center text-center gap-0">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-[12px]">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          
          <AlertDialogHeader className="mb-[20px] p-0 w-full">
            <AlertDialogTitle className="text-[18px] font-semibold text-[#111827] text-center w-full">Action Submitted</AlertDialogTitle>
            <AlertDialogDescription className="text-[14px] text-[#6B7280] text-center w-full mt-2">Your request to create the department is sent to super admin for approval.</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="w-full flex-row justify-center gap-[16px] sm:space-x-0 mt-0">
            <AlertDialogCancel asChild>
              <Button onClick={() => setCreateSuccessOpen(false)} variant="outline" className="flex-1 max-w-[160px] h-[36px] rounded-[10px] border-[#E5E7EB] text-[#374151] font-medium m-0">Dismiss</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button 
                onClick={() => setCreateSuccessOpen(false)}
                className="flex-1 max-w-[160px] h-[36px] rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium m-0"
              >
                Dashboard
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Department Confirmation */}
      <AlertDialog open={editConfirmOpen} onOpenChange={setEditConfirmOpen}>
        <AlertDialogContent className="w-[420px] max-w-[90vw] p-[24px] bg-white rounded-[16px] border border-[#E5E7EB] shadow-2xl flex flex-col items-center text-center gap-0">
          <div className="w-16 h-16 rounded-full bg-[#FEF2F2] flex items-center justify-center mb-[12px]">
            <AlertTriangle className="w-8 h-8 text-[#EF4444]" />
          </div>
          
          <AlertDialogHeader className="mb-[20px] p-0 w-full">
            <AlertDialogTitle className="text-[18px] font-semibold text-[#111827] text-center w-full">Update Department</AlertDialogTitle>
            <AlertDialogDescription className="text-[14px] text-[#6B7280] text-center w-full mt-2">Are you sure you want to update this department's information?</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="w-full flex-row justify-center gap-[16px] sm:space-x-0 mt-0">
            <AlertDialogCancel asChild>
              <Button variant="outline" className="flex-1 max-w-[160px] h-[36px] rounded-[10px] border-[#E5E7EB] text-[#374151] font-medium m-0">Cancel</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button 
                onClick={() => {
                  setEditConfirmOpen(false);
                  setEditDeptOpen(false);
                  setTimeout(() => setEditSuccessOpen(true), 150);
                }}
                className="flex-1 max-w-[160px] h-[36px] rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium m-0"
              >
                Confirm
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Department Success */}
      <AlertDialog open={editSuccessOpen} onOpenChange={setEditSuccessOpen}>
        <AlertDialogContent className="w-[420px] max-w-[90vw] p-[24px] bg-white rounded-[16px] border border-[#E5E7EB] shadow-2xl flex flex-col items-center text-center gap-0">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-[12px]">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
          
          <AlertDialogHeader className="mb-[20px] p-0 w-full">
            <AlertDialogTitle className="text-[18px] font-semibold text-[#111827] text-center w-full">Action Successful</AlertDialogTitle>
            <AlertDialogDescription className="text-[14px] text-[#6B7280] text-center w-full mt-2">Department information has been updated successfully.</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="w-full flex-row justify-center gap-[16px] sm:space-x-0 mt-0">
            <AlertDialogCancel asChild>
              <Button onClick={() => setEditSuccessOpen(false)} variant="outline" className="flex-1 max-w-[160px] h-[36px] rounded-[10px] border-[#E5E7EB] text-[#374151] font-medium m-0">Dismiss</Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button 
                onClick={() => setEditSuccessOpen(false)}
                className="flex-1 max-w-[160px] h-[36px] rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium m-0"
              >
                Dashboard
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Users Sheet */}
      <Sheet open={usersSheetOpen} onOpenChange={setUsersSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[380px] overflow-hidden bg-white border-l border-[#E5E7EB] shadow-[0_8px_24px_rgba(0,0,0,0.08)] !p-0 flex flex-col [&>button]:hidden">
          <div 
            className="absolute top-[16px] right-[16px] w-[32px] h-[32px] rounded-[8px] bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors z-50 group"
            onClick={() => setUsersSheetOpen(false)}
          >
            <X className="w-[18px] h-[18px] text-[#9CA3AF] group-hover:text-[#111827] transition-colors" />
          </div>
          
          <SheetHeader className="pb-[16px] pt-[20px] px-[24px] sticky top-0 z-20 bg-white border-b border-[#F1F5F9] shrink-0">
            <SheetTitle className="text-[16px] font-semibold text-[#EF4444] mb-1">
              {selectedDeptForSheet?.name}
            </SheetTitle>
            <SheetDescription className="text-[#6B7280] text-[13px] md:text-[14px] mt-1 font-normal">
              {selectedDeptForSheet?.org} • {selectedDeptForSheet?.users || 0} Members
            </SheetDescription>
          </SheetHeader>
          
          <div className="overflow-y-auto max-h-[calc(100vh-100px)] px-[16px] pt-[16px] pb-[40px] flex-1 custom-scrollbar">
            {selectedDeptForSheet && departmentUsers[selectedDeptForSheet.id] ? (
              <div className="flex flex-col gap-[12px]">
                {departmentUsers[selectedDeptForSheet.id].map((user) => (
                  <div key={user.id} className="bg-white border border-[#F1F5F9] rounded-[12px] p-[12px] flex items-start justify-between transition-all hover:border-[#E5E7EB] hover:bg-[#F9FAFB] min-h-[64px]">
                    <div className="flex items-center gap-[12px] flex-1 min-w-0">
                      <div className="w-[40px] h-[40px] rounded-full bg-[#FEE2E2] flex items-center justify-center font-semibold text-[#EF4444] text-[14px] shrink-0 border border-[#FEE2E2]">
                        {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-[#111827] text-[14px] leading-tight truncate">{user.name}</h4>
                        <div className="text-[12px] md:text-[13px] text-[#6B7280] mt-[2px] truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 ml-auto h-[24px] flex items-center mt-[1px]">
                      <span className="bg-[#EEF2FF] text-[#4F46E5] text-[10px] font-medium px-[10px] py-[4px] rounded-[999px] whitespace-nowrap inline-flex items-center tracking-tight">
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#F9FAFB] rounded-[24px] border border-dashed border-[#D1D5DB]">
                <Users className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4 opacity-50" />
                <p className="text-[#6B7280] font-medium">No Members Found</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
      </div>
    </div>
  );
}