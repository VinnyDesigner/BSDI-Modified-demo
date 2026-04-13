import sys
import os

filepath = r"d:\Projects\BSDI\BSDI-Modified-demo\src\app\pages\modules\DataAccessRequests1.tsx"

with open(filepath, "r", encoding="utf-8") as f:
    lines = f.readlines()

new_lines = []
in_dept_pending = False
in_data_download = False
tab_context = None

# We need the old department pending table body
dept_table_str = """                        <table className="dept-pending-table">
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
                        </table>\n"""

data_download_str = """                        <table className="dept-pending-table">
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
                                    <span className="text-[#374151] whitespace-normal inline-block">{request.description}</span>
                                  </td>
                                  <td className="whitespace-nowrap">
                                    <a href={"mailto:" + request.email} className="text-[#3D72A2] hover:underline text-[13px] flex items-center">
                                      {request.email} <span className="ml-1 text-[10px]">↗</span>
                                    </a>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      {request.date}
                                    </div>
                                  </td>
                                  <td className="sticky-col-actions">
                                    <div className="flex items-center justify-end gap-1.5">
                                      <button 
                                        className="flex items-center justify-center w-7 h-7 bg-[#3D72A2]/10 text-[#3D72A2] hover:bg-[#3D72A2]/20 rounded-full transition-colors border border-[#3D72A2]/20" 
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
                                        className="flex items-center justify-center w-7 h-7 bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20 rounded-full transition-colors border border-[#F59E0B]/20" 
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
                        </table>\n"""

i = 0
dept_tab_found = False
download_tab_found = False

while i < len(lines):
    line = lines[i]
    
    if '<TabsContent value="department">' in line:
        dept_tab_found = True
        tab_context = "department"
    elif '<TabsContent value="data-download">' in line:
        download_tab_found = True
        tab_context = "data-download"
    elif '<TabsContent value=' in line:
        # Ignore other tabs
        tab_context = None

    if '<table className="dept-pending-table">' in line and tab_context in ["department", "data-download"]:
        # We need to skip lines until </table>
        skip_count = 0
        while i + skip_count < len(lines) and '</table>' not in lines[i + skip_count]:
            skip_count += 1
            
        if tab_context == "department":
            new_lines.append(dept_table_str)
            print("Restored original department table.")
        elif tab_context == "data-download":
            new_lines.append(data_download_str)
            print("Injected correct data-download pending table.")
            
        i += skip_count + 1 # skip past </table>
        continue

    new_lines.append(line)
    i += 1

with open(filepath, "w", encoding="utf-8") as f:
    f.writelines(new_lines)
    
print("File updated successfully.")
