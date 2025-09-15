import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} <url>`;

  try {
    const response = await fetch(`https://api.platform.web.id/screenshot?url=${encodeURIComponent(text)}`);
    const data = await response.json();

    if (!data.fileUrl) throw new Error('Gagal mendapatkan data dari API!');

    const screenshotUrl = data.fileUrl;

    await conn.sendMessage(m.chat, {
      image: { url: screenshotUrl },
      caption: 'Berikut adalah screenshot dari URL yang diberikan!'
    }, { quoted: m });

  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['ssweb <url>'];
handler.tags = ['tools'];
handler.command = ['ssweb'];
handler.limit = true;

export default handler;