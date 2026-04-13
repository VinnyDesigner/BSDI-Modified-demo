const fs = require('fs');
const filepath = 'd:\\Projects\\BSDI\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';

let content = fs.readFileSync(filepath, 'utf8');

// 1. Add TabsTrigger
const triggerOriginal = '<TabsTrigger value="metadata" className="tab-item">Metadata</TabsTrigger>';
const newTrigger = '<TabsTrigger value="app-users" className="tab-item">Application Users</TabsTrigger>';
if (!content.includes(newTrigger)) {
    content = content.replace(triggerOriginal, triggerOriginal + '\n                ' + newTrigger);
}

// 2. Inject State Variables & Mock Data
const stateVarsAndData = `
  const [appUsersPendingSearch, setAppUsersPendingSearch] = useState("");
  const [appUsersPendingDateRange, setAppUsersPendingDateRange] = useState({from:'', to:''});
  const [appUsersCompletedSearch, setAppUsersCompletedSearch] = useState("");
  const [appUsersCompletedDateRange, setAppUsersCompletedDateRange] = useState({from:'', to:''});

  const appUsersPendingRequests = [
    { id: "APP-3042-125", name: "Ahmed Al-Mansouri", email: "ahmed.mansouria@gov.bh", orgDept: "Ministry of Works (GIS Department)", role: "GIS Analyst", requestedDate: "18 Mar 2025", requestedBy: "Lulwa Saad Mujaddam" },
    { id: "APP-3042-124", name: "Fatima Al-Khalifa", email: "fatima.khalifa@gov.bh", orgDept: "Transport Authority (Data Management)", role: "Data Reviewer", requestedDate: "17 Mar 2025", requestedBy: "Rana A. Majeed" }
  ];

  const appUsersCompletedRequests = [
    { id: "APP-3042-123", name: "Mohammed Al-Baker", email: "mohammed.baker@gov.bh", orgDept: "Urban Planning Authority (Planning Department)", role: "Department Admin", requestedDate: "15 Mar 2025", approvedDate: "20 Mar 2025", approver: "—", requester: "—", status: "Approved" },
    { id: "APP-3042-122", name: "—", email: "", orgDept: "Environmental Agency (Data Services)", role: "Organization User", requestedDate: "14 Mar 2025", approvedDate: "19 Mar 2025", approver: "Yousif Al-Mahmood", requester: "Ahmed Al-Harqani", status: "Approved" }
  ];
`;
if (!content.includes('appUsersPendingRequests')) {
    content = content.replace('export default function DataAccessRequests1() {', stateVarsAndData + '\nexport default function DataAccessRequests1() {');
}

// 3. Create the massive App Users Tab block
const appUsersHtml = `

            {/* Application Users Tab */}
            <TabsContent value="app-users">
              <Accordion type="single" collapsible className="space-y-3" value={openAccordion} onValueChange={setOpenAccordion}>
                
                {/* Pending Accordion */}
                <AccordionItem 
                  value="app-users-pending"
                  className={\`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 \${openAccordion === 'app-users-pending' ? 'bg-[#FEF2F2]' : 'bg-white'}\`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#EF4444] rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                      <span className="font-medium text-[#111827] text-sm">Pending</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <div className="px-6 py-4 flex items-center gap-4">
                      {/* Search */}
                      <div className="w-[65%] relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <input
                          type="text"
                          placeholder="Search pending requests..."
                          value={appUsersPendingSearch}
                          onChange={(e) => setAppUsersPendingSearch(e.target.value)}
                          className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px]"
                        />
                      </div>
                      
                      {/* Date Range */}
                      <div className="flex-1 flex items-center gap-2">
                        <div className="relative flex-1">
                          <input 
                            type="text" 
                            placeholder="dd-mm-yyyy"
                            onFocus={(e) => e.target.type = 'date'}
                            onBlur={(e) => e.target.type = 'text'}
                            value={appUsersPendingDateRange.from} 
                            onChange={(e) => setAppUsersPendingDateRange({ ...appUsersPendingDateRange, from: e.target.value })} 
                            className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none" 
                          />
                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                        </div>
                        <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
                        <div className="relative flex-1">
                          <input 
                            type="text" 
                            placeholder="dd-mm-yyyy"
                            onFocus={(e) => e.target.type = 'date'}
                            onBlur={(e) => e.target.type = 'text'}
                            value={appUsersPendingDateRange.to} 
                            onChange={(e) => setAppUsersPendingDateRange({ ...appUsersPendingDateRange, to: e.target.value })} 
                            className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#EF4444] rounded-[10px] h-[36px] text-[14px] appearance-none" 
                          />
                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6">
                      <div className="scrollable-table-container shadow-sm border border-[#F0F0F0]">
                        <table className="dept-pending-table w-full">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">User Details</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Organization / Dept</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Role</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested By</th>
                              <th className="sticky-col-actions text-[11px] font-bold text-[#6B7280]">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {appUsersPendingRequests.filter(r => !appUsersPendingSearch || r.id.toLowerCase().includes(appUsersPendingSearch.toLowerCase()) || r.name.toLowerCase().includes(appUsersPendingSearch.toLowerCase()) || r.orgDept.toLowerCase().includes(appUsersPendingSearch.toLowerCase())).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap">
                                    {request.name !== '—' ? (
                                      <div className="flex flex-col gap-0.5">
                                        <span className="font-bold text-[#111827] text-[13px]">{request.name}</span>
                                        <span className="text-[#3D72A2] text-[12px]">{request.email}</span>
                                      </div>
                                    ) : (
                                      <span className="font-medium text-[#6B7280]">{request.name}</span>
                                    )}
                                  </td>
                                  <td className="font-medium whitespace-nowrap text-[#374151]">{request.orgDept}</td>
                                  <td className="whitespace-nowrap">
                                    <span className="px-2.5 py-1 bg-[#F3F4F6] text-[#4B5563] rounded-full text-[12px] font-medium border border-[#E5E7EB]">
                                      {request.role}
                                    </span>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.requestedDate}
                                    </div>
                                  </td>
                                  <td className="font-medium whitespace-nowrap text-[#374151]">{request.requestedBy}</td>
                                  <td className="sticky-col-actions">
                                    <div className="flex items-center gap-2">
                                      <button 
                                        className="flex items-center justify-center w-7 h-7 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 rounded-full transition-colors font-bold border border-[#10B981]/20" 
                                        title="Approve"
                                        onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}
                                      >
                                        ✓
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
                        </table>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                {/* Completed Accordion */}
                <AccordionItem 
                  value="app-users-completed"
                  className={\`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 \${openAccordion === 'app-users-completed' ? 'bg-[#EAF5EE]' : 'bg-white'}\`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#10B981] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                      <span className="font-medium text-[#111827] text-sm">Completed</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">
                    <div className="px-6 py-4 flex items-center gap-4">
                      {/* Search */}
                      <div className="w-[65%] relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
                        <input
                          type="text"
                          placeholder="Search completed requests..."
                          value={appUsersCompletedSearch}
                          onChange={(e) => setAppUsersCompletedSearch(e.target.value)}
                          className="w-full pl-10 pr-4 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px]"
                        />
                      </div>
                      
                      {/* Date Range */}
                      <div className="flex-1 flex items-center gap-2">
                        <div className="relative flex-1">
                          <input 
                            type="text" 
                            placeholder="dd-mm-yyyy"
                            onFocus={(e) => e.target.type = 'date'}
                            onBlur={(e) => e.target.type = 'text'}
                            value={appUsersCompletedDateRange.from} 
                            onChange={(e) => setAppUsersCompletedDateRange({ ...appUsersCompletedDateRange, from: e.target.value })} 
                            className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none" 
                          />
                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                        </div>
                        <span className="text-[#6B7280] font-bold text-[11px] uppercase shrink-0">TO</span>
                        <div className="relative flex-1">
                          <input 
                            type="text" 
                            placeholder="dd-mm-yyyy"
                            onFocus={(e) => e.target.type = 'date'}
                            onBlur={(e) => e.target.type = 'text'}
                            value={appUsersCompletedDateRange.to} 
                            onChange={(e) => setAppUsersCompletedDateRange({ ...appUsersCompletedDateRange, to: e.target.value })} 
                            className="w-full px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none" 
                          />
                          <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280] pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6">
                      <div className="scrollable-table-container shadow-sm border border-[#F0F0F0]">
                        <table className="org-completed-table w-full">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">User Details</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Organization / Dept</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Role</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approved Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approver</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requester</th>
                              <th className="sticky-col-status text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {appUsersCompletedRequests.filter(r => !appUsersCompletedSearch || r.id.toLowerCase().includes(appUsersCompletedSearch.toLowerCase()) || r.name.toLowerCase().includes(appUsersCompletedSearch.toLowerCase()) || r.orgDept.toLowerCase().includes(appUsersCompletedSearch.toLowerCase())).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap">
                                    {request.name !== '—' ? (
                                      <div className="flex flex-col gap-0.5">
                                        <span className="font-bold text-[#111827] text-[13px]">{request.name}</span>
                                        <span className="text-[#3D72A2] text-[12px]">{request.email}</span>
                                      </div>
                                    ) : (
                                      <span className="font-medium text-[#6B7280]">{request.name}</span>
                                    )}
                                  </td>
                                  <td className="font-medium whitespace-nowrap text-[#374151]">{request.orgDept}</td>
                                  <td className="whitespace-nowrap">
                                    <span className="px-2.5 py-1 bg-[#F3F4F6] text-[#4B5563] rounded-full text-[12px] font-medium border border-[#E5E7EB]">
                                      {request.role}
                                    </span>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.requestedDate}
                                    </div>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.approvedDate}
                                    </div>
                                  </td>
                                  <td className="font-medium whitespace-nowrap text-[#374151]">
                                      {request.approver}
                                  </td>
                                  <td className="font-medium whitespace-nowrap text-[#374151]">
                                      {request.requester}
                                  </td>
                                  <td className="sticky-col-status">
                                    <span className="status-badge created-green flex items-center gap-1.5 w-fit whitespace-nowrap">
                                      Approved
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </TooltipProvider>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
`;

// Insert after metadata tab end
const tabEndMarker = '</TabsContent>';
// We need to find the specific TabsContent for metadata to append after it.
// Finding where metadata TabsContent terminates is crucial.
const metadataStart = content.indexOf('<TabsContent value="metadata">');
if (metadataStart !== -1) {
    const fromMetadataStart = content.substring(metadataStart);
    // Find the first </TabsContent> after metadataStart
    const metadataEnd = fromMetadataStart.indexOf('</TabsContent>') + '</TabsContent>'.length;
    
    if (!content.includes('value="app-users"')) {
         content = content.substring(0, metadataStart + metadataEnd) + appUsersHtml + content.substring(metadataStart + metadataEnd);
         console.log('✅ Injected full App Users Tab effectively.');
    }
}

fs.writeFileSync(filepath, content, 'utf8');

