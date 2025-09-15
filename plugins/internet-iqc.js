import fetch from 'node-fetch';
import moment from 'moment-timezone';

let handler = async (m, { conn, text }) => {

const time = moment().tz('Asia/Jakarta');
  const displayDate = time.format('dddd, DD MMMM YYYY'); // Date in Indonesian
  const displayTime = `${time.format('HH:mm:ss')}`;
  
  if (!text) throw 'gunakan : .iqc pesan\ncontoh : .iqc hai hai'

  await conn.reply(m.chat, 'waitt', m)

  let url = `https://brat.siputzx.my.id/iphone-quoted?time=${displayTime}&batteryPercentage=60&carrierName=INDOSAT&messageText=${text}&emojiStyle=apple`

  let res = await fetch(url)
  if (!res.ok) throw 'gagal fetch url'

  let buffer = await res.buffer()
  await conn.sendMessage(m.chat, { image: buffer }, { quoted: m })
}

handler.help = ['iqc']
handler.tags = ['internet']
handler.command = ['iqc']

export default handler;