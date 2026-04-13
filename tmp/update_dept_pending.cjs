const fs = require('fs');
const filePath = 'd:\\Projects\\BSDI\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Use substring-based replacements that are whitespace-agnostic

// --- STEP 1: Replace table headers in BOTH department tabs ---
// Find all occurrences of the old header pattern
const oldHeaderMarker = 'Request Id</th>';
const oldDeptHeader = `<th className="text-[11px] font-bold text-[#6B7280]">Department</th>`;
const oldTypeHeader = `<th className="text-[11px] font-bold text-[#6B7280]">Type</th>`;
const oldOrgHeader = `<th className="text-[11px] font-bold text-[#6B7280]">Organization</th>`;
const oldBizDescHeader = `<th className="text-[11px] font-bold text-[#6B7280]">Business Description</th>`;

// Find all dept-pending-table blocks and replace headers
let idx = 0;
let headerReplacements = 0;
while (true) {
  const tableStart = content.indexOf('dept-pending-table', idx);
  if (tableStart === -1) break;
  
  // Find the </thead> after this table start
  const theadEnd = content.indexOf('</thead>', tableStart);
  if (theadEnd === -1) break;
  
  // Extract the header block
  const headerBlock = content.substring(tableStart, theadEnd + '</thead>'.length);
  
  // Build the new header
  let newHeaderBlock = headerBlock;
  
  // Replace "Request Id" with "Request ID"
  newHeaderBlock = newHeaderBlock.replace('>Request Id<', '>Request ID<');
  
  // Replace Department with Service Details
  newHeaderBlock = newHeaderBlock.replace('>Department<', '>Service Details<');
  
  // Replace Type header with nothing (remove it)
  // Find and remove the Type th
  const typeThRegex = /\s*<th className="text-\[11px\] font-bold text-\[#6B7280\]">Type<\/th>/;
  newHeaderBlock = newHeaderBlock.replace(typeThRegex, '');
  
  // Replace Organization with Organization / Dept (with min-width)
  newHeaderBlock = newHeaderBlock.replace(
    '<th className="text-[11px] font-bold text-[#6B7280]">Organization</th>',
    '<th className="text-[11px] font-bold text-[#6B7280]" style={{minWidth: \'280px\'}}>Organization / Dept</th>'
  );
  
  // Remove Business Description header
  const bizDescThRegex = /\s*<th className="text-\[11px\] font-bold text-\[#6B7280\]">Business Description<\/th>/;
  newHeaderBlock = newHeaderBlock.replace(bizDescThRegex, '');
  
  content = content.substring(0, tableStart) + newHeaderBlock + content.substring(theadEnd + '</thead>'.length);
  headerReplacements++;
  
  idx = tableStart + newHeaderBlock.length;
}
console.log(`✅ Replaced ${headerReplacements} table header(s).`);

// --- STEP 2: Replace the filter function and row rendering ---
// Old filter uses r.department and r.organization
const oldFilter = `r.department.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.organization.toLowerCase().includes(deptPendingSearch.toLowerCase())`;
const newFilter = `r.serviceDetails.toLowerCase().includes(deptPendingSearch.toLowerCase()) || r.organizationDept.toLowerCase().includes(deptPendingSearch.toLowerCase())`;

let filterCount = 0;
while (content.includes(oldFilter)) {
  content = content.replace(oldFilter, newFilter);
  filterCount++;
}
console.log(`✅ Replaced ${filterCount} filter expression(s).`);

// --- STEP 3: Replace the row cells ---
// Replace {request.department} cell
const oldDeptCell = `<td className="whitespace-nowrap">{request.department}</td>`;
const newServiceCell = `<td className="whitespace-nowrap">{request.serviceDetails}</td>`;

let deptCellCount = 0;
while (content.includes(oldDeptCell)) {
  content = content.replace(oldDeptCell, newServiceCell);
  deptCellCount++;
}
console.log(`✅ Replaced ${deptCellCount} department cell(s).`);

// Remove the Type cell block (the <td> with the badge span for request.type)
// This is a multi-line block
const typeBlockRegex = /\s*<td className="whitespace-nowrap">\s*\n?\r?\s*<span className="px-2\.5 py-1 bg-\[#3D72A2\]\/10 text-\[#3D72A2\] rounded-full text-\[12px\] font-medium border border-\[#3D72A2\]\/20">\s*\n?\r?\s*\{request\.type\.charAt\(0\)\.toUpperCase\(\) \+ request\.type\.slice\(1\)\.toLowerCase\(\)\}\s*\n?\r?\s*<\/span>\s*\n?\r?\s*<\/td>/g;
const typeCellMatches = content.match(typeBlockRegex);
if (typeCellMatches) {
  content = content.replace(typeBlockRegex, '');
  console.log(`✅ Removed ${typeCellMatches.length} type cell(s).`);
} else {
  console.log('⚠️ Could not find type cell to remove. Trying alternative...');
  // Try simpler approach
  const simpleTypeRegex = /request\.type\.charAt\(0\)\.toUpperCase\(\)/g;
  const matches = content.match(simpleTypeRegex);
  console.log(`  Found ${matches ? matches.length : 0} occurrences of type expression.`);
}

// Replace {request.organization} cell with {request.organizationDept}
const oldOrgCell = `<td className="whitespace-nowrap">{request.organization}</td>`;
const newOrgDeptCell = `<td style={{minWidth: '280px'}}>{request.organizationDept}</td>`;

let orgCellCount = 0;
while (content.includes(oldOrgCell)) {
  content = content.replace(oldOrgCell, newOrgDeptCell);
  orgCellCount++;
}
console.log(`✅ Replaced ${orgCellCount} organization cell(s).`);

// Remove the Business Description cell block (the <td> with Tooltip for request.description)
const descBlockRegex = /\s*<td className="min-w-\[200px\] max-w-\[260px\]">\s*[\r\n]+\s*<div className="business-desc-cell">[\s\S]*?<\/Tooltip>\s*[\r\n]+\s*<\/div>\s*[\r\n]+\s*<\/td>/g;
const descMatches = content.match(descBlockRegex);
if (descMatches) {
  content = content.replace(descBlockRegex, '');
  console.log(`✅ Removed ${descMatches.length} description cell(s).`);
} else {
  console.log('⚠️ Could not find description cell to remove.');
}

fs.writeFileSync(filePath, content);
console.log('✅ File saved successfully.');
