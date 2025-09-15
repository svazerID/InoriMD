//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : searching/uhdpaper
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh: ${usedPrefix + command} Inoue Takina`

  try {
    let apiUrl = `https://api.platform.web.id/uhdpaper?query=${encodeURIComponent(text)}`
    let res = await fetch(apiUrl)
    if (!res.ok) throw await res.text()
    let data = await res.json()

    if (!data.count) return m.reply('❌ Tidak ditemukan wallpaper untuk query tersebut.')

    await m.reply(`🔍 Ditemukan *${data.count}* hasil untuk *${data.query}*\nMengirim gambar...`)

    for (let i = 0; i < data.results.slice(0, 10).length; i++) {
      let v = data.results[i]
      await conn.sendMessage(m.chat, {
        image: { url: v.imageUrl },
        caption: `*${v.title}*\n📐 Resolution: ${v.resolution}\n🌐 Link: ${v.link}`
      }, { quoted: m })
      await new Promise(resolve => setTimeout(resolve, 1000)) // delay biar gak ke spam detect
    }

  } catch (e) {
    console.error('Error:', e)
    m.reply('🚨 Error: ' + (e.message || e))
  }
}

handler.help = ['uhdpaper <query>']
handler.tags = ['internet']
handler.command = ['uhdpaper']
handler.limit = true

export default handler