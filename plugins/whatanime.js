/// • Feature : 
// • Credits : https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110

import axios from 'axios'

import fetch from 'node-fetch';
import FormData from 'form-data';
import * as cheerio from 'cheerio';

async function alfixdRaw(fileBuffer) {
    try {
        const form = new FormData();
        form.append('file', fileBuffer, {
            filename: 'upload.jpg'
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

async function uploadImage(imageBuffer) {
    if (!imageBuffer || !Buffer.isBuffer(imageBuffer)) throw new Error('Buffer gambar tidak valid.');
    return await alfixdRaw(imageBuffer);
}

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || q.mediaType || ''

    if (!/^image/.test(mime) || /webp/.test(mime)) throw `📸 Kirim atau reply gambar dengan caption *${usedPrefix + command}*`

    m.reply('⏳ Tunggu sebentar, sedang mencari info anime...')
    const img = await q.download()
    const out = await uploadImage(img)

    let { data } = await axios.get(`https://api.platform.web.id/find-anime?imageUrl=${encodeURIComponent(out)}`)

    let trace = data.trace
    let anime = data.anime

    let teks = `🎬 *Judul:* ${anime.title.english} (${anime.title.native})
📅 *Tahun:* ${anime.seasonYear}
⭐ *Skor:* ${anime.averageScore}
🎭 *Genres:* ${anime.genres.join(', ')}

📝 *Episode:* ${trace.episode}
🔗 *AniList:* ${anime.siteUrl}
${anime.externalLinks.length ? '🌐 *Streaming:* ' + anime.externalLinks.map(e => `${e.site}: ${e.url}`).join(', ') : ''}

📖 *Sinopsis:*
${anime.description.replace(/<br><\/br>/g, '\n')}
`

    await conn.sendFile(m.chat, anime.coverImage.large, 'anime.jpg', teks, m)
//    await conn.sendFile(m.chat, trace.video, 'trace.mp4', `🎥 Scene preview dari episode ${trace.episode} (${(trace.similarity * 100).toFixed(2)}% similar)`, m)

  } catch (e) {
    console.error(e)
    m.reply('❌ Tidak dapat menemukan data anime.')
  }
}

handler.help = ['whatanime']
handler.tags = ['anime']
handler.command = ['whatanime','wait','trace']
handler.limit = true

export default handler