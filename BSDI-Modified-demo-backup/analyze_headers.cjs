const fs = require('fs');

const content = fs.readFileSync('src/app/pages/modules/DataAccessRequests1.tsx', 'utf8');

// Find all secondary header blocks and analyze them
const HEADER_MARKER = 'flex items-center justify-between border-b border-[#E5E7EB] mb-4 pr-1';

let idx = 0;
let blockNum = 0;

while (true) {
  const pos = content.indexOf(HEADER_MARKER, idx);
  if (pos < 0) break;
  
  // Find the end of this header block by counting divs
  // The block starts at the opening <div className="flex items-center..."
  // We need to find the matching close </div>
  let depth = 0;
  let i = pos;
  
  // Go back to find start of the <div tag
  let tagStart = content.lastIndexOf('<div', pos);
  
  // Count depth from tagStart
  let blockEnd = tagStart;
  let d = 0;
  let j = tagStart;
  while (j < content.length) {
    if (content.substring(j, j + 4) === '<div') {
      const nc = content[j + 4];
      if (nc === ' ' || nc === '>' || nc === '\n' || nc === '\r') {
        d++;
        j = content.indexOf('>', j) + 1;
        continue;
      }
    }
    if (content.substring(j, j + 6) === '</div>') {
      d--;
      if (d <= 0) {
        blockEnd = j + 6;
        break;
      }
      j += 6;
      continue;
    }
    j++;
  }
  
  const block = content.substring(tagStart, blockEnd);
  
  // Extract all TabsTrigger values
  const triggerMatches = [...block.matchAll(/value="([^"]+)"/g)];
  const triggers = triggerMatches.map(m => m[1]);
  
  // Find which tab values have their search already in the header
  // (look for TabsContent value="..." within the block that has flex-1 flex justify-end)
  const tcMatches = [...block.matchAll(/<TabsContent[^>]+value="([^"]+)"[^>]*flex justify-end/g)];
  const hasSearch = tcMatches.map(m => m[1]);
  
  const lineNum = content.substring(0, tagStart).split('\n').length;
  
  console.log(`\n--- Block ${++blockNum} (line ~${lineNum}) ---`);
  console.log('  Tabs:', triggers.join(', '));
  console.log('  Has search for:', hasSearch.join(', ') || 'NONE');
  console.log('  MISSING search for:', triggers.filter(t => !hasSearch.includes(t)).join(', ') || 'none');
  
  idx = pos + 1;
}
