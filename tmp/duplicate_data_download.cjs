const fs = require('fs');
const filePath = 'd:\\Projects\\BSDI\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add TabsTrigger for "Data Download" after "Services Creation"
const servicesTrigger = '<TabsTrigger value="department-2" className="tab-item">Services Creation</TabsTrigger>';
if (content.includes(servicesTrigger)) {
  content = content.replace(
    servicesTrigger,
    servicesTrigger + '\n                <TabsTrigger value="data-download" className="tab-item">Data Download</TabsTrigger>'
  );
  console.log('✅ Added Data Download TabsTrigger.');
} else {
  console.log('❌ Could not find Services Creation TabsTrigger.');
}

// 2. Find the department-2 TabsContent and duplicate it as data-download
const dept2Start = content.indexOf('<TabsContent value="department-2">');
if (dept2Start !== -1) {
  // Find the matching closing </TabsContent>
  // We need to count nesting levels
  let depth = 0;
  let i = dept2Start;
  let dept2End = -1;
  
  while (i < content.length) {
    const openIdx = content.indexOf('<TabsContent', i);
    const closeIdx = content.indexOf('</TabsContent>', i);
    
    if (closeIdx === -1) break;
    
    if (openIdx !== -1 && openIdx < closeIdx) {
      depth++;
      i = openIdx + 1;
    } else {
      depth--;
      if (depth === 0) {
        dept2End = closeIdx + '</TabsContent>'.length;
        break;
      }
      i = closeIdx + 1;
    }
  }
  
  if (dept2End !== -1) {
    const dept2Block = content.substring(dept2Start, dept2End);
    const dataDownloadBlock = dept2Block.replace('value="department-2"', 'value="data-download"');
    
    // Insert after the department-2 TabsContent
    content = content.slice(0, dept2End) + '\n\n            {/* Data Download Tab (Duplicated from Services Creation) */}\n            ' + dataDownloadBlock + content.slice(dept2End);
    console.log('✅ Duplicated Services Creation TabsContent as Data Download.');
  } else {
    console.log('❌ Could not find end of department-2 TabsContent.');
  }
} else {
  console.log('❌ Could not find department-2 TabsContent.');
}

fs.writeFileSync(filePath, content);
console.log('✅ File saved successfully.');
