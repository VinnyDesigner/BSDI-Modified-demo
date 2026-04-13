const fs = require('fs');

const file1 = 'd:\\BSDI\\BSDI-V3\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';
const file2 = 'd:\\BSDI\\BSDI-V3\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests.tsx';

function updateFile(file) {
    if (!fs.existsSync(file)) return;
    let txt = fs.readFileSync(file, 'utf8');

    // Make sure all Actions th tags have a common class for CSS targeting
    txt = txt.replace(/<th className="text-\[11px\] font-bold text-\[#6B7280\]">\s*Actions\s*<\/th>/g, 
                     '<th className="sticky-col-actions text-[11px] font-bold text-[#6B7280]">Actions</th>');
                     
    // It's also possible they don't have exactly this class string, let's catch basic non-sticky ones
    txt = txt.replace(/<th>\s*Actions\s*<\/th>/g, 
                     '<th className="sticky-col-actions">Actions</th>');

    // Also look for fallback td tags that don't have sticky-col-actions
    // There are none according to previous searches, but just in case.

    fs.writeFileSync(file, txt);
    console.log(`Successfully updated labels in ${file}`);
}

updateFile(file1);
updateFile(file2);
