const fs = require('fs');
let content = fs.readFileSync('src/app/pages/modules/DataAccessRequests.tsx', 'utf8');

let initialLength = content.length;

// 1. Search Inputs styling
content = content.replace(
  /<Input\s+placeholder="Search[^>]*?className="pl-10 bg-white border-\[#[0-9A-Fa-f]+\](?:\/30)? focus:(?:ring|border)-\[#[0-9A-Fa-f]+\] rounded-(?:xl|full) h-10"/g,
  (match) => {
    return match
      .replace('bg-white', 'bg-[#F9FAFB]')
      .replace('rounded-xl', 'rounded-[10px]')
      .replace('rounded-full', 'rounded-[10px]')
      .replace('h-10"', 'h-[36px] text-[14px] px-3 pl-10"');
  }
);
// Catch Inputs missing the h-10 definition if any
content = content.replace(
  /<Input\s+placeholder="Search([^>]*?)className="([^"]*?bg-white[^"]*?rounded-(?:xl|full)[^"]*?)"/g,
  (match, p1, p2) => {
    let replacedClass = p2
        .replace('bg-white', 'bg-[#F9FAFB]')
        .replace('rounded-xl', 'rounded-[10px]')
        .replace('rounded-full', 'rounded-[10px]');
    if (!replacedClass.includes('h-[36px]')) {
        replacedClass = replacedClass.replace('h-10', '');
        replacedClass += ' h-[36px] text-[14px] px-3 pl-10';
    }
    return `<Input placeholder="Search${p1}className="${replacedClass}"`;
  }
);

// 2. Date Inputs styling
content = content.replace(
  /<Input\s+type="date"([^>]*?)className="([^"]*?bg-white[^"]*?rounded-(?:xl|full)[^"]*?)"/g,
  (match, p1, p2) => {
     let replacedClass = p2
        .replace('bg-white', 'bg-[#FFFFFF]')
        .replace('rounded-xl', 'rounded-[10px]')
        .replace('rounded-full', 'rounded-[10px]');
     if (!replacedClass.includes('h-[36px]')) {
        replacedClass = replacedClass.replace('h-10', '');
        replacedClass += ' h-[36px] px-3';
     }
     return `<Input type="date"${p1}className="${replacedClass}"`;
  }
);

// 3. Remove "Total Requests" block from headers
// e.g. <span className="text-sm text-[#666666]">Total Requests: {String(appUserPendingRequests.length).padStart(2, '0')}</span>
content = content.replace(
  /<span className="(?:text-sm |)text-\[#666666\]">\s*Total Requests:.*?<\/span>\s*/g,
  ''
);
// e.g. <Badge variant="secondary" className="bg-[#ED1C24]/10 text-[#ED1C24] hover:bg-[#ED1C24]/10 border-0 rounded-full text-xs font-semibold px-2.5 py-0.5 ml-2"> {filteredUserPending.length} </Badge> ?
// The user explicitly stated: "Remove extra texts like "Total Requests"" so I will just strip "Total Requests" span explicitly.

// 4. Middle scrollable section padding and gap
content = content.replace(
  /className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-[468] pl-[46] pr-[46] border-l border-\[#[0-9A-Fa-f]+\]"/g,
  'className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-4 pl-6 pr-4 border-l border-[#E5E7EB]"'
);

// Specifically target the exact lines matching our previous search: 'gap-8 pl-6 pr-4' and replace to gap-4
content = content.replace(
  /className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-8 pl-6 pr-4 border-l border-\[#E5E7EB\]"/g,
  'className="flex-1 overflow-x-auto scrollbar-thin flex items-center gap-4 pl-6 pr-4 border-l border-[#E5E7EB]"'
);

// 5. Unify button structures (they previously were h-8 w-8, design asks for identical size/spacing. 36x36 px)
// "Specific button sizes set to h-[36px] w-[36px]."
content = content.replace(
  /className="bg-\[#[0-9A-Fa-f]+\]\/10 hover:bg-\[#[0-9A-Fa-f]+\] text-\[#[0-9A-Fa-f]+\] hover:text-white h-8 w-8 rounded-lg shadow-sm transition-colors border border-\[#[0-9A-Fa-f]+\]\/20"/g,
  (match) => match.replace('h-8 w-8 rounded-lg', 'h-[36px] w-[36px] rounded-[10px]')
);

// 6. Fix "rounded-2xl" on map row containers to "rounded-[10px]" globally inside lists
content = content.replace(
  /className="group relative flex bg-white border border-\[#E5E7EB\] rounded-2xl/g,
  'className="group relative flex bg-white border border-[#E5E7EB] rounded-[10px]'
);

// 7. Standardize Accordion Colors
// pending -> bg-[#FEF2F2]
content = content.replace(
  /\? 'bg-\[#FEF2F2\]' : 'bg-white'/g,
  "? 'bg-[#FEF2F2]' : 'bg-white'"
);
// forwarded -> bg-[#FFF7ED]
content = content.replace(
  /\? 'bg-\[#FFF7ED\]' : 'bg-white'/g,
  "? 'bg-[#FFF7ED]' : 'bg-white'"
);
// completed -> bg-[#ECFDF5]
content = content.replace(
  /\? 'bg-\[#ECFDF5\]' : 'bg-white'/g,
  "? 'bg-[#ECFDF5]' : 'bg-white'"
);

fs.writeFileSync('src/app/pages/modules/DataAccessRequests.tsx', content, 'utf8');

console.log('Fixed requested styles successfully. Bytes modified:', Math.abs(content.length - initialLength));
