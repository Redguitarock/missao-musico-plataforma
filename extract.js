const fs = require('fs');
const pdf = require('pdf-parse');

const files = fs.readdirSync('./public');
const targetFile = files.find(f => f.endsWith('.pdf'));

if (!targetFile) {
    console.error("No PDF found!");
    process.exit(1);
}

const dataBuffer = fs.readFileSync('./public/' + targetFile);

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('./public/pdf_text.txt', data.text);
    console.log("Extraction complete. Text length: " + data.text.length);
}).catch(e => {
    console.error("Error reading PDF:", e);
});
