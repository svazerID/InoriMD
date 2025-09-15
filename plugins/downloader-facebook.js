let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `Example: ${usedPrefix + command} https://www.facebook.com/username/videos/123456789`
    if (!args[0].match(/(?:https?:\/\/)?(?:www\.)?(facebook\.com|fb\.watch)\//i)) {
        return m.reply('Invalid Facebook URL.')
    }

    await conn.sendMsg(m.chat, { react: { text: '⌛', key: m.key } })

    try {
        let res = await fetch(`https://api.platform.web.id/facebook?url=${encodeURIComponent(args[0])}`)
        let json = await res.json()

        if (!json.status || !json.result) throw 'Failed to fetch data.'

        let { title, sd, hd } = json.result
        let caption = `*Facebook Video Download*\n\n*${title}*\n\n` +
                      `🔸 [Download SD](${sd})\n` +
                      (hd ? `🔹 [Download HD](${hd})` : '')

        // kirim video HD jika ada, kalau tidak SD
        let videoUrl = hd || sd
        await conn.sendFile(m.chat, videoUrl, 'facebook.mp4', caption, m)
    } catch (e) {
        console.error(e)
        m.reply('Failed to download Facebook video.\n' + e.message)
    }
}

handler.help = ['fb <url>']
handler.tags = ['downloader']
handler.command = /^(fbdownload|facebook|fb(dl)?)$/i
handler.limit = true
handler.register = true

export default handler
