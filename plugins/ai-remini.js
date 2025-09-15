import fetch from 'node-fetch';
import uploadImage from '../lib/uploadImage.js';

async function handler(m, { conn, usedPrefix, command }) {
  try {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';

    if (/^image/.test(mime) && !/webp/.test(mime)) {
      m.reply('⏳ Sedang memproses gambar, mohon tunggu...');

      const img = await q.download();
      const out = await uploadImage(img);
      if (!out) throw new Error('Gagal upload gambar!');

      let enhancedImageUrl;
      let caption = '';

      // --- coba remini dulu ---
      try {
        const api = await fetch(`https://api.platform.web.id/remini?imageUrl=${encodeURIComponent(out)}&scale=2&faceEnhance=true`);
        const res = await api.json();

        if (res.status === "success" && res.result) {
          enhancedImageUrl = res.result;
          caption = `✅ Berhasil diproses\n📌 Watermark: ${res.wm || 'N/A'}`;
        } else {
          throw new Error('Remini gagal');
        }
      } catch (err) {
        console.log('❌ Remini gagal, fallback ke upscale2:', err.message);

        const apiUrl = `https://api.platform.web.id/upscale2?imageUrl=${encodeURIComponent(out)}&denoice_strength=1&resolution=6`;
        const response = await fetch(apiUrl);
        const json = await response.json();

        if (!json.result) throw new Error('Upscale2 gagal');

        enhancedImageUrl = json.result;
        caption = '✅ Berhasil meningkatkan kualitas gambar';
      }

      // --- kirim hasil ---
      const imageResponse = await fetch(enhancedImageUrl);
      const imageBuffer = await imageResponse.buffer();

      await conn.sendMessage(m.chat, {
        image: imageBuffer,
        caption,
        mimetype: 'image/png'
      }, { quoted: m });

    } else {
      m.reply(`📷 Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
    }
  } catch (e) {
    console.error(e);
    m.reply(`❌ Identifikasi gagal: ${e.message}`);
  }
}

handler.help = ['remini'];
handler.tags = ['ai'];
handler.command = ['upscale', 'hd', 'remini'];
handler.premium = false;
handler.limit = true;

export default handler;