import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} <prompt>`;

  try {
    const response = await fetch(`https://api.platform.web.id/deepimg?prompt=${encodeURIComponent(text)}`);
    const data = await response.json();

    if (!data.status) throw new Error('Gagal mendapatkan data dari API!');

    const imageUrl = data.url;

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: 'Gambar berhasil dihasilkan!'
    }, { quoted: m });

  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['deepimg <prompt>'];
handler.tags = ['ai'];
handler.command = ['deepimg'];
handler.limit = true;

export default handler;