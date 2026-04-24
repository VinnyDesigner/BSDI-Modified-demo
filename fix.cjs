const fs = require('fs');
let code = fs.readFileSync('d:/BSDI/BSDI-V3/BSDI-Modified-demo/src/app/pages/modules/DataAccessRequests1.tsx', 'utf8');

// 1. Remove TabsTrigger for Forwarded
code = code.replace(/<TabsTrigger\s+value="[^"]*forwarded"[^>]*>[\s\S]*?<\/TabsTrigger>/g, '');

// 2. Remove TabsContent for Forwarded Search
code = code.replace(/<TabsContent\s+value="[^"]*forwarded"[^>]*tabIndex=\{-1\}>[\s\S]*?(?=<\/TabsContent>)\s*<\/TabsContent>/g, '');

// 3. Remove TabsContent for Forwarded Table
code = code.replace(/<TabsContent\s+value="[^"]*forwarded"\s+className="mt-0">[\s\S]*?(?=<\/TabsContent>)\s*<\/TabsContent>/g, '');

fs.writeFileSync('d:/BSDI/BSDI-V3/BSDI-Modified-demo/src/app/pages/modules/DataAccessRequests1.tsx', code);
console.log('Removed all forwarded tabs UI successfully.');
