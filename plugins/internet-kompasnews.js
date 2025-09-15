import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const response = await fetch('https://api.platform.web.id/kompasnews');
    const news = await response.json();

    if (!news || news.length === 0) {
      return m.reply('Tidak ada berita terbaru.');
    }

    let message = '📰 *Berita Terbaru dari Kompas News:*\n\n';
    news.forEach((item, index) => {
      message += `${index + 1}. *${item.title}*\nLink: ${item.link}\n\n`;
    });

    await conn.sendMessage(m.chat, { text: message }, { quoted: m });
  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['kompasnews'];
handler.tags = ['internet'];
handler.command = ['kompasnews'];
handler.limit = true;

export default handler;