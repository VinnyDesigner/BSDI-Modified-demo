import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Shield, Plus, Users, Edit, CheckCircle2, X, Search, Trash2, AlertTriangle, MapPin, Layers, ArrowRight, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Checkbox } from "../../components/ui/checkbox";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router";


const permissions = [
  { id: 1, name: "GIS Data Access", type: "Application", users: 142, description: "Access spatial data layers", status: "active", spatialGroups: ["Northern Region", "Capital Area"] },
  { id: 2, name: "Map Editing Team", type: "Application", users: 89, description: "Edit spatial features and boundaries", status: "active", spatialGroups: ["Southern Region"] },
  { id: 3, name: "Spatial Review Team", type: "Custom", users: 67, description: "Approve spatial submissions", status: "active", spatialGroups: ["Central Region", "Eastern Coast"] },
  { id: 4, name: "Metadata Management", type: "Data", users: 189, description: "Manage metadata records", status: "active", spatialGroups: [] },
  { id: 5, name: "API Access Group", type: "Custom", users: 56, description: "Access to API services", status: "active", spatialGroups: ["Northern Region"] },
  { id: 6, name: "Data Reviewers", type: "Data", users: 245, description: "Review and approve data submissions", status: "active", spatialGroups: ["Capital Area", "Southern Region", "Western District"] },
  { id: 7, name: "System Monitoring", type: "Custom", users: 23, description: "Monitor system operations", status: "active", spatialGroups: [] },
];

const organizationUsers = [
  { id: 1, name: "Ahmed Hassan", role: "GIS Analyst", avatar: "AH" },
  { id: 2, name: "Fatima Ali", role: "Data Reviewer", avatar: "MK" },
  { id: 3, name: "Khalid Noor", role: "Metadata Editor", avatar: "KN" },
  { id: 4, name: "Noor Salman", role: "Department Admin", avatar: "NS" },
  { id: 5, name: "Lulwa Saad Mujaddam", role: "GIS Specialist", avatar: "SM" },
  { id: 6, name: "Ali Hussain", role: "Spatial Analyst", avatar: "AH" },
  { id: 7, name: "Maryam Khalid", role: "Data Manager", avatar: "MR" },
  { id: 8, name: "Omar Rashid", role: "System Admin", avatar: "OR" },
];

// Spatial Groups data
const spatialGroupsData = [
  { id: 1, name: "Northern Region", description: "Muharraq and Northern areas", type: "Regional", area: "245 km²", color: "#3B82F6" },
  { id: 2, name: "Capital Area", description: "Manama and surrounding districts", type: "Regional", area: "180 km²", color: "#10B981" },
  { id: 3, name: "Southern Region", description: "Riffa, Sitra and Southern areas", type: "Regional", area: "320 km²", color: "#F59E0B" },
  { id: 4, name: "Central Region", description: "Central Bahrain districts", type: "Regional", area: "156 km²", color: "#8B5CF6" },
  { id: 5, name: "Eastern Coast", description: "Coastal zones and marine areas", type: "Specialized", area: "95 km²", color: "#06B6D4" },
  { id: 6, name: "Western District", description: "Western development zones", type: "Development", area: "278 km²", color: "#EC4899" },
  { id: 7, name: "Industrial Zones", description: "Industrial and commercial areas", type: "Specialized", area: "134 km²", color: "#6366F1" },
  { id: 8, name: "Heritage Sites", description: "Protected cultural and heritage areas", type: "Protected", area: "42 km²", color: "#EF4444" },
  { id: 9, name: "Agricultural Land", description: "Farming and agricultural zones", type: "Specialized", area: "189 km²", color: "#84CC16" },
  { id: 10, name: "Coastal Development", description: "Beachfront and coastal development", type: "Development", area: "67 km²", color: "#14B8A6" },
];

export default function Roles2() {
  const navigate = useNavigate();
  const location = useLocation();
  const isReviewer = location.pathname.includes("/reviewer");
  const isOrgAdmin = location.pathname.includes("/entity-admin");
  const isDeptAdmin = location.pathname.includes("/department");
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [permissionName, setPermissionName] = useState("");
  const [permissionDescription, setPermissionDescription] = useState("");
  const [selectedOrg, setSelectedOrg] = useState("");
  const [roleType, setRoleType] = useState("Custom");
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Spatial Groups state
  const [selectedSpatialGroups, setSelectedSpatialGroups] = useState<string[]>([]);
  const [spatialGroupModalOpen, setSpatialGroupModalOpen] = useState(false);
  const [spatialGroupSearchQuery, setSpatialGroupSearchQuery] = useState("");
  const [enableSpatialGroup, setEnableSpatialGroup] = useState(false);

  // Edit Permission state
  const [editOpen, setEditOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState<typeof permissions[0] | null>(null);
  const [editPermissionName, setEditPermissionName] = useState("");
  const [editPermissionDescription, setEditPermissionDescription] = useState("");
  const [editSelectedOrg, setEditSelectedOrg] = useState("");
  const [editRoleType, setEditRoleType] = useState("Custom");
  const [editSelectedUsers, setEditSelectedUsers] = useState<number[]>([]);
  const [editUserSearchQuery, setEditUserSearchQuery] = useState("");
  const [isEditUserDropdownOpen, setIsEditUserDropdownOpen] = useState(false);
  const editDropdownRef = useRef<HTMLDivElement>(null);
  const [userStatuses, setUserStatuses] = useState<Record<number, string>>({});
  const [editSelectedSpatialGroups, setEditSelectedSpatialGroups] = useState<string[]>([]);
  const [editEnableSpatialGroup, setEditEnableSpatialGroup] = useState(false);

  // Delete confirmation dialog state
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [deleteSuccessDialogOpen, setDeleteSuccessDialogOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<typeof permissions[0] | null>(null);

  const [createConfirmDialogOpen, setCreateConfirmDialogOpen] = useState(false);
  const [updateConfirmDialogOpen, setUpdateConfirmDialogOpen] = useState(false);
  const [updateSuccessDialogOpen, setUpdateSuccessDialogOpen] = useState(false);

  // Get current role path for navigation
  const getCurrentRolePath = () => {
    const path = location.pathname;
    if (path.includes('/super-admin/')) return 'super-admin';
    if (path.includes('/entity-admin/')) return 'entity-admin';
    if (path.includes('/department/')) return 'department';
    if (path.includes('/monitoring/')) return 'monitoring';
    return 'user';
  };

  // Handle click outside to close dropdowns
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

  // Handle return from Spatial Group Selection page
  useEffect(() => {
    if (location.state?.selectedSpatialGroups) {
      const { selectedSpatialGroups: groups, mode } = location.state;

      if (mode === "create") {
        setSelectedSpatialGroups(groups);
      } else if (mode === "edit") {
        setEditSelectedSpatialGroups(groups);
      }

      // Clear the navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleNavigateToSpatialGroupSelection = (mode: "create" | "edit") => {
    const rolePath = getCurrentRolePath();
    const returnPath = `/dashboard/${rolePath}/roles2`;

    navigate(`/dashboard/${rolePath}/spatial-group-selection`, {
      state: {
        returnPath,
        existingSelections: mode === "create" ? selectedSpatialGroups : editSelectedSpatialGroups,
        mode,
      },
    });
  };

  const handleCreatePermissionClick = () => {
    if (!permissionName || selectedUsers.length === 0) {
      toast.error("Permission name and at least one user are required");
      return;
    }
    setCreateConfirmDialogOpen(true);
  };

  const handleCreatePermission = () => {
    toast.success("Permission created successfully");
    setOpen(false);
    setCreateConfirmDialogOpen(false);
    setSuccessOpen(true);
    // Reset states
    setPermissionName("");
    setSelectedOrg("");
    setSelectedUsers([]);
    setSelectedSpatialGroups([]);
    setEnableSpatialGroup(false);
  };

  const handleToggleUser = (userId: number) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleEditPermissionClick = (permission: typeof permissions[0]) => {
    setEditingPermission(permission);
    setEditPermissionName(permission.name);
    setEditPermissionDescription(permission.description);
    setEditSelectedOrg("ministry-housing"); // Default organization
    setEditRoleType("Custom"); // Default to Custom
    // Pre-populate with first 3 users for demo
    setEditSelectedUsers([1, 2, 3]);
    // Initialize user statuses
    const initialStatuses: Record<number, string> = {};
    [1, 2, 3].forEach(id => {
      initialStatuses[id] = "active";
    });
    setUserStatuses(initialStatuses);
    setEditUserSearchQuery("");
    setEditOpen(true);
    setEditSelectedSpatialGroups(permission.spatialGroups);
    setEditEnableSpatialGroup(permission.spatialGroups.length > 0);
  };

  const handleEditToggleUser = (userId: number) => {
    setEditSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
    // Initialize status for newly added users
    if (!editSelectedUsers.includes(userId)) {
      setUserStatuses(prev => ({ ...prev, [userId]: "active" }));
    }
  };

  const handleRemoveSelectedUser = (userId: number) => {
    setEditSelectedUsers(prev => prev.filter(id => id !== userId));
  };

  const handleUserStatusChange = (userId: number, status: string) => {
    setUserStatuses(prev => ({ ...prev, [userId]: status }));
  };

  const handleUpdatePermissionClick = () => {
    if (!editPermissionName || editSelectedUsers.length === 0) {
      toast.error("Permission name and at least one user are required");
      return;
    }
    setUpdateConfirmDialogOpen(true);
  };

  const handleUpdatePermission = () => {
    toast.success("Permission updated successfully");
    setEditOpen(false);
    setUpdateConfirmDialogOpen(false);
    setUpdateSuccessDialogOpen(true);
    // Reset states
    setEditingPermission(null);
    setEditPermissionName("");
    setEditPermissionDescription("");
    setEditSelectedOrg("");
    setEditRoleType("Custom");
    setEditSelectedUsers([]);
    setEditUserSearchQuery("");
    setUserStatuses({});
    setEditSelectedSpatialGroups([]);
    setEditEnableSpatialGroup(false);
  };

  const handleDeletePermissionClick = (permission: typeof permissions[0]) => {
    setPermissionToDelete(permission);
    setDeleteConfirmDialogOpen(true);
  };

  const handleDeletePermission = () => {
    if (!permissionToDelete) return;

    toast.success("Permission deleted successfully");
    setDeleteConfirmDialogOpen(false);
    setDeleteSuccessDialogOpen(true);
    // Reset states
    setPermissionToDelete(null);
  };

  // Filter users based on search query
  const filteredEditUsers = organizationUsers.filter(user =>
    user.name.toLowerCase().includes((editOpen ? editUserSearchQuery : userSearchQuery).toLowerCase()) ||
    user.role.toLowerCase().includes((editOpen ? editUserSearchQuery : userSearchQuery).toLowerCase())
  );

  const isCreateDisabled = !permissionName || selectedUsers.length === 0;

  // Spatial Groups handlers
  const handleToggleSpatialGroup = (groupName: string) => {
    setSelectedSpatialGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const handleEditToggleSpatialGroup = (groupName: string) => {
    setEditSelectedSpatialGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const filteredSpatialGroups = spatialGroupsData.filter(group =>
    group.name.toLowerCase().includes(spatialGroupSearchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(spatialGroupSearchQuery.toLowerCase()) ||
    group.type.toLowerCase().includes(spatialGroupSearchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-[#e8ecf1] to-[#dfe4ea] px-10 py-6">
      <div className="max-w-[1800px] mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-[26px] font-bold text-[#ED1C24]">Security Access Group</h1>
            <p className="text-[#4A5565] text-[14px] font-normal">Manage Security Access Group assign users to Access groups</p>
          </div>
          {!isReviewer && !isOrgAdmin && (
            <Button
              onClick={() => setOpen(true)}
              className="bg-gradient-to-r from-[#ED1C24] to-[#d41820] hover:from-[#d41820] hover:to-[#c0151b] text-white rounded-xl h-12 px-6 shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Security Access Group
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="relative h-[106px] bg-white/90 backdrop-blur-xl border-0 rounded-[24px] shadow-[8px_8px_24px_rgba(163,177,198,0.3),-8px_-8px_24px_rgba(255,255,255,0.8)] hover:shadow-[12px_12px_32px_rgba(163,177,198,0.4),-12px_-12px_32px_rgba(255,255,255,1)] transition-all duration-300 hover:translate-y-[-4px] overflow-hidden">
            <div className="absolute right-[24px] top-[37px] w-[30px] h-[30px] flex items-center justify-center">
              <Shield className="w-[30px] h-[30px] text-[#ED1C24]" style={{ strokeWidth: 2 }} />
            </div>
            <div className="absolute left-[23.88px] top-[18px] flex flex-col gap-1">
              <div className="text-[26px] font-semibold text-[#ED1C24]">
                38
              </div>
              <div className="text-[14px] font-normal text-black/50">Total Spatial Access</div>
            </div>
          </Card>

          <Card className="relative h-[106px] bg-white/90 backdrop-blur-xl border-0 rounded-[24px] shadow-[8px_8px_24px_rgba(163,177,198,0.3),-8px_-8px_24px_rgba(255,255,255,0.8)] hover:shadow-[12px_12px_32px_rgba(163,177,198,0.4),-12px_-12px_32px_rgba(255,255,255,1)] transition-all duration-300 hover:translate-y-[-4px] overflow-hidden">
            <div className="absolute right-[24px] top-[37px] w-[30px] h-[30px] flex items-center justify-center">
              <Users className="w-[30px] h-[30px] text-[#003F72]" style={{ strokeWidth: 2 }} />
            </div>
            <div className="absolute left-[23.88px] top-[18px] flex flex-col gap-1">
              <div className="text-[26px] font-semibold text-[#ED1C24]">
                811
              </div>
              <div className="text-[14px] font-normal text-black/50">
                Assigned Users
              </div>
            </div>
          </Card>


        </div>

        <Card className="p-0 bg-white/90 backdrop-blur-xl border-0 rounded-3xl shadow-[8px_8px_24px_rgba(163,177,198,0.3),-8px_-8px_24px_rgba(255,255,255,0.8)] overflow-hidden">
          {/* Table Header */}
          <div className="p-6 border-b border-[#E5E5E5]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ED1C24]/10 to-[#FF6B6B]/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-[#ED1C24]" />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-[26px] font-semibold text-[#ED1C24]">Security Access Group</h3>
                  <p className="text-[14px] font-normal text-black/50">Manage Security Access Group assign users to Access groups</p>
                </div>
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-[#E5E5E5] bg-gradient-to-r from-gray-50 to-white">
                  <th className="text-left py-4 px-6 text-xs font-bold text-[#ED1C24] uppercase tracking-wider">
                    Security Group Name
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-[#ED1C24] uppercase tracking-wider">
                    Description
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-[#ED1C24] uppercase tracking-wider">
                    Assigned Users Count
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-[#ED1C24] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-bold text-[#ED1C24] uppercase tracking-wider">
                    Security Access Group
                  </th>
                  <th className="text-center py-4 px-6 text-xs font-bold text-[#ED1C24] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((permission, index) => (
                  <tr
                    key={permission.id}
                    className={`border-b border-[#E5E5E5]/50 hover:bg-gradient-to-r hover:from-red-50/20 hover:to-transparent transition-all group ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/20'
                      }`}
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ED1C24]/10 to-[#003F72]/10 flex items-center justify-center flex-shrink-0">
                          <Shield className="w-5 h-5 text-[#ED1C24]" />
                        </div>
                        <div>
                          <div className="font-semibold text-[#1a1a1a] text-sm">{permission.name}</div>
                          <div className="text-xs text-[#666666]">ID: {permission.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-[#666666] font-medium">
                      {permission.description}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#003F72]" />
                        <span className="text-sm font-semibold text-[#1a1a1a]">{permission.users} Users</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        className="bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-700 border-emerald-200 border text-xs font-semibold px-3 py-1 capitalize"
                      >
                        {permission.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-6">
                      {permission.spatialGroups.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {permission.spatialGroups.map((group, idx) => (
                            <Badge
                              key={idx}
                              className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200 border text-xs font-medium px-2 py-0.5"
                            >
                              <MapPin className="w-3 h-3 mr-1" />
                              {group}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-[#999999] italic">Not Assigned</span>
                      )}
                    </td>
                      <div className="flex items-center justify-center gap-2">
                        {isReviewer || isOrgAdmin || isDeptAdmin ? (
                          <Button
                            size="sm"
                            className="bg-white hover:bg-gradient-to-r hover:from-[#ED1C24] hover:to-[#FF6B6B] text-[#252628] hover:text-white border border-[#ED1C24]/30 hover:border-transparent rounded-full h-8 px-3 transition-all"
                            onClick={() => handleEditPermissionClick(permission)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              className="bg-white hover:bg-gradient-to-r hover:from-[#ED1C24] hover:to-[#FF6B6B] text-[#252628] hover:text-white border border-[#ED1C24]/30 hover:border-transparent rounded-full h-8 px-3 transition-all"
                              onClick={() => handleEditPermissionClick(permission)}
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              size="sm"
                              className="bg-white hover:bg-gradient-to-r hover:from-[#ED1C24] hover:to-[#FF6B6B] text-[#252628] hover:text-white border border-[#ED1C24]/30 hover:border-transparent rounded-full h-8 px-3 transition-all"
                              onClick={() => handleDeletePermissionClick(permission)}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        )}
                      </div>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-6 border-t border-[#E5E5E5] bg-gray-50/30">
            <div className="flex items-center justify-between">
              <div className="text-sm text-[#666666]">
                Showing {permissions.length} of {permissions.length} permissions
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-3 rounded-lg border-[#E0E0E0]"
                  disabled
                >
                  Previous
                </Button>
                <div className="text-sm text-[#666666] px-3">
                  Page 1 of 1
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 px-3 rounded-lg border-[#E0E0E0]"
                  disabled
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Dialog open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) {
            setPermissionName("");
            setPermissionDescription("");
            setRoleType("Custom");
            setSelectedUsers([]);
          }
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
                Create New Role
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
                      value={permissionName}
                      onChange={(e) => setPermissionName(e.target.value)}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-[#252628] font-medium text-sm">
                      Role Type <span className="text-[#EF4444]">*</span>
                    </Label>
                    <Select value={roleType} onValueChange={(val) => setRoleType(val)}>
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
                    value={permissionDescription}
                    onChange={(e) => setPermissionDescription(e.target.value)}
                  />
                </div>

                {/* Row 3: Users (Full width multi-select) */}
                <div className="space-y-2">
                  <Label className="text-[#252628] font-medium text-sm">
                    Users
                  </Label>
                  <div className="relative" ref={dropdownRef}>
                    <div 
                      className="min-h-[36px] p-1 pr-10 border border-[#E5E7EB] bg-[#FFFFFF] rounded-[10px] flex flex-wrap gap-1 items-center cursor-pointer focus-within:border-[#3D72A2] transition-all"
                      onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    >
                      {selectedUsers.length === 0 ? (
                        <span className="text-gray-400 text-sm px-2">Select users...</span>
                      ) : (
                        selectedUsers.map(userId => {
                          const user = organizationUsers.find(u => u.id === userId);
                          return (
                            <div key={userId} className="flex items-center gap-1 bg-[#F3F4F6] text-[#374151] px-2 py-0.5 rounded-[6px] text-[12px] font-medium border border-[#E5E7EB]">
                              {user?.name}
                              <X 
                                className="w-3 h-3 cursor-pointer hover:text-[#EF4444]" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleUser(userId);
                                }}
                              />
                            </div>
                          );
                        })
                      )}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <Search className="w-4 h-4" />
                      </div>
                    </div>

                    {isUserDropdownOpen && (
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
                          {filteredEditUsers.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-400">No users found</div>
                          ) : (
                            filteredEditUsers.map(user => (
                              <div 
                                key={user.id} 
                                className="flex items-center gap-3 px-3 py-2 hover:bg-[#F9FAFB] rounded-[8px] cursor-pointer transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleUser(user.id);
                                }}
                              >
                                <Checkbox 
                                  checked={selectedUsers.includes(user.id)}
                                  onCheckedChange={() => handleToggleUser(user.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-[#ED1C24]/10 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-[#ED1C24]">
                                      {user.avatar}
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

                {/* Spatial Group Field (Preserved) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="enable-spatial-group"
                      checked={enableSpatialGroup}
                      onCheckedChange={(checked) => {
                        setEnableSpatialGroup(checked as boolean);
                        if (!checked) {
                          setSelectedSpatialGroups([]);
                        }
                      }}
                      className="border-[#E0E0E0] data-[state=checked]:bg-[#ED1C24] data-[state=checked]:border-[#ED1C24] h-5 w-5"
                    />
                    <Label htmlFor="enable-spatial-group" className="text-[#252628] font-medium text-sm cursor-pointer">
                      Security Access Group
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => enableSpatialGroup && window.open("https://score-savvy-58161857.figma.site", "_blank")}
                    disabled={!enableSpatialGroup}
                    className="w-full h-12 justify-start text-left font-normal border border-[#E0E0E0] rounded-xl px-4 hover:bg-gray-50 hover:border-[#ED1C24]/50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-[#E0E0E0]"
                  >
                    {selectedSpatialGroups.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 flex-1">
                        {selectedSpatialGroups.map((group, idx) => (
                          <Badge
                            key={idx}
                            className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200 border text-xs font-medium px-2 py-0.5"
                          >
                            <MapPin className="w-3 h-3 mr-1" />
                            {group}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[#999999] text-sm flex-1">
                        {enableSpatialGroup ? "Select security access group(s)" : "Enable to select security access groups"}
                      </span>
                    )}
                    <ArrowRight className={`w-4 h-4 ml-2 transition-all ${enableSpatialGroup ? 'text-[#666666] group-hover:text-[#ED1C24] group-hover:translate-x-1' : 'text-[#cccccc]'}`} />
                  </Button>
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
                onClick={handleCreatePermissionClick}
              >
                Create Role
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="w-[600px] max-w-[90vw] h-[500px] bg-white rounded-[16px] border border-[#E5E7EB] shadow-2xl p-0 overflow-hidden flex flex-col [&>button]:hidden">
            <div 
              className="absolute top-[16px] right-[16px] w-[32px] h-[32px] rounded-[8px] bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors z-50"
              onClick={() => setEditOpen(false)}
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </div>

            <DialogHeader className="pt-[24px] px-[28px] pb-[16px] border-b border-[#F3F4F6] shrink-0 pr-[64px]">
              <DialogTitle className="text-[16px] font-semibold text-[#EF4444]">
                {isReviewer || isOrgAdmin ? "Role Details" : "Edit Role"}
              </DialogTitle>
              <DialogDescription className="text-[#6B7280] text-[14px] mt-[2px]">
                {isReviewer || isOrgAdmin ? "View role configuration" : "Update role permissions"}
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
                      value={editPermissionName}
                      onChange={(e) => setEditPermissionName(e.target.value)}
                      disabled={isReviewer || isOrgAdmin}
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-[#252628] font-medium text-sm">
                      Role Type <span className="text-[#EF4444]">*</span>
                    </Label>
                    <Select value={editRoleType} onValueChange={(val) => setEditRoleType(val)} disabled={isReviewer || isOrgAdmin}>
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
                    value={editPermissionDescription}
                    onChange={(e) => setEditPermissionDescription(e.target.value)}
                    disabled={isReviewer || isOrgAdmin}
                  />
                </div>

                {/* Row 3: Users (Full width multi-select) */}
                <div className="space-y-2">
                  <Label className="text-[#252628] font-medium text-sm">
                    Users
                  </Label>
                  <div className="relative" ref={editDropdownRef}>
                    <div 
                      className="min-h-[36px] p-1 pr-10 border border-[#E5E7EB] bg-[#FFFFFF] rounded-[10px] flex flex-wrap gap-1 items-center cursor-pointer focus-within:border-[#3D72A2] transition-all"
                      onClick={() => !isReviewer && !isOrgAdmin && setIsEditUserDropdownOpen(!isEditUserDropdownOpen)}
                    >
                      {editSelectedUsers.length === 0 ? (
                        <span className="text-gray-400 text-sm px-2">Select users...</span>
                      ) : (
                        editSelectedUsers.map(userId => {
                          const user = organizationUsers.find(u => u.id === userId);
                          return (
                            <div key={userId} className="flex items-center gap-1 bg-[#F3F4F6] text-[#374151] px-2 py-0.5 rounded-[6px] text-[12px] font-medium border border-[#E5E7EB]">
                              {user?.name}
                              {!isReviewer && !isOrgAdmin && (
                                <X 
                                  className="w-3 h-3 cursor-pointer hover:text-[#EF4444]" 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditToggleUser(userId);
                                  }}
                                />
                              )}
                            </div>
                          );
                        })
                      )}
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                        <Search className="w-4 h-4" />
                      </div>
                    </div>

                    {isEditUserDropdownOpen && (
                      <div className="absolute z-[100] mt-2 w-full bg-white border border-[#E5E7EB] rounded-[10px] shadow-xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                        {/* Search Bar inside dropdown */}
                        <div className="p-2 border-b border-[#F3F4F6] shrink-0">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <Input
                              autoFocus
                              className="h-[32px] pl-9 text-[13px] border border-[#F3F4F6] bg-[#F9FAFB] rounded-[6px] focus:border-[#3D72A2] focus:ring-0 transition-all w-full"
                              placeholder="Search users..."
                              value={editUserSearchQuery}
                              onChange={(e) => setEditUserSearchQuery(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>

                        {/* List */}
                        <div className="max-h-[200px] overflow-y-auto p-1 custom-scrollbar">
                          {filteredEditUsers.length === 0 ? (
                            <div className="p-4 text-center text-sm text-gray-400">No users found</div>
                          ) : (
                            filteredEditUsers.map(user => (
                              <div 
                                key={user.id} 
                                className="flex items-center gap-3 px-3 py-2 hover:bg-[#F9FAFB] rounded-[8px] cursor-pointer transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditToggleUser(user.id);
                                }}
                              >
                                <Checkbox 
                                  checked={editSelectedUsers.includes(user.id)}
                                  onCheckedChange={() => handleEditToggleUser(user.id)}
                                  onClick={(e) => e.stopPropagation()}
                                />
                                <div className="flex items-center gap-2">
                                  <div className="w-6 h-6 rounded-full bg-[#ED1C24]/10 flex items-center justify-center">
                                    <span className="text-[10px] font-bold text-[#ED1C24]">
                                      {user.avatar}
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

                {/* Spatial Group Field (Preserved) */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="edit-enable-spatial-group"
                      checked={editEnableSpatialGroup}
                      onCheckedChange={(checked) => {
                        setEditEnableSpatialGroup(checked as boolean);
                        if (!checked) {
                          setEditSelectedSpatialGroups([]);
                        }
                      }}
                      className="border-[#E0E0E0] data-[state=checked]:bg-[#ED1C24] data-[state=checked]:border-[#ED1C24] h-5 w-5"
                      disabled={isReviewer || isOrgAdmin}
                    />
                    <Label htmlFor="edit-enable-spatial-group" className="text-[#252628] font-medium text-sm cursor-pointer">
                      Security Access Group
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => editEnableSpatialGroup && window.open("https://score-savvy-58161857.figma.site", "_blank")}
                    disabled={!editEnableSpatialGroup || isReviewer || isOrgAdmin}
                    className="w-full h-12 justify-start text-left font-normal border border-[#E0E0E0] rounded-xl px-4 hover:bg-gray-50 hover:border-[#ED1C24]/50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-[#E0E0E0]"
                  >
                    {editSelectedSpatialGroups.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 flex-1">
                        {editSelectedSpatialGroups.map((group, idx) => (
                          <Badge
                            key={idx}
                            className="bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border-blue-200 border text-xs font-medium px-2 py-0.5"
                          >
                            <MapPin className="w-3 h-3 mr-1" />
                            {group}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[#999999] text-sm flex-1">
                        {editEnableSpatialGroup ? "Select security access group(s)" : "Enable to select security access groups"}
                      </span>
                    )}
                    <ArrowRight className={`w-4 h-4 ml-2 transition-all ${editEnableSpatialGroup ? 'text-[#666666] group-hover:text-[#ED1C24] group-hover:translate-x-1' : 'text-[#cccccc]'}`} />
                  </Button>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white py-[16px] px-[28px] border-t border-[#F3F4F6] flex justify-end gap-[12px] shrink-0">
              <Button 
                variant="outline" 
                className="h-[36px] px-6 rounded-[10px] border border-[#E5E7EB] bg-white text-[#374151] font-medium hover:bg-gray-50 transition-all"
                onClick={() => setEditOpen(false)}
              >
                {isReviewer || isOrgAdmin ? "Close" : "Cancel"}
              </Button>
              {!(isReviewer || isOrgAdmin) && (
                <Button 
                  className="h-[36px] px-6 rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold shadow-sm transition-all"
                  onClick={handleUpdatePermissionClick}
                >
                  Update Role
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmDialogOpen} onOpenChange={setDeleteConfirmDialogOpen}>
          <DialogContent className="max-w-md bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
            <div className="px-8 pt-8 pb-8">
              <DialogHeader className="sr-only">
                <DialogTitle>Delete Permission Confirmation</DialogTitle>
                <DialogDescription>Confirm deletion of the selected permission</DialogDescription>
              </DialogHeader>
              <div className="text-center space-y-6">
                {/* Alert Illustration */}
                <div className="flex justify-center">
                  <div className="relative">
                    {/* Outer glow circle */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B6B]/20 to-[#ED1C24]/20 rounded-full blur-2xl scale-150"></div>

                    {/* Main circle with alert triangle illustration */}
                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#FF6B6B] to-[#ED1C24] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(237,28,36,0.4)]">
                      <div className="relative">
                        <AlertTriangle className="w-10 h-10 text-white" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Animated rings */}
                    <div className="absolute inset-0 rounded-full border-4 border-[#FF6B6B]/30 animate-ping"></div>
                  </div>
                </div>

                {/* Confirmation Text */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#1A1A1A]">
                    Delete Permission
                  </h3>
                  <p className="text-[#6B6B6B] text-sm">
                    Are you sure you want to delete the permission "{permissionToDelete?.name}"? This action cannot be undone.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleDeletePermission}
                    className="w-full bg-gradient-to-r from-[#ED1C24] to-[#d41820] hover:from-[#d41820] hover:to-[#c0151b] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300"
                  >
                    Delete Permission
                  </Button>
                  <Button
                    onClick={() => setDeleteConfirmDialogOpen(false)}
                    variant="outline"
                    className="w-full border-[#E0E0E0] rounded-xl h-12 text-[#252628] hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Success Dialog */}
        <Dialog open={deleteSuccessDialogOpen} onOpenChange={setDeleteSuccessDialogOpen}>
          <DialogContent className="max-w-[400px] bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
            <div className="px-8 pt-8 pb-8">
              <DialogHeader className="sr-only">
                <DialogTitle>Permission Deleted Successfully</DialogTitle>
                <DialogDescription>The permission has been deleted from the system</DialogDescription>
              </DialogHeader>
              <div className="text-center space-y-6">
                {/* Success Illustration */}
                <div className="flex justify-center">
                  <div className="relative">
                    {/* Outer glow circle */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 rounded-full blur-2xl scale-150"></div>

                    {/* Main circle with team/shield illustration */}
                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(16,185,129,0.4)]">
                      <div className="relative">
                        <Shield className="w-10 h-10 text-white" strokeWidth={2} />
                        <Users className="w-6 h-6 text-white absolute -bottom-1 -right-1" strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Animated rings */}
                    <div className="absolute inset-0 rounded-full border-4 border-[#10B981]/30 animate-ping"></div>
                  </div>
                </div>

                {/* Success Text */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#1A1A1A]">
                    Permission Deleted Successfully
                  </h3>
                  <p className="text-[#6B6B6B] text-sm">
                    The permission "{permissionToDelete?.name}" has been successfully deleted.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => setDeleteSuccessDialogOpen(false)}
                    className="w-full bg-gradient-to-r from-[#ED1C24] to-[#d41820] hover:from-[#d41820] hover:to-[#c0151b] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
          <DialogContent className="max-w-[400px] bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
            <div className="px-8 pt-8 pb-8">
              <DialogHeader className="sr-only">
                <DialogTitle>Permission Created Successfully</DialogTitle>
                <DialogDescription>Your new permission has been created and is ready to use</DialogDescription>
              </DialogHeader>
              <div className="text-center space-y-6">
                {/* Success Illustration */}
                <div className="flex justify-center">
                  <div className="relative">
                    {/* Outer glow circle */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 rounded-full blur-2xl scale-150"></div>

                    {/* Main circle with team/shield illustration */}
                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(16,185,129,0.4)]">
                      <div className="relative">
                        <Shield className="w-10 h-10 text-white" strokeWidth={2} />
                        <Users className="w-6 h-6 text-white absolute -bottom-1 -right-1" strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Animated rings */}
                    <div className="absolute inset-0 rounded-full border-4 border-[#10B981]/30 animate-ping"></div>
                  </div>
                </div>

                {/* Success Text */}
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#1A1A1A]">
                    Permission Created Successfully
                  </h3>
                  <p className="text-[#6B6B6B] text-sm">
                    You can now assign spatial permissions to this group in the Spatial Governance page.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      setSuccessOpen(false);
                      navigate("/dashboard/super-admin/roles2");
                    }}
                    className="w-full bg-gradient-to-r from-[#ED1C24] to-[#d41820] hover:from-[#d41820] hover:to-[#c0151b] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300"
                  >
                    Stay on This Page
                  </Button>
                  <Button
                    onClick={() => setSuccessOpen(false)}
                    variant="outline"
                    className="w-full border-[#E0E0E0] rounded-xl h-12 text-[#252628] hover:bg-gray-50"
                  >
                    Done
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Spatial Group Selection Modal */}
        <Dialog open={spatialGroupModalOpen} onOpenChange={(isOpen) => {
          setSpatialGroupModalOpen(isOpen);
          if (!isOpen) {
            setSpatialGroupSearchQuery("");
          }
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
            <div className="px-8 pt-8 pb-8 flex flex-col h-full">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-bold text-[#252628]">
                  Select Spatial Groups
                </DialogTitle>
                <DialogDescription className="text-[#666666] mt-2">
                  Choose one or multiple spatial groups to assign to this security control group.
                </DialogDescription>
              </DialogHeader>

              {/* Search Bar */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666666]" />
                <Input
                  value={spatialGroupSearchQuery}
                  onChange={(e) => setSpatialGroupSearchQuery(e.target.value)}
                  placeholder="Search spatial groups by name, description, or type..."
                  className="pl-9 h-12 rounded-xl border-[#E0E0E0] bg-white focus:border-[#ED1C24] focus:ring-1 focus:ring-[#ED1C24] transition-all"
                />
              </div>

              {/* Selected Count */}
              {(editOpen ? editSelectedSpatialGroups.length : selectedSpatialGroups.length) > 0 && (
                <div className="mb-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-700 font-medium">
                    {editOpen ? editSelectedSpatialGroups.length : selectedSpatialGroups.length} spatial group{(editOpen ? editSelectedSpatialGroups.length : selectedSpatialGroups.length) !== 1 ? 's' : ''} selected
                  </p>
                </div>
              )}

              {/* Spatial Groups Grid */}
              <div className="flex-1 overflow-y-auto mb-6">
                {filteredSpatialGroups.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <MapPin className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">No Spatial Groups Found</h3>
                    <p className="text-sm text-[#666666]">Try adjusting your search criteria</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSpatialGroups.map((group) => {
                      const isSelected = editOpen
                        ? editSelectedSpatialGroups.includes(group.name)
                        : selectedSpatialGroups.includes(group.name);

                      return (
                        <div
                          key={group.id}
                          onClick={() => editOpen ? handleEditToggleSpatialGroup(group.name) : handleToggleSpatialGroup(group.name)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${isSelected
                            ? 'border-[#ED1C24] bg-gradient-to-br from-red-50 to-pink-50 shadow-md'
                            : 'border-[#E0E0E0] bg-white hover:border-[#ED1C24]/50 hover:shadow-sm'
                            }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${group.color}20` }}
                              >
                                <MapPin
                                  className="w-5 h-5"
                                  style={{ color: group.color }}
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-[#1a1a1a] text-sm mb-1">{group.name}</h4>
                                <Badge
                                  className="text-xs font-medium px-2 py-0.5"
                                  style={{
                                    backgroundColor: `${group.color}20`,
                                    color: group.color,
                                    border: `1px solid ${group.color}40`
                                  }}
                                >
                                  {group.type}
                                </Badge>
                              </div>
                            </div>
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => editOpen ? handleEditToggleSpatialGroup(group.name) : handleToggleSpatialGroup(group.name)}
                              className="border-[#E0E0E0] data-[state=checked]:bg-[#ED1C24] data-[state=checked]:border-[#ED1C24]"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <p className="text-xs text-[#666666] mb-2 line-clamp-2">{group.description}</p>
                          <div className="flex items-center gap-2 text-xs text-[#999999]">
                            <div className="flex items-center gap-1">
                              <Layers className="w-3 h-3" />
                              <span>{group.area}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#E5E5E5]">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSpatialGroupModalOpen(false);
                    setSpatialGroupSearchQuery("");
                  }}
                  className="flex-1 h-12 rounded-xl border-[#E0E0E0] hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setSpatialGroupModalOpen(false);
                    setSpatialGroupSearchQuery("");
                    toast.success(`${editOpen ? editSelectedSpatialGroups.length : selectedSpatialGroups.length} spatial group(s) selected`);
                  }}
                  className="flex-1 bg-gradient-to-r from-[#ED1C24] to-[#d41820] hover:from-[#d41820] hover:to-[#c0151b] text-white rounded-full h-12 shadow-lg hover:shadow-xl transition-all"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Confirm Selection
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}