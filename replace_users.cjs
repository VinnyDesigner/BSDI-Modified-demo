const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'src', 'app', 'pages', 'modules');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

const map = {
  // Names
  'Ahmed Ali': 'Jawaher Rashed',
  'Ahmed Al-Khalifa': 'Jawaher Rashed',
  'Sara Hassan': 'Lulwa Saad Mujaddam',
  'Sara Mohammed': 'Lulwa Saad Mujaddam',
  'Sara Al-Mansoori': 'Lulwa Saad Mujaddam',
  'Sara Al-Khoori': 'Lulwa Saad Mujaddam',
  'Mohammed Khalid': 'Mariam Rashed',
  'Fatima Ahmed': 'Muneera Khamis',
  'Fatima Hassan': 'Muneera Khamis',
  'Khalid Salman': 'Rana A.Majeed',
  'Khalid Ali': 'Rana A.Majeed',
  'Layla Abdullah': 'Venkatesh Munusamy',
  'Omar Hassan': 'Jawaher Rashed',
  'Noor Ali': 'Lulwa Saad Mujaddam',
  'Mohammed Ahmed': 'Mariam Rashed',
  'Noor Al-Mansoori': 'Muneera Khamis',
  'Hassan Ibrahim': 'Rana A.Majeed',
  'Maryam Ali': 'Venkatesh Munusamy',
  'ahmed_khalifa': 'jawaher_rashed',
  'ahmed.khalifa': 'jawaher_rashed',
  
  // Emails
  'ahmed@bsdi.gov.bh': 'jawaher.albufalah@iga.gov.bh',
  'ahmed.khalifa@gov.bh': 'jawaher.albufalah@iga.gov.bh',
  'a.alkhalifa@mow.gov.bh': 'jawaher.albufalah@iga.gov.bh',
  'sara@bsdi.gov.bh': 'lalkawari@iga.gov.bh',
  'mohammed@bsdi.gov.bh': 'mariam.alkhater@iga.gov.bh',
  'fatima@bsdi.gov.bh': 'muneera.ka@iga.gov.bh',
  'khalid@bsdi.gov.bh': 'ranama@iga.gov.bh',
  'layla@bsdi.gov.bh': 'venkateshe@iga.gov.bh',
  'omar@bsdi.gov.bh': 'jawaher.albufalah@iga.gov.bh',
  'noor@bsdi.gov.bh': 'lalkawari@iga.gov.bh',
  
  // Avatars (Initials)
  "'AA'": "'JR'",
  '"AA"': '"JR"',
  "'SH'": "'LM'",
  '"SH"': '"LM"',
  "'MK'": "'MR'",
  '"MK"': '"MR"',
  "'FA'": "'MK'",
  '"FA"': '"MK"',
  "'KS'": "'RM'",
  '"KS"': '"RM"',
  "'LA'": "'VM'",
  '"LA"': '"VM"',
  "'OH'": "'JR'",
  '"OH"': '"JR"',
  "'NA'": "'LM'",
  '"NA"': '"LM"'
};

let totalReplacements = 0;

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  for (const [key, value] of Object.entries(map)) {
    // Escape special chars in key for regex except single/double quotes
    const safeKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(safeKey, 'g');
    content = content.replace(regex, value);
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + file);
    totalReplacements++;
  }
}
console.log('Done. Updated ' + totalReplacements + ' files.');
