const fs = require('fs');
const filePath = 'd:\\Projects\\BSDI\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add new mock data for data download pending requests (before the component function)
const dataDownloadMockData = `
// Mock data for Data Download Pending Requests
const dataDownloadPendingRequests = [
  { 
    id: "DL-2042-913", 
    dataset: "Road Network - Full",
    format: "Shapefile",
    requestor: "Sara Mohammad",
    description: "Complete road network dataset for transportation planning",
    email: "sara.mohammad@transport.gov.bh",
    date: "14 Mar 2025", 
    status: "pending" 
  },
  { 
    id: "DL-2042-914", 
    dataset: "Building Footprints",
    format: "GeoJSON",
    requestor: "Ahmad Al-Kharus",
    description: "Building footprints for urban development analysis",
    email: "ahmad.alkharus@planning.gov.bh",
    date: "14 Mar 2025", 
    status: "pending" 
  }
];
`;

// Insert before "export default function"
const exportIdx = content.indexOf('export default function DataAccessRequests1()');
if (exportIdx !== -1) {
  content = content.slice(0, exportIdx) + dataDownloadMockData + '\n' + content.slice(exportIdx);
  console.log('✅ Added dataDownloadPendingRequests mock data.');
} else {
  console.log('❌ Could not find export default function.');
}

// 2. Find the data-download TabsContent and replace its pending table
// First, find the data-download TabsContent
const dlTabStart = content.indexOf('value="data-download"');
if (dlTabStart === -1) {
  console.log('❌ Could not find data-download TabsContent.');
  process.exit(1);
}

// Find the first dept-pending-table AFTER the data-download tab
const dlPendingTableStart = content.indexOf('dept-pending-table', dlTabStart);
if (dlPendingTableStart === -1) {
  console.log('❌ Could not find dept-pending-table in data-download tab.');
  process.exit(1);
}

// Find the </table> that closes this table
const dlTableEnd = content.indexOf('</table>', dlPendingTableStart);
if (dlTableEnd === -1) {
  console.log('❌ Could not find closing </table> for data-download pending table.');
  process.exit(1);
}

// Also need to find and replace the filter/search line above the table
// Find the filter line that uses filteredDeptPending in the data-download section
const filterSearchStart = content.lastIndexOf('<TooltipProvider', dlTableEnd);
const filterEnd = content.indexOf('</TooltipProvider>', dlPendingTableStart);

// Extract and replace the entire table block
const tableEndFull = dlTableEnd + '</table>'.length;
const tableBlock = content.substring(dlPendingTableStart - 50, tableEndFull);

// Build the new table
const newTable = `dept-pending-table">
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
                                        onClick={(e) => { e.stopPropagation(); setPreviewingRequest(request); setMapPreviewOpen(true); }}
                                      >
                                        <Map className="w-3.5 h-3.5" />
                                      </button>
                                      <button 
                                        className="flex items-center justify-center w-7 h-7 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 rounded-full transition-colors font-bold border border-[#10B981]/20" 
                                        title="Approve"
                                        onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}
                                      >
                                        \u2713
                                      </button>
                                      <button 
                                        className="flex items-center justify-center w-7 h-7 bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20 rounded-full transition-colors border border-[#F59E0B]/20" 
                                        title="Forward"
                                        onClick={(e) => { e.stopPropagation(); setSelectedForwardRequest(request); setForwardDialogOpen(true); }}
                                      >
                                        <Forward className="w-3.5 h-3.5" />
                                      </button>
                                      <button 
                                        className="flex items-center justify-center w-7 h-7 bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444]/20 rounded-full transition-colors font-bold border border-[#EF4444]/20" 
                                        title="Reject"
                                        onClick={(e) => { e.stopPropagation(); setRejectDialog({open: true, requestId: request.id}); }}
                                      >
                                        \u2715
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </TooltipProvider>
                          </tbody>
                        </table>`;

// Find the exact start of the table tag (go back to find <table)
let tblTagStart = content.lastIndexOf('<table className="', dlPendingTableStart + 5);
// Actually, let's find <table className="dept-pending-table"> that's the closest one before dlPendingTableStart
tblTagStart = content.lastIndexOf('<table className="dept-pending-table">', dlPendingTableStart + 30);
if (tblTagStart === -1) {
  // Search a bit differently
  tblTagStart = content.lastIndexOf('<table className=', dlPendingTableStart + 5);
}

// Find the actual <table start before the dept-pending-table reference
const searchArea = content.substring(dlTabStart);
const relTableStart = searchArea.indexOf('<table className="dept-pending-table">');
const relTableEnd = searchArea.indexOf('</table>', relTableStart) + '</table>'.length;

if (relTableStart !== -1 && relTableEnd !== -1) {
  const absTableStart = dlTabStart + relTableStart;
  const absTableEnd = dlTabStart + relTableEnd;
  
  const newTableFull = '<table className="' + newTable;
  content = content.substring(0, absTableStart) + newTableFull + content.substring(absTableEnd);
  console.log('✅ Replaced pending table in data-download tab.');
} else {
  console.log('❌ Could not locate table boundaries in data-download tab.');
}

fs.writeFileSync(filePath, content);
console.log('✅ File saved successfully.');
