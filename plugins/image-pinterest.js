let handler = async (m, { conn, text, usedPrefix, command, isPrems }) => {
	if (!text) throw `Example : ${usedPrefix + command} spongebob`
	try {
		let anu = await (await fetch(`https://api.platform.web.id/pinterest?q=${text}`)).json()
		await conn.sendMessage(m.chat, { react: { text: '🔍', key: m.key } })
		anu = anu.results.getRandom()
		await conn.sendFile(m.chat, anu, '', anu.status || `*Search : ${text.trim()}*`, m)
	} catch (e) {
		console.log(e)
		m.reply('media tidak ditemukan')
	}
}

handler.help = ['pinterest'];
handler.tags = ['internet'];
handler.command = /^pin(terest)?$/i;
handler.limit = 2;
handler.register = true;

export default handler;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}