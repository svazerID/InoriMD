let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Example: ${usedPrefix + command} https://x.com/elonmusk/status/xxxx`
    if (!args[0].match(/(?:https?:\/\/)?(?:www\.)?(twitter\.com|x\.com)\//i)) {
        return m.reply('Invalid Twitter URL.')
    }

    await conn.sendMessage(m.chat, { react: { text: '⌛', key: m.key } })

    try {
        let res = await fetch(`https://api.platform.web.id/twitter?url=${encodeURIComponent(args[0])}`)
        let json = await res.json()

        if (!json.download_link || !json.download_link.length) throw 'Failed to fetch data.'

        let caption = `*Twitter Video Download*\n\n🔗 Source: ${json.source}`
        for (let link of json.download_link) {
            await conn.sendFile(m.chat, link, 'twitter.mp4', caption, m)
        }
    } catch (e) {
        console.error(e)
        m.reply('Failed to download Twitter video.\n' + e.message)
    }
}

handler.help = ['twitter <url>'];
handler.tags = ['downloader'];
handler.command = /^(x|twt|twitter(dl)?)$/i;

handler.limit = true
handler.register = true

export default handler
