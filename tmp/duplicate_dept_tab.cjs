const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'Projects', 'BSDI', 'BSDI-Modified-demo', 'src', 'app', 'pages', 'modules', 'DataAccessRequests1.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Duplicate TabsTrigger
const triggerListRegex = /(<TabsTrigger value="spatial-permission"[^>]*>Spatial Permission<\/TabsTrigger>)/;
if (triggerListRegex.test(content)) {
    content = content.replace(triggerListRegex, '$1\n                <TabsTrigger value="department-2" className="tab-item">Department</TabsTrigger>');
    console.log('Successfully added TabsTrigger.');
} else {
    console.log('Could not find spatial-permission TabsTrigger.');
}

// 2. Find and Duplicate TabsContent
// We need to be careful to match the correct TabsContent block.
// The Department tab starts at <TabsContent value="department"> and ends at the next </TabsContent>
const deptContentStart = content.indexOf('<TabsContent value="department">');
if (deptContentStart !== -1) {
    let deptContentEnd = content.indexOf('</TabsContent>', deptContentStart);
    if (deptContentEnd !== -1) {
        deptContentEnd += '</TabsContent>'.length;
        const deptBlock = content.substring(deptContentStart, deptContentEnd);
        const deptBlockModified = deptBlock.replace('value="department"', 'value="department-2"');
        
        // Find the end of spatial-permission tab to insert after
        const spatialContentStart = content.indexOf('<TabsContent value="spatial-permission">');
        if (spatialContentStart !== -1) {
            let spatialContentEnd = content.indexOf('</TabsContent>', spatialContentStart);
            if (spatialContentEnd !== -1) {
                spatialContentEnd += '</TabsContent>'.length;
                
                // Insert after spatialContentEnd
                content = content.slice(0, spatialContentEnd) + '\n\n            {/* Department-2 Tab (Duplicated) */}\n            ' + deptBlockModified + content.slice(spatialContentEnd);
                console.log('Successfully duplicated Department TabsContent.');
            } else {
                console.log('Could not find end of spatial-permission TabsContent.');
            }
        } else {
            console.log('Could not find spatial-permission TabsContent.');
        }
    } else {
        console.log('Could not find end of department TabsContent.');
    }
} else {
    console.log('Could not find department TabsContent.');
}

fs.writeFileSync(filePath, content);
console.log('File updated successfully.');
