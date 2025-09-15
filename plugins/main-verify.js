import { createHash } from 'crypto'
import fetch from 'node-fetch'
import fs from 'fs'

let Reg = /\|?(.*)([.|] *?)([0-9]*)$/i
let handler = async function (m, { conn, text, usedPrefix, command }) {
// nama
let namae = conn.getName(m.sender)
// database 
let user = global.db.data.users[m.sender]
let channelJid = '120363380343761245@newsletter'
// profile
let ran = ["1","2","3","4","5","6","7","8","9"]
const pp = await conn.profilePictureUrl(m.sender, "image").catch((_) => "https://telegra.ph/file/ee60957d56941b8fdd221.jpg")
// checking user
  if (user.registered === true) throw `You Have Already Registered In The Database, Do You Want To Re-Register? */unreg*`
  // input 
  let age = ran.getRandom() * 2
  user.name = m.name
  user.age = age
  user.regTime = + new Date
  user.registered = true
  let sn = createHash('md5').update(m.sender).digest('hex')
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : m.fromMe ? conn.user.jid : m.sender
  let cap = `
╭━━「 *Information*
│• *Name:* ${m.name}
│• *Age:* ${age} Years
│• *Status:* _Success_
│• *Serial Number:* ${sn}
╰╾•••
`
await conn.sendMessage(m.chat, { text: cap,
contextInfo:
					{
						"externalAdReply": {
							"title": " ✔️ S U C C E S S  R E G I S T R A S I",
							"body": "",
							"showAdAttribution": true,
							"mediaType": 1,
							"sourceUrl": '',
							"thumbnailUrl": pp,
							"renderLargerThumbnail": true

						}
					}}, m)
  await conn.sendFile(m.chat, './vn/alfixddaftar.mp3', '', null, m, true)
  await conn.sendMessage(channelJid, {
        text: cap.trim(),
        contextInfo: {
            mentionedJid: [m.sender],
            externalAdReply: {
                title: 'System Notification',
                body: 'Notification Register',
                thumbnailUrl: 'https://raw.githubusercontent.com/Fiisya/uploads/main/uploads/1747842342295.jpeg',
                sourceUrl: 'https://whatsapp.com/channel/0029Vb4fjWE1yT25R7epR110',
                mediaType: 1,
                renderLargerThumbnail: false
            }
        }
    })
}
handler.help = ['@verify']
handler.tags = ['info']
handler.customPrefix = /^(@verify)/i;
handler.command = new RegExp()

export default handler

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}