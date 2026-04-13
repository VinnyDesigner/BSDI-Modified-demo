import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from "../../components/ui/dialog";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "../../components/ui/select";
import { Switch } from "../../components/ui/switch";
import { 
  Users, Shield, Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight, Lock, Hexagon, X, ArrowRight, Eye, ClipboardList
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "../../components/PageHeader";
import { MetricCard } from "../../components/ui/MetricCard";

// Mock data for security access groups
const securityGroups = [
  { id: 1, name: "GIS Data Access", organization: "Ministry of Works", description: "Access spatial data layers", usersCount: 142, status: "Active", tags: ["Northern Region", "Capital Area"] },
  { id: 2, name: "Map Editing Team", organization: "Urban Planning Authority", description: "Edit spatial features and boundaries", usersCount: 89, status: "Active", tags: ["Southern Region"] },
  { id: 3, name: "Spatial Review", organization: "Transport Authority", description: "Approve spatial data changes", usersCount: 56, status: "Active", tags: ["Capital Area", "Western Region"] },
  { id: 4, name: "Dataset Administrators", organization: "Min. of Municipalities", description: "Management of spatial datasets", usersCount: 24, status: "Active", tags: ["All Regions"] },
  { id: 5, name: "Public Access Group", organization: "iGA Bahrain", description: "Public spatial data viewing access", usersCount: 500, status: "Active", tags: ["Capital Area"] }
];

const allUsers = [
  { id: 1, name: "Ahmed Hassan", role: "GIS Analyst", initials: "AH", color: "bg-[#FEE2E2] text-[#EF4444]" },
  { id: 2, name: "Fatima Ali", role: "Data Reviewer", initials: "MK", color: "bg-[#FCE7F3] text-[#DB2777]" },
  { id: 3, name: "Khalid Noor", role: "Metadata Editor", initials: "KN", color: "bg-[#FFF7ED] text-[#F97316]" },
  { id: 4, name: "Noor Salman", role: "Department Admin", initials: "NS", color: "bg-[#F1F5F9] text-[#64748B]" },
  { id: 5, name: "Ali Hussain", role: "Spatial Analyst", initials: "AH", color: "bg-[#FEE2E2] text-[#EF4444]" },
  { id: 6, name: "Maryam Khalid", role: "Data Manager", initials: "MR", color: "bg-[#FCE7F3] text-[#DB2777]" },
  { id: 7, name: "Omar Rashid", role: "System Admin", initials: "OR", color: "bg-[#FFF7ED] text-[#F97316]" },
];

export default function SecurityAccessGroup() {
  const isDeptAdmin = window.location.pathname.includes("/department");
  const isReviewer = window.location.pathname.includes("/reviewer");
  const [searchTerm, setSearchTerm] = useState("");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>(securityGroups.map(g => ({ ...g, approvalStatus: g.id === 2 ? 'pending' : (g.id === 3 ? 'rejected' : 'approved') })));
  const [isGroupSelectionEnabled, setIsGroupSelectionEnabled] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([1, 2, 3]);

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = allUsers.filter(user => 
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const handleEditClick = (group: any) => {
    setEditingGroup(group);
    setEditDialogOpen(true);
    setIsGroupSelectionEnabled(true);
  };

  const handleViewClick = (group: any) => {
    setEditingGroup(group);
    setViewDialogOpen(true);
  };

  const toggleUserSelection = (userId: number) => {
    setSelectedUserIds(prev => prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-6 py-5">
      <div className="max-w-[1700px] mx-auto space-y-6">
        
        <PageHeader 
          title="Security Access Group"
          description="Manage security access group and assign users to access groups"
        >
          {!isReviewer && (
            <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Create Security Access Group
            </Button>
          )}
        </PageHeader>

        {/* Standardized Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            value="38" 
            label="Total Spatial Access" 
            icon={<Shield className="w-6 h-6" />} 
            variant="red" 
          />
          <MetricCard 
            value="811" 
            label="Assigned Users" 
            icon={<Users className="w-6 h-6" />} 
            variant="blue" 
          />
          <MetricCard 
            value="5" 
            label="Active Groups" 
            icon={<Hexagon className="w-6 h-6" />} 
            variant="green" 
          />
          <MetricCard 
            value="2" 
            label="Pending Approvals" 
            icon={<Lock className="w-6 h-6" />} 
            variant="yellow" 
          />
        </div>

        {/* Custom Section Card Template */}
        <Card className="bg-white border border-[#F1F5F9] rounded-[16px] overflow-hidden shadow-[0px_1px_2px_rgba(0,0,0,0.04)]" style={{ padding: '16px 20px' }}>
          {/* Header with Title and Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="space-y-1">
              <h3 className="text-[18px] font-semibold text-[#111827]">Security Access Groups</h3>
              <p className="text-[14px] text-[#6B7280]">Manage security access groups and assign users to access groups</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Search Filter */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                <Input
                  className="pl-9 pr-3 h-9 w-[240px] border border-[#E5E7EB] bg-[#F9FAFB] rounded-[10px] text-[14px] focus:border-[#EF4444] transition-all"
                  placeholder="Search group"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Organization Filter */}
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px] h-9 border border-[#E5E7EB] bg-white rounded-[10px] px-3 text-[14px]">
                  <SelectValue placeholder="Organization" />
                </SelectTrigger>
                <SelectContent className="rounded-[10px] border-[#F1F1F1] shadow-xl">
                  <SelectItem value="all">Organization</SelectItem>
                  <SelectItem value="mow">Ministry of Works</SelectItem>
                  <SelectItem value="upa">Urban Planning Authority</SelectItem>
                  <SelectItem value="tra">Transport Authority</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select defaultValue="all">
                <SelectTrigger className="w-[130px] h-9 border border-[#E5E7EB] bg-white rounded-[10px] px-3 text-[14px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-[10px] border-[#F1F1F1] shadow-xl">
                  <SelectItem value="all">Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Table Header Wrapper */}
          <div className="overflow-x-auto border border-[#F1F1F1] rounded-[12px] overflow-hidden">
            <div className="min-w-[1076px]">
              {/* Header Row */}
              <div 
                className="bg-[#FAFAFA] border-b border-[#E5E7EB] px-6 py-4 grid items-center column-gap-4" 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '180px 150px 1fr 140px 100px 220px 100px',
                  columnGap: '16px'
                }}
              >
                <div className="text-[13px] font-medium text-[#6B7280]">Security Group Name</div>
                <div className="text-[13px] font-medium text-[#6B7280]">Organization</div>
                <div className="text-[13px] font-medium text-[#6B7280]">Description</div>
                <div className="text-[13px] font-medium text-[#6B7280]">Assigned Users</div>
                <div className="text-[13px] font-medium text-[#6B7280] text-left">Status</div>
                <div className="text-[13px] font-medium text-[#6B7280]">Assigned Layers</div>
                <div className="text-[13px] font-medium text-[#6B7280] text-left">Actions</div>
              </div>

              {/* Body Rows */}
              <div className="divide-y divide-[#F1F5F9]">
                {filteredGroups.map((group) => (
                  <div 
                    key={group.id} 
                    className="h-[56px] px-6 grid items-center hover:bg-[#F9FAFB] transition-colors border-b border-[#F1F5F9] last:border-0"
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '180px 150px 1fr 140px 100px 220px 100px',
                      columnGap: '16px',
                      fontSize: '14px',
                      color: '#111827'
                    }}
                  >
                    {/* Security Group Name */}
                    <div className="flex flex-col min-w-0 pr-4">
                      <div className="text-[14px] font-semibold text-[#111827] truncate">{group.name}</div>
                    </div>

                    {/* Organization */}
                    <div className="text-[#111827] font-medium truncate pr-4">{group.organization}</div>

                    {/* Description */}
                    <div className="text-[#111827] truncate line-clamp-2 pr-4">{group.description}</div>

                    {/* Assigned Users */}
                    <div className="flex items-center gap-2 font-medium">
                      <Users className="w-4 h-4 text-[#6B7280]" />
                      <span>{group.usersCount} Users</span>
                    </div>

                    {/* Status */}
                    <div className="text-left">
                      <Badge className="bg-[#DCFCE7] text-[#166534] hover:bg-[#DCFCE7] font-bold text-[11px] rounded-full px-3 py-1 border-0 capitalize tracking-tight">
                        {group.status.toLowerCase()}
                      </Badge>
                    </div>

                    {/* Assigned Layers */}
                    <div className="flex flex-wrap gap-1.5 overflow-hidden justify-start items-center">
                      {group.tags.map((tag: string) => (
                        <span key={tag} className="bg-[#EFF6FF] text-[#1D4ED8] text-[12px] font-medium px-[10px] py-[4px] rounded-full whitespace-nowrap">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-start gap-1">
                       <button
                          onClick={() => handleViewClick(group)}
                          className="p-2 hover:bg-[#326594]/5 rounded-lg transition-colors text-[#6B7280] hover:text-[#326594]"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                       {!isReviewer && (
                         <>
                           <button
                              onClick={() => handleEditClick(group)}
                              className="p-2 hover:bg-[#326594]/5 rounded-lg transition-colors text-[#6B7280] hover:text-[#326594]"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              className="p-2 hover:bg-[#EF4444]/5 rounded-lg transition-colors text-[#6B7280] hover:text-[#EF4444]"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                         </>
                       )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-between border-t border-[#F3F4F6] mt-4">
            <div className="text-[13px] text-[#6B7280]">
              Showing <span className="font-semibold text-[#111827]">{filteredGroups.length}</span> to <span className="font-semibold text-[#111827]">{groups.length}</span> of <span className="font-semibold text-[#111827]">{groups.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 rounded-xl border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#6B7280] font-medium"
                disabled
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>
              <div className="flex items-center gap-1">
                <Button 
                   size="sm" 
                   className="w-9 h-9 p-0 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-sm"
                >1</Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-4 rounded-xl border-[#E5E7EB] hover:bg-[#F3F4F6] text-[#6B7280] font-medium"
                disabled
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </Card>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-[500px] h-[500px] border-0 rounded-[16px] p-0 bg-white shadow-2xl overflow-hidden flex flex-col [&>button]:hidden">
            {/* Close Button */}
            <div 
              className="absolute top-[16px] right-[16px] w-[32px] h-[32px] rounded-[8px] bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors z-50"
              onClick={() => setCreateDialogOpen(false)}
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </div>

            {/* Sticky Header */}
            <DialogHeader className="sticky top-0 bg-white z-10 pt-[20px] px-[20px] pb-[12px] border-b border-[#E5E7EB] shrink-0 pr-[64px]">
              <DialogTitle className="text-[18px] font-semibold text-[#EF4444]">
                Create Security Access Group
              </DialogTitle>
              <DialogDescription className="text-sm text-[#6B7280] mt-1 leading-tight">
                Add and configure security access group permissions
              </DialogDescription>
            </DialogHeader>
 
            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-[20px] py-[20px] custom-scrollbar">
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#374151]">
                    Access Group Name <span className="text-[#EF4444]">*</span>
                  </Label>
                  <Input 
                    className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] focus:border-[#EF4444] transition-all"
                    placeholder="e.g., GIS Access Team"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#374151]">
                    Organization <span className="text-[#EF4444]">*</span>
                  </Label>
                  <Select>
                    <SelectTrigger className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] focus:border-[#EF4444] transition-all">
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent className="rounded-[10px] border-[#F3F4F6] shadow-xl">
                      <SelectItem value="mow">Ministry of Works</SelectItem>
                      <SelectItem value="upa">Urban Planning Authority</SelectItem>
                      <SelectItem value="tra">Transport Authority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between gap-3">
                    <Label 
                      htmlFor="enableGroupSelection"
                      className="text-[14px] font-semibold text-[#111827] cursor-pointer"
                    >
                      Security Access Group
                    </Label>
                    <Switch 
                      id="enableGroupSelection" 
                      checked={isGroupSelectionEnabled}
                      onCheckedChange={(checked) => {
                        setIsGroupSelectionEnabled(checked);
                        if (checked) {
                          window.open('https://score-savvy-58161857.figma.site/', '_blank');
                        }
                      }}
                    />
                  </div>
                  <p className="text-[12px] text-[#6B7280]">enable the toggle you can choose layers</p>
                </div>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 bg-white z-10 py-[16px] px-[20px] border-t border-[#E5E7EB] shrink-0 flex justify-end gap-[12px] mt-auto">
              <Button 
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
                className="px-[16px] h-[36px] rounded-[10px] bg-white border-[#E5E7EB] text-[#374151] hover:bg-gray-50 font-medium"
              >
                Cancel
              </Button>
              <Button 
                variant="default"
                className="px-[16px] h-[36px] rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold shadow-sm transition-all"
                onClick={() => {
                  if (isDeptAdmin) {
                    toast.success("✔ Request submitted to Organization Admin for approval");
                  } else {
                    toast.success("✔ Security access group created successfully");
                  }
                  setCreateDialogOpen(false);
                }}
              >
                {isDeptAdmin ? "Submit for Approval" : "Create Group"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-[550px] h-[500px] border-0 rounded-[16px] shadow-2xl p-0 bg-white overflow-hidden flex flex-col [&>button]:hidden">
            {/* Close Button */}
            <div 
              className="absolute top-[16px] right-[16px] w-[32px] h-[32px] rounded-[8px] bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors z-50"
              onClick={() => setEditDialogOpen(false)}
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </div>

            <DialogHeader className="sticky top-0 bg-white z-10 pt-[20px] px-[24px] pb-[12px] border-b border-[#E5E7EB] shrink-0 pr-[64px]">
              <DialogTitle className="text-[18px] font-semibold text-[#EF4444]">
                {isDeptAdmin ? "Security Access Group Details" : "Edit Security Access Group"}
              </DialogTitle>
              <DialogDescription className="text-sm text-[#6B7280] mt-1 leading-tight">
                {isDeptAdmin ? "View details and manage request for security access group" : "Update security access group details and permissions"}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-[24px] py-[20px] space-y-6 custom-scrollbar">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#374151] flex items-center">
                    Security Access Group Name <span className="text-[#EF4444] ml-1">*</span>
                  </Label>
                  <Input 
                    className="h-[36px] bg-white border border-[#E5E7EB] rounded-[10px] px-[12px] text-[14px] text-[#111827] focus:border-[#EF4444] transition-all"
                    defaultValue={editingGroup?.name}
                    disabled={isDeptAdmin && editingGroup?.approvalStatus === 'pending'}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-[#374151] flex items-center">
                    Organization / Department <span className="text-[#EF4444] ml-1">*</span>
                  </Label>
                  <Select defaultValue="moh" disabled={isDeptAdmin && editingGroup?.approvalStatus === 'pending'}>
                    <SelectTrigger className="h-[36px] bg-white border border-[#E5E7EB] rounded-[10px] px-[12px] text-[14px] text-[#111827] focus:border-[#EF4444] transition-all">
                      <SelectValue placeholder="Select organization" />
                    </SelectTrigger>
                    <SelectContent className="border-0 rounded-xl shadow-xl p-2 bg-white">
                      <SelectItem value="moh">Ministry of Housing</SelectItem>
                      <SelectItem value="upa">Urban Planning Authority</SelectItem>
                      <SelectItem value="tra">Transport Authority</SelectItem>
                      <SelectItem value="env">Environment Authority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Add Users Card Style List */}
              <div className="space-y-2">
                <h3 className="text-[14px] font-semibold text-[#111827]">Assigned Users</h3>
                <div className="bg-[#F9FAFB] rounded-[16px] border border-[#F1F5F9] overflow-hidden">
                  <div className="p-4 border-b border-[#F1F5F9]">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
                      <Input 
                        className="h-[32px] bg-white border border-[#E5E7EB] rounded-[8px] pl-9 pr-4 text-[13px] focus:border-[#ED1C24] transition-all"
                        placeholder="Search users..."
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={`max-h-[200px] overflow-y-auto px-1 py-1 mini-scrollbar ${isDeptAdmin && editingGroup?.approvalStatus === 'pending' ? 'opacity-50 pointer-events-none' : ''}`}>
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="flex items-center gap-3 p-3 hover:bg-white transition-colors rounded-xl group/row">
                        <Checkbox 
                          checked={selectedUserIds.includes(user.id)}
                          onCheckedChange={() => toggleUserSelection(user.id)}
                          className="w-4 h-4 rounded border-[#E5E7EB] data-[state=checked]:bg-[#EF4444] data-[state=checked]:border-[#EF4444]"
                          disabled={isDeptAdmin && editingGroup?.approvalStatus === 'pending'}
                        />
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${user.color}`}>
                          {user.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-[#111827] text-[13.5px] truncate">{user.name}</div>
                          <div className="text-[12px] text-[#6B7280] truncate">{user.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="edit-groupSelection" className="text-[14px] font-semibold text-[#111827] cursor-pointer">Security Access Group</Label>
                  <Switch 
                    id="edit-groupSelection" 
                    checked={isGroupSelectionEnabled} 
                    onCheckedChange={(checked) => {
                      setIsGroupSelectionEnabled(checked);
                      if (checked) {
                        window.open('https://score-savvy-58161857.figma.site/', '_blank');
                      }
                    }} 
                  />
                </div>
                <p className="text-[12px] text-[#6B7280]">enable the toggle you can choose layers</p>
                
                {/* Selected Layers Display */}
                {editingGroup?.tags && editingGroup.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {editingGroup.tags.map((tag: string) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="text-[#1D4ED8] border-[#BFDBFE] bg-blue-50/50 rounded-lg flex items-center gap-1 font-bold py-1 px-2 text-[11px]"
                      >
                        <Lock className="w-3 h-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="sticky bottom-0 bg-white z-10 py-[16px] px-[24px] border-t border-[#E5E7EB] shrink-0 flex justify-end gap-[12px] mt-auto">
              <Button 
                variant="outline" 
                onClick={() => setEditDialogOpen(false)}
                className="px-[16px] h-[36px] rounded-[10px] bg-white border-[#E5E7EB] text-[#374151] hover:bg-gray-50 font-medium"
              >
                Cancel
              </Button>
              <Button 
                className={`px-[16px] h-[36px] rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold shadow-sm transition-all ${isDeptAdmin && editingGroup?.approvalStatus === 'pending' ? 'hidden' : ''}`}
                onClick={() => {
                  if (isDeptAdmin) {
                    toast.success("✔ Request submitted to Organization Admin for approval");
                  } else {
                    toast.success("✔ Security access group updated successfully");
                  }
                  setEditDialogOpen(false);
                }}
              >
                {isDeptAdmin ? "Submit for Approval" : "Update"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-[550px] h-[500px] border-0 rounded-[16px] shadow-2xl p-0 bg-white overflow-hidden flex flex-col [&>button]:hidden">
            {/* Close Button */}
            <div 
              className="absolute top-[16px] right-[16px] w-[32px] h-[32px] rounded-[8px] bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors z-50"
              onClick={() => setViewDialogOpen(false)}
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </div>

            <DialogHeader className="sticky top-0 bg-white z-10 pt-[20px] px-[24px] pb-[12px] border-b border-[#E5E7EB] shrink-0 pr-[64px]">
              <DialogTitle className="text-[20px] font-semibold text-[#EF4444]">
                Security Access Group Details
              </DialogTitle>
              <DialogDescription className="text-[14px] text-[#6B7280] mt-1 leading-tight">
                Comprehensive overview of the security access group configuration.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-[24px] py-[24px] space-y-8 custom-scrollbar">
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                {/* Security Group Name */}
                <div className="space-y-1">
                  <div className="text-[13px] text-[#6B7280] font-medium">Security Group Name</div>
                  <div className="text-[15px] font-bold text-[#111827]">{editingGroup?.name}</div>
                </div>

                {/* Organization */}
                <div className="space-y-1">
                  <div className="text-[13px] text-[#6B7280] font-medium">Organization / Department</div>
                  <div className="text-[15px] font-bold text-[#111827]">{editingGroup?.organization}</div>
                </div>

                {/* Status */}
                <div className="space-y-1">
                  <div className="text-[13px] text-[#6B7280] font-medium">Status</div>
                  <div className="pt-1">
                    <Badge className="bg-[#DCFCE7] text-[#166534] hover:bg-[#DCFCE7] font-bold text-[11px] rounded-full px-3 py-1 border-0 capitalize tracking-tight">
                      {editingGroup?.status?.toLowerCase() || 'active'}
                    </Badge>
                  </div>
                </div>

                {/* Security Access */}
                <div className="space-y-1">
                  <div className="text-[13px] text-[#6B7280] font-medium">Security Access</div>
                  <div className="text-[15px] font-bold text-[#111827]">
                    {editingGroup?.tags && editingGroup.tags.length > 0 ? "Enabled" : "Disabled"}
                  </div>
                </div>
              </div>

              {/* Description - Full Width */}
              <div className="space-y-1">
                <div className="text-[13px] text-[#6B7280] font-medium">Description</div>
                <div className="text-[15px] font-bold text-[#111827] leading-relaxed">
                  {editingGroup?.description || "No description provided."}
                </div>
              </div>

              {/* Assigned Layers */}
              <div className="space-y-2">
                <div className="text-[13px] text-[#6B7280] font-medium">Assigned Layers</div>
                {editingGroup?.tags && editingGroup.tags.length > 0 ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {editingGroup.tags.map((tag: string) => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="text-[#1D4ED8] border-[#BFDBFE] bg-blue-50/50 rounded-lg flex items-center gap-1 font-extrabold py-1 px-2 text-[11px]"
                      >
                        <Lock className="w-3 h-3" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-[13px] text-[#94A3B8] italic">No layers assigned</div>
                )}
              </div>

              {/* Assigned Users List */}
              <div className="space-y-3">
                <div className="text-[13px] text-[#6B7280] font-medium">Assigned Users</div>
                <div className="bg-[#F9FAFB] rounded-[16px] border border-[#F1F5F9] overflow-hidden">
                  <div className={`max-h-[200px] overflow-y-auto px-1 py-1 mini-scrollbar`}>
                    {selectedUserIds.length > 0 ? (
                      selectedUserIds.map((id) => {
                        const user = allUsers.find(u => u.id === id);
                        if (!user) return null;
                        return (
                          <div key={user.id} className="flex items-center gap-3 p-3 hover:bg-white transition-colors rounded-xl">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${user.color}`}>
                              {user.initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-[#111827] text-[13.5px] truncate">{user.name}</div>
                              <div className="text-[12px] text-[#6B7280] truncate">{user.role}</div>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-[13px] text-[#94A3B8]">No users assigned</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white z-10 py-[16px] px-[24px] border-t border-[#E5E7EB] shrink-0 flex justify-end gap-[12px] mt-auto">
              <Button 
                variant="default" 
                onClick={() => setViewDialogOpen(false)}
                className="px-[32px] h-[36px] rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold shadow-sm"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #F9FAFB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
        
        .mini-scrollbar::-webkit-scrollbar { width: 3px; }
        .mini-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .mini-scrollbar::-webkit-scrollbar-thumb { background: #F3F4F6; border-radius: 10px; }
      `}</style>
    </div>
  );
}
