/*
wa.me/6282285357346
github: https://github.com/sadxzyq
Instagram: https://instagram.com/tulisan.ku.id
ini wm gw cok jan di hapus
*/

let handler = async (m, { usedPrefix, command, conn, text }) => {
  let noReg = Object.values(global.db.data.users).filter(user => user.registered == false)
  let user = db.data.users
  for (let data in user) {
  if (user[data].registered === false) {
    delete user[data];
  } 
  }
  conn.reply(m.chat, `*Sukses membersihkan user yang tidak Registrasi* [ \`\`\`${noReg.length }\`\`\` ]`, m)
}

handler.help = ['clearcache']
handler.tags = ['owner']
handler.command = /^(clearcache)$/i
handler.rowner = true

export default handler