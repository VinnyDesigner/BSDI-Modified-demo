const fs = require('fs');
const filepath = 'd:\\Projects\\BSDI\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';

let content = fs.readFileSync(filepath, 'utf8');

// 1. Iniect the Mock Data Array
const mockDataStr = `
const dataDownloadForwardedRequests = [
  { 
    id: "DL-2042-912", 
    dataset: "Utility Networks",
    product: "Plugins",
    requestor: "Khalid K. Fars",
    requestedDate: "10 Mar 2025", 
    forwardedDate: "12 Mar 2025",
    dataOwners: "Ministry of Works",
    workflow: "Submitted-Processed-Approved" 
  }
];
`;

if (!content.includes('dataDownloadForwardedRequests')) {
    content = content.replace('export default function DataAccessRequests1() {', mockDataStr + '\nexport default function DataAccessRequests1() {');
}

// 2. Replace the pending table inside 'data-download-forwarded' accordion
const accordionStart = content.indexOf('value="data-download-forwarded"');
if (accordionStart !== -1) {
    const afterAccordion = content.substring(accordionStart);
    const tableStart = afterAccordion.indexOf('<table className="dept-pending-table">');
    const tableEnd = afterAccordion.indexOf('</table>', tableStart) + '</table>'.length;
    
    if (tableStart !== -1 && tableEnd !== -1) {
        const absStart = accordionStart + tableStart;
        const absEnd = accordionStart + tableEnd;
        
        const newTable = `<table className="dept-pending-table">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Dataset</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Product</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requestor</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Forwarded Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Data Owners</th>
                              <th className="sticky-col-status text-left min-w-[280px]">Workflow</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {dataDownloadForwardedRequests.filter(r => !dataDownloadForwardedSearch || r.id.toLowerCase().includes(dataDownloadForwardedSearch.toLowerCase()) || r.dataset.toLowerCase().includes(dataDownloadForwardedSearch.toLowerCase()) || r.requestor.toLowerCase().includes(dataDownloadForwardedSearch.toLowerCase()) || r.dataOwners.toLowerCase().includes(dataDownloadForwardedSearch.toLowerCase())).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <div className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap font-medium">{request.dataset}</td>
                                  <td className="whitespace-nowrap">
                                    <span className="px-2.5 py-1 bg-[#6B7280]/10 text-[#4B5563] rounded-full text-[12px] font-medium border border-[#6B7280]/20">
                                      {request.product}
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
                                      {request.forwardedDate}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap font-medium text-[#3D72A2]">
                                      {request.dataOwners}
                                  </td>
                                  <td className="sticky-col-status">
                                    <div className="flex flex-col gap-2 py-1.5 min-w-[280px]">
                                      <div className="flex items-center gap-2 w-full text-[12px] font-medium bg-[#F9FAFB] p-2 rounded-lg border border-[#E5E7EB]">
                                        <span className="text-[#10B981] flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5"/> Submitted</span>
                                        <span className="text-[#D1D5DB] font-bold">→</span>
                                        <span className="text-[#10B981] flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5"/> Processed</span>
                                        <span className="text-[#D1D5DB] font-bold">→</span>
                                        <span className="text-[#EF4444] flex items-center gap-1.5">
                                          Approved 
                                          <span className="relative flex h-2 w-2 ml-0.5">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                                          </span>
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </TooltipProvider>
                          </tbody>
                        </table>`;
        
        content = content.substring(0, absStart) + newTable + content.substring(absEnd);
        fs.writeFileSync(filepath, content, 'utf8');
        console.log('✅ Forwarded table replaced completely inside data-download.');
    } else {
        console.log('❌ Could not find table inside data-download-forwarded accordion.');
    }
} else {
    console.log('❌ Could not find data-download-forwarded accordion block.');
}
