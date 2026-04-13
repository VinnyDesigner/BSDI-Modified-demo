const fs = require('fs');
const content = fs.readFileSync('c:/Users/VinodhKumarMandhala/Desktop/Bsdisuperadmindnsfordemo-main/src/app/pages/modules/Departments.tsx', 'utf8');

const updated = content.replace(
  '"Urban Planning Department"', 
  '"Water Distribution Department"'
).replace(
  '"Infrastructure Management"', 
  '"Water Transmission Department"'
).replace(
  '"Environmental Services"', 
  '"Electricity Distribution Department"'
).replace(
  '"Development Control"', 
  '"Electricity Transmission Department"'
);

fs.writeFileSync('c:/Users/VinodhKumarMandhala/Desktop/Bsdisuperadmindnsfordemo-main/src/app/pages/modules/Departments.tsx', updated);
console.log('Replaced top 4 mock departments with exact names.');
