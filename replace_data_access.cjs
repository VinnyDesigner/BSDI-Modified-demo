const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/app/pages/modules/DataAccessRequests1.tsx');
let c = fs.readFileSync(file, 'utf8');

// 1. Define the mock data somewhere at top 
const mockDataString = `
// Mock data for Data Access Pending Requests
const dataAccessPendingRequests = [
  { id: "DAE-3042-893", service: "Road Network - WMS", entity: "Transport Authority", requester: "Sara Mohammad", date: "12 Mar 2026" },
  { id: "DAE-3042-894", service: "Building Footprints - WFS", entity: "Min. of Municipalities", requester: "Ahmed Al-Harqani", date: "12 Mar 2026" }
];
`;

if (!c.includes('const dataAccessPendingRequests')) {
  // Inject right before component definition
  c = c.replace('export default function DataAccessRequests() {', mockDataString + '\nexport default function DataAccessRequests() {');
}

// 2. Locate Data Access Tab
let dataAccessStart = c.indexOf('<TabsContent value="data-access"');
if (dataAccessStart > -1) {
  let pendingStart = c.indexOf('<AccordionItem \n                  value="dept-pending"', dataAccessStart);
  if (pendingStart === -1) {
     pendingStart = c.indexOf('value="dept-pending"', dataAccessStart); // Find by partial
  }
  
  if (pendingStart > -1) {
    // Find the enclosing AccordionItem
    let blockStart = c.lastIndexOf('<AccordionItem', pendingStart);
    let pendingEnd = c.indexOf('</AccordionItem>', blockStart) + '</AccordionItem>'.length;
    
    let pendingBlock = c.substring(blockStart, pendingEnd);

    // Replace table headers
    pendingBlock = pendingBlock.replace(
      /<thead[\s\S]*?<\/thead>/,
      `<thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request Id</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Service</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Entity</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requester</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="sticky-col-actions text-right text-[11px] font-bold text-[#6B7280]">Actions</th>
                            </tr>
                          </thead>`
    );

    // Replace table body
    pendingBlock = pendingBlock.replace(
      /<tbody[\s\S]*?<\/tbody>/,
      `<tbody>
                            <TooltipProvider delayDuration={100}>
                              {dataAccessPendingRequests.map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td>{request.service}</td>
                                  <td>{request.entity}</td>
                                  <td>{request.requester}</td>
                                  <td className="font-medium">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.date}
                                    </div>
                                  </td>
                                  <td className="sticky-col-actions">
                                    <div className="flex items-center justify-end gap-2">
                                      <button 
                                        className="flex items-center justify-center w-8 h-8 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 rounded-[10px] transition-colors font-bold border border-[#10B981]/20" 
                                        title="Approve"
                                        onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}
                                      >
                                        ✓
                                      </button>
                                      <button 
                                        className="flex items-center justify-center w-8 h-8 bg-[#3B82F6]/10 text-[#3B82F6] hover:bg-[#3B82F6]/20 rounded-[10px] transition-colors font-bold border border-[#3B82F6]/20" 
                                        title="Forward"
                                        onClick={(e) => { e.stopPropagation(); }}
                                      >
                                        ➜
                                      </button>
                                      <button 
                                        className="flex items-center justify-center w-8 h-8 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 rounded-[10px] transition-colors font-bold border border-[#EF4444]/20" 
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
                          </tbody>`
    );

    c = c.substring(0, blockStart) + pendingBlock + c.substring(pendingEnd);
    fs.writeFileSync(file, c, 'utf8');
    console.log('Successfully updated Data Access pending tab');
  } else {
    console.log('Pending AccordionItem not found');
  }
} else {
  console.log('DataAccess tab not found');
}
