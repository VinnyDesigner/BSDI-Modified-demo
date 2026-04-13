const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'Projects', 'BSDI', 'BSDI-Modified-demo', 'src', 'app', 'pages', 'modules', 'DataAccessRequests1.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Force all status badge variations to use the same light blue theme
content = content.replace(/\.status-badge\.(created-green|pending|forwarded)\s*\{[^}]*\}/g, (match, p1) => {
    return `.status-badge.${p1} { background: #E6F0FA !important; color: #3D72A2 !important; }`;
});

// 2. Global case-insensitive replacement for status badge text (to be safe)
content = content.replace(/>APPROVED</g, '>Approved<');
content = content.replace(/>CREATED</g, '>Created<');
content = content.replace(/>PENDING</g, '>Pending<');
content = content.replace(/>FORWARDED</g, '>Forwarded<');
content = content.replace(/'APPROVED'/g, "'Approved'");
content = content.replace(/"APPROVED"/g, '"Approved"');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully applied remaining Status fixes.');
