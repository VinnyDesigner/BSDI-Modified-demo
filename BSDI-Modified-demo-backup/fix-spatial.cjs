const fs = require('fs');
let content = fs.readFileSync('src/app/pages/modules/DataAccessRequests.tsx', 'utf8');

// The replacement for Preview / View map string matches the <Button> tag exactly.
const previewMapRegex = /<Button\s+onClick=\{\(\) => \{\s+setPreviewingRequest\(request\);\s+setMapPreviewOpen\(true\);\s+\}\}\s+variant="outline"\s+className="border-\[#003F72\] text-\[#003F72\] hover:bg-\[#003F72\] hover:text-white font-medium h-\[30px\] px-4 rounded-lg text-\[13px\]"\s*>\s*(Preview Map|View Map)\s*<\/Button>/g;

let count = 0;
content = content.replace(previewMapRegex, (match, type) => {
    count++;
    return `<TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      onClick={() => {
                                        setPreviewingRequest(request);
                                        setMapPreviewOpen(true);
                                      }}
                                      size="icon"
                                      variant="outline"
                                      className="bg-[#003F72]/10 hover:bg-[#003F72] text-[#003F72] hover:text-white h-8 w-8 rounded-lg shadow-sm transition-colors border border-[#003F72]/20"
                                    >
                                      <Map className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">${type}</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>`;
});
console.log(`Replaced ${count} Map buttons.`);

// Reduce gaps in the 4 spatial blocks
// Easiest is to search for 'spatial-permission' TabsContent block and replace gap-8 with gap-4
let startIdx = content.indexOf('<TabsContent value="spatial-permission"');
let endIdx = content.indexOf('<TabsContent value="services-creation"');

if (startIdx !== -1 && endIdx !== -1) {
    let spatialBlock = content.substring(startIdx, endIdx);
    // Replace gap-8 with gap-4 in scrollable middle rows
    // Only where className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-8 pl-6 pr-4 border-l border-[#E5E7EB]"
    spatialBlock = spatialBlock.replace(/gap-8 pl-6 pr-4/g, 'gap-4 pl-6 pr-4');
    
    // Also user said remove the labels, meaning "Preview Map" etc.
    content = content.substring(0, startIdx) + spatialBlock + content.substring(endIdx);
    console.log('Reduced gaps between columns.');
}

fs.writeFileSync('src/app/pages/modules/DataAccessRequests.tsx', content, 'utf8');
