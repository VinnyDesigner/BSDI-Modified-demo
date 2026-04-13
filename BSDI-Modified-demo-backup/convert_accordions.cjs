const fs = require('fs');

let html = fs.readFileSync('src/app/pages/modules/DataAccessRequests1.tsx', 'utf-8');

// Replace all occurrences of an <Accordion> ... </Accordion> block
html = html.replace(/<Accordion\b[\s\S]*?<\/Accordion>/g, (accContent) => {
    
    // Within this accordion, extract all items
    const items = [];
    
    // We can use a regex to match each <AccordionItem ...>...</AccordionItem>
    // However, finding </AccordionItem> is safe since Accordions here are not nested.
    const itemRegex = /<AccordionItem\b([\s\S]*?)<\/AccordionItem>/g;
    
    let itemMatch;
    while ((itemMatch = itemRegex.exec(accContent)) !== null) {
        const itemStr = itemMatch[0];
        
        // Extract value
        const valMatch = itemStr.match(/\bvalue=(?:\"|'|{`|{')([^\"'}]+)/);
        let value = valMatch ? valMatch[1] : '';
        // sometimes value is in `{userMapOpenAccordion === 'something'}` but there is an explicit value prop: value="some-val" or value={"some-val"}. Let's assume standard value="something"
        // Let's refine value matching
        const exactValMatch = itemStr.match(/\bvalue=["']([^"']+)["']/);
        if (exactValMatch) {
            value = exactValMatch[1];
        }
        
        // Extract color and title from inside <AccordionTrigger>
        const triggerMatch = itemStr.match(/<AccordionTrigger\b[\s\S]*?<\/AccordionTrigger>/);
        let color = '#000000';
        let title = '';
        if (triggerMatch) {
            const trStr = triggerMatch[0];
            const colorMatch = trStr.match(/bg-\[([^\]]+)\]/);
            if (colorMatch) color = colorMatch[1];
            
            const titleMatch = trStr.match(/<span[^>]*>([\s\S]*?)<\/span>/);
            if (titleMatch) title = titleMatch[1].trim();
        }
        
        // Extract content from inside <AccordionContent>
        const contentMatch = itemStr.match(/<AccordionContent[^>]*>([\s\S]*?)<\/AccordionContent>/);
        let contentContent = contentMatch ? contentMatch[1] : '';
        
        items.push({ value, title, color, contentContent });
    }
    
    if (items.length > 0) {
        let defaultVal = items[0].value;
        let tabsHeader = '';
        
        // According to user: "if only one, keep tabs line". Let's always render the tabs header if there are tabs
        tabsHeader = items.map(item => {
            return `                    <TabsTrigger value="${item.value}" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:text-[${item.color}] data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[${item.color}] after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[${item.color}]"></span>${item.title}</span>
                    </TabsTrigger>`;
        }).join("\n");
        
        let tabsBody = items.map(item => {
            return `                <TabsContent value="${item.value}" className="mt-0">
                  <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">
${item.contentContent}
                  </div>
                </TabsContent>`;
        }).join("\n\n");
        
        return `<Tabs defaultValue="${defaultVal}">
                {/* Secondary line tabs */}
                <div className="border-b border-[#E5E7EB] mb-4">
                  <TabsList className="bg-transparent h-auto p-0 gap-0">
${tabsHeader}
                  </TabsList>
                </div>
                
${tabsBody}
              </Tabs>`;
    }
    
    return accContent; // fallback
});

fs.writeFileSync('src/app/pages/modules/DataAccessRequests1.tsx', html, 'utf-8');
console.log("Successfully converted accordions.");
