import re

with open(r'src\app\pages\modules\DataAccessRequests1.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# ============================================================
# Fix Department tab - remove orphaned AccordionItem/Trigger/Content tags
# ============================================================

# Remove the orphaned AccordionItem opening + AccordionTrigger for dept-pending
content = content.replace(
    "\n                \n                   value=\"dept-pending\"\n                   className={`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 ${openAccordion === 'dept-pending' ? 'bg-[#FEF2F2]' : 'bg-white'}`}\n                 >\n                   <AccordionTrigger className=\"px-6 py-4 hover:no-underline transition-colors hover:bg-black/5\">\n                     <div className=\"flex items-center gap-3\">\n                       <div className=\"w-2 h-2 bg-[#EF4444] rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]\"></div>\n                       <span className=\"font-medium text-[#111827] text-sm\">Pending</span>\n                     </div>\n                   </AccordionTrigger>\n                   <AccordionContent className=\"px-0 pb-0\">",
    ""
)

print("Dept pending trigger removed")

# Now convert all remaining tabs systematically using a generic approach

def convert_accordion_section(content, tab_value, accordion_items):
    """
    Given the TabsContent value and list of accordion items,
    replace the Accordion wrapper + AccordionItems with secondary Tabs
    accordion_items: list of dicts with keys: value, name, color, text_color
    """
    
    # Build tabs header
    tabs_triggers = ""
    for item in accordion_items:
        tabs_triggers += f"""                    <TabsTrigger value="{item['value']}" className="relative px-5 py-2.5 text-sm font-medium text-[#6B7280] bg-transparent border-0 rounded-none data-[state=active]:{item['text_color']} data-[state=active]:shadow-none data-[state=active]:bg-transparent after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-{item['color']} after:opacity-0 data-[state=active]:after:opacity-100">
                      <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-{item['color']}"></span>{item['name']}</span>
                    </TabsTrigger>
"""
    
    tabs_header = f"""              <Tabs defaultValue="{accordion_items[0]['value']}">
                {{/* Secondary line tabs */}}
                <div className="border-b border-[#E5E7EB] mb-4">
                  <TabsList className="bg-transparent h-auto p-0 gap-0">
{tabs_triggers}                  </TabsList>
                </div>
"""
    return tabs_header

print("Helper defined")
print("Content length:", len(content))

with open(r'src\app\pages\modules\DataAccessRequests1.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Saved")
