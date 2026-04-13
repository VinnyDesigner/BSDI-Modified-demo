const fs = require('fs');
const file = 'd:\\BSDI\\BSDI-V3\\BSDI-Modified-demo\\src\\app\\pages\\modules\\DataAccessRequests1.tsx';
let txt = fs.readFileSync(file, 'utf8');

const matches = txt.match(/<td className="sticky-col-actions[\s\S]*?<\/td>/g);
if (matches) {
    console.log(matches[0]);
    console.log("-------");
    console.log(matches[1]);
}
