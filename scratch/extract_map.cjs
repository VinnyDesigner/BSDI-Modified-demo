const fs = require('fs');
const file = 'd:\\BSDI\\BSDI-V3\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';
let txt = fs.readFileSync(file, 'utf8');

const regex = /\.map\([\s\S]*?<td className="sticky-col-actions"/g;
let match;
while ((match = regex.exec(txt)) !== null) {
    const snippet = match[0].substring(0, 100);
    console.log(snippet);
}
