const fs = require('fs');

let content = fs.readFileSync('src/app/pages/modules/DataAccessRequests1.tsx', 'utf8');
const originalContent = content;

// ============================================================================
// APPROACH: Find blocks matching either of 2 patterns and strip the filter row
//
// PATTERN A (with outer wrapper + inner <div>):
//   <TabsContent value="..." className="mt-0">
//     <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
//       <div>
//       {/* Top Filter Row - 65/35 split */}
//       <div className="px-6 py-4 flex items-center gap-4">
//         ...SEARCH...
//       </div>
//       <div className="px-6 pb-6">
//         <div className="scrollable-table-container ...">TABLE</div>
//       </div>
//     </div>
//   </div>
//
// PATTERN B (with outer border wrapper, no inner <div>):
//   <TabsContent value="..." className="mt-0">
//     <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
//       {/* Top Filter Row - 65/35 split */}
//       <div className="px-6 py-4 flex items-center gap-4">
//         ...SEARCH...
//       </div>
//       <div className="px-6 pb-6">
//         ...TABLE...
//       </div>
//     </div>
//   </TabsContent>
//
// Both get replaced with the table only, no outer wrapper.
// ============================================================================

// We'll use character-level parsing
function skipToMatchingDiv(str, openTagEnd) {
  // openTagEnd: position just after the '>' of an opening <div...>
  let depth = 1;
  let i = openTagEnd;
  while (i < str.length && depth > 0) {
    if (str[i] === '<') {
      if (str.substring(i, i + 4) === '<div' || str.substring(i, i + 4) === '<Div') {
        // Make sure it's not <divided or other tags
        const nextChar = str[i + 4];
        if (nextChar === ' ' || nextChar === '>' || nextChar === '\n' || nextChar === '\r') {
          depth++;
        }
      } else if (str.substring(i, i + 6) === '</div>') {
        depth--;
        if (depth === 0) {
          return i + 6;
        }
      }
    }
    i++;
  }
  return i;
}

const FILTER_MARKER = '{/* Top Filter Row - 65/35 split */}';
const FILTER_DIV_OPEN = '<div className="px-6 py-4 flex items-center gap-4">';

let processed = '';
let offset = 0;

while (offset < content.length) {
  const markerPos = content.indexOf(FILTER_MARKER, offset);
  if (markerPos === -1) {
    processed += content.substring(offset);
    break;
  }
  
  // --------------------------------------------------------------------------
  // Step 1: Find the nearest opening div before the marker that wraps everything
  // --------------------------------------------------------------------------
  
  // The filter div starts at the FILTER_DIV_OPEN line, right after the marker
  // First, let's find the px-6 py-4 div
  const filterDivOpenStart = content.indexOf(FILTER_DIV_OPEN, markerPos);
  if (filterDivOpenStart === -1) {
    processed += content.substring(offset, markerPos + FILTER_MARKER.length);
    offset = markerPos + FILTER_MARKER.length;
    continue;
  }
  const filterDivOpenEnd = filterDivOpenStart + FILTER_DIV_OPEN.length;
  
  // Skip the filter div and all its contents
  const afterFilterDiv = skipToMatchingDiv(content, filterDivOpenEnd);
  
  // --------------------------------------------------------------------------
  // Step 2: Skip any whitespace after the filter div then find the table div
  // --------------------------------------------------------------------------
  let tableSectionStart = afterFilterDiv;
  while (tableSectionStart < content.length && /[\s\r\n]/.test(content[tableSectionStart])) {
    tableSectionStart++;
  }
  
  // Skip optional comment: {/* Scrollable Table Section */}
  if (content.substring(tableSectionStart, tableSectionStart + 3) === '{/*') {
    const commentEnd = content.indexOf('*/', tableSectionStart) + 2;
    // skip to end of comment line + closing '}'
    const braceEnd = content.indexOf('}', commentEnd);
    tableSectionStart = braceEnd + 1;
    while (tableSectionStart < content.length && /[\s\r\n]/.test(content[tableSectionStart])) {
      tableSectionStart++;
    }
  }
  
  // Now we should be at the <div className="px-6 pb-6"> 
  if (!content.substring(tableSectionStart).startsWith('<div')) {
    // Unexpected - skip
    processed += content.substring(offset, markerPos + FILTER_MARKER.length);
    offset = markerPos + FILTER_MARKER.length;
    continue;
  }
  
  const pb6DivOpenEnd = content.indexOf('>', tableSectionStart) + 1;
  
  // Inside the pb-6 div, find the scrollable-table-container div
  let stcStart = content.indexOf('<div', pb6DivOpenEnd);
  if (stcStart === -1) {
    processed += content.substring(offset, markerPos + FILTER_MARKER.length);
    offset = markerPos + FILTER_MARKER.length;
    continue;
  }
  
  const stcTagEnd = content.indexOf('>', stcStart) + 1;
  let stcTag = content.substring(stcStart, stcTagEnd);
  
  // Fix the border class name in the table container
  stcTag = stcTag
    .replace('border border-[#F0F0F0]', 'border border-[#E5E7EB] rounded-xl overflow-hidden bg-white')
    .replace('border border-[#E5E7EB]"', 'border border-[#E5E7EB] rounded-xl overflow-hidden bg-white"');
  
  // Get inner content of the stc div
  const stcInnerStart = stcTagEnd;
  const stcEnd = skipToMatchingDiv(content, stcTagEnd);
  const stcInnerContent = content.substring(stcInnerStart, stcEnd - 6); // -6 for </div>
  
  // End of pb-6 wrapper
  const afterPb6Div = skipToMatchingDiv(content, pb6DivOpenEnd);
  
  // --------------------------------------------------------------------------
  // Step 3: Find block start - the outermost wrapper that contains the filter  
  // --------------------------------------------------------------------------
  // Walk backwards from markerPos to find the start of the outer wrapping div
  // The marker could be preceded by:
  //   a) <div className="bg-white border..."> then <div>
  //   b) <div className="bg-white border..."> directly
  // We need to find the outermost div wrapping everything we want to remove
  
  // Walk back to find either pattern
  let blockStart = markerPos;
  
  // First, check for an inner <div> (plain) just before the marker
  const beforeMarker = content.substring(0, markerPos).trimEnd();
  
  // Look for the last '<div' before the marker
  let lastDivPos = content.lastIndexOf('<div', markerPos - 1);
  let lastDivEnd = content.indexOf('>', lastDivPos) + 1;
  let lastDivTag = content.substring(lastDivPos, lastDivEnd);
  
  if (lastDivTag.trim() === '<div>') {
    // This is the inner <div> - go back one more level to find the outer wrapper
    blockStart = lastDivPos;
    let outerDivPos = content.lastIndexOf('<div', lastDivPos - 1);
    let outerDivEnd = content.indexOf('>', outerDivPos) + 1;
    let outerDivTag = content.substring(outerDivPos, outerDivEnd);
    if (outerDivTag.includes('bg-white') || outerDivTag.includes('border border-[#E5E7EB]')) {
      blockStart = outerDivPos;
    }
  } else if (lastDivTag.includes('bg-white') || lastDivTag.includes('border border-[#E5E7EB]') || lastDivTag.includes('overflow-hidden')) {
    // This is the outer wrapper directly
    blockStart = lastDivPos;
  }
  
  // After the pb-6 div, we need to close out the wrapper divs we consumed
  let blockEnd = afterPb6Div;
  
  // Skip whitespace
  while (blockEnd < content.length && /[\s\r\n]/.test(content[blockEnd])) blockEnd++;
  
  // If blockStart was the outer wrapper div, we need one more </div> to close it
  if (lastDivTag.trim() === '<div>') {
    // consumed inner <div> and outer wrapper - need to eat 2 closing divs after pb-6
    if (content.substring(blockEnd, blockEnd + 6) === '</div>') {
      blockEnd += 6;
      while (blockEnd < content.length && /[\s\r\n]/.test(content[blockEnd])) blockEnd++;
    }
  }
  
  // eat the outermost wrapper closing div
  if (content.substring(blockEnd, blockEnd + 6) === '</div>') {
    blockEnd += 6;
    while (blockEnd < content.length && /[\s\r\n]/.test(content[blockEnd])) blockEnd++;
  }
  
  // --------------------------------------------------------------------------
  // Step 4: Build the replacement and emit
  // --------------------------------------------------------------------------
  const replacement = `\n${stcTag}\n${stcInnerContent}\n</div>\n`;
  
  processed += content.substring(offset, blockStart);
  processed += replacement;
  offset = blockEnd;
  
  console.log(`✅ Processed filter row at pos ${markerPos}`);
}

if (processed !== originalContent) {
  fs.writeFileSync('src/app/pages/modules/DataAccessRequests1.tsx', processed, 'utf8');
  console.log('\n✅ Done! Search/date bars removed from within tab content areas.');
} else {
  console.log('\n⚠️  No changes made.');
}

const remaining = (processed.match(/Top Filter Row/g) || []).length;
console.log(`Remaining filter rows: ${remaining}`);
