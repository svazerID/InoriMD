import moment from 'moment-timezone'
import schedule from 'node-schedule'

const timeZone = 'Asia/Jakarta'
let _conn = null // menyimpan conn global

let handler = async (m, { conn, command, args, isOwner, isAdmin }) => {
    let chat = global.db.data.chats[m.chat]
    if (!m.isGroup) throw 'Perintah ini hanya bisa digunakan di grup!'
    if (!(isAdmin || isOwner)) throw 'Perintah ini hanya bisa digunakan oleh admin grup!'

    if (command === 'aktif' && args[0] === 'autogc') {
        if (args.length < 2) throw 'Format salah! Gunakan .aktif autogc jamTutup|jamBuka\nContoh: .aktif autogc 21|5'
        let [closeTime, openTime] = args[1].split('|').map(Number)
        if (isNaN(closeTime) || isNaN(openTime)) throw 'Jam tutup dan buka harus berupa angka!'
        chat.autoGc = { closeTime, openTime }
        chat.groupStatus = 'opened' // default status
        m.reply(`✅ Auto group close/open diaktifkan!\nGrup akan *ditutup* jam ${closeTime}:00 dan *dibuka* jam ${openTime}:00 WIB.`)
    } else if (command === 'mati' && args[0] === 'autogc') {
        delete chat.autoGc
        delete chat.groupStatus
        m.reply('❌ Auto group close/open dinonaktifkan.')
    }

    // simpan conn untuk jadwal
    if (!_conn) _conn = conn
}
handler.command = /^(aktif|mati)$/i
handler.help = ['aktif autogc jamTutup|jamBuka', 'mati autogc']
handler.tags = ['group']
handler.admin = true
handler.group = true

export default handler

// fungsi pengecekan terjadwal
const checkGroupsStatus = async () => {
    if (!_conn) return // skip kalau conn belum diset

    const currentHour = moment().tz(timeZone).hour()

    for (const chatId of Object.keys(global.db.data.chats)) {
        const chat = global.db.data.chats[chatId]
        if (!chat.autoGc) continue

        const { closeTime, openTime } = chat.autoGc

        if (currentHour === closeTime && chat.groupStatus !== 'closed') {
            await _conn.groupSettingUpdate(chatId, 'announcement').catch(() => {})
            await _conn.sendMessage(chatId, { text: `(⛔ OTOMATIS) Grup ditutup jam ${closeTime}:00 WIB.\nAkan dibuka kembali jam ${openTime}:00.` }).catch(() => {})
            chat.groupStatus = 'closed'
        }

        if (currentHour === openTime && chat.groupStatus !== 'opened') {
            await _conn.groupSettingUpdate(chatId, 'not_announcement').catch(() => {})
            await _conn.sendMessage(chatId, { text: `(✅ OTOMATIS) Grup dibuka jam ${openTime}:00 WIB.\nAkan ditutup lagi jam ${closeTime}:00.` }).catch(() => {})
            chat.groupStatus = 'opened'
        }
    }
}

// scheduler tiap menit
schedule.scheduleJob('* * * * *', checkGroupsStatus)