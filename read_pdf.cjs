const fs = require('fs');
const pdfLib = require('pdf-parse');

let dataBuffer = fs.readFileSync('TRA_ Data Access Form.pdf');

// Let's try pdfLib.PDFParse or something
if (pdfLib.PDFParse) {
  // wait we don't know the exact API. 
  // Let's just use pdf2json
}
