let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Example: ${usedPrefix + command} https://www.instagram.com/reel/xxxx/`
    if (!args[0].match(/(?:https?:\/\/)?(?:www\.)?(instagram\.com)\/(p|reel|tv)\//i)) {
        return m.reply('Invalid Instagram URL.')
    }

    await conn.sendMessage(m.chat, { react: { text: '⌛', key: m.key } })

    try {
        let res = await fetch(`https://api.platform.web.id/instagram?url=${encodeURIComponent(args[0])}`)
        let json = await res.json()
        
        if (!json.status || !json.result || json.result.length === 0) throw 'Failed to fetch data.'

        for (let media of json.result) {
            let caption = `*Instagram Download*`
            await conn.sendFile(m.chat, media.url_download, 'instagram.mp4', caption, m)
        }
    } catch (e) {
        console.error(e)
        m.reply('Failed to download Instagram media.\n' + e.message)
    }
}

handler.help = ['ig'].map(v => v + ' <url>');
handler.tags = ['downloader'];
handler.command = /^(ig(dl)?)$/i;

handler.limit = true
handler.register = true

export default handler
