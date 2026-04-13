const fs = require('fs');
const content = fs.readFileSync('src/app/pages/modules/DataAccessRequests.tsx', 'utf8');

// Find Button elements that do not have size="icon"
let count = 0;
const buttonMatches = content.match(/<Button[^>]*>[\s\S]*?<\/Button>/g) || [];
buttonMatches.forEach(btn => {
  if (btn.includes('variant="outline"') && !btn.includes('size="icon"')) {
    console.log(btn.replace(/\n\s*/g, ' '));
  }
});
