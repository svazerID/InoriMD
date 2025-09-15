//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : sticker/telegram
import axios from 'axios'
import { Sticker } from 'wa-sticker-formatter'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) throw `Contoh penggunaan:\n${usedPrefix + command} https://t.me/addstickers/retjehhh_bucin`

  let { data } = await axios.get(`https://api.platform.web.id/telegram-sticker?url=${encodeURIComponent(text)}`)
  if (!data?.stickers?.length) throw 'Stiker tidak ditemukan.'

  await m.reply(`📦 Mengirim stiker pack: *${data.title}*\nTerdapat ${data.stickers.length} stiker.`)

  for (let s of data.stickers) {
    let sticker = new Sticker(s.image_url, {
      pack: data.title,
      author: data.name,
      type: s.is_animated ? 'full' : 'crop',
      categories: [s.emoji],
      quality: 50
    })

    await conn.sendMessage(m.chat, { sticker: await sticker.toBuffer() }, { quoted: m })
    await delay(1500) // delay 1.5 detik
  }

  await m.reply('✅ Semua stiker selesai dikirim!')
}

handler.help = ['stelegram <url>']
handler.tags = ['sticker']
handler.command = /^stelegram$/i
handler.limit = true

export default handler

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}