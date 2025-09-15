import fetch from 'node-fetch';
import FormData from 'form-data';
import * as cheerio from 'cheerio';

export async function before(m, { conn }) {
  const chat = global.db.data.chats[m.chat];
  if (!chat || !chat.autohd) return;

  const q = m.quoted ? m.quoted : m;
  const mime = (q.msg || q).mimetype || q.mediaType || '';

  if (/^image/.test(mime) && !/webp/.test(mime)) {
    try {
      const loading = await conn.sendMessage(m.chat, {
        text: '⏳ *AutoHD aktif... Memproses gambar.*',
        contextInfo: {
          externalAdReply: {
            title: 'Memperjelas Gambar...',
            body: 'AutoHD aktif oleh InoriBot',
            thumbnailUrl: 'https://kua.lat/inori',
            mediaType: 1,
            renderLargerThumbnail: false,
            showAdAttribution: true,
            sourceUrl: 'https://svazerid.com'
          }
        }
      }, { quoted: m });

      const img = await q.download();
        const rawUrl = await uploadImage(img);

        if (!rawUrl) return m.reply('Gagal mengunggah gambar ke server. Coba lagi nanti.');

        const apiUrl = `https://api.platform.web.id/upscale2?imageUrl=${encodeURIComponent(rawUrl)}&denoice_strength=1&resolution=6`;
        const response = await fetch(apiUrl);
        const json = await response.json();

      /*  if (json.status !== 200 || !json.data?.result) {
            return m.reply('Gagal meningkatkan kualitas gambar. Coba lagi nanti.');
        }*/

        const enhancedImageUrl = json.result;
        const imageResponse = await fetch(enhancedImageUrl);
        const imageBuffer = await imageResponse.buffer();

        await conn.sendMessage(m.chat, {
            image: imageBuffer,
            caption: 'berhasil meningkatkan kualitas gambar!',
            mimetype: 'image/png'
        }, {
            quoted: m
        });

      await conn.sendMessage(m.chat, { delete: loading.key });

    } catch (e) {
      console.error('[AutoHD ERROR]', e);
      m.reply('❌ Terjadi kesalahan saat memproses gambar.');
    }
  }
}

// === Upload helper ===
async function uploadImage(imageBuffer) {
  if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) throw new Error('Buffer gambar tidak valid.');
  return await alfixdRaw(imageBuffer);
}

async function alfixdRaw(fileBuffer) {
  try {
    const form = new FormData();
    form.append('file', fileBuffer, {
      filename: 'upload.jpg',
      contentType: 'image/jpeg'
    });

    const response = await fetch('https://upfilegh.alfiisyll.biz.id/upload', {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const html = await response.text();
    const $ = cheerio.load(html);
    const rawUrl = $('#rawUrlLink').attr('href');
    if (!rawUrl) throw new Error('Gagal mengambil URL gambar mentah.');
    return rawUrl;
  } catch (error) {
    console.error('[alfixdRaw] Upload error:', error.message);
    return null;
  }
}