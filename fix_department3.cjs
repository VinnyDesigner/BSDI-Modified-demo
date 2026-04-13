const fs = require('fs');

let html = fs.readFileSync('src/app/pages/modules/DataAccessRequests1.tsx', 'utf8');

// Fix 2: Replace the end of dept-pending and start of dept-completed
html = html.replace(/<\/AccordionContent>\s*<\/AccordionItem>\s*\{\/\* Organization Completed Accordion \(Reused in Department Tab\) \*\/\}\s*<AccordionItem\s*value="dept-completed"[\s\S]*?<AccordionContent[^>]*>/,
`                  </div>
                </TabsContent>

                {/* Organization Completed Accordion (Reused in Department Tab) */}
                <TabsContent value="dept-completed" className="mt-0">
                  <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">`);

// Fix 3: Replace the end of dept-completed and end of Department Tab
html = html.replace(/<\/AccordionContent>\s*<\/AccordionItem>\s*<\/Accordion>\s*<\/TabsContent>/,
`                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>`);

fs.writeFileSync('src/app/pages/modules/DataAccessRequests1.tsx', html, 'utf8');
console.log('Fixed file via Javascript with RegExp');
