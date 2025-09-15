import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} <prompt>`;

  try {
    const response = await fetch(`https://api.platform.web.id/remakerai?prompt=${encodeURIComponent(text)}&rasioo=1:1&stylee=ghibli1`);
    const data = await response.json();

    if (!data.url) throw new Error('Gagal mendapatkan data dari API!');

    const imageUrl = data.url;

    await conn.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: 'Gambar berhasil dihasilkan dengan gaya Ghibli!'
    }, { quoted: m });

  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['remakerai <prompt>'];
handler.tags = ['ai'];
handler.command = ['remakerai'];
handler.limit = true;

export default handler;