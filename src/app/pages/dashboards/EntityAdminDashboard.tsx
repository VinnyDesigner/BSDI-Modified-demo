import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  Building2, Users, FileText, Plus, Edit, UserCog, TrendingUp
} from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import CustomChartTooltip from "../../components/ui/CustomChartTooltip";
const kpiCards = [
  { label: "Organization Structure", value: "8", subtitle: "Departments", icon: Building2, color: "#ED1C24" },
  { label: "Active Users", value: "142", subtitle: "+12 this month", icon: Users, color: "#003F72" },
  { label: "Organization Requests", value: "45", subtitle: "23 pending", icon: FileText, color: "#252628" },
  { label: "Dataset Access", value: "28", subtitle: "Active services", icon: TrendingUp, color: "#666666" },
];

const departmentActivityData = [
  { name: "Planning", requests: 45, users: 28 },
  { name: "Infrastructure", requests: 38, users: 22 },
  { name: "Environment", requests: 32, users: 18 },
  { name: "Development", requests: 28, users: 15 },
  { name: "Transport", requests: 25, users: 12 },
  { name: "Utilities", requests: 22, users: 10 },
];

const orgRequestsData = [
  { month: "Jan", approved: 25, pending: 8, rejected: 2 },
  { month: "Feb", approved: 32, pending: 10, rejected: 3 },
  { month: "Mar", approved: 38, pending: 12, rejected: 2 },
  { month: "Apr", approved: 35, pending: 9, rejected: 4 },
  { month: "May", approved: 42, pending: 11, rejected: 3 },
  { month: "Jun", approved: 45, pending: 13, rejected: 2 },
];

const datasetAccessData = [
  { name: "Planning", value: 35, color: "#ED1C24" },
  { name: "Infrastructure", value: 28, color: "#003F72" },
  { name: "Environment", value: 22, color: "#666666" },
  { name: "Other", value: 15, color: "#B0AAA2" },
];

const departments = [
  { name: "Urban Planning Department", head: "Ahmed Al-Khalifa", users: 28, status: "active", created: "2023-05-15" },
  { name: "Infrastructure Management", head: "Sara Mohammed", users: 22, status: "active", created: "2023-06-20" },
  { name: "Environmental Services", head: "Khalid Ali", users: 18, status: "active", created: "2023-07-10" },
  { name: "Development Control", head: "Fatima Hassan", users: 15, status: "active", created: "2023-08-05" },
  { name: "Transportation Planning", head: "Mohammed Ahmed", users: 12, status: "active", created: "2023-09-12" },
  { name: "Utilities Coordination", head: "Layla Ibrahim", users: 10, status: "active", created: "2023-10-18" },
];

const recentRequests = [
  { id: 1, department: "Planning", type: "Data Access", user: "Ahmed Al-Khalifa", status: "pending", date: "2024-03-04" },
  { id: 2, department: "Infrastructure", type: "User Creation", user: "Sara Mohammed", status: "approved", date: "2024-03-03" },
  { id: 3, department: "Environment", type: "Role Assignment", user: "Khalid Ali", status: "pending", date: "2024-03-02" },
  { id: 4, department: "Development", type: "Data Download", user: "Fatima Hassan", status: "approved", date: "2024-03-01" },
];

export default function EntityAdminDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-[#e8ecf1] to-[#dfe4ea] px-10 py-6">
      <div className="max-w-[1800px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[26px] font-bold text-[#ED1C24]">Organization Dashboard</h1>
          <p className="text-[#4A5565] text-[14px] font-normal">Entity Admin • Organization & Department Management</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card 
              key={index} 
              className="p-4 sm:p-6 bg-white border border-[#B0AAA2]/10 rounded-[24px] shadow-sm hover:shadow-md transition-all flex flex-col gap-2 sm:gap-4"
              style={{ background: kpi.color + "08" }}
            >
              <div className="text-[10px] sm:text-sm text-[#666666] font-bold uppercase tracking-wider opacity-80">
                {kpi.label}
              </div>
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <div className="text-[22px] sm:text-[32px] font-extrabold text-[#252628] leading-tight">{kpi.value}</div>
                  {kpi.subtitle && <div className="text-[10px] sm:text-xs text-[#B0AAA2] font-medium">{kpi.subtitle}</div>}
                </div>
                <div 
                  className="w-10 sm:w-14 h-10 sm:h-14 rounded-full flex items-center justify-center shadow-lg shrink-0"
                  style={{ backgroundColor: kpi.color + "20", color: kpi.color }}
                >
                  <Icon className="w-5 sm:w-7 h-5 sm:h-7" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Activity */}
        <Card className="col-span-2 p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-[#252628] mb-6">Department Activity Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentActivityData} layout="vertical" id="entity-bar-chart-1">
              <CartesianGrid strokeDasharray="3 3" stroke="#EBECE8" />
              <XAxis type="number" stroke="#666666" />
              <YAxis dataKey="name" type="category" stroke="#666666" width={100} />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend />
              <Bar key="requests-bar" dataKey="requests" fill="#ED1C24" name="Requests" radius={[0, 8, 8, 0]} />
              <Bar key="users-bar" dataKey="users" fill="#003F72" name="Users" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Dataset Access by Department */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-[#252628] mb-6">Dataset Access</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart id="entity-pie-chart">
              <Pie
                data={datasetAccessData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${value}%`}
                outerRadius={90}
                fill="#8884d8"
                dataKey="value"
              >
                {datasetAccessData.map((entry, index) => (
                  <Cell key={`dataset-cell-${entry.name}-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomChartTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {datasetAccessData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[#666666]">{item.name}</span>
                </div>
                <span className="font-semibold text-[#252628]">{item.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Organization Requests Timeline */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-[#252628] mb-6">Organization Requests Timeline</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={orgRequestsData} id="entity-bar-chart-2">
            <CartesianGrid strokeDasharray="3 3" stroke="#EBECE8" />
            <XAxis dataKey="month" stroke="#666666" />
            <YAxis stroke="#666666" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar key="approved-bar" dataKey="approved" fill="#003F72" stackId="a" name="Approved" radius={[0, 0, 0, 0]} />
            <Bar key="pending-bar" dataKey="pending" fill="#ED1C24" stackId="a" name="Pending" radius={[0, 0, 0, 0]} />
            <Bar key="rejected-bar" dataKey="rejected" fill="#666666" stackId="a" name="Rejected" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Departments Overview */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#252628]">Departments Overview</h3>
          <div className="flex gap-2">
            <Button variant="outline" className="rounded-full border-[#B0AAA2]/30">
              <Settings className="w-4 h-4 mr-2" />
              Manage
            </Button>
            <Button className="bg-[#ED1C24] hover:bg-[#d41820] text-white rounded-full">
              <Plus className="w-4 h-4 mr-2" />
              New Department
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departments.map((dept, index) => (
            <div 
              key={index} 
              className="p-4 rounded-xl bg-gradient-to-br from-white to-[#EBECE8]/30 border border-[#B0AAA2]/20 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ED1C24]/10 to-[#003F72]/10 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-[#ED1C24]" />
                  </div>
                  <Badge variant="secondary" className="bg-[#003F72] text-white text-xs">
                    {dept.status}
                  </Badge>
                </div>
              </div>
              <h4 className="font-semibold text-[#252628] mb-2">{dept.name}</h4>
              <div className="space-y-1 text-sm">
                <p className="text-[#666666]">Head: {dept.head}</p>
                <p className="text-[#666666]">Users: {dept.users}</p>
                <p className="text-xs text-[#B0AAA2]">Created: {dept.created}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent Organization Requests */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#252628]">Recent Organization Requests</h3>
          <Button variant="outline" className="rounded-full border-[#B0AAA2]/30">
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {recentRequests.map((request) => (
            <div 
              key={request.id} 
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white to-[#EBECE8]/50 border border-[#B0AAA2]/20 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ED1C24]/10 to-[#003F72]/10 flex items-center justify-center font-semibold text-[#252628]">
                  {request.user.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-[#252628]">{request.type}</span>
                    <Badge variant="outline" className="text-xs border-[#B0AAA2]/30">
                      {request.department}
                    </Badge>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        request.status === 'approved' ? 'bg-[#003F72] text-white' : 'bg-[#ED1C24] text-white'
                      }`}
                    >
                      {request.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#666666]">
                    Submitted by {request.user} • {request.date}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="bg-[#003F72] hover:bg-[#00365d] text-white rounded-full">
                  Approve
                </Button>
                <Button size="sm" variant="outline" className="rounded-full border-[#B0AAA2]/30">
                  Review
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      </div>
    </div>
  );
}