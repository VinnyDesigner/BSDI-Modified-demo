const fs = require('fs');
const filepath = 'd:\\Projects\\BSDI\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';

let content = fs.readFileSync(filepath, 'utf8');

// 1. Iniect the Mock Data Array
const mockDataStr = `
const dataDownloadCompletedRequests = [
  { 
    id: "DIM-2045-914", 
    dataset: "Parcel Boundaries",
    format: "KML",
    requestor: "Fatima Hassan",
    requestedDate: "05 Mar 2025", 
    approvedDate: "14 Mar 2025",
    approvedBy: "Layla Al-Qassimi",
    status: "Approved" 
  }
];
`;

if (!content.includes('dataDownloadCompletedRequests')) {
    content = content.replace('export default function DataAccessRequests1() {', mockDataStr + '\nexport default function DataAccessRequests1() {');
}

// 2. Replace the completed table inside 'data-download' tab
const tabStart = content.indexOf('<TabsContent value="data-download">');
if (tabStart !== -1) {
    const afterTab = content.substring(tabStart);
    // Find the next org-completed-table
    const tableStart = afterTab.indexOf('<table className="org-completed-table">');
    const tableEnd = afterTab.indexOf('</table>', tableStart) + '</table>'.length;
    
    if (tableStart !== -1 && tableEnd !== -1) {
        const absStart = tabStart + tableStart;
        const absEnd = tabStart + tableEnd;
        
        const newTable = `<table className="org-completed-table">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Dataset</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Format</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requestor</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approved Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approved By</th>
                              <th className="sticky-col-status text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {dataDownloadCompletedRequests.filter(r => !orgCompletedSearch || r.id.toLowerCase().includes(orgCompletedSearch.toLowerCase()) || r.dataset.toLowerCase().includes(orgCompletedSearch.toLowerCase()) || r.requestor.toLowerCase().includes(orgCompletedSearch.toLowerCase()) || r.approvedBy.toLowerCase().includes(orgCompletedSearch.toLowerCase())).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
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
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      {request.requestedDate}
                                    </div>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      {request.approvedDate}
                                    </div>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                      {request.approvedBy}
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
                        </table>`;
        
        content = content.substring(0, absStart) + newTable + content.substring(absEnd);
        fs.writeFileSync(filepath, content, 'utf8');
        console.log('✅ Completed table replaced inside data-download.');
    } else {
        console.log('❌ Could not find table inside data-download tab.');
    }
} else {
    console.log('❌ Could not find data-download tab.');
}
