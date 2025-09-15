import axios from 'axios'
import uploadImage from '../lib/uploadImage.js'

let handler = async (m, { conn, usedPrefix, command }) => {
  try {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || q.mediaType || ''

    if (/^image/.test(mime) && !/webp/.test(mime)) {
      m.reply('⏳ Mohon tunggu, sedang memproses...')
      const img = await q.download()
      const out = await uploadImage(img)

      const apiUrl = `https://api.platform.web.id/image-togta?urlImage=${out}`
      const response = await axios.get(apiUrl)
      const data = response.data

      const resultUrl = data.data
      if (!resultUrl) throw 'Gagal mendapatkan URL hasil dari API.'

      await conn.sendFile(m.chat, resultUrl, 'img.jpg', '✅ berhasil', m)
    } else {
      m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`)
    }
  } catch (e) {
    console.error(e)
    throw '🚩 Terjadi kesalahan saat menghapus background.'
  }
}

handler.help = ['jadigta']
handler.tags = ['ai']
handler.command = ['jadigta','togta']
handler.premium = false
handler.limit = true

export default handler