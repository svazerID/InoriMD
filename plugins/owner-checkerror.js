import fs from 'fs';
import path from 'path';

let Fruatre = async (m, { conn }) => {
    let pluginFolder = './plugins';
    let errorList = [];

    // Cek apakah folder plugin ada
    if (!fs.existsSync(pluginFolder)) {
        return m.reply('❌ Folder plugins tidak ditemukan!');
    }

    // Baca semua file dalam folder plugins
    let files = fs.readdirSync(pluginFolder).filter(file => file.endsWith('.js'));

    for (let file of files) {
        try {
            // Import file sebagai modul ESM
            let plugin = await import(`file://${path.resolve(pluginFolder, file)}`);
            if (typeof plugin.default !== 'function') {
                throw new Error('Export default bukan fungsi');
            }
        } catch (err) {
            errorList.push(`❌ ${file}: ${err.message}`);
        }
    }

    // Kirim hasil pengecekan
    if (errorList.length === 0) {
        m.reply('✅ Semua fitur aman, tidak ada error!');
    } else {
        m.reply(`🚨 Ditemukan ${errorList.length} error pada fitur:\n\n` + errorList.join('\n'));
    }
};

Fruatre.help = ['checkerror'];
Fruatre.tags = ['owner'];
Fruatre.command = /^checkerror$/i;
Fruatre.rowner = true; // Hanya untuk owner

export default Fruatre;