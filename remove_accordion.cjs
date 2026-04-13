const fs = require('fs');

function removeLines(filePath, startLine, endLine) {
    const data = fs.readFileSync(filePath, 'utf8');
    const lines = data.split(/\r?\n/);
    lines.splice(startLine - 1, endLine - startLine + 1);
    fs.writeFileSync(filePath, lines.join('\r\n'), 'utf8');
}

// DataAccessRequests1.tsx
// From line 1946 (empty) to 2053 (</AccordionItem>)
removeLines('d:/Projects/BSDI/BSDI-Modified-demo/src/app/pages/modules/DataAccessRequests1.tsx', 1946, 2053);

// DataAccessRequests.tsx
// From line 2203 (empty) to 2329 (</AccordionItem>)
removeLines('d:/Projects/BSDI/BSDI-Modified-demo/src/app/pages/modules/DataAccessRequests.tsx', 2203, 2329);

console.log('Successfully removed the Completed accordions.');
