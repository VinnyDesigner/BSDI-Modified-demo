const fs = require('fs');
let code = fs.readFileSync('d:/BSDI/BSDI-V3/BSDI-Modified-demo/src/app/pages/modules/DataAccessRequests1.tsx', 'utf8');

// The script broke it by doing: 
// {filteredDeptCompleted.filter(r => {
//   const searchMatch = !orgCompletedSearch || r.id.toLowerCase(;
//   const statusMatch = orgCompletedStatusFilter === 'All' || (r.status && ...);
//   return searchMatch && statusMatch;
// }).includes(orgCompletedSearch.toLowerCase()) || r.proposedServiceName?.toLowerCase().includes...

function fixBrokenFilter(arrayName, searchVar, statusVar, fullCondition) {
    const rx = new RegExp(`\\{(${arrayName})\\.filter\\(r => \\{\n\\s*const searchMatch = !${searchVar} \\|\\| r\\.id\\.toLowerCase\\(;\n\\s*const statusMatch = ${statusVar} === 'All' \\|\\| \\(r\\.status && r\\.status\\.toLowerCase\\(\\) === ${statusVar}\\.toLowerCase\\(\\)#;\n\\s*return searchMatch && statusMatch;\n\\}\\)\\.includes\\(${searchVar}\\.toLowerCase\\(\\)\\)(.*?)\\)\\.map\\(\\(request\\) => \\(`, 'g').source.replace(/#/g, '\\)');
    
    // Actually, constructing regex for multiline broken code is error-prone. Let's do it simply using split.
}

// Since I know exactly what strings broke, I will just capture the `const searchMatch = ...` part
// and recombine it.

let changed = false;

// Fix standard ones
const brokenRegex = /\.filter\([^=]*=> \{\s*const searchMatch = !([a-zA-Z0-9_]+) \|\| r\.id\.toLowerCase\(;\s*const statusMatch = ([a-zA-Z0-9_]+) === 'All' \|\| \(r\.status && r\.status\.toLowerCase\(\) === \2\.toLowerCase\(\)\);\s*return searchMatch && statusMatch;\s*\}\)\.includes\(\1\.toLowerCase\(\)\)([\s\S]*?)\)\.map\(\(request\) => \(/g;

code = code.replace(brokenRegex, (match, searchVar, statusVar, restOfLogic) => {
    changed = true;
    return `.filter(r => {\n  const searchMatch = !${searchVar} || r.id.toLowerCase().includes(${searchVar}.toLowerCase())${restOfLogic};\n  const statusMatch = ${statusVar} === 'All' || (r.status && r.status.toLowerCase() === ${statusVar}.toLowerCase());\n  return searchMatch && statusMatch;\n}).map((request) => (`
});

// Fix spatial
// spatial regex: .filter\(\(r: any\) => \{\n  const search = spatialSubTab === 'spatial-access' \? spatialAccessCompletedSearch : userAccessSubCompletedSearch;\n  !search \|\| r.id.toLowerCase\(;\n  const searchMatch = \)\.includes\(search.toLowerCase\(\)\)([\s\S]*?)return searchMatch && statusMatch;\n\}\)\.map
const brokenSpatialRegex = /\.filter\(\(r: any\) => \{\s*const search = spatialSubTab === 'spatial-access' \? spatialAccessCompletedSearch : userAccessSubCompletedSearch;\s*!search \|\| r\.id\.toLowerCase\(;\s*const searchMatch = \)\.includes\(search\.toLowerCase\(\)\)([\s\S]*?)return searchMatch && statusMatch;\s*\}\)/g;
code = code.replace(brokenSpatialRegex, (match, logicInside) => {
    changed = true;
    // We need to carefully reconstruct it. 
    // The inner logic was: ` || (r.department && ...)` up to the closing filter parenthese
    return `.filter((r: any) => {\n  const search = spatialSubTab === 'spatial-access' ? spatialAccessCompletedSearch : userAccessSubCompletedSearch;\n  const searchMatch = !search || r.id.toLowerCase().includes(search.toLowerCase())${logicInside.split('const statusFilter')[0]}\n  const statusFilter = spatialSubTab === 'spatial-access' ? spatialAccessCompletedStatusFilter : userAccessSubCompletedStatusFilter;\n  const statusMatch = statusFilter === 'All' || (r.status && r.status.toLowerCase() === statusFilter.toLowerCase());\n  return searchMatch && statusMatch;\n})`;
});

// Fix UserRequests which uses group => instead of r =>
const brokenRegexGrp = /\.filter\(group => \{\s*const searchMatch = !([a-zA-Z0-9_]+) \|\| group\.id\.toLowerCase\(;\s*const statusMatch = ([a-zA-Z0-9_]+) === 'All' \|\| \(group\.status && group\.status\.toLowerCase\(\) === \2\.toLowerCase\(\)\);\s*return searchMatch && statusMatch;\s*\}\)\.includes\(\1\.toLowerCase\(\)\)([\s\S]*?)\)/g;

code = code.replace(brokenRegexGrp, (match, searchVar, statusVar, restOfLogic) => {
    changed = true;
    return `.filter(group => {\n  const searchMatch = !${searchVar} || group.id.toLowerCase().includes(${searchVar}.toLowerCase())${restOfLogic};\n  const statusMatch = ${statusVar} === 'All' || (group.status && group.status.toLowerCase() === ${statusVar}.toLowerCase());\n  return searchMatch && statusMatch;\n})`
});

fs.writeFileSync('d:/BSDI/BSDI-V3/BSDI-Modified-demo/src/app/pages/modules/DataAccessRequests1.tsx', code);
console.log('Repairs applied: ', changed);
