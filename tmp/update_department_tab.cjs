const fs = require('fs');
let content = fs.readFileSync('src/app/pages/modules/DataAccessRequests1.tsx', 'utf8');

// 1. Update Mock Data
const newPendingRequests = `const RAW_departmentPendingRequests = [
  { 
    id: "DEPT-3042-992", 
    department: "GIS Operations Unit",
    type: "CREATE",
    organization: "Transport Authority",
    submittedBy: "Lulwa Saad Mujaddam",
    requestedDate: "16 Mar 2026",
    businessDescription: "Responsible for managing and maintaining GIS infrastructure, spatial data operations, and technical support across all municipal departments.",
    status: "pending" 
  },
  { 
    id: "DEPT-3042-991", 
    department: "Spatial Data Management",
    type: "CREATE",
    organization: "Min. of Municipalities",
    submittedBy: "Muneera Khamis",
    requestedDate: "15 Mar 2026",
    businessDescription: "Manages spatial data collection, validation, and distribution for municipal planning and development activities, ensuring data integrity and accessibility.",
    status: "pending" 
  }
];`;

const newCompletedRequests = `const RAW_departmentCompletedRequests = [
  { 
    id: "DEPT-3042-889", 
    department: "Road Network Studies",
    type: "Create",
    organization: "Works Authority",
    approver: "Fatima Al-Mansoori",
    approvedDate: "10 Mar 2025",
    status: "Approved"
  }
];`;

content = content.replace(/const RAW_departmentPendingRequests = \[[\s\S]*?\];/m, newPendingRequests);
content = content.replace(/const RAW_departmentCompletedRequests = \[[\s\S]*?\];/m, newCompletedRequests);

// 2. Update Pending Accordion (Value="department")
// Look for the specific table inside <TabsContent value="department">
const pendingAccordionStartIdx = content.indexOf('<TabsContent value="department">');
let pendingAccordionContent = content.substring(pendingAccordionStartIdx);
const pendingTableRegex = /<table className="dept-pending-table">[\s\S]*?<\/table>/;

const newPendingTable = `<table className="dept-pending-table">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Department</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Type</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Organization</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Submitted By</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Business Description</th>
                              <th className="sticky-col-actions text-[11px] font-bold text-[#6B7280] text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {filteredDeptPending.filter(r => !deptPendingSearch || r.id.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.department?.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.organization?.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.submittedBy.toLowerCase().includes(deptPendingSearch.toLowerCase())).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827] whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap">{request.department}</td>
                                  <td className="whitespace-nowrap">{request.type}</td>
                                  <td className="whitespace-nowrap">{request.organization}</td>
                                  <td className="font-medium whitespace-nowrap">{request.submittedBy}</td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.requestedDate}
                                    </div>
                                  </td>
                                  <td className="col-desc">
                                    <div className="business-desc-cell max-w-[200px] truncate">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <span className="cursor-help whitespace-nowrap overflow-hidden text-ellipsis block">{request.businessDescription}</span>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-gray-800 text-white text-xs p-2 max-w-[300px]">
                                          {request.businessDescription}
                                        </TooltipContent>
                                      </Tooltip>
                                    </div>
                                  </td>
                                  <td className="sticky-col-actions">
                                    <div className="flex items-center justify-end gap-2">
                                      <button 
                                        className="flex items-center justify-center w-8 h-8 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 rounded-full transition-colors font-bold border border-[#10B981]/20" 
                                        title="Approve"
                                        onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}
                                      >✓</button>
                                      <button 
                                        className="flex items-center justify-center w-8 h-8 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 rounded-full transition-colors font-bold border border-[#EF4444]/20" 
                                        title="Reject"
                                        onClick={(e) => { e.stopPropagation(); setRejectDialog({open: true, requestId: request.id}); }}
                                      >✕</button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </TooltipProvider>
                          </tbody>
                        </table>`;

pendingAccordionContent = pendingAccordionContent.replace(pendingTableRegex, newPendingTable);

// 3. Update Completed Accordion (Value="department")
// Re-find the completed table in the newly edited content
const completedTableRegex = /<AccordionItem \s*value="org-completed"[\s\S]*?<table className="org-completed-table">[\s\S]*?<\/table>/;

const newCompletedTableInDept = `<AccordionItem 
                  value="dept-completed"
                  className={\`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 \${openAccordion === 'dept-completed' ? 'bg-[#EAF5EE]' : 'bg-white'}\`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#10B981] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                      <span className="font-medium text-[#111827] text-sm">Completed</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <div className="px-6 py-4 flex items-center gap-4">
                      <div className="w-[65%] relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <input
                          type="text"
                          placeholder="Search completed requests..."
                          value={orgCompletedSearch}
                          onChange={(e) => setOrgCompletedSearch(e.target.value)}
                          className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
                        />
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <div className="relative flex-1">
                          <input type="text" placeholder="dd-mm-yyyy" className="w-full px-3 bg-white border border-[#E5E7EB] rounded-[10px] h-[36px] text-[14px]" />
                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        </div>
                      </div>
                    </div>
                    <div className="px-6 pb-6">
                      <div className="scrollable-table-container shadow-sm border border-[#F0F0F0]">
                        <table className="org-completed-table">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Department</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Type</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Organization</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approver</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approved Date</th>
                              <th className="sticky-col-status text-left text-[11px] font-bold text-[#6B7280]">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredDeptCompleted.map((request) => (
                              <tr key={request.id}>
                                <td className="sticky-col-id font-medium text-[#111827]">
                                  <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
                                    {request.id}
                                  </div>
                                </td>
                                <td className="whitespace-nowrap">{request.department}</td>
                                <td className="whitespace-nowrap">{request.type}</td>
                                <td className="whitespace-nowrap">{request.organization}</td>
                                <td className="font-medium text-[#111827] whitespace-nowrap">{request.approver}</td>
                                <td className="font-medium whitespace-nowrap">
                                  <div className="flex items-center gap-2 text-[#374151]">
                                    <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                    {request.approvedDate}
                                  </div>
                                </td>
                                <td className="sticky-col-status">
                                  <span className="status-badge created-green">{request.status}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>`;

// Perform second replacement in the specific tail of the file
const finalContent = content.substring(0, pendingAccordionStartIdx) + pendingAccordionContent.replace(completedTableRegex, newCompletedTableInDept);

fs.writeFileSync('src/app/pages/modules/DataAccessRequests1.tsx', finalContent);
console.log('Update successful!');
