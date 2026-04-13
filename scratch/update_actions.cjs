const fs = require('fs');
const path = require('path');

const filePath = 'd:\\BSDI\\BSDI-V3\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// We want to replace {!isReviewer && (<TooltipProvider>...)} with 
// {isReviewer ? (<span...>N/A</span>) : (<TooltipProvider>...)}

// Regex to find the blocks:
// {!isReviewer && (
//   <TooltipProvider>
//     ...
//   </TooltipProvider>
// )}

// This regex matches the pattern and uses a negative lookahead or non-greedy match to find the closing )}
// However, since there are nested braces, a simple regex might fail.
// But all these blocks follow the same structure.

const blocksToReplace = [
    { name: 'Spatial Permission', pattern: /(!isReviewer && \(\s+<TooltipProvider>[\s\S]+?<\/TooltipProvider>\s+\)\})/ },
    { name: 'Spatial Permission Updates', pattern: /(!isReviewer && \(\s+<TooltipProvider>[\s\S]+?<\/TooltipProvider>\s+\)\})/ },
    { name: 'Services Creation', pattern: /(!isReviewer && \(\s+<TooltipProvider>[\s\S]+?<\/TooltipProvider>\s+\)\})/ }
];

// Instead of regex for the whole block, let's just replace the starting tag.
// If we change {!isReviewer && ( to {isReviewer ? (<span...>N/A</span>) : (
// The closing )} will work perfectly for the new ternary.

content = content.replace(/(\s+)\{!isReviewer && \(\s+<TooltipProvider>/g, (match, indent) => {
    // Only replace if it's one of the ones we haven't handled yet.
    // Data Access (2011) was already changed to {isReviewer ? (
    return `${indent}{isReviewer ? (\n${indent}  <span className="text-sm text-[#9CA3AF] font-medium px-[18px]">N/A</span>\n${indent}) : (\n${indent}  <TooltipProvider>`;
});

fs.writeFileSync(filePath, content);
console.log('File updated successfully');
