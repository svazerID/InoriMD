import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} <query>`;

  try {
    const response = await fetch(`https://api.platform.web.id/freepik/search?q=${encodeURIComponent(text)}`);
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) throw new Error('Gagal mendapatkan data dari API!');

    let result = 'Berikut adalah gambar yang ditemukan:\n\n';
    data.forEach(item => {
      result += `*Judul:* ${item.title}\n*Jenis:* ${item.type}\n*Penulis:* [${item.author.name}](${item.author.url})\n*Link Gambar:* [Preview](${item.previewUrl})\n*Link Sumber:* [${item.url}]\n\n`;
    });

    await conn.sendMessage(m.chat, {
      text: result,
      caption: 'Hasil pencarian gambar berhasil ditemukan!'
    }, { quoted: m });

  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['freepik <query>'];
handler.tags = ['internet'];
handler.command = ['freepik'];
handler.limit = true;

export default handler;