const fs = require('fs');

let html = fs.readFileSync('src/app/pages/modules/DataAccessRequests1.tsx', 'utf8');

// Fix 1
const brokenPending = `                <TabsContent value=\"dept-pending\" className=\"mt-0\">
                  <div className=\"bg-white border border-[#E5E7EB] rounded-xl overflow-hidden\">

                  value=\"dept-pending\"
                  className={\`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 \${openAccordion === 'dept-pending' ? 'bg-[#FEF2F2]' : 'bg-white'}\`}
                >
                  <AccordionTrigger className=\"px-6 py-4 hover:no-underline transition-colors hover:bg-black/5\">
                    <div className=\"flex items-center gap-3\">
                      <div className=\"w-2 h-2 bg-[#EF4444] rounded-full shadow-[0_0_8px_rgba(239,68,68,0.5)]\"></div>
                      <span className=\"font-medium text-[#111827] text-sm\">Pending</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className=\"px-0 pb-0\">`;

const fixedPending = `                <TabsContent value="dept-pending" className="mt-0">
                  <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">`;

html = html.replace(brokenPending, fixedPending);


// Fix 2
const brokenCompleted = `                    </AccordionContent>
                  </AccordionItem>
                  
                  {/* Organization Completed Accordion (Reused in Department Tab) */}
                  <AccordionItem 
                    value=\"dept-completed\"
                    className={\`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 \${openAccordion === 'dept-completed' ? 'bg-[#EAF5EE]' : 'bg-white'}\`}
                  >
                    <AccordionTrigger className=\"px-6 py-4 hover:no-underline transition-colors hover:bg-black/5\">
                      <div className=\"flex items-center gap-3\">
                        <div className=\"w-2 h-2 bg-[#10B981] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]\"></div>
                        <span className=\"font-medium text-[#111827] text-sm\">Completed</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className=\"px-0 pb-0\">`;

const fixedCompleted = `                  </div>
                </TabsContent>

                {/* Organization Completed Accordion (Reused in Department Tab) */}
                <TabsContent value="dept-completed" className="mt-0">
                  <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">`;

html = html.replace(brokenCompleted, fixedCompleted);


// Fix 3
const brokenEnd = `                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </TabsContent>

            {/* User Request Tab */}`;

const fixedEnd = `                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* User Request Tab */}`;

html = html.replace(brokenEnd, fixedEnd);

fs.writeFileSync('src/app/pages/modules/DataAccessRequests1.tsx', html, 'utf8');
console.log("Fixed department tab manually");
