import fetch from 'node-fetch';
import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || q.mediaType || '';

  if (/^image/.test(mime) && !/webp/.test(mime)) {
    m.reply('⏳ Sedang memproses gambar, mohon tunggu...');

    const img = await q.download();
    const out = await uploadImage(img);
    if (!out) throw new Error('Gagal upload gambar!');

    try {
      const response = await fetch(`https://api.platform.web.id/ghibli?imageUrl=${encodeURIComponent(out)}`);
      const data = await response.json();

      if (!data.status) throw new Error('Gagal mendapatkan data dari API!');

      const imageUrl = data.image.url;

      await conn.sendMessage(m.chat, {
        image: { url: imageUrl },
        caption: 'Gambar berhasil diedit dengan gaya Ghibli!'
      }, { quoted: m });

    } catch (e) {
      console.error('Error:', e);
      m.reply('🚨 Error: ' + (e.message || e));
    }
  } else {
    m.reply(`📷 Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
  }
}

handler.help = ['ghibli'];
handler.tags = ['ai'];
handler.command = ['ghibli'];
handler.limit = true;

export default handler;