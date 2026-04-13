const fs = require('fs');
const path = require('path');

function walkDir(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    const fileLoc = path.join(dir, file);
    const stat = fs.statSync(fileLoc);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(fileLoc));
    } else if (fileLoc.endsWith('.tsx') || fileLoc.endsWith('.jsx')) {
      results.push(fileLoc);
    }
  });
  return results;
}

const dir = 'c:/Users/VinodhKumarMandhala/Desktop/Bsdisuperadmindnsfordemo-main/src/app/pages';
const files = walkDir(dir);

let count = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  // Replace <h1 className="text-4xl ... "> or <h1 className="text-3xl ... ">
  content = content.replace(/<h1 className=\"(text-4xl|text-3xl) /g, '<h1 className="text-[28px] leading-[34px] ');
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated: ' + file);
    count++;
  }
}
console.log('Total files updated: ' + count);
