import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  FileText, Download, Clock, CheckCircle, Database, Plus, Search, MapPin
} from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import CustomChartTooltip from "../../components/ui/CustomChartTooltip";
const quickActions = [
  { icon: Plus, label: "Request GIS Data Access", color: "#ED1C24" },
  { icon: Download, label: "Request Data Download", color: "#003F72" },
  { icon: FileText, label: "View My Requests", color: "#252628" },
  { icon: Database, label: "Browse Metadata Catalog", color: "#666666" },
];

const myRequests = [
  { id: "REQ-2024-156", service: "Land Parcels Layer", status: "approved", date: "2024-03-01", reviewer: "Ahmed Al-Khalifa" },
  { id: "REQ-2024-142", service: "Building Footprints", status: "pending", date: "2024-02-28", reviewer: "Sara Mohammed" },
  { id: "REQ-2024-138", service: "Road Network", status: "approved", date: "2024-02-25", reviewer: "Khalid Ali" },
  { id: "REQ-2024-129", service: "Utilities Infrastructure", status: "in_review", date: "2024-02-20", reviewer: "Fatima Hassan" },
];

const requestStatusData = [
  { name: "Approved", value: 45, color: "#003F72" },
  { name: "Pending", value: 12, color: "#ED1C24" },
  { name: "In Review", value: 8, color: "#666666" },
];

const servicesUsageData = [
  { month: "Jan", downloads: 12, views: 45 },
  { month: "Feb", downloads: 18, views: 62 },
  { month: "Mar", downloads: 25, views: 78 },
  { month: "Apr", downloads: 22, views: 71 },
  { month: "May", downloads: 30, views: 89 },
  { month: "Jun", downloads: 35, views: 95 },
];

const availableServices = [
  { name: "Transportation Network", category: "Infrastructure", lastUpdated: "2024-03-01" },
  { name: "Zoning Boundaries", category: "Planning", lastUpdated: "2024-02-28" },
  { name: "Building Permits", category: "Development", lastUpdated: "2024-02-25" },
  { name: "Environmental Zones", category: "Environment", lastUpdated: "2024-02-20" },
];

export default function UserDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-[#e8ecf1] to-[#dfe4ea] px-4 md:px-10 py-4 md:py-6">
      <div className="max-w-[1800px] mx-auto space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl md:text-[26px] font-bold text-[#ED1C24]">My Dashboard</h1>
          <p className="text-[#4A5565] text-xs md:text-[14px] font-normal">Organization User • Data Access & Services</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <Card className="p-4 sm:p-6 bg-[#ED1C24]/05 border border-[#ED1C24]/10 rounded-[24px] shadow-sm hover:shadow-md transition-all flex flex-col gap-2 sm:gap-4">
          <div className="text-[10px] sm:text-sm text-[#666666] font-bold uppercase tracking-wider opacity-80">Total Requests</div>
          <div className="flex items-center justify-between">
            <div className="text-[22px] sm:text-[32px] font-extrabold text-[#252628] leading-tight">65</div>
            <div className="w-10 sm:w-14 h-10 sm:h-14 rounded-full bg-[#ED1C24]/20 flex items-center justify-center shadow-lg shrink-0">
              <FileText className="w-5 sm:w-7 h-5 sm:h-7 text-[#ED1C24]" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-[#003F72]/05 border border-[#003F72]/10 rounded-[24px] shadow-sm hover:shadow-md transition-all flex flex-col gap-2 sm:gap-4">
          <div className="text-[10px] sm:text-sm text-[#666666] font-bold uppercase tracking-wider opacity-80">Approved</div>
          <div className="flex items-center justify-between">
            <div className="text-[22px] sm:text-[32px] font-extrabold text-[#252628] leading-tight">45</div>
            <div className="w-10 sm:w-14 h-10 sm:h-14 rounded-full bg-[#003F72]/20 flex items-center justify-center shadow-lg shrink-0">
              <CheckCircle className="w-5 sm:w-7 h-5 sm:h-7 text-[#003F72]" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-[#ED1C24]/05 border border-[#ED1C24]/10 rounded-[24px] shadow-sm hover:shadow-md transition-all flex flex-col gap-2 sm:gap-4">
          <div className="text-[10px] sm:text-sm text-[#666666] font-bold uppercase tracking-wider opacity-80">Pending</div>
          <div className="flex items-center justify-between">
            <div className="text-[22px] sm:text-[32px] font-extrabold text-[#252628] leading-tight">12</div>
            <div className="w-10 sm:w-14 h-10 sm:h-14 rounded-full bg-[#ED1C24]/20 flex items-center justify-center shadow-lg shrink-0">
              <Clock className="w-5 sm:w-7 h-5 sm:h-7 text-[#ED1C24]" />
            </div>
          </div>
        </Card>

        <Card className="p-4 sm:p-6 bg-[#003F72]/05 border border-[#003F72]/10 rounded-[24px] shadow-sm hover:shadow-md transition-all flex flex-col gap-2 sm:gap-4">
          <div className="text-[10px] sm:text-sm text-[#666666] font-bold uppercase tracking-wider opacity-80">Downloads</div>
          <div className="flex items-center justify-between">
            <div className="text-[22px] sm:text-[32px] font-extrabold text-[#252628] leading-tight">142</div>
            <div className="w-10 sm:w-14 h-10 sm:h-14 rounded-full bg-[#003F72]/20 flex items-center justify-center shadow-lg shrink-0">
              <Download className="w-5 sm:w-7 h-5 sm:h-7 text-[#003F72]" />
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        <Card className="p-5 md:p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
          <h3 className="text-base md:text-lg font-semibold text-[#252628] mb-4 md:mb-6">Request Status</h3>
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart id="user-pie-chart">
                <Pie
                  data={requestStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {requestStatusData.map((entry, index) => (
                    <Cell key={`request-cell-${entry.name}-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-2 p-5 md:p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
          <h3 className="text-base md:text-lg font-semibold text-[#252628] mb-4 md:mb-6">Services Usage Timeline</h3>
          <div className="h-[250px] md:h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={servicesUsageData} id="user-bar-chart">
                <CartesianGrid strokeDasharray="3 3" stroke="#EBECE8" />
                <XAxis dataKey="month" stroke="#666666" fontSize={12} />
                <YAxis stroke="#666666" fontSize={12} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend />
                <Bar key="downloads-bar" dataKey="downloads" fill="#ED1C24" name="Downloads" radius={[8, 8, 0, 0]} />
                <Bar key="views-bar" dataKey="views" fill="#003F72" name="Views" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* My Requests Table */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <h3 className="text-base md:text-lg font-semibold text-[#252628]">My Data Requests</h3>
          <Button variant="outline" className="rounded-full border-[#B0AAA2]/30 w-full md:w-auto">
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {myRequests.map((request) => (
            <div 
              key={request.id} 
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white to-[#EBECE8]/50 border border-[#B0AAA2]/20 hover:shadow-md transition-all gap-4"
            >
              <div className="flex items-center gap-4 flex-1">
                <MapPin className="w-5 h-5 text-[#ED1C24]" />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-[#252628]">{request.service}</span>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        request.status === 'approved' ? 'bg-[#003F72] text-white' :
                        request.status === 'pending' ? 'bg-[#ED1C24] text-white' :
                        'bg-[#B0AAA2] text-white'
                      }`}
                    >
                      {request.status === 'approved' ? 'Approved' : 
                       request.status === 'pending' ? 'Pending' : 'In Review'}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#666666]">
                    {request.id} • Reviewed by {request.reviewer} • {request.date}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="rounded-full border-[#B0AAA2]/30">
                View Details
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Available Services */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#252628]">Available GIS Services</h3>
          <Button variant="outline" className="rounded-full border-[#B0AAA2]/30">
            <Search className="w-4 h-4 mr-2" />
            Browse Catalog
          </Button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {availableServices.map((service, index) => (
            <div 
              key={index} 
              className="p-4 rounded-xl bg-gradient-to-br from-white to-[#EBECE8]/30 border border-[#B0AAA2]/20 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ED1C24]/10 to-[#003F72]/10 flex items-center justify-center flex-shrink-0">
                  <Database className="w-5 h-5 text-[#ED1C24]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-[#252628] mb-1 truncate">{service.name}</h4>
                  <Badge variant="outline" className="text-xs border-[#B0AAA2]/30">{service.category}</Badge>
                </div>
              </div>
              <p className="text-xs text-[#666666]">Updated {service.lastUpdated}</p>
            </div>
          ))}
        </div>
      </Card>
      </div>
    </div>
  );
}