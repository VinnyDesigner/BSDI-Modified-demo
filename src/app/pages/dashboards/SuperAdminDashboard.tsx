import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  Building2, Users, Activity, Plus, CheckCircle,
  Clock, AlertCircle, TrendingUp, Database, Shield, X, Check, Maximize2, Server, UsersRound, Download, Calendar, Printer, FileText, ChevronDown,
  MapPin, Route, Construction, Network, Wind, Droplets, Waves,
  Layers, User, BadgeCheck, LayoutGrid
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "../../components/ui/dropdown-menu";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Textarea } from "../../components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Checkbox } from "../../components/ui/checkbox";
import CustomChartTooltip from "../../components/ui/CustomChartTooltip";
import { useState } from "react";
import { toast } from "sonner";

const kpiData = [
  { label: "Total Organizations", value: "142",   change: "+12",  icon: Building2,  color: "#3B82F6" },
  { label: "Registered Users",    value: "2,847",  change: "+156", icon: Users,      color: "#3B82F6" },
  { label: "Pending Approvals",   value: "28",     change: "-5",   icon: Clock,      color: "#F59E0B" },
  { label: "Data Requests Today", value: "67",     change: "+18",  icon: FileText,   color: "#F59E0B" },
  { label: "Approved Services",   value: "1,234",  change: "+89",  icon: BadgeCheck, color: "#22C55E" },
  { label: "Total Services",      value: "456",    change: "+24",  icon: Layers,     color: "#3B82F6" },
  { label: "Total Users",         value: "3,521",  change: "+342", icon: Users,      color: "#3B82F6" },
  { label: "Total Groups",        value: "87",     change: "+18",  icon: User,       color: "#3B82F6" },
];

const nationalAccessData = [
  { id: "jan", month: "Jan", requests: 245, approved: 220, pending: 25 },
  { id: "feb", month: "Feb", requests: 312, approved: 285, pending: 27 },
  { id: "mar", month: "Mar", requests: 428, approved: 398, pending: 30 },
  { id: "apr", month: "Apr", requests: 389, approved: 365, pending: 24 },
  { id: "may", month: "May", requests: 467, approved: 442, pending: 25 },
  { id: "jun", month: "Jun", requests: 523, approved: 495, pending: 28 },
  { id: "jul", month: "Jul", requests: 498, approved: 470, pending: 28 },
  { id: "aug", month: "Aug", requests: 545, approved: 515, pending: 30 },
  { id: "sep", month: "Sep", requests: 612, approved: 580, pending: 32 },
  { id: "oct", month: "Oct", requests: 578, approved: 548, pending: 30 },
  { id: "nov", month: "Nov", requests: 634, approved: 602, pending: 32 },
  { id: "dec", month: "Dec", requests: 689, approved: 655, pending: 34 },
];

const orgParticipationData = [
  { id: "gov", name: "Government", value: 67, color: "#EF4444" },
  { id: "semi-gov", name: "Semi-Government", value: 45, color: "#003F72" },
  { id: "private", name: "Private", value: 30, color: "#6B6B6B" },
];

const pendingApprovals = [
  { id: 1, type: "Department Creation", org: "Ministry of Education", submittedBy: "Ahmed Al-Khalifa", date: "2024-03-04", priority: "high" },
  { id: 2, type: "User Creation", org: "Urban Planning", submittedBy: "Sara Mohammed", date: "2024-03-03", priority: "medium" },
  { id: 3, type: "Data Access", org: "Transport Authority", submittedBy: "Khalid Ali", date: "2024-03-02", priority: "high" },
  { id: 4, type: "Role Assignment", org: "Health Ministry", submittedBy: "Fatima Hassan", date: "2024-03-01", priority: "low" },
];

const recentActivity = [
  { action: "Approved", item: "Department: GIS Analysis Unit", org: "Ministry of Works", time: "2 hours ago" },
  { action: "Reviewed", item: "Metadata: Transportation Network", org: "Transport Authority", time: "5 hours ago" },
  { action: "Approved", item: "User: Mohammed Ahmed", org: "Urban Planning", time: "1 day ago" },
  { action: "Created", item: "Organization: Digital Government", org: "Government Affairs", time: "2 days ago" },
];

// API Analytics Data
const requestsOverTimeData = [
  { id: "req-nov21", date: "Nov 21", requests: 85000 },
  { id: "req-nov23", date: "Nov 23", requests: 75000 },
  { id: "req-nov25", date: "Nov 25", requests: 95000 },
  { id: "req-nov27", date: "Nov 27", requests: 88000 },
  { id: "req-nov30", date: "Nov 30", requests: 78000 },
  { id: "req-dec2", date: "Dec 2", requests: 92000 },
  { id: "req-dec4", date: "Dec 4", requests: 82000 },
  { id: "req-dec6", date: "Dec 6", requests: 98000 },
  { id: "req-dec8", date: "Dec 8", requests: 90000 },
  { id: "req-dec10", date: "Dec 10", requests: 96000 },
  { id: "req-dec12", date: "Dec 12", requests: 84000 },
  { id: "req-dec14", date: "Dec 14", requests: 99000 },
  { id: "req-dec15", date: "Dec 15", requests: 92994 },
  { id: "req-dec16", date: "Dec 16", requests: 105000 },
  { id: "req-dec18", date: "Dec 18", requests: 94000 },
];

const apiUsageTrendData = [
  { id: "usage-nov20", date: "Nov 20", requests: 45000, success: 42000, failure: 3000 },
  { id: "usage-nov23", date: "Nov 23", requests: 48000, success: 45000, failure: 3000 },
  { id: "usage-nov26", date: "Nov 26", requests: 52000, success: 49000, failure: 3000 },
  { id: "usage-nov29", date: "Nov 29", requests: 50000, success: 47000, failure: 3000 },
  { id: "usage-dec1", date: "Dec 1", requests: 55000, success: 52000, failure: 3000 },
  { id: "usage-dec3", date: "Dec 3", requests: 58000, success: 55000, failure: 3000 },
  { id: "usage-dec5", date: "Dec 5", requests: 62000, success: 59000, failure: 3000 },
  { id: "usage-dec7", date: "Dec 7", requests: 60000, success: 57000, failure: 3000 },
  { id: "usage-dec9", date: "Dec 9", requests: 65000, success: 62000, failure: 3000 },
  { id: "usage-dec11", date: "Dec 11", requests: 63000, success: 60000, failure: 3000 },
  { id: "usage-dec13", date: "Dec 13", requests: 68000, success: 65000, failure: 3000 },
  { id: "usage-dec15", date: "Dec 15", requests: 70000, success: 67000, failure: 3000 },
  { id: "usage-dec17", date: "Dec 17", requests: 72000, success: 69000, failure: 3000 },
];

const errorDistributionData = [
  { id: "error-client", name: "Client Errors (4xx)", value: 612, color: "#F9A825" },
  { id: "error-server", name: "Server Errors (5xx)", value: 267, color: "#EF4444" },
];

const errorCodesData = [
  { code: "400", label: "Bad Request", count: 28, category: "4XX Client Error" },
  { code: "401", label: "Unauthorized", count: 145, category: "4XX Client Error" },
  { code: "402", label: "Payment Required", count: 3, category: "4XX Client Error" },
  { code: "403", label: "Forbidden", count: 89, category: "4XX Client Error" },
  { code: "404", label: "Not Found", count: 267, category: "4XX Client Error" },
  { code: "405", label: "Method Not Allowed", count: 52, category: "4XX Client Error" },
  { code: "406", label: "Not Acceptable", count: 28, category: "4XX Client Error" },
];

// Service Request Data
const serviceRequestsData = [
  { id: 1, serviceName: "Addresses", type: "MapServer", lastReview: "Nov 30, 2025", requests: "1.66M" },
  { id: 2, serviceName: "Street Centrelines", type: "MapServer", lastReview: "Nov 30, 2025", requests: "1.43M" },
  { id: 3, serviceName: "Wip_Minister Roads", type: "MapServer", lastReview: "Nov 30, 2025", requests: "913.10K" },
  { id: 4, serviceName: "Mtt_Network", type: "MapServer", lastReview: "Nov 30, 2025", requests: "631.97K" },
  { id: 5, serviceName: "District_Cooling", type: "MapServer", lastReview: "Nov 30, 2025", requests: "567.13K" },
  { id: 6, serviceName: "EWC_Wdd", type: "MapServer", lastReview: "Nov 30, 2025", requests: "445.20K" },
  { id: 7, serviceName: "Water Distribution Dataset", type: "MapServer", lastReview: "Nov 30, 2025", requests: "389.75K" },
];

// Top Used Services Data
const topUsedServicesData = [
  { id: "usage-jan", month: "Jan", Average: 7200000, BaseMapAraLightGrayWM: 8500000, IMGSat50cmWM: 5500000 },
  { id: "usage-feb", month: "Feb", Average: 7400000, BaseMapAraLightGrayWM: 8800000, IMGSat50cmWM: 5700000 },
  { id: "usage-mar", month: "Mar", Average: 7600000, BaseMapAraLightGrayWM: 9000000, IMGSat50cmWM: 5900000 },
  { id: "usage-apr", month: "Apr", Average: 7800000, BaseMapAraLightGrayWM: 9300000, IMGSat50cmWM: 6100000 },
  { id: "usage-may", month: "May", Average: 7900000, BaseMapAraLightGrayWM: 9500000, IMGSat50cmWM: 6200000 },
  { id: "usage-jun", month: "Jun", Average: 8100000, BaseMapAraLightGrayWM: 9800000, IMGSat50cmWM: 6400000 },
  { id: "usage-jul", month: "Jul", Average: 8200000, BaseMapAraLightGrayWM: 10100000, IMGSat50cmWM: 6500000 },
  { id: "usage-aug", month: "Aug", Average: 8000000, BaseMapAraLightGrayWM: 9900000, IMGSat50cmWM: 6300000 },
  { id: "usage-sep", month: "Sep", Average: 8000000, BaseMapAraLightGrayWM: 10000000, IMGSat50cmWM: 6000000 },
  { id: "usage-oct", month: "Oct", Average: 7500000, BaseMapAraLightGrayWM: 8000000, IMGSat50cmWM: 4500000 },
  { id: "usage-nov", month: "Nov", Average: 5000000, BaseMapAraLightGrayWM: 5000000, IMGSat50cmWM: 3000000 },
  { id: "usage-dec", month: "Dec", Average: 4800000, BaseMapAraLightGrayWM: 4700000, IMGSat50cmWM: 2900000 },
];

const requestsByServiceTypeData = [
  { id: 'req-type-jan', month: 'Jan', MapServer: 95, FeatureServer: 165, GeocodeServer: 125, GPServer: 145 },
  { id: 'req-type-feb', month: 'Feb', MapServer: 102, FeatureServer: 175, GeocodeServer: 132, GPServer: 155 },
  { id: 'req-type-mar', month: 'Mar', MapServer: 110, FeatureServer: 185, GeocodeServer: 140, GPServer: 165 },
  { id: 'req-type-apr', month: 'Apr', MapServer: 118, FeatureServer: 195, GeocodeServer: 148, GPServer: 175 },
  { id: 'req-type-may', month: 'May', MapServer: 125, FeatureServer: 205, GeocodeServer: 155, GPServer: 182 },
  { id: 'req-type-jun', month: 'Jun', MapServer: 135, FeatureServer: 215, GeocodeServer: 165, GPServer: 190 },
  { id: 'req-type-jul', month: 'Jul', MapServer: 145, FeatureServer: 225, GeocodeServer: 172, GPServer: 198 },
  { id: 'req-type-aug', month: 'Aug', MapServer: 155, FeatureServer: 235, GeocodeServer: 178, GPServer: 205 },
  { id: 'req-type-sep', month: 'Sep', MapServer: 120, FeatureServer: 200, GeocodeServer: 150, GPServer: 180 },
  { id: 'req-type-oct', month: 'Oct', MapServer: 160, FeatureServer: 240, GeocodeServer: 180, GPServer: 210 },
  { id: 'req-type-nov', month: 'Nov', MapServer: 140, FeatureServer: 220, GeocodeServer: 160, GPServer: 190 },
  { id: 'req-type-dec', month: 'Dec', MapServer: 130, FeatureServer: 210, GeocodeServer: 155, GPServer: 185 }
];

export default function SuperAdminDashboard() {
  const [createOrgOpen, setCreateOrgOpen] = useState(false);
  const [reviewApprovalsOpen, setReviewApprovalsOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<any>(null);
  const [downloadingKpi, setDownloadingKpi] = useState<string | null>(null);

  // Download KPI data as CSV
  const handleDownloadKPI = (kpiLabel: string, kpiValue: string) => {
    setDownloadingKpi(kpiLabel);
    
    // Simulate async download operation
    setTimeout(() => {
      try {
        // Create CSV content
        const csvContent = `KPI Report - ${kpiLabel}\nGenerated: ${new Date().toLocaleString()}\n\nMetric,Value\n${kpiLabel},${kpiValue}\n\nBSDI Governance Dashboard Summary\nTotal Organizations,142\nRegistered Users,2847\nPending Approvals,28\nData Requests Today,67\nApproved Services,1234\nTotal Services,456\nTotal Users,3521\nTotal Groups,87`;
        
        // Create blob and download
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `${kpiLabel.toLowerCase().replace(/\s+/g, '-')}-report-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up
        URL.revokeObjectURL(url);
        
        // Show success notification
        toast.success(`${kpiLabel} report downloaded successfully!`);
      } catch (error) {
        toast.error('Failed to download report. Please try again.');
      } finally {
        setDownloadingKpi(null);
      }
    }, 800);
  };

  // Handle export functionality
  const handleExportPDF = (chartName: string) => {
    toast.success(`✔ Exporting ${chartName} to PDF...`);
    // Mock PDF export logic
    setTimeout(() => {
      toast.success(`✔ PDF downloaded successfully!`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-4 md:px-10 py-4 md:py-8">
      <div className="max-w-[1800px] mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-1 mb-6 md:mb-10">
          <h1 className="text-xl md:text-[26px] font-bold text-[#EF4444] tracking-tight">
            Governance Dashboard
          </h1>
          <p className="text-[#64748B] text-xs md:text-sm font-medium">BSDI Super Admin • National Data Infrastructure Overview</p>
        </div>

        {/* KPI Cards Grid - 1 col on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {kpiData.map((kpi, index) => {
            const Icon = kpi.icon;
            
            // Smart conditional coloring with 10% tint system
            const getCardStyle = () => {
              // Green - Success/Approved/Positive
              if (kpi.label.includes("Approved")) {
                return { 
                  gradient: "linear-gradient(135deg, rgba(34,197,94,0.10) 0%, rgba(34,197,94,0.06) 100%)",
                  hoverGradient: "linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(34,197,94,0.10) 100%)",
                  iconBg: "linear-gradient(145deg, rgba(34,197,94,0.25), rgba(34,197,94,0.35))",
                  iconInnerBg: "linear-gradient(135deg, rgba(34,197,94,0.30) 0%, rgba(34,197,94,0.50) 100%)",
                  iconColor: "#16A34A",
                  glow: "0 0 20px rgba(34,197,94,0.20)"
                };
              } 
              // Orange - Pending/In Progress
              else if (kpi.label.includes("Pending")) {
                return { 
                  gradient: "linear-gradient(135deg, rgba(245,158,11,0.10) 0%, rgba(245,158,11,0.06) 100%)",
                  hoverGradient: "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.10) 100%)",
                  iconBg: "linear-gradient(145deg, rgba(245,158,11,0.25), rgba(245,158,11,0.35))",
                  iconInnerBg: "linear-gradient(135deg, rgba(245,158,11,0.30) 0%, rgba(245,158,11,0.50) 100%)",
                  iconColor: "#D97706",
                  glow: "0 0 20px rgba(245,158,11,0.20)"
                };
              } 
              // Orange - Warning/Attention (Data Requests Today — same amber as Pending)
              else if (kpi.label.includes("Data Requests") || kpi.label.includes("Today")) {
                return { 
                  gradient: "linear-gradient(135deg, rgba(245,158,11,0.10) 0%, rgba(245,158,11,0.06) 100%)",
                  hoverGradient: "linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(245,158,11,0.10) 100%)",
                  iconBg: "linear-gradient(145deg, rgba(245,158,11,0.25), rgba(245,158,11,0.35))",
                  iconInnerBg: "linear-gradient(135deg, rgba(245,158,11,0.30) 0%, rgba(245,158,11,0.50) 100%)",
                  iconColor: "#D97706",
                  glow: "0 0 20px rgba(245,158,11,0.20)"
                };
              } 
              // Blue - Neutral/Informational (Users, Organizations, Groups, Services)
              else if (
                kpi.label.includes("Users") || 
                kpi.label.includes("Organizations") || 
                kpi.label.includes("Groups") || 
                kpi.label.includes("Services") ||
                kpi.label.includes("Registered")
              ) {
                return { 
                  gradient: "linear-gradient(135deg, rgba(59,130,246,0.09) 0%, rgba(59,130,246,0.05) 100%)",
                  hoverGradient: "linear-gradient(135deg, rgba(59,130,246,0.14) 0%, rgba(59,130,246,0.09) 100%)",
                  iconBg: "linear-gradient(145deg, rgba(59,130,246,0.20), rgba(59,130,246,0.30))",
                  iconInnerBg: "linear-gradient(135deg, rgba(59,130,246,0.25) 0%, rgba(59,130,246,0.45) 100%)",
                  iconColor: "#2563EB",
                  glow: "0 0 20px rgba(59,130,246,0.18)"
                };
              } 
              // White/Neutral - Default
              else {
                return { 
                  gradient: "linear-gradient(135deg, rgba(107,114,128,0.08) 0%, rgba(107,114,128,0.04) 100%)",
                  hoverGradient: "linear-gradient(135deg, rgba(107,114,128,0.12) 0%, rgba(107,114,128,0.08) 100%)",
                  iconBg: "linear-gradient(145deg, rgba(107,114,128,0.20), rgba(107,114,128,0.30))",
                  iconInnerBg: "linear-gradient(135deg, rgba(107,114,128,0.25) 0%, rgba(107,114,128,0.45) 100%)",
                  iconColor: "#6B7280",
                  glow: "0 0 20px rgba(107,114,128,0.15)"
                };
              }
            };
            
            const cardStyle = getCardStyle();
            
            return (
              <Card 
                key={index} 
                className="relative p-4 sm:p-6 border-0 rounded-[24px] transition-all duration-300 hover:translate-y-[-4px] overflow-hidden group"
                style={{
                  background: cardStyle.iconBg.replace('0.1', '0.05'), // Use a tint of the color
                  backdropFilter: 'blur(24px)',
                }}
              >
                <div className="flex flex-col gap-2 sm:gap-4 relative z-10">
                  <div className="text-[10px] sm:text-sm text-[#64748B] font-bold uppercase tracking-wider opacity-80">
                    {kpi.label}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-[22px] sm:text-[32px] leading-tight font-extrabold text-[#1e293b] tracking-tight">
                      {kpi.value}
                    </div>

                    <div 
                      className="w-10 sm:w-14 h-10 sm:h-14 flex items-center justify-center rounded-full transition-all duration-300 group-hover:scale-110 shadow-lg"
                      style={{
                        background: cardStyle.iconBg,
                        boxShadow: `0 4px 12px ${cardStyle.iconBg}`,
                      }}
                    >
                      <Icon 
                        className="w-5 sm:w-7 h-5 sm:h-7" 
                        style={{ 
                          color: cardStyle.iconColor, 
                          strokeWidth: 2.5,
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Subtle glow effect */}
                <div 
                  className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-3xl opacity-20 pointer-events-none"
                  style={{ background: cardStyle.iconColor }}
                />
              </Card>
            );
          })}
        </div>

        {/* National Data Access Trends - Full Width */}
        <Card className="p-5 md:p-8 bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-10">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 md:w-14 h-10 md:h-14 rounded-2xl bg-[#EF4444]/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 md:w-7 h-5 md:h-7 text-[#EF4444]" />
              </div>
              <div>
                <h3 className="text-lg md:text-2xl font-bold text-[#1e293b]">National Data Access Trends</h3>
                <p className="text-xs md:text-sm text-[#64748B] font-medium">Yearly request analytics (Jan-Dec)</p>
              </div>
            </div>
          </div>
          
          <div className="w-full h-[300px] md:h-[320px] lg:h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              id="national-access-trends-chart"
              data={nationalAccessData} 
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <filter id="nationalAccessShadow">
                  <feDropShadow key="natl-shadow" dx="0" dy="4" stdDeviation="4" floodOpacity="0.15"/>
                </filter>
              </defs>
              <CartesianGrid key="grid-national" strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
              <XAxis 
                key="xaxis-national"
                dataKey="month" 
                stroke="#9ca3af" 
                fontSize={13}
                fontWeight={500}
                axisLine={false}
                tickLine={false}
                dy={10}
              />
              <YAxis 
                key="yaxis-national"
                stroke="#9ca3af" 
                fontSize={13}
                fontWeight={500}
                axisLine={false}
                tickLine={false}
                dx={-10}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend 
                key="legend-national"
                wrapperStyle={{ 
                  paddingTop: '20px',
                  fontSize: '13px',
                  fontWeight: 500
                }} 
              />
              {/* Approved line - solid medium red */}
              <Line 
                key="line-approved"
                type="monotone" 
                dataKey="approved" 
                stroke="#FF6B6B" 
                strokeWidth={3} 
                name="Approved" 
                dot={{ fill: '#FF6B6B', strokeWidth: 2, r: 5, stroke: '#fff' }}
                activeDot={{ r: 7, stroke: '#FF6B6B', strokeWidth: 2, fill: '#fff' }}
                isAnimationActive={false}
              />
              {/* Pending line - dashed light pink */}
              <Line 
                key="line-pending"
                type="monotone" 
                dataKey="pending" 
                stroke="#FCA5A5" 
                strokeWidth={2} 
                strokeDasharray="8 6" 
                name="Pending" 
                dot={{ fill: '#FCA5A5', strokeWidth: 2, r: 4, stroke: '#fff' }}
                activeDot={{ r: 6, stroke: '#FCA5A5', strokeWidth: 2, fill: '#fff' }}
                isAnimationActive={false}
              />
              {/* Total Requests line - bold dark red, on top */}
              <Line 
                key="line-requests"
                type="monotone" 
                dataKey="requests" 
                stroke="#EF4444" 
                strokeWidth={4} 
                name="Total Requests" 
                dot={{ fill: '#EF4444', strokeWidth: 2, r: 6, stroke: '#fff' }}
                activeDot={{ r: 8, stroke: '#EF4444', strokeWidth: 2, fill: '#fff' }}
                filter="url(#nationalAccessShadow)"
                isAnimationActive={false}
              />
            </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top 7 services and Organization Types - 1 Column on Mobile/Tablet, 2 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 7 most used services */}
          <Card className="p-5 md:p-8 bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-10 relative">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 md:w-14 h-10 md:h-14 rounded-2xl bg-[#EF4444]/10 flex items-center justify-center shrink-0">
                  <Server className="w-5 md:w-7 h-5 md:h-7 text-[#EF4444]" />
                </div>
                <div>
                  <h3 className="text-lg md:text-2xl font-bold text-[#1e293b]">Top 7 most used <br className="md:hidden" /> services</h3>
                </div>
              </div>
              <div className="absolute top-0 right-0 md:relative md:top-auto md:right-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-10 px-4 rounded-xl hover:bg-gray-100"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-48 bg-white border border-[#E0E0E0] rounded-xl shadow-lg"
                  >
                    <DropdownMenuLabel className="text-xs font-bold text-[#EF4444] uppercase tracking-wider px-3 py-2">
                      Export Options
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#E5E5E5]" />
                    <DropdownMenuItem 
                      onClick={() => handleExportPDF("Top 7 Services")}
                      className="cursor-pointer hover:bg-red-50/50 rounded-lg mx-1 my-0.5 px-3 py-2"
                    >
                      <FileText className="w-4 h-4 mr-2 text-[#EF4444]" />
                      <span className="text-sm">Download PDF</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            <div 
              className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#D1D5DB #F3F4F6'
              } as React.CSSProperties & { 
                '--scrollbar-width'?: string;
                scrollbarWidth?: string;
                scrollbarColor?: string;
              }}
            >
              {serviceRequestsData.map((service) => {
                // Map each service to a unique icon based on service name
                const getServiceIcon = (serviceName: string) => {
                  if (serviceName.includes("Addresses")) return MapPin;
                  if (serviceName.includes("Street") || serviceName.includes("Centrelines")) return Route;
                  if (serviceName.includes("Roads") || serviceName.includes("Minister")) return Construction;
                  if (serviceName.includes("Network") || serviceName.includes("Mtt")) return Network;
                  if (serviceName.includes("Cooling") || serviceName.includes("District")) return Wind;
                  if (serviceName.includes("EWC") || serviceName.includes("Wdd")) return Waves;
                  if (serviceName.includes("Water") || serviceName.includes("Distribution")) return Droplets;
                  return Database; // Default fallback
                };
                
                const ServiceIcon = getServiceIcon(service.serviceName);
                
                return (
                  <div 
                    key={service.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:shadow-[4px_4px_12px_rgba(163,177,198,0.2),-2px_-2px_8px_rgba(255,255,255,0.8)] transition-all duration-300 hover:translate-x-1 sm:hover:translate-x-2 gap-3"
                  >
                    <div className="flex items-center gap-3 md:gap-4 flex-1">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-[#EF4444]/10 to-[#FF6B6B]/10 flex items-center justify-center shrink-0">
                        <ServiceIcon className="w-4 h-4 md:w-5 md:h-5 text-[#EF4444]" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-[#1a1a1a] text-sm md:text-base truncate">{service.serviceName}</div>
                        <div className="text-[11px] md:text-sm text-[#666666]">{service.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-4 md:gap-6 border-t sm:border-t-0 pt-2 sm:pt-0">
                      <div className="text-[11px] md:text-sm text-[#666666]">{service.lastReview}</div>
                      <div className="text-lg md:text-xl font-bold text-[#EF4444]">{service.requests}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Organization Types Pie Chart */}
          <Card className="p-5 md:p-8 bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex items-center gap-3 md:gap-4 mb-8 md:mb-10">
              <div className="w-10 md:w-14 h-10 md:h-14 rounded-2xl bg-[#EF4444]/10 flex items-center justify-center shrink-0">
                <Building2 className="w-5 md:w-7 h-5 md:h-7 text-[#EF4444]" />
              </div>
              <div>
                <h3 className="text-lg md:text-2xl font-bold text-[#1e293b]">Organization Types</h3>
                <p className="text-xs md:text-sm text-[#64748B] font-medium">Distribution overview</p>
              </div>
            </div>
            <div className="w-full h-[300px] md:h-[320px] lg:h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <filter id="pieShadow">
                    <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.2"/>
                  </filter>
                </defs>
                <Pie
                  data={orgParticipationData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={false}
                  outerRadius={110}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  isAnimationActive={false}
                  filter="url(#pieShadow)"
                  stroke="#fff"
                  strokeWidth={3}
                >
                  {orgParticipationData.map((entry) => (
                    <Cell 
                      key={entry.id} 
                      fill={entry.color}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomChartTooltip />} />
                <Legend 
                  key="legend-pie"
                  wrapperStyle={{ 
                    paddingTop: '10px',
                    fontSize: '13px',
                    fontWeight: 500
                  }}
                  iconType="circle"
              />
            </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

        {/* Usage & Analytics Section - 1 Column on Mobile/Tablet, 2 Columns on Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Services Usage Trend */}
          <Card className="p-5 md:p-8 bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-10 relative">
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 md:w-14 h-10 md:h-14 rounded-2xl bg-[#EF4444]/10 flex items-center justify-center shrink-0">
                  <Activity className="w-5 md:w-7 h-5 md:h-7 text-[#EF4444]" />
                </div>
                <div>
                  <h3 className="text-lg md:text-2xl font-bold text-[#1e293b]">Services Usage Trend</h3>
                  <p className="text-xs md:text-sm text-[#64748B] font-medium">1-year comparison (Jan-Dec)</p>
                </div>
              </div>
              <div className="absolute top-0 right-0 md:relative md:top-auto md:right-auto">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-10 px-4 rounded-xl hover:bg-gray-100"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-48 bg-white border border-[#E0E0E0] rounded-xl shadow-lg"
                  >
                    <DropdownMenuLabel className="text-xs font-bold text-[#EF4444] uppercase tracking-wider px-3 py-2">
                      Export Options
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-[#E5E5E5]" />
                    <DropdownMenuItem 
                      onClick={() => handleExportPDF("Services Usage Trend")}
                      className="cursor-pointer hover:bg-red-50/50 rounded-lg mx-1 my-0.5 px-3 py-2"
                    >
                      <FileText className="w-4 h-4 mr-2 text-[#EF4444]" />
                      <span className="text-sm">Download PDF</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          
          <div className="w-full h-[280px] md:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={topUsedServicesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="servicesUsageColorAverage" x1="0" y1="0" x2="0" y2="1">
                      <stop key="avg-start" offset="5%" stopColor="#EF4444" stopOpacity={0.3}/>
                      <stop key="avg-end" offset="95%" stopColor="#EF4444" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="servicesUsageColorBaseMap" x1="0" y1="0" x2="0" y2="1">
                      <stop key="base-start" offset="5%" stopColor="#FF6B6B" stopOpacity={0.3}/>
                      <stop key="base-end" offset="95%" stopColor="#FF6B6B" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="servicesUsageColorImg" x1="0" y1="0" x2="0" y2="1">
                      <stop key="img-start" offset="5%" stopColor="#FF8787" stopOpacity={0.3}/>
                      <stop key="img-end" offset="95%" stopColor="#FF8787" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid key="grid-area" strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                  <XAxis 
                    key="x-axis-area"
                    dataKey="month" 
                    stroke="#9ca3af" 
                    fontSize={11}
                    fontWeight={500}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    key="y-axis-area"
                    stroke="#9ca3af" 
                    fontSize={11}
                    fontWeight={500}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => {
                      if (value >= 1000000) return `${value / 1000000}M`;
                      if (value >= 1000) return `${value / 1000}k`;
                      return value;
                    }}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend key="legend-area" wrapperStyle={{ fontSize: '11px', fontWeight: 500 }} />
                  <Area 
                    key="area-average"
                    type="monotone" 
                    dataKey="Average" 
                    stroke="#EF4444" 
                    strokeWidth={3}
                    fill="url(#servicesUsageColorAverage)"
                    name="Average"
                    isAnimationActive={false}
                  />
                  <Area 
                    key="area-basemap"
                    type="monotone" 
                    dataKey="BaseMapAraLightGrayWM" 
                    stroke="#FF6B6B" 
                    strokeWidth={3}
                    fill="url(#servicesUsageColorBaseMap)"
                    name="BaseMap"
                    isAnimationActive={false}
                  />
                  <Area 
                    key="area-imgsat"
                    type="monotone" 
                    dataKey="IMGSat50cmWM" 
                    stroke="#FF8787" 
                    strokeWidth={3}
                    fill="url(#servicesUsageColorImg)"
                    name="IMG SAT"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* API Analytics placeholder removed for layout balance */}

        {/* Requests by Service Type */}
        <Card className="p-5 md:p-8 bg-white/90 backdrop-blur-xl border border-white/40 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-10 relative">
            <div className="flex items-center gap-3 md:gap-4">
              <div className="w-10 md:w-14 h-10 md:h-14 rounded-2xl bg-[#EF4444]/10 flex items-center justify-center shrink-0">
                <LayoutGrid className="w-5 md:w-7 h-5 md:h-7 text-[#EF4444]" />
              </div>
              <div>
                <h3 className="text-lg md:text-2xl font-bold text-[#1e293b]">Requests by <br className="md:hidden" /> Service Type</h3>
                <p className="text-xs md:text-sm text-[#64748B] font-medium">Map, Feature, Geocode, GP servers</p>
              </div>
            </div>
            <div className="absolute top-0 right-0 md:relative md:top-auto md:right-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-10 px-4 rounded-xl hover:bg-gray-100"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-48 bg-white border border-[#E0E0E0] rounded-xl shadow-lg"
                >
                  <DropdownMenuLabel className="text-xs font-bold text-[#EF4444] uppercase tracking-wider px-3 py-2">
                    Export Options
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-[#E5E5E5]" />
                  <DropdownMenuItem 
                    onClick={() => handleExportPDF("Requests by Service Type")}
                    className="cursor-pointer hover:bg-red-50/50 rounded-lg mx-1 my-0.5 px-3 py-2"
                  >
                    <FileText className="w-4 h-4 mr-2 text-[#EF4444]" />
                    <span className="text-sm">Download PDF</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          
          <div className="w-full h-[280px] md:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={requestsByServiceTypeData} 
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                  <defs>
                    <filter id="barShadowReqType">
                      <feDropShadow key="bar-shadow" dx="0" dy="4" stdDeviation="4" floodOpacity="0.15"/>
                    </filter>
                    <linearGradient id="mapGradReqType" x1="0" y1="0" x2="0" y2="1">
                      <stop key="map-start" offset="5%" stopColor="#EF4444" stopOpacity={0.9}/>
                      <stop key="map-end" offset="95%" stopColor="#EF4444" stopOpacity={0.7}/>
                    </linearGradient>
                    <linearGradient id="featureGradReqType" x1="0" y1="0" x2="0" y2="1">
                      <stop key="feature-start" offset="5%" stopColor="#003F72" stopOpacity={0.9}/>
                      <stop key="feature-end" offset="95%" stopColor="#003F72" stopOpacity={0.7}/>
                    </linearGradient>
                    <linearGradient id="geocodeGradReqType" x1="0" y1="0" x2="0" y2="1">
                      <stop key="geocode-start" offset="5%" stopColor="#6B6B6B" stopOpacity={0.9}/>
                      <stop key="geocode-end" offset="95%" stopColor="#6B6B6B" stopOpacity={0.7}/>
                    </linearGradient>
                    <linearGradient id="gpGradReqType" x1="0" y1="0" x2="0" y2="1">
                      <stop key="gp-start" offset="5%" stopColor="#B7AFA3" stopOpacity={0.9}/>
                      <stop key="gp-end" offset="95%" stopColor="#B7AFA3" stopOpacity={0.7}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid key="grid-line-chart" strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.5} />
                  <XAxis 
                    key="x-axis-line"
                    dataKey="month" 
                    stroke="#9ca3af" 
                    fontSize={13}
                    fontWeight={500}
                    axisLine={false}
                    tickLine={false}
                    dy={10}
                  />
                  <YAxis 
                    key="y-axis-line"
                    stroke="#9ca3af" 
                    fontSize={13}
                    fontWeight={500}
                    axisLine={false}
                    tickLine={false}
                    dx={-10}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Legend 
                    key="legend-line"
                    wrapperStyle={{ 
                      paddingTop: '20px',
                      fontSize: '13px',
                      fontWeight: 500
                    }} 
                  />
                  <Bar 
                    key="bar-mapserver"
                    dataKey="MapServer" 
                    fill="url(#mapGradReqType)" 
                    name="MapServer"
                    radius={[10, 10, 0, 0]}
                    filter="url(#barShadowReqType)"
                    isAnimationActive={false}
                  />
                  <Bar 
                    key="bar-featureserver"
                    dataKey="FeatureServer" 
                    fill="url(#featureGradReqType)" 
                    name="FeatureServer"
                    radius={[10, 10, 0, 0]}
                    filter="url(#barShadowReqType)"
                    isAnimationActive={false}
                  />
                  <Bar 
                    key="bar-geocodeserver"
                    dataKey="GeocodeServer" 
                    fill="url(#geocodeGradReqType)" 
                    name="GeocodeServer"
                    radius={[10, 10, 0, 0]}
                    filter="url(#barShadowReqType)"
                    isAnimationActive={false}
                  />
                  <Bar 
                    key="bar-gpserver"
                    dataKey="GPServer" 
                    fill="url(#gpGradReqType)" 
                    name="GPServer"
                    radius={[10, 10, 0, 0]}
                    filter="url(#barShadowReqType)"
                    isAnimationActive={false}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
      </div>

      {/* Keep existing dialogs unchanged */}
      <Dialog open={createOrgOpen} onOpenChange={setCreateOrgOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl border-0 shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-0">
          {/* ... existing dialog content ... */}
        </DialogContent>
      </Dialog>

      <Dialog open={reviewApprovalsOpen} onOpenChange={setReviewApprovalsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white/95 to-white/85 backdrop-blur-2xl rounded-3xl border border-white/50 shadow-[0_16px_64px_rgba(0,0,0,0.2)]">
          {/* ... existing dialog content ... */}
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
