const fs = require('fs');
const c = fs.readFileSync('d:\\Projects\\BSDI\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx', 'utf8');

// Check for triggers
const triggerRegex = /TabsTrigger value="([^"]+)"/g;
let m;
console.log('=== Tab Triggers ===');
while ((m = triggerRegex.exec(c)) !== null) {
  console.log(' ', m[1]);
}

// Check for content blocks
const contentRegex = /TabsContent value="([^"]+)"/g;
console.log('\n=== Tab Contents ===');
while ((m = contentRegex.exec(c)) !== null) {
  console.log(' ', m[1]);
}
