const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/app/pages/modules/DataAccessRequests1.tsx');
let content = fs.readFileSync(file, 'utf8');

// ─── 1. Add new state variables after expandedGroupRow ───────────────────────
const stateTarget = `  const [expandedGroupRow, setExpandedGroupRow] = useState<string | null>(null);`;
const stateReplacement = `  const [expandedGroupRow, setExpandedGroupRow] = useState<string | null>(null);
  const [fileViewerOpen, setFileViewerOpen] = useState<{open: boolean; fileName: string; fileSize: string}>({open: false, fileName: '', fileSize: ''});
  const [rolesPopover, setRolesPopover] = useState<{open: boolean; roles: string[]; anchor: string}>({open: false, roles: [], anchor: ''});`;

if (content.includes(stateTarget)) {
  content = content.replace(stateTarget, stateReplacement);
  console.log('✅ State variables added');
} else {
  console.log('❌ State target not found');
}

// ─── 2. Fix the Uploaded File button onClick ─────────────────────────────────
const fileButtonTarget = `                                            className="flex items-center gap-2 px-3 py-1.5 bg-[#F5F6F8] hover:bg-[#E5E7EB] rounded-lg border border-[#E5E7EB] text-[12px] font-medium text-[#374151] transition-colors"
                                            onClick={() => {}}`;
const fileButtonReplacement = `                                            className="flex items-center gap-2 px-3 py-1.5 bg-[#F5F6F8] hover:bg-[#E5E7EB] rounded-lg border border-[#E5E7EB] text-[12px] font-medium text-[#374151] transition-colors"
                                            onClick={() => setFileViewerOpen({open: true, fileName: group.fileName, fileSize: group.fileSize})}`;
if (content.includes(fileButtonTarget)) {
  content = content.replace(fileButtonTarget, fileButtonReplacement);
  console.log('✅ File button onClick updated');
} else {
  console.log('❌ File button target not found');
}

// ─── 3. Fix alignment + roles popover in member rows ─────────────────────────
const memberRowTarget = `                                                   return (
                                                     <tr key={idx}>
                                                       <td>
                                                         <div className="flex items-center gap-2.5">
                                                           <div className="w-7 h-7 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#DC2626] text-[11px] font-bold shrink-0">
                                                             {member.name.charAt(0)}
                                                           </div>
                                                           <span className="font-medium text-[#111827] whitespace-nowrap">{member.name}</span>
                                                         </div>
                                                       </td>
                                                       <td className="text-[#6B7280]">{member.email}</td>
                                                       <td>
                                                         <div className="flex items-center gap-1.5 flex-wrap">
                                                           <span className="role-chip bg-[#EFF6FF] text-[#3B82F6] border border-[#BFDBFE]">{primaryRole}</span>
                                                           {extraCount > 0 && (
                                                             <span className="role-chip bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB]">+{extraCount} more</span>
                                                           )}
                                                         </div>
                                                       </td>
                                                       <td className="text-[#374151] whitespace-nowrap">{member.organization}</td>
                                                       <td className="text-[#374151] whitespace-nowrap">{member.department}</td>
                                                     </tr>
                                                   );`;

const memberRowReplacement = `                                                   return (
                                                     <tr key={idx}>
                                                       <td style={{textAlign:'left',verticalAlign:'middle'}}>
                                                         <div className="name-cell">
                                                           <div className="w-7 h-7 rounded-full bg-[#FEE2E2] flex items-center justify-center text-[#DC2626] text-[11px] font-bold shrink-0">
                                                             {member.name.charAt(0)}
                                                           </div>
                                                           <span className="font-medium text-[#111827] whitespace-nowrap">{member.name}</span>
                                                         </div>
                                                       </td>
                                                       <td className="text-[#6B7280]" style={{textAlign:'left',verticalAlign:'middle'}}>{member.email}</td>
                                                       <td style={{textAlign:'left',verticalAlign:'middle'}}>
                                                         <div className="flex items-center justify-start gap-1.5 flex-wrap">
                                                           <span className="role-chip bg-[#EFF6FF] text-[#3B82F6] border border-[#BFDBFE]">{primaryRole}</span>
                                                           {extraCount > 0 && (
                                                             <button
                                                               className="role-chip bg-[#F3F4F6] text-[#6B7280] border border-[#E5E7EB] cursor-pointer hover:bg-[#E5E7EB] transition-colors"
                                                               onClick={() => setRolesPopover({open: true, roles: roles, anchor: \`\${group.id}-\${idx}\`})}
                                                             >+{extraCount} more</button>
                                                           )}
                                                         </div>
                                                       </td>
                                                       <td className="text-[#374151] whitespace-nowrap" style={{textAlign:'left',verticalAlign:'middle'}}>{member.organization}</td>
                                                       <td className="text-[#374151] whitespace-nowrap" style={{textAlign:'left',verticalAlign:'middle'}}>{member.department}</td>
                                                     </tr>
                                                   );`;

if (content.includes(memberRowTarget)) {
  content = content.replace(memberRowTarget, memberRowReplacement);
  console.log('✅ Member row JSX updated (alignment + roles popover)');
} else {
  console.log('❌ Member row target not found');
}

// ─── 4. Add Document Viewer Dialog + Roles Popover before closing return ──────
// Find the final closing of the User Request TabsContent and insert dialogs after it
const dialogInsertTarget = `            </TabsContent>



`;
const dialogInsertReplacement = `            </TabsContent>

            {/* ─── Document Viewer Dialog ─── */}
            <Dialog open={fileViewerOpen.open} onOpenChange={(o) => setFileViewerOpen({...fileViewerOpen, open: o})}>
              <DialogContent className="p-0 overflow-hidden" style={{maxWidth:'520px', height:'500px', borderRadius:'16px', display:'flex', flexDirection:'column'}}>
                {/* Header */}
                <DialogHeader className="px-6 py-4 border-b border-[#F0F0F0] flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#EFF6FF] flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#3B82F6]" />
                    </div>
                    <div>
                      <DialogTitle className="text-[15px] font-semibold text-[#111827]">Document Viewer</DialogTitle>
                      <DialogDescription className="text-[12px] text-[#6B7280] mt-0.5">{fileViewerOpen.fileName}</DialogDescription>
                    </div>
                  </div>
                </DialogHeader>
                {/* Body */}
                <div className="flex-1 overflow-auto bg-[#F9FAFB] flex items-center justify-center p-6">
                  <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-10 flex flex-col items-center gap-4 w-full max-w-[340px]">
                    <div className="w-16 h-16 rounded-full bg-[#EFF6FF] flex items-center justify-center">
                      <FileText className="w-8 h-8 text-[#3B82F6]" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-[15px] text-[#111827]">PDF Document</p>
                      <p className="text-[13px] text-[#6B7280] mt-1">{fileViewerOpen.fileName}</p>
                      <p className="text-[12px] text-[#9CA3AF] mt-1">Preview would be displayed here</p>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button className="flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white rounded-lg text-[13px] font-medium hover:bg-[#2563EB] transition-colors">
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* ─── Roles Popover Dialog ─── */}
            <Dialog open={rolesPopover.open} onOpenChange={(o) => setRolesPopover({...rolesPopover, open: o})}>
              <DialogContent className="p-0 overflow-hidden" style={{maxWidth:'340px', borderRadius:'14px'}}>
                <DialogHeader className="px-5 py-4 border-b border-[#F0F0F0]">
                  <DialogTitle className="text-[14px] font-semibold text-[#111827]">All Roles</DialogTitle>
                  <DialogDescription className="text-[12px] text-[#6B7280]">Assigned roles for this user</DialogDescription>
                </DialogHeader>
                <div className="px-5 py-4 flex flex-wrap gap-2">
                  {rolesPopover.roles.map((role, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#EFF6FF] text-[#3B82F6] border border-[#BFDBFE] rounded-full text-[12px] font-medium">{role}</span>
                  ))}
                </div>
              </DialogContent>
            </Dialog>

`;

// Count occurrences to find the last one (after User Request TabsContent)
const count = (content.match(/            <\/TabsContent>\n\n\n\n/g) || []).length;
if (count > 0) {
  // Replace only the last occurrence
  const lastIdx = content.lastIndexOf(dialogInsertTarget);
  if (lastIdx !== -1) {
    content = content.substring(0, lastIdx) + dialogInsertReplacement + content.substring(lastIdx + dialogInsertTarget.length);
    console.log('✅ Dialogs injected after User Request TabsContent');
  } else {
    console.log('❌ Dialog insert target not found (lastIndexOf)');
  }
} else {
  console.log('❌ Dialog insert target not found');
}

fs.writeFileSync(file, content, 'utf8');
console.log('✅ File saved.');
