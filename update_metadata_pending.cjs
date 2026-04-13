const fs = require('fs');
const filepath = 'd:\\Projects\\BSDI\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';

let content = fs.readFileSync(filepath, 'utf8');

// 1. Inject Metadata Mock Data Array
const mockDataStr = `
const metadataPendingRequests = [
  { 
    id: "META-2042-989", 
    layerName: "Topographic Database",
    layerType: "Vector",
    requestor: "Maryam Al-Jayed",
    requestedBy: "Maryam Al-Jayed",
    date: "16 Mar 2025" 
  },
  { 
    id: "META-2043-916", 
    layerName: "Satellite Imagery",
    layerType: "Raster",
    requestor: "Abdullah Yawar",
    requestedBy: "Abdullah Yawar",
    date: "14 Mar 2025" 
  },
  { 
    id: "META-2042-911", 
    layerName: "Flood Hazard Zones",
    layerType: "Vector",
    requestor: "Noura Al-Khalifa",
    requestedBy: "Noura Al-Khalifa",
    date: "12 Mar 2025" 
  }
];
`;

if (!content.includes('metadataPendingRequests')) {
    content = content.replace('export default function DataAccessRequests1() {', mockDataStr + '\nexport default function DataAccessRequests1() {');
}

// Locate the metadata tab
const tabStart = content.indexOf('<TabsContent value="metadata">');
if (tabStart !== -1) {
    const afterTab = content.substring(tabStart);

    // 2. Remove "Forwarded" Accordion Item
    const forwardedStart = afterTab.indexOf('<AccordionItem \n                  value="metadata-forwarded"');
    if (forwardedStart !== -1) {
        const forwardedEndMatch = '</AccordionItem>';
        const forwardedEnd = afterTab.indexOf(forwardedEndMatch, forwardedStart) + forwardedEndMatch.length;
        
        const blockToRemove = afterTab.substring(forwardedStart, forwardedEnd);
        content = content.replace(blockToRemove, ''); // Removes the entire forwarded accordion dynamically
        console.log('✅ Removed "metadata-forwarded" accordion.');
    } else {
        console.log('⚠️ Could not find "metadata-forwarded" accordion to remove.');
    }
}

// Reload after modifications to accurately find lengths
let updatedAfterTab = content.substring(content.indexOf('<TabsContent value="metadata">'));

// 3. Replace the pending table inside "metadata-pending"
const pendingAccStart = updatedAfterTab.indexOf('value="metadata-pending"');
if (pendingAccStart !== -1) {
    const tableStart = updatedAfterTab.indexOf('<table className="dept-pending-table">', pendingAccStart);
    const tableEnd = updatedAfterTab.indexOf('</table>', tableStart) + '</table>'.length;
    
    if (tableStart !== -1 && tableEnd !== -1) {
        const absStart = content.indexOf('<TabsContent value="metadata">') + tableStart;
        const absEnd = content.indexOf('<TabsContent value="metadata">') + tableEnd;
        
        const newTable = `<table className="dept-pending-table w-full">
                          <thead>
                            <tr>
                              <th className="sticky-col-id text-[11px] font-bold text-[#6B7280]">Request ID</th>
                              <th className="text-[11px] font-bold text-[#6B7280]" style={{minWidth: '220px'}}>Layer Name</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Layer Type</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requestor</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested By</th>
                              <th className="text-[11px] font-bold text-[#6B7280]">Requested Date</th>
                              <th className="sticky-col-actions text-[11px] font-bold text-[#6B7280] text-right pr-4">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            <TooltipProvider delayDuration={100}>
                              {metadataPendingRequests.filter(r => !metadataPendingSearch || r.id.toLowerCase().includes(metadataPendingSearch.toLowerCase()) || r.layerName.toLowerCase().includes(metadataPendingSearch.toLowerCase()) || r.requestor.toLowerCase().includes(metadataPendingSearch.toLowerCase())).map((request) => (
                                <tr key={request.id}>
                                  <td className="sticky-col-id font-medium text-[#111827]">
                                    <div className="flex items-center gap-2 whitespace-nowrap">
                                      <div className="w-1.5 h-1.5 bg-[#EF4444] rounded-full"></div>
                                      {request.id}
                                    </div>
                                  </td>
                                  <td className="whitespace-nowrap font-medium" style={{minWidth: '220px'}}>{request.layerName}</td>
                                  <td className="whitespace-nowrap">
                                    <span className="px-2.5 py-1 bg-[#3D72A2]/10 text-[#3D72A2] rounded-full text-[12px] font-medium border border-[#3D72A2]/20">
                                      {request.layerType}
                                    </span>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">{request.requestor}</td>
                                  <td className="font-medium whitespace-nowrap">{request.requestedBy}</td>
                                  <td className="font-medium whitespace-nowrap text-[#374151]">
                                    {request.date}
                                  </td>
                                  <td className="sticky-col-actions pr-4">
                                    <div className="flex items-center justify-end gap-1.5">
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
                        </table>`;
        
        content = content.substring(0, absStart) + newTable + content.substring(absEnd);
        fs.writeFileSync(filepath, content, 'utf8');
        console.log('✅ Pending table inside metadata tab successfully replaced.');
    } else {
        console.log('❌ Could not find table inside metadata-pending accordion.');
    }
} else {
    console.log('❌ Could not find metadata-pending accordion.');
}
