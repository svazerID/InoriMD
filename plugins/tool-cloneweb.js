//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : tools/cloneweb
import axios from 'axios'
import fs from 'fs'

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  try {
    let url = text || (m.quoted && m.quoted.text)
    if (!url || !/^https?:\/\//.test(url)) return m.reply(`🌐 Masukkan URL yang valid!\n\nContoh:\n${usedPrefix + command} https://sewabot.platform.web.id`)

    m.reply('⏳ Sedang memproses, harap tunggu...')

    let { data } = await axios.post('https://api.platform.web.id/saveweb2zip', {
      url,
      renameAssets: false,
      saveStructure: false,
      alternativeAlgorithm: false,
      mobileVersion: false
    })

    if (!data || data.status === false) return m.reply('❌ Gagal membuat ZIP.')

    let downloadUrl = data.downloadUrl
    let caption = `✅ *Website Saved*\n\n`
    caption += `🌐 URL: ${data.url}\n`
    caption += `📁 Files: ${data.copiedFilesAmount}\n`

    // coba download zip untuk cek ukuran
    try {
      let response = await axios.get(downloadUrl, { responseType: 'arraybuffer' })
      let buffer = Buffer.from(response.data)
      
      if (buffer.length < 45 * 1024 * 1024) { // misalnya batas 45MB
        await conn.sendMessage(m.chat, {
          document: buffer,
          fileName: `${data.url}.zip`,
          mimetype: 'application/zip',
          caption
        }, { quoted: m })
      } else {
        await m.reply(caption + `⚠️ File terlalu besar untuk dikirim lewat WhatsApp.`)
      }
    } catch (e) {
      console.error('Gagal download zip:', e)
      await m.reply(caption + `⚠️ Tidak dapat mengunduh file ZIP untuk dikirim langsung.`)
    }

  } catch (err) {
    console.error(err)
    m.reply('❌ Terjadi kesalahan saat memproses permintaan.')
  }
}

export default handler

handler.help = ['cloneweb <url>']
handler.tags = ['tools']
handler.command = /^cloneweb$/i
handler.premium = true