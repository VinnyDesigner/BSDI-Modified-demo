import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { PageHeader } from "../../components/PageHeader";
import { Badge } from "../../components/ui/badge";
import { MetricCard } from "../../components/ui/MetricCard";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Users as UsersIcon, UserPlus, Edit, Search, ChevronUp, ChevronDown, Clock, X, Upload, FileText, ArrowLeft, Eye, Trash2, CheckCircle2, AlertTriangle, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "../../components/ui/calendar";
import { format } from "date-fns";
import { toast } from "sonner";
import { getStatusBadgeProps } from "../../lib/statusUtils";

const users = [
  { id: 1, name: "Jawaher Rashed", email: "jawaher_rashed@gov.bh", role: "Department Admin, GIS Analyst, Data Reviewer, System Administrator", org: "Ministry of Works", department: "IT Department", status: "active", lastActive: "2024-03-04" },
  { id: 2, name: "Lulwa Saad Mujaddam", email: "sara.mohammed@gov.bh", role: "GIS Analyst, Data Reviewer, Data Manager", org: "Urban Planning Authority", department: "GIS Department", status: "active", lastActive: "2024-03-03" },
  { id: 3, name: "Rana A.Majeed", email: "khalid.ali@gov.bh", role: "Data Reviewer", org: "Environmental Agency", department: "Planning Department", status: "active", lastActive: "2024-03-02" },
  { id: 4, name: "Muneera Khamis", email: "fatima.hassan@gov.bh", role: "Organization User, Department Admin, GIS Analyst, Data Manager, System Administrator", org: "Transport Authority", department: "IT Department", status: "pending", lastActive: "2024-03-01" },
  { id: 5, name: "Mohammed Ali", email: "mohammed.ali@gov.bh", role: "GIS Analyst, Data Manager", org: "Ministry of Works", department: "GIS Department", status: "active", lastActive: "2024-03-04" },
  { id: 6, name: "Noora Ahmed", email: "noora.ahmed@gov.bh", role: "Data Manager, System Administrator, GIS Analyst", org: "Environmental Agency", department: "IT Department", status: "active", lastActive: "2024-03-03" },
  { id: 7, name: "Ali Hassan", email: "ali.hassan@gov.bh", role: "System Administrator", org: "Ministry of Works", department: "IT Department", status: "active", lastActive: "2024-03-05" },
  { id: 8, name: "Maryam Saleh", email: "maryam.saleh@gov.bh", role: "GIS Analyst, Department Admin, Data Reviewer, Data Manager", org: "Urban Planning Authority", department: "GIS Department", status: "active", lastActive: "2024-03-05" },
];

// Mock data for saved user groups
const savedUserGroups = [
  {
    id: "GRP-001",
    usersCount: 4,
    dateCreated: "16 Mar 2026",
    users: [
      { id: 1, name: "Jawaher Rashed", email: "jawaher_rashed@gov.bh", role: "Department Admin, GIS Analyst, Data Reviewer", department: "IT Department", phone: "+973 1234 5678" },
      { id: 2, name: "Lulwa Saad Mujaddam", email: "sara.mohammed@gov.bh", role: "GIS Analyst, Data Reviewer", department: "GIS Department", phone: "+973 2345 6789" },
      { id: 3, name: "Rana A.Majeed", email: "khalid.ali@gov.bh", role: "Data Reviewer", department: "Planning Department", phone: "+973 3456 7890" },
      { id: 4, name: "Muneera Khamis", email: "fatima.hassan@gov.bh", role: "Organization User, Department Admin", department: "IT Department", phone: "+973 4567 8901" },
    ]
  },
  {
    id: "GRP-002",
    usersCount: 3,
    dateCreated: "15 Mar 2026",
    users: [
      { id: 5, name: "Mohammed Ali", email: "mohammed.ali@gov.bh", role: "GIS Analyst, Data Manager", department: "GIS Department", phone: "+973 5678 9012" },
      { id: 6, name: "Noora Ahmed", email: "noora.ahmed@gov.bh", role: "Data Manager, System Administrator", department: "IT Department", phone: "+973 6789 0123" },
      { id: 7, name: "Ali Hassan", email: "ali.hassan@gov.bh", role: "System Administrator", department: "IT Department", phone: "+973 7890 1234" },
    ]
  },
  {
    id: "GRP-003",
    usersCount: 2,
    dateCreated: "14 Mar 2026",
    users: [
      { id: 8, name: "Maryam Saleh", email: "maryam.saleh@gov.bh", role: "GIS Analyst, Department Admin, Data Reviewer", department: "GIS Department", phone: "+973 8901 2345" },
      { id: 9, name: "Omar Abdullah", email: "omar.abdullah@gov.bh", role: "Department Admin", department: "Planning Department", phone: "+973 9012 3456" },
    ]
  },
  {
    id: "GRP-004",
    usersCount: 5,
    dateCreated: "13 Mar 2026",
    users: [
      { id: 10, name: "Layla Ibrahim", email: "layla.ibrahim@gov.bh", role: "Data Reviewer", department: "GIS Department", phone: "+973 1111 2222" },
      { id: 11, name: "Yusuf Mahmood", email: "yusuf.mahmood@gov.bh", role: "GIS Analyst", department: "IT Department", phone: "+973 2222 3333" },
      { id: 12, name: "Amina Rashid", email: "amina.rashid@gov.bh", role: "Organization User", department: "Planning Department", phone: "+973 3333 4444" },
      { id: 13, name: "Hassan Jaber", email: "hassan.jaber@gov.bh", role: "Data Manager", department: "GIS Department", phone: "+973 4444 5555" },
      { id: 14, name: "Nadia Qasim", email: "nadia.qasim@gov.bh", role: "System Administrator", department: "IT Department", phone: "+973 5555 6666" },
    ]
  },
];

export default function Users() {
  const location = useLocation();
  const isReviewer = location.pathname.includes("/reviewer");
  const isOrgAdmin = location.pathname.includes("/entity-admin");
  const isDeptAdmin = location.pathname.includes("/department");
  const adminOrg = isDeptAdmin ? "Urban Planning Authority" : "Ministry of Works";
  const adminDept = "GIS Department";

  const [searchQuery, setSearchQuery] = useState("");
  const [savedUsersSearch, setSavedUsersSearch] = useState("");
  const [dateRangeFilter, setDateRangeFilter] = useState("all");
  const [savedUsersFromDate, setSavedUsersFromDate] = useState<Date | undefined>(undefined);
  const [savedUsersToDate, setSavedUsersToDate] = useState<Date | undefined>(undefined);
  const searchRef = useRef<HTMLDivElement>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<typeof users>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [orgFilter, setOrgFilter] = useState(isOrgAdmin ? adminOrg : "all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [historyPanelOpen, setHistoryPanelOpen] = useState(false);
  const [selectedUserHistory, setSelectedUserHistory] = useState<typeof users[0] | null>(null);
  
  // User Modal State (Unified for Create, Edit, View)
  const [userPopupMode, setUserPopupMode] = useState<"create" | "edit" | "view">("create");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  
  const [userNameEn, setUserNameEn] = useState("");
  const [userNameAr, setUserNameAr] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userMobile, setUserMobile] = useState("");
  const [userRole, setUserRole] = useState<string[]>([]);
  const [userDesignation, setUserDesignation] = useState("");
  const [userOrg, setUserOrg] = useState("");
  const [userDepartment, setUserDepartment] = useState("");
  const [userCPR, setUserCPR] = useState("");
  const [userEmployeeID, setUserEmployeeID] = useState("");
  const [userStartDate, setUserStartDate] = useState("");
  const [userEndDate, setUserEndDate] = useState("");
  const [addedUsers, setAddedUsers] = useState<Array<{nameEn: string; nameAr: string; email: string}>>([]);
  const [isRenewal, setIsRenewal] = useState(false);
  const [isAutoRenewal, setIsAutoRenewal] = useState(false);
  const [selectedUserIndices, setSelectedUserIndices] = useState<number[]>([]);
  const [selectedAddedUserIndices, setSelectedAddedUserIndices] = useState<number[]>([]);
  
  // Upload Document State
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Edit User State
  const [editingUser, setEditingUser] = useState<typeof users[0] | null>(null);
  const [editRolePopoverOpen, setEditRolePopoverOpen] = useState(false);
  
  // Saved Users State
  const [activeMainTab, setActiveMainTab] = useState("directory");
  const [selectedGroup, setSelectedGroup] = useState<typeof savedUserGroups[0] | null>(null);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadingForUser, setUploadingForUser] = useState<{name?: string; email?: string; groupId: string; userId?: number} | null>(null);
  const [groupUploadedFile, setGroupUploadedFile] = useState<File | null>(null);
  
  // Track uploaded files for each user in groups (key: "groupId-userId")
  const [userUploadedFiles, setUserUploadedFiles] = useState<Record<string, {name: string; size: number}>>({});
  
  // Dynamic saved user groups state
  const [userGroups, setUserGroups] = useState(savedUserGroups);
  
  // Filtered Saved User Groups
  const filteredUserGroups = userGroups.filter(group => {
    const matchesSearch = group.id.toLowerCase().includes(savedUsersSearch.toLowerCase()) ||
                          group.users.some(u => u.name.toLowerCase().includes(savedUsersSearch.toLowerCase()) || u.email.toLowerCase().includes(savedUsersSearch.toLowerCase()));
    
    // Date filtering logic (optional but good for completeness)
    // if (savedUsersFromDate && ...) { ... }
    
    return matchesSearch;
  });

  // Success dialog state
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [createdGroupId, setCreatedGroupId] = useState("");
  
  // Delete confirmation dialog state
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);
  const [deleteSuccessDialogOpen, setDeleteSuccessDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ groupId: string; userId: number } | null>(null);
  
  // Delete confirmation dialog state for Directory users
  const [directoryDeleteConfirmOpen, setDirectoryDeleteConfirmOpen] = useState(false);
  const [directoryDeleteSuccessOpen, setDirectoryDeleteSuccessOpen] = useState(false);
  const [directoryUserToDelete, setDirectoryUserToDelete] = useState<typeof users[0] | null>(null);
  
  // Dynamic users list for directory
  const [usersList, setUsersList] = useState(users);

  // Calculate stats dynamically
  const stats = {
    total: usersList.filter(u => {
      if (isDeptAdmin) return u.department === adminDept;
      if (isOrgAdmin) return u.org === adminOrg;
      return true;
    }).length,
    active: usersList.filter(u => {
      const matchesRestriction = isDeptAdmin ? u.department === adminDept : (isOrgAdmin ? u.org === adminOrg : true);
      return matchesRestriction && u.status === 'active';
    }).length,
    pending: usersList.filter(u => {
      const matchesRestriction = isDeptAdmin ? u.department === adminDept : (isOrgAdmin ? u.org === adminOrg : true);
      return matchesRestriction && u.status === 'pending';
    }).length,
    deactivated: usersList.filter(u => {
      const matchesRestriction = isDeptAdmin ? u.department === adminDept : (isOrgAdmin ? u.org === adminOrg : true);
      return matchesRestriction && u.status === 'deactivated';
    }).length
  };

  // Dynamic department names for the filter dropdown
  const availableDeptNames = Array.from(new Set(
    usersList
      .filter(u => {
        if (isDeptAdmin) return u.department === adminDept;
        if (isOrgAdmin) return u.org === adminOrg;
        return true;
      })
      .map(u => u.department)
  ));
  
  // Delete confirmation dialog state for user groups
  const [groupDeleteConfirmOpen, setGroupDeleteConfirmOpen] = useState(false);
  const [groupDeleteSuccessOpen, setGroupDeleteSuccessOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<string | null>(null);
  
  // Request confirmation dialog state
  const [requestConfirmDialogOpen, setRequestConfirmDialogOpen] = useState(false);
  const [requestingGroupId, setRequestingGroupId] = useState<string | null>(null);
  
  // Function to confirm group deletion
  const confirmDeleteGroup = (groupId: string) => {
    setGroupToDelete(groupId);
    setGroupDeleteConfirmOpen(true);
  };
  
  // Function to handle deleting a user group
  const handleDeleteGroup = () => {
    if (!groupToDelete) return;
    
    setUserGroups(userGroups.filter(g => g.id !== groupToDelete));
    setGroupDeleteConfirmOpen(false);
    setGroupDeleteSuccessOpen(true);
  };
  
  // Function to handle deleting a user from a group
  const handleDeleteUserFromGroup = (groupId: string, userId: number) => {
    const updatedGroups = userGroups.map(group => {
      if (group.id === groupId) {
        const updatedUsers = group.users.filter(u => u.id !== userId);
        const updatedGroup = {
          ...group,
          users: updatedUsers,
          usersCount: updatedUsers.length
        };
        // Update selectedGroup if this is the currently selected group
        if (selectedGroup?.id === groupId) {
          setSelectedGroup(updatedGroup);
        }
        return updatedGroup;
      }
      return group;
    });
    setUserGroups(updatedGroups);
    setDeleteConfirmDialogOpen(false);
    setDeleteSuccessDialogOpen(true);
  };
  
  // Function to confirm user deletion
  const confirmDeleteUser = (groupId: string, userId: number) => {
    setUserToDelete({ groupId, userId });
    setDeleteConfirmDialogOpen(true);
  };
  
  // Function to confirm directory user deletion
  const confirmDeleteDirectoryUser = (user: typeof users[0]) => {
    setDirectoryUserToDelete(user);
    setDirectoryDeleteConfirmOpen(true);
  };
  
  // Function to handle deleting a directory user
  const handleDeleteDirectoryUser = () => {
    if (!directoryUserToDelete) return;
    
    setUsersList(usersList.filter(u => u.id !== directoryUserToDelete.id));
    setDirectoryDeleteConfirmOpen(false);
    setDirectoryDeleteSuccessOpen(true);
  };
  
  // Function to clear create user form
  const clearCreateUserForm = () => {
    setUserNameEn("");
    setUserNameAr("");
    setUserEmail("");
    setUserMobile("");
    setUserRole([]);
    setUserDesignation("");
    setUserOrg("");
    setUserDepartment("");
    setUserCPR("");
    setUserEmployeeID("");
    setUserStartDate("");
    setUserEndDate("");
    setIsAutoRenewal(false);
  };
  
  // Helper for Role badge styles – unified single style
  const getRoleBadgeStyles = (_role?: string) =>
    "bg-[#E6F0FA] text-[#3D72A2] text-[12px] font-medium px-[10px] py-[4px] rounded-full border-0";
  
  // Function to add user to list
  const handleAddUser = () => {
    if (!userNameEn || !userEmail || userRole.length === 0 || !userOrg || !userDepartment) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (addedUsers.length >= 10) {
      toast.error("Maximum 10 users can be added");
      return;
    }
    setAddedUsers([...addedUsers, { nameEn: userNameEn, nameAr: userNameAr, email: userEmail }]);
    toast.success("✔ User added to list!");
    clearCreateUserForm();
  };
  
  // Function to handle final user creation
  const handleCreateAllUsers = () => {
    if (addedUsers.length === 0) {
      toast.error("Please add at least one user");
      return;
    }
    
    // Generate new group ID
    const groupNumbers = userGroups.map(g => parseInt(g.id.split('-')[1]));
    const maxGroupNumber = Math.max(...groupNumbers, 0);
    const newGroupId = `GRP-${String(maxGroupNumber + 1).padStart(3, '0')}`;
    
    // Format today's date
    const today = new Date();
    const dateCreated = today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    
    // Create new group with added users
    const newGroup = {
      id: newGroupId,
      usersCount: addedUsers.length,
      dateCreated: dateCreated,
      users: addedUsers.map((user, index) => ({
        id: Date.now() + index,
        name: user.nameEn,
        email: user.email,
        role: Array.isArray(userRole) ? userRole.join(', ') : userRole || "Organization User",
        department: userDepartment || "IT Department",
        phone: userMobile || "+973 0000 0000"
      }))
    };
    
    // Add to user groups
    setUserGroups([newGroup, ...userGroups]);
    
    // Store the created group ID
    setCreatedGroupId(newGroupId);
    
    // Close create dialog and show success dialog
    setIsUserModalOpen(false);
    setSuccessDialogOpen(true);
    
    // Clear form
    setAddedUsers([]);
    setSelectedAddedUserIndices([]);
    clearCreateUserForm();
  };

  const handleToggleUserSelection = (idx: number) => {
    setSelectedAddedUserIndices(prev => 
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedAddedUserIndices.length === addedUsers.length && addedUsers.length > 0) {
      setSelectedAddedUserIndices([]);
    } else {
      setSelectedAddedUserIndices(addedUsers.map((_, i) => i));
    }
  };

  const handlePrintSelected = () => {
    if (selectedAddedUserIndices.length === 0) return;
    window.print();
  };

  const handleRemoveAddedUser = (idxToRemove: number) => {
    setAddedUsers(addedUsers.filter((_, i) => i !== idxToRemove));
    setSelectedAddedUserIndices(prev => 
      prev
        .filter(idx => idx !== idxToRemove)
        .map(idx => idx > idxToRemove ? idx - 1 : idx)
    );
  };

  // Unified Modal Handler
  const handleOpenUserModal = (user: typeof users[0] | null, mode: "create" | "edit" | "view") => {
    setUserPopupMode(mode);
    if (user) {
      setEditingUser(user);
      setUserNameEn(user.name);
      setUserNameAr(user.name); // Mock Arabic name
      setUserEmail(user.email);
      setUserRole(user.role.split(', '));
      setUserOrg(user.org);
      setUserDepartment(user.department);
      // Set other default fields if user data is incomplete
      setUserDesignation(user.role.split(', ')[0] || "");
      setUserCPR("980000000"); // Mock
      setUserEmployeeID("EMP-001"); // Mock
      setUserMobile("+973 3000 0000"); // Mock
      setUserStartDate("2024-01-01"); // Mock
      setUserEndDate("2025-01-01"); // Mock
      
      // For view mode, we don't open popover
      setEditRolePopoverOpen(mode === "edit");
    } else {
      clearCreateUserForm();
      setEditingUser(null);
    }
    setIsUserModalOpen(true);
  };

  // Mock user history data
  const getUserHistory = (userId: number) => {
    const histories: Record<number, Array<{department: string; startYear: number; endYear: number; email: string}>> = {
      1: [
        { department: "IT Department", startYear: 2022, endYear: 2024, email: "jawaher_rashed@gov.bh" },
        { department: "Health", startYear: 2021, endYear: 2022, email: "jawaher_rashed@gov.bh" },
        { department: "Urban Planning Department", startYear: 2020, endYear: 2021, email: "jawaher_rashed@gov.bh" },
      ],
      2: [
        { department: "GIS Department", startYear: 2023, endYear: 2024, email: "sara.mohammed@upa.gov.bh" },
        { department: "Planning Department", startYear: 2021, endYear: 2023, email: "s.mohammed@planning.gov.bh" },
      ],
      3: [
        { department: "Planning Department", startYear: 2022, endYear: 2024, email: "khalid.ali@planning.gov.bh" },
        { department: "IT Department", startYear: 2020, endYear: 2022, email: "k.ali@it.gov.bh" },
      ],
      4: [
        { department: "IT Department", startYear: 2023, endYear: 2024, email: "fatima.hassan@transport.gov.bh" },
      ],
      5: [
        { department: "GIS Department", startYear: 2022, endYear: 2024, email: "mohammed.ali@mow.gov.bh" },
        { department: "Planning Department", startYear: 2020, endYear: 2022, email: "m.ali@planning.gov.bh" },
      ],
      6: [
        { department: "IT Department", startYear: 2023, endYear: 2024, email: "noora.ahmed@env.gov.bh" },
        { department: "Health", startYear: 2021, endYear: 2023, email: "n.ahmed@health.gov.bh" },
      ],
      7: [
        { department: "IT Department", startYear: 2020, endYear: 2024, email: "ali.hassan@mow.gov.bh" },
      ],
      8: [
        { department: "GIS Department", startYear: 2021, endYear: 2024, email: "maryam.saleh@upa.gov.bh" },
        { department: "Urban Planning Department", startYear: 2020, endYear: 2021, email: "m.saleh@urbanplanning.gov.bh" },
      ],
    };
    return histories[userId] || [];
  };

  const handleShowHistory = (user: typeof users[0]) => {
    setSelectedUserHistory(user);
    setHistoryPanelOpen(true);
  };



  // Function to save edited user
  const handleSaveEditedUser = () => {
    if (!userNameEn || !userEmail || !userRole || !userOrg || !userDepartment) {
      toast.error("Please fill in all required fields");
      return;
    }
    toast.success("✔ User updated successfully!");
    setIsUserModalOpen(false);
    clearCreateUserForm();
    setEditingUser(null);
    setUploadedFile(null);
  };

  // File upload handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setUploadedFile(file);
      toast.success("✔ Document uploaded successfully!");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setUploadedFile(file);
      toast.success("✔ Document uploaded successfully!");
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    toast.info("Document removed");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  // Handle search suggestions
  useEffect(() => {
    if (searchQuery.trim()) {
      const suggestions = usersList.filter(user => {
        const matchesRestriction = isDeptAdmin ? user.department === adminDept : (isOrgAdmin ? user.org === adminOrg : true);
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.org.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRestriction && matchesSearch;
      }).slice(0, 5);
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, usersList, isOrgAdmin, adminOrg]);

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

  // Function to scroll to selected user
  const handleSelectSuggestion = (user: typeof users[0]) => {
    setSearchQuery(user.name);
    setShowSuggestions(false);
    
    // Reset filters and pagination to ensure item is visible
    setStatusFilter("all");
    setOrgFilter("all");
    setRoleFilter("all");
    setDepartmentFilter("all");
    setCurrentPage(1);
    setActiveMainTab("directory"); // Switch tab to directory if global search is used
    
    setTimeout(() => {
      const row = document.getElementById(`user-row-${user.id}`);
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
  const filteredUsers = usersList.filter(user => {
    const matchesRestriction = isDeptAdmin ? user.department === adminDept : (isOrgAdmin ? user.org === adminOrg : true);
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.org.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || user.status === statusFilter;
    const matchesOrg = orgFilter === "all" || user.org === orgFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter;
    return matchesRestriction && matchesSearch && matchesStatus && matchesOrg && matchesRole && matchesDepartment;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = (a[sortColumn as keyof typeof a] ?? "") as string | number;
    const bVal = (b[sortColumn as keyof typeof b] ?? "") as string | number;
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = sortedUsers.slice(
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
          title="Users"
          description="Manage user accounts and permissions"
        >
          {!isReviewer && (
            <Button 
              onClick={() => handleOpenUserModal(null, "create")}
              className="gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Create User
            </Button>
          )}
        </PageHeader>

        {/* KPI Cards Grid */}
        {/* Standardized Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            value={stats.total} 
            label="Total Users" 
            icon={<UsersIcon className="w-6 h-6" />} 
            variant="red" 
          />
          <MetricCard 
            value={stats.active} 
            label="Active Users" 
            icon={<UsersIcon className="w-6 h-6" />} 
            variant="green" 
          />
          <MetricCard 
            value={stats.pending} 
            label="Pending Approval" 
            icon={<UsersIcon className="w-6 h-6" />} 
            variant="yellow" 
          />
          <MetricCard 
            value={stats.deactivated} 
            label="Deactivated" 
            icon={<UsersIcon className="w-6 h-6" />} 
            variant="purple" 
          />
        </div>

        {/* User Directory Table */}
        <Card className="bg-white border border-[#E5E7EB] rounded-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.04)]" style={{ padding: '20px 24px 24px' }}>
          
          {/* Row 1: Title & Global Search */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-[#111827]">User Management</h3>
              <p className="text-sm text-[#6B7280]">Manage and view all users</p>
            </div>
            
            <div className="relative" ref={searchRef}>
              <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
              <Input
                className="pl-[36px] pr-[32px] h-[36px] w-[280px] border border-[#E5E7EB] bg-[#F9FAFB] rounded-[10px] text-[14px] focus:border-[#EF4444] transition-all"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => searchQuery && setShowSuggestions(true)}
              />
              {searchQuery && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery("");
                    setShowSuggestions(false);
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-gray-200 rounded-lg"
                >
                  <X className="w-3.5 h-3.5 text-[#6B7280]" />
                </Button>
              )}
              {/* Autocomplete Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full right-0 mt-1 bg-white border border-[#E5E7EB] rounded-[10px] shadow-lg z-50 max-h-64 overflow-y-auto min-w-[400px]">
                  {searchSuggestions.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => handleSelectSuggestion(user)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <UsersIcon className="w-4 h-4 text-[#EF4444]" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#111827]">{user.name}</p>
                          <p className="text-xs text-[#6B7280]">{user.email} • {user.org}</p>
                        </div>
                        <Badge className={`text-xs px-3 py-1 rounded-full border-0 capitalize ${user.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                          {user.status}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Tabs value={activeMainTab} onValueChange={setActiveMainTab} className="w-full">
            {/* Row 2: Tabs & Filters */}
            <div className="flex items-center justify-between mb-5">
              {/* LEFT: Tabs */}
              <TabsList className="bg-transparent p-0 h-auto flex items-center gap-2 shadow-none">
                <TabsTrigger
                  value="directory"
                  className="h-[32px] px-[14px] rounded-[10px] text-[13px] font-medium border transition-all duration-200
                    bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-[#F9FAFB] hover:text-[#111827]
                    data-[state=active]:bg-[#EF4444] data-[state=active]:text-white data-[state=active]:border-transparent data-[state=active]:shadow-[0_2px_6px_rgba(239,68,68,0.2)]
                    data-[state=active]:font-medium data-[state=active]:hover:bg-[#DC2626]"
                >
                  User Directory
                </TabsTrigger>
                <TabsTrigger
                  value="saved"
                  className="h-[32px] px-[14px] rounded-[10px] text-[13px] font-medium border transition-all duration-200
                    bg-white text-[#6B7280] border-[#E5E7EB] hover:bg-[#F9FAFB] hover:text-[#111827]
                    data-[state=active]:bg-[#EF4444] data-[state=active]:text-white data-[state=active]:border-transparent data-[state=active]:shadow-[0_2px_6px_rgba(239,68,68,0.2)]
                    data-[state=active]:font-medium data-[state=active]:hover:bg-[#DC2626]"
                >
                  Saved Users
                </TabsTrigger>
              </TabsList>

              {/* RIGHT: Filters Context */}
              <div className="flex items-center gap-[12px]">
                {activeMainTab === "directory" ? (
                  <>
                    {!isDeptAdmin && (
                      <>
                        <Select 
                          value={departmentFilter}
                          onValueChange={(value) => setDepartmentFilter(value)}
                          disabled={isDeptAdmin}
                        >
                          <SelectTrigger className="w-[160px] h-[36px] border border-[#E5E7EB] bg-white rounded-[10px] px-[12px] text-[14px]">
                            <SelectValue placeholder="Department" />
                          </SelectTrigger>
                          <SelectContent>
                            {isDeptAdmin ? (
                              <SelectItem value={adminDept}>{adminDept}</SelectItem>
                            ) : (
                              <>
                                <SelectItem value="all">Departments</SelectItem>
                                {availableDeptNames.map(name => (
                                  <SelectItem key={name} value={name}>{name}</SelectItem>
                                ))}
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        {!isOrgAdmin && (
                          <Select 
                            value={orgFilter}
                            onValueChange={(value) => setOrgFilter(value)}
                            disabled={isDeptAdmin}
                          >
                            <SelectTrigger className="w-[180px] h-[36px] border border-[#E5E7EB] bg-white rounded-[10px] px-[12px] text-[14px]">
                              <SelectValue placeholder="Organization" />
                            </SelectTrigger>
                            <SelectContent>
                              {isDeptAdmin ? (
                                <SelectItem value={adminOrg}>{adminOrg}</SelectItem>
                              ) : (
                                <>
                                  <SelectItem value="all">Organization</SelectItem>
                                  <SelectItem value="Ministry of Works">Ministry of Works</SelectItem>
                                  <SelectItem value="Urban Planning Authority">Urban Planning Authority</SelectItem>
                                  <SelectItem value="Transport Authority">Transport Authority</SelectItem>
                                  <SelectItem value="Environmental Agency">Environmental Agency</SelectItem>
                                </>
                              )}
                            </SelectContent>
                          </Select>
                        )}
                      </>
                    )}
                    <Select 
                      value={roleFilter}
                      onValueChange={(value) => setRoleFilter(value)}
                    >
                      <SelectTrigger className="w-[160px] h-[36px] border border-[#E5E7EB] bg-white rounded-[10px] px-[12px] text-[14px]">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Roles</SelectItem>
                        <SelectItem value="Department User">Department User</SelectItem>
                        <SelectItem value="Department Admin">Department Admin</SelectItem>
                        <SelectItem value="GIS Analyst">GIS Analyst</SelectItem>
                        <SelectItem value="Data Reviewer">Data Reviewer</SelectItem>
                        <SelectItem value="Organization User">Organization User</SelectItem>
                        <SelectItem value="Data Manager">Data Manager</SelectItem>
                        <SelectItem value="System Administrator">System Administrator</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select 
                      value={statusFilter}
                      onValueChange={(value) => setStatusFilter(value)}
                    >
                      <SelectTrigger className="w-[130px] h-[36px] border border-[#E5E7EB] bg-white rounded-[10px] px-[12px] text-[14px]">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                ) : (
                  <div className="flex items-center gap-[12px]">


                    {/* Date Range Group */}
                    <div className="flex items-center gap-[8px] ml-[4px]">
                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="relative group cursor-pointer inline-flex items-center h-[36px] w-[130px] px-[12px] rounded-[10px] border border-[#E5E7EB] bg-white text-[13px] font-normal text-[#111827] hover:border-[#EF4444] transition-all">
                            <span className={!savedUsersFromDate ? "text-[#9CA3AF]" : ""}>
                              {savedUsersFromDate ? format(savedUsersFromDate, "dd-mm-yyyy") : "dd-mm-yyyy"}
                            </span>
                            <CalendarIcon className="absolute right-[10px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF] pointer-events-none group-hover:text-[#EF4444] transition-colors" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-0 shadow-lg rounded-xl" align="start">
                          <Calendar
                            mode="single"
                            selected={savedUsersFromDate}
                            onSelect={setSavedUsersFromDate}
                            initialFocus
                            className="rounded-xl border border-[#E5E7EB] bg-white shadow-md p-4"
                          />
                        </PopoverContent>
                      </Popover>

                      <span className="text-[10px] font-bold text-[#9CA3AF] uppercase">To</span>

                      <Popover>
                        <PopoverTrigger asChild>
                          <div className="relative group cursor-pointer inline-flex items-center h-[36px] w-[130px] px-[12px] rounded-[10px] border border-[#E5E7EB] bg-white text-[13px] font-normal text-[#111827] hover:border-[#EF4444] transition-all">
                            <span className={!savedUsersToDate ? "text-[#9CA3AF]" : ""}>
                              {savedUsersToDate ? format(savedUsersToDate, "dd-mm-yyyy") : "dd-mm-yyyy"}
                            </span>
                            <CalendarIcon className="absolute right-[10px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF] pointer-events-none group-hover:text-[#EF4444] transition-colors" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 border-0 shadow-lg rounded-xl" align="start">
                          <Calendar
                            mode="single"
                            selected={savedUsersToDate}
                            onSelect={setSavedUsersToDate}
                            initialFocus
                            className="rounded-xl border border-[#E5E7EB] bg-white shadow-md p-4"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User Directory Tab */}
            <TabsContent value="directory" className="mt-0">
          <div className="space-y-4">

            <div className="overflow-x-auto border border-[#F1F1F1] rounded-[12px] overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#FAFAFA] border-b border-[#E5E7EB]">
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#374151] cursor-pointer hover:text-[#EF4444] transition-colors" onClick={() => handleSort("name")}>
                      Name {getSortIcon("name")}
                    </th>
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#374151] cursor-pointer hover:text-[#EF4444] transition-colors" onClick={() => handleSort("email")}>
                      Email {getSortIcon("email")}
                    </th>
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#374151] cursor-pointer hover:text-[#EF4444] transition-colors" onClick={() => handleSort("role")}>
                      Role {getSortIcon("role")}
                    </th>
                    {!isOrgAdmin && !isDeptAdmin && (
                      <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#374151] cursor-pointer hover:text-[#EF4444] transition-colors" onClick={() => handleSort("org")}>
                        Organization {getSortIcon("org")}
                      </th>
                    )}
                    {!isDeptAdmin && (
                      <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#374151] cursor-pointer hover:text-[#EF4444] transition-colors" onClick={() => handleSort("department")}>
                        Department {getSortIcon("department")}
                      </th>
                    )}
                    <th className="px-6 py-4 text-left text-[13px] font-semibold text-[#374151]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-[13px] font-semibold text-[#374151]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id} id={`user-row-${user.id}`} className="border-b border-[#F1F1F1] last:border-b-0 hover:bg-[#F9FAFB] transition-colors group">
                      <td className="px-6 py-4 text-[#111827] font-semibold text-sm">{user.name}</td>
                      <td className="px-6 py-4 text-[#6B7280] text-sm">{user.email}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {user.role.split(', ').slice(0, 2).map((role, index) => (
                            <Badge 
                              key={index}
                              className={getRoleBadgeStyles()}
                            >
                              {role}
                            </Badge>
                          ))}
                          {user.role.split(', ').length > 2 && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button className="bg-[#ED1C24]/10 text-[#ED1C24] border border-[#ED1C24]/20 text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer hover:bg-[#ED1C24]/20 transition-all">
                                  +{user.role.split(', ').length - 2} more
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="w-80 bg-white rounded-xl border border-[#E0E0E0] shadow-lg p-4">
                                <div className="space-y-3">
                                  <div className="flex items-center gap-2 pb-3 border-b border-[#E0E0E0]">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ED1C24]/10 to-[#FF6B6B]/10 flex items-center justify-center">
                                      <span className="text-sm font-bold text-[#ED1C24]">
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                      </span>
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-[#1a1a1a] text-sm">{user.name}</h4>
                                      <p className="text-xs text-[#666666]">All Roles</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-2">
                                    {user.role.split(', ').map((role, index) => (
                                      <Badge 
                                        key={index}
                                        className={getRoleBadgeStyles()}
                                      >
                                        {role}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                          )}
                        </div>
                      </td>
                      {!isOrgAdmin && !isDeptAdmin && (
                        <td className="px-6 py-4 text-[#6B7280] text-sm">{user.org}</td>
                      )}
                      {!isDeptAdmin && (
                        <td className="px-6 py-4 text-[#6B7280] text-sm">{user.department}</td>
                      )}
                      <td className="px-6 py-4 text-sm">
                        <Badge variant={getStatusBadgeProps(user.status).variant}>
                          {getStatusBadgeProps(user.status).label}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-[8px]">
                          {isReviewer ? (
                            <Button 
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 rounded-lg text-[#6B7280] hover:text-[#326594] hover:bg-[#326594]/5"
                              onClick={() => handleOpenUserModal(user, "view")}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          ) : (
                            <>
                              <Button 
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-lg text-[#6B7280] hover:text-[#326594] hover:bg-[#326594]/5"
                                onClick={() => handleOpenUserModal(user, "view")}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-lg text-[#6B7280] hover:text-[#EF4444] hover:bg-[#EF4444]/5"
                                onClick={() => handleOpenUserModal(user, "edit")}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 rounded-lg text-[#6B7280] hover:text-[#EF4444] hover:bg-[#EF4444]/5"
                                onClick={() => handleShowHistory(user)}
                              >
                                <Clock className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-6 border-t border-[#F3F4F6] mt-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#6B7280]">
                  Showing <span className="text-[#111827]">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="text-[#111827]">{Math.min(currentPage * itemsPerPage, sortedUsers.length)}</span> of <span className="text-[#111827]">{sortedUsers.length}</span> users
                </span>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline"
                    size="sm"
                    className="h-8 px-3 rounded-lg border-[#E5E7EB] text-[#374151]"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
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
                  </Button>
                </div>
              </div>
            </div>
          </div>
            </TabsContent>

            {/* Saved Users Tab */}
            <TabsContent value="saved" className="mt-0">
              <div className="space-y-4">

                <div className="space-y-3">
                  {filteredUserGroups.length > 0 ? (
                    filteredUserGroups.map((group) => (
                      <div key={group.id} className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                      {/* Group Header Row */}
                      <div 
                        onClick={() => setExpandedGroupId(expandedGroupId === group.id ? null : group.id)}
                        className="flex items-center px-4 py-4 hover:bg-gray-50 transition-all cursor-pointer"
                      >
                        {/* Chevron Icon on Left */}
                        <div className="mr-3">
                          {expandedGroupId === group.id ? (
                            <ChevronUp className="w-5 h-5 text-[#666666]" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-[#666666]" />
                          )}
                        </div>
                        
                        <div className="flex-1 grid grid-cols-4 gap-4">
                          <div>
                            <span className="text-[#ED1C24] font-semibold">{group.id}</span>
                          </div>
                          <div className="text-[#1a1a1a] font-medium">{group.usersCount} users</div>
                          <div className="text-[#666666]">{group.dateCreated}</div>
                          <div className="flex items-center gap-2 justify-end" onClick={(e) => e.stopPropagation()}>
                            {userUploadedFiles[`${group.id}-group`] ? (
                              <>
                                <div className="flex items-center gap-2 px-3 h-[32px] bg-[#DCFCE7] rounded-full border border-emerald-100 shadow-sm">
                                  <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" />
                                  <span className="text-[11px] font-bold text-[#059669] uppercase tracking-tight">Uploaded</span>
                                </div>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setUploadingForUser({ groupId: group.id });
                                    setUploadDialogOpen(true);
                                  }}
                                  className="h-[36px] px-[16px] rounded-[10px] border border-[#E5E7EB] bg-white text-[13px] font-medium text-[#374151] hover:bg-gray-50 transition-colors shadow-none"
                                >
                                  <Upload className="w-3.5 h-3.5 mr-2 text-[#EF4444]" />
                                  Re-upload
                                </Button>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setRequestingGroupId(group.id);
                                    setRequestConfirmDialogOpen(true);
                                  }}
                                  className="h-[36px] px-[16px] rounded-[10px] bg-[#EF4444] text-white text-[13px] font-semibold hover:bg-[#DC2626] transition-all shadow-md active:scale-95"
                                >
                                  Request
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setUploadingForUser({ groupId: group.id });
                                    setUploadDialogOpen(true);
                                  }}
                                  className="h-[36px] px-[16px] rounded-[10px] bg-[#EF4444] text-white text-[13px] font-semibold hover:bg-[#DC2626] transition-all shadow-md active:scale-95"
                                >
                                  <Upload className="w-3.5 h-3.5 mr-2" />
                                  Upload
                                </Button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    confirmDeleteGroup(group.id);
                                  }}
                                  className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center bg-[#FEF2F2] hover:bg-[#FEE2E2] transition-colors cursor-pointer border-0 shadow-sm"
                                  title="Delete group"
                                >
                                  <Trash2 className="w-4 h-4 text-[#EF4444]" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded User Details */}
                      {expandedGroupId === group.id && (
                        <div className="border-t border-gray-200 bg-gray-50/50">
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-gray-100">
                                  <th className="px-4 py-3 text-left text-[#4A4A4A] font-semibold text-sm">Name</th>
                                  <th className="px-4 py-3 text-left text-[#4A4A4A] font-semibold text-sm">Email</th>
                                  <th className="px-4 py-3 text-left text-[#4A4A4A] font-semibold text-sm">Role</th>
                                  <th className="px-4 py-3 text-left text-[#4A4A4A] font-semibold text-sm">Organization</th>
                                  <th className="px-4 py-3 text-left text-[#4A4A4A] font-semibold text-sm">Department</th>
                                </tr>
                              </thead>
                              <tbody>
                                {group.users.map((user) => (
                                  <tr key={user.id} className="border-b border-gray-200 last:border-b-0 hover:bg-white transition-all">
                                    <td className="px-4 py-4 text-[#1a1a1a] font-medium">{user.name}</td>
                                    <td className="px-4 py-4 text-[#666666]">{user.email}</td>
                                    <td className="px-4 py-4">
                                      <div className="flex flex-wrap gap-1">
                                        {user.role.split(', ').slice(0, 2).map((role, index) => (
                                          <Badge 
                                            key={index}
                                            className={getRoleBadgeStyles()}
                                          >
                                            {role}
                                          </Badge>
                                        ))}
                                        {user.role.split(', ').length > 2 && (
                                          <Popover>
                                            <PopoverTrigger asChild>
                                              <button className="bg-[#ED1C24]/10 text-[#ED1C24] border border-[#ED1C24]/20 text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer hover:bg-[#ED1C24]/20 transition-all">
                                                +{user.role.split(', ').length - 2} more
                                              </button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-80 bg-white rounded-xl border border-[#E0E0E0] shadow-lg p-4">
                                              <div className="space-y-3">
                                                <div className="flex items-center gap-2 pb-3 border-b border-[#E0E0E0]">
                                                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ED1C24]/10 to-[#FF6B6B]/10 flex items-center justify-center">
                                                    <span className="text-sm font-bold text-[#ED1C24]">
                                                      {user.name.split(' ').map(n => n[0]).join('')}
                                                    </span>
                                                  </div>
                                                  <div>
                                                    <h4 className="font-semibold text-[#1a1a1a] text-sm">{user.name}</h4>
                                                    <p className="text-xs text-[#666666]">All Roles</p>
                                                  </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                  {user.role.split(', ').map((role, index) => (
                                                    <Badge 
                                                      key={index}
                                                      className={getRoleBadgeStyles()}
                                                    >
                                                      {role}
                                                    </Badge>
                                                  ))}
                                                </div>
                                              </div>
                                            </PopoverContent>
                                          </Popover>
                                        )}
                                      </div>
                                    </td>
                                    <td className="px-4 py-4 text-[#666666]">Ministry of Works</td>
                                    <td className="px-4 py-4 text-[#666666]">{user.department}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                      </div>
                    ))
                  ) : (
                    <div className="bg-[#F9FAFB] border border-dashed border-[#E5E7EB] rounded-[12px] p-8 text-center text-[#6B7280] text-[13px]">
                      No saved user groups found matching your search.
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>

        {/* History Sliding Panel */}
        {historyPanelOpen && (
          <>
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/40 z-[100] transition-opacity duration-300"
              onClick={() => setHistoryPanelOpen(false)}
            />
            
            {/* Sliding Panel */}
            <div className="fixed top-0 right-0 h-full w-[370px] bg-white shadow-[-8px_0_32px_rgba(0,0,0,0.08)] z-[101] flex flex-col">
              
              {/* Header */}
              <div className="pt-5 px-5 pb-4 shrink-0 border-b border-[#F3F4F6]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FEE2E2] flex items-center justify-center shrink-0">
                      <span className="text-[14px] font-bold text-[#EF4444]">
                        {selectedUserHistory?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-[16px] font-semibold text-[#EF4444] leading-tight">User History</h3>
                      <p className="text-[14px] font-semibold text-[#111827] mt-0.5 leading-tight">{selectedUserHistory?.name}</p>
                    </div>
                  </div>
                  <button 
                    className="w-8 h-8 rounded-full bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors"
                    onClick={() => setHistoryPanelOpen(false)}
                  >
                    <X className="w-4 h-4 text-[#6B7280]" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">

                {/* Info Card — 2-col grid */}
                <div className="bg-[#F9FAFB] rounded-[12px] border border-[#F1F5F9] p-4 shadow-[0_2px_6px_rgba(0,0,0,0.04)]">
                  <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                    <div className="col-span-2">
                      <p className="text-[12px] text-[#6B7280] mb-0.5">Email</p>
                      <p className="text-[14px] font-semibold text-[#111827] truncate">{selectedUserHistory?.email}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-[12px] text-[#6B7280] mb-0.5">Current Role</p>
                      <p className="text-[13px] font-semibold text-[#111827] leading-snug">{selectedUserHistory?.role}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-[#6B7280] mb-0.5">Organization</p>
                      <p className="text-[13px] font-semibold text-[#111827] truncate">{selectedUserHistory?.org}</p>
                    </div>
                    <div>
                      <p className="text-[12px] text-[#6B7280] mb-0.5">Department</p>
                      <p className="text-[13px] font-semibold text-[#111827] truncate">{selectedUserHistory?.department}</p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h4 className="text-[12px] font-semibold text-[#6B7280] uppercase tracking-wider mb-4">Department History</h4>
                  <div className="relative pl-5">
                    <div className="absolute left-[4px] top-[10px] bottom-[10px] w-[2px] bg-[#E5E7EB]" />
                    <div className="space-y-3">
                      {selectedUserHistory && getUserHistory(selectedUserHistory.id).map((history, index) => (
                        <div key={index} className="relative">
                          <div className={`absolute -left-[21px] top-[14px] w-[10px] h-[10px] rounded-full border-2 border-white z-10 ${
                            index === 0 ? 'bg-[#EF4444] shadow-[0_0_0_3px_rgba(239,68,68,0.15)]' : 'bg-[#9CA3AF] shadow-[0_0_0_3px_rgba(156,163,175,0.15)]'
                          }`} />
                          <div className="bg-white border border-[#F1F5F9] rounded-[12px] px-4 py-3 shadow-[0_2px_6px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.07)] hover:border-[#E5E7EB] transition-all">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-[14px] font-semibold text-[#111827] leading-snug">{history.department}</p>
                              <Badge className={`shrink-0 text-[11px] font-medium px-2.5 py-0.5 rounded-full border-0 ${
                                index === 0 ? 'bg-[#DCFCE7] text-[#166534]' : 'bg-[#E5E7EB] text-[#6B7280]'
                              }`}>
                                {index === 0 ? 'Current' : 'Past'}
                              </Badge>
                            </div>
                            <p className="text-[12px] text-[#6B7280] font-medium mt-1.5 flex items-center gap-1.5">
                              {history.startYear} – {history.endYear}
                              <span className="w-1 h-1 rounded-full bg-[#D1D5DB] inline-block" />
                              {history.endYear - history.startYear} {history.endYear - history.startYear === 1 ? 'yr' : 'yrs'}
                            </p>
                            <p className="text-[11px] text-[#9CA3AF] mt-1 truncate">{history.email}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </>
        )}

        {/* Unified User Modal (Create, Edit, View) */}
        <Dialog open={isUserModalOpen} onOpenChange={setIsUserModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden bg-white rounded-[16px] border border-[#E5E7EB] shadow-2xl p-0 flex flex-col [&>button]:hidden">
            <div 
              className="absolute top-[16px] right-[16px] w-[32px] h-[32px] rounded-[8px] bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors z-50"
              onClick={() => setIsUserModalOpen(false)}
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </div>
            
            <DialogHeader className="sticky top-0 bg-white z-10 pt-[20px] px-[24px] pb-[12px] border-b border-[#F1F1F1] shrink-0 text-left items-start">
              <DialogTitle className="text-[20px] font-semibold text-[#DC2626]">
                {userPopupMode === "view" && "User Details"}
                {userPopupMode === "edit" && "Edit User"}
                {userPopupMode === "create" && "Create User"}
              </DialogTitle>
              <DialogDescription className="text-[13px] text-[#6B7280] mt-1">
                {userPopupMode === "view" && "View user detail information in the system"}
                {userPopupMode === "edit" && "Update user details in the BSDI system"}
                {userPopupMode === "create" && "Add a new user to the BSDI system"}
              </DialogDescription>
            </DialogHeader>
            
            <div className="overflow-y-auto px-[24px] flex-1 min-h-0">
              <div className="py-[16px]">
                {userPopupMode === "view" ? (
                  /* View Mode Content (Standard Sequence) */
                  <div className="flex flex-col gap-6">
                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <Label className="text-[13px] text-[#6B7280] font-medium">Department</Label>
                        <div className="text-[14px] font-medium text-[#111827] mt-1.5">{userDepartment || "—"}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                      <div>
                        <Label className="text-[13px] text-[#6B7280] font-medium">User Name</Label>
                        <div className="text-[14px] font-medium text-[#111827] mt-1.5">{userNameEn || "—"}</div>
                      </div>
                      <div>
                        <Label className="text-[13px] text-[#6B7280] font-medium">Employee ID</Label>
                        <div className="text-[14px] font-medium text-[#111827] mt-1.5">{userEmployeeID || "—"}</div>
                      </div>
                      <div>
                        <Label className="text-[13px] text-[#6B7280] font-medium">Designation</Label>
                        <div className="text-[14px] font-medium text-[#111827] mt-1.5">{userDesignation || "—"}</div>
                      </div>
                      <div>
                        <Label className="text-[13px] text-[#6B7280] font-medium">Organization</Label>
                        <div className="text-[14px] font-medium text-[#111827] mt-1.5">{userOrg || "—"}</div>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-[13px] text-[#6B7280] font-medium">Roles</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {userRole.length > 0 ? userRole.map((role, idx) => (
                            <Badge key={idx} className={getRoleBadgeStyles()}>
                              {role}
                            </Badge>
                          )) : "—"}
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-[13px] text-[#6B7280] font-medium">CPR Number</Label>
                        <div className="text-[14px] font-medium text-[#111827] mt-1.5">{userCPR || "—"}</div>
                      </div>
                      <div>
                        <Label className="text-[13px] text-[#6B7280] font-medium">Email</Label>
                        <div className="text-[14px] font-medium text-[#111827] mt-1.5">{userEmail || "—"}</div>
                      </div>
                      <div>
                        <Label className="text-[13px] text-[#6B7280] font-medium">Mobile Number</Label>
                        <div className="text-[14px] font-medium text-[#111827] mt-1.5">{userMobile || "—"}</div>
                      </div>
                      <div className="col-span-2">
                        <Label className="text-[13px] text-[#6B7280] font-medium">Access Period</Label>
                        <div className="flex items-center gap-2 text-[14px] font-medium text-[#111827] mt-1.5">
                          <span>{userStartDate || "—"}</span>
                          <span className="text-[#9CA3AF] px-1">to</span>
                          <span>{userEndDate || "—"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Create/Edit Mode Form (Standard Sequence) */
                  <div className="flex flex-col gap-5">
                    {/* Row 1: Select Department (Full Width) */}
                    <div className="space-y-2">
                      <Label className="text-[#374151] font-medium text-[13px]">
                        Select Department<span className="text-[#EF4444]">*</span>
                      </Label>
                      <Select value={userDepartment} onValueChange={setUserDepartment}>
                        <SelectTrigger className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] font-normal text-[#111827] focus:border-[#EF4444] transition-all">
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl bg-white border border-[#E0E0E0]">
                          <SelectItem value="IT Department">IT Department</SelectItem>
                          <SelectItem value="GIS Department">GIS Department</SelectItem>
                          <SelectItem value="Planning Department">Planning Department</SelectItem>
                          <SelectItem value="Health">Health</SelectItem>
                          <SelectItem value="Urban Planning Department">Urban Planning Department</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Row 2: User Name & Employee ID */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[#374151] font-medium text-[13px]">
                          User Name<span className="text-[#EF4444]">*</span>
                        </Label>
                        <Input 
                          className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] font-normal text-[#111827] focus:border-[#EF4444] transition-all"
                          placeholder="Enter user name"
                          value={userNameEn}
                          onChange={(e) => setUserNameEn(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[#374151] font-medium text-[13px]">
                          Employee ID<span className="text-[#EF4444]">*</span>
                        </Label>
                        <Input 
                          className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] font-normal text-[#111827] focus:border-[#EF4444] transition-all"
                          placeholder="Enter employee ID"
                          value={userEmployeeID}
                          onChange={(e) => setUserEmployeeID(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Row 3: Designation & Organization */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[#374151] font-medium text-[13px]">
                          Designation<span className="text-[#EF4444]">*</span>
                        </Label>
                        <Input 
                          className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] font-normal text-[#111827] focus:border-[#EF4444] transition-all"
                          placeholder="Enter designation"
                          value={userDesignation}
                          onChange={(e) => setUserDesignation(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[#374151] font-medium text-[13px]">
                          Organization<span className="text-[#EF4444]">*</span>
                        </Label>
                        <Select value={userOrg} onValueChange={setUserOrg}>
                          <SelectTrigger className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] font-normal text-[#111827] focus:border-[#EF4444] transition-all">
                            <SelectValue placeholder="Organization" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl bg-white border border-[#E0E0E0]">
                            <SelectItem value="Ministry of Works">Ministry of Works</SelectItem>
                            <SelectItem value="Urban Planning Authority">Urban Planning Authority</SelectItem>
                            <SelectItem value="Transport Authority">Transport Authority</SelectItem>
                            <SelectItem value="Environmental Agency">Environmental Agency</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Row 4: Role (Full Width) */}
                    <div className="space-y-2">
                      <Label className="text-[#374151] font-medium text-[13px]">
                        Role<span className="text-[#EF4444]">*</span>
                      </Label>
                      <Popover open={editRolePopoverOpen} onOpenChange={setEditRolePopoverOpen}>
                        <PopoverTrigger asChild>
                          <button className="w-full h-[36px] rounded-[10px] border border-[#E5E7EB] bg-white px-[12px] text-left text-[14px] text-[#111827] focus:border-[#EF4444] transition-all flex items-center justify-between">
                            <span className={userRole.length === 0 ? "text-[#9B9B9B]" : "text-[#1A1A1A]"}>
                              {userRole.length === 0 ? "Select roles" : `${userRole.length} role${userRole.length > 1 ? 's' : ''} selected`}
                            </span>
                            <ChevronDown className="w-4 h-4 text-[#6B6B6B]" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-3 bg-white rounded-xl border border-[#E0E0E0] shadow-lg" align="start">
                          <div className="space-y-2">
                            {["Department Admin", "GIS Analyst", "Data Reviewer", "Organization User", "Data Manager", "System Administrator"].map((role) => (
                              <label key={role} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-[#F5F5F5] cursor-pointer transition-colors">
                                <input
                                  type="checkbox"
                                  checked={userRole.includes(role)}
                                  onChange={(e) => {
                                    if (e.target.checked) setUserRole([...userRole, role]);
                                    else setUserRole(userRole.filter(r => r !== role));
                                  }}
                                  className="w-4 h-4 rounded border-2 border-[#E0E0E0] text-[#EF4444] focus:ring-2 focus:ring-[#EF4444] cursor-pointer"
                                />
                                <span className="text-sm text-[#1A1A1A]">{role}</span>
                              </label>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                      {userRole.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {userRole.map((role) => (
                            <Badge key={role} className={`${getRoleBadgeStyles()} flex items-center gap-1.5`}>
                              {role}
                              <button onClick={() => setUserRole(userRole.filter(r => r !== role))} className="hover:opacity-70 transition-opacity ml-0.5">
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Row 5: CPR Number (Full Width with Upload) */}
                    <div className="space-y-2">
                      <Label className="text-[#374151] font-medium text-[13px]">
                        CPR Number<span className="text-[#EF4444]">*</span>
                      </Label>
                      <div className="flex items-center gap-3">
                        <Input 
                          className="flex-1 h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] font-normal text-[#111827] focus:border-[#EF4444] transition-all"
                          placeholder="Enter CPR number"
                          value={userCPR}
                          onChange={(e) => setUserCPR(e.target.value)}
                        />
                        <label className="cursor-pointer shrink-0">
                          <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => { if(e.target.files?.[0]) toast.success(`Uploaded: ${e.target.files[0].name}`) }} />
                          <div className="flex items-center gap-2 text-[#EF4444] hover:text-[#DC2626] transition-colors py-1">
                            <Upload className="w-4 h-4" />
                            <span className="text-sm font-medium">Upload CPR</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[#374151] font-medium text-[13px]">Email<span className="text-[#EF4444]">*</span></Label>
                        <Input type="email" className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] font-normal text-[#111827] focus:border-[#EF4444] transition-all" placeholder="user@gov.bh" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[#374151] font-medium text-[13px]">Mobile Number<span className="text-[#EF4444]">*</span></Label>
                        <Input type="tel" className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white px-[12px] text-[14px] font-normal text-[#111827] focus:border-[#EF4444] transition-all" placeholder="+973 XXXX XXXX" value={userMobile} onChange={(e) => setUserMobile(e.target.value)} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <Label className="text-[#6B7280] font-normal text-xs">Start Date</Label>
                        <Input type="date" className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white pl-[12px] pr-3 text-[14px] font-normal text-[#111827] focus:border-[#EF4444] transition-all [&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-calendar-picker-indicator]:cursor-pointer" value={userStartDate} onChange={(e) => setUserStartDate(e.target.value)} />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[#6B7280] font-normal text-xs">End Date</Label>
                        <Input type="date" className="h-[36px] rounded-[10px] border-[#E5E7EB] bg-white pl-[12px] pr-3 text-[14px] font-normal text-[#111827] focus:border-[#EF4444] transition-all [&::-webkit-calendar-picker-indicator]:ml-auto [&::-webkit-calendar-picker-indicator]:cursor-pointer" value={userEndDate} onChange={(e) => setUserEndDate(e.target.value)} />
                      </div>
                    </div>

                    {/* Auto Renewal (Edit Mode Only) — after date fields */}
                    {userPopupMode === "edit" && (
                      <div className="flex items-center gap-2 pt-1">
                        <input
                          type="checkbox"
                          id="auto-renewal"
                          checked={isAutoRenewal}
                          onChange={(e) => setIsAutoRenewal(e.target.checked)}
                          className="w-4 h-4 rounded border-[#E5E7EB] accent-[#EF4444] text-[#EF4444] focus:ring-[#EF4444] cursor-pointer"
                        />
                        <Label htmlFor="auto-renewal" className="text-[14px] font-medium text-[#111827] cursor-pointer">
                          Auto Renewal
                        </Label>
                      </div>
                    )}

                    {userPopupMode === "create" && (
                      <div className="pt-4 flex items-center justify-between border-t border-[#F1F1F1] mt-2">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="renewal-cb" checked={isRenewal} onChange={(e) => setIsRenewal(e.target.checked)} className="w-4 h-4 rounded border-[#E5E7EB] text-[#EF4444] transition-all" />
                          <Label htmlFor="renewal-cb" className="text-[13px] text-[#374151] font-medium cursor-pointer">Auto renewal</Label>
                        </div>
                        <Button onClick={handleAddUser} className="h-[36px] px-4 rounded-[10px] bg-[#EF4444] text-white hover:bg-[#DC2626] text-[13px] font-medium gap-2 border-0 shadow-sm transition-all">
                          <UserPlus className="w-4 h-4" /> Add User ({addedUsers.length}/10)
                        </Button>
                      </div>
                    )}

                    {userPopupMode === "create" && addedUsers.length > 0 && (
                      <div className="mt-4 p-4 bg-[#F9FAFB] rounded-[12px] border border-[#E5E7EB]">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox" 
                              className="w-4 h-4 rounded border-[#E5E7EB] text-[#EF4444] transition-all cursor-pointer"
                              checked={selectedAddedUserIndices.length === addedUsers.length && addedUsers.length > 0}
                              onChange={handleToggleSelectAll}
                            />
                            <h4 className="text-[14px] font-bold text-[#111827]">Added Users</h4>
                          </div>
                          <Badge className="bg-[#EF4444] text-white text-[11px] px-2 py-0.5">
                            {selectedAddedUserIndices.length}/{addedUsers.length}
                          </Badge>
                        </div>
                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                          {addedUsers.map((user, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2.5 bg-white border border-[#E5E7EB] rounded-[8px]">
                              <div className="flex items-center gap-3">
                                <input 
                                  type="checkbox" 
                                  className="w-4 h-4 rounded border-[#E5E7EB] text-[#EF4444] transition-all cursor-pointer"
                                  checked={selectedAddedUserIndices.includes(idx)}
                                  onChange={() => handleToggleUserSelection(idx)}
                                />
                                <div>
                                  <p className="text-sm font-medium text-[#111827]">{user.nameEn}</p>
                                  <p className="text-xs text-[#6B7280]">{user.email}</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-[#EF4444] hover:bg-[#EF4444]/10" onClick={() => handleRemoveAddedUser(idx)}>
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>

                        {/* Print Selected Section Inside Card */}
                        <div className="pt-4 mt-4 border-t border-[#E5E7EB] flex justify-end">
                          <Button
                            className="h-[36px] px-[16px] rounded-[10px] bg-[#EF4444] text-white hover:bg-[#DC2626] font-medium text-[13px] border-0 shadow-sm transition-all gap-2 disabled:opacity-50 disabled:bg-gray-300 disabled:text-gray-500"
                            onClick={handlePrintSelected}
                            disabled={selectedAddedUserIndices.length === 0}
                          >
                            <FileText className="w-4 h-4" />
                            Print Selected ({selectedAddedUserIndices.length})
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            <div className="sticky bottom-0 bg-white z-10 py-[14px] px-[24px] border-t border-[#F1F1F1] shrink-0 flex justify-end gap-[12px]">
              {userPopupMode === "view" ? (
                <Button className="h-[36px] px-[24px] rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium text-[13px] border-0 shadow-sm transition-all" onClick={() => setIsUserModalOpen(false)}>
                  Close
                </Button>
              ) : (
                <>
                  <Button variant="outline" className="h-[36px] px-[20px] rounded-[10px] border-[#E5E7EB] text-[#374151] font-medium text-[13px] hover:bg-gray-50 transition-all" onClick={() => setIsUserModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    className="h-[36px] px-[20px] rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-medium text-[13px] border-0 shadow-sm transition-all"
                    onClick={userPopupMode === "create" ? handleCreateAllUsers : handleSaveEditedUser}
                    disabled={userPopupMode === "create" && addedUsers.length === 0}
                  >
                    {userPopupMode === "create" ? "Create All Users" : "Save Changes"}
                  </Button>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>




        {/* Upload File Dialog for Saved Users */}
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogContent className="sm:max-w-[500px] bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl font-bold text-[#1A1A1A]">Upload File</DialogTitle>
              <DialogDescription className="text-[#6B6B6B] mt-2">
                Upload a file for {uploadingForUser?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* User Info */}
              <div className="bg-[#F5F5F5] rounded-xl p-4">
                <div className="flex items-center gap-0">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="font-semibold text-[#1a1a1a] text-sm">{uploadingForUser?.name}</p>
                      <p className="text-xs text-[#666666]">{uploadingForUser?.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ED1C24]/10 to-[#FF6B6B]/10 flex items-center justify-center">
                      <UsersIcon className="w-5 h-5 text-[#ED1C24]" />
                    </div>
                    <Badge className="bg-[#003F72] text-white px-3 py-1 text-xs">
                      {uploadingForUser?.groupId}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* File Upload Area */}
              {!groupUploadedFile ? (
                <div
                  className="relative border-2 border-dashed border-[#E0E0E0] rounded-xl p-8 bg-[#F5F5F5] hover:border-[#ED1C24] hover:bg-[#FAFAFA] transition-all"
                >
                  <input
                    type="file"
                    id="group-file-upload"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setGroupUploadedFile(e.target.files[0]);
                      }
                    }}
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="group-file-upload"
                    className="flex flex-col items-center justify-center cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ED1C24] to-[#d41820] flex items-center justify-center mb-4 shadow-lg">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-[#1A1A1A] font-medium text-base mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-[#9B9B9B] text-sm">
                      PDF, DOC, DOCX, JPG, PNG (max 5MB)
                    </p>
                  </label>
                </div>
              ) : (
                <div className="bg-white border border-[#E0E0E0] rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#ED1C24] to-[#d41820] flex items-center justify-center">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-[#1A1A1A] font-medium text-sm">{groupUploadedFile.name}</p>
                      <p className="text-[#9B9B9B] text-xs">{(groupUploadedFile.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    onClick={() => setGroupUploadedFile(null)}
                    variant="ghost"
                    size="sm"
                    className="text-[#ED1C24] hover:text-[#d41820] hover:bg-[#FFF5F5] rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    if (!groupUploadedFile) {
                      toast.error("Please select a file to upload");
                      return;
                    }
                    if (uploadingForUser) {
                      // Save the uploaded file info - either for a specific user or for the whole group
                      const fileKey = uploadingForUser.userId 
                        ? `${uploadingForUser.groupId}-${uploadingForUser.userId}`
                        : `${uploadingForUser.groupId}-group`;
                      setUserUploadedFiles({
                        ...userUploadedFiles,
                        [fileKey]: {
                          name: groupUploadedFile.name,
                          size: groupUploadedFile.size
                        }
                      });
                      const successMessage = uploadingForUser.name 
                        ? `File "${groupUploadedFile.name}" uploaded successfully for ${uploadingForUser.name}!`
                        : `File "${groupUploadedFile.name}" uploaded successfully for group ${uploadingForUser.groupId}!`;
                      toast.success(successMessage);
                    }
                    setUploadDialogOpen(false);
                    setGroupUploadedFile(null);
                    setUploadingForUser(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-[#ED1C24] to-[#d41820] hover:from-[#d41820] hover:to-[#c0151b] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setUploadDialogOpen(false);
                    setGroupUploadedFile(null);
                    setUploadingForUser(null);
                  }}
                  className="flex-1 border-[#E0E0E0] rounded-xl h-12 hover:bg-[#EBECE8]/50 transition-all"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={successDialogOpen} onOpenChange={setSuccessDialogOpen}>
          <DialogContent className="max-w-md bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
            <div className="px-8 pt-8 pb-8">
              <DialogHeader className="sr-only">
                <DialogTitle>Users Created Successfully!</DialogTitle>
                <DialogDescription>Your users have been created</DialogDescription>
              </DialogHeader>
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 rounded-full blur-2xl scale-150"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(16,185,129,0.4)]">
                      <div className="relative">
                        <UsersIcon className="w-10 h-10 text-white" strokeWidth={2} />
                        <CheckCircle2 className="w-6 h-6 text-white absolute -bottom-1 -right-1" strokeWidth={2.5} />
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#10B981]/30 animate-ping"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#1A1A1A]">Users Created Successfully!</h3>
                  <p className="text-[#6B6B6B] text-sm">
                    Your users have been created and saved to the system
                  </p>
                </div>
                <div className="space-y-4 text-left">
                  {/* Group ID Display */}
                  <div className="bg-gradient-to-br from-[#F0F4F8] to-[#E8EDF2] rounded-2xl p-6 border border-[#E0E0E0]">
                    <div className="text-center">
                      <p className="text-sm text-[#6B6B6B] mb-2 font-medium">Group ID</p>
                      <p className="text-3xl font-bold text-[#ED1C24] tracking-wide">{createdGroupId}</p>
                    </div>
                  </div>

                  {/* Info Message */}
                  <div className="flex items-start gap-3 p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl">
                    <div className="w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm text-[#1E40AF] flex-1">
                      You can view and manage these users in the <span className="font-semibold">Saved Users</span> tab
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => {
                      setSuccessDialogOpen(false);
                      setActiveMainTab("saved");
                      const newGroup = userGroups.find(g => g.id === createdGroupId);
                      if (newGroup) {
                        setSelectedGroup(newGroup);
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-[#ED1C24] to-[#d41820] hover:from-[#d41820] hover:to-[#c0151b] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300 font-semibold"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Users
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setSuccessDialogOpen(false)}
                    className="flex-1 border-2 border-[#E0E0E0] rounded-xl h-12 hover:bg-[#F5F5F5] transition-all font-semibold text-[#4A4A4A]"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteConfirmDialogOpen} onOpenChange={setDeleteConfirmDialogOpen}>
          <DialogContent className="max-w-md bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
            <div className="px-8 pt-8 pb-8">
              <DialogHeader className="sr-only">
                <DialogTitle>Delete User</DialogTitle>
                <DialogDescription>Confirm deletion of the user</DialogDescription>
              </DialogHeader>
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B6B]/20 to-[#ED1C24]/20 rounded-full blur-2xl scale-150"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#FF6B6B] to-[#ED1C24] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(237,28,36,0.4)]">
                      <div className="relative">
                        <Trash2 className="w-10 h-10 text-white" strokeWidth={2} />
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#FF6B6B]/30 animate-ping"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#1A1A1A]">Delete User</h3>
                  <p className="text-[#6B6B6B] text-sm">
                    Are you sure you want to delete this user? This action cannot be undone.
                  </p>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      if (userToDelete) handleDeleteUserFromGroup(userToDelete.groupId, userToDelete.userId);
                    }}
                    className="w-full bg-gradient-to-r from-[#ED1C24] to-[#d41820] hover:from-[#d41820] hover:to-[#c0151b] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300"
                  >
                    Delete User
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
          <DialogContent className="max-w-md bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
            <div className="px-8 pt-8 pb-8">
              <DialogHeader className="sr-only">
                <DialogTitle>User Deleted Successfully</DialogTitle>
                <DialogDescription>The user has been deleted</DialogDescription>
              </DialogHeader>
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 rounded-full blur-2xl scale-150"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(16,185,129,0.4)]">
                      <div className="relative">
                        <UsersIcon className="w-10 h-10 text-white" strokeWidth={2} />
                        <CheckCircle2 className="w-6 h-6 text-white absolute -bottom-1 -right-1" strokeWidth={2.5} />
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#10B981]/30 animate-ping"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#1A1A1A]">User Deleted Successfully</h3>
                  <p className="text-[#6B6B6B] text-sm">
                    The user has been removed from the group successfully.
                  </p>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={() => setDeleteSuccessDialogOpen(false)}
                    className="w-full bg-gradient-to-r from-[#ED1C24] to-[#d41820] hover:from-[#d41820] hover:to-[#c0151b] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Directory User Delete Confirmation Dialog */}
        <Dialog open={directoryDeleteConfirmOpen} onOpenChange={setDirectoryDeleteConfirmOpen}>
          <DialogContent className="max-w-md bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
            <div className="px-8 pt-8 pb-8">
              <DialogHeader className="sr-only">
                <DialogTitle>Delete User</DialogTitle>
                <DialogDescription>Confirm deletion of the directory user</DialogDescription>
              </DialogHeader>
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B6B]/20 to-[#ED1C24]/20 rounded-full blur-2xl scale-150"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#FF6B6B] to-[#ED1C24] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(237,28,36,0.4)]">
                      <div className="relative">
                        <Trash2 className="w-10 h-10 text-white" strokeWidth={2} />
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#FF6B6B]/30 animate-ping"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#1A1A1A]">Delete User</h3>
                  <p className="text-[#6B6B6B] text-sm">
                    Are you sure you want to delete {directoryUserToDelete?.name}? This action cannot be undone.
                  </p>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={handleDeleteDirectoryUser}
                    className="w-full bg-gradient-to-r from-[#ED1C24] to-[#d41820] hover:from-[#d41820] hover:to-[#c0151b] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300"
                  >
                    Delete User
                  </Button>
                  <Button
                    onClick={() => setDirectoryDeleteConfirmOpen(false)}
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

        {/* Directory User Delete Success Dialog */}
        <Dialog open={directoryDeleteSuccessOpen} onOpenChange={setDirectoryDeleteSuccessOpen}>
          <DialogContent className="max-w-md bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
            <div className="px-8 pt-8 pb-8">
              <DialogHeader className="sr-only">
                <DialogTitle>User Deleted Successfully</DialogTitle>
                <DialogDescription>The directory user has been deleted</DialogDescription>
              </DialogHeader>
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 rounded-full blur-2xl scale-150"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(16,185,129,0.4)]">
                      <div className="relative">
                        <UsersIcon className="w-10 h-10 text-white" strokeWidth={2} />
                        <CheckCircle2 className="w-6 h-6 text-white absolute -bottom-1 -right-1" strokeWidth={2.5} />
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#10B981]/30 animate-ping"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#1A1A1A]">User Deleted Successfully</h3>
                  <p className="text-[#6B6B6B] text-sm">
                    {directoryUserToDelete?.name} has been removed from the user directory successfully.
                  </p>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={() => setDirectoryDeleteSuccessOpen(false)}
                    className="w-full bg-gradient-to-r from-[#ED1C24] to-[#d41820] hover:from-[#d41820] hover:to-[#c0151b] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* User Group Delete Confirmation Dialog */}
        <Dialog open={groupDeleteConfirmOpen} onOpenChange={setGroupDeleteConfirmOpen}>
          <DialogContent className="max-w-md bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
            <div className="px-8 pt-8 pb-8">
              <DialogHeader className="sr-only">
                <DialogTitle>Delete User Group</DialogTitle>
                <DialogDescription>Confirm deletion of the user group</DialogDescription>
              </DialogHeader>
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B6B]/20 to-[#ED1C24]/20 rounded-full blur-2xl scale-150"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#FF6B6B] to-[#ED1C24] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(237,28,36,0.4)]">
                      <div className="relative">
                        <Trash2 className="w-10 h-10 text-white" strokeWidth={2} />
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#FF6B6B]/30 animate-ping"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#1A1A1A]">Delete User Group</h3>
                  <p className="text-[#6B6B6B] text-sm">
                    Are you sure you want to delete this user group? This action cannot be undone.
                  </p>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={handleDeleteGroup}
                    className="w-full bg-gradient-to-r from-[#ED1C24] to-[#d41820] hover:from-[#d41820] hover:to-[#c0151b] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300"
                  >
                    Delete Group
                  </Button>
                  <Button
                    onClick={() => setGroupDeleteConfirmOpen(false)}
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

        {/* User Group Delete Success Dialog */}
        <Dialog open={groupDeleteSuccessOpen} onOpenChange={setGroupDeleteSuccessOpen}>
          <DialogContent className="max-w-md bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
            <div className="px-8 pt-8 pb-8">
              <DialogHeader className="sr-only">
                <DialogTitle>User Group Deleted Successfully</DialogTitle>
                <DialogDescription>The user group has been deleted</DialogDescription>
              </DialogHeader>
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 rounded-full blur-2xl scale-150"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(16,185,129,0.4)]">
                      <div className="relative">
                        <UsersIcon className="w-10 h-10 text-white" strokeWidth={2} />
                        <CheckCircle2 className="w-6 h-6 text-white absolute -bottom-1 -right-1" strokeWidth={2.5} />
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#10B981]/30 animate-ping"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#1A1A1A]">User Group Deleted Successfully</h3>
                  <p className="text-[#6B6B6B] text-sm">
                    The user group has been removed successfully.
                  </p>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={() => setGroupDeleteSuccessOpen(false)}
                    className="w-full bg-gradient-to-r from-[#ED1C24] to-[#d41820] hover:from-[#d41820] hover:to-[#c0151b] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Request Confirmation Dialog */}
        <Dialog open={requestConfirmDialogOpen} onOpenChange={setRequestConfirmDialogOpen}>
          <DialogContent className="max-w-md bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
            <div className="px-8 pt-8 pb-8">
              <DialogHeader className="sr-only">
                <DialogTitle>Request Sent!</DialogTitle>
                <DialogDescription>Your request has been sent to the Admin</DialogDescription>
              </DialogHeader>
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#10B981]/20 to-[#059669]/20 rounded-full blur-2xl scale-150"></div>
                    <div className="relative w-24 h-24 bg-gradient-to-br from-[#10B981] to-[#059669] rounded-full flex items-center justify-center shadow-[0_8px_32px_rgba(16,185,129,0.4)]">
                      <div className="relative">
                        <UsersIcon className="w-10 h-10 text-white" strokeWidth={2} />
                        <CheckCircle2 className="w-6 h-6 text-white absolute -bottom-1 -right-1" strokeWidth={2.5} />
                      </div>
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-[#10B981]/30 animate-ping"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-[#1A1A1A]">Request Sent!</h3>
                  <p className="text-[#6B6B6B] text-sm">
                    Your request has been sent to the Admin for approval.
                  </p>
                </div>
                <div className="space-y-4 text-left">
                  {/* Info Box */}
                  <div className="flex items-start gap-3 p-4 bg-[#EFF6FF] border border-[#BFDBFE] rounded-xl">
                    <div className="w-5 h-5 rounded-full bg-[#3B82F6] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm text-[#1E40AF] flex-1">
                      You will be notified once the Admin reviews and approves your request for <span className="font-semibold">Group {requestingGroupId}</span>
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={() => setRequestConfirmDialogOpen(false)}
                    className="w-full bg-gradient-to-r from-[#ED1C24] to-[#d41820] hover:from-[#d41820] hover:to-[#c0151b] text-white rounded-xl h-12 shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Printable Area - Hidden by default, visible only in print */}
        <div id="printable-area" className="hidden">
          <div className="p-10 text-[#111827]">
            <div className="flex justify-between items-end border-b-2 border-[#EF4444] pb-5 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-[#DC2626] m-0">Added Users List</h1>
                <p className="text-sm text-[#6B7280] m-0 mt-1">BSDI System - User Creation Report</p>
              </div>
              <div className="text-sm text-[#6B7280]">Date: {new Date().toLocaleDateString('en-GB')}</div>
            </div>
            
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="text-left bg-[#F9FAFB] p-3 border border-[#E5E7EB] text-xs uppercase tracking-wider font-semibold text-[#4B5563]">#</th>
                  <th className="text-left bg-[#F9FAFB] p-3 border border-[#E5E7EB] text-xs uppercase tracking-wider font-semibold text-[#4B5563]">Name</th>
                  <th className="text-left bg-[#F9FAFB] p-3 border border-[#E5E7EB] text-xs uppercase tracking-wider font-semibold text-[#4B5563]">Email Address</th>
                </tr>
              </thead>
              <tbody>
                {addedUsers.filter((_, idx) => selectedAddedUserIndices.includes(idx)).map((user, i) => (
                  <tr key={i} className={i % 2 === 1 ? 'bg-[#FDFDFD]' : ''}>
                    <td className="p-3 border border-[#E5E7EB] text-sm">{i + 1}</td>
                    <td className="p-3 border border-[#E5E7EB] text-sm font-medium">{user.nameEn}</td>
                    <td className="p-3 border border-[#E5E7EB] text-sm">{user.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="mt-10 pt-5 border-t border-[#E5E7EB] flex justify-between text-xs text-[#6B7280]">
              <div>Generated by BSDI Admin Panel</div>
              <div>Total Selected Users: <span className="bg-[#FEE2E2] text-[#DC2626] px-2 py-0.5 rounded-full font-bold">{addedUsers.filter((_, idx) => selectedAddedUserIndices.includes(idx)).length}</span></div>
            </div>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            body * {
              visibility: hidden !important;
            }
            #printable-area, #printable-area * {
              visibility: visible !important;
            }
            #printable-area {
              display: block !important;
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              background: white !important;
            }
          }
        `}} />
      </div>
    </div>
  );
}