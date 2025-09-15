import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} <teks>`;

  try {
    const response = await fetch(`https://api.platform.web.id/webpilot?text=${encodeURIComponent(text)}`);
    const data = await response.json();

    if (!data.hasil) throw new Error('Gagal mendapatkan data dari API!');

    const hasil = data.hasil;

    await conn.sendMessage(m.chat, {
      text: hasil,
      caption: 'Berikut adalah penjelasan mengenai korupsi di Indonesia:'
    }, { quoted: m });

  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['webpilot <teks>'];
handler.tags = ['ai'];
handler.command = ['webpilot'];
handler.limit = true;

export default handler;