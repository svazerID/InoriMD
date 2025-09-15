import { promises as fs } from 'fs'
import path from 'path'

const dbFolder = path.resolve('./json')
const dbPath = path.join(dbFolder, 'intro.json')

// Fungsi buat cek dan buat folder + file kalau belum ada
async function loadDB() {
  try {
    await fs.mkdir(dbFolder, { recursive: true }) // buat folder database kalau belum ada
    try {
      const data = await fs.readFile(dbPath, 'utf8')
      global.db = global.db || {}
      global.db.kartuIntroPerGroup = JSON.parse(data)
    } catch (err) {
      // Kalau file belum ada, buat file baru
      global.db = global.db || {}
      global.db.kartuIntroPerGroup = {}
      await saveDB()
    }
  } catch (err) {
    console.error('Gagal membuat database:', err)
  }
}

// Fungsi save ke file
async function saveDB() {
  if (!global.db || !global.db.kartuIntroPerGroup) return
  await fs.writeFile(dbPath, JSON.stringify(global.db.kartuIntroPerGroup, null, 2))
}

// Load database saat bot jalan
loadDB()

const handler = async (m, { conn, command, text }) => {
  global.db = global.db || {}
  global.db.kartuIntroPerGroup = global.db.kartuIntroPerGroup || {}

  const groupId = m.chat

  if (command === 'setintro') {
    if (!text) return m.reply(`Contoh: .setintro Nama:\n Gender:\n Umur:`)
    global.db.kartuIntroPerGroup[groupId] = text
    await saveDB()
    return m.reply('Intro untuk grup ini berhasil disimpan!')
  }

  if (command === 'intro') {
    const intro = global.db.kartuIntroPerGroup[groupId]
    if (!intro) return m.reply('Belum ada intro yang disimpan. Gunakan .setintro untuk menyimpannya.')

    return m.reply(`*乂 I N T R O  G R U P*\n\n${intro}`)
  }
}

handler.help = ['setintro <isi>', 'intro']
handler.tags = ['group']
handler.command = /^(setintro|intro)$/i
handler.register = false

export default handler