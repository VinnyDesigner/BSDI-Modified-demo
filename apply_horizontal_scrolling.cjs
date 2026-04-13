const fs = require('fs');
const cssPath = 'd:\\Projects\\BSDI\\BSDI-Modified-demo\\src\\styles\\index.css';
const tsxPath = 'd:\\Projects\\BSDI\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';

// 1. Append CSS to index.css
let cssContent = fs.readFileSync(cssPath, 'utf8');
const newCss = `

/* Horizontal Scroll Tabs Configuration */
.tabs-container {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  white-space: nowrap;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.tabs-container::-webkit-scrollbar {
  display: none;
}

.tab {
  flex-shrink: 0;
}
`;

if (!cssContent.includes('.tabs-container')) {
    fs.writeFileSync(cssPath, cssContent + newCss, 'utf8');
    console.log('✅ Injected horizontal scrolling CSS rules into index.css.');
}

// 2. Add classes to JSX elements
let tsxContent = fs.readFileSync(tsxPath, 'utf8');

// Add "tabs-container" to the TabsList element
if (!tsxContent.includes('className="custom-tabs-container tabs-container')) {
    tsxContent = tsxContent.replace(
        'className="custom-tabs-container bg-transparent w-full"',
        'className="custom-tabs-container tabs-container bg-transparent w-full"'
    );
     // In case it has a different class arrangement
     tsxContent = tsxContent.replace(
        '<TabsList className="custom-tabs-container',
        '<TabsList className="custom-tabs-container tabs-container'
     );
}

// Add "tab" to TabsTrigger elements
if (!tsxContent.includes('className="tab-item tab"')) {
    tsxContent = tsxContent.replace(/className="tab-item"/g, 'className="tab-item tab"');
}

fs.writeFileSync(tsxPath, tsxContent, 'utf8');
console.log('✅ Applied CSS hooks into DataAccessRequests1.tsx.');
