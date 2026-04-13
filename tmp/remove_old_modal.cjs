const fs = require('fs');
const path = require('path');

const filePath = path.join('d:', 'Projects', 'BSDI', 'BSDI-Modified-demo', 'src', 'app', 'pages', 'modules', 'DataAccessRequests1.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// The old modal starts at line 2980 (relative to the previous view_file)
// It uses <Dialog open={mapPreviewOpen} onOpenChange={setMapPreviewOpen}> and has "w-[60vw]"
const oldModalPattern = /<Dialog open=\{mapPreviewOpen\} onOpenChange=\{setMapPreviewOpen\}>\s*<DialogContent className="w-\[60vw\][\s\S]*?<\/DialogContent>\s*<\/Dialog>[\s\S]*?<Dialog open=\{mapPreviewOpen\} onOpenChange=\{setMapPreviewOpen\}>/;

// Wait, the previous view showed ONE modal at 2980 and I added another one at the end.
// So there are exactly TWO modals with the same open/onOpenChange.
// I need to remove the first one (the 60vw one).

const oldModalRegex = /<Dialog open=\{mapPreviewOpen\} onOpenChange=\{setMapPreviewOpen\}>\s*<DialogContent className="w-\[60vw\][\s\S]*?<\/DialogContent>\s*<\/Dialog>/;

if (oldModalRegex.test(content)) {
    content = content.replace(oldModalRegex, '');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully removed the old/duplicate Dataset Preview modal.');
} else {
    console.error('Could not find the old Dataset Preview modal pattern.');
    process.exit(1);
}
