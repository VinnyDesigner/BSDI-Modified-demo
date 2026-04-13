const fs = require('fs');
const filepath = 'd:\\Projects\\BSDI\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';

let content = fs.readFileSync(filepath, 'utf8');
let lines = content.split('\n');

// 1. Remove metadata-forwarded block
const forwardedStartIndex = lines.findIndex(line => line.includes('value="metadata-forwarded"')) - 1; // get the <AccordionItem line
if (forwardedStartIndex !== -2) {
    let forwardedEndIndex = lines.findIndex((line, idx) => idx > forwardedStartIndex && line.includes('value="metadata-completed"')) - 2; // get the previous </AccordionItem>
    
    if (forwardedEndIndex > forwardedStartIndex) {
        lines.splice(forwardedStartIndex, forwardedEndIndex - forwardedStartIndex + 1);
        console.log('✅ Removed metadata-forwarded accordion completely.');
    } else {
        console.log('❌ Could not find the end of the metadata-forwarded accordion.');
    }
} else {
    console.log('❌ Could not find metadata-forwarded accordion start.');
}

content = lines.join('\n');

// 2. Wrap requested date and approved date with calendar icon
const targetHtml = `<td className="font-medium whitespace-nowrap text-[#374151]">
                                      {request.requestedDate}
                                  </td>
                                  <td className="font-medium whitespace-nowrap text-[#374151]">
                                      {request.approvedDate}
                                  </td>`;

const replacementHtml = `<td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.requestedDate}
                                    </div>
                                  </td>
                                  <td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.approvedDate}
                                    </div>
                                  </td>`;

if (content.includes(targetHtml)) {
    content = content.replace(targetHtml, replacementHtml);
    console.log('✅ Added Calendar icon to requestedDate and approvedDate.');
} else {
    console.log('❌ Could not find the target dates HTML block to replace.');
    
    // Fallback: trying to replace manually if spacing is weird
    content = content.replace(/<td className="font-medium whitespace-nowrap text-\[#374151\]">\s*\{request\.requestedDate\}\s*<\/td>/g, 
        `<td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.requestedDate}
                                    </div>
                                  </td>`);
                                  
    content = content.replace(/<td className="font-medium whitespace-nowrap text-\[#374151\]">\s*\{request\.approvedDate\}\s*<\/td>/g, 
        `<td className="font-medium whitespace-nowrap">
                                    <div className="flex items-center gap-2 text-[#374151]">
                                      <Calendar className="w-3.5 h-3.5 text-[#6B7280]" />
                                      {request.approvedDate}
                                    </div>
                                  </td>`);
                                  
    console.log('✅ Replaced dates via fallback regex.');
}

fs.writeFileSync(filepath, content, 'utf8');
