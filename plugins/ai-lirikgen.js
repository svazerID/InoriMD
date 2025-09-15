import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} <topik>`;

  try {
    const response = await fetch(`https://api.platform.web.id/lyrics-generator?topic=${encodeURIComponent(text)}&genre=pop&mood=happy&structure=verse_chorus&language=id`);
    const data = await response.json();

    if (!data.status) throw new Error('Gagal mendapatkan data dari API!');

    const { title, lyrics } = data.data;

    await conn.sendMessage(m.chat, {
      text: `*${title}*\n\n${lyrics}`,
      caption: 'Berikut adalah lirik yang dihasilkan:'
    }, { quoted: m });

  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['lirikgen <topik>'];
handler.tags = ['ai'];
handler.command = ['lirikgen'];
handler.limit = true;

export default handler;