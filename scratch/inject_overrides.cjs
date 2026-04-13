const fs = require('fs');

const file = 'd:\\BSDI\\BSDI-V3\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests.tsx';

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

function inject(file) {
    if (!fs.existsSync(file)) return;
    let txt = fs.readFileSync(file, 'utf8');

    // Find the end of the style tag right before the JSX structure starts for TabsList
    const styleEndRegex = /(height:\s*2px;\s*background-color:\s*#EF4444;\s*\}\s*`\}<\/style>)/g;
    
    if (!txt.includes('Reviewer Overrides') && txt.match(styleEndRegex)) {
        txt = txt.replace(styleEndRegex, (match) => {
            return cssToInject + match;
        });
        fs.writeFileSync(file, txt);
        console.log(`Injected successfully in ${file}`);
    } else {
        console.log(`Could not inject in ${file} (already present or no match)`);
    }
}

inject(file);
