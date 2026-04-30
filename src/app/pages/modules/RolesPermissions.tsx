import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Shield, Plus, Users } from "lucide-react";

const roles = [
  { id: 1, name: "BSDI Super Admin", type: "System", users: 3, permissions: "Full Governance Authority", status: "active" },
  { id: 2, name: "Entity Admin", type: "Organization", users: 142, permissions: "Organization Management", status: "active" },
  { id: 3, name: "Department Reviewer", type: "Department", users: 487, permissions: "Department User & Role Management", status: "active" },
  { id: 4, name: "GIS Analyst", type: "Custom", users: 326, permissions: "Data Access & Analysis", status: "active" },
  { id: 5, name: "Data Reviewer", type: "Custom", users: 245, permissions: "Review & Approval", status: "active" },
];

export default function RolesPermissions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-[#e8ecf1] to-[#dfe4ea] px-10 py-6">
      <div className="max-w-[1800px] mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-0.5">
            <h1 className="text-[26px] font-bold text-[#EF4444]">Roles & Permissions</h1>
            <p className="text-[#4A5565] text-[14px] font-normal">Manage user roles and access control</p>
          </div>
          <Button className="bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-full shadow-lg">
            <Plus className="w-4 h-4 mr-2" />
            Create Custom Role
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#EF4444]/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#EF4444]" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[26px] font-semibold text-[#EF4444]">45</div>
                <div className="text-[14px] font-normal text-black/50">Total Roles</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#003F72]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#003F72]" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-[26px] font-semibold text-[#EF4444]">2,847</div>
                <div className="text-[14px] font-normal text-black/50">Assigned Users</div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
          <h3 className="text-[26px] font-semibold text-[#EF4444] mb-6">Roles Directory</h3>
          <div className="space-y-3">
            {roles.map((role) => (
              <div 
                key={role.id} 
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white to-[#EBECE8]/50 border border-[#B0AAA2]/20 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EF4444]/10 to-[#003F72]/10 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-[#EF4444]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-[#252628]">{role.name}</h4>
                      <Badge variant="outline" className="text-xs border-[#B0AAA2]/30">{role.type}</Badge>
                      <Badge variant="secondary" className="bg-[#003F72] text-white text-xs">{role.status}</Badge>
                    </div>
                    <p className="text-sm text-[#666666]">{role.permissions} • {role.users} users assigned</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="rounded-full border-[#B0AAA2]/30">
                    Edit
                  </Button>
                  <Button size="sm" className="bg-[#003F72] hover:bg-[#00365d] text-white rounded-full">
                    Manage
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
