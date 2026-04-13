const fs = require('fs');
const path = require('path');

const filePath = 'src/app/pages/modules/DataAccessRequests.tsx';
const absolutePath = path.resolve('d:/Projects/BSDI/BSDI-Modified-demo', filePath);

let content = fs.readFileSync(absolutePath, 'utf8');

// Find the area after Department Completed map
const mapEnd = '                        ))}';
const accordionContentEnd = '                  </AccordionContent>';

const mapEndIndex = content.indexOf(mapEnd);
const accordionEndIndex = content.indexOf(accordionContentEnd, mapEndIndex);

if (mapEndIndex === -1 || accordionEndIndex === -1) {
    console.log("Markers not found");
    process.exit(1);
}

// Check how many divs are between them
const subset = content.substring(mapEndIndex + mapEnd.length, accordionEndIndex);
const divCount = (subset.match(/<\/div>/g) || []).length;

if (divCount === 1) {
    // We need 2 divs total for: request-table-container AND px-6 pb-6...
    console.log("Only 1 div found, adding the missing one.");
    const newSubset = `
                      </div>
                    </div>
                  `;
    const newContent = content.substring(0, mapEndIndex + mapEnd.length) + newSubset + content.substring(accordionEndIndex);
    fs.writeFileSync(absolutePath, newContent, 'utf8');
    console.log("Successfully fixed the JSX error.");
} else {
    console.log(`Found ${divCount} divs, no fix needed or already fixed.`);
}
