import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  Users, Shield, FileText, Activity, Plus, UserPlus, Settings
} from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import CustomChartTooltip from "../../components/ui/CustomChartTooltip";
const kpiCards = [
  { label: "Users in Department", value: "45", icon: Users, color: "#252628" },
  { label: "Active GIS Services", value: "28", icon: Activity, color: "#666666" },
];

const departmentRequestsData = [
  { month: "Jan", requests: 12, approved: 10 },
  { month: "Feb", requests: 15, approved: 13 },
  { month: "Mar", requests: 18, approved: 16 },
  { month: "Apr", requests: 14, approved: 12 },
  { month: "May", requests: 20, approved: 18 },
  { month: "Jun", requests: 22, approved: 20 },
];

const roleAssignmentsData = [
  { name: "GIS Analyst", value: 15, color: "#ED1C24" },
  { name: "Data Reviewer", value: 12, color: "#003F72" },
  { name: "Department Admin", value: 8, color: "#666666" },
  { name: "Read-Only", value: 10, color: "#B0AAA2" },
];

const userActivityData = [
  { day: "Mon", logins: 38, actions: 142 },
  { day: "Tue", logins: 42, actions: 156 },
  { day: "Wed", logins: 35, actions: 128 },
  { day: "Thu", logins: 45, actions: 167 },
  { day: "Fri", logins: 40, actions: 145 },
  { day: "Sat", logins: 15, actions: 52 },
];

const pendingRequests = [
  { id: 1, user: "Ahmed Al-Khalifa", request: "Access to Utilities Layer", date: "2024-03-04", status: "pending" },
  { id: 2, user: "Sara Mohammed", request: "Custom Role: Building Inspector", date: "2024-03-03", status: "review" },
  { id: 3, user: "Khalid Ali", request: "Data Download: Land Parcels", date: "2024-03-02", status: "pending" },
  { id: 4, user: "Fatima Hassan", request: "Role Assignment: GIS Analyst", date: "2024-03-01", status: "review" },
];

const customRoles = [
  { name: "Building Inspector", permissions: "Buildings, Permits", users: 8, created: "2024-02-15" },
  { name: "Infrastructure Manager", permissions: "Roads, Utilities", users: 12, created: "2024-02-10" },
  { name: "Environmental Analyst", permissions: "Environmental Zones", users: 6, created: "2024-02-05" },
  { name: "Urban Planner", permissions: "Zoning, Land Use", users: 15, created: "2024-01-28" },
];

export default function DepartmentDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-[#e8ecf1] to-[#dfe4ea] px-4 md:px-10 py-4 md:py-6">
      <div className="max-w-[1800px] mx-auto space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-xl md:text-[26px] font-bold text-[#ED1C24]">Department Dashboard</h1>
          <p className="text-[#4A5565] text-xs md:text-[14px] font-normal">Department Reviewer • User & Role Management</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
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
                <div className="text-[22px] sm:text-[32px] font-extrabold text-[#252628] leading-tight">{kpi.value}</div>
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Department Request Volume */}
        <Card className="lg:col-span-2 p-5 md:p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
          <h3 className="text-base md:text-lg font-semibold text-[#252628] mb-4 md:mb-6">Department Request Volume</h3>
          <div className="h-[280px] md:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={departmentRequestsData} id="dept-line-chart">
                <CartesianGrid strokeDasharray="3 3" stroke="#EBECE8" />
                <XAxis dataKey="month" stroke="#666666" fontSize={12} />
                <YAxis stroke="#666666" fontSize={12} />
                <Tooltip content={<CustomChartTooltip />} />
                <Legend />
                <Line key="requests-line" type="monotone" dataKey="requests" stroke="#ED1C24" strokeWidth={3} name="Total Requests" />
                <Line key="approved-line" type="monotone" dataKey="approved" stroke="#003F72" strokeWidth={3} name="Approved" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Role Assignments */}
        <Card className="p-5 md:p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
          <h3 className="text-base md:text-lg font-semibold text-[#252628] mb-4 md:mb-6">Role Assignments</h3>
          <div className="h-[250px] md:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart id="dept-pie-chart">
                <Pie
                  data={roleAssignmentsData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${value}`}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {roleAssignmentsData.map((entry, index) => (
                    <Cell key={`role-cell-${entry.name}-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {roleAssignmentsData.map((role, index) => (
              <div key={index} className="flex items-center justify-between text-xs md:text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: role.color }}></div>
                  <span className="text-[#666666]">{role.name}</span>
                </div>
                <span className="font-semibold text-[#252628]">{role.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* User Activity */}
      <Card className="p-5 md:p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
        <h3 className="text-base md:text-lg font-semibold text-[#252628] mb-4 md:mb-6">User Activity This Week</h3>
        <div className="h-[280px] md:h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={userActivityData} id="dept-bar-chart">
              <CartesianGrid strokeDasharray="3 3" stroke="#EBECE8" />
              <XAxis dataKey="day" stroke="#666666" fontSize={12} />
              <YAxis stroke="#666666" fontSize={12} />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend />
              <Bar key="logins-bar" dataKey="logins" fill="#ED1C24" name="Logins" radius={[8, 8, 0, 0]} />
              <Bar key="actions-bar" dataKey="actions" fill="#003F72" name="Actions" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      </div>
    </div>
  );
}