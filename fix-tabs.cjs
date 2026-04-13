const fs = require('fs');

let content = fs.readFileSync('src/app/pages/modules/DataAccessRequests.tsx', 'utf8');

// Fix 1: Missing wrapper for Data Download Pending
const downloadPendingMatch = content.match(/<div className="flex items-center gap-2">[\s\S]*?<Input\s+type="date"(?:.|\n)*?downloadPendingDateRange(?:.|\n)*?\/>\s*<\/div>\s*{\s*filteredDownloadPending\.map/);
if (downloadPendingMatch) {
  content = content.replace(
    /(<Input\s+type="date"[^>]*?downloadPendingDateRange\.to[^>]*?\/>\s*<\/div>\s*)({\s*filteredDownloadPending\.map)/,
    '$1</div>\n                    <div className="flex flex-col gap-3 p-6 border-t border-[#E5E7EB]">\n                      $2'
  );
}

// Fix 2: Missing wrapper for Data Download Forwarded
const downloadForwardedMatch = content.match(/<div className="flex items-center gap-2">[\s\S]*?<Input\s+type="date"(?:.|\n)*?downloadForwardedDateRange.*?to(?:.|\n)*?\/>\s*<\/div>\s*{\s*dataDownloadForwardedList\.map/);
if (downloadForwardedMatch) {
  content = content.replace(
    /(<Input\s+type="date"[^>]*?downloadForwardedDateRange\.to[^>]*?\/>\s*<\/div>\s*)({\s*dataDownloadForwardedList\.map)/,
    '$1</div>\n                    <div className="flex flex-col gap-3 p-6 border-t border-[#E5E7EB]">\n                      $2'
  );
}

// Fix 3: Standardize Search classes across Metadata and App User
content = content.replace(
  /className="pl-10 bg-white border-\[#B0AAA2\]\/30 focus:border-\[#003F72\] rounded-full"/g,
  'className="pl-10 bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-xl h-10"'
);
content = content.replace(
  /className="bg-white border-\[#B0AAA2\]\/30 focus:border-\[#003F72\] rounded-full"/g,
  'className="bg-white border-[#E5E7EB] focus:ring-[#ED1C24] rounded-xl h-10"'
);
content = content.replace(
  /<span className="text-\[#666666\]">to<\/span>/g,
  '<span className="text-[#6B7280] font-bold text-xs uppercase">to</span>'
);

// Fix 4: Fix border-[#E5E5E5] to border-[#E5E7EB] for consistency in wrapper divs
content = content.replace(
  /className="flex flex-col gap-3 p-6 border-t border-\[#E5E5E5\]"/g,
  'className="flex flex-col gap-3 p-6 border-t border-[#E5E7EB]"'
);

// Fix 5: Ensure 'dataDownloadForwardedList' uses 'flex' instead of 'flex-col' for horizontal layout
content = content.replace(
  /className="group relative flex flex-col py-\[14px\] px-\[18px\] bg-white border border-\[#E5E7EB\] rounded-2xl/g,
  'className="group relative flex bg-white border border-[#E5E7EB] rounded-2xl transition-all duration-300 hover:shadow-md hover:border-[#F97316]/30 overflow-hidden items-center py-[14px]'
);

// Also we need to fix the inner structure if it had flex-col
content = content.replace(
  /<div className="flex items-center w-full overflow-hidden mb-6">([\s\S]*?)<\/div>\s*<div className="pt-6 border-t border-\[#F3F4F6\]">/g,
  '$1\n                        </div>\n                        {/* '
);

// Fix 6: Ensure other appUser items have exactly the same flex container classes
// App User Pending
content = content.replace(
  /className="group relative flex bg-white border border-\[#E5E7EB\] rounded-2xl transition-all duration-300 hover:shadow-md hover:border-\[#ED1C24\]\/30 overflow-hidden items-center py-\[14px\]"/g,
  'className="group relative flex bg-white border border-[#E5E7EB] rounded-2xl transition-all duration-300 hover:shadow-md hover:border-[#ED1C24]/30 overflow-hidden items-center py-[14px]"'
);

// Let's execute replacing the appUser completed hover colors
content = content.replace(
  /hover:border-\[#10B981\]\/30/g,
  'hover:border-[#10B981]/30'
);

fs.writeFileSync('src/app/pages/modules/DataAccessRequests.tsx', content, 'utf8');
console.log('Fixed tabs successfully.');
