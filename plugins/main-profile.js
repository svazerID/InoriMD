import PhoneNumber from 'awesome-phonenumber'
import fetch from 'node-fetch'
import moment from 'moment-timezone'

let handler = async (m, { conn }) => {
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
    let wibh = moment.tz('Asia/Jakarta').format('HH')
    let wibm = moment.tz('Asia/Jakarta').format('mm')
    let wibs = moment.tz('Asia/Jakarta').format('ss')
    let wktuwib = `${wibh} H ${wibm} M ${wibs} S`
    let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
    
    if (typeof db.data.users[who] == 'undefined') return m.reply('Pengguna tidak ada didalam database')

    let pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png')
    let bio = await conn.fetchStatus(who).catch(_ => 'Tidak Ada Bio')
    let { role, premium, money, level, limit, exp, lastclaim, registered, regTime, age } = global.db.data.users[who]
    let username = conn.getName(who)
    let user = db.data.users[who]
    let name = `${user.registered ? user.name : conn.getName(who)}`

    if (!(who in global.db.data.users)) return m.reply(`User ${who} tidak ada di database`)

    let pasangan = global.db.data.users[who].pasangan
    let pasanganMention = pasangan ? `@${pasangan.split('@')[0]}` : 'Yahaha Kasian Masih Jomblo😂'
    let mentionedJid = pasangan ? [global.db.data.users[who].pasangan] : []

    let fkon = { key: { fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? { remoteJid: `status@broadcast` } : {}) }, message: { 'contactMessage': { 'displayName': name, 'vcard': `BEGIN:VCARD\nVERSION:3.0\nN:XL;${name},;;;\nFN:${name},\nitem1.TEL;waid=${who.split('@')[0]}:${who.split('@')[0]}\nitem1.X-ABLabell:Ponsel\nEND:VCARD`, 'jpegThumbnail': pp, thumbnail: pp, sendEphemeral: true }}}
    
    let str = `
*User Profil*
👤 • *Username:* ${user.registered ? user.name : ''}
🏷 • *Status:* ${who.split`@`[0] == nomorown ? 'Developer' : user.premiumTime >= 1 ? 'Premium User' : user.level >= 1000 ? 'Elite User' : 'Free User'}
📮 • *Bio:* ${bio.status ? bio.status : bio}
📧 • *Tag:* @${who.replace(/@.+/, '')}
📞 • *Number:* ${PhoneNumber('+' + who.replace('@s.whatsapp.net', '')).getNumber('international')}
🔗 • *Link:* https://wa.me/${who.split`@`[0]}
🎨 • *Age:* ${user.registered ? age : ''}
💞 • *Pasangan:* ${pasanganMention} 

*RPG Profil*
🔧 • *Role:* ${role}
${rpg.emoticon('level')} • *Level:* ${level}
${rpg.emoticon('exp')} • *Exp:* ${exp}
${rpg.emoticon('money')} • *Money:* ${money}

🌟 • *Premium:* ${user.premiumTime > 0 ? "✅" : "❌"} ${user.premiumTime > 0 ? `
⏰ • *PremiumTime:*
${clockString(user.premiumTime - new Date() * 1)}` : ''}
📑 • *Registered:* ${user.registered ? '✅ ( ' + new Date(regTime) + ' )' : '❌'}

⻝ 𝗗𝗮𝘁𝗲: ${week} ${date}
⻝ 𝗧𝗶𝗺𝗲: ${wktuwib}
`.trim()

    await conn.sendFile(m.chat, pp, 'profile.jpeg', str, fkon, false, { mentions: mentionedJid })
}

handler.help = ['profile [@user]']
handler.tags = ['main']
handler.command = /^(profile|profil|me)$/i
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
    let ye = isNaN(ms) ? '--' : Math.floor(ms / 31104000000) % 10
    let mo = isNaN(ms) ? '--' : Math.floor(ms / 2592000000) % 12
    let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000) % 30
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return ['┊ ', ye, ' *Years 🗓️*\n', '┊ ', mo, ' *Month 🌙*\n', '┊ ', d, ' *Days ☀️*\n', '┊ ', h, ' *Hours 🕐*\n', '┊ ', m, ' *Minute ⏰*\n', '┊ ', s, ' *Second ⏱️*'].map(v => v.toString().padStart(2, 0)).join('')
}