let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Example: ${usedPrefix + command} https://vt.tiktok.com/xxxx`
    if (!args[0].match(/(?:https?:\/\/)?(?:www\.)?(tiktok\.com|vt\.tiktok\.com)\//i)) {
        return m.reply('Invalid TikTok URL.')
    }

    await conn.sendMessage(m.chat, { react: { text: '⌛', key: m.key } })

    try {
        let res = await fetch(`https://api.platform.web.id/tiktok?url=${encodeURIComponent(args[0])}`)
        let json = await res.json()

        if (!json.status) throw 'Failed to fetch data.'

        let { title, taken_at, region, id, duration, cover, music_info, data, author } = json

        let caption = `*TikTok Download*\n\n` +
                      `🎞 *Title:* ${title}\n` +
                      `👤 *Author:* ${author.nickname}\n` +
                      `📅 *Taken At:* ${taken_at}\n` +
                      `🌍 *Region:* ${region}\n` +
                      `🆔 *ID:* ${id}\n` +
                      `⏱ *Duration:* ${duration}\n` +
                      `🎵 *Music:* ${music_info.title} - ${music_info.author}`

        let hasVideo = data.find(v => v.type === 'nowatermark')
        let isPhoto = data.every(v => v.type === 'photo')

        if (isPhoto) {
            await conn.sendFile(m.chat, cover, 'cover.jpg', caption, m)
            for (let p of data) {
                await conn.sendFile(m.chat, p.url, 'photo.jpg', '', m)
            }
        } else if (hasVideo) {
            await conn.sendFile(m.chat, hasVideo.url, 'tiktok.mp4', caption, m)
        } else {
            m.reply('No supported media found.')
        }

        // Always send audio
        await conn.sendFile(m.chat, music_info.url, `${music_info.title}.mp3`, `🎧 *Audio:* ${music_info.title} - ${music_info.author}`, m, false, { mimetype: 'audio/mpeg' })

    } catch (e) {
        console.error(e)
        m.reply('Failed to download TikTok content.\n' + e.message)
    }
}


handler.help = ['tiktok']
handler.tags = ['downloader']
handler.command = /^(tt|ttdl|tiktok(dl)?)$/i;

handler.disable = false
handler.register = true
handler.limit = true

export default handler
