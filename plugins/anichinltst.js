//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : anime/anichinltst
import fetch from 'node-fetch'

let handler = async (m, { conn }) => {
  try {
    let res = await fetch('https://api.platform.web.id/anichin/latest')
    let json = await res.json()

    if (!json.status || !json.result || json.result.length === 0)
      throw `🚫 Tidak ada data terbaru ditemukan.`

    let hasil = json.result.map((v, i) => {
      return `📺 *${v.title}*
🎬 Type: ${v.type}
⏳ Status: ${v.status}
🔗 URL: ${v.url}`
    }).join('\n\n')

    await conn.sendFile(m.chat, json.result[0].thumbnail, 'latest.jpg', `📢 *Anime Terbaru di Anichin*\n\n${hasil}`, m)
  } catch (e) {
    console.error(e)
    throw `🚫 Gagal mengambil data anime terbaru. Coba lagi nanti.`
  }
}

handler.help = ['anichinlatest']
handler.tags = ['anime']
handler.command = /^anichinlatest$/i
handler.limit = true

export default handler