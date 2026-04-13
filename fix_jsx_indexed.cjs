const fs = require('fs');
const path = require('path');

const filePath = 'src/app/pages/modules/DataAccessRequests.tsx';
const absolutePath = path.resolve('d:/Projects/BSDI/BSDI-Modified-demo', filePath);

let content = fs.readFileSync(absolutePath, 'utf8');
let lines = content.split(/\r?\n/);

// We know from Select-String that line 1481 is '                        ))}' 
// (1-indexed, so index 1480)
// and 1483 is '                  </AccordionContent>' (index 1482)

if (lines[1480].includes('))}') && lines[1482].includes('</AccordionContent>')) {
    console.log("Found the target lines accurately.");
    const newLines = [
        '                        ))}',
        '                      </div>',
        '                    </div>'
    ];
    // Replace lines 1481 and 1482 (indices 1480 and 1481)
    // Note: line 1483 (index 1482) is kept as the end marker.
    lines.splice(1480, 2, ...newLines);
    
    fs.writeFileSync(absolutePath, lines.join('\n'), 'utf8');
    console.log("Successfully fixed the JSX error via line-by-line replacement.");
} else {
    console.log("Could not find the target lines at the expected indices.");
    // Try searching for the exact line combination
    const targetBlock = '                        ))}\n                    </div>\n                  </AccordionContent>';
    // ... but that failed before.
}
