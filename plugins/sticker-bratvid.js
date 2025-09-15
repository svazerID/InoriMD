import axios from 'axios'
import { Sticker, StickerTypes } from 'wa-sticker-formatter'
import { tmpdir } from 'os'
import { join } from 'path'
import { writeFile, unlink } from 'fs/promises'

let handler = async (m, { conn, args, command }) => {
  if (!args[0]) throw `Contoh: .${command} halo hilman`
  
  let text = encodeURIComponent(args.join(" "))
  let url = `https://anabot.my.id/api/maker/bratGif?text=${text}&apikey=freeApikey`

  try {
    // Ambil video dari API
    let res = await axios.get(url, { responseType: 'arraybuffer' })
    let buffer = Buffer.from(res.data)

    // Simpan sementara
    let tmpPath = join(tmpdir(), `${Date.now()}.mp4`)
    await writeFile(tmpPath, buffer)

    // Buat stiker GIF dari video
    let sticker = new Sticker(tmpPath, {
      type: StickerTypes.FULL,
      pack: `${global.stickpack}`,
      author: `${global.stickauth}`,
      categories: ['🎥'],
      id: 'bratvid',
      quality: 70
    })

    let stickerBuffer = await sticker.toBuffer()

    // Kirim ke chat
    await conn.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m })

    // Hapus file sementara
    await unlink(tmpPath)

  } catch (err) {
    console.error(err)
    throw '❌ Gagal membuat stiker bratvid.'
  }
}

handler.help = ['bratvid <teks>']
handler.tags = ['sticker']
handler.command = /^bratvid$/i
handler.limit = true
handler.register = true
handler.group = false

export default handler