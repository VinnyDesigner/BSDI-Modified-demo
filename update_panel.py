import re

with open('d:/Projects/BSDI/BSDI-Modified-demo/src/app/pages/modules/Departments.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = r'      \{\/\* Users Sheet \*\/}.*?<\/Sheet>'
replacement = """      {/* Users Sheet */}
      <Sheet open={usersSheetOpen} onOpenChange={setUsersSheetOpen}>
        <SheetContent side="right" className="w-full sm:max-w-[380px] overflow-hidden bg-[#FFFFFF] border-l border-[#E5E7EB] shadow-[0_8px_24px_rgba(0,0,0,0.08)] !p-0 flex flex-col [&>button]:hidden">
          <div 
            className="absolute top-[16px] right-[16px] w-[32px] h-[32px] rounded-[8px] bg-[#F3F4F6] hover:bg-[#E5E7EB] flex items-center justify-center cursor-pointer transition-colors z-50 group"
            onClick={() => setUsersSheetOpen(false)}
          >
            <X className="w-[18px] h-[18px] text-[#9CA3AF] group-hover:text-[#111827] transition-colors" />
          </div>
          
          <SheetHeader className="p-[16px] pb-[16px] sticky top-0 z-20 bg-[#FFFFFF] border-b border-[#F1F5F9] shrink-0">
            <SheetTitle className="text-[16px] font-semibold text-[#EF4444]">
              {selectedDeptForSheet?.name}
            </SheetTitle>
            <SheetDescription className="text-[13px] md:text-[14px] text-[#6B7280] mt-[4px] font-normal">
              {selectedDeptForSheet?.org} • {selectedDeptForSheet?.users || 0} Members
            </SheetDescription>
          </SheetHeader>
          
          <div className="flex-1 overflow-y-auto px-[16px] py-[16px] bg-[#FFFFFF] custom-scrollbar">
            {selectedDeptForSheet && departmentUsers[selectedDeptForSheet.id] ? (
              <div className="flex flex-col gap-[10px]">
                {departmentUsers[selectedDeptForSheet.id].map((user) => (
                  <div key={user.id} className="bg-[#FFFFFF] border border-[#F1F5F9] rounded-[12px] p-[12px_14px] flex items-center justify-between transition-all hover:border-[#E5E7EB] hover:bg-[#F9FAFB] hover:shadow-sm h-[64px]">
                    <div className="flex items-center gap-[12px] flex-1 min-w-0">
                      <div className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] rounded-full bg-[#FEE2E2] flex items-center justify-center font-semibold text-[#EF4444] text-[14px] shrink-0">
                        {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-medium text-[#111827] text-[14px] leading-tight truncate">{user.name}</h4>
                        <div className="text-[12px] md:text-[13px] text-[#6B7280] mt-[2px] truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 ml-[8px] flex items-center justify-end">
                      <span className="bg-[#EEF2FF] text-[#4F46E5] text-[11px] md:text-[12px] font-medium px-[10px] py-[4px] rounded-[999px] whitespace-nowrap inline-flex items-center justify-center uppercase tracking-[0.02em]">
                        {user.role}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-[#F9FAFB] rounded-[24px] border border-dashed border-[#D1D5DB]">
                <Users className="w-12 h-12 text-[#9CA3AF] mx-auto mb-4 opacity-50" />
                <p className="text-[#6B7280] font-medium">No Members Found</p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>"""

new_content = re.sub(target, replacement, content, flags=re.DOTALL)

if new_content == content:
    print('No changes made. Pattern not found!')
else:
    with open('d:/Projects/BSDI/BSDI-Modified-demo/src/app/pages/modules/Departments.tsx', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('Successfully applied edits.')
