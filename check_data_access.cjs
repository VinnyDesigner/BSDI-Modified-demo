const fs = require('fs');
const c = fs.readFileSync('src/app/pages/modules/DataAccessRequests1.tsx', 'utf8');
const st = c.indexOf('<TabsContent value="data-access"');
console.log(c.substring(st, st + 500));
