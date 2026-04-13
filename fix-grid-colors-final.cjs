const fs = require("fs");
const file = "c:/Users/VinodhKumarMandhala/Desktop/Bsdisuperadmindnsfordemo-main/src/app/pages/modules/DataAccessRequests.tsx";
let content = fs.readFileSync(file, "utf8");

content = content.replace(/'hover:bg-\[#EBECE8\]\/30'/g, "(index % 2 === 0 ? 'bg-white hover:bg-[#EBECE8]/30' : 'bg-[#F9F9F9] hover:bg-[#EBECE8]/30')");

content = content.replace(/\} hover:bg-\[#EBECE8\]\/30 transition-colors\`/g, "} ${index % 2 === 0 ? 'bg-white' : 'bg-[#F9F9F9]'} hover:bg-[#EBECE8]/30 transition-colors`");

content = content.replace(/\} bg-\[#(F8F9FA|FDF2F2|F5F5F5)\]\`/g, "} ${index % 2 === 0 ? 'bg-white' : 'bg-[#F9F9F9]'}`");

fs.writeFileSync(file, content, "utf8");
console.log("Replaced colors successfully.");
