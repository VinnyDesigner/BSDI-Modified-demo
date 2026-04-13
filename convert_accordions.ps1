$filePath = "src\app\pages\modules\DataAccessRequests1.tsx"
$content = [System.IO.File]::ReadAllText($filePath)

# ================================================================
# STEP 1: Clean up the Department tab - fix the orphaned AccordionItem/AccordionTrigger junk left after the wrapper replacement
# ================================================================

# Remove the orphaned AccordionItem/AccordionTrigger content that's still in Department pending section
$content = $content -replace '(?s)                   value="dept-pending"\r?\n                   className=\{`border border-\[#B0AAA2\]/20 rounded-xl overflow-hidden transition-all duration-300 \$\{openAccordion === ''dept-pending'' \? ''bg-\[#FEF2F2\]'' : ''bg-white''\}`\}\r?\n                 >\r?\n                   <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">\r?\n                     <div className="flex items-center gap-3">\r?\n                       <div className="w-2 h-2 bg-\[#EF4444\] rounded-full shadow-\[0_0_8px_rgba\(239,68,68,0\.5\)\]"></div>\r?\n                       <span className="font-medium text-\[#111827\] text-sm">Pending</span>\r?\n                     </div>\r?\n                   </AccordionTrigger>\r?\n                   <AccordionContent className="px-0 pb-0">\r?\n', ''

Write-Host "Step 1 done"

# ================================================================
# STEP 2: Fix the Department pending closing - AccordionContent/AccordionItem -> div/TabsContent, and transition to completed
# ================================================================

# Replace AccordionContent closing + AccordionItem closing (dept-pending) + AccordionItem opening (dept-completed) with TabsContent + TabsContent
$content = $content -replace '(?s)                   </AccordionContent>\r?\n                 </AccordionItem>\r?\n                 \r?\n                 \{/\* Organization Completed Accordion \(Reused in Department Tab\) \*/\}\r?\n                 <AccordionItem \r?\n                   value="dept-completed"\r?\n                   className=\{`border border-\[#B0AAA2\]/20 rounded-xl overflow-hidden transition-all duration-300 \$\{openAccordion === ''dept-completed'' \? ''bg-\[#EAF5EE\]'' : ''bg-white''\}`\}\r?\n                 >\r?\n                   <AccordionTrigger className="px-6 py-4 hover:no-underline transition-colors hover:bg-black/5">\r?\n                     <div className="flex items-center gap-3">\r?\n                       <div className="w-2 h-2 bg-\[#10B981\] rounded-full shadow-\[0_0_8px_rgba\(16,185,129,0\.5\)\]"></div>\r?\n                       <span className="font-medium text-\[#111827\] text-sm">Completed</span>\r?\n                     </div>\r?\n                   </AccordionTrigger>\r?\n                   <AccordionContent className="px-0 pb-0">',
'                  </div>
                </TabsContent>
                <TabsContent value="dept-completed" className="mt-0">
                  <div className="bg-white border border-[#E5E7EB] rounded-xl overflow-hidden">'

Write-Host "Step 2 done"

# Replace department tab Accordion closing 
$content = $content -replace '(?s)                   </AccordionContent>\r?\n                 </AccordionItem>\r?\n\r?\n               </Accordion>\r?\n             </TabsContent>\r?\n\r?\n             \{/\* User Request Tab \*/\}',
'                  </div>
                </TabsContent>
              </Tabs>
            </TabsContent>

            {/* User Request Tab */'

Write-Host "Step 3 done - Department tab converted"

[System.IO.File]::WriteAllText($filePath, $content)
Write-Host "File saved"
