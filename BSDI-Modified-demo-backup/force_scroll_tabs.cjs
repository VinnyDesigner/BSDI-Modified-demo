const fs = require('fs');
const cssPath = 'd:\\Projects\\BSDI\\BSDI-Modified-demo\\src\\styles\\index.css';
const tsxPath = 'd:\\Projects\\BSDI\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';

// 1. Force override CSS with !important
let cssContent = fs.readFileSync(cssPath, 'utf8');

cssContent = cssContent.replace(
`.tabs-container {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
}`,
`.tabs-container {
  display: flex !important;
  justify-content: flex-start !important;
  gap: 16px !important;
  overflow-x: auto !important;
  white-space: nowrap !important;
  scrollbar-width: none !important;
  -ms-overflow-style: none !important;
  max-width: 100% !important;
  padding-bottom: 2px !important;
}`);

cssContent = cssContent.replace(
`.tab {
  flex-shrink: 0;
}`,
`.tab {
  flex-shrink: 0 !important;
}`);

fs.writeFileSync(cssPath, cssContent, 'utf8');


// 2. Ensure wrapper allows full overflow and justify-start is applied
let tsxContent = fs.readFileSync(tsxPath, 'utf8');

if (tsxContent.includes('className="custom-tabs-container tabs-container tabs-container bg-transparent w-full"')) {
    tsxContent = tsxContent.replace(
        'className="custom-tabs-container tabs-container tabs-container bg-transparent w-full"',
        'className="tabs-container bg-transparent w-full justify-start"'
    );
}

if (tsxContent.includes('className="tabs-wrapper mb-6 w-full"')) {
    tsxContent = tsxContent.replace(
        'className="tabs-wrapper mb-6 w-full"',
        'className="tabs-wrapper mb-6 w-full overflow-hidden"' // this might prevent overflow but they asked for the horizontal scrolling which happens inside the list. Actually overflow-hidden on wrapper is fine if list is overflow-auto. Or maybe just don't touch wrapper.
    );
     // Revert wrapper change just in case
    tsxContent = tsxContent.replace('className="tabs-wrapper mb-6 w-full overflow-hidden"', 'className="tabs-wrapper mb-6 w-full w-full max-w-full"');
}


fs.writeFileSync(tsxPath, tsxContent, 'utf8');
console.log('✅ Applied strict !important flags to ensure Radix overrides pass through.');
