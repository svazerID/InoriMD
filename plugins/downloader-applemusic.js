//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : download/applemusic
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Contoh: ${usedPrefix + command} https://music.apple.com/us/album/allah-karim/1709091508?i=1709091510`

    try {
        const apiUrl = `https://api.platform.web.id/applemusic?url=${encodeURIComponent(text)}`
        const res = await fetch(apiUrl)
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
        const json = await res.json()

        console.log('🍎 AppleMusic JSON:', JSON.stringify(json, null, 2))

        let caption = `🎵 *APPLE MUSIC DOWNLOADER*\n\n`
        caption += `🎧 *Title:* ${json.search.name || '-'}\n`
        caption += `💿 *Album:* ${json.search.albumname || '-'}\n`
        caption += `👤 *Artist:* ${json.search.artist || '-'}\n`
        caption += `⏱ *Duration:* ${json.search.duration || '-'}\n`
        caption += `🔗 *AppleMusic URL:* ${json.search.url || '-'}\n`

        await conn.sendFile(m.chat, json.search.thumb, 'applemusic.jpg', caption, m)

        // Jika ada dlink, langsung download & kirim audio
        if (json.result?.dlink) {
            await conn.sendMessage(m.chat, {
                audio: { url: json.result.dlink },
                mimetype: 'audio/mp4',
                fileName: `${json.search.name} - ${json.search.artist}.m4a`
            }, { quoted: m })
        } else {
            m.reply('❌ Tidak ditemukan link download audio.')
        }

    } catch (e) {
        console.error('🚨 AppleMusic Error:', e)
        m.reply('🚨 Error: ' + (e.message || e))
    }
}

handler.help = ['applemusic <link>']
handler.tags = ['downloader']
handler.command = /^applemusic$/i
handler.limit = true

export default handler