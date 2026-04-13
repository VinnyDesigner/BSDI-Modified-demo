const fs = require('fs');

const file1 = 'd:\\BSDI\\BSDI-V3\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';
const file2 = 'd:\\BSDI\\BSDI-V3\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests.tsx';

const cssToInject = `
              /* Reviewer Overrides to completely remove the Actions column */
              \${isReviewer ? \`
                th.sticky-col-actions, 
                th.grp-sticky-actions,
                td.sticky-col-actions,
                td.grp-sticky-actions,
                .request-table-header > div:last-child, 
                .request-table-row > div:last-child { 
                  display: none !important; 
                }
                .request-table-header, .request-table-row {
                  grid-template-columns: 160px 200px 120px 200px 180px 160px 1fr !important;
                }
              \` : ''}
`;

function processFile(file) {
    if(!fs.existsSync(file)) return;
    let txt = fs.readFileSync(file, 'utf8');
    
    // Add sticky class
    txt = txt.replace('<th className="text-[11px] font-bold text-[#6B7280]">Actions</th>', '<th className="sticky-col-actions text-[11px] font-bold text-[#6B7280]">Actions</th>');
    
    const styleRegex = /(height:\s*2px;\s*background-color:\s*#EF4444;\s*\}\s*`\}\<\/style>)/g;
    
    // Inject if not present
    if (!txt.includes('Reviewer Overrides to completely remove the Actions column')) {
        txt = txt.replace(styleRegex, (match) => {
            return cssToInject + match;
        });
    }

    fs.writeFileSync(file, txt);
    console.log(`Updated ${file}`);
}

processFile(file1);
processFile(file2);
