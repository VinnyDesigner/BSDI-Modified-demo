import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  Users, Shield, FileText, Activity, Plus, UserPlus, Settings
} from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

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
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-[#e8ecf1] to-[#dfe4ea] px-10 py-6">
      <div className="max-w-[1800px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[26px] font-bold text-[#ED1C24]">Department Dashboard</h1>
          <p className="text-[#4A5565] text-[14px] font-normal">Department Reviewer • User & Role Management</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card 
              key={index} 
              className="p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <div className="flex items-center gap-4">
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center shadow-md"
                  style={{ backgroundColor: kpi.color + "15" }}
                >
                  <Icon className="w-7 h-7" style={{ color: kpi.color }} />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#252628]">{kpi.value}</div>
                  <div className="text-sm text-[#666666]">{kpi.label}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Request Volume */}
        <Card className="col-span-2 p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-[#252628] mb-6">Department Request Volume</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={departmentRequestsData} id="dept-line-chart">
              <CartesianGrid strokeDasharray="3 3" stroke="#EBECE8" />
              <XAxis dataKey="month" stroke="#666666" />
              <YAxis stroke="#666666" />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #B0AAA2', borderRadius: '12px' }} />
              <Legend />
              <Line key="requests-line" type="monotone" dataKey="requests" stroke="#ED1C24" strokeWidth={3} name="Total Requests" />
              <Line key="approved-line" type="monotone" dataKey="approved" stroke="#003F72" strokeWidth={3} name="Approved" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Role Assignments */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-[#252628] mb-6">Role Assignments</h3>
          <ResponsiveContainer width="100%" height={280}>
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
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {roleAssignmentsData.map((role, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: role.color }}></div>
                  <span className="text-[#666666]">{role.name}</span>
                </div>
                <span className="font-semibold text-[#252628]">{role.value}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* User Activity */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-[#252628] mb-6">User Activity This Week</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={userActivityData} id="dept-bar-chart">
            <CartesianGrid strokeDasharray="3 3" stroke="#EBECE8" />
            <XAxis dataKey="day" stroke="#666666" />
            <YAxis stroke="#666666" />
            <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #B0AAA2', borderRadius: '12px' }} />
            <Legend />
            <Bar key="logins-bar" dataKey="logins" fill="#ED1C24" name="Logins" radius={[8, 8, 0, 0]} />
            <Bar key="actions-bar" dataKey="actions" fill="##003F72" name="Actions" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      </div>
    </div>
  );
}