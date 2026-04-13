const fs = require('fs');
const filePath = 'd:\\Projects\\BSDI\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';
let content = fs.readFileSync(filePath, 'utf8');

const tabStart = content.indexOf('value="data-download"');
const searchSection = content.substring(tabStart);

// We want to replace the first <table className="dept-pending-table"> ... </table> block inside this section
const tableStart = searchSection.indexOf('<table className="dept-pending-table">');
const tableEnd = searchSection.indexOf('</table>', tableStart) + '</table>'.length;

const newTable = `<table className="dept-pending-table">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Dataset</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Format</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requestor</th>
                              <th className="text-[11px] font-bold text-[#6B7280]" style={{minWidth: '240px'}}>Description</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Email</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="sticky-col-actions text-[11px] font-bold text-[#6B7280] text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {dataDownloadPendingRequests.filter(r => !deptPendingSearch || r.id.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.dataset.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.requestor.toLowerCase().includes(deptPendingSearch.toLowerCase())).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827] whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap font-medium">{request.dataset}</td>
                                  <td className="whitespace-nowrap">
                                    <span className="px-2.5 py-1 bg-[#3D72A2]/10 text-[#3D72A2] rounded-full text-[12px] font-medium border border-[#3D72A2]/20">
                                      {request.format}
                                    </span>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">{request.requestor}</td>
                                  <td style={{minWidth: '240px'}}>
                                    <div className="business-desc-cell">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="cursor-help">{request.description}</span>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-800 text-white text-xs p-2 max-w-[300px]">
                                          {request.description}
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap">
                                    <a href={"mailto:" + request.email} className="text-[#3D72A2] hover:underline text-[13px]">
                                      {request.email}
                                    </a>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.date}
                                    </div>
                                  </td>
                                  <td className="sticky-col-actions">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button 
                                        className="flex items-center justify-center w-7 h-7 bg-[#3D72A2]/10 text-[#3D72A2] hover:bg-[#3D72A2]/20 rounded-full transition-colors border border-[#3D72A2]/20" 
                                        title="View Map"
                                      >
                                        <Map className="w-3.5 h-3.5" />
                                      </button>
                                      <button 
                                        className="flex items-center justify-center w-7 h-7 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 rounded-full transition-colors font-bold border border-[#10B981]/20" 
                                        title="Approve"
                                        onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}
                                      >
                                        ✓
                                      </button>
                                      <button 
                                        className="flex items-center justify-center w-7 h-7 bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20 rounded-full transition-colors border border-[#F59E0B]/20" 
                                        title="Forward"
                                      >
                                        <Forward className="w-3.5 h-3.5" />
                                      </button>
                                      <button 
                                        className="flex items-center justify-center w-7 h-7 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 rounded-full transition-colors font-bold border border-[#EF4444]/20" 
                                        title="Reject"
                                        onClick={(e) => { e.stopPropagation(); setRejectDialog({open: true, requestId: request.id}); }}
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </TooltipProvider>
                          </tbody>
                        </table>`;

if (tableStart !== -1 && tableEnd !== -1) {
  content = content.substring(0, tabStart + tableStart) + newTable + content.substring(tabStart + tableEnd);
  fs.writeFileSync(filePath, content);
  console.log('✅ Replaced pending table in data-download tab.');
} else {
  console.log('❌ Could not locate table block.');
}
