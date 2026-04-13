const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src/app/pages/modules/DataAccessRequests1.tsx');
let c = fs.readFileSync(file, 'utf8');

// The request is to apply specific styles for all popups. Let's fix Approve, Reject, and Document Viewer dialogs.
// Max Width -> 480px-600px. I will use 480px.
// Buttons -> Primary #EF4444, height 36px, border-radius 10px, padding 0 16px. Secondary #FFFFFF border E5E7EB text #374151.
// They also attached an Approve Request screenshot with Green. So Approve gets Green but same dimensions.
// Dialogs should have a close 'X' button at the top right.

const approveStart = c.indexOf('{/* ─── Approve Dialog ─── */}');
const documentViewerStart = c.indexOf('{/* ─── Document Viewer Dialog ─── */}');

if (approveStart > -1 && documentViewerStart > -1) {
  let sub = c.substring(approveStart, documentViewerStart);
  
  // Apply 480px maxWidth
  sub = sub.replace(/maxWidth:'380px'/g, "maxWidth:'480px'");
  sub = sub.replace(/maxWidth:'420px'/g, "maxWidth:'480px'");
  
  // Add X to Approve Dialog
  sub = sub.replace(
    /<div className="p-8 pb-6 flex flex-col items-center text-center">/g, 
    '<div className="absolute right-4 top-4 text-[#6B7280] hover:bg-gray-100 p-1.5 rounded-full cursor-pointer transition-colors z-10" onClick={() => setApproveDialog({open: false, requestId: ""})}><X className="w-5 h-5" /></div>\n                <div className="p-8 pb-6 flex flex-col items-center text-center relative">'
  );

  // Add X to Reject Dialog
  sub = sub.replace(
    /<div className="p-8 pb-4 flex flex-col items-center text-center">/g, 
    '<div className="absolute right-4 top-4 text-[#6B7280] hover:bg-gray-100 p-1.5 rounded-full cursor-pointer transition-colors z-10" onClick={() => { setRejectDialog({open: false, requestId: ""}); setRejectionReason(""); }}><X className="w-5 h-5" /></div>\n                <div className="p-8 pb-4 flex flex-col items-center text-center relative">'
  );

  // Button sizes and colors (Approve)
  sub = sub.replace(
    /className="w-full bg-\[#00A651\] hover:bg-\[#008d44\] text-white rounded-lg h-11 font-medium transition-colors border-0"/g, 
    'className="w-full bg-[#10B981] hover:bg-[#059669] text-white rounded-[10px] h-[36px] px-4 font-medium transition-colors border-0"'
  );

  // Button sizes and colors (Reject)
  sub = sub.replace(
    /className="w-full bg-\[#ED1C24\] hover:bg-\[#DC2626\] text-white rounded-lg h-11 font-medium transition-colors border-0/g, 
    'className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white rounded-[10px] h-[36px] px-4 font-medium transition-colors border-0'
  );

  // Secondary Button sizes
  sub = sub.replace(
    /className="w-full border-0 bg-white rounded-lg h-11 text-\[#111827\] font-medium hover:bg-gray-50 shadow-\[0_1px_2px_rgba\(0,0,0,0.05\)\] border border-\[#E5E7EB\]"/g, 
    'className="w-full bg-[#FFFFFF] border border-[#E5E7EB] text-[#374151] rounded-[10px] h-[36px] px-4 font-medium hover:bg-gray-50 transition-colors shadow-sm"'
  );

  c = c.substring(0, approveStart) + sub + c.substring(documentViewerStart);
}

// Now replace Document Viewer styles
const documentViewerEnd = c.indexOf('{/* ─── Roles Popover Dialog ─── */}');
if (documentViewerStart > -1 && documentViewerEnd > -1) {
  let docSub = c.substring(documentViewerStart, documentViewerEnd);
  
  // Make sure to add X into DialogHeader if it's not present (the default Radix gives an X, but I'll add an explicit one to the header)
  // Re-write the header to include X
  docSub = docSub.replace(
    /<DialogHeader className="px-6 py-4 border-b border-\[#F0F0F0\] flex-shrink-0">[\s\S]*?<\/DialogHeader>/,
    `<DialogHeader className="px-6 py-4 border-b border-[#E5E7EB] flex-shrink-0 flex flex-row items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#FEE2E2] flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#EF4444]" />
                    </div>
                    <div>
                      <DialogTitle className="text-[14px] font-semibold text-[#111827]">Document Viewer</DialogTitle>
                      <DialogDescription className="text-[12px] text-[#6B7280] mt-0.5">{fileViewerOpen.fileName}</DialogDescription>
                    </div>
                  </div>
                  <div className="text-[#6B7280] hover:bg-gray-100 p-1.5 rounded-full cursor-pointer transition-colors" onClick={() => setFileViewerOpen({...fileViewerOpen, open: false})}>
                    <X className="w-5 h-5" />
                  </div>
                </DialogHeader>`
  );

  // Update Download button
  docSub = docSub.replace(
    /className="flex items-center gap-2 px-4 py-2 bg-\[#DC2626\] text-white rounded-lg text-\[13px\] font-medium hover:bg-\[#B91C1C\] transition-colors"/g,
    'className="flex items-center gap-2 px-4 bg-[#EF4444] text-white rounded-[10px] h-[36px] text-[13px] font-medium hover:bg-[#DC2626] transition-colors"'
  );

  // Apply red hex `#EF4444` for icons/backgrounds
  docSub = docSub.replace(/text-\[#DC2626\]/g, 'text-[#EF4444]');
  
  c = c.substring(0, documentViewerStart) + docSub + c.substring(documentViewerEnd);
}

// Ensure Radix standard Close button is disabled or we don't end up with duplicate X's. Actually Radix only draws X if you explicitly render a DialogClose element inside your content, or it might be default occasionally in custom UI libs. I'll assume custom 'X' is safe.
// Let's also check if 'X' is imported from lucide-react. I'll make sure it's in the imports.
if (c.indexOf('import {') > -1 && c.indexOf(' X,') === -1 && c.indexOf(' X ') === -1) {
  // If X is not imported, let's inject it.
  c = c.replace(/import \{ (.*?) \} from "lucide-react";/, 'import { $1, X } from "lucide-react";');
}

fs.writeFileSync(file, c, 'utf8');
console.log('Styles patched properly.');
