import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Switch } from "../../components/ui/switch";
import { Settings as SettingsIcon, User, Bell, Shield, Database } from "lucide-react";

export default function Settings() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-[#e8ecf1] to-[#dfe4ea] px-10 py-6">
      <div className="max-w-[1800px] mx-auto space-y-8">
        <PageHeader 
          title="Settings"
          description="Configure system preferences and parameters"
        />

        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-6 h-auto">
              <TabsTrigger value="profile" className="py-3">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="notifications" className="py-3">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="py-3">
                <Shield className="w-4 h-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="system" className="py-3">
                <Database className="w-4 h-4 mr-2" />
                System
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-[26px] font-semibold text-[#EF4444]">Profile Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input placeholder="Enter your name" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="your.email@bsdi.bh" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input placeholder="+973 XXXX XXXX" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Department</Label>
                    <Input placeholder="Your department" className="rounded-xl" />
                  </div>
                </div>
                <Button className="bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-full">
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-[26px] font-semibold text-[#EF4444]">Notification Preferences</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[#B0AAA2]/20">
                    <div>
                      <h4 className="font-semibold text-[#252628]">Email Notifications</h4>
                      <p className="text-sm text-[#666666]">Receive email updates for important events</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[#B0AAA2]/20">
                    <div>
                      <h4 className="font-semibold text-[#252628]">Data Access Approvals</h4>
                      <p className="text-sm text-[#666666]">Notify when requests are approved</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[#B0AAA2]/20">
                    <div>
                      <h4 className="font-semibold text-[#252628]">Security Alerts</h4>
                      <p className="text-sm text-[#666666]">Alert on security-related events</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-[26px] font-semibold text-[#EF4444]">Security Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Current Password</Label>
                    <Input type="password" placeholder="Enter current password" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" placeholder="Enter new password" className="rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input type="password" placeholder="Confirm new password" className="rounded-xl" />
                  </div>
                </div>
                <Button className="bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-full">
                  Update Password
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="system" className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-[26px] font-semibold text-[#EF4444]">System Configuration</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[#B0AAA2]/20">
                    <div>
                      <h4 className="font-semibold text-[#252628]">Audit Logging</h4>
                      <p className="text-sm text-[#666666]">Track all system activities</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[#B0AAA2]/20">
                    <div>
                      <h4 className="font-semibold text-[#252628]">Auto-Approval</h4>
                      <p className="text-sm text-[#666666]">Automatically approve certain requests</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-[#B0AAA2]/20">
                    <div>
                      <h4 className="font-semibold text-[#252628]">Maintenance Mode</h4>
                      <p className="text-sm text-[#666666]">Enable for system maintenance</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
