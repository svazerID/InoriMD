import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `❌ Masukkan link Instagram Story!\n\nContoh:\n${usedPrefix + command} https://www.instagram.com/stories/username/1234567890/`;

  const apiUrl = `https://api.platform.web.id/igstory?urls_=${encodeURIComponent(text)}`;

  try {
    const response = await fetch(apiUrl);
    const result = await response.json();

    if (result.status !== 'success' || !result.data?.length) {
      throw '🚨 Gagal mendapatkan data dari API';
    }

    for (let story of result.data) {
      let caption = `👤 @${story.author?.username || '-'}\n🎬 ${story.title || 'Instagram Story'}`;

      if (story.type === 'video' && story.videoUrl) {
        await conn.sendMessage(m.chat, {
          video: { url: story.videoUrl },
          caption,
          mimetype: 'video/mp4'
        }, { quoted: m });
      } else if (story.type === 'image' && story.imageUrl) {
        await conn.sendMessage(m.chat, {
          image: { url: story.imageUrl },
          caption
        }, { quoted: m });
      }
    }

  } catch (e) {
    console.error('Error igstory:', e);
    m.reply('❌ Error: ' + (e.message || e));
  }
};

handler.help = ['igstory <url>'];
handler.tags = ['downloader'];
handler.command = /^igstory$/i;
handler.limit = true;

export default handler;