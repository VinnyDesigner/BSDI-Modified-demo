const fs = require('fs');
const filePath = 'd:\\Projects\\BSDI\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// --- STEP 1: Replace the departmentCompletedRequests mock data ---
const oldMockRegex = /const departmentCompletedRequests = \[[\s\S]*?\n\];/;
const newMockData = `const departmentCompletedRequests = [
  { 
    id: "SVC-2042-985", 
    service: "WMTS - Orthophoto Basemap",
    url: "https://api.bsdi.gov.bh/wmts/",
    requestedDate: "01 Mar 2025",
    approvedDate: "12 Mar 2025",
    approvedBy: "Khalid Al-Zayani",
    status: "Active"
  }
];`;

if (oldMockRegex.test(content)) {
  content = content.replace(oldMockRegex, newMockData);
  console.log('✅ Mock data replaced successfully.');
} else {
  console.log('❌ Could not find departmentCompletedRequests mock data.');
}

// --- STEP 2: Replace the table headers in completed accordion (org-completed-table) ---
// Find all org-completed-table blocks and replace headers
let idx = 0;
let headerCount = 0;
while (true) {
  const tableStart = content.indexOf('org-completed-table', idx);
  if (tableStart === -1) break;
  
  const theadEnd = content.indexOf('</thead>', tableStart);
  if (theadEnd === -1) break;
  
  const headerBlock = content.substring(tableStart, theadEnd + '</thead>'.length);
  
  // Build new header - replace the entire header content
  let newHeader = headerBlock;
  
  // Replace Request Id -> Request ID
  newHeader = newHeader.replace('>Request Id<', '>Request ID<');
  
  // Replace Department -> Service
  newHeader = newHeader.replace('>Department<', '>Service<');
  
  // Replace Type -> URL (with minWidth)
  newHeader = newHeader.replace(
    '<th className="text-[11px] font-bold text-[#6B7280]">Type</th>',
    '<th className="text-[11px] font-bold text-[#6B7280]" style={{minWidth: \'260px\'}}>URL</th>'
  );
  
  // Replace Organization -> Requested Date
  newHeader = newHeader.replace('>Organization<', '>Requested Date<');
  
  // Approved By stays the same
  
  // Replace Approved Date stays the same
  
  // Status stays the same
  
  content = content.substring(0, tableStart) + newHeader + content.substring(theadEnd + '</thead>'.length);
  headerCount++;
  idx = tableStart + newHeader.length;
}
console.log(`✅ Replaced ${headerCount} completed table header(s).`);

// --- STEP 3: Replace the filter expression ---
const oldFilter = `r.department.toLowerCase().includes(orgCompletedSearch.toLowerCase()) || r.approvedBy.toLowerCase().includes(orgCompletedSearch.toLowerCase())`;
const newFilter = `r.service.toLowerCase().includes(orgCompletedSearch.toLowerCase()) || r.approvedBy.toLowerCase().includes(orgCompletedSearch.toLowerCase())`;

let filterCount = 0;
while (content.includes(oldFilter)) {
  content = content.replace(oldFilter, newFilter);
  filterCount++;
}
console.log(`✅ Replaced ${filterCount} filter expression(s).`);

// --- STEP 4: Replace the row cells ---
// Replace {request.department} -> {request.service}
const oldDeptCell = '<td>{request.department}</td>';
const newServiceCell = '<td className="whitespace-nowrap">{request.service}</td>';
let c1 = 0;
while (content.includes(oldDeptCell)) {
  content = content.replace(oldDeptCell, newServiceCell);
  c1++;
}
console.log(`✅ Replaced ${c1} department->service cell(s).`);

// Replace the Type badge cell with URL cell
// The type cell is a multi-line block with the green badge
const typeBadgeRegex = /\s*<td className="whitespace-nowrap">\s*[\r\n]+\s*<span className="px-2\.5 py-1 bg-\[#10B981\]\/10 text-\[#10B981\] rounded-full text-\[12px\] font-medium border border-\[#10B981\]\/20">\s*[\r\n]+\s*\{request\.type\.charAt\(0\)\.toUpperCase\(\) \+ request\.type\.slice\(1\)\.toLowerCase\(\)\}\s*[\r\n]+\s*<\/span>\s*[\r\n]+\s*<\/td>/g;
const newUrlCell = `
                                  <td style={{minWidth: '260px'}}>
                                    <a href={request.url} target="_blank" rel="noopener noreferrer" className="text-[#3D72A2] hover:underline text-[13px]">
                                      {request.url}...
                                    </a>
                                  </td>`;
const typeMatches = content.match(typeBadgeRegex);
if (typeMatches) {
  content = content.replace(typeBadgeRegex, newUrlCell);
  console.log(`✅ Replaced ${typeMatches.length} type->URL cell(s).`);
} else {
  console.log('⚠️ Could not find type badge cell to replace.');
}

// Replace {request.organization} -> {request.requestedDate} with calendar icon
const oldOrgCell = '<td>{request.organization}</td>';
const newReqDateCell = `<td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.requestedDate}
                                    </div>
                                  </td>`;
let c2 = 0;
while (content.includes(oldOrgCell)) {
  content = content.replace(oldOrgCell, newReqDateCell);
  c2++;
}
console.log(`✅ Replaced ${c2} organization->requestedDate cell(s).`);

// Replace the approved date cell: {request.date} -> {request.approvedDate}
// This is in the completed table - the cell with Calendar icon and request.date
// We need to be careful to only replace in completed sections
// The pattern is inside org-completed-table contexts
// Let's search for the specific pattern that uses request.date within the completed table body
const oldDateCell = `{request.date}`;
// We need to target only the completed table dates. Let me use a more targeted approach.
// Find each org-completed-table and replace request.date within its tbody
let dateIdx = 0;
let dateCount = 0;
while (true) {
  const tblStart = content.indexOf('org-completed-table', dateIdx);
  if (tblStart === -1) break;
  
  const tbodyStart = content.indexOf('<tbody>', tblStart);
  const tbodyEnd = content.indexOf('</tbody>', tblStart);
  if (tbodyStart === -1 || tbodyEnd === -1) break;
  
  const tbodyContent = content.substring(tbodyStart, tbodyEnd);
  if (tbodyContent.includes('{request.date}')) {
    const newTbodyContent = tbodyContent.replace('{request.date}', '{request.approvedDate}');
    content = content.substring(0, tbodyStart) + newTbodyContent + content.substring(tbodyEnd);
    dateCount++;
  }
  
  dateIdx = tbodyEnd + 10;
}
console.log(`✅ Replaced ${dateCount} date->approvedDate cell(s).`);

// Replace the status badge text from "Approved" to "Active 🟢"
const oldStatusBadge = `<span className="status-badge created-green">Approved</span>`;
const newStatusBadge = `<span className="status-badge created-green">Active 🟢</span>`;
let c3 = 0;
while (content.includes(oldStatusBadge)) {
  content = content.replace(oldStatusBadge, newStatusBadge);
  c3++;
}
console.log(`✅ Replaced ${c3} status badge(s).`);

fs.writeFileSync(filePath, content);
console.log('✅ File saved successfully.');
