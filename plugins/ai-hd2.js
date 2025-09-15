import uploadImage from '../lib/uploadImage.js';
import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';

    if (/^image/.test(mime) && !/webp/.test(mime)) {
      m.reply('⏳ Mohon tunggu, sedang memproses...');
      const img = await q.download();
      const out = await uploadImage(img);
      if (!out) throw new Error('Gagal upload gambar!');

      // Menggunakan API untuk meningkatkan kualitas gambar
      const response = await fetch(`https://api.platform.web.id/upscale?url=${encodeURIComponent(out)}`);
      const data = await response.json();

      if (!data.status) throw new Error('Gagal mendapatkan data dari API!');

      const resultUrl = data.result_url;

      await conn.sendMessage(m.chat, {
        image: { url: resultUrl },
        caption: 'Gambar berhasil ditingkatkan kualitasnya!'
      }, { quoted: m });

    } else {
      m.reply(`📷 Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
    }
  } catch (e) {
    console.error('Error:', e);
    m.reply('🚨 Error: ' + (e.message || e));
  }
}

handler.help = ['hd2'];
handler.tags = ['ai'];
handler.command = ['hd2'];
handler.limit = true;

export default handler;