import * as mammoth from 'mammoth';

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
  return new Promise(async (resolve, reject) => {
    try {
      // Use pdf-parse library for proper PDF text extraction
      const pdfParse = await import('pdf-parse');
      const arrayBuffer = await file.arrayBuffer();
      const data = await pdfParse.default(arrayBuffer);
      resolve(data.text || 'No text content found in PDF');
    } catch (error) {
      console.error('PDF parsing error:', error);
      reject(new Error('Failed to parse PDF file. Please ensure the PDF contains text content.'));
    }
  });
};

const parseDOCXFile = async (file: File): Promise<string> => {
  return new Promise(async (resolve, reject) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      resolve(result.value || 'No text content found in DOCX');
    } catch (error) {
      console.error('DOCX parsing error:', error);
      reject(new Error('Failed to parse DOCX file. Please ensure the file is a valid Word document.'));
    }
  });
};

// Text extraction now uses proper libraries (pdf-parse and mammoth)