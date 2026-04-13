const fs = require('fs');
const content = fs.readFileSync('src/app/pages/modules/DataAccessRequests1.tsx', 'utf8');
const lines = content.split('\n');
lines.forEach((line, idx) => {
  if (line.includes('✓') || line.includes('Approve')) {
    console.log(`${idx + 1}: ${line.trim()}`);
  }
});
