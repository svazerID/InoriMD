//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : anime/anichin
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `🔍 Contoh penggunaan:\n${usedPrefix + command} perfect world`

    try {
        let res = await fetch(`https://api.platform.web.id/anichin/search?q=${encodeURIComponent(text)}`)
        let json = await res.json()

        if (!json.status || !json.result || json.result.length == 0)
            throw `Anime dengan kata kunci *${text}* tidak ditemukan.`

        let hasil = json.result.map((v, i) => {
            return `📺 *${v.title}*
🎬 Type: ${v.type}
⏳ Status: ${v.status}
🔗 URL: ${v.url}`
        }).join('\n\n')

        await m.reply(hasil)

    } catch (e) {
        console.error(e)
        throw `🚫 Gagal mencari anime. Coba lagi nanti.`
    }
}

handler.help = ['anichin <query>']
handler.tags = ['anime']
handler.command = /^anichin$/i
handler.limit = true

export default handler