const fs = require('fs');
const text = fs.readFileSync('c:/Users/VinodhVariableMandhala/Desktop/Bsdisuperadmindnsfordemo-main/src/app/pages/modules/DataAccessRequests.tsx', 'utf8').replace(/VinodhVariableMandhala/g, 'VinodhKumarMandhala');

const matches = text.match(/<tr[^>]+className=["`][^"`]+["`]/g);
if (matches) {
   console.log(matches.filter(m => m.includes('bg-gray-50') || m.includes('transition-colors')).join('\n---\n'));
} else {
   console.log("No matches");
}
