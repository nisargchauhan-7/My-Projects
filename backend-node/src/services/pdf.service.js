// PDF text extraction using pdf-parse. Returns plain text; throws on failure (caller falls back to demo).
const fs = require('fs');

async function extractText(filePath) {
  const pdfParse = require('pdf-parse');
  const buffer = fs.readFileSync(filePath);
  const data = await pdfParse(buffer);
  return data.text || '';
}

function validate(file, maxMb = 20) {
  const allowed = ['application/pdf', 'text/plain',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
  if (!file) throw new Error('No file uploaded');
  if (file.size > maxMb * 1024 * 1024) throw new Error(`File exceeds ${maxMb}MB`);
  if (!allowed.includes(file.mimetype)) throw new Error('Unsupported file type');
  return true;
}

module.exports = { extractText, validate };
