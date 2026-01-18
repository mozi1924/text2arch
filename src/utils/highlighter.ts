import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';
import { v1, v2 } from './converter';

// We need to define text encoding logic here that mirrors the converter, 
// but applied to tokens.

export function highlightSource(code: string): string {
  return Prism.highlight(code, Prism.languages.typescript, 'typescript');
}

export function highlightArch(archCode: string, sourceCode: string, version: 'v1' | 'v2'): string {
    // This is tricky. The archCode provided by the editor is just text.
    // If the user *types* in the right pane, we can't easily map it back to source tokens perfectly 
    // unless we decode it first.
    // But the requirement implies: "map UNENCODED text code highlight TO ENCODED text".
    // This suggests we should use the **source code** to determine the highlighting of the **encoded text**.
    
    // Strategy:
    // 1. Tokenize SOURCE code.
    // 2. For each token:
    //    a. Encode the token's content using the selected version.
    //    b. Wrap the encoded content in a span with the token's class.
    // 3. Join them.
    // This assumes the `archCode` passed in matches exactly what `sourceCode` produces. 
    // If the user edits the Arch pane manually, this mapping breaks.
    // However, for the primary use case (encoding), this works.
    
    // If sourceCode is empty, or mismatch, fallback to plain text.
    if (!sourceCode) return archCode;

    const converter = version === 'v1' ? v1 : v2;
    
    // We treat the source as TypeScript for coloring
    const tokens = Prism.tokenize(sourceCode, Prism.languages.typescript);

    // Helper to process tokens recursively (Prism tokens can be nested)
    const encodeToken = (token: string | Prism.Token): string => {
        if (typeof token === 'string') {
             return converter.encode(token);
        } else if (Array.isArray(token.content)) {
            // Nested tokens. Join with space, but clean up newline surroundings
            const raw = (token.content as Array<string | Prism.Token>).map(encodeToken).join(' ');
            const encodedContent = raw.replace(/ \n/g, '\n').replace(/\n /g, '\n');
            return `<span class="token ${token.type}">${encodedContent}</span>`;
        } else {
            // Single content
            const content = token.content.toString();
            const encoded = converter.encode(content);
            return `<span class="token ${token.type}">${encoded}</span>`;
        }
    };

    // Join with space, then remove spaces around newlines to prevent weird indentation
    const raw = tokens.map(encodeToken).join(' ');
    return raw.replace(/ \n/g, '\n').replace(/\n /g, '\n');
}
