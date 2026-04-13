const fs = require('fs');
const filepath = 'd:\\Projects\\BSDI\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';

let content = fs.readFileSync(filepath, 'utf8');
const lines = content.split('\n');

const newLines = [];
let tabContext = null;
let skipCount = 0;

const deptTableStr = `                        <table className="dept-pending-table">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Service Details</th>
                              <th className="text-[11px] font-bold text-[#6B7280]" style={{minWidth: '280px'}}>Organization / Dept</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Submitted By</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="sticky-col-actions text-[11px] font-bold text-[#6B7280] text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {filteredDeptPending.filter(r => !deptPendingSearch || r.id.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.serviceDetails.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.organizationDept.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.submittedBy.toLowerCase().includes(deptPendingSearch.toLowerCase())).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827] whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap">{request.serviceDetails}</td>
                                  <td style={{minWidth: '280px'}}>{request.organizationDept}</td>
                                  <td className="font-medium whitespace-nowrap">{request.submittedBy}</td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.date}
                                    </div>
                                  </td>
                                  <td className="sticky-col-actions">
                                    <div className="flex items-center justify-end gap-2">
                                      <button 
                                        className="flex items-center justify-center w-8 h-8 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 rounded-full transition-colors font-bold border border-[#10B981]/20" 
                                        title="Approve"
                                        onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}
                                      >
                                        ✓
                                      </button>
                                      <button 
                                        className="flex items-center justify-center w-8 h-8 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 rounded-full transition-colors font-bold border border-[#EF4444]/20" 
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

const dataDownloadStr = `                        <table className="dept-pending-table">
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
                                    <span className="text-[#374151] whitespace-normal inline-block max-w-[220px]">{request.description}</span>
                                  </td>
                                  <td className="whitespace-nowrap">
                                    <a href={"mailto:" + request.email} className="text-[#3D72A2] hover:underline text-[13px] flex items-center">
                                      {request.email} <span className="ml-1 text-[10px]">↗</span>
                                    </a>
                                  </td>
                                  <td className="font-medium whitespace-nowrap text-[#374151]">
                                    {request.date}
                                  </td>
                                  <td className="sticky-col-actions">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button 
                                        className="flex items-center justify-center w-7 h-7 bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20 rounded-full transition-colors font-bold border border-[#3B82F6]/20 text-[10px]" 
                                        title="View Map"
                                      >
                                        🗺️
                                      </button>
                                      <button 
                                        className="flex items-center justify-center w-7 h-7 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 rounded-full transition-colors font-bold border border-[#10B981]/20" 
                                        title="Approve"
                                        onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}
                                      >
                                        ✓
                                      </button>
                                      <button 
                                        className="flex items-center justify-center w-7 h-7 bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20 rounded-full transition-colors border border-[#F59E0B]/20 font-bold" 
                                        title="Forward"
                                      >
                                        ➜
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

let i = 0;
while (i < lines.length) {
    const line = lines[i];
    
    if (line.includes('<TabsContent value="department">')) {
        tabContext = 'department';
    } else if (line.includes('<TabsContent value="data-download">')) {
        tabContext = 'data-download';
    } else if (line.includes('<TabsContent value=')) {
        tabContext = null;
    }

    if (line.includes('<table className="dept-pending-table">')) {
        if (tabContext === 'department' || tabContext === 'data-download') {
            skipCount = 0;
            // Find end of table
            while (i + skipCount < lines.length && !lines[i + skipCount].includes('</table>')) {
                skipCount++;
            }
            
            if (tabContext === 'department') {
                newLines.push(deptTableStr);
                console.log('Restored original department table.');
            } else if (tabContext === 'data-download') {
                newLines.push(dataDownloadStr);
                console.log('Injected correct data-download pending table.');
            }
            
            i += skipCount + 1; // skip past </table>
            continue;
        }
    }
    
    // Add \r back if original string split leaves it out, split by \n drops \r?
    // React TSX files may have CRLF. split('\n') leaves \r at the end of elements.
    newLines.push(line);
    i++;
}

// Rejoin with exactly what we split by
fs.writeFileSync(filepath, newLines.join('\n'), 'utf8');
console.log('File updated successfully.');
