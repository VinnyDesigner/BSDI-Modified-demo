import re

file_path = r'd:\Projects\BSDI\BSDI-Modified-demo\src\app\pages\modules\DataAccessRequests.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find the filteredDeptCompleted map block
# We look for the start of the map and the end of its block
pattern = r'\{\s*filteredDeptCompleted\.map\(\(request, index\) => \(\s*<div key=\{request\.id\}.*?\{/\* Comment Bar \*/\}.*?\)\)\}'

replacement = """{filteredDeptCompleted.map((request) => (
                          <div key={request.id} className="request-table-row cursor-default">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                              <span className="font-medium text-[14px]">{request.id}</span>
                            </div>

                            <div className="flex flex-col justify-center">
                              <span className="font-medium text-[#111827] text-[14px]">{request.departmentNameEn}</span>
                              <span className="text-[11px] text-[#6B7280] leading-none mt-0.5" dir="rtl">{request.departmentNameAr}</span>
                            </div>

                            <div>
                              <Badge className="bg-[#10B981]/10 text-[#10B981] border-0 font-medium px-3 py-1 rounded-lg w-fit text-[10px] uppercase tracking-wider">
                                {request.type}
                              </Badge>
                            </div>

                            <div>
                              <span className="font-medium text-[#111827] text-[14px]">{request.organization}</span>
                            </div>

                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-[#10B981]/10 flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-[#10B981] border border-white shadow-sm">
                                F
                              </div>
                              <span className="font-medium text-[#111827] text-[14px]">Fatima Al-Mansoori</span>
                            </div>

                            <div className="flex items-center gap-2 text-[#4B5563]">
                              <Calendar className="w-3.5 h-3.5 flex-shrink-0 text-[#6B7280]" />
                              <span className="font-medium text-[14px]">10 Mar 2025</span>
                            </div>

                            <div className="truncate">
                              <p className="text-[13px] font-normal text-[#4B5563] truncate" title="All requirements met and validated">
                                All requirements met and validated
                              </p>
                            </div>

                            <div className="flex items-center justify-center">
                              <Badge className="bg-[#10B981]/10 text-[#10B981] border-0 font-medium px-3 py-1 rounded-lg uppercase text-[10px] tracking-wider">
                                Approved
                              </Badge>
                            </div>
                          </div>
                        ))}"""

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

if new_content != content:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully updated the file.")
else:
    print("Pattern not found.")
