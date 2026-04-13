const fs = require('fs');
let content = fs.readFileSync('src/app/pages/modules/DataAccessRequests.tsx', 'utf8');

const mapButtonRegex = /<Button\s+onClick=\{\(\) => \{\s*setPreviewingRequest\(request\);\s*setMapPreviewOpen\(true\);\s*\}\}\s+variant="outline"\s+className="border-\[#003F72\](?:[^\"])*"\s*>\s*<Map className="w-3\.5 h-3\.5"\s*\/>\s*Map\s*<\/Button>/g;

content = content.replace(mapButtonRegex, `<TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      onClick={() => {
                                        setPreviewingRequest(request);
                                        setMapPreviewOpen(true);
                                      }}
                                      size="icon"
                                      variant="outline"
                                      className="bg-[#003F72]/10 hover:bg-[#003F72] text-[#003F72] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#003F72]/20"
                                    >
                                      <Map className="w-4 h-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">Map</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>`);

const viewFileButtonRegex = /<Button\s+onClick=\{\(e\) => \{\s*e\.stopPropagation\(\);\s*setViewingFileName\(group\.fileName\);\s*setPdfViewerOpen\(true\);\s*\}\}\s+variant="outline"\s+className="border-\[#003F72\](?:[^\"])*"\s*>\s*<FileText className="w-3 h-3"\s*\/>\s*View File\s*<\/Button>/g;

content = content.replace(viewFileButtonRegex, `<TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setViewingFileName(group.fileName);
                                          setPdfViewerOpen(true);
                                        }}
                                        size="icon"
                                        variant="outline"
                                        className="bg-[#003F72]/10 hover:bg-[#003F72] text-[#003F72] hover:text-white h-[36px] w-[36px] rounded-[10px] shadow-sm transition-colors border border-[#003F72]/20"
                                      >
                                        <FileText className="w-4 h-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent className="bg-gray-800 text-white text-xs py-1 px-2 rounded-md border-0">View File</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>`);

fs.writeFileSync('src/app/pages/modules/DataAccessRequests.tsx', content, 'utf8');
console.log('Action buttons standard update completed.');
