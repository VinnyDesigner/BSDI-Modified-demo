const fs = require('fs');
const content = fs.readFileSync('c:/Users/VinodhKumarMandhala/Desktop/Bsdisuperadmindnsfordemo-main/src/app/pages/modules/DataAccessRequests.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, i) => {
  if (line.includes('% 2') || line.includes('bg-[#FDF2F2]') || line.includes('bg-[#F5F5F5]') || line.includes('bg-red-50') || line.includes('/5') || /bg-\[#[a-zA-Z0-9]+\]\/5/i.test(line)) {
    console.log((i+1) + ': ' + line.trim());
  }
});
