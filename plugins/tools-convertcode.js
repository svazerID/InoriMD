let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    let codeToConvert = text || (m.quoted && m.quoted.text);
    if (!codeToConvert) throw `Masukkan atau reply kode yang ingin diubah`;

    let result;
    if (command === 'toesm') {
        result = convertCJSToESM(codeToConvert);
    } else if (command === 'tocjs') {
        result = convertESMToCJS(codeToConvert);
    } else {
        throw `Perintah tidak dikenal`;
    }

    m.reply(result);
};

handler.help = ['toesm <kode>', 'tocjs <kode>'];
handler.tags = ['tools'];
handler.command = /^(toesm|tocjs)$/i;
handler.limit = true;

export default handler;

// Ubah CJS ke ESM
function convertCJSToESM(code) {
    return code
        // require -> import
        .replace(/(?:const|let|var)\s+(\w+)\s*=\s*require\(['"](.+?)['"]\);?/g, 'import $1 from \'$2\';')
        // module.exports = sesuatu
        .replace(/module\.exports\s*=\s*(\{?.*?\}?);?/g, 'export default $1;')
        // exports.nama = sesuatu
        .replace(/exports\.(\w+)\s*=\s*(.*?);/g, 'export const $1 = $2;')
        // export default ;handler; -> export default handler;
        .replace(/export\s+default\s+;?(\w+);?/g, 'export default $1;');
}

// Ubah ESM ke CJS
function convertESMToCJS(code) {
    return code
        // import default
        .replace(/import\s+(\w+)\s+from\s+['"](.+?)['"];?/g, 'const $1 = require(\'$2\');')
        // import * as nama from ...
        .replace(/import\s+\*\s+as\s+(\w+)\s+from\s+['"](.+?)['"];?/g, 'const $1 = require(\'$2\');')
        // import { a, b } from ...
        .replace(/import\s+\{([^}]+)\}\s+from\s+['"](.+?)['"];?/g, (_, members, path) => {
            const imports = members.split(',').map(s => s.trim()).join(', ');
            return `const { ${imports} } = require('${path}');`;
        })
        // export default nama
        .replace(/export\s+default\s+;?(\w+);?/g, 'module.exports = $1;')
        // export const nama = sesuatu
        .replace(/export\s+const\s+(\w+)\s*=\s*(.*?);/g, 'exports.$1 = $2;');
}