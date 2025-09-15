//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : searching/wattpad
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `📚 Contoh penggunaan:\n${usedPrefix + command} bts`
    
    try {
        const res = await fetch(`https://api.platform.web.id/wattpad-search?query=${encodeURIComponent(text)}&page=1&limit=5`)
        const json = await res.json()

        if (!json?.result?.stories?.length) throw `❌ Cerita tidak ditemukan untuk "${text}".`

        let hasil = `📚 *Hasil pencarian Wattpad untuk:* ${text}\n\n`
        for (let i of json.result.stories) {
            hasil += `• 📖 *${i.title}*\n`
            hasil += `👤 Author: ${i.user.name}\n`
            hasil += `🔗 ${i.url}\n\n`
        }

        hasil += `📦 Total cerita ditemukan: ${json.result.total}`

        m.reply(hasil)
    } catch (e) {
        console.error(e)
        throw `🚫 Terjadi kesalahan saat mengambil data.`
    }
}

handler.help = ['wattpad <query>']
handler.tags = ['internet']
handler.command = /^wattpad$/i
handler.limit = true

export default handler