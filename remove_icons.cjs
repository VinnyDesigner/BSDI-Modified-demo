const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/pages/modules/Departments.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const target = `                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-[#EF4444]/5 flex items-center justify-center flex-shrink-0">
                            <Building className="w-4.5 h-4.5 text-[#EF4444]" />
                          </div>
                          <div>
                            <div className="font-semibold text-[#111827] text-sm">{dept.name}</div>
                            <div className="text-[11px] text-[#6B7280]">{dept.code}</div>
                          </div>
                        </div>
                      </td>`;

const replacement = `                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-[2px]">
                          <div className="font-semibold text-[#111827] text-sm">{dept.name}</div>
                          <div className="text-[11px] text-[#6B7280]">{dept.code}</div>
                        </div>
                      </td>`;

// Try exact match first
if (content.includes(target)) {
    content = content.replace(target, replacement);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log("Successfully replaced the icon block.");
} else {
    // Try a more flexible match if spaces differ
    console.log("Exact match failed, trying flexible replacement...");
    const regexTarget = /<td className="px-6 py-4">\s+<div className="flex items-center gap-3">\s+<div className="w-9 h-9 rounded-lg bg-\[#EF4444\]\/5 flex items-center justify-center flex-shrink-0">\s+<Building className="w-4\.5 h-4\.5 text-\[#EF4444\]" \/>\s+<\/div>\s+<div>\s+<div className="font-semibold text-\[#111827\] text-sm">\{dept\.name\}<\/div>\s+<div className="text-\[11px\] text-\[#6B7280\]">\{dept\.code\}<\/div>\s+<\/div>\s+<\/div>\s+<\/td>/;
    
    if (regexTarget.test(content)) {
        content = content.replace(regexTarget, replacement);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Successfully replaced with flexible regex.");
    } else {
        console.error("Could not find the target block even with regex.");
        process.exit(1);
    }
}
