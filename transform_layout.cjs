const fs = require('fs');

let content = fs.readFileSync('src/app/pages/modules/DataAccessRequests1.tsx', 'utf8');

// We need to parse every <TabsContent> block that belongs to a sub-tab.
// The structure is roughly:
// <TabsContent value="SUBTAB_VALUE" className="mt-0">
//   <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
//     <div className="px-6 py-4 flex items-center gap-4">
//        SEARCH AND DATE STUFF
//     </div>
//     <div className="px-6 pb-6">
//        TABLE STUFF
//     </div>
//   </div>
// </TabsContent>

// Let's use a regex that matches this exact pattern.
const subTabContentRegex = /<TabsContent\s+value="([^"]+)"\s*(?:className="[^"]*")?>\s*<div\s+className="(?:bg-white border border-\[#E5E7EB\]|border border-\[#B0AAA2\]\/20) rounded-xl overflow-hidden(?:[^"]*)">\s*<div\s+className="px-6 py-4 flex items-center gap-4">([\s\S]*?)<\/div>\s*<div\s+className="px-6 pb-6">\s*([\s\S]*?)<\/div>\s*<\/div>\s*<\/TabsContent>/g;

// Instead of extracting search into the list directly (which is extremely complex because it separates the search logic from the table logic in the code, causing massive structural shifts), 
// we'll inject the search logic next to TabsList via a separate process or replace the whole <Tabs defaultValue="X"> block.

// Let's write a generic transformer that takes:
// <Tabs defaultValue="...">
//   <div className="border-b border-[#E5E7EB] mb-4">
//     <TabsList ...>
//        ...
//     </TabsList>
//   </div>
//   <TabsContent ...>
//      ...
//   </TabsContent>
// </Tabs>

// Wait, the best way to handle parsing JSX is to find the bounds of `<Tabs defaultValue` and `</Tabs>` and process them.
// Let's iterate through all modules' tabs.

function transformModuleTabs(html) {
    // A regular expression to find the wrapper of the TabsList.
    // Usually: <div className="border-b border-[#E5E7EB] mb-4">
    //          <TabsList ...> ... </TabsList>
    //          </div>
    const tabsListRegex = /<div className="border-b border-\[#E5E7EB\] mb-4">(\s*<TabsList[\s\S]*?<\/TabsList>\s*)<\/div>/g;
    
    // We want to replace the `div className="border-b ..."`
    // with a flex container. BUT we also need to append the dynamic search bars INTO it.
    
    // So what we do is:
    // We will do a full pass over the content to extract all the TabsContent "search bars".
    
    let result = html;
    
    let match;
    let extractedSearches = {}; // value -> search html
    let extractedTables = {};   // value -> table html
    
    while ((match = subTabContentRegex.exec(html)) !== null) {
        const val = match[1];
        let searchPart = match[2];
        let tablePart = match[3];
        
        extractedSearches[val] = searchPart;
        
        // Strip the ".scrollable-table-container" 'border-[#F0F0F0]' and add our own border.
        tablePart = tablePart.replace('border border-[#F0F0F0]', 'border border-[#E5E7EB] rounded-xl overflow-hidden bg-white');
        extractedTables[val] = tablePart;
        
        // Build the replacement for the TabsContent body
        const replacement = `<TabsContent value="${val}" className="mt-0">\n` +
                            `  <div className="pb-6">\n` + 
                            `    ${tablePart}\n` +
                            `  </div>\n` +
                            `</TabsContent>`;
                            
        // We will replace the whole block manually later to ensure accurate replacement.
    }

    // Now, for every TabsList div, we look at the values inside its Triggers.
    // <TabsTrigger value="dept-pending"> -> we know we need "dept-pending" search logic.
    
    result = result.replace(/<div className="border-b border-\[#E5E7EB\] mb-4">([\s\S]*?)<\/TabsList>\s*<\/div>/g, (fullMatch, tabsListInner) => {
        // Find all TabsTrigger values in this group
        const triggerRegex = /<TabsTrigger\s+value="([^"]+)"/g;
        let triggers = [];
        let tMatch;
        while ((tMatch = triggerRegex.exec(tabsListInner)) !== null) {
            triggers.push(tMatch[1]);
        }
        
        // Build the search bars container
        let searchBarsHtml = '';
        for (let t of triggers) {
            if (extractedSearches[t]) {
                searchBarsHtml += `\n<TabsContent value="${t}" className="mt-0 !m-0 p-0 border-0 flex-1 flex justify-end" tabIndex={-1}>
    <div className="flex items-center gap-4 w-[600px] justify-end">
        ${extractedSearches[t].trim()}
    </div>
</TabsContent>`;
            }
        }
        
        // Reconstruct the Header row
        return `<div className="flex items-center justify-between border-b border-[#E5E7EB] mb-4 pr-1">
<TabsList className="bg-transparent h-auto p-0 gap-0">
  ${tabsListInner.replace(/<TabsList[^>]*>/, '').trim()}
</TabsList>
${searchBarsHtml}
</div>`;
    });
    
    // Now replace the Tab Contents to be stripped of cards and search bars.
    for (let key in extractedSearches) {
        // We need a specific regex to replace only the content for THIS tab value to avoid global conflicts.
        const specificTabRegex = new RegExp(`<TabsContent\\s+value="${key}"\\s*(?:className="[^"]*")?>\\s*<div\\s+className="(?:bg-white border border-\\[#E5E7EB\\]|border border-\\[#B0AAA2\\]\\/20) rounded-xl overflow-hidden(?:[^"]*)">\\s*<div\\s+className="px-6 py-4 flex items-center gap-4">[\\s\\S]*?<\\/div>\\s*<div\\s+className="px-6 pb-6">\\s*([\\s\\S]*?)<\\/div>\\s*<\\/div>\\s*<\\/TabsContent>`);

        result = result.replace(specificTabRegex, (match, tableContentOrig) => {
            let tablePart = extractedTables[key];
            return `<TabsContent value="${key}" className="mt-0">
  <div className="pb-6 pt-2">
    ${tablePart}
  </div>
</TabsContent>`;
        });
    }

    return result;
}

let newHTML = transformModuleTabs(content);

// For User Requests, the specific search part sometimes looks slightly different.
// The regex `px-6 py-4 flex items-center gap-4` must match exactly.
fs.writeFileSync('src/app/pages/modules/DataAccessRequests1.tsx', newHTML, 'utf8');
console.log('Transformation complete!');
