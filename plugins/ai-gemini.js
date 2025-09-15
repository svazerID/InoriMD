import uploadImage from '../lib/uploadImage.js';
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const quoted = m && (m.quoted || m)
    let imageUrl = ''
    let mime = (quoted.msg || quoted).mimetype || quoted.mediaType || ''

    if (quoted && /image/.test(mime) && !/webp/.test(mime)) {
        await conn.reply(m.chat, '⏳ Sedang mengunggah gambar...', m)
        try {
            const img = await quoted.download?.()
            if (!img) throw new Error('Gagal mendownload gambar.')
            imageUrl = await uploadImage(img)
        } catch (err) {
            console.error('❌ Error upload image:', err)
            return m.reply('🚩 Gagal mengunggah gambar. Coba lagi.')
        }
    }

    if (!text) throw `Contoh:\n${usedPrefix + command} siapa elon musk?\nAtau kirim/reply gambar lalu ketik:\n${usedPrefix + command} jelaskan gambar ini`

    try {
        let apiURL = `https://api.platform.web.id/gemini?prompt=${encodeURIComponent(text)}`
        if (imageUrl) apiURL += `&imageUrl=${encodeURIComponent(imageUrl)}`
        
        let res = await fetch(apiURL)
        if (!res.ok) throw new Error('API tidak merespons.')
        let json = await res.json()
        
        if (!json.status) throw new Error('Gagal memproses permintaan.')

        await conn.reply(m.chat, json.result || '🙈 Tidak ada jawaban yang diterima.', m)
    } catch (err) {
        console.error('❌ AI Error:', err)
        m.reply(`🚩 Terjadi kesalahan: ${err.message || err}`)
    }
}

handler.help = ['gemini <pertanyaan>']
handler.tags = ['ai']
handler.command = /^gemini$/i
handler.limit = true

export default handler;