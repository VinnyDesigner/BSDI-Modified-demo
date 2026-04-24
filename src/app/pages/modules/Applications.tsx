import { useState, useEffect } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "../../components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../../components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Avatar, AvatarFallback } from "../../components/ui/avatar";
import { 
  LayoutGrid, Plus, Edit, Trash2, X, Upload, Search, ChevronLeft, ChevronRight, UserPlus, AlertTriangle, CheckCircle2, Eye
} from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "react-router";
import { PageHeader } from "../../components/PageHeader";


// Mock applications data
const mockApplications = [
  {
    id: 1,
    nameEn: "BSDI Nexus",
    nameAr: "BSDI Nexus",
    descriptionEn: "Admin & governance layer",
    descriptionAr: "طبقة الإدارة والحوكمة",
    url: "https://bsdinexus.bsdi.gov.bh",
    isSecured: "Yes",
    status: "Active",
  },
  {
    id: 2,
    nameEn: "GeoBahrain Hub",
    nameAr: "GeoBahrain Hub",
    descriptionEn: "Visualization & GIS consumption",
    descriptionAr: "عرض البيانات المكانية",
    url: "https://geobahrainhub.bsdi.gov.bh",
    isSecured: "Yes",
    status: "Active",
  },
  {
    id: 3,
    nameEn: "SpatialBridge",
    nameAr: "SpatialBridge",
    descriptionEn: "Data catalog & discovery",
    descriptionAr: "كتالوج البيانات واكتشافها",
    url: "https://spatialbridge.bsdi.gov.bh",
    isSecured: "Yes",
    status: "Active",
  },
  {
    id: 4,
    nameEn: "GeoMatrix",
    nameAr: "GeoMatrix",
    descriptionEn: "Infrastructure + sensor integration",
    descriptionAr: "تكامل البنية التحتية والمستشعرات",
    url: "https://geomatrix.bsdi.gov.bh",
    isSecured: "Yes",
    status: "Active",
  },
  {
    id: 5,
    nameEn: "BSDI Connect",
    nameAr: "BSDI Connect",
    descriptionEn: "Building/Permit system",
    descriptionAr: "نظام البناء/التصاريح",
    url: "https://bsdiconnect.bsdi.gov.bh",
    isSecured: "Yes",
    status: "Active",
  },
  {
    id: 6,
    nameEn: "GeoSphere Bahrain",
    nameAr: "GeoSphere Bahrain",
    descriptionEn: "Permit workflows",
    descriptionAr: "سير عمل التصاريح",
    url: "https://geospherebahrain.bsdi.gov.bh",
    isSecured: "Yes",
    status: "Active",
  },
  {
    id: 7,
    nameEn: "SpatialNet",
    nameAr: "SpatialNet",
    descriptionEn: "Utility corridor / right-of-way management",
    descriptionAr: "إدارة مسارات المرافق / حق المرور",
    url: "https://spatialnet.bsdi.gov.bh",
    isSecured: "Yes",
    status: "Active",
  },
  {
    id: 8,
    nameEn: "GeoLink Hub",
    nameAr: "GeoLink Hub",
    descriptionEn: "Environmental monitoring system",
    descriptionAr: "نظام مراقبة البيئة",
    url: "https://geolinkhub.bsdi.gov.bh",
    isSecured: "Yes",
    status: "Active",
  },
  {
    id: 9,
    nameEn: "DataAtlas",
    nameAr: "DataAtlas",
    descriptionEn: "Spatial form builder",
    descriptionAr: "منصة إنشاء النماذج المكانية",
    url: "https://dataatlas.bsdi.gov.bh",
    isSecured: "No",
    status: "Inactive",
  },
  {
    id: 10,
    nameEn: "GeoFusion",
    nameAr: "GeoFusion",
    descriptionEn: "Renewable energy dashboard",
    descriptionAr: "لوحة الطاقة المتجددة",
    url: "https://geofusion.bsdi.gov.bh",
    isSecured: "Yes",
    status: "Active",
  },
  {
    id: 11,
    nameEn: "SpatialCore",
    nameAr: "SpatialCore",
    descriptionEn: "Administrative control system",
    descriptionAr: "نظام التحكم الإداري",
    url: "https://spatialcore.bsdi.gov.bh",
    isSecured: "Yes",
    status: "Active",
  },
  {
    id: 12,
    nameEn: "GeoGrid Platform",
    nameAr: "GeoGrid Platform",
    descriptionEn: "AI powered geospatial assistant",
    descriptionAr: "مساعد جغرافي ذكي",
    url: "https://geogridplatform.bsdi.gov.bh",
    isSecured: "Yes",
    status: "Active",
  },
];

// Mock users data
const mockUsers = [
  { id: 1, name: "Jawaher Rashed", email: "jawaher.albufalah@iga.gov.bh", organization: "BSDI", avatar: "JR" },
  { id: 2, name: "Lulwa Saad Mujaddam", email: "lalkawari@iga.gov.bh", organization: "Ministry of Housing", avatar: "LM" },
  { id: 3, name: "Mariam Rashed", email: "mariam.alkhater@iga.gov.bh", organization: "Electricity Authority", avatar: "MR" },
  { id: 4, name: "Muneera Khamis", email: "muneera.ka@iga.gov.bh", organization: "Environment Council", avatar: "MK" },
  { id: 5, name: "Rana A.Majeed", email: "ranama@iga.gov.bh", organization: "Transport Ministry", avatar: "RM" },
  { id: 6, name: "Venkatesh Munusamy", email: "venkateshe@iga.gov.bh", organization: "BSDI", avatar: "VM" },
  { id: 7, name: "Jawaher Rashed", email: "jawaher.albufalah@iga.gov.bh", organization: "Coast Guard", avatar: "JR" },
  { id: 8, name: "Lulwa Saad Mujaddam", email: "lalkawari@iga.gov.bh", organization: "Ministry of Works", avatar: "LM" },
];

export default function Applications() {
  const location = useLocation();
  const isReviewer = location.pathname.includes("/reviewer");
  const isOrgAdmin = location.pathname.includes("/entity-admin");
  const isDeptAdmin = location.pathname.includes("/department");
  const adminOrg = "BSDI";
  const [pendingRequests, setPendingRequests] = useState<number[]>([]);
  const [applications, setApplications] = useState(mockApplications);
  const [searchTerm, setSearchTerm] = useState("");
  const [appModalOpen, setAppModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<typeof mockApplications[0] | null>(null);
  const [assignedUsers, setAssignedUsers] = useState<typeof mockUsers>([]);
  const [selectedUsersToAdd, setSelectedUsersToAdd] = useState<number[]>([]);
  const [selectedUsersForNewApp, setSelectedUsersForNewApp] = useState<number[]>([]);
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [deleteSuccessDialogOpen, setDeleteSuccessDialogOpen] = useState(false);
  const [applicationToDelete, setApplicationToDelete] = useState<typeof mockApplications[0] | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 4;
  const [userSearchTerm, setUserSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    nameEn: "",
    nameAr: "",
    descriptionEn: "",
    descriptionAr: "",
    url: "",
    isSecured: "Yes",
  });

  // Filter applications based on search, status, and role
  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.nameAr.includes(searchTerm) ||
                         app.descriptionEn.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredApplications.length / ITEMS_PER_PAGE);
  const paginatedApplications = filteredApplications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handle create application
  const handleCreateApplication = () => {
    if (!formData.nameEn || !formData.nameAr) {
      toast.error("Please fill in required fields");
      return;
    }

    const newApp = {
      id: applications.length + 1,
      ...formData,
      status: "Active",
    };

    setApplications([...applications, newApp]);
    setAppModalOpen(false);
    setFormData({
      nameEn: "",
      nameAr: "",
      descriptionEn: "",
      descriptionAr: "",
      url: "",
      isSecured: "Yes",
    });
    
    if (selectedUsersToAdd.length > 0) {
      toast.success(`✔ Application created with ${selectedUsersToAdd.length} user(s) assigned`);
    } else {
      toast.success("✔ Application created successfully");
    }

    setSelectedUsersToAdd([]);
    setAssignedUsers([]);
    setUserSearchTerm("");
  };

  // Handle edit application
  const handleEditApplication = (app: typeof mockApplications[0]) => {
    setSelectedApplication(app);
    setFormData({
      nameEn: app.nameEn,
      nameAr: app.nameAr,
      descriptionEn: app.descriptionEn,
      descriptionAr: app.descriptionAr || "",
      url: app.url,
      isSecured: app.isSecured,
    });
    const editAssigned = mockUsers.slice(0, 3);
    setAssignedUsers(editAssigned);
    setSelectedUsersToAdd(editAssigned.map(u => u.id));
    setUserSearchTerm("");
    setModalMode("edit");
    setAppModalOpen(true);
  };

  // Handle view details
  const handleViewDetails = (app: typeof mockApplications[0]) => {
    setSelectedApplication(app);
    setFormData({
      nameEn: app.nameEn,
      nameAr: app.nameAr,
      descriptionEn: app.descriptionEn,
      descriptionAr: app.descriptionAr || "",
      url: app.url,
      isSecured: app.isSecured,
    });
    setAssignedUsers(mockUsers.slice(0, 3));
    setModalMode("view");
    setAppModalOpen(true);
  };

  const handleUpdateApplication = () => {
    if (selectedApplication) {
      setApplications(applications.map(app =>
        app.id === selectedApplication.id ? { ...app, ...formData } : app
      ));
      
      const newlyAssigned = mockUsers.filter(u => selectedUsersToAdd.includes(u.id));
      setAssignedUsers(newlyAssigned);
      
      setAppModalOpen(false);
      toast.success("✔ Application and user assignments updated successfully");
    }
  };

  const handleDeleteApplicationClick = (app: typeof mockApplications[0]) => {
    setApplicationToDelete(app);
    setDeleteConfirmDialogOpen(true);
  };

  const handleDeleteApplication = () => {
    if (!applicationToDelete) return;
    setApplications(applications.filter(app => app.id !== applicationToDelete.id));
    toast.success("✔ Application deleted successfully");
    setDeleteConfirmDialogOpen(false);
    setDeleteSuccessDialogOpen(true);
  };


  // Handle remove user
  const handleRemoveUser = (userId: number) => {
    setAssignedUsers(assignedUsers.filter(u => u.id !== userId));
    toast.success("✔ User removed successfully");
  };

  // Handle toggle user selection
  const handleToggleUserSelection = (userId: number) => {
    setSelectedUsersToAdd(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-[#F5F7FA] px-6 py-5">
      <div className="max-w-[1700px] w-full mx-auto flex-1 flex flex-col min-h-0 space-y-6">
        {/* Standardized Header */}
        <PageHeader 
          title="Applications Management"
          description="Manage, edit and assign users to applications"
        >
          <div className="flex items-center gap-3">
            {!isReviewer && !isOrgAdmin && !isDeptAdmin && (
              <Button
                onClick={() => {
                  setModalMode("create");
                  setFormData({
                    nameEn: "",
                    nameAr: "",
                    descriptionEn: "",
                    descriptionAr: "",
                    url: "",
                    isSecured: "Yes",
                  });
                  setAppModalOpen(true);
                  setSelectedUsersToAdd([]);
                  setAssignedUsers([]);
                  setUserSearchTerm("");
                }}
                className="h-[36px] px-4 rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Application
              </Button>
            )}
          </div>
        </PageHeader>

        {/* Applications Directory Card */}
        <Card className="bg-white border border-[#F1F5F9] rounded-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] overflow-hidden" style={{ padding: '16px 20px' }}>
          {/* Top Control Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-[14px]">
            <div>
              <h2 className="text-[18px] font-semibold text-[#111827]">Applications Directory</h2>
              <p className="text-[13px] text-[#6B7280] mt-0.5">Manage and track system applications.</p>
            </div>
            
            <div className="flex items-center gap-[12px]">
              <div className="relative">
                <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                <Input
                  className="pl-[36px] pr-[12px] h-[36px] w-[220px] border border-[#E5E7EB] bg-[#F9FAFB] rounded-[10px] text-[14px] focus:border-[#EF4444] transition-all"
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>



              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[120px] h-[36px] border border-[#E5E7EB] bg-white rounded-[10px] px-[12px] text-[14px]">
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

          {/* Table Container */}
          <div className="overflow-x-auto border border-[#F1F1F1] rounded-[12px] bg-white">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[#FAFAFA] border-b border-[#E5E7EB]">
                  <th className="px-6 py-4 text-left text-[13px] font-medium text-[#6B7280] whitespace-nowrap">Application Name (EN)</th>
                  <th className="px-6 py-4 text-right text-[13px] font-medium text-[#6B7280]">Application Name (AR)</th>
                  <th className="px-6 py-4 text-left text-[13px] font-medium text-[#6B7280]">Description</th>
                  <th className="px-6 py-4 text-left text-[13px] font-medium text-[#6B7280]">Status</th>
                  <th className="px-6 py-4 text-right text-[13px] font-medium text-[#6B7280]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {paginatedApplications.map((app) => (
                  <tr
                    key={app.id}
                    className="h-[60px] hover:bg-[#F9FAFB] transition-colors group"
                  >
                    <td className="px-6 py-4 text-[#111827] text-sm font-semibold">{app.nameEn}</td>
                    <td className="px-6 py-4 text-[#111827] text-sm font-medium text-right" dir="rtl">{app.nameAr}</td>
                    <td className="px-6 py-4 text-[#6B7280] text-sm font-medium">{app.descriptionEn}</td>

                    <td className="px-6 py-4">
                      <div className="inline-flex items-center px-[10px] py-[4px] rounded-full text-[12px] font-medium bg-[#D1FAE5] text-[#065F46]">
                        {pendingRequests.includes(app.id) ? "Pending Approval" : app.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleViewDetails(app)}
                          className="p-2 hover:bg-[#F3F4F6] rounded-[10px] transition-colors text-[#6B7280] hover:text-[#326594]"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        
                        {!isReviewer && !isOrgAdmin && !isDeptAdmin && (
                          <button
                            onClick={() => handleEditApplication(app)}
                            className="p-2 hover:bg-[#F3F4F6] rounded-[10px] transition-colors text-[#6B7280] hover:text-[#326594]"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}


                        {!isReviewer && !isOrgAdmin && !isDeptAdmin && (
                          <button
                            onClick={() => handleDeleteApplicationClick(app)}
                            className="p-2 hover:bg-[#F3F4F6] rounded-[10px] transition-colors text-[#6B7280] hover:text-[#EF4444]"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F3F4F6]">
            <div className="text-sm font-medium text-[#6B7280]">
              Showing {filteredApplications.length > 0 ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0}-
              {Math.min(currentPage * ITEMS_PER_PAGE, filteredApplications.length)} of {filteredApplications.length} Applications
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
        </Card>

        {/* Unified Application Modal (Create / Edit / View) */}
        <Dialog open={appModalOpen} onOpenChange={setAppModalOpen}>
          <DialogContent className="w-[600px] max-w-[90vw] h-[500px] bg-white rounded-[16px] border border-[#E5E7EB] shadow-2xl p-0 overflow-hidden flex flex-col [&>button]:hidden">
            <div 
              className="absolute top-[16px] right-[16px] w-[32px] h-[32px] rounded-[8px] bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors z-50"
              onClick={() => setAppModalOpen(false)}
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </div>

            <DialogHeader className="pt-[24px] px-[28px] pb-[16px] border-b border-[#F3F4F6] shrink-0 pr-[64px]">
              <DialogTitle className="text-[16px] font-medium text-[#EF4444]">
                {modalMode === "create" ? "Create Application" : modalMode === "edit" ? "Edit Application" : "Application Details"}
              </DialogTitle>
              <DialogDescription className="text-[#6B7280] text-[14px] mt-[2px]">
                {modalMode === "view" 
                  ? "Comprehensive overview of the application configuration." 
                  : "Fill in the details to manage your system application."}
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 min-h-0 px-[28px] py-[24px] overflow-y-auto custom-scrollbar space-y-6">
              {/* Form Section */}
              <div className="space-y-6">
                {modalMode === "view" ? (
                  /* Standardized View Pattern: Label (top) + Value (bottom) */
                  <div className="grid grid-cols-2 gap-x-[24px] gap-y-[16px]">
                    {/* Row 1: App Names */}
                    <div className="flex flex-col">
                      <span className="text-[12px] font-normal text-[#6B7280] mb-1">Application Name (EN)</span>
                      <span className="text-[14px] font-semibold text-[#111827]">{formData.nameEn}</span>
                    </div>
                    <div className="flex flex-col text-right" dir="rtl">
                      <span className="text-[12px] font-normal text-[#6B7280] mb-1">Application Name (AR)</span>
                      <span className="text-[14px] font-semibold text-[#111827]">{formData.nameAr}</span>
                    </div>

                    {/* Row 2: Descriptions */}
                    <div className="flex flex-col">
                      <span className="text-[12px] font-normal text-[#6B7280] mb-1">Description (EN)</span>
                      <span className="text-[14px] font-semibold text-[#111827]">{formData.descriptionEn}</span>
                    </div>
                    <div className="flex flex-col text-right" dir="rtl">
                      <span className="text-[12px] font-normal text-[#6B7280] mb-1">Description (AR)</span>
                      <span className="text-[14px] font-semibold text-[#111827]">{formData.descriptionAr || "طبقة الإدارة والحوكمة"}</span>
                    </div>

                    {/* Row 3: Full Width URL */}
                    <div className="flex flex-col col-span-2">
                       <span className="text-[12px] font-normal text-[#6B7280] mb-1">Application URL</span>
                       <span className="text-[14px] font-semibold text-[#3B82F6] hover:underline cursor-pointer">
                         {formData.url || "https://admin.bsdi.gov.bh"}
                       </span>
                    </div>

                    {/* Row 4: Compact Grid (Role, Secured, Status) */}
                    <div className="col-span-2 pt-2 pb-1 border-t border-[#F1F5F9] mt-1">
                      <div className="grid grid-cols-2 gap-[24px]">

                        <div className="flex flex-col">
                          <span className="text-[12px] font-normal text-[#6B7280] mb-1">Secured</span>
                          <span className="text-[14px] font-semibold text-[#111827]">{formData.isSecured}</span>
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-[12px] font-normal text-[#6B7280] mb-1">Status</span>
                          <span className={`inline-flex items-center px-[10px] py-[3px] rounded-full text-[11px] font-bold ${
                            (selectedApplication?.status || "Active") === "Active" 
                              ? "bg-[#DCFCE7] text-[#166534]" 
                              : "bg-[#FEE2E2] text-[#991B1B]"
                          }`}>
                            {selectedApplication?.status || "Active"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-[16px]">
                    {/* Row 1: Names */}
                    <div className="grid grid-cols-2 gap-[16px]">
                      <div className="space-y-1.5">
                        <Label className="text-[13px] font-medium text-[#374151]">Application Name (EN)</Label>
                        <Input
                          className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] focus:border-[#EF4444] transition-all"
                          placeholder="Enter name"
                          value={formData.nameEn}
                          onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[13px] font-medium text-[#374151]">Application Name (AR)</Label>
                        <Input
                          className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] focus:border-[#EF4444] transition-all text-right"
                          placeholder="أدخل اسم التطبيق"
                          dir="rtl"
                          value={formData.nameAr}
                          onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Row 2: Descriptions */}
                    <div className="grid grid-cols-2 gap-[16px]">
                      <div className="space-y-1.5">
                        <Label className="text-[13px] font-medium text-[#374151]">Description (EN)</Label>
                        <Input
                          className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] focus:border-[#EF4444] transition-all"
                          placeholder="Enter description"
                          value={formData.descriptionEn}
                          onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[13px] font-medium text-[#374151]">Description (AR)</Label>
                        <Input
                          className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] focus:border-[#EF4444] transition-all text-right"
                          placeholder="أدخل الوصف باللغة العربية"
                          dir="rtl"
                          value={formData.descriptionAr}
                          onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Row 3: URL */}
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-medium text-[#374151]">Application URL</Label>
                      <Input
                        className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] focus:border-[#EF4444] transition-all"
                        placeholder="https://..."
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                      />
                    </div>

                    {/* Row 4: Secured */}
                    <div className="space-y-1.5">
                      <Label className="text-[13px] font-medium text-[#374151]">Is Secured</Label>
                      <Select 
                        value={formData.isSecured}
                        onValueChange={(val) => setFormData({ ...formData, isSecured: val })}
                      >
                        <SelectTrigger className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] focus:border-[#EF4444] transition-all">
                          <SelectValue placeholder="Secured?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                  </div>
                )}
              </div>

              {/* User Section (Conditional) */}
              <div className="space-y-4 pt-4 border-t border-[#F3F4F6]">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[16px] font-medium text-[#3D72A2]">Add Users to Application</h3>
                    <p className="text-[13px] text-[#6B7280]">
                      {modalMode === "create" 
                        ? "Select users who will have access to this new application" 
                        : "Manage users who have access to this application"}
                    </p>
                  </div>
                  {modalMode === "edit" && (
                    <Button 
                      variant="outline" 
                      className="h-[32px] px-3 rounded-[8px] border-[#EF4444] text-[#EF4444] hover:bg-[#FEF2F2] text-[12px] font-medium gap-1.5 transition-all shadow-sm"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      Add Users
                    </Button>
                  )}
                </div>

                {/* User List Handling */}
                <div className="space-y-3">
                  {/* Create Mode: Search + Full List with Checkboxes */}
                  {modalMode === "create" && (
                    <>
                      <div className="relative">
                        <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                        <Input
                          className="pl-[36px] pr-[12px] h-[36px] border border-[#E5E7EB] bg-[#F9FAFB] rounded-[10px] text-[14px] focus:border-[#EF4444] transition-all"
                          placeholder="Search users..."
                          value={userSearchTerm}
                          onChange={(e) => setUserSearchTerm(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2 custom-scrollbar">
                        {mockUsers
                          .filter(user => 
                            user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) || 
                            user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
                          )
                          .map((user) => {
                            const isSelected = selectedUsersToAdd.includes(user.id);
                            return (
                              <div 
                                key={user.id}
                                className="flex items-center gap-3 p-[10px] bg-white border border-[#E5E7EB] rounded-[12px] transition-all hover:bg-[#F9FAFB] cursor-pointer"
                                onClick={() => handleToggleUserSelection(user.id)}
                              >
                                <Avatar className="w-8 h-8 border border-[#E5E7EB] shrink-0">
                                  <AvatarFallback className="bg-[#F3F4F6] text-[#6B7280] text-[10px] font-medium">
                                    {user.avatar}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[13px] font-semibold text-[#111827] truncate">{user.name}</p>
                                  <p className="text-[11px] text-[#6B7280] truncate">{user.email}</p>
                                </div>
                                <Checkbox 
                                  checked={isSelected}
                                  onCheckedChange={() => handleToggleUserSelection(user.id)}
                                  className="border-[#D1D5DB] data-[state=checked]:bg-[#EF4444] data-[state=checked]:border-[#EF4444]"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            );
                          })}
                      </div>
                    </>
                  )}

                  {/* Edit & View Mode: Assigned Users List as Cards */}
                  {(modalMode === "edit" || modalMode === "view") && (
                    <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                      {assignedUsers.length > 0 ? (
                        assignedUsers.map((user) => (
                          <div 
                            key={user.id}
                            className="flex items-center gap-3 p-[14px] bg-white border border-[#E5E7EB] rounded-[12px] transition-all hover:border-[#D1D5DB]"
                          >
                            <Avatar className="w-9 h-9 border border-[#E5E7EB] shrink-0">
                              <AvatarFallback className="bg-[#F3F4F6] text-[#6B7280] text-[12px] font-medium">
                                {user.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-semibold text-[#111827] truncate">{user.name}</p>
                              <p className="text-[12px] text-[#6B7280] truncate">{user.email}</p>
                            </div>
                            
                            {modalMode === "edit" ? (
                              <button 
                                onClick={() => handleRemoveUser(user.id)}
                                className="p-1.5 text-[#9CA3AF] hover:text-[#EF4444] hover:bg-[#FEE2E2] rounded-full transition-all"
                                title="Remove User"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            ) : (
                              <div className="bg-[#F3F4F6] text-[#6B7280] text-[11px] font-bold px-[8px] py-[2px] rounded-full uppercase tracking-tight">
                                {user.organization === "BSDI" ? "BSDI" : user.organization.split(' ').map(w => w[0]).join('')}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center border-2 border-dashed border-[#F3F4F6] rounded-[12px]">
                          <p className="text-[13px] text-[#9CA3AF]">No users assigned to this application.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white py-[16px] px-[28px] border-t border-[#F3F4F6] flex justify-end gap-[12px] shrink-0">
              {modalMode !== "view" && (
                <Button 
                  variant="outline" 
                  className="h-[36px] px-6 rounded-[10px] border-[#E5E7EB] text-[#374151] font-medium hover:bg-gray-50"
                  onClick={() => setAppModalOpen(false)}
                >
                  Cancel
                </Button>
              )}
              {modalMode !== "view" && (
                <Button 
                  className="h-[36px] px-6 rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold transition-all shadow-sm"
                  onClick={modalMode === "create" ? handleCreateApplication : handleUpdateApplication}
                >
                  {modalMode === "create" ? "Create Application" : "Update Application"}
                </Button>
              )}
              {modalMode === "view" && (
                <Button 
                  className="h-[36px] px-6 rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold shadow-sm transition-all"
                  onClick={() => setAppModalOpen(false)}
                >
                  Close
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>


        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmDialogOpen} onOpenChange={setDeleteConfirmDialogOpen}>
          <DialogContent className="w-[440px] max-w-[90vw] bg-white rounded-[24px] border border-[#E5E7EB] shadow-2xl p-0 overflow-hidden">
            <div className="px-8 pt-10 pb-10">
              <DialogHeader className="sr-only">
                <DialogTitle>Delete Application Confirmation</DialogTitle>
                <DialogDescription>Confirm deletion of the selected application</DialogDescription>
              </DialogHeader>
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative w-20 h-20 bg-[#FEE2E2] rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-10 h-10 text-[#EF4444]" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-[20px] font-bold text-[#111827]">Delete Application</h3>
                  <p className="text-[#6B7280] text-[14px]">
                    Are you sure you want to delete <span className="font-semibold">{applicationToDelete?.nameEn}</span>? This action is permanent.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => setDeleteConfirmDialogOpen(false)}
                    variant="outline"
                    className="flex-1 h-[44px] rounded-[12px] border-[#E5E7EB]"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeleteApplication}
                    className="flex-1 h-[44px] rounded-[12px] bg-[#EF4444] hover:bg-[#DC2626] text-white"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Success Dialog */}
        <Dialog open={deleteSuccessDialogOpen} onOpenChange={setDeleteSuccessDialogOpen}>
          <DialogContent className="w-[440px] max-w-[90vw] bg-white rounded-[24px] border border-[#E5E7EB] shadow-2xl p-0 overflow-hidden">
            <div className="px-8 pt-10 pb-10">
              <DialogHeader className="sr-only">
                <DialogTitle>Success</DialogTitle>
                <DialogDescription>Deleted successfully</DialogDescription>
              </DialogHeader>
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative w-20 h-20 bg-[#D1FAE5] rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-10 h-10 text-[#059669]" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-[20px] font-bold text-[#111827]">Successful</h3>
                  <p className="text-[#6B7280] text-[14px]">The application has been deleted successfully.</p>
                </div>
                <Button
                  onClick={() => setDeleteSuccessDialogOpen(false)}
                  className="w-full h-[44px] rounded-[12px] bg-[#22C55E] hover:bg-[#1BA84B] text-white border-none shadow-sm transition-all"
                >
                  View Requests
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
