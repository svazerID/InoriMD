/* import fetch from 'node-fetch'

global.chats = global.chats || {
  '120363217994871358@g.us': { notifgempa: true },
  '120363252889541048@g.us': { notifgempa: true },
};

let lastGempaTime = null;
const CHECK_INTERVAL = 60 * 60 * 1000; // 1 jam
let isReminderStarted = false;

async function fetchGempaBMKG() {
  try {
    let res = await (await fetch('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json')).json()
    return res.Infogempa.gempa
  } catch (error) {
    console.error('[❗] Gagal mengambil data dari BMKG:', error.message)
    return null
  }
}

function formatBMKGGempa(data) {
  return {
    waktu: data.DateTime,
    koordinat: data.Coordinates,
    magnitude: data.Magnitude,
    kedalaman: data.Kedalaman,
    wilayah: data.Wilayah,
    potensi: data.Potensi,
    gambar: 'https://data.bmkg.go.id/DataMKG/TEWS/' + data.Shakemap
  };
}

async function processBMKGGempa(conn) {
  console.log('Mengecek data gempa terbaru dari BMKG...')
  const data = await fetchGempaBMKG()
  if (!data) return

  if (lastGempaTime === data.DateTime) {
    console.log('Data gempa belum berubah')
    return
  }

  lastGempaTime = data.DateTime
  const info = formatBMKGGempa(data)

  const teks = `🚨 *PENGINGAT GEMPA BUMI* 🚨

🕒 *Waktu:* ${info.waktu}
🌍 *Wilayah:* ${info.wilayah}
💥 *Magnitudo:* ${info.magnitude}
🌐 *Koordinat:* ${info.koordinat}
🔍 *Kedalaman:* ${info.kedalaman}
🌊 *Potensi:* ${info.potensi}

⚠️ Tetap waspada dan jaga keselamatan!`

  await sendGempaReminderToGroups(info, teks, conn)
}

async function sendGempaReminderToGroups(info, teks, conn) {
  const promises = Object.entries(global.chats)
    .filter(([_, config]) => config.notifgempa)
    .map(([chatId]) =>
      conn.sendFile(chatId, info.gambar, 'shakemap.jpg', teks).catch(err => {
        console.error(`[❗] Gagal kirim ke ${chatId}:`, err.message)
        return { success: false, chatId }
      })
    )

  const results = await Promise.all(promises)
  const failed = results.filter(r => r && !r.success)
  if (failed.length) {
    console.warn(`[⚠️] Gagal kirim ke ${failed.length} grup:`, failed.map(f => f.chatId))
  }
}

function startBMKGGempaReminder(conn) {
  if (isReminderStarted) {
    console.log('Pengingat gempa sudah aktif')
    return
  }

  console.log('✅ Memulai pengingat gempa dari BMKG')
  isReminderStarted = true

  processBMKGGempa(conn).catch(console.error)
  setInterval(() => processBMKGGempa(conn).catch(console.error), CHECK_INTERVAL)
}

const plugin = {
  name: 'gempa-bmkg',
  async before(m, { conn }) {
    startBMKGGempaReminder(conn)
    return true
  }
}

export default plugin */