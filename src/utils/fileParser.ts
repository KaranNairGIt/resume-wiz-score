export const parseFile = async (file: File): Promise<string> => {
  const fileType = file.type;
  const fileName = file.name.toLowerCase();

  try {
    if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
      return await parseTextFile(file);
    } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      return await parsePDFFile(file);
    } else if (
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.docx')
    ) {
      return await parseDOCXFile(file);
    } else {
      throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT files.');
    }
  } catch (error) {
    console.error('File parsing error:', error);
    throw new Error('Failed to parse file. Please check if the file is valid and try again.');
  }
};

const parseTextFile = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      resolve(text);
    };
    reader.onerror = () => reject(new Error('Failed to read text file'));
    reader.readAsText(file);
  });
};

const parsePDFFile = async (file: File): Promise<string> => {
  // For browser-based PDF parsing, we'll use a simple approach
  // In a production app, you might want to use PDF.js or send to a server
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        // For now, we'll extract basic text content
        // This is a simplified approach - in production, use PDF.js
        const uint8Array = new Uint8Array(arrayBuffer);
        const text = extractTextFromPDFBuffer(uint8Array);
        resolve(text);
      } catch (error) {
        reject(new Error('Failed to parse PDF file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read PDF file'));
    reader.readAsArrayBuffer(file);
  });
};

const parseDOCXFile = async (file: File): Promise<string> => {
  // For browser-based DOCX parsing, we'll use a simple approach
  // In production, you might want to use mammoth.js properly or send to server
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        // Simplified DOCX text extraction
        const text = extractTextFromDOCXBuffer(arrayBuffer);
        resolve(text);
      } catch (error) {
        reject(new Error('Failed to parse DOCX file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read DOCX file'));
    reader.readAsArrayBuffer(file);
  });
};

// Simplified text extraction functions
// In production, use proper libraries like PDF.js and mammoth.js
const extractTextFromPDFBuffer = (buffer: Uint8Array): string => {
  let text = '';
  const decoder = new TextDecoder('utf-8');
  const content = decoder.decode(buffer);
  
  // Very basic text extraction from PDF
  // This is a fallback - recommend using PDF.js in production
  const textRegex = /BT\s*.*?ET/g;
  const matches = content.match(textRegex);
  
  if (matches) {
    matches.forEach(match => {
      const cleanText = match
        .replace(/BT\s*/, '')
        .replace(/ET/, '')
        .replace(/Tf\s*/, '')
        .replace(/Td\s*/, ' ')
        .replace(/Tj\s*/, ' ')
        .replace(/TJ\s*/, ' ')
        .replace(/[()]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      text += cleanText + ' ';
    });
  }
  
  // If no text extracted, return a message
  if (!text.trim()) {
    text = 'PDF content detected but text extraction limited. For best results, please use a text-based PDF or convert to DOCX/TXT format.';
  }
  
  return text.trim();
};

const extractTextFromDOCXBuffer = (buffer: ArrayBuffer): string => {
  // Very basic DOCX text extraction
  // In production, use mammoth.js for proper extraction
  const decoder = new TextDecoder('utf-8');
  let content = '';
  
  try {
    content = decoder.decode(buffer);
  } catch {
    // Try with different encoding
    content = new TextDecoder('latin1').decode(buffer);
  }
  
  // Extract text content from XML-like structure
  let text = content
    .replace(/<[^>]*>/g, ' ') // Remove XML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
  
  // If no meaningful text extracted, return a message
  if (!text || text.length < 50) {
    text = 'DOCX content detected but text extraction limited. For best results, please save as TXT format or copy-paste the content.';
  }
  
  return text;
};