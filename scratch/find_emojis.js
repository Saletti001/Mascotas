const fs = require('fs');
const path = require('path');

const rootDir = 'c:\\Users\\STT\\Documents\\GitHub\\Mascotas';
const emojiRegex = /[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F1E6}-\u{1F1FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F300}-\u{1F5FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u;

let output = '';

function scanDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            if (file === 'node_modules' || file === '.git' || file === '.agents' || file === 'scratch') {
                continue;
            }
            scanDir(fullPath);
        } else if (stat.isFile()) {
            const ext = path.extname(file);
            if (['.html', '.js', '.css', '.md'].includes(ext)) {
                checkFile(fullPath);
            }
        }
    }
}

function checkFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let printedFile = false;
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (emojiRegex.test(line)) {
            if (filePath.endsWith('EmojiReplacer.js') || filePath.endsWith('find_emojis.js')) {
                continue;
            }
            if (!printedFile) {
                output += `\n--- File: ${filePath} ---\n`;
                printedFile = true;
            }
            const match = line.match(emojiRegex);
            output += `Line ${i + 1}: ${line.trim()}  (Found: ${match[0]})\n`;
        }
    }
}

scanDir(rootDir);
fs.writeFileSync(path.join(rootDir, 'scratch', 'emojis_found.txt'), output, 'utf8');
console.log('Done scanning, output written to scratch/emojis_found.txt');
