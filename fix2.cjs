const fs = require('fs');
let content = fs.readFileSync('src/app/pages/modules/DataAccessRequests.tsx', 'utf8');

// The inputs we care about normally look like:
// className="pl-10 bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-xl h-10"
// Let's replace 'rounded-xl h-10' with 'rounded-[10px] h-[36px] px-3' for normal inputs
// For search inputs, it has 'pl-10'. We want them to end up as:
//  height: 36px, border-radius: 10px, background: #F9FAFB, font-size: 14px
content = content.replace(/rounded-xl h-10/g, 'rounded-[10px] h-[36px] text-[14px]');

// Find all occurrences of pl-10 bg-white ... and change bg-white to bg-[#F9FAFB]
// To be safe, just locate where placeholder="Search" and replace bg-white inside its className.
let tempStr = '';
let parts = content.split('<Input');
for (let i = 1; i < parts.length; i++) {
  if (parts[i].includes('placeholder="Search')) {
     parts[i] = parts[i].replace('bg-white', 'bg-[#F9FAFB]');
  }
}
content = parts.join('<Input');

// Change date inputs to background #FFFFFF - well, bg-white IS #FFFFFF.
// Action buttons: h-8 w-8 -> h-[36px] w-[36px]
content = content.replace(/h-8 w-8 rounded-lg/g, 'h-[36px] w-[36px] rounded-[10px]');
// There are some buttons that are just "h-8 w-8 rounded-full" maybe? Actually, h-8 w-8 is 32px. We want 36px.
content = content.replace(/h-8 w-8/g, 'h-[36px] w-[36px]');

// Cards wrapper: rounded-2xl -> rounded-[10px]
// Before: className="group relative flex bg-white border border-[#E5E7EB] rounded-2xl ... "
content = content.replace(/rounded-2xl transition-all/g, 'rounded-[10px] transition-all');

// Fix gap-8 -> gap-4
content = content.replace(/gap-8 pl-6 pr-4/g, 'gap-4 pl-6 pr-4');

// Remove extra texts like "Total Requests"
// Original: <span className="text-sm text-[#666666]">Total Requests: {String(servicesCreationPendingRequests.length).padStart(2, '0')}</span>
content = content.replace(/<span className="text-sm text-\[#666666\]">Total Requests:[^<]+<\/span>/g, '');

fs.writeFileSync('src/app/pages/modules/DataAccessRequests.tsx', content, 'utf8');
console.log('UI Standardization Complete');
