const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'Projects', 'BSDI', 'BSDI-Modified-demo', 'src', 'app', 'pages', 'modules', 'DataAccessRequests1.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const modalJsx = `
      {/* Dataset Preview Modal (Spatial Permission) */}
      <Dialog open={mapPreviewOpen} onOpenChange={setMapPreviewOpen}>
        <DialogContent className="max-w-[600px] h-[500px] bg-white rounded-[16px] border-0 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-0 overflow-hidden flex flex-col">
          {/* Close Icon (handled by DialogContent but we can customize or use a custom header) */}
          <div className="absolute right-6 top-6 z-10 transition-transform hover:scale-110">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMapPreviewOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-gray-100/80 text-[#6B7280]"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex-1 flex flex-col px-6 pt-6 overflow-hidden">
            {/* Header Section */}
            <div className="flex items-start gap-4 mb-5">
              <div className="w-12 h-12 rounded-full bg-[#EF4444]/10 flex items-center justify-center shrink-0">
                <Globe className="w-6 h-6 text-[#EF4444]" />
              </div>
              <div className="flex flex-col gap-0.5">
                <h3 className="text-[18px] font-bold text-[#111827]">Dataset Preview</h3>
                <p className="text-[14px] text-[#6B7280]">
                  Visual representation of the requested spatial boundary and dataset layers.
                </p>
              </div>
            </div>

            {/* Info Cards Row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <div className="bg-[#F9FAFB] rounded-[12px] p-3 border border-[#F3F4F6]">
                <div className="flex items-center gap-2 mb-1.5 text-[#6B7280]">
                  <FileText className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Request ID</span>
                </div>
                <div className="text-[13px] font-bold text-[#111827]">{previewingRequest?.id || "—"}</div>
              </div>
              <div className="bg-[#F9FAFB] rounded-[12px] p-3 border border-[#F3F4F6]">
                <div className="flex items-center gap-2 mb-1.5 text-[#6B7280]">
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Organization</span>
                </div>
                <div className="text-[13px] font-bold text-[#111827] truncate">
                  {previewingRequest?.organization || "Works Authority"}
                </div>
              </div>
              <div className="bg-[#F9FAFB] rounded-[12px] p-3 border border-[#F3F4F6]">
                <div className="flex items-center gap-2 mb-1.5 text-[#6B7280]">
                  <Layers className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">Layers</span>
                </div>
                <div className="text-[13px] font-bold text-[#111827]">
                  {previewingRequest?.layers || (previewingRequest?.permissionName ? "11 Layers" : "3 Layers")}
                </div>
              </div>
            </div>

            {/* Map Container */}
            <div className="relative flex-1 bg-[#F1F5F9] rounded-[12px] overflow-hidden border border-[#E5E7EB] mb-6 group min-h-[200px]">
              {/* Mock Map Background */}
              <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
              <div className="absolute inset-0 flex items-center justify-center p-6">
                <div className="w-full h-full bg-[#EF4444]/5 border-2 border-dashed border-[#EF4444]/30 rounded-xl flex items-center justify-center relative">
                   <span className="text-[#EF4444] text-[10px] uppercase font-bold tracking-widest opacity-30 text-center px-4">Boundary Area Overlay</span>
                   <div className="absolute w-2.5 h-2.5 bg-[#EF4444] rounded-full shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                </div>
              </div>
              <div className="absolute top-3 left-3 bg-white rounded-full px-3 py-1 shadow-sm border border-gray-100 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_4px_rgba(16,185,129,0.5)]"></div>
                <span className="text-[11px] font-semibold text-[#374151]">Selected Area</span>
              </div>
            </div>

            {/* Button Section */}
            <div className="pb-6">
              <Button
                onClick={() => setMapPreviewOpen(false)}
                className="w-full bg-[#EF4444] hover:bg-[#D93434] text-white h-[40px] rounded-[10px] font-semibold text-[14px] transition-all"
              >
                Close Preview
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
`;

// Insert modal before the final closing </div> of the component return
const finalDivIndex = content.lastIndexOf('</div>');
if (finalDivIndex !== -1) {
    content = content.slice(0, finalDivIndex) + modalJsx + content.slice(finalDivIndex);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully inserted Dataset Preview modal.');
} else {
    console.error('Could not find closing </div> tag.');
    process.exit(1);
}
