import Tesseract from 'tesseract.js';

export interface OCRResult {
  success: boolean;
  extractedText: string;
  confidence: number;
  name?: string;
  idNumber?: string;
  institution?: string;
  error?: string;
}

/**
 * Process ID card image with OCR
 * @param file - Image file to process
 * @returns OCR result with extracted data
 */
export const processIDCard = async (file: File): Promise<OCRResult> => {
  try {
    console.log('🔍 Starting OCR processing...');
    
    // Perform OCR on the image
    const result = await Tesseract.recognize(
      file,
      'eng',
      {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      }
    );

    const extractedText = result.data.text;
    const confidence = result.data.confidence;

    console.log('✅ OCR completed');
    console.log('Confidence:', confidence);
    console.log('Extracted text:', extractedText);

    // Parse extracted text for name, ID number, and institution
    const parsedData = parseIDCardText(extractedText);

    return {
      success: true,
      extractedText,
      confidence,
      ...parsedData
    };
  } catch (error) {
    console.error('❌ OCR processing failed:', error);
    return {
      success: false,
      extractedText: '',
      confidence: 0,
      error: error instanceof Error ? error.message : 'OCR processing failed'
    };
  }
};

/**
 * Parse extracted text to identify name, ID number, and institution
 */
const parseIDCardText = (text: string): { name?: string; idNumber?: string; institution?: string } => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  console.log('🔍 Parsing ID card text...');
  console.log('Lines extracted:', lines);
  
  const result: { name?: string; idNumber?: string; institution?: string } = {};

  // Common patterns for ID cards
  const namePatterns = [
    // Match "Name" or "name" followed by the actual name (handles quotes, colons, etc.)
    /name[:\s"]+([A-Z][A-Z\s]+[A-Z])/i,
    // Match all-caps names (common in ID cards)
    /^([A-Z]{2,}\s+[A-Z]{2,}(?:\s+[A-Z]{2,})?)\s*[|\]]?\s*$/,
    // Match standard capitalized names
    /^([A-Z][a-z]+\s+[A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)\s*$/,
  ];

  const idPatterns = [
    /(?:reg|registration|id|card|number|no)[:\s#.]*([A-Z0-9\-]+)/i,
    /\b([A-Z]{2,}\d{4,})\b/,
    /\b(\d{6,})\b/,
  ];

  const institutionPatterns = [
    /(?:university|college|institute|school)[:\s]+([a-z\s]+)/i,
    /(?:of|from)[:\s]+([a-z\s]+(?:university|college|institute|school))/i,
  ];

  // Try to extract name
  for (const pattern of namePatterns) {
    const match = text.match(pattern);
    if (match && match[1] && match[1].length > 3) {
      // Clean up the name: remove trailing pipes, brackets, quotes
      let cleanName = match[1].trim().replace(/[|"\]]+$/g, '').trim();
      // Convert to title case if all caps
      if (cleanName === cleanName.toUpperCase()) {
        cleanName = cleanName.split(' ')
          .map(word => word.charAt(0) + word.slice(1).toLowerCase())
          .join(' ');
      }
      result.name = cleanName;
      console.log('✅ Name found:', result.name);
      break;
    }
  }

  // Try line-by-line name extraction if patterns didn't work
  if (!result.name) {
    for (const line of lines) {
      // Look for lines that contain "Name" keyword
      if (/name/i.test(line)) {
        // Extract everything after "Name"
        const nameMatch = line.match(/name[:\s"]+(.+)/i);
        if (nameMatch && nameMatch[1]) {
          let cleanName = nameMatch[1].trim().replace(/[|"\]]+$/g, '').trim();
          if (cleanName.length > 3) {
            // Convert to title case if all caps
            if (cleanName === cleanName.toUpperCase()) {
              cleanName = cleanName.split(' ')
                .map(word => word.charAt(0) + word.slice(1).toLowerCase())
                .join(' ');
            }
            result.name = cleanName;
            console.log('✅ Name found (line-by-line):', result.name);
            break;
          }
        }
      }
    }
  }

  // Try to extract ID number
  for (const pattern of idPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      result.idNumber = match[1].trim();
      console.log('✅ ID Number found:', result.idNumber);
      break;
    }
  }

  // Try to extract institution
  for (const pattern of institutionPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      result.institution = match[1].trim();
      console.log('✅ Institution found:', result.institution);
      break;
    }
  }

  console.log('📋 Parsed result:', result);
  return result;
};

/**
 * Calculate match confidence between extracted name and form name
 * Uses fuzzy matching to account for OCR errors
 */
export const calculateNameMatch = (extractedName: string, formName: string): number => {
  if (!extractedName || !formName) return 0;

  const normalize = (str: string) => str.toLowerCase().trim().replace(/\s+/g, ' ');
  const extracted = normalize(extractedName);
  const form = normalize(formName);

  // Exact match
  if (extracted === form) return 100;

  // Check if one contains the other
  if (extracted.includes(form) || form.includes(extracted)) return 85;

  // Simple Levenshtein distance for fuzzy matching
  const distance = levenshteinDistance(extracted, form);
  const maxLength = Math.max(extracted.length, form.length);
  const similarity = ((maxLength - distance) / maxLength) * 100;

  return Math.round(similarity);
};

/**
 * Calculate Levenshtein distance between two strings
 */
const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};
