//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : tools/amdata
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Contoh: ${usedPrefix + command} https://alightcreative.com/am/share/u/RsfkC8TAxpVcTxPTdlFaC7Y9AFq2/p/U4xccZ37om-45162df0719976ec`
    try {
        const res = await fetch(`https://api.platform.web.id/amdata?url=${encodeURIComponent(text)}`)
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
        const anu = await res.json()

        console.log("🔍 Full AM data:", JSON.stringify(anu, null, 2))

        const info = anu?.info
        if (!info) throw new Error("Data Alight Motion tidak ditemukan")

        // Format size
        const formatSize = (bytes) => {
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
            if (bytes === 0) return '0 Byte';
            const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
            return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
        }

        // Build caption
        const caption = `
📹 *${info.title || "Tanpa Judul"}*
👤 Versi: ${info.amVersionString || "-"}
📦 Size: ${formatSize(info.size || 0)}
❤️ Likes: ${info.likes || 0}
⬇️ Downloads: ${info.downloads || 0}
🖼 Platform: ${info.amPlatform || "-"}
✨ Required Effects:
${(info.requiredEffects || []).map((e, i) => `${i+1}. ${e}`).join("\n") || "-"}

🔗 *Direct Download*: ${anu.download === "allowed" ? text : "Not allowed"}
`.trim()

        // Pilih thumbnail
        const thumb = info.largeThumbUrl || info.medThumbUrl || info.smallThumbUrl || info.tinyThumbUrl

        // Kirim reaksi emoji random
        const emojis = ['🎨', '📽️', '✨', '📌', '📂', '📝']
        await conn.sendMessage(m.chat, { react: { text: emojis[Math.floor(Math.random() * emojis.length)], key: m.key } })

        // Kirim caption + thumbnail
        await conn.sendFile(m.chat, thumb, 'am.jpg', caption, m)
        
    } catch (e) {
        console.error("🚨 AMData Error:", e)
        m.reply('🚨 Error: ' + e.message)
    }
}

handler.help = ['amdata <url>']
handler.tags = ['tools']
handler.command = /^amdata$/i
handler.limit = true

export default handler