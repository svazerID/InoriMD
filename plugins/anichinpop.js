//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : anime/anichinpop
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  try {
    let res = await fetch('https://api.platform.web.id/anichin/popular?range=alltime')
    let json = await res.json()

    if (!json.status || !json.result || json.result.length === 0)
      throw `🚫 Tidak ada data popular ditemukan.`

    let hasil = json.result.map((v, i) => {
      return `🔥 *${v.title}*
🎯 Rating: ${v.rating}
🎭 Genre: ${v.genres.join(', ')}
🔗 URL: ${v.url}`
    }).join('\n\n')

    await conn.sendFile(
      m.chat, 
      json.result[0].thumbnail, 
      'popular.jpg', 
      `📊 *Anime Terpopuler Sepanjang Masa*\n\n${hasil}`, 
      m
    )
  } catch (e) {
    console.error(e)
    throw `🚫 Gagal mengambil data anime populer. Coba lagi nanti.`
  }
}

handler.help = ['anichinpopular']
handler.tags = ['anime']
handler.command = /^anichinpopular$/i
handler.limit = true

export default handler