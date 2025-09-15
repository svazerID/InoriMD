//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : anime/anichinrating
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  try {
    let res = await fetch('https://api.platform.web.id/anichin/rating')
    let json = await res.json()

    if (!json.status || !json.result || json.result.length === 0)
      throw `🚫 Tidak ada data rating ditemukan.`

    let hasil = json.result.map((v, i) => {
      return `⭐ *${v.title}*
🎬 Type: ${v.type}
📺 Status: ${v.status}
🔗 URL: ${v.link}`
    }).join('\n\n')

    await m.reply(
      `📈 *Anime dengan Rating Tinggi` + hasil
    )
  } catch (e) {
    console.error(e)
    throw `🚫 Gagal mengambil data rating anime. Coba lagi nanti.`
  }
}

handler.help = ['anichinrating']
handler.tags = ['anime']
handler.command = /^anichinrating$/i
handler.limit = true

export default handler