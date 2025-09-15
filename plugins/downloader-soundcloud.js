let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Example: ${usedPrefix + command} https://soundcloud.com/xxx`
    if (!args[0].match(/(?:https?:\/\/)?(?:www\.)?(soundcloud\.com)\//i)) {
        return m.reply('Invalid SoundCloud URL.')
    }

    await conn.sendMessage(m.chat, { react: { text: '⌛', key: m.key } })

    try {
        let res = await fetch(`https://api.platform.web.id/soundcloud-dl?url=${encodeURIComponent(args[0])}`)
        let json = await res.json()

        if (!json.status) throw 'Failed to fetch data.'

        let { title, author, thumbnail, download_url } = json.result

        let caption = `*SoundCloud Download*\n\n` +
                      `🎵 *Title:* ${title}\n` +
                      `👤 *Author:* ${author}`

        await conn.sendFile(m.chat, thumbnail, 'thumbnail.jpg', caption, m)
        await conn.sendFile(m.chat, download_url, `${title}.mp3`, '', m, false, { mimetype: 'audio/mpeg' })

    } catch (e) {
        console.error(e)
        m.reply('Failed to download SoundCloud content.\n' + e.message)
    }
}

handler.help = ['soundcloud <url>']
handler.tags = ['downloader']
handler.command = /^(soundcloud(dl)?|sc(dl)?)$/i
handler.limit = 2
handler.register = true

export default handler
