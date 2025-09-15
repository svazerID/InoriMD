import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} <url>`;

  try {
    const response = await fetch(`https://api.platform.web.id/cookpad-detail?url=${encodeURIComponent(text)}`);
    const data = await response.json();

    if (!data.id) throw new Error('Gagal mendapatkan data dari API!');

    const result = `
      *Judul:* ${data.title}
      *Penulis:* [${data.author.name}](${data.author.url})
      *Waktu Persiapan:* ${data.prepTime || 'Tidak diketahui'}
      *Deskripsi:* ${data.description}
      *Gambar Resep:* ![Image](${data.imageUrl})

      *Bahan-bahan:*
      ${data.ingredients.map(ingredient => `- ${ingredient}`).join('\n')}

      *Langkah-langkah:*
      ${data.steps.map((step, index) => `\n${index + 1}. ${step.text}`).join('\n')}
    `;

    await conn.sendMessage(m.chat, {
      text: result,
      caption: 'Berikut adalah detail resep yang ditemukan!'
    }, { quoted: m });

  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['cookpad-detail <url>'];
handler.tags = ['internet'];
handler.command = ['cookpad-detail'];
handler.limit = true;

export default handler;