import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} <prompt>`;

  try {
    const response = await fetch(`https://api.platform.web.id/aifreebox-image?prompt=${encodeURIComponent(text)}&aspectRatio=9:16&slug=ai-art-generator`);
    const data = await response.json();

    if (!data.imageUrl) throw new Error('Gagal mendapatkan data dari API!');

    const imageUrl = data.imageUrl;

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: 'Gambar berhasil dihasilkan!'
    }, { quoted: m });

  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['aifreebox <prompt>'];
handler.tags = ['ai'];
handler.command = ['aifreebox'];
handler.limit = true;

export default handler;