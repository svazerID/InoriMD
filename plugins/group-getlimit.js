const cooldown = 86400000
const limit = ["100","25","20","200","240","50","73","5","10","1","500","400","340"]
let handler = async (m,{ conn} ) => {
  let get = global.db.data.users[m.sender]
    if (m.chat == "120363207315318741@g.us") {
    
  if (new Date - get.dailylimit < cooldown) throw `Anda sudah mengklaim Limit Daily Claim!, tunggu *${((get.dailylimit + cooldown) - new Date()).toTimeString()}*`
  let rendem = pickRandom(limit)
  let hasil = rendem
  get.limit += rendem
  conn.reply(m.chat, `📢 Selamat kamu mendapatkan limit\n➜ ${hasil}`, m)
  get.dailylimit = new Date * 1
  
  } else {
  await conn.sendMessage(m.chat, {
  document: fs.readFileSync('./README.md'),
  mimetype: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  fileName: 'Inori Yuzuriha',
  fileLength: 271000000000000,
  caption: '📣 Fitur khusus penghuni group *OFFICIAL*\nJoin sekarang untuk mendapatkan limit melimpah mulai dari 1 > 400 limit dalam sehari\n\nhttps://chat.whatsapp.com/JnhoVHc5X369a2si7GOXmu',
  contextInfo: {
    mentionedJid: [m.sender],
    isForwarded: true,
    forwardingScore: 256,
    forwardedNewsletterMessageInfo: {
      newsletterJid: '120363420643650987@newsletter',
      newsletterName: `Powered By: ${global.author}`,
      serverMessageId: -1
    },
    externalAdReply: {
      showAdAttribution: false,
      title: wm,
      body: 'I Am An Automated System WhatsApp Bot That Can Help To Do Something, Search And Get Data / Information Only Through WhatsApp.',
      thumbnailUrl: 'https://kua.lat/inori',
      sourceUrl: sgc,
      mediaType: 1,
      renderLargerThumbnail: false
    }
  }
}, { quoted: m });
			}
}
handler.help = ['getlimit']
handler.tags = ['group']
handler.command = /^(getlimit)$/i
handler.group = true 
handler.register = true
handler.cooldown = cooldown

export default handler

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}