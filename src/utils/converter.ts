
// --- Shared Helpers ---

function encodeBlock(text: string): string {
  if (!text) return '';
  const encoder = new TextEncoder();
  const binaryRepresentation = Array.from(encoder.encode(text)).map(byte =>
      byte.toString(2).padStart(8, '0')
  ).join('');

  let base4Representation = '';
  for (let i = 0; i < binaryRepresentation.length; i += 2) {
      base4Representation += parseInt(binaryRepresentation.slice(i, i + 2), 2).toString();
  }
  return base4Representation;
}

function decodeBlock(base4Text: string): string {
  if (!base4Text) return '';
  const binaryRepresentation = Array.from(base4Text).map(digit => 
      parseInt(digit).toString(2).padStart(2, '0')
  ).join('');

  const bytes: number[] = [];
  for (let i = 0; i < binaryRepresentation.length; i += 8) {
      bytes.push(parseInt(binaryRepresentation.slice(i, i + 8), 2));
  }

  const decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(bytes));
}

const replacements: Record<string, string> = { '0': 'i', '1': 'use', '2': 'arch', '3': 'btw' };
const reverseReplacements: Record<string, string> = { 'i': '0', 'use': '1', 'arch': '2', 'btw': '3' };

// --- V1 Protocol (Continuous) ---

export const v1 = {
  encode(text: string): string {
    const base4 = encodeBlock(text);
    return Array.from(base4).map(digit => replacements[digit]).join(' ');
  },

  decode(archText: string): string {
    const words = archText.trim().split(/\s+/);
    const base4 = words.map(word => {
        if (!reverseReplacements[word]) throw new Error(`Invalid word: ${word}`);
        return reverseReplacements[word];
    }).join('');
    return decodeBlock(base4);
  }
}

// --- V2 Protocol (Paragraphs) ---

export const v2 = {
  encode(text: string): string {
    return text.split('\n').map(line => {
      if (!line) return '';
      const base4 = encodeBlock(line);
      return Array.from(base4).map(digit => replacements[digit]).join(' ');
    }).join('\n');
  },

  decode(archText: string): string {
    return archText.split('\n').map(line => {
      const trimmed = line.trim();
      if (!trimmed) return '';
      const words = trimmed.split(/\s+/);
      const base4 = words.map(word => {
          if (!reverseReplacements[word]) throw new Error(`Invalid word: ${word}`);
          return reverseReplacements[word];
      }).join('');
      return decodeBlock(base4);
    }).join('\n');
  }
}
