import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card } from "../components/ui/card";
import logo from "../assets/bahrain-logo-new.png";

export default function Login() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const credentials = [
    { 
      role: "BSDI Super Admin", 
      userId: "superadmin_bsdi", 
      password: "bsdi@admin", 
      route: "/dashboard/super-admin" 
    },
    { 
      role: "Reviewer role", 
      userId: "reviewer_user", 
      password: "reviewer@123", 
      route: "/dashboard/reviewer" 
    },
    { 
      role: "Organization Admin", 
      userId: "entity_admin", 
      password: "entity@123", 
      route: "/dashboard/entity-admin" 
    },
    { 
      role: "Department Admin", 
      userId: "department_user", 
      password: "dept@123", 
      route: "/dashboard/department" 
    },
  ];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cred = credentials.find(c => c.userId === userId && c.password === password);
    if (cred) {
      navigate(cred.route);
    } else {
      alert("Invalid credentials");
    }
  };

  const quickLogin = (userId: string, password: string, route: string) => {
    setUserId(userId);
    setPassword(password);
    setTimeout(() => navigate(route), 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] p-4 lg:p-0">
      <Card className="w-full max-w-[1100px] h-auto lg:h-[700px] bg-white border-0 shadow-2xl rounded-[40px] overflow-hidden flex flex-col lg:flex-row">
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-[55%] p-8 lg:p-16 flex flex-col justify-center">
          <div className="mb-12">
            <h1 className="text-[42px] font-bold text-[#1A1A1A] leading-tight mb-2">
              BSDI Portal
            </h1>
            <p className="text-lg text-[#666666]">
              Bahrain Spatial Data Infrastructure
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <Label htmlFor="userId" className="text-base font-semibold text-[#1A1A1A]">
                User ID
              </Label>
              <Input
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="h-14 bg-[#F8F9FA] border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#ED1C24] px-6 text-lg"
                placeholder="Enter your user ID"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="password" className="text-base font-semibold text-[#1A1A1A]">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 bg-[#F8F9FA] border-gray-200 rounded-2xl focus:ring-2 focus:ring-[#ED1C24] px-6 text-lg"
                placeholder="Enter your password"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 bg-gradient-to-r from-[#ED1C24] to-[#003F72] hover:opacity-90 text-white text-xl font-bold rounded-2xl shadow-xl transition-all duration-300"
            >
              Sign In
            </Button>
          </form>
        </div>

        {/* Right Side - Demo Credentials */}
        <div className="w-full lg:w-[45%] bg-[#0F172A] p-8 lg:p-12 flex flex-col">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-white mb-3">Demo Credentials</h2>
            <p className="text-[#94A3B8]">Click any role below to quick login</p>
          </div>

          <div className="grid grid-cols-1 gap-4 flex-1">
            {credentials.map((cred, index) => (
              <button
                key={index}
                onClick={() => quickLogin(cred.userId, cred.password, cred.route)}
                className="w-full group relative p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 text-left overflow-hidden"
              >
                {/* Red Dot Indicator */}
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#ED1C24]"></div>
                
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#ED1C24] transition-colors">
                  {cred.role}
                </h3>
                <div className="space-y-1">
                  <p className="text-sm text-[#94A3B8] font-mono">{cred.userId}</p>
                  <p className="text-sm text-[#94A3B8] font-mono">{cred.password}</p>
                </div>
              </button>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-[#64748B]">
              Kingdom of Bahrain • Ministry of Municipality Affairs
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}