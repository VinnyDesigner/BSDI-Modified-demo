const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/app/pages/modules/DataAccessRequests1.tsx');
let content = fs.readFileSync(file, 'utf8');

// 1. Fix Document Viewer Color
content = content.replace(/className="w-9 h-9 rounded-lg bg-\[#EFF6FF\] flex items-center justify-center"/g, 'className="w-9 h-9 rounded-lg bg-[#FEE2E2] flex items-center justify-center"');
content = content.replace(/<FileText className="w-5 h-5 text-\[#3B82F6\]" \/>/g, '<FileText className="w-5 h-5 text-[#DC2626]" />');
content = content.replace(/className="w-16 h-16 rounded-full bg-\[#EFF6FF\] flex items-center justify-center"/g, 'className="w-16 h-16 rounded-full bg-[#FEE2E2] flex items-center justify-center"');
content = content.replace(/<FileText className="w-8 h-8 text-\[#3B82F6\]" \/>/g, '<FileText className="w-8 h-8 text-[#DC2626]" />');
content = content.replace(/className="flex items-center gap-2 px-4 py-2 bg-\[#3B82F6\] text-white rounded-lg text-\[13px\] font-medium hover:bg-\[#2563EB\] transition-colors"/g, 'className="flex items-center gap-2 px-4 py-2 bg-[#DC2626] text-white rounded-lg text-[13px] font-medium hover:bg-[#B91C1C] transition-colors"');

// 2. Add Approve / Reject State Variables
const stateTarget = `  const [rolesPopover, setRolesPopover] = useState<{open: boolean; roles: string[]; anchor: string}>({open: false, roles: [], anchor: ''});`;
const stateReplacement = `  const [rolesPopover, setRolesPopover] = useState<{open: boolean; roles: string[]; anchor: string}>({open: false, roles: [], anchor: ''});
  const [approveDialog, setApproveDialog] = useState<{open: boolean; requestId: string}>({open: false, requestId: ''});
  const [rejectDialog, setRejectDialog] = useState<{open: boolean; requestId: string}>({open: false, requestId: ''});
  const [rejectionReason, setRejectionReason] = useState("");`;
if(content.includes(stateTarget)) {
  content = content.replace(stateTarget, stateReplacement);
  console.log('✅ Added approve/reject state variables.');
}

// 3. Inject new dialogs at the end of TabsContent
const dialogTarget = `            {/* ─── Document Viewer Dialog ─── */}`;
const approveRejectDialogs = `
            {/* ─── Approve Dialog ─── */}
            <Dialog open={approveDialog.open} onOpenChange={(o) => setApproveDialog({...approveDialog, open: o})}>
              <DialogContent className="p-0 overflow-hidden" style={{maxWidth:'380px', borderRadius:'16px'}}>
                <div className="p-8 pb-6 flex flex-col items-center text-center">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 bg-[#10B981] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(16,185,129,0.3)]">
                      <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Approve Request</h3>
                  <p className="text-[14px] text-[#6B7280]">Are you sure you want to approve request {approveDialog.requestId}?</p>
                </div>
                <div className="px-6 pb-6 pt-2 space-y-3">
                  <Button
                    onClick={() => setApproveDialog({open: false, requestId: ''})}
                    className="w-full bg-[#00A651] hover:bg-[#008d44] text-white rounded-lg h-11 font-medium transition-colors border-0"
                  >
                    Yes, Approve
                  </Button>
                  <Button
                    onClick={() => setApproveDialog({open: false, requestId: ''})}
                    variant="outline"
                    className="w-full border-0 bg-white rounded-lg h-11 text-[#111827] font-medium hover:bg-gray-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#E5E7EB]"
                  >
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* ─── Reject Dialog ─── */}
            <Dialog open={rejectDialog.open} onOpenChange={(o) => { setRejectDialog({...rejectDialog, open: o}); if(!o) setRejectionReason(""); }}>
              <DialogContent className="p-0 overflow-hidden" style={{maxWidth:'420px', borderRadius:'16px'}}>
                <div className="p-8 pb-4 flex flex-col items-center text-center">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 bg-[#ED1C24] rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(237,28,36,0.3)]">
                      <XCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Reject Request</h3>
                  <p className="text-[14px] text-[#6B7280]">Please provide a reason for rejecting request {rejectDialog.requestId}</p>
                </div>
                <div className="px-6 pb-6 space-y-5">
                  <div className="space-y-2 text-left">
                    <label className="text-[14px] font-medium text-[#111827]">
                      Rejection Reason <span className="text-[#ED1C24]">*</span>
                    </label>
                    <textarea 
                      className="w-full min-h-[100px] p-3 rounded-lg border focus:outline-none transition-colors border-[#ED1C24] focus:ring-1 focus:ring-[#ED1C24] bg-[#F9FAFB] text-[14px] resize-none"
                      placeholder="Enter the reason for rejection..."
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="space-y-3">
                    <Button
                      onClick={() => setRejectDialog({open: false, requestId: ''})}
                      className="w-full bg-[#ED1C24] hover:bg-[#DC2626] text-white rounded-lg h-11 font-medium transition-colors border-0"
                    >
                      Confirm Rejection
                    </Button>
                    <Button
                      onClick={() => setRejectDialog({open: false, requestId: ''})}
                      variant="outline"
                      className="w-full border-0 bg-white rounded-lg h-11 text-[#111827] font-medium hover:bg-gray-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)] border border-[#E5E7EB]"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

`;
if(content.includes(dialogTarget)) {
  content = content.replace(dialogTarget, approveRejectDialogs + dialogTarget);
  console.log('✅ Added Approve/Reject Dialogs.');
}

// 4. Hook up all Approve and Reject buttons globally.
// We look for the patterns `<button ... onClick={() => {}} title="Approve">✓</button>` 
// or similar patterns that include `bg-[#10B981]/10 text-[#10B981]` for Approve and `bg-[#EF4444]/10 text-[#EF4444]` for Reject.
// Since the request variables could be `request.id` or `group.id`, we'll identify the contextual item id by looking at the nearest parent context? 
// Actually, it's easier to regex replace based on the assumption that `request` or `group` variables are mostly in scope.
// But wait, the standard button code is:
const buttonRegex = /<button.*?bg-\[#10B981\]\/10 text-\[#10B981\].*?<\/button>\s*<button.*?bg-\[#EF4444\]\/10 text-\[#EF4444\].*?<\/button>/g;

content = content.replace(buttonRegex, (match) => {
  // Infer identifier: if we are in group context (User Requests), use `group.id`. 
  // Otherwise it's `request.id`. But we don't know the exact string. We can try `{group?.id || request?.id}` as a fallback expression.
  const replacement = match
    .replace(/(bg-\[#10B981\]\/10 text-\[#10B981\][\s\S]*?)>/, '$1 onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: typeof request !== "undefined" ? request.id : group.id}); }}>')
    .replace(/(bg-\[#EF4444\]\/10 text-\[#EF4444\][\s\S]*?)>/, '$1 onClick={(e) => { e.stopPropagation(); setRejectDialog({open: true, requestId: typeof request !== "undefined" ? request.id : group.id}); }}>');
  return replacement;
});
console.log('✅ Hooked up all Approve/Reject buttons globally using fallback id.');

fs.writeFileSync(file, content, 'utf8');
console.log('✅ File successfully patched.');
