const fs = require('fs');

const file1 = 'd:\\BSDI\\BSDI-V3\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';
const file2 = 'd:\\BSDI\\BSDI-V3\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests.tsx';

function injectOrgAdminStatus(file) {
    if (!fs.existsSync(file)) return;
    let txt = fs.readFileSync(file, 'utf8');

    // This regex looks for td with class sticky-col-actions, followed by a div with flex
    // and captures everything inside until the associated </td>
    const regex = /(<td className="sticky-col-actions[^>]*>)\s*(<div className="flex items-center[^>]*>[\s\S]*?<\/div>)\s*(<\/td>)/g;

    txt = txt.replace(regex, (match, p1, p2, p3) => {
        // Prevent double wrapping
        if (p2.includes('isOrgAdmin ?')) {
            return match;
        }

        return `${p1}
                                  {isOrgAdmin ? (
                                    <div className="flex justify-center items-center h-full w-full">
                                      <span className={\`inline-flex items-center justify-center px-3 py-1.5 min-w-[80px] text-[12px] font-semibold rounded-full capitalize shadow-sm transition-all duration-300 \${request?.status?.toLowerCase() === 'pending' ? 'bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20' : 'bg-[#003F72]/10 text-[#003F72] border border-[#003F72]/20'}\`}>
                                          {request?.status || "Pending"}
                                      </span>
                                    </div>
                                  ) : (
                                    ${p2}
                                  )}
                                ${p3}`;
    });

    fs.writeFileSync(file, txt);
    console.log(`Updated OrgAdmin status logic in ${file}`);
}

injectOrgAdminStatus(file1);
injectOrgAdminStatus(file2);
