const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'Projects', 'BSDI', 'BSDI-Modified-demo', 'src', 'app', 'pages', 'modules', 'DataAccessRequests1.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update CSS for .status-badge
const oldCss = `.status-badge { padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.3px; width: fit-content; display: inline-flex; align-items: center; justify-content: center; }`;
const newCss = `.status-badge { padding: 4px 10px; border-radius: 999px; font-size: 12px; font-weight: 500; text-transform: capitalize; letter-spacing: 0.3px; width: fit-content; display: inline-flex; align-items: center; justify-content: center; background: #E6F0FA; color: #3D72A2; }`;

const oldBadges = `.status-badge.created-green { background: #DFF5E3; color: #22A06B; }
               .status-badge.pending { background: #FFF7ED; color: #F97316; }
               .status-badge.forwarded { background: #EFF6FF; color: #3B82F6; }`;
const newBadges = `.status-badge.created-green, .status-badge.pending, .status-badge.forwarded { background: #E6F0FA; color: #3D72A2; }`;

content = content.replace(oldCss, newCss);
content = content.replace(oldBadges, newBadges);

// 2. Fix align right to left
content = content.replace('text-align: right;', 'text-align: left;');

// 3. JSX - Convert Uppercase to Titlecase
content = content.replace('>CREATED<', '>Created<');
content = content.replace('>APPROVED<', '>Approved<');
content = content.replace('>PENDING<', '>Pending<');
content = content.replace('>FORWARDED<', '>Forwarded<');
content = content.replace("'APPROVED'", "'Approved'");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully standardized Status styling and labels.');
