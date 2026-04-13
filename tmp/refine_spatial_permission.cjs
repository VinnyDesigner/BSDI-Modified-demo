const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'Projects', 'BSDI', 'BSDI-Modified-demo', 'src', 'app', 'pages', 'modules', 'DataAccessRequests1.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Update Status Badge Colors (Blue -> Green)
content = content.replace(/\.status-badge\s*\{([^}]*background:\s*)#E6F0FA([^}]*color:\s*)#3D72A2([^}]*\})/g, 
  (match, p1, p2, p3) => `.status-badge {${p1}#E6F5EA${p2}#1E7E34${p3}`);

content = content.replace(/\.status-badge\.(created-green|pending|forwarded)\s*\{([^}]*background:\s*)#E6F0FA\s*!important([^}]*color:\s*)#3D72A2\s*!important([^}]*\})/g, 
  (match, p1, p2, p3, p4) => `.status-badge.${p1} {${p2}#E6F5EA !important${p3}#1E7E34 !important${p4}`);

// 2. Remove conditional check for View Map button to make it universally available
// Pattern: {spatialSubTab === 'spatial-access' && ( <button ... title="View Map" ... > 🗺️ </button> )}
const viewMapPattern = /\{spatialSubTab === 'spatial-access' && \(\s*(<button\s*className="[^"]*"\s*title="View Map"[^>]*>[\s\S]*?<\/button>)\s*\)\}/g;
content = content.replace(viewMapPattern, '$1');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Successfully refined Spatial Permission tab and status colors.');
