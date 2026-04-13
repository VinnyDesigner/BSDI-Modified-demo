const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/app/pages/modules/DataAccessRequests1.tsx');
let c = fs.readFileSync(file, 'utf8');

// 1. Add mock data for Data Access Completed
const completedMockData = `
// Mock data for Data Access Completed Requests
const dataAccessCompletedRequests = [
  { id: "DAE-3042-890", service: "Topographic Maps", entity: "Ministry of Works", requester: "Khalid Ali", date: "10 Jan 2025", approvedBy: "Admin" },
  { id: "DAE-3042-891", service: "Land Use Data", entity: "Survey & Land Registration", requester: "Fatima Hassan", date: "08 Jan 2025", approvedBy: "Admin" }
];
`;

if (!c.includes('const dataAccessCompletedRequests')) {
  c = c.replace('const dataAccessPendingRequests', completedMockData + '\nconst dataAccessPendingRequests');
}

// 2. Find the Data Access Tab section
const dataAccessTabStart = c.indexOf('<TabsContent value="data-access">');
if (dataAccessTabStart > -1) {
  // Find the Completed Accordion within this tab
  const completedHeaderComment = '{/* Organization Completed Accordion (Reused in Department Tab) */}';
  const completedStart = c.indexOf(completedHeaderComment, dataAccessTabStart);
  
  if (completedStart > -1) {
    const accordionItemStart = c.lastIndexOf('<AccordionItem', completedStart);
    const accordionItemEnd = c.indexOf('</AccordionItem>', accordionItemStart) + '</AccordionItem>'.length;
    
    let completedBlock = c.substring(accordionItemStart, accordionItemEnd);
    
    // Update Comment
    completedBlock = completedBlock.replace(completedHeaderComment, '{/* Data Access Completed Accordion */}');
    
    // Update Search Placeholder
    completedBlock = completedBlock.replace('Search completed requests...', 'Search completed data access...');
    
    // Update Table Headers
    completedBlock = completedBlock.replace(
      /<thead>[\s\S]*?<\/thead>/,
      `<thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request Id</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Service</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Entity</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requester</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approved By</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approved Date</th>
                              <th className="sticky-col-status"></th>
                            </tr>
                          </thead>`
    );
    
    // Update Table Body
    completedBlock = completedBlock.replace(
      /<tbody>[\s\S]*?<\/tbody>/,
      `<tbody>
                            <TooltipProvider delayDuration={100}>
                              {dataAccessCompletedRequests.map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td>{request.service}</td>
                                  <td>{request.entity}</td>
                                  <td>{request.requester}</td>
                                  <td className="font-medium">{request.approvedBy}</td>
                                  <td className="font-medium">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.date}
                                    </div>
                                  </td>
                                  <td className="sticky-col-status">
                                    <span className="status-badge created-green">APPROVED</span>
                                  </td>
                                </tr>
                              ))}
                            </TooltipProvider>
                          </tbody>`
    );
    
    c = c.substring(0, accordionItemStart) + completedBlock + c.substring(accordionItemEnd);
    fs.writeFileSync(file, c, 'utf8');
    console.log('Updated Data Access Completed accordion');
  } else {
    console.log('Completed accordion not found in Data Access tab');
  }
} else {
  console.log('Data Access Tab not found');
}
