const fs = require('fs');
const c = fs.readFileSync('src/app/pages/modules/DataAccessRequests1.tsx', 'utf8');
const lines = c.split('\n');
lines.forEach((l, i) => {
  if (l.includes('<TabsContent value="data-access">')) {
    console.log('Found it at line', i + 1);
  }
});
