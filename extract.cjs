const fs = require('fs');
const pdfParser = require('pdf-parse');
// Some versions export directly, some default
const pdf = typeof pdfParser === 'function' ? pdfParser : pdfParser.default;

const dataBuffer = fs.readFileSync('./public/temp.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('./temp_text.txt', data.text);
    console.log("Extraction complete. Text length: " + data.text.length);
}).catch(e => {
    console.error("Error reading PDF:", e);
});
