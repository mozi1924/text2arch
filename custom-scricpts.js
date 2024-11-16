function textToBase4(text) {
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

function base4ToText(base4Text) {
    const binaryRepresentation = Array.from(base4Text).map(digit => 
        parseInt(digit).toString(2).padStart(2, '0')
    ).join('');

    const bytes = [];
    for (let i = 0; i < binaryRepresentation.length; i += 8) {
        bytes.push(parseInt(binaryRepresentation.slice(i, i + 8), 2));
    }

    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(bytes));
}

function replaceBase4WithWords(base4Text) {
    const replacements = { '0': 'i', '1': 'use', '2': 'arch', '3': 'btw' };
    return Array.from(base4Text).map(digit => replacements[digit]).join(' ');
}

function wordsToBase4(replacedText) {
    const replacements = { 'i': '0', 'use': '1', 'arch': '2', 'btw': '3' };
    const words = replacedText.split(' ');
    return words.map(word => replacements[word]).join('');
}

function processText() {
    const mode = document.getElementById("mode").value;
    const inputText = document.getElementById("inputText").value;
    let result = '';

    if (mode === "decrypt") {
        try {
            const base4Text = wordsToBase4(inputText);
            result = base4ToText(base4Text);
        } catch (e) {
            result = "Invalid format for decryption.";
        }
    } else {
        const base4Text = textToBase4(inputText);
        result = replaceBase4WithWords(base4Text);
    }

    document.getElementById("result").innerText = result;
}

function copyToClipboard() {
    const textToCopy = document.getElementById("result").innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        mdui.snackbar({ message: 'Text copied to clipboard!' });
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}