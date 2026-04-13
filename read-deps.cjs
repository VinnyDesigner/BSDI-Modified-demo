const fs = require('fs');
const content = fs.readFileSync('c:/Users/VinodhKumarMandhala/Desktop/Bsdisuperadmindnsfordemo-main/src/app/pages/modules/Departments.tsx', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(0, 150).join('\n'));
