import fs from 'fs'

let timeout = 120000
let poin = 4999

let handler = async (m, { conn, command, usedPrefix }) => {
    conn.game = conn.game ? conn.game : {}
    let id = 'lengkapikalimat-' + m.chat
    if (id in conn.game) 
        return conn.reply(m.chat, '❗ Masih ada soal yang belum terjawab di chat ini', conn.game[id][0])

    let src = JSON.parse(fs.readFileSync('./json/lengkapikalimat.json', 'utf-8'))
    let json = src[Math.floor(Math.random() * src.length)]

    let hint = json.jawaban[0] + '*'.repeat(json.jawaban.length - 1)

    let caption = `
📝 *Lengkapi Kalimat!*

${json.soal}

⏳ Timeout: *${(timeout / 1000).toFixed(0)} detik*
💡 Hint: \`${hint}\`
🎁 Bonus: *${poin} XP*
Ketik *${usedPrefix}hlen* untuk bantuan
`.trim()

    conn.game[id] = [
        await m.reply(caption),
        json, poin,
        setTimeout(() => {
            if (conn.game[id]) {
                conn.reply(m.chat, `⏰ Waktu habis!\n✅ Jawabannya adalah *${json.jawaban}*`, conn.game[id][0])
                delete conn.game[id]
            }
        }, timeout)
    ]
}

handler.help = ['lengkapikalimat']
handler.tags = ['game']
handler.command = /^lengkapikalimat$/i
handler.onlyprem = true
handler.game = true

export default handler