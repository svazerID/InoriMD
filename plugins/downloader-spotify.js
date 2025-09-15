let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Example: ${usedPrefix + command} https://open.spotify.com/track/xxxx`
    if (!args[0].match(/(?:https?:\/\/)?(?:open\.)?spotify\.com\/track\//i)) {
        return m.reply('Invalid Spotify track URL.')
    }

    await conn.sendMsg(m.chat, { react: { text: '⌛', key: m.key } })

    try {
        let res = await fetch(`https://api.platform.web.id/spotifydl?url=${encodeURIComponent(args[0])}`)
        let json = await res.json()

        if (!json.status || !json.result) throw 'Failed to fetch data.'

        let { title, artist, duration_ms, image, download } = json.result
        let duration = new Date(duration_ms).toISOString().substr(14, 5)

        let caption = `*Spotify Download*\n\n` +
                      `🎵 *Title:* ${title}\n` +
                      `👤 *Artist:* ${artist}\n` +
                      `⏱ *Duration:* ${duration}`

        await conn.sendFile(m.chat, download, `${title}.mp3`, caption, m, false, { mimetype: 'audio/mpeg', thumbnail: image })
    } catch (e) {
        console.error(e)
        m.reply('Failed to download Spotify audio.\n' + e.message)
    }
}

handler.help = ['spotify <url>']
handler.tags = ['downloader']
handler.command = /^(spotify(dl)?)$/i
handler.limit = 2
handler.register = true

export default handler
