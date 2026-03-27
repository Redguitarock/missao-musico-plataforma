const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');

async function testPdf() {
    const filePath = path.join(process.cwd(), 'public', 'Ebook 2 - como eliminar os bloqueios mentais para músicos.pdf');
    console.log('Lendo arquivo:', filePath);
    
    try {
        const buffer = fs.readFileSync(filePath);
        console.log('Tamanho do Buffer:', buffer.length, 'bytes');
        
        const data = await pdf(buffer);
        console.log('--- TESTE SUCESSO ---');
        console.log('Páginas:', data.numpages);
        console.log('Caracteres extraídos:', data.text.length);
        console.log('Início do texto:', data.text.slice(0, 100));
    } catch (err) {
        console.error('--- TESTE FALHOU ---');
        console.error('Erro:', err.message);
    }
}

testPdf();
