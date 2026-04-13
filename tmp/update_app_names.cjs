const fs = require('fs');
let content = fs.readFileSync('src/app/pages/modules/Applications.tsx', 'utf8');

const newNames = [
  "BSDI Nexus",
  "GeoBahrain Hub",
  "SpatialBridge",
  "GeoMatrix",
  "BSDI Connect",
  "GeoSphere Bahrain",
  "SpatialNet",
  "GeoLink Hub",
  "DataAtlas",
  "GeoFusion",
  "SpatialCore",
  "GeoGrid Platform"
];

const mockAppsRegex = /const mockApplications = \[([\s\S]*?)\];/;
const match = content.match(mockAppsRegex);

if (match) {
  let appsText = match[1];
  // Regex to match each object in the array
  const objRegex = /\{[\s\S]*?id: (\d+)[\s\S]*?\}/g;
  let newAppsText = appsText.replace(objRegex, (obj, id) => {
    const idx = parseInt(id) - 1;
    if (newNames[idx]) {
      // Replace nameEn
      obj = obj.replace(/nameEn: ".*?",/, `nameEn: "${newNames[idx]}",`);
      // Update nameAr to something placeholder or just keep same if no provided Arabic names
      // I'll use the same name for Arabic for now as none were provided, then maybe clear out the old ones to avoid confusion
      obj = obj.replace(/nameAr: ".*?",/, `nameAr: "${newNames[idx]}",`);
      // Update URL to match new name
      const slug = newNames[idx].toLowerCase().replace(/\s+/g, '');
      obj = obj.replace(/url: "https:\/\/.*?",/, `url: "https://${slug}.bsdi.gov.bh",`);
    }
    return obj;
  });
  
  content = content.replace(mockAppsRegex, `const mockApplications = [${newAppsText}];`);
  fs.writeFileSync('src/app/pages/modules/Applications.tsx', content);
  console.log('Successfully updated application names.');
} else {
  console.error('Could not find mockApplications array.');
}
