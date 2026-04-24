import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { MapPin, Search, Layers, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Input } from "../../components/ui/input";
import { Checkbox } from "../../components/ui/checkbox";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { toast } from "sonner";

// Spatial Groups data
const spatialGroupsData = [
  { id: 1, name: "Northern Region", description: "Muharraq and Northern areas", type: "Regional", area: "245 km²", color: "#3B82F6" },
  { id: 2, name: "Capital Area", description: "Manama and surrounding districts", type: "Regional", area: "180 km²", color: "#10B981" },
  { id: 3, name: "Southern Region", description: "Riffa, Sitra and Southern areas", type: "Regional", area: "320 km²", color: "#F59E0B" },
  { id: 4, name: "Central Region", description: "Central Bahrain districts", type: "Regional", area: "156 km²", color: "#8B5CF6" },
  { id: 5, name: "Eastern Coast", description: "Coastal zones and marine areas", type: "Specialized", area: "95 km²", color: "#06B6D4" },
  { id: 6, name: "Western District", description: "Western development zones", type: "Development", area: "278 km²", color: "#EC4899" },
  { id: 7, name: "Industrial Zones", description: "Industrial and commercial areas", type: "Specialized", area: "134 km²", color: "#6366F1" },
  { id: 8, name: "Heritage Sites", description: "Protected cultural and heritage areas", type: "Protected", area: "42 km²", color: "#EF4444" },
  { id: 9, name: "Agricultural Land", description: "Farming and agricultural zones", type: "Specialized", area: "189 km²", color: "#84CC16" },
  { id: 10, name: "Coastal Development", description: "Beachfront and coastal development", type: "Development", area: "67 km²", color: "#14B8A6" },
];

export default function SpatialGroupSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);

  // Get state from navigation (contains returnPath and existing selections)
  const { returnPath, existingSelections, mode } = (location.state || {}) as {
    returnPath?: string;
    existingSelections?: string[];
    mode?: "create" | "edit";
  };

  // Initialize with existing selections
  useEffect(() => {
    if (existingSelections) {
      setSelectedGroups(existingSelections);
    }
  }, [existingSelections]);

  const handleToggleGroup = (groupName: string) => {
    setSelectedGroups(prev =>
      prev.includes(groupName)
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    );
  };

  const handleConfirm = () => {
    if (selectedGroups.length === 0) {
      toast.error("Please select at least one spatial group");
      return;
    }

    // Navigate back with selected groups
    navigate(returnPath || -1, {
      state: {
        selectedSpatialGroups: selectedGroups,
        mode,
      },
    });

    toast.success(`${selectedGroups.length} spatial group(s) selected`);
  };

  const handleCancel = () => {
    navigate(returnPath || -1);
  };

  const filteredSpatialGroups = spatialGroupsData.filter(group =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    group.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] via-[#e8ecf1] to-[#dfe4ea] px-10 py-6">
      <div className="max-w-[1800px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleCancel}
              variant="outline"
              className="h-12 w-12 p-0 rounded-full border-[#E0E0E0] hover:bg-gray-50"
            >
              <ArrowLeft className="w-5 h-5 text-[#666666]" />
            </Button>
            <div className="flex flex-col gap-0.5">
              <h1 className="text-[26px] font-bold text-[#EF4444]">
                Select Spatial Groups
              </h1>
              <p className="text-[#4A5565] text-[14px] font-normal">
                Choose one or multiple spatial groups to assign to the security control group
              </p>
            </div>
          </div>
          <Button
            onClick={handleConfirm}
            disabled={selectedGroups.length === 0}
            className="bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#991B1B] text-white rounded-full h-12 px-8 shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Confirm Selection
          </Button>
        </div>

        {/* Stats Card */}
        <Card className="relative h-[106px] bg-white/90 backdrop-blur-xl border-0 rounded-[24px] shadow-[8px_8px_24px_rgba(163,177,198,0.3),-8px_-8px_24px_rgba(255,255,255,0.8)] hover:shadow-[12px_12px_32px_rgba(163,177,198,0.4),-12px_-12px_32px_rgba(255,255,255,1)] transition-all duration-300 overflow-hidden">
          <div className="absolute right-[24px] top-[37px] w-[30px] h-[30px] flex items-center justify-center">
            <Layers className="w-[30px] h-[30px] text-[#EF4444]" style={{ strokeWidth: 2 }} />
          </div>
          <div className="absolute left-[23.88px] top-[18px] flex flex-col gap-1">
            <div className="text-[26px] font-semibold text-[#EF4444]">
              {selectedGroups.length}
            </div>
            <div className="text-[14px] font-normal text-black/50">
              Selected Spatial Groups
            </div>
          </div>
        </Card>

        {/* Main Content Card */}
        <Card className="p-8 bg-white/90 backdrop-blur-xl border-0 rounded-3xl shadow-[8px_8px_24px_rgba(163,177,198,0.3),-8px_-8px_24px_rgba(255,255,255,0.8)]">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#666666]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search spatial groups by name, description, or type..."
                className="pl-12 h-14 rounded-xl border-[#E0E0E0] bg-white focus:border-[#EF4444] focus:ring-2 focus:ring-[#EF4444]/20 transition-all text-base"
              />
            </div>
          </div>

          {/* Selected Count Banner */}
          {selectedGroups.length > 0 && (
            <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-blue-700 font-semibold">
                  {selectedGroups.length} spatial group{selectedGroups.length !== 1 ? 's' : ''} selected
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedGroups.slice(0, 3).map((groupName, idx) => (
                    <Badge
                      key={idx}
                      className="bg-white text-blue-700 border-blue-300 border text-xs font-medium px-2 py-0.5"
                    >
                      {groupName}
                    </Badge>
                  ))}
                  {selectedGroups.length > 3 && (
                    <Badge className="bg-white text-blue-700 border-blue-300 border text-xs font-medium px-2 py-0.5">
                      +{selectedGroups.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Spatial Groups Grid */}
          {filteredSpatialGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6">
                <MapPin className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a] mb-2">No Spatial Groups Found</h3>
              <p className="text-sm text-[#666666]">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSpatialGroups.map((group) => {
                const isSelected = selectedGroups.includes(group.name);
                
                return (
                  <div
                    key={group.id}
                    onClick={() => handleToggleGroup(group.name)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'border-[#EF4444] bg-gradient-to-br from-red-50 to-pink-50 shadow-lg scale-[1.02]'
                        : 'border-[#E0E0E0] bg-white hover:border-[#EF4444]/50 hover:shadow-md hover:scale-[1.01]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: `${group.color}20` }}
                        >
                          <MapPin 
                            className="w-6 h-6" 
                            style={{ color: group.color }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-[#1a1a1a] text-base mb-1 truncate">
                            {group.name}
                          </h4>
                          <Badge 
                            className="text-xs font-medium px-2 py-0.5"
                            style={{ 
                              backgroundColor: `${group.color}20`,
                              color: group.color,
                              border: `1px solid ${group.color}40`
                            }}
                          >
                            {group.type}
                          </Badge>
                        </div>
                      </div>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => handleToggleGroup(group.name)}
                        className="border-[#E0E0E0] data-[state=checked]:bg-[#EF4444] data-[state=checked]:border-[#EF4444] h-5 w-5"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <p className="text-sm text-[#666666] mb-3 line-clamp-2 min-h-[40px]">
                      {group.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#999999]">
                      <div className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5" />
                        <span className="font-medium">{group.area}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Footer Actions */}
        <div className="flex items-center justify-between">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="h-12 px-8 rounded-xl border-[#E0E0E0] hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={selectedGroups.length === 0}
            className="bg-gradient-to-r from-[#EF4444] to-[#DC2626] hover:from-[#DC2626] hover:to-[#991B1B] text-white rounded-full h-12 px-8 shadow-[0_6px_24px_rgba(237,28,36,0.3)] hover:shadow-[0_8px_32px_rgba(237,28,36,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Confirm Selection ({selectedGroups.length})
          </Button>
        </div>
      </div>
    </div>
  );
}


