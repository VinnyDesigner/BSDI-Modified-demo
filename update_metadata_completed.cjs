const fs = require('fs');
const filepath = 'd:\\Projects\\BSDI\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';

let content = fs.readFileSync(filepath, 'utf8');

// 1. Align pending actions to left
content = content.replace(
    '<th className="sticky-col-actions text-[11px] font-bold text-[#6B7280] text-right pr-4">Actions</th>',
    '<th className="sticky-col-actions text-[11px] font-bold text-[#6B7280]">Actions</th>'
);

// We need to replace the Actions td for the metadata pending table specifically
// Locate the metadata-pending block first so we don't accidentally affect other tables
const pendingStart = content.indexOf('value="metadata-pending"');
if (pendingStart !== -1) {
    const tableEnd = content.indexOf('</table>', pendingStart);
    let pendingBlock = content.substring(pendingStart, tableEnd);
    
    // Replace the td classes and flex justify
    pendingBlock = pendingBlock.replace(/<td className="sticky-col-actions pr-4">/g, '<td className="sticky-col-actions">');
    pendingBlock = pendingBlock.replace(/<div className="flex items-center justify-end gap-1\.5">/g, '<div className="flex items-center gap-2">'); // Left align and a bit more gap
    
    content = content.substring(0, pendingStart) + pendingBlock + content.substring(tableEnd);
    console.log('✅ Pending Actions left aligned');
}


// 2. Inject Metadata Completed Mock Data
const mockDataStr = `
const metadataCompletedRequests = [
  { 
    id: "META-2043-907", 
    layerName: "Land Use 2023",
    layerType: "Polygon",
    requestor: "Yusuf Al-Doseri",
    requestedDate: "3 days ago", 
    approvedDate: "13 Mar 2025",
    approvedBy: "Noor Al-Hashimi",
    status: "Approved" 
  },
  { 
    id: "META-2043-903", 
    layerName: "Road Centerlines",
    layerType: "Line",
    requestor: "Sara Mohammad",
    requestedDate: "6 days ago", 
    approvedDate: "13 Mar 2025",
    approvedBy: "Noor Al-Hashimi",
    status: "Approved" 
  }
];
`;

if (!content.includes('metadataCompletedRequests')) {
    content = content.replace('export default function DataAccessRequests1() {', mockDataStr + '\nexport default function DataAccessRequests1() {');
}

// 3. Replace metadata-completed table
const completedStart = content.indexOf('value="metadata-completed"');
if (completedStart !== -1) {
    const tableStart = content.indexOf('<table', completedStart);
    const tableEnd = content.indexOf('</table>', tableStart) + '</table>'.length;
    
    if (tableStart !== -1 && tableEnd !== -1) {
        
        const newTable = `<table className="org-completed-table w-full">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Layer Name</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Layer Type</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requestor</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approved Date</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Approved By</th>
                              <th className="sticky-col-status text-left">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {metadataCompletedRequests.filter(r => !metadataCompletedSearch || r.id.toLowerCase().includes(metadataCompletedSearch.toLowerCase()) || r.layerName.toLowerCase().includes(metadataCompletedSearch.toLowerCase()) || r.requestor.toLowerCase().includes(metadataCompletedSearch.toLowerCase()) || r.approvedBy.toLowerCase().includes(metadataCompletedSearch.toLowerCase())).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap font-medium">{request.layerName}</td>
                                  <td className="whitespace-nowrap">
                                    <span className="px-2.5 py-1 bg-[#3D72A2]/10 text-[#3D72A2] rounded-full text-[12px] font-medium border border-[#3D72A2]/20">
                                      {request.layerType}
                                    </span>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">{request.requestor}</td>
                                  <td className="font-medium whitespace-nowrap text-[#374151]">
                                      {request.requestedDate}
                                  </td>
                                  <td className="font-medium whitespace-nowrap text-[#374151]">
                                      {request.approvedDate}
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
        
        content = content.substring(0, tableStart) + newTable + content.substring(tableEnd);
        console.log('✅ Completed table inside metadata tab successfully replaced.');
    } else {
        console.log('❌ Could not find table inside metadata-completed accordion.');
    }
} else {
    console.log('❌ Could not find metadata-completed accordion.');
}

fs.writeFileSync(filepath, content, 'utf8');
