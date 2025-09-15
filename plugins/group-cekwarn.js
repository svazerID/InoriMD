let handler = async (m, { conn, isOwner }) => {
let adv = Object.entries(global.db.data.users).filter(user => user[1].warn)
let warns = global.db.data.users.warn
let user = global.db.data.users

let caption = `Pengguna Diperingatkan
*╭•·–––––––––––––––––––·•*
│ *Total : ${adv.length} Pengguna* ${adv ? '\n' + adv.map(([jid, user], i) => `
│
│ *${i + 1}.* ${conn.getName(jid)  == undefined ? 'Dosa Pengguna' : conn.getName(jid) + ` *(${user.warn}/3)*`}
│ ${isOwner ? '@' + jid.split`@`[0] : jid}\n│ - - - - - - - - -`.trim()).join('\n') : ''}
*╰•·–––––––––––––––––––·•*\n\nPeringatan ⇢ ${warns ? `*${warns}/3*` : '*0/3*'}`
await conn.reply(m.chat, caption, m, { mentions: await conn.parseMention(caption) })}

handler.help = ['listadv']
handler.tags = ['group']
handler.command = ['listadv', 'listaadv', 'listadv', 'adv', 'advlist', 'advlista']

export default handler