import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} <query>`;

  try {
    const response = await fetch(`https://api.platform.web.id/cookpad-search?query=${encodeURIComponent(text)}`);
    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) throw new Error('Gagal mendapatkan data dari API!');

    let result = 'Berikut adalah resep bebek goreng yang ditemukan:\n\n';
    data.forEach(recipe => {
      result += `*Judul:* ${recipe.title}\n*Penulis:* ${recipe.author}\n*Waktu Persiapan:* ${recipe.prepTime || 'Tidak diketahui'}\n*Link:* ${recipe.url}\n\n`;
      if (recipe.imageUrl) {
        result += `![Image](${recipe.imageUrl})\n\n`;
      }
    });

    await conn.sendMessage(m.chat, {
      text: result,
      caption: 'Resep berhasil ditemukan!'
    }, { quoted: m });

  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['cookpad <query>'];
handler.tags = ['internet'];
handler.command = ['cookpad'];
handler.limit = true;

export default handler;