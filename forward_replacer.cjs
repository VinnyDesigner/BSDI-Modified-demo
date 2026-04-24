const fs = require('fs');
let code = fs.readFileSync('d:/BSDI/BSDI-V3/BSDI-Modified-demo/src/app/pages/modules/DataAccessRequests1.tsx', 'utf8');

// 1. Replace Tooltip text -> Approve to Forward
code = code.replace(/<TooltipContent([^>]*?)>Approve<\/TooltipContent>/g, '<TooltipContent$1>Forward</TooltipContent>');

// 2. Button styling: 
// The button has classes: text-[#10B981] hover:bg-[#10B981]  or bg-[#10B981]/10 ...
// Let's replace the button's content exactly.
// It could look like:
/*
<button 
  className="flex items-center justify-center w-8 h-8 bg-[#ECFDF5] text-[#10B981] hover:bg-[#10B981] hover:text-white rounded-full transition-all duration-300 shadow-sm border border-[#10B981]/20"
  onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}
>
  <Check className="w-4 h-4" strokeWidth={3} />
</button>
*/

// Or with `V`:
/*
<button 
  className="flex items-center justify-center w-7 h-7 bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 rounded-full transition-colors font-bold border border-[#10B981]/20" 
  onClick={(e) => { e.stopPropagation(); setApproveDialog({open: true, requestId: request.id}); }}
>
  V
</button>
*/

// Let's replace button class styles
code = code.replace(/bg-\[#ECFDF5\] text-\[#10B981\] hover:bg-\[#10B981\] hover:text-white(.*?)border-\[#10B981\]\/20/g, 'bg-[#FEF3C7] text-[#F59E0B] hover:bg-[#F59E0B] hover:text-white$1border-[#F59E0B]/20');

code = code.replace(/bg-\[#10B981\]\/10 text-\[#10B981\] hover:bg-\[#10B981\]\/20(.*?)border-\[#10B981\]\/20/g, 'bg-[#F59E0B]/10 text-[#F59E0B] hover:bg-[#F59E0B]/20$1border-[#F59E0B]/20');

// Replace the `<Check className="w-4 h-4" />` with `<Forward className="w-4 h-4" />` but ONLY inside these buttons!
// Actually, since I renamed the style, I can just find the onClick=setApproveDialog, and change its inner content.
const buttonContentRegex = /(onClick=\{\(e\) => \{ e\.stopPropagation\(\);\s*setApproveDialog(.*?)\}\}\s*>)\s*(<Check className="[^"]*" strokeWidth=\{3\} \/>|V)\s*<\/button>/g;
code = code.replace(buttonContentRegex, '$1\n                                              <Forward className="w-4 h-4" strokeWidth={3} />\n                                            </button>');

// 3. Dialog texts:
code = code.replace(/>Approve Request</g, '>Forward Request<');
code = code.replace(/>Are you sure you want to approve request (\{.*?\})\?</g, '>Are you sure you want to forward request $1?<');
code = code.replace(/>Yes, Approve</g, '>Yes, Forward<');

// Modal icon updates:
// <Check className="w-7 h-7 text-white" strokeWidth={4} /> -> <Forward ... />
// in the modal header which has `border-4 border-white flex items-center justify-center">`
code = code.replace(/<Check className="w-7 h-7 text-white" strokeWidth=\{4\} \/>/g, '<Forward className="w-7 h-7 text-white" strokeWidth={4} />');
code = code.replace(/<Check className="w-10 h-10 text-white" strokeWidth=\{2\} \/>/g, '<Forward className="w-10 h-10 text-white" strokeWidth={2} />');

// also modal background color if it's green: `bg-[#00C07F]` to `bg-[#F59E0B]`, hover `bg-[#00A86F]` to `hover:bg-[#D97706]`
code = code.replace(/bg-\[#00C07F\] hover:bg-\[#00A86F\]/g, 'bg-[#F59E0B] hover:bg-[#D97706]');
code = code.replace(/shadow-\[0_4px_14px_rgba\(0,192,127,0\.25\)\]/g, 'shadow-[0_4px_14px_rgba(245,158,11,0.25)]');

// Header circle bg `bg-[#00C07F]` or whatever it uses. Let's see:
code = code.replace(/bg-gradient-to-br from-\[#00E599\] to-\[#00C07F\]/g, 'bg-gradient-to-br from-[#FBBF24] to-[#F59E0B]');
code = code.replace(/bg-\[#00C07F\](?=.*?rounded-full.*?(flex|absolute))/g, 'bg-[#F59E0B]');
code = code.replace(/bg-\[#10B981\](?=.*?rounded-full.*?(flex|absolute))/g, 'bg-[#F59E0B]'); // fallback

fs.writeFileSync('d:/BSDI/BSDI-V3/BSDI-Modified-demo/src/app/pages/modules/DataAccessRequests1.tsx', code);
console.log('Forward replacing script completed.');
