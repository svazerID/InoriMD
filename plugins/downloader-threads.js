//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : download/threads
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Contoh: ${usedPrefix + command} https://www.threads.net/@username/post/xyz`

    try {
        const apiUrl = `https://api.platform.web.id/threads?url=${encodeURIComponent(text)}`
        const res = await fetch(apiUrl)
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
        const json = await res.json()

        console.log('🧵 Threads JSON:', JSON.stringify(json, null, 2))

        let caption = `🧵 *Threads Downloader*\n\n`
        caption += `📌 *Link:* ${text}\n`

        // download video jika tersedia
        if (json.video_urls && json.video_urls.length > 0) {
            caption += `🎥 *Videos found:* ${json.video_urls.length}\n`

            for (let i = 0; i < json.video_urls.length; i++) {
                const video = json.video_urls[i]
                await conn.sendFile(m.chat, video.download_url, `threads_video_${i+1}.mp4`, caption, m)
            }
        } else {
            caption += `🚫 Tidak ada video ditemukan.`
            await m.reply(caption)
        }

    } catch (e) {
        console.error('🚨 ThreadsDL Error:', e)
        m.reply('🚨 Error: ' + (e.message || e))
    }
}

handler.help = ['threads'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^(threads(dl)?)$/i;
handler.limit = true
handler.register = true

export default handler
