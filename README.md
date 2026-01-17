# Text2Arch

A professional, modern tool to encode/decode text into the "i use arch btw" quaternary format.

## Technologies

- React
- TypeScript
- Tailwind CSS
- Vite

## Development

1. Clone the repository

```bash
git clone https://github.com/mozi1924/text2arch.git
```

2. Install dependencies

```bash
npm install
```

3. Run dev server

```bash
npm run dev
```

4. Build

```bash
npm run build
```

## How it works

The tool uses a quaternary (base-4) encoding scheme mapping to the words:

```
0 = i
1 = use
2 = arch
3 = btw
```

Original concept by mozi1924.

## Protocol Versions

### ArchBase4 v2 (Current)

- **Feature**: Preserves paragraph structure (newlines) from original text.
- **Output**: Multi-line "carefully arranged" ciphertext.
- **Compatibility**: v2 decoder handles v2 encoded text correctly.

### v1 (Legacy)

- Single continuous stream of data.
- Newlines were encoded as bytes, losing visual structure.
