import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { 
  Shield, Activity, AlertTriangle, FileCheck, Eye, Users, Database, TrendingUp
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

import CustomChartTooltip from "../../components/ui/CustomChartTooltip";

const kpiCards = [
  { label: "Security Alerts", value: "3", change: "-2", icon: AlertTriangle, color: "#ED1C24" },
  { label: "Platform Activity", value: "2.8K", change: "+342", icon: Activity, color: "#003F72" },
  { label: "User Behavior Events", value: "12.5K", change: "+1.2K", icon: Users, color: "#252628" },
  { label: "Audit Logs Today", value: "486", change: "+56", icon: FileCheck, color: "#666666" },
];

const systemActivityData = [
  { time: "00:00", logins: 45, requests: 120, alerts: 2 },
  { time: "04:00", logins: 28, requests: 85, alerts: 1 },
  { time: "08:00", logins: 156, requests: 420, alerts: 0 },
  { time: "12:00", logins: 245, requests: 680, alerts: 1 },
  { time: "16:00", logins: 198, requests: 520, alerts: 0 },
  { time: "20:00", logins: 87, requests: 240, alerts: 2 },
];

const securityEventsData = [
  { day: "Mon", events: 12, resolved: 10 },
  { day: "Tue", events: 8, resolved: 8 },
  { day: "Wed", events: 15, resolved: 13 },
  { day: "Thu", events: 6, resolved: 6 },
  { day: "Fri", events: 10, resolved: 9 },
  { day: "Sat", events: 4, resolved: 4 },
  { day: "Sun", events: 3, resolved: 3 },
];

const accessRequestsData = [
  { category: "Data Access", approved: 145, pending: 23, denied: 8 },
  { category: "User Creation", approved: 89, pending: 12, denied: 5 },
  { category: "Role Assignment", approved: 67, pending: 8, denied: 3 },
  { category: "Department", approved: 34, pending: 6, denied: 2 },
];

const recentAuditLogs = [
  { id: 1, action: "User Login", user: "superadmin_bsdi", ip: "192.168.1.100", status: "success", time: "2024-03-04 14:32:18" },
  { id: 2, action: "Data Access Approved", user: "entity_admin", ip: "192.168.1.105", status: "success", time: "2024-03-04 14:28:45" },
  { id: 3, action: "Failed Login Attempt", user: "unknown", ip: "203.45.67.89", status: "failed", time: "2024-03-04 14:15:22" },
  { id: 4, action: "Department Created", user: "entity_admin", ip: "192.168.1.105", status: "success", time: "2024-03-04 13:47:11" },
  { id: 5, action: "Role Assignment", user: "department_user", ip: "192.168.1.112", status: "success", time: "2024-03-04 13:22:34" },
  { id: 6, action: "Metadata Updated", user: "superadmin_bsdi", ip: "192.168.1.100", status: "success", time: "2024-03-04 12:58:09" },
];

const securityAlerts = [
  { id: 1, type: "Multiple Failed Logins", severity: "high", source: "203.45.67.89", time: "2 hours ago", status: "investigating" },
  { id: 2, type: "Unusual Access Pattern", severity: "medium", source: "portal_user", time: "5 hours ago", status: "resolved" },
  { id: 3, type: "API Rate Limit Exceeded", severity: "low", source: "192.168.1.150", time: "8 hours ago", status: "resolved" },
];

const userBehaviorMetrics = [
  { metric: "Average Session Duration", value: "24 min", trend: "up" },
  { metric: "Peak Concurrent Users", value: "245", trend: "up" },
  { metric: "Failed Authentication Rate", value: "0.8%", trend: "down" },
  { metric: "API Response Time (avg)", value: "145ms", trend: "stable" },
];

export default function MonitoringDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-[#e8ecf1] to-[#dfe4ea] px-10 py-6">
      <div className="max-w-[1800px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <h1 className="text-[26px] font-bold text-[#ED1C24]">Monitoring Dashboard</h1>
          <p className="text-[#4A5565] text-[14px] font-normal">BSDI Internal Department • Read-Only Oversight</p>
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
              <div className="flex items-start justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md"
                  style={{ backgroundColor: kpi.color + "15" }}
                >
                  <Icon className="w-6 h-6" style={{ color: kpi.color }} />
                </div>
                <Badge 
                  variant="secondary" 
                  className={`text-xs ${
                    kpi.change.startsWith('+') 
                      ? 'bg-green-100 text-green-700' 
                      : kpi.change.startsWith('-') 
                      ? 'bg-red-100 text-red-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {kpi.change}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-[#252628] mb-1">{kpi.value}</div>
              <div className="text-sm text-[#666666]">{kpi.label}</div>
            </Card>
          );
        })}
      </div>

      {/* System Activity Timeline */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-[#252628] mb-6 flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#ED1C24]" />
          System Activity Timeline (24 Hours)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={systemActivityData} id="monitor-line-chart">
            <CartesianGrid strokeDasharray="3 3" stroke="#EBECE8" />
            <XAxis dataKey="time" stroke="#666666" />
            <YAxis stroke="#666666" />
            <Tooltip content={<CustomChartTooltip />} />
            <Legend />
            <Line key="logins-line" type="monotone" dataKey="logins" stroke="#003F72" strokeWidth={3} name="User Logins" />
            <Line key="requests-line" type="monotone" dataKey="requests" stroke="#ED1C24" strokeWidth={3} name="API Requests" />
            <Line key="alerts-line" type="monotone" dataKey="alerts" stroke="#666666" strokeWidth={2} strokeDasharray="5 5" name="Security Alerts" />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Events */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-[#252628] mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#003F72]" />
            Security Events (This Week)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={securityEventsData} id="monitor-bar-chart-1">
              <CartesianGrid strokeDasharray="3 3" stroke="#EBECE8" />
              <XAxis dataKey="day" stroke="#666666" />
              <YAxis stroke="#666666" />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend />
              <Bar key="events-bar" dataKey="events" fill="#ED1C24" name="Events" radius={[8, 8, 0, 0]} />
              <Bar key="resolved-bar" dataKey="resolved" fill="#003F72" name="Resolved" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Access Requests Monitoring */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
          <h3 className="text-lg font-semibold text-[#252628] mb-6 flex items-center gap-2">
            <Database className="w-5 h-5 text-[#ED1C24]" />
            Access Requests Monitoring
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={accessRequestsData} layout="vertical" id="monitor-bar-chart-2">
              <CartesianGrid strokeDasharray="3 3" stroke="#EBECE8" />
              <XAxis type="number" stroke="#666666" />
              <YAxis dataKey="category" type="category" stroke="#666666" width={100} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar key="approved-bar" dataKey="approved" fill="#003F72" name="Approved" stackId="a" />
              <Bar key="pending-bar" dataKey="pending" fill="#ED1C24" name="Pending" stackId="a" />
              <Bar key="denied-bar" dataKey="denied" fill="#666666" name="Denied" stackId="a" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* User Behavior Analytics */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
        <h3 className="text-lg font-semibold text-[#252628] mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#003F72]" />
          User Behavior Analytics
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {userBehaviorMetrics.map((metric, index) => (
            <div 
              key={index} 
              className="p-4 rounded-xl bg-gradient-to-br from-white to-[#EBECE8]/30 border border-[#B0AAA2]/20"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm text-[#666666]">{metric.metric}</span>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    metric.trend === 'up' ? 'border-green-500 text-green-700' :
                    metric.trend === 'down' ? 'border-red-500 text-red-700' :
                    'border-blue-500 text-blue-700'
                  }`}
                >
                  {metric.trend}
                </Badge>
              </div>
              <div className="text-2xl font-bold text-[#252628]">{metric.value}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Security Alerts */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#252628] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#ED1C24]" />
            Security Alerts
          </h3>
          <Button variant="outline" className="rounded-full border-[#B0AAA2]/30">
            View All
          </Button>
        </div>
        <div className="space-y-3">
          {securityAlerts.map((alert) => (
            <div 
              key={alert.id} 
              className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white to-[#EBECE8]/50 border border-[#B0AAA2]/20 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className={`w-2 h-2 rounded-full ${
                  alert.severity === 'high' ? 'bg-[#ED1C24]' : 
                  alert.severity === 'medium' ? 'bg-[#003F72]' : 'bg-[#B0AAA2]'
                }`}></div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-[#252628]">{alert.type}</span>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        alert.severity === 'high' ? 'bg-[#ED1C24] text-white' : 
                        alert.severity === 'medium' ? 'bg-[#003F72] text-white' : 'bg-[#B0AAA2] text-white'
                      }`}
                    >
                      {alert.severity}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        alert.status === 'resolved' ? 'border-green-500 text-green-700' : 'border-orange-500 text-orange-700'
                      }`}
                    >
                      {alert.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-[#666666]">
                    Source: {alert.source} • {alert.time}
                  </p>
                </div>
              </div>
              <Button size="sm" variant="outline" className="rounded-full border-[#B0AAA2]/30">
                Investigate
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Audit Logs */}
      <Card className="p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-[#252628] flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-[#003F72]" />
            Recent Audit Logs
          </h3>
          <Button variant="outline" className="rounded-full border-[#B0AAA2]/30">
            View All
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#B0AAA2]/30">
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#666666]">Action</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#666666]">User</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#666666]">IP Address</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#666666]">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-[#666666]">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {recentAuditLogs.map((log) => (
                <tr key={log.id} className="border-b border-[#B0AAA2]/10 hover:bg-[#EBECE8]/30 transition-colors">
                  <td className="py-3 px-4 text-sm text-[#252628]">{log.action}</td>
                  <td className="py-3 px-4 text-sm text-[#252628] font-mono">{log.user}</td>
                  <td className="py-3 px-4 text-sm text-[#666666] font-mono">{log.ip}</td>
                  <td className="py-3 px-4">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${
                        log.status === 'success' ? 'bg-[#003F72] text-white' : 'bg-[#ED1C24] text-white'
                      }`}
                    >
                      {log.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-4 text-sm text-[#666666]">{log.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      </div>
    </div>
  );
}