//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : tools/infogempa.js
import fetch from 'node-fetch'
let handler = async(m, { conn }) => {
  let res = await(await fetch('https://api.platform.web.id/infogempa')).json()
  let data = res.result
  let teks = `乂 *Info Gempa*
  
❃ *Waktu:* ${data.waktu}
❃ *Coordinates:* ${data.koordinat}
❃ *Magnitude:* ${data.magnitudo}
❃ *Kedalaman:* ${data.kedalaman}
❃ *Wilayah:* ${data.wilayah}
❃ *Potensi:* ${data.potensi}
`.trim()
  await conn.sendFile(m.chat, data.shakemap, 'map.jpg', teks.trim(), m)
}
handler.help = ['infogempa']
handler.tags = ['tools']
handler.command = /^(infogempa)$/i
handler.limit = true
export default handler