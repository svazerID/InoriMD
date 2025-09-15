import fetch from 'node-fetch'

let handler = async (m, { conn }) => {

const meta = {
  key: {
    participant: '13135550002@s.whatsapp.net', 
    ...(m.chat ? {remoteJid: ``} : {})
  }, 
  message: {
    liveLocationMessage: {
      caption: `© 2025 SvazerID. All rights reserved.`,
      jpegThumbnail: ""
    }
  }, 
} 
let a = ["apa si","iya","oy","ha?","siap","ketik .allmenu untuk melihat fitur bot","males bgt sumpah","ada yang bisa saya bantu?","gw kah?","hemm","oke","sip","yuhu","hadir!!","di sini","iya boskuh","ada apa?","apa anj","yoi men"]

let pick = pickRandom(a)

conn.sendMessage(m.chat, {text: pick}, {quoted: meta})

}
handler.customPrefix = /^(bot|ino|bott|inori)/i;
handler.command = new RegExp();
handler.exp = 200
handler.premium = false
handler.owner = false
export default handler

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}