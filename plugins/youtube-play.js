import yts from 'yt-search'
import fs from 'fs'
import path from 'path'
import axios from 'axios'
import { pipeline } from 'stream'
import { promisify } from 'util'

const streamPipeline = promisify(pipeline)

let handler = async (m, { conn, args, text, command }) => {
  if (!text) return m.reply(`*Contoh:* ${command} god of war short`)
  m.reply(wait)

  try {
    let search = await yts(text)
    let video = search.videos[0]
    if (!video) return m.reply('Video tidak ditemukan, coba kata kunci lain.')

   const api = `https://api.platform.web.id/savetube?url=${encodeURIComponent(video.url)}&format=mp3`
    const response = await fetch(api)
    const res = await response.json()
    const pepek = res.result.download_url
    
    let caption = `• *Title:* ${video.title}\n• *Duration:* ${video.timestamp}\n• *Upload at:* ${video.ago}\n• *Descriptions:* ${video.description}\n• *Views:* ${video.views}\n• *Link:* ${video.url}\n\n> Mohon tunggu, audio sedang dikirim...`

    await conn.relayMessage(m.chat, {
      extendedTextMessage: {
        text: caption,
        contextInfo: {
          externalAdReply: {
            title: video.title,
            mediaType: 1,
            previewType: 0,
            renderLargerThumbnail: true,
            thumbnailUrl: video.image,
            sourceUrl: video.url
          }
        },
        mentions: [m.sender]
      }
    }, {})

    await conn.sendMessage(m.chat, {
      audio: { url: pepek },
      mimetype: 'audio/mpeg',
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply(`Terjadi kesalahan saat memproses permintaan. Coba lagi nanti. ${e.message}`)
  }
}

handler.help = ['play'].map(v => v + ' <query>')
handler.tags = ['downloader']
handler.command = /^(play)$/i

handler.limit = 8
handler.register = true
handler.disable = false

export default handler
