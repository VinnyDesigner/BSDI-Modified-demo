const fs = require('fs');
const filePath = 'd:\\Projects\\BSDI\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';
let content = fs.readFileSync(filePath, 'utf8');

// Remove the green circle emoji from "Active 🟢"
const oldText = 'Active \u{1F7E2}';
const newText = 'Active';

let count = 0;
while (content.includes(oldText)) {
  content = content.replace(oldText, newText);
  count++;
}
console.log(`Replaced ${count} occurrence(s) using unicode escape.`);

// Also try the literal pattern in case encoding differs
const regex = /Active\s*🟢/g;
const matches = content.match(regex);
if (matches) {
  content = content.replace(regex, 'Active');
  console.log(`Replaced ${matches.length} additional occurrence(s) using regex.`);
}

fs.writeFileSync(filePath, content);
console.log('File saved successfully.');
