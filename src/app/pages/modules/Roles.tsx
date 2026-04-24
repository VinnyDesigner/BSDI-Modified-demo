import { Card } from "../../components/ui/card";
import { useLocation } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { getStatusBadgeProps } from "../../lib/statusUtils";
import { 
  Plus, Search, Edit, Trash2, Filter, ChevronLeft, ChevronRight, X, AlertTriangle, CheckCircle2, MoreVertical, Layout, Shield, Users, Mail, Phone, MapPin, Eye, ChevronUp, ChevronDown 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Checkbox } from "../../components/ui/checkbox";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { PageHeader } from "../../components/PageHeader";
import { MetricCard } from "../../components/ui/MetricCard";

// Mock user data from all departments
const allUsers = [
  { id: 1, name: "Jawaher Rashed", email: "jawaher.albufalah@iga.gov.bh", department: "Urban Planning Department", organization: "MOW", status: "active" },
  { id: 2, name: "Ali Hussain", email: "a.hussain@mow.gov.bh", department: "Urban Planning Department", organization: "MOW", status: "active" },
  { id: 3, name: "Muneera Khamis", email: "n.almansoori@mow.gov.bh", department: "Urban Planning Department", organization: "MOW", status: "active" },
  { id: 4, name: "Rana A.Majeed", email: "h.ibrahim@mow.gov.bh", department: "Urban Planning Department", organization: "MOW", status: "active" },
  { id: 5, name: "Lulwa Saad Mujaddam", email: "s.mohammed@mow.gov.bh", department: "Infrastructure Management", organization: "MOW", status: "active" },
  { id: 6, name: "Venkatesh Munusamy", email: "l.abdullah@mow.gov.bh", department: "Infrastructure Management", organization: "MOW", status: "active" },
  { id: 7, name: "Mariam Rashed", email: "m.ahmed@mow.gov.bh", department: "Infrastructure Management", organization: "MOW", status: "active" },
  { id: 8, name: "Rana A.Majeed", email: "k.ali@env.gov.bh", department: "Environmental Services", organization: "ENV", status: "active" },
  { id: 9, name: "Muneera Khamis", email: "f.hassan@env.gov.bh", department: "Environmental Services", organization: "ENV", status: "active" },
  { id: 10, name: "Omar Rashid", email: "o.rashid@upa.gov.bh", department: "Development Control", organization: "UPA", status: "active" },
  { id: 11, name: "Amina Khalil", email: "a.khalil@upa.gov.bh", department: "GIS & Mapping", organization: "UPA", status: "active" },
  { id: 12, name: "Youssef Ali", email: "y.ali@mow.gov.bh", department: "Urban Planning Department", organization: "MOW", status: "active" },
  { id: 13, name: "Mariam Khalid", email: "m.khalid@env.gov.bh", department: "Environmental Services", organization: "ENV", status: "active" },
  { id: 14, name: "Abdullah Hassan", email: "a.hassan@upa.gov.bh", department: "Development Control", organization: "UPA", status: "active" },
  { id: 15, name: "Noura Ahmed", email: "n.ahmed@mow.gov.bh", department: "Infrastructure Management", organization: "MOW", status: "active" },
];

// Map roles to their assigned users
const roleUserMapping: Record<number, number[]> = {
  1: [1, 2, 3], // BSDI Super Admin
  2: Array.from({ length: 142 }, (_, i) => i + 1), // Entity Admin - mock IDs
  3: Array.from({ length: 487 }, (_, i) => i + 1), // Department Reviewer - mock IDs
  4: [4, 5, 6, 7, 8, 9, 10], // GIS Analyst
  5: [11, 12, 13, 14, 15], // Data Reviewer
  6: [1, 4, 7, 10], // Metadata Editor
  7: [2, 5, 8, 11], // Service Manager
};

const roles = [
  { id: 1, name: "BSDI Super Admin", type: "System", users: 3, permissions: "Full Governance Authority", status: "active" },
  { id: 2, name: "Entity Admin", type: "Organization", users: 142, permissions: "Organization Management", status: "active" },
  { id: 3, name: "Department Reviewer", type: "Department", users: 487, permissions: "Department User & Role Management", status: "active" },
  { id: 4, name: "GIS Analyst", type: "Custom", users: 326, permissions: "Data Access & Analysis", status: "active" },
  { id: 5, name: "Data Reviewer", type: "Custom", users: 245, permissions: "Review & Approval", status: "active" },
  { id: 6, name: "Metadata Editor", type: "Custom", users: 189, permissions: "Metadata Management", status: "active" },
  { id: 7, name: "Service Manager", type: "Custom", users: 67, permissions: "API & Service Configuration", status: "active" },
];

export default function Roles() {
  const location = useLocation();
  const isReviewer = location.pathname.includes("/reviewer");
  const isOrgAdmin = location.pathname.includes("/entity-admin");
  const isDeptAdmin = location.pathname.includes("/department");
  const isSuperAdmin = location.pathname.includes("/super-admin");
  const [open, setOpen] = useState(false);
  const [createConfirmDialogOpen, setCreateConfirmDialogOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [updateConfirmDialogOpen, setUpdateConfirmDialogOpen] = useState(false);
  const [updateSuccessDialogOpen, setUpdateSuccessDialogOpen] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [roleType, setRoleType] = useState("Custom");
  const [rolePermissions, setRolePermissions] = useState("");
  const [roleStatus, setRoleStatus] = useState("active");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Edit Role state
  const [editOpen, setEditOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<typeof roles[0] | null>(null);
  const [editRoleName, setEditRoleName] = useState("");
  const [editRoleType, setEditRoleType] = useState("");
  const [editRoleDescription, setEditRoleDescription] = useState("");
  const [editRoleStatus, setEditRoleStatus] = useState("");
  const [editAssignedUsers, setEditAssignedUsers] = useState<number[]>([]);
  const [isEditUserDropdownOpen, setIsEditUserDropdownOpen] = useState(false);
  const editDropdownRef = useRef<HTMLDivElement>(null);
  
  // Search state for Edit Role dialog
  const [userSearchQuery, setUserSearchQuery] = useState("");
  
  // User statuses for Super Admin (maps user ID to status)
  const [userStatuses, setUserStatuses] = useState<Record<number, string>>({});

  // Users panel state
  const [selectedRoleForUsers, setSelectedRoleForUsers] = useState<typeof roles[0] | null>(null);
  const [isUsersPanelOpen, setIsUsersPanelOpen] = useState(false);

  // View Role Modal state
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingRole, setViewingRole] = useState<typeof roles[0] | null>(null);

  // Directory filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [roleTypeFilter, setRoleTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (editDropdownRef.current && !editDropdownRef.current.contains(event.target as Node)) {
        setIsEditUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserToggle = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleEditUserToggle = (userId: number) => {
    setEditAssignedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateRoleClick = () => {
    if (!roleName || !rolePermissions) {
      toast.error("Role name and permissions are required");
      return;
    }
    setCreateConfirmDialogOpen(true);
  };

  const handleCreateRole = () => {
    const newRole = {
      id: roles.length + 1,
      name: roleName,
      type: roleType,
      users: selectedUsers.length,
      permissions: rolePermissions,
      status: roleStatus,
    };

    roles.push(newRole);
    toast.success("Role created successfully");
    setOpen(false);
    setCreateConfirmDialogOpen(false);
    setSuccessOpen(true);
    setRoleName("");
    setRoleType("Custom");
    setRolePermissions("");
    setRoleStatus("active");
    setSelectedUsers([]);
  };

  const handleEditRoleClick = () => {
    if (!editRoleName || !editRoleDescription) {
      toast.error("Role name and description are required");
      return;
    }
    setUpdateConfirmDialogOpen(true);
  };

  const handleEditRole = () => {
    if (editingRole) {
      const updatedRole = {
        id: editingRole.id,
        name: editRoleName,
        type: editRoleType,
        users: editAssignedUsers.length,
        permissions: editRoleDescription,
        status: editRoleStatus,
      };

      const index = roles.findIndex(role => role.id === editingRole.id);
      if (index !== -1) {
        roles[index] = updatedRole;
        toast.success("Role updated successfully");
        setEditOpen(false);
        setUpdateConfirmDialogOpen(false);
        setUpdateSuccessDialogOpen(true);
        setEditingRole(null);
        setEditRoleName("");
        setEditRoleType("");
        setEditRoleDescription("");
        setEditRoleStatus("");
        setEditAssignedUsers([]);
      }
    }
  };

  const handleDeleteRole = (roleId: number) => {
    const index = roles.findIndex(role => role.id === roleId);
    if (index !== -1) {
      roles.splice(index, 1);
      toast.success("Role deleted successfully");
    }
  };

   const handleEditClick = (role: typeof roles[0]) => {
    setOpen(true);
    setEditingRole(role);
    setEditRoleName(role.name);
    setEditRoleType(role.type);
    setEditRoleDescription(role.permissions);
    setEditRoleStatus(role.status);
    // For BSDI Super Admin, set first 3 users; for others, reset
    if (role.name === "BSDI Super Admin") {
      setEditAssignedUsers([1, 2, 3]);
      // Initialize user statuses
      const initialStatuses: Record<number, string> = {};
      [1, 2, 3].forEach(id => {
        initialStatuses[id] = "active";
      });
      setUserStatuses(initialStatuses);
    } else {
      setEditAssignedUsers([]);
    }
    setUserSearchQuery("");
  };

  const handleViewDetails = (role: typeof roles[0]) => {
    setViewingRole(role);
    setIsViewOpen(true);
  };

  const handleRemoveSelectedUser = (userId: number) => {
    setEditAssignedUsers(prev => prev.filter(id => id !== userId));
  };

  const handleUserStatusChange = (userId: number, status: string) => {
    setUserStatuses(prev => ({ ...prev, [userId]: status }));
  };

  // Handle users button click
  const handleViewUsers = (role: typeof roles[0]) => {
    setSelectedRoleForUsers(role);
    setIsUsersPanelOpen(true);
  };

  const handleCloseUsersPanel = () => {
    setIsUsersPanelOpen(false);
    setTimeout(() => setSelectedRoleForUsers(null), 300); // Wait for animation
  };

  // Filter users based on search query
  const filteredUsers = allUsers.filter(user => 
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.department.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const isEditingSuperAdmin = editingRole?.name === "BSDI Super Admin";

  // Step 1: Base role set determined by user admin type
  const baseRoles = isDeptAdmin 
    ? roles.filter(role => role.type === "Department") 
    : (isOrgAdmin ? roles.filter(role => role.name === "Entity Admin" || role.type === "Department") : roles);

  // Step 2: Apply Search + Type + Status filters on top of base set
  const filteredRoles = baseRoles.filter(role => {
    const matchesSearch = !searchTerm || 
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      role.permissions.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = roleTypeFilter === 'all' || role.type === roleTypeFilter;
    const matchesStatus = statusFilter === 'all' || role.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // KPIs — calculated from base set (not filtered view)
  const totalRolesCount = baseRoles.length;
  const assignedUsersCount = baseRoles.reduce((acc, r) => acc + r.users, 0).toLocaleString();
  const customRolesCount = baseRoles.filter(r => r.type === "Custom").length;

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-6 py-5">
      <div className="max-w-[1700px] mx-auto space-y-6">
        <PageHeader 
          title="Roles Management"
          description="Create and manage user roles across the organization"
        >
          {!isReviewer && !isOrgAdmin && !isDeptAdmin && (
            <Button onClick={() => setOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create New Role
            </Button>
          )}
        </PageHeader>

        {/* Standardized Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            value={totalRolesCount} 
            label="Total Roles" 
            icon={<Shield className="w-6 h-6" />} 
            variant="red" 
          />
          <MetricCard 
            value={assignedUsersCount} 
            label="Assigned Users" 
            icon={<Users className="w-6 h-6" />} 
            variant="blue" 
          />
          <MetricCard 
            value={customRolesCount} 
            label="Custom Roles" 
            icon={<Shield className="w-6 h-6" />} 
            variant="yellow" 
          />
          <MetricCard 
            value="3" 
            label="System Roles" 
            icon={<Shield className="w-6 h-6" />} 
            variant="purple" 
          />
        </div>

        {/* Roles Directory Card - Absolute BSDI Standard (Matching Organizations 1:1) */}
        <Card className="bg-white border border-[#E5E7EB] rounded-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] overflow-hidden mt-8" style={{ padding: '20px 24px 24px' }}>
          {/* Card Header: Standard Left (Description) + Right (Filters) */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 shrink-0">
            <div className="flex flex-col gap-1">
              <h3 className="text-[18px] font-semibold text-[#111827]">Roles Directory</h3>
              <p className="text-[13px] text-[#6B7280]">Manage all user roles and permissions</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              {/* Table Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                <Input
                  type="text"
                  placeholder="Search roles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64 h-[36px] pl-10 rounded-[10px] border-[#E5E7EB] bg-[#F9FAFB] text-sm focus:border-[#EF4444] transition-all"
                />
              </div>

              {/* Role Type Filter */}
              <Select value={roleTypeFilter} onValueChange={setRoleTypeFilter}>
                <SelectTrigger className="w-[160px] h-[36px] rounded-[10px] border-[#E5E7EB] bg-white text-sm">
                  <SelectValue placeholder="Role Type" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-[#F3F4F6] shadow-xl">
                  <SelectItem value="all">Types</SelectItem>
                  <SelectItem value="System">System</SelectItem>
                  <SelectItem value="Organization">Organization</SelectItem>
                  <SelectItem value="Department">Department</SelectItem>
                  <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px] h-[36px] rounded-[10px] border-[#E5E7EB] bg-white text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-[#F3F4F6] shadow-xl">
                  <SelectItem value="all">Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Data Table */}
          {/* Standardized Table Headers with Matching Borders */}
          <div className="overflow-x-auto border border-[#F1F1F1] rounded-[12px] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#E5E7EB]">
                  <th className="text-left py-4 px-6 text-[13px] font-semibold text-[#374151]">
                    Name Role
                  </th>
                  <th className="text-left py-4 px-6 text-[13px] font-semibold text-[#374151]">
                    Description
                  </th>
                  <th className="text-left py-4 px-6 text-[13px] font-semibold text-[#374151]">
                    Assigned Users
                  </th>
                  <th className="text-left py-4 px-6 text-[13px] font-semibold text-[#374151]">
                    Role Type
                  </th>
                  <th className="text-left py-4 px-6 text-[13px] font-semibold text-[#374151]">
                    Status
                  </th>
                  <th className="text-right py-4 px-6 text-[13px] font-semibold text-[#374151]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRoles.map((role) => (
                  <tr 
                    key={role.id}
                    className="border-b border-[#F1F1F1] last:border-b-0 hover:bg-[#F9FAFB] transition-colors group h-[60px]"
                  >
                    <td className="py-2 px-6 align-middle text-left">
                      <div className="font-semibold text-[#111827] text-sm">{role.name}</div>
                    </td>
                    <td className="py-2 px-6 align-middle text-left text-sm text-[#374151] font-medium">
                      {role.permissions}
                    </td>
                    <td className="py-2 px-6 align-middle text-left">
                      <div 
                        className="flex items-center gap-[6px] text-[#3D72A2] hover:text-[#EF4444] text-[14px] font-medium cursor-pointer transition-colors"
                        onClick={() => handleViewUsers(role)}
                      >
                        <Users className="w-4 h-4" />
                        <span>{role.users} Users</span>
                      </div>
                    </td>
                    <td className="py-2 px-6 align-middle text-left">
                      {(() => {
                        const typeStyles: Record<string, { bg: string; text: string; border: string }> = {
                          "System": { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" },
                          "Organization": { bg: "#DBEAFE", text: "#1D4ED8", border: "#BFDBFE" },
                          "Department": { bg: "#FEF3C7", text: "#92400E", border: "#FDE68A" },
                          "Custom": { bg: "#F3E8FF", text: "#6B21A8", border: "#E9D5FF" },
                        };
                        const style = typeStyles[role.type] || typeStyles["Custom"];
                        return (
                          <span 
                            className="h-[24px] px-[10px] rounded-full text-[12px] font-[600] leading-none whitespace-nowrap flex items-center justify-center w-fit border"
                            style={{ backgroundColor: style.bg, color: style.text, borderColor: style.border }}
                          >
                            {role.type}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="py-2 px-6 align-middle text-left">
                      <Badge variant={getStatusBadgeProps(role.status).variant}>
                        {getStatusBadgeProps(role.status).label}
                      </Badge>
                    </td>
                    <td className="py-2 px-6 align-middle text-right">
                      <div className="flex items-center justify-end gap-[8px]">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 rounded-lg text-[#6B7280] hover:text-[#326594] hover:bg-[#326594]/5"
                          onClick={() => handleViewDetails(role)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {!isReviewer && !isOrgAdmin && !isDeptAdmin && (
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="h-8 w-8 rounded-lg text-[#6B7280] hover:text-[#EF4444] hover:bg-[#EF4444]/5"
                            onClick={() => handleEditClick(role)}
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

          {/* Pagination (Standardized) */}
          <div className="flex items-center justify-between mt-6 shrink-0">
            <div className="text-[13px] font-medium text-[#6B7280]">
              Showing {filteredRoles.length} of {filteredRoles.length} Roles
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-9 w-9 p-0 rounded-xl border-[#E5E7EB] hover:bg-[#F3F4F6]"
                disabled
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="text-[#6B7280] px-3 text-sm font-bold">
                Page 1 of 1
              </div>
              <Button
                size="sm"
                variant="outline"
                className="h-9 w-9 p-0 rounded-xl border-[#E5E7EB] hover:bg-[#F3F4F6]"
                disabled
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Create / Edit Role Modal - Unified BSDI Standard (Matching Applications Popup) */}
        <Dialog open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) setEditingRole(null);
        }}>
          <DialogContent className="w-[600px] max-w-[90vw] h-[500px] bg-white rounded-[16px] border border-[#E5E7EB] shadow-2xl p-0 overflow-hidden flex flex-col [&>button]:hidden">
            <div 
              className="absolute top-[16px] right-[16px] w-[32px] h-[32px] rounded-[8px] bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors z-50"
              onClick={() => setOpen(false)}
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </div>

            <DialogHeader className="pt-[24px] px-[28px] pb-[16px] border-b border-[#F3F4F6] shrink-0 pr-[64px]">
              <DialogTitle className="text-[18px] font-semibold text-[#EF4444]">
                {editingRole ? "Edit Role" : "Create New Role"}
              </DialogTitle>
              <DialogDescription className="text-[#6B7280] text-[14px] mt-1">
                Add and configure role permissions
              </DialogDescription>
            </DialogHeader>
            
            <div className="flex-1 min-h-0 px-[28px] py-[24px] overflow-y-auto custom-scrollbar">
              <div className="space-y-6">
                {/* Row 1: Name Role + Role Type (50/50 flex) */}
                <div className="flex items-center gap-[16px]">
                  <div className="flex-1 space-y-2">
                    <Label className="text-[#252628] font-medium text-sm">
                      Name Role <span className="text-[#EF4444]">*</span>
                    </Label>
                    <Input
                      className="h-[36px] px-3 border border-[#E5E7EB] bg-[#FFFFFF] rounded-[10px] text-[14px] focus:border-[#3D72A2] focus:ring-0 transition-all w-full"
                      placeholder="Enter role name"
                      value={editingRole ? editRoleName : roleName}
                      onChange={(e) => editingRole ? setEditRoleName(e.target.value) : setRoleName(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-[#252628] font-medium text-sm">
                      Role Type <span className="text-[#EF4444]">*</span>
                    </Label>
                    <Select value={editingRole ? editRoleType : roleType} onValueChange={(val) => editingRole ? setEditRoleType(val) : setRoleType(val)}>
                      <SelectTrigger className="h-[36px] px-3 border border-[#E5E7EB] bg-[#FFFFFF] rounded-[10px] text-[14px] focus:ring-0 transition-all w-full">
                        <SelectValue placeholder="Select role type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-[#E5E7EB] rounded-[10px]">
                        <SelectItem value="System">System</SelectItem>
                        <SelectItem value="Organization">Organization</SelectItem>
                        <SelectItem value="Department">Department</SelectItem>
                        <SelectItem value="Custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Row 2: Description (Full width) */}
                <div className="space-y-2">
                  <Label className="text-[#252628] font-medium text-sm">
                    Description <span className="text-[#EF4444]">*</span>
                  </Label>
                  <Textarea
                    className="min-h-[80px] h-[100px] p-3 border border-[#E5E7EB] bg-[#FFFFFF] rounded-[10px] text-[14px] focus:border-[#3D72A2] focus:ring-0 transition-all resize-none w-full"
                    placeholder="Brief description of role responsibilities"
                    value={editingRole ? editRoleDescription : rolePermissions}
                    onChange={(e) => editingRole ? setEditRoleDescription(e.target.value) : setRolePermissions(e.target.value)}
                  />
                </div>

                {/* Row 3: Users (Full width multi-select) */}
                <div className="space-y-2">
                  <Label className="text-[#252628] font-medium text-sm">
                    Users
                  </Label>
                  <div className="relative" ref={editingRole ? editDropdownRef : dropdownRef}>
                    <div 
                      className="min-h-[36px] p-1 pr-10 border border-[#E5E7EB] bg-[#FFFFFF] rounded-[10px] flex flex-wrap gap-1 items-center cursor-pointer focus-within:border-[#3D72A2] transition-all"
                      onClick={() => editingRole ? setIsEditUserDropdownOpen(!isEditUserDropdownOpen) : setIsUserDropdownOpen(!isUserDropdownOpen)}
                    >
                      {(editingRole ? editAssignedUsers : selectedUsers).length === 0 ? (
                        <span className="text-gray-400 text-sm px-2">Select users...</span>
                      ) : (
                        (editingRole ? editAssignedUsers : selectedUsers).map(userId => {
                          const user = allUsers.find(u => u.id === userId);
                          return (
                            <div key={userId} className="flex items-center gap-1 bg-[#F3F4F6] text-[#374151] px-2 py-0.5 rounded-[6px] text-[12px] font-medium border border-[#E5E7EB]">
                              {user?.name}
                              <X 
                                className="w-3 h-3 cursor-pointer hover:text-[#EF4444]" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editingRole ? handleEditUserToggle(userId) : handleUserToggle(userId);
                                }}
                              />
                            </div>
                          );
                        })
                      )}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isUserDropdownOpen || isEditUserDropdownOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                    {(editingRole ? isEditUserDropdownOpen : isUserDropdownOpen) && (
                      <div className="absolute z-[100] mt-2 w-full bg-white border border-[#E5E7EB] rounded-[10px] shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Search Bar inside dropdown */}
                        <div className="p-2 border-b border-[#F3F4F6] shrink-0">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <Input
                              autoFocus
                              className="h-[32px] pl-9 text-[13px] border border-[#F3F4F6] bg-[#F9FAFB] rounded-[6px] focus:border-[#3D72A2] focus:ring-0 transition-all w-full"
                              placeholder="Search users..."
                              value={userSearchQuery}
                              onChange={(e) => setUserSearchQuery(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>

                        {/* List */}
                        <div className="max-h-[200px] overflow-y-auto p-1 custom-scrollbar">
                          {filteredUsers.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-400">No users found</div>
                          ) : (
                            filteredUsers.map(user => (
                              <div 
                                key={user.id} 
                                className="flex items-center gap-3 px-3 py-2 hover:bg-[#F9FAFB] rounded-[8px] cursor-pointer transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editingRole ? handleEditUserToggle(user.id) : handleUserToggle(user.id);
                                }}
                              >
                                <Checkbox 
                                  checked={editingRole ? editAssignedUsers.includes(user.id) : selectedUsers.includes(user.id)}
                                  onCheckedChange={() => editingRole ? handleEditUserToggle(user.id) : handleUserToggle(user.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-[#EF4444]/10 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-[#EF4444]">
                                      {user.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                  <span className="text-sm font-medium text-[#374151]">{user.name}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white py-[16px] px-[28px] border-t border-[#F3F4F6] flex justify-end gap-[12px] shrink-0">
              <Button 
                variant="outline" 
                className="h-[36px] px-6 rounded-[10px] border border-[#E5E7EB] bg-white text-[#374151] font-medium hover:bg-gray-50 transition-all"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                className="h-[36px] px-6 rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold shadow-sm transition-all"
                onClick={editingRole ? handleEditRole : handleCreateRole}
              >
                {editingRole ? "Update Role" : "Create Role"}
              </Button>
            </div>

          </DialogContent>
        </Dialog>

        {/* Edit Role Dialog */}
        {/* Role View Modal - Standardized (Matching Service Details) */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="w-[480px] max-w-[95vw] h-fit max-h-[90vh] flex flex-col p-0 bg-white rounded-[16px] border-0 shadow-2xl overflow-hidden [&>button]:hidden">
            {/* Sticky Header */}
            <div className="sticky top-0 z-10 bg-white px-6 py-5 border-b border-[#F1F5F9] shrink-0 relative text-left">
              <button 
                className="absolute right-6 top-6 p-1 text-[#9CA3AF] hover:text-[#111827] transition-colors cursor-pointer"
                onClick={() => setIsViewOpen(false)}
              >
                <X className="w-4 h-4" />
              </button>
              <DialogHeader className="gap-1 px-0">
                <DialogTitle className="text-[18px] font-semibold text-[#EF4444] leading-tight">
                  Role Details
                </DialogTitle>
                <DialogDescription className="text-[13px] text-[#6B7280]">
                  View detailed information about this role
                </DialogDescription>
              </DialogHeader>
            </div>


            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar text-left">
              <div className="grid grid-cols-2 gap-x-[24px] gap-y-[16px]">
                {/* Role Name */}
                <div className="flex flex-col">
                  <span className="text-[12px] font-normal text-[#6B7280] mb-1">Role Name</span>
                  <span className="text-[14px] font-semibold text-[#111827]">
                    {viewingRole?.name}
                  </span>
                </div>

                {/* Role Type */}
                <div className="flex flex-col">
                  <span className="text-[12px] font-normal text-[#6B7280] mb-1">Role Type</span>
                  <div className="flex items-center">
                    {(() => {
                      const typeStyles: Record<string, { bg: string; text: string; border: string }> = {
                        "System": { bg: "#F3F4F6", text: "#374151", border: "#E5E7EB" },
                        "Organization": { bg: "#DBEAFE", text: "#1D4ED8", border: "#BFDBFE" },
                        "Department": { bg: "#FEF3C7", text: "#92400E", border: "#FDE68A" },
                        "Custom": { bg: "#F3E8FF", text: "#6B21A8", border: "#E9D5FF" },
                      };
                      const style = typeStyles[viewingRole?.type || "Custom"] || typeStyles["Custom"];
                      return (
                        <span 
                          className="h-[24px] px-[10px] rounded-full text-[12px] font-[600] leading-none whitespace-nowrap flex items-center justify-center w-fit border"
                          style={{ backgroundColor: style.bg, color: style.text, borderColor: style.border }}
                        >
                          {viewingRole?.type}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col">
                  <span className="text-[12px] font-normal text-[#6B7280] mb-1">Description</span>
                  <span className="text-[14px] font-semibold text-[#111827] leading-relaxed">
                    {viewingRole?.permissions}
                  </span>
                </div>

                {/* Status */}
                <div className="flex flex-col">
                  <span className="text-[12px] font-normal text-[#6B7280] mb-1">Status</span>
                  <div className="flex items-center">
                    <Badge variant={getStatusBadgeProps(viewingRole?.status || "").variant}>
                      {getStatusBadgeProps(viewingRole?.status || "").label}
                    </Badge>
                  </div>
                </div>

                {/* Assigned Users */}
                <div className="flex flex-col col-span-2 mt-2">
                  <span className="text-[12px] font-normal text-[#6B7280] mb-1">Assigned Users</span>
                  <div className="flex items-center gap-2 text-[14px] font-semibold text-[#111827]">
                    <Users className="w-4 h-4 text-[#6B7280]" />
                    <span>{viewingRole?.users} Users</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 z-10 bg-white px-6 py-4 border-t border-[#F1F5F9] flex justify-end shrink-0">
              <Button 
                variant="default" 
                className="h-[36px] px-6 rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white text-sm font-medium transition-colors"
                onClick={() => setIsViewOpen(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>


        {/* Create Success Dialog */}
        <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
          <DialogContent className="max-w-[400px] bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
            <div className="px-8 pt-8 pb-8">
              <DialogHeader className="sr-only">
                <DialogTitle>Role Created Successfully</DialogTitle>
                <DialogDescription>The role has been created</DialogDescription>
              </DialogHeader>
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 rounded-full blur-2xl scale-150"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(16,185,129,0.4)]">
                      <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2} />
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#10B981]/30 animate-ping"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#1A1A1A]">Created Successfully</h3>
                  <p className="text-[#6B6B6B] text-sm">
                    The new role has been successfully created.
                  </p>
                </div>
                <div className="space-y-3 pt-4">
                  <Button
                    onClick={() => setSuccessOpen(false)}
                    className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_32px_rgba(16,185,129,0.4)] transition-all duration-300 font-semibold"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Update Success Dialog */}
        <Dialog open={updateSuccessDialogOpen} onOpenChange={setUpdateSuccessDialogOpen}>
          <DialogContent className="max-w-[400px] bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
            <div className="px-8 pt-8 pb-8">
              <DialogHeader className="sr-only">
                <DialogTitle>Role Updated Successfully</DialogTitle>
                <DialogDescription>Modifications have been saved</DialogDescription>
              </DialogHeader>
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 rounded-full blur-2xl scale-150"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(16,185,129,0.4)]">
                      <CheckCircle2 className="w-10 h-10 text-white" strokeWidth={2} />
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#10B981]/30 animate-ping"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#1A1A1A]">Updated Successfully</h3>
                  <p className="text-[#6B6B6B] text-sm">
                    The role has been successfully updated.
                  </p>
                </div>
                <div className="space-y-3 pt-4">
                  <Button
                    onClick={() => setUpdateSuccessDialogOpen(false)}
                    className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_32px_rgba(16,185,129,0.4)] transition-all duration-300 font-semibold"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Users Side Panel */}
      {isUsersPanelOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={handleCloseUsersPanel}
          />
          
          {/* Side Panel */}
          <div className={`fixed top-0 right-0 h-full w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isUsersPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="p-8 border-b border-[#F3F4F6] bg-white">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#EF4444]/5 flex items-center justify-center">
                      <Users className="w-6 h-6 text-[#EF4444]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[#111827]">Role Users</h2>
                      <p className="text-sm text-[#6B7280] mt-0.5">{selectedRoleForUsers?.name}</p>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={handleCloseUsersPanel}
                    className="w-10 h-10 p-0 rounded-xl"
                  >
                    <X className="w-5 h-5 text-[#6B7280]" />
                  </Button>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="default" className="px-3 py-1 text-sm rounded-lg font-semibold bg-[#EF4444]/10 text-[#EF4444] border-0">
                    {selectedRoleForUsers?.users} Total Users
                  </Badge>
                  <Badge variant="secondary" className="px-3 py-1 text-sm rounded-lg font-medium border-[#F3F4F6]">
                    {selectedRoleForUsers?.type}
                  </Badge>
                </div>
              </div>

              {/* Users List */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="space-y-3">
                  {selectedRoleForUsers && roleUserMapping[selectedRoleForUsers.id]?.slice(0, 15).map((userId) => {
                    const user = allUsers.find(u => u.id === userId);
                    if (!user) return null;
                    return (
                      <div 
                        key={userId}
                        className="p-4 rounded-xl border border-[#E0E0E0] hover:border-[#003F72]/30 hover:bg-gradient-to-r hover:from-[#003F72]/5 hover:to-transparent transition-all cursor-pointer group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EF4444]/10 to-[#003F72]/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-bold text-[#EF4444]">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#1a1a1a] truncate group-hover:text-[#003F72] transition-colors">
                              {user.name}
                            </p>
                            <p className="text-xs text-[#666666] truncate">{user.email}</p>
                            <p className="text-xs text-[#999999] truncate mt-0.5">{user.department}</p>
                          </div>
                          <Badge className="bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200 border text-xs px-2 py-1">
                            {user.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                  
                  {/* Show message if more users exist */}
                  {selectedRoleForUsers && roleUserMapping[selectedRoleForUsers.id] && roleUserMapping[selectedRoleForUsers.id]!.length > 15 && (
                    <div className="p-4 rounded-xl border-2 border-dashed border-[#E0E0E0] text-center">
                      <p className="text-sm text-[#666666]">
                        + {roleUserMapping[selectedRoleForUsers.id]!.length - 15} more users
                      </p>
                      <p className="text-xs text-[#999999] mt-1">
                        Showing first 15 users
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-8 border-t border-[#F3F4F6] bg-white">
                <Button
                  variant="default"
                  onClick={handleCloseUsersPanel}
                  className="w-full h-12 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}