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
      const response = await fetch(`https://api.platform.web.id/img2prompt?imageUrl=${encodeURIComponent(out)}&model=general&language=id`);
      const data = await response.json();

      if (!data.success) throw new Error('Gagal mendapatkan data dari API!');

      const prompt = data.prompt;

      await conn.sendMessage(m.chat, {
        text: prompt,
        caption: 'Berikut adalah prompt yang dihasilkan dari gambar:'
      }, { quoted: m });

    } catch (e) {
      console.error('Error:', e);
      m.reply('🚨 Error: ' + (e.message || e));
    }
  } else {
    m.reply(`📷 Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
  }
}

handler.help = ['img2prompt'];
handler.tags = ['ai'];
handler.command = ['img2prompt'];
handler.limit = true;

export default handler;