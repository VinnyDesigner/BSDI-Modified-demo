const fs = require('fs');
const content = fs.readFileSync('d:\\BSDI\\BSDI-V3\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx', 'utf8');

// Find where isOrgAdmin is used
const lines = content.split('\n');
lines.forEach((line, i) => {
    if (line.includes('isOrgAdmin') || line.includes('N/A')) {
        console.log(`Line ${i}: ${line.trim()}`);
    }
});
