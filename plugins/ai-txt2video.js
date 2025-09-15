import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} <prompt>`;

  try {
    const response = await fetch(`https://api.platform.web.id/txt2video?prompt=${encodeURIComponent(text)}`);
    const data = await response.json();

    if (!data.url) throw new Error('Gagal mendapatkan data dari API!');

    const videoUrl = data.url;

    await conn.sendMessage(m.chat, {
      video: { url: videoUrl },
      caption: 'Video berhasil dihasilkan!'
    }, { quoted: m });

  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['txt2video <prompt>'];
handler.tags = ['ai'];
handler.command = ['txt2video'];
handler.limit = true;

export default handler;