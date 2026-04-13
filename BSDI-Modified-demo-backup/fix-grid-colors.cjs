const fs = require("fs");
const file = "c:/Users/VinodhKumarMandhala/Desktop/Bsdisuperadmindnsfordemo-main/src/app/pages/modules/DataAccessRequests.tsx";
let content = fs.readFileSync(file, "utf8");

content = content.split("} hover:bg-[#EBECE8]/30 transition-colors`}").join(
    "} ${index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'} hover:bg-[#EBECE8]/50 transition-colors`}"
);

content = content.split("} ${highlightedId === request.id ? 'bg-[#ED1C24]/5' : 'hover:bg-[#EBECE8]/30'} transition-colors`}").join(
    "} ${highlightedId === request.id ? 'bg-[#ED1C24]/10' : (index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]')} hover:bg-[#EBECE8]/50 transition-colors`}"
);
content = content.split("} ${highlightedId === request.id ? 'bg-[#003F72]/5' : 'hover:bg-[#EBECE8]/30'} transition-colors`}").join(
    "} ${highlightedId === request.id ? 'bg-[#003F72]/10' : (index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]')} hover:bg-[#EBECE8]/50 transition-colors`}"
);
content = content.split("} ${highlightedId === request.id ? 'bg-[#B0AAA2]/10' : 'hover:bg-[#EBECE8]/30'} transition-colors`}").join(
    "} ${highlightedId === request.id ? 'bg-[#B0AAA2]/20' : (index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]')} hover:bg-[#EBECE8]/50 transition-colors`}"
);

content = content.split("} bg-[#F8F9FA]`}").join("} ${index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}");
content = content.split("} bg-[#FDF2F2]`}").join("} ${index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}");
content = content.split("} bg-[#F5F5F5]`}").join("} ${index % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}`}");

fs.writeFileSync(file, content, "utf8");
console.log("Fixed!");
