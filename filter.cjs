const fs = require('fs');
let code = fs.readFileSync('d:/BSDI/BSDI-V3/BSDI-Modified-demo/src/app/pages/modules/DataAccessRequests1.tsx', 'utf8');

// 1. ADD SELECT DROPDOWN
code = code.replace(/(placeholder="Search completed requests..."[\s\S]*?<\/div>)\s*<div className="flex items-center gap-2.*?">/g, function(match, p1) {
  let stateVar = 'orgCompletedStatusFilter';
  if (p1.includes('userRequestCompletedSearch')) stateVar = 'userRequestCompletedStatusFilter';
  else if (p1.includes('appUsersCompletedSearch')) stateVar = 'appUsersCompletedStatusFilter';
  else if (p1.includes('metadataCompletedSearch')) stateVar = 'metadataCompletedStatusFilter';
  else if (p1.includes('spatialAccessCompletedSearch')) stateVar = "spatialSubTab === 'spatial-access' ? spatialAccessCompletedStatusFilter : userAccessSubCompletedStatusFilter";
  
  let setterString = `setOrgCompletedStatusFilter`;
  if (p1.includes('userRequestCompletedSearch')) setterString = `setUserRequestCompletedStatusFilter`;
  else if (p1.includes('appUsersCompletedSearch')) setterString = `setAppUsersCompletedStatusFilter`;
  else if (p1.includes('metadataCompletedSearch')) setterString = `setMetadataCompletedStatusFilter`;
  else if (p1.includes('spatialAccessCompletedSearch')) setterString = `spatialSubTab === 'spatial-access' ? setSpatialAccessCompletedStatusFilter : setUserAccessSubCompletedStatusFilter`;
  
  return p1 + `\n        <select value={${stateVar}} onChange={(e) => ${setterString}(e.target.value)} className="w-[120px] px-3 bg-white border border-[#E5E7EB] focus:outline-none focus:ring-1 focus:ring-[#10B981] rounded-[10px] h-[36px] text-[14px] appearance-none" style={{cursor: 'pointer'}}>\n          <option value="All">All</option>\n          <option value="Approved">Approved</option>\n          <option value="Forwarded">Forwarded</option>\n          <option value="Rejected">Rejected</option>\n        </select>\n        <div className="flex items-center gap-2">`;
});

// 2. DATA FILTERING LOGIC
const applyFilter = (searchVar, stateVar) => {
  const rs = code.split('// Filter section marker just for splitting conceptually'); // Not used
  
  const regex = new RegExp(`\\.filter\\(\\s*\\(?(r|group)\\)?\\s*=>\\s*(!${searchVar}[\\s\\S]*?)\\)`, 'g');
  code = code.replace(regex, (match, param, logic) => {
      // make sure we don't double replace
      if (match.includes(stateVar)) return match;
      return `.filter(${param} => {\n  const searchMatch = ${logic};\n  const statusMatch = ${stateVar} === 'All' || (${param}.status && ${param}.status.toLowerCase() === ${stateVar}.toLowerCase());\n  return searchMatch && statusMatch;\n})`;
  });
};

applyFilter('orgCompletedSearch', 'orgCompletedStatusFilter');
applyFilter('appUsersCompletedSearch', 'appUsersCompletedStatusFilter');
applyFilter('metadataCompletedSearch', 'metadataCompletedStatusFilter');
applyFilter('userRequestCompletedSearch', 'userRequestCompletedStatusFilter');

const spatialRegex = /\.filter\(\(r: any\) => \{\s*const search = spatialSubTab === 'spatial-access' \? spatialAccessCompletedSearch : userAccessSubCompletedSearch;([\s\S]*?)return\s+([\s\S]*?);\s*\}\)/g;
code = code.replace(spatialRegex, (match, logic, ret) => {
   if (match.includes('spatialAccessCompletedStatusFilter')) return match;
   return `.filter((r: any) => {\n  const search = spatialSubTab === 'spatial-access' ? spatialAccessCompletedSearch : userAccessSubCompletedSearch;\n  ${logic}\n  const searchMatch = ${ret};\n  const statusFilter = spatialSubTab === 'spatial-access' ? spatialAccessCompletedStatusFilter : userAccessSubCompletedStatusFilter;\n  const statusMatch = statusFilter === 'All' || (r.status && r.status.toLowerCase() === statusFilter.toLowerCase());\n  return searchMatch && statusMatch;\n})`;
});

fs.writeFileSync('d:/BSDI/BSDI-V3/BSDI-Modified-demo/src/app/pages/modules/DataAccessRequests1.tsx', code);
console.log('Filters injected.');
