import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Download, Database, CheckCircle, Clock, Activity } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { MetricCard } from "../../components/ui/MetricCard";

const downloads = [
  { id: 1, user: "Jawaher Rashed", dataset: "Transportation Network", org: "Ministry of Works", size: "45.2 MB", date: "2024-03-04", status: "completed" },
  { id: 2, user: "Lulwa Saad Mujaddam", dataset: "Zoning Boundaries", org: "Urban Planning Authority", size: "23.8 MB", date: "2024-03-03", status: "completed" },
  { id: 3, user: "Rana A.Majeed", dataset: "Building Permits", org: "Environmental Agency", size: "67.1 MB", date: "2024-03-02", status: "processing" },
  { id: 4, user: "Muneera Khamis", dataset: "Environmental Zones", org: "Transport Authority", size: "12.5 MB", date: "2024-03-01", status: "completed" },
];

export default function Downloads() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-[#e8ecf1] to-[#dfe4ea] px-10 py-6">
      <div className="max-w-[1800px] mx-auto space-y-8">
        <PageHeader 
          title="Downloads"
          description="Track data download requests"
        />

        {/* Standardized Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            value="142" 
            label="Total Downloads" 
            icon={<Download className="w-6 h-6" />} 
            variant="red" 
            trend={{ value: "+12", isPositive: true }}
          />
          <MetricCard 
            value="128" 
            label="Completed" 
            icon={<CheckCircle className="w-6 h-6" />} 
            variant="green" 
            statusText="Active"
          />
          <MetricCard 
            value="14" 
            label="Processing" 
            icon={<Clock className="w-6 h-6" />} 
            variant="yellow" 
            statusText="Pending"
          />
          <MetricCard 
            value="2.4 GB" 
            label="Total Size" 
            icon={<Database className="w-6 h-6" />} 
            variant="purple" 
            statusText="Usage"
          />
        </div>

        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
          <h3 className="text-[26px] font-semibold text-[#ED1C24] mb-6">Download History</h3>
          <div className="space-y-3">
            {downloads.map((download) => (
              <div 
                key={download.id} 
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-white to-[#EBECE8]/50 border border-[#B0AAA2]/20 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ED1C24]/10 to-[#003F72]/10 flex items-center justify-center">
                    <Download className="w-6 h-6 text-[#ED1C24]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-[#252628]">{download.dataset}</h4>
                      <Badge variant="outline" className="text-xs border-[#B0AAA2]/30">{download.size}</Badge>
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${download.status === 'completed' ? 'bg-[#003F72] text-white' : 'bg-[#ED1C24] text-white'}`}
                      >
                        {download.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-[#666666]">{download.user} ({download.org}) • {download.date}</p>
                  </div>
                </div>
                <Button size="sm" className="bg-[#003F72] hover:bg-[#00365d] text-white rounded-full">
                  Download
                </Button>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}