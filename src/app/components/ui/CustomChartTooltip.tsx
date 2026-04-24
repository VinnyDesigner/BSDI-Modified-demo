import React from 'react';

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-md border border-gray-100 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.15)] p-3 px-4 min-w-[200px] pointer-events-none">
        <p className="text-[#1a1a1a] font-bold mb-2 border-b border-gray-100 pb-1.5">{label}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => {
            // Priority: entry.color -> entry.fill -> fallback
            let dotColor = entry.color || entry.fill || "#ED1C24";
            
            // Handle gradient URLs
            if (typeof dotColor === 'string' && dotColor.startsWith('url(')) {
              if (dotColor.includes('mapGrad')) dotColor = "#ED1C24";
              else if (dotColor.includes('featureGrad')) dotColor = "#003F72";
              else if (dotColor.includes('geocodeGrad')) dotColor = "#6B6B6B";
              else if (dotColor.includes('gpGrad')) dotColor = "#B7AFA3";
              else if (dotColor.includes('nationalAccessApproved')) dotColor = "#FF6B6B";
              else if (dotColor.includes('servicesUsageColor')) dotColor = "#ED1C24";
              else dotColor = "#ED1C24"; // Default fallback for unknown gradients
            }

            return (
              <div key={`item-${index}`} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" 
                    style={{ backgroundColor: dotColor }}
                  />
                  <span className="text-[13px] font-medium text-[#4b5565]">{entry.name}</span>
                </div>
                <span className="text-[13px] font-bold text-[#1a1a1a]">
                  {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export default CustomChartTooltip;
