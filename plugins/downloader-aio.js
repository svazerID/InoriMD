//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : download/aio
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Contoh: ${usedPrefix + command} https://vt.tiktok.com/...`

    try {
        const apiUrl = `https://api.platform.web.id/aio?url=${encodeURIComponent(text)}`
        const res = await fetch(apiUrl)
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
        const json = await res.json()

        console.log('🎬 AIO Response:', JSON.stringify(json, null, 2))

        if (!Array.isArray(json) || json.length === 0) throw new Error("Tidak ditemukan media.")

        const data = json[0]
        const title = data.title || 'Tanpa judul'
        const thumbnail = data.videoimg_file_url || data.image
        const videoUrl = data.video_file_url

        if (!videoUrl) throw new Error("Video tidak ditemukan dalam hasil.")

        // random emoji react
        const emojis = ['🎬','📽️','🚀','🎥','🤩']
        await conn.sendMessage(m.chat, { react: { text: emojis[Math.floor(Math.random() * emojis.length)], key: m.key } })

        // kirim thumbnail + caption dulu
        const caption = `
🎬 *Video Info*
📌 Judul: ${title}
🌐 URL: ${text}
        `.trim()
        await conn.sendFile(m.chat, thumbnail, 'thumbnail.jpg', caption, m)

        // lalu kirim video
        await conn.sendFile(m.chat, videoUrl, 'video.mp4', '✅ Berikut videonya...', m)

    } catch (e) {
        console.error('🚨 AIO Error:', e)
        m.reply('🚨 Error: ' + (e.message || e))
    }
}

handler.help = ['aio <url>']
handler.tags = ['downloader']
handler.command = /^(aio)$/i
handler.register = true
handler.limit = 1

export default handler
