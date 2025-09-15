//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : searching/gimage
import axios from 'axios'

let handler = async (m, { conn, text }) => {
  if (!text) throw 'Masukkan kata kunci pencarian.\n\nContoh: .imgsearch anjing'
  let { data } = await axios.get(`https://api.platform.web.id/image-search?query=${encodeURIComponent(text)}`)
  if (!data.images || !data.images.length) throw 'Gambar tidak ditemukan.'
  let randomImage = data.images[Math.floor(Math.random() * data.images.length)].imageUrl
  await conn.sendFile(m.chat, randomImage, 'image.jpg', `Hasil pencarian gambar untuk *${text}*`, m)
}

handler.help = ['gimage <query>', 'image <query>'];
handler.tags = ['internet'];
handler.command = /^(gimage|image)$/i;

handler.register = true
handler.limit = true

export default handler
