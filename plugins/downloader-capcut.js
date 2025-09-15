let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Example: ${usedPrefix + command} https://www.capcut.com/t/xxxx`
    if (!args[0].match(/(?:https?:\/\/)?(?:www\.)?capcut\.com\//i)) {
        return m.reply('Invalid CapCut URL.')
    }

    await conn.sendMessage(m.chat, { react: { text: '⌛', key: m.key } })

    try {
        let res = await fetch(`https://api.platform.web.id/capcut?url=${encodeURIComponent(args[0])}`)
        let json = await res.json()

        if (!json.video) throw 'Failed to fetch data.'

        let { title, video, thumbnail, author } = json
        let caption = `*CapCut Download*\n\n` +
                      `🎬 *Title:* ${title}\n` +
                      `👤 *Author:* ${author}`

        await conn.sendFile(m.chat, video, 'capcut.mp4', caption, m, false, { thumbnail })
    } catch (e) {
        console.error(e)
        m.reply('Failed to download CapCut template.\n' + e.message)
    }
}

handler.help = ['capcut <url>']
handler.tags = ['downloader']
handler.command = /^(capcut)$/i

handler.premium = false
handler.limit = true

export default handler