let handler = async (m, {
    conn,
    text,
    groupMetadata
}) => {
    var lama = 86400000 * 7
    const now = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta"
    });
    const milliseconds = new Date(now).getTime();

    let member = groupMetadata.participants.map(v => v.id)
    if (!text) {
        var pesan = "Mohon aktif di grup karena akan ada pembersihan anggota setiap saat."
    } else {
        var pesan = text
    }
    var sum
    sum = member.length
    var total = 0
    var sider = []
    for (let i = 0; i < sum; i++) {
        let users = m.isGroup ? groupMetadata.participants.find(u => u.id == member[i]) : {}
        if ((typeof global.db.data.users[member[i]] == 'undefined' || milliseconds * 1 - global.db.data.users[member[i]].lastseen > lama) && !users.isAdmin && !users.isSuperAdmin) {
            if (typeof global.db.data.users[member[i]] !== 'undefined') {
                if (global.db.data.users[member[i]].banned == true) {
                    total++
                    sider.push(member[i])
                }
            } else {
                total++
                sider.push(member[i])
            }
        }
    }
    if (total == 0) return conn.reply(m.chat, `*Tidak ada sider di grup ini.*`, m)
    const { key } = await conn.sendMessage(m.chat, {text: `*${total}/${sum}* Anggota kelompok *${await conn.getName(m.chat)}* Merupakan Sider karena Alasan:\n1. Tidak Aktif Selama Lebih Dari 7 Hari\n2. Bergabunglah Tapi Jangan Pernah Bergabung\n_“${pesan}”_\n\n*Daftar Anggota Sider:*\n${sider.map(v => '  • @' + v.replace(/@.+/, '' + typeof global.db.data.users[v] == "undefined" ? ' Sider ' : ' Off ' + msToDate(milliseconds * 1 - global.db.data.users[v].lastseen))).join('\n')}`, 
        contextInfo: {
            mentionedJid: sider
        }}, {quoted: m}
    )
  await conn.delay(5000)
  await conn.sendMessage(m.chat, {text: 'Waktu hitung mundur 10 detik untuk menghapus member yang tidak aktif', edit: key}, {quoted: m})
  await conn.delay(10000)
  for (let sid of sider) {
  await conn.groupParticipantsUpdate(m.chat, [sid], 'remove')
  await conn.delay(1000)
  }
}
handler.help = ['kicksider']
handler.tags = ['group']
handler.command = /^(kicksider)$/i
handler.group = true
handler.admin = true

export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)


function msToDate(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  if (d == 0 && h == 0 && m == 0) {
        return "Baru Saja"
    } else {
        return [d, 'H ', h, 'J '].map(v => v.toString().padStart(2, 0)).join('')
    }
  
}