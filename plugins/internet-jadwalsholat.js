//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : searching/jadwalsholat
import axios from 'axios'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh:\n${usedPrefix + command} jakarta`

  let { data } = await axios.get(`https://api.platform.web.id/jadwal-sholat?kota=${encodeURIComponent(text)}`)
  if (!data.status) throw 'Gagal mengambil data jadwal sholat.'

  let jadwal = data.jadwal
  let teks = `🕌 *Jadwal Sholat ${data.lokasi}*\n📅 Tanggal: ${data.tanggal}\n\n`
  teks += `📌 *${jadwal.tanggal}*\n`
  teks += `- Imsak: ${jadwal.imsak}\n`
  teks += `- Subuh: ${jadwal.subuh}\n`
  teks += `- Terbit: ${jadwal.terbit}\n`
  teks += `- Dhuha: ${jadwal.dhuha}\n`
  teks += `- Dzuhur: ${jadwal.dzuhur}\n`
  teks += `- Ashar: ${jadwal.ashar}\n`
  teks += `- Maghrib: ${jadwal.maghrib}\n`
  teks += `- Isya: ${jadwal.isya}`

  await conn.reply(m.chat, teks, m)
}

handler.help = ['jadwalsholat <kota>']
handler.tags = ['internet']
handler.command = /^jadwalsholat$/i
handler.limit = true

export default handler