import { useState } from "react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Database, Plus, Edit, ChevronDown, ChevronUp, CheckCircle, Clock, FileText, Search } from "lucide-react";
import { PageHeader } from "../../components/PageHeader";
import { MetricCard } from "../../components/ui/MetricCard";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const metadata = [
  { 
    id: 1, 
    name: "Transportation Network", 
    category: "Infrastructure", 
    owner: "Ministry of Works", 
    lastUpdated: "2024-03-01", 
    status: "published",
    identifier: "01-transportation-network-infrastructure",
    downloads: "4,523",
    themes: "Infrastructure, Transportation",
    keywords: "Transportation, Network, Roads, Infrastructure",
    language: "English",
    modified: "01 Mar 2024 14:30",
    publisher: "Ministry of Works & Municipalities",
    lastProcessingMetadata: "01 Mar 2024 14:30 (metadata)",
    lastProcessingData: "01 Mar 2024 14:30 (data)"
  },
  { 
    id: 2, 
    name: "Zoning Boundaries", 
    category: "Planning", 
    owner: "Urban Planning Authority", 
    lastUpdated: "2024-02-28", 
    status: "review",
    identifier: "02-zoning-boundaries-planning",
    downloads: "2,187",
    themes: "Planning, Urban Development",
    keywords: "Zoning, Boundaries, Land Use, Urban Planning",
    language: "English",
    modified: "28 Feb 2024 11:15",
    publisher: "Urban Planning & Development Authority",
    lastProcessingMetadata: "28 Feb 2024 11:15 (metadata)",
    lastProcessingData: "28 Feb 2024 11:15 (data)"
  },
  { 
    id: 3, 
    name: "Building Permits", 
    category: "Development", 
    owner: "Development Control", 
    lastUpdated: "2024-02-25", 
    status: "published",
    identifier: "03-building-permits-development",
    downloads: "5,892",
    themes: "Development, Construction",
    keywords: "Building, Permits, Development, Construction",
    language: "English",
    modified: "25 Feb 2024 09:45",
    publisher: "Development Control Authority",
    lastProcessingMetadata: "25 Feb 2024 09:45 (metadata)",
    lastProcessingData: "25 Feb 2024 09:45 (data)"
  },
  { 
    id: 4, 
    name: "Environmental Zones", 
    category: "Environment", 
    owner: "Environmental Agency", 
    lastUpdated: "2024-02-20", 
    status: "draft",
    identifier: "04-environmental-zones-protection",
    downloads: "1,045",
    themes: "Environment, Conservation",
    keywords: "Environment, Zones, Protection, Conservation",
    language: "English",
    modified: "20 Feb 2024 16:20",
    publisher: "Supreme Council for Environment",
    lastProcessingMetadata: "20 Feb 2024 16:20 (metadata)",
    lastProcessingData: "20 Feb 2024 16:20 (data)"
  },
];

export default function MetadataManagement() {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-[#e8ecf1] to-[#dfe4ea] px-10 py-6">
      <div className="max-w-[1800px] mx-auto space-y-8">
        <PageHeader 
          title="Metadata Management"
          description="Manage GIS dataset metadata"
        >
          <Button className="bg-[#003F72] hover:bg-[#00365d] text-white rounded-xl h-11 px-6 shadow-sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Metadata
          </Button>
        </PageHeader>

        {/* Standardized Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard 
            value="342" 
            label="Total Datasets" 
            icon={<Database className="w-6 h-6" />} 
            variant="red" 
            trend={{ value: "+24", isPositive: true }}
          />
          <MetricCard 
            value="298" 
            label="Published" 
            icon={<CheckCircle className="w-6 h-6" />} 
            variant="green" 
            statusText="Active"
          />
          <MetricCard 
            value="28" 
            label="In Review" 
            icon={<Clock className="w-6 h-6" />} 
            variant="yellow" 
            statusText="Action Required"
          />
          <MetricCard 
            value="16" 
            label="Drafts" 
            icon={<FileText className="w-6 h-6" />} 
            variant="purple" 
            statusText="Private"
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-[#111827]">Metadata Catalog</h3>
            <p className="text-sm text-[#6B7280]">Browse and manage metadata for all shared GIS datasets</p>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-3 w-full lg:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <Input
                type="text"
                placeholder="Search catalog..."
                className="w-full h-[36px] pl-10 rounded-[10px] border-[#E5E7EB] bg-white text-sm focus:border-[#EF4444] transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[140px] h-[36px] rounded-[10px] border-[#E5E7EB] bg-white text-sm">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-[10px] border-[#F1F1F1] shadow-xl">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="infrastructure">Infrastructure</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[130px] h-[36px] rounded-[10px] border-[#E5E7EB] bg-white text-sm">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-[10px] border-[#F1F1F1] shadow-xl">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="review">In Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Card className="p-6 bg-white/80 backdrop-blur-sm border border-[#B0AAA2]/20 rounded-2xl shadow-lg">
          <div className="space-y-3">
            {metadata.map((item) => {
              const isExpanded = expandedId === item.id;
              return (
                <div 
                  key={item.id} 
                  className="rounded-xl bg-gradient-to-r from-white to-[#EBECE8]/50 border border-[#B0AAA2]/20 hover:shadow-md transition-all"
                >
                  {/* Main Row */}
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EF4444]/10 to-[#003F72]/10 flex items-center justify-center flex-shrink-0">
                        <Database className="w-6 h-6 text-[#EF4444]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-[#252628]">{item.name}</h4>
                          <Badge variant="outline" className="text-xs border-[#B0AAA2]/30">{item.category}</Badge>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${
                              item.status === 'published' ? 'bg-[#003F72] text-white' :
                              item.status === 'review' ? 'bg-[#EF4444] text-white' :
                              'bg-[#B0AAA2] text-white'
                            }`}
                          >
                            {item.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-[#666666]">Owner: {item.owner} • Updated: {item.lastUpdated}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="rounded-lg border-[#B0AAA2]/30"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => toggleExpand(item.id)}
                        className="bg-[#003F72] hover:bg-[#00365d] text-white rounded-lg"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Metadata Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-[#B0AAA2]/20 bg-white/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                        <div className="flex items-start gap-3">
                          <span className="text-sm font-semibold text-[#252628] min-w-[140px]">Dataset Identifier</span>
                          <span className="text-sm text-[#EF4444] font-mono">{item.identifier}</span>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <span className="text-sm font-semibold text-[#252628] min-w-[140px]">Downloads</span>
                          <span className="text-sm text-[#666666]">{item.downloads}</span>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <span className="text-sm font-semibold text-[#252628] min-w-[140px]">Themes</span>
                          <span className="text-sm text-[#666666]">{item.themes}</span>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <span className="text-sm font-semibold text-[#252628] min-w-[140px]">Keywords</span>
                          <span className="text-sm text-[#666666]">{item.keywords}</span>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <span className="text-sm font-semibold text-[#252628] min-w-[140px]">Language</span>
                          <span className="text-sm text-[#666666]">{item.language}</span>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <span className="text-sm font-semibold text-[#252628] min-w-[140px]">Modified</span>
                          <span className="text-sm text-[#666666]">{item.modified}</span>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <span className="text-sm font-semibold text-[#252628] min-w-[140px]">Publisher</span>
                          <span className="text-sm text-[#666666]">{item.publisher}</span>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <span className="text-sm font-semibold text-[#252628] min-w-[140px]">Last processing</span>
                          <div className="flex flex-col gap-1">
                            <span className="text-sm text-[#666666]">{item.lastProcessingMetadata}</span>
                            <span className="text-sm text-[#666666]">{item.lastProcessingData}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
