import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { FileCheck, Download, ChevronUp, ChevronDown, Eye, Activity, AlertTriangle, Users, Plus, Search, X } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { MetricCard } from "../../components/ui/MetricCard";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "../../components/ui/select";

const auditLogs = [
  { id: 1, action: "User Login", user: "superadmin_bsdi", ip: "192.168.1.100", status: "success", time: "2024-03-04 14:32:18", module: "Authentication", organization_id: "BSDI", department_id: "Corporate" },
  { id: 2, action: "Organization Created", user: "superadmin_bsdi", ip: "192.168.1.100", status: "success", time: "2024-03-04 14:28:45", module: "Organizations", organization_id: "BSDI", department_id: "Corporate" },
  { id: 3, action: "Data Access Approved", user: "entity_admin", ip: "192.168.1.105", status: "success", time: "2024-03-04 14:15:22", module: "Data Access", organization_id: "Urban Planning Authority", department_id: "Urban Planning Department" },
  { id: 4, action: "Failed Login Attempt", user: "unknown", ip: "203.45.67.89", status: "failed", time: "2024-03-04 14:12:11", module: "Authentication", organization_id: "BSDI", department_id: "Technical" },
  { id: 5, action: "Department Created", user: "entity_admin", ip: "192.168.1.105", status: "success", time: "2024-03-04 13:47:11", module: "Departments", organization_id: "Urban Planning Authority", department_id: "Urban Planning Department" },
  { id: 6, action: "Role Assignment", user: "department_user", ip: "192.168.1.112", status: "success", time: "2024-03-04 13:22:34", module: "Roles", organization_id: "Urban Planning Authority", department_id: "Urban Planning Department" },
  { id: 7, action: "Metadata Updated", user: "superadmin_bsdi", ip: "192.168.1.100", status: "success", time: "2024-03-04 12:58:09", module: "Metadata", organization_id: "BSDI", department_id: "Corporate" },
  { id: 8, action: "User Deactivated", user: "entity_admin", ip: "192.168.1.105", status: "success", time: "2024-03-04 12:34:22", module: "Users", organization_id: "Urban Planning Authority", department_id: "Urban Planning Department" },
];

export default function AuditLogs() {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedLog, setSelectedLog] = useState<typeof auditLogs[0] | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const isDeptAdmin = window.location.pathname.includes("/department");
  const ADMIN_ORG = "Urban Planning Authority";
  const ADMIN_DEPT = "Urban Planning Department";

  const filteredAuditLogs = isDeptAdmin 
    ? auditLogs.filter(log => log.organization_id === ADMIN_ORG && log.department_id === ADMIN_DEPT)
    : auditLogs;

  const sortedLogs = [...filteredAuditLogs].sort((a, b) => {
    if (!sortColumn) return 0;
    const aVal = a[sortColumn as keyof typeof a];
    const bVal = b[sortColumn as keyof typeof b];
    if (aVal < bVal) return sortDirection === "asc" ? -1 : 1;
    if (aVal > bVal) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

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
          title="Audit Logs"
          description="Monitor system activity and governance events"
        >
          <Button variant="default" className="h-11 px-6 rounded-xl font-semibold shadow-sm bg-[#003F72] hover:bg-[#00365d] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </PageHeader>

        {/* Standardized Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            value={isDeptAdmin ? filteredAuditLogs.length.toString() : "486"} 
            label="Events Today" 
            icon={<FileCheck className="w-6 h-6" />} 
            variant="blue" 
          />
          <MetricCard 
            value={isDeptAdmin ? (filteredAuditLogs.length * 2.5).toFixed(1).toString() + "k" : "12.5k"} 
            label="This Month" 
            icon={<Activity className="w-6 h-6" />} 
            variant="green" 
          />
          <MetricCard 
            value={isDeptAdmin ? "0" : "3"} 
            label="Failed Events" 
            icon={<AlertTriangle className="w-6 h-6" />} 
            variant="red" 
          />
          <MetricCard 
            value={isDeptAdmin ? "245" : "2,847"} 
            label="Total Users" 
            icon={<Users className="w-6 h-6" />} 
            variant="purple" 
          />
        </div>

        {/* audit logs table wrapper */}
        <Card className="bg-white border border-[#E5E7EB] rounded-[16px] shadow-[0px_1px_2px_rgba(0,0,0,0.04)] overflow-hidden p-6">
          {/* Header & Filter Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-[#111827]">Recent Activity Logs</h2>
              <p className="text-[14px] text-[#6B7280]">Real-time system monitoring and event history</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-[12px]">
              <div className="relative">
                <Search className="absolute left-[12px] top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF] pointer-events-none" />
                <Input 
                  placeholder="Search activity..."
                  className="w-[240px] pl-[36px] pr-[12px] h-[36px] border border-[#E5E7EB] bg-[#F9FAFB] rounded-[10px] text-[14px] focus:border-[#EF4444] transition-all"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px] h-[36px] border border-[#E5E7EB] bg-white rounded-[10px] px-[12px] text-[14px]">
                  <SelectValue placeholder="Application" />
                </SelectTrigger>
                <SelectContent className="rounded-[10px] border-[#F1F1F1] shadow-xl">
                  <SelectItem value="all">Applications</SelectItem>
                  <SelectItem value="auth">Authentication</SelectItem>
                  <SelectItem value="orgs">Organizations</SelectItem>
                  <SelectItem value="data">Data Access</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="all">
                <SelectTrigger className="w-[120px] h-[36px] border border-[#E5E7EB] bg-white rounded-[10px] px-[12px] text-[14px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-[10px] border-[#F1F1F1] shadow-xl">
                  <SelectItem value="all">Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto border border-[#F1F1F1] rounded-[12px] overflow-hidden">
            <div className="min-w-[1100px]">
              {/* Table Header Row */}
              <div 
                className="bg-[#FAFAFA] border-b border-[#E5E7EB] px-6 py-4 grid items-center" 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '240px 1fr 140px 140px 180px 100px 80px',
                  columnGap: '16px'
                }}
              >
                <div className="text-[13px] font-semibold text-[#374151]">Activity</div>
                <div className="text-[13px] font-semibold text-[#374151]">User</div>
                <div className="text-[13px] font-semibold text-[#374151]">IP Address</div>
                <div className="text-[13px] font-semibold text-[#374151]">Application</div>
                <div className="text-[13px] font-semibold text-[#374151]">Date & Time</div>
                <div className="text-[13px] font-semibold text-[#374151]">Status</div>
                <div className="text-[13px] font-semibold text-[#374151] text-center">Actions</div>
              </div>

              {/* Table Body Rows */}
              <div className="divide-y divide-[#F1F5F9]">
                {sortedLogs.length > 0 ? (
                  sortedLogs.map((log) => (
                    <div 
                      key={log.id} 
                      className="h-[56px] px-6 grid items-center hover:bg-[#F9FAFB] transition-colors border-b border-[#F1F5F9] last:border-0"
                      style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '240px 1fr 140px 140px 180px 100px 80px',
                        columnGap: '16px',
                        fontSize: '14px',
                        color: '#111827'
                      }}
                    >
                      {/* Activity */}
                      <div className="flex flex-col min-w-0 pr-4">
                        <div className="text-[14px] font-semibold text-[#111827] truncate">{log.action}</div>
                      </div>

                      {/* User */}
                      <div className="text-[#111827] font-medium truncate pr-4">{log.user}</div>

                      {/* IP Address */}
                      <div className="text-[#64748B] font-mono text-[13px] truncate pr-4">{log.ip}</div>

                      {/* Application */}
                      <div className="flex items-center min-w-0">
                        <span className="bg-[#EFF6FF] text-[#1D4ED8] text-[12px] font-medium px-[10px] py-[4px] rounded-full whitespace-nowrap">
                          {log.module}
                        </span>
                      </div>

                      {/* Date & Time */}
                      <div className="text-[#64748B] text-[13px] whitespace-nowrap">{log.time}</div>

                      {/* Status */}
                      <div className="text-left">
                        <Badge 
                          className={`
                            ${log.status === 'success' 
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                              : 'bg-red-50 text-red-700 border-red-100'
                            }
                            font-bold text-[11px] rounded-full px-3 py-1 border text-[11px] uppercase tracking-tight
                          `}
                        >
                          {log.status}
                        </Badge>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-center">
                        <button 
                          className="h-8 w-8 rounded-lg text-[#6B7280] hover:text-[#326594] hover:bg-[#326594]/5 flex items-center justify-center transition-colors"
                          onClick={() => {
                            setSelectedLog(log);
                            setIsDetailsOpen(true);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-[14px] text-[#6B7280]">
                    No audit logs available for your department
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table Footer / Pagination */}
          <div className="pt-6 border-t border-[#F3F4F6] mt-6 flex items-center justify-between">
            <div className="text-xs font-medium text-[#6B7280]">
              Showing <span className="text-[#111827]">{sortedLogs.length}</span> results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 rounded-lg border-[#E5E7EB] text-[#374151]"
                disabled
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                <Button 
                   size="sm" 
                   className="h-8 w-8 rounded-lg text-xs font-bold bg-[#EF4444] text-white border-[#EF4444]"
                >1</Button>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 rounded-lg border-[#E5E7EB] text-[#374151]"
                disabled
              >
                Next
              </Button>
            </div>
          </div>
        </Card>

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="w-[520px] max-w-[90vw] h-[500px] overflow-hidden bg-white rounded-[16px] border border-[#E5E7EB] shadow-2xl p-0 flex flex-col [&>button]:hidden">
            <div 
              className="absolute top-[16px] right-[16px] w-[32px] h-[32px] rounded-[8px] bg-[#F9FAFB] hover:bg-[#F3F4F6] flex items-center justify-center cursor-pointer transition-colors z-50 px-0"
              onClick={() => setIsDetailsOpen(false)}
            >
              <X className="w-4 h-4 text-[#6B7280]" />
            </div>
            
            <DialogHeader className="sticky top-0 bg-white z-10 pt-[24px] px-[24px] pb-[16px] border-b border-[#F1F5F9] shrink-0">
              <DialogTitle className="text-[20px] font-semibold text-[#EF4444]">Audit Log Details</DialogTitle>
              <DialogDescription className="text-[#6B7280] text-[14px] mt-1 leading-tight">
                Comprehensive overview of this activity event metadata
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-[24px] py-[24px] custom-scrollbar">
              {selectedLog && (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-x-[24px] gap-y-[24px]">
                    {/* Activity */}
                    <div className="flex flex-col gap-[6px]">
                      <span className="text-[12px] text-[#6B7280] font-normal">Activity</span>
                      <span className="text-[14px] text-[#111827] font-semibold">{selectedLog.action}</span>
                    </div>

                    {/* User */}
                    <div className="flex flex-col gap-[6px]">
                      <span className="text-[12px] text-[#6B7280] font-normal">User Handle</span>
                      <span className="text-[14px] text-[#111827] font-semibold">{selectedLog.user}</span>
                    </div>

                    {/* IP Address */}
                    <div className="flex flex-col gap-[6px]">
                      <span className="text-[12px] text-[#6B7280] font-normal">IP Address</span>
                      <span className="text-[14px] text-[#111827] font-semibold font-mono">{selectedLog.ip}</span>
                    </div>

                    {/* Date & Time */}
                    <div className="flex flex-col gap-[6px]">
                      <span className="text-[12px] text-[#6B7280] font-normal">Date & Time</span>
                      <span className="text-[14px] text-[#111827] font-semibold">{selectedLog.time}</span>
                    </div>

                    {/* Application */}
                    <div className="flex flex-col gap-[6px]">
                      <span className="text-[12px] text-[#6B7280] font-normal">Application</span>
                      <div className="flex">
                        <Badge variant="outline" className="bg-[#EFF6FF] text-[#1D4ED8] border-none text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-tight">
                          {selectedLog.module}
                        </Badge>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col gap-[6px] items-start">
                      <span className="text-[12px] text-[#6B7280] font-normal">Status</span>
                      <Badge 
                        className={`
                          ${selectedLog.status === 'success' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                            : 'bg-red-50 text-red-700 border-red-100'
                          }
                          border text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-tight
                        `}
                      >
                        {selectedLog.status}
                      </Badge>
                    </div>

                    {/* System Metadata */}
                    <div className="col-span-2 pt-4 border-t border-[#F1F5F9]">
                      <div className="grid grid-cols-2 gap-[24px]">
                        <div className="flex flex-col gap-[6px]">
                          <span className="text-[12px] text-[#6B7280] font-normal">Event ID</span>
                          <span className="text-[14px] text-[#111827] font-semibold font-mono">AUDIT-{selectedLog.id}2024</span>
                        </div>
                        <div className="flex flex-col gap-[6px]">
                          <span className="text-[12px] text-[#6B7280] font-normal">Platform</span>
                          <span className="text-[14px] text-[#111827] font-semibold font-mono text-[13px]">BSDI-SECURITYCONTROL</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white z-10 py-[16px] px-[24px] border-t border-[#E5E7EB] shrink-0 flex justify-end mt-auto">
              <Button 
                variant="default"
                onClick={() => setIsDetailsOpen(false)}
                className="w-[120px] h-[40px] rounded-[10px] bg-[#EF4444] hover:bg-[#DC2626] text-white font-semibold"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}