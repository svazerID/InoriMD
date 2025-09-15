import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} <prompt>`;

  try {
    const response = await fetch(`https://api.platform.web.id/felosearch?prompt=${encodeURIComponent(text)}`);
    const data = await response.json();

    if (!data.hasil) throw new Error('Gagal mendapatkan data dari API!');

    const hasil = data.hasil;

    await conn.sendMessage(m.chat, {
      text: hasil,
      caption: 'Berikut adalah hasil kritik terhadap pemerintah Indonesia:'
    }, { quoted: m });

  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['felosearch <prompt>'];
handler.tags = ['ai'];
handler.command = ['felosearch'];
handler.limit = true;

export default handler;