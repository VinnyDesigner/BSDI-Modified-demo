const fs = require('fs');

let lines = fs.readFileSync('src/app/pages/modules/DataAccessRequests1.tsx','utf8').split('\n');

// We already removed 11 lines previously (lines 1321 to 1331).
// So what was line 1445 originally is now line 1434. Let's just find the exact line indices!
const content = lines.join('\n');

const brokenCompleted = `                  </AccordionContent>
                </AccordionItem>
                
                {/* Organization Completed Accordion (Reused in Department Tab) */}
                <AccordionItem 
                  value="dept-completed"
                  className={\`border border-[#B0AAA2]/20 rounded-xl overflow-hidden transition-all duration-300 \${openAccordion === 'dept-completed' ? 'bg-[#EAF5EE]' : 'bg-white'}\`}
                >
                  <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-[#10B981] rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                      <span className="font-medium text-[#111827] text-sm">Completed</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-0 pb-0">`;

const fixedCompleted = `                  </div>
                </TabsContent>

                {/* Organization Completed Accordion (Reused in Department Tab) */}
                <TabsContent value="dept-completed" className="mt-0">
                  <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">`;

let newContent = content.replace(brokenCompleted, fixedCompleted);

const brokenEnd = `                  </AccordionContent>
                </AccordionItem>

              </Accordion>
            </TabsContent>`;

const fixedEnd = `                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>`;

// Apply to the first occurrence which is in Department tab
newContent = newContent.replace(brokenEnd, fixedEnd);

fs.writeFileSync('src/app/pages/modules/DataAccessRequests1.tsx', newContent, 'utf8');
console.log('Fixed file via Javascript');
