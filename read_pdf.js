import fs from 'fs';
import PDFParser from 'pdf2json';

const pdfParser = new PDFParser(this, 1);

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
pdfParser.on("pdfParser_dataReady", pdfData => {
    fs.writeFileSync("pdf_output.txt", pdfParser.getRawTextContent());
    console.log("PDF parsed successfully to pdf_output.txt");
});

pdfParser.loadPDF("TRA_ Data Access Form.pdf");
