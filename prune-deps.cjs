const fs = require('fs');
let content = fs.readFileSync('c:/Users/VinodhKumarMandhala/Desktop/Bsdisuperadmindnsfordemo-main/src/app/pages/modules/Departments.tsx', 'utf8');

const arrayStart = content.indexOf('const departments = [');
const nextConst = content.indexOf('const ', arrayStart + 20); // The next declaration
let arrayEnd = content.lastIndexOf(']', nextConst); // Find closing bracket before the next line

if (arrayStart > -1 && arrayEnd > arrayStart) {
  const arrayContent = content.substring(arrayStart + 21, arrayEnd);
  const parts = arrayContent.split(/ {2}\},?/g).filter(x => x.trim().length > 0);
  if (parts.length >= 4) {
    const keep = parts.slice(0, 4).join('  },\n') + '\n  }';
    const newFile = content.substring(0, arrayStart + 21) + keep + '\n' + content.substring(arrayEnd);
    fs.writeFileSync('c:/Users/VinodhKumarMandhala/Desktop/Bsdisuperadmindnsfordemo-main/src/app/pages/modules/Departments.tsx', newFile);
    console.log("SUCCESS");
  } else {
    console.log("NOT ENOUGH PARTS " + parts.length);
  }
} else {
  console.log("ARRAY BOUNDS NOT FOUND");
}
