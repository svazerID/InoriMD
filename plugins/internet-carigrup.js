import fetch from 'node-fetch'

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `Uhm... cari apa?\n\nContoh:\n${usedPrefix + command} mabar`

  try {
    await m.reply(wait)

    const res = await fetch(`https://api.platform.web.id/whatsapp-groups?keywords=${encodeURIComponent(text)}`)
    const json = await res.json()

    if (!json.success || !json.groups || json.groups.length === 0) {
      throw 'Grup tidak ditemukan ¯\\_(ツ)_/¯'
    }

    const groups = json.groups.slice(0, 50) // maksimal 50 grup
    const teks = groups.map((g, i) => `*${i + 1}. ${g.Name}*\n${g.Link}\n${g.Description || 'Tidak ada deskripsi'}`).join('\n\n')

    m.reply(teks)

  } catch (err) {
    console.error(err)
    throw 'Terjadi kesalahan saat mencari grup.'
  }
}

handler.help = ['carigrup <pencarian>']
handler.tags = ['internet']
handler.command = /^carig(ro?up|c)/i
handler.limit = true

export default handler