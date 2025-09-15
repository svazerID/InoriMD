//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : anime/animequote
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command }) => {
    try {
        let res = await fetch(`https://api.platform.web.id/animequote`)
        let json = await res.json()

        if (!Array.isArray(json) || json.length === 0) throw `Tidak ada quote ditemukan.`

        // ambil random quote
        let data = json[Math.floor(Math.random() * json.length)]

        let teks = `🎌 *Anime Quote*\n\n`
        teks += `👤 Character: *${data.char}*\n`
        teks += `📺 Anime: *${data.from_anime}*\n`
        teks += `🎞️ Episode: *${data.episode}*\n\n`
        teks += `💬 _"${data.quote}"_`

        await conn.reply(m.chat, teks, m)
    } catch (e) {
        console.error(e)
        throw `🚫 Gagal mengambil quote anime. Coba lagi nanti.`
    }
}

handler.help = ['animequote']
handler.tags = ['anime']
handler.command = /^animequote$/i
handler.limit = true

export default handler