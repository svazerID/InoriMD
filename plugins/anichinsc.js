//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : anime/anichinsc
import fetch from 'node-fetch'

const dayMap = {
  minggu: 'sunday',
  sunday: 'sunday',
  senin: 'monday',
  monday: 'monday',
  selasa: 'tuesday',
  tuesday: 'tuesday',
  rabu: 'wednesday',
  wednesday: 'wednesday',
  kamis: 'thursday',
  thursday: 'thursday',
  jumat: 'friday',
  friday: 'friday',
  sabtu: 'saturday',
  saturday: 'saturday'
}

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) {
    return conn.reply(m.chat, `📅 Contoh penggunaan:\n${usedPrefix}${command} minggu\n${usedPrefix}${command} wednesday`, m)
  }

  let day = dayMap[args[0].toLowerCase()]
  if (!day) {
    return conn.reply(m.chat, `🚫 Hari tidak dikenali. Gunakan hari dalam bahasa Indonesia atau Inggris.\nContoh: minggu, monday`, m)
  }

  try {
    let res = await fetch(`https://api.platform.web.id/anichin/schedule?day=${day}`)
    let json = await res.json()

    if (!json.status || !json.result || json.result.length === 0) {
      throw `Tidak ada jadwal anime untuk hari ${args[0]}.`
    }

    let hasil = json.result.map(v => 
      `🎬 *${v.title}*
📺 Episode: ${v.episode}
⏰ Tayang: ${v.time}
🔗 ${v.url}`).join('\n\n')

    await conn.reply(m.chat, `📅 *Jadwal Anime Hari ${args[0].toUpperCase()}*\n\n${hasil}`, m)
  } catch (e) {
    console.error(e)
    throw `🚫 Gagal mengambil jadwal anime hari ${args[0]}.`
  }
}

handler.help = ['anichinschedule <hari>']
handler.tags = ['anime']
handler.command = /^anichinschedule$/i
handler.limit = true

export default handler