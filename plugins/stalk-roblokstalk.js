//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : searching/robloxstalk
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `👤 Contoh penggunaan:\n${usedPrefix + command} elz_gokilll`

    try {
        let res = await fetch(`https://api.platform.web.id/roblox-stalk?username=${encodeURIComponent(text)}`)
        let json = await res.json()

        if (!json?.account?.username) throw `❌ User tidak ditemukan.`

        let acc = json.account
        let pres = json.presence
        let stats = json.stats

        let teks = `👾 *ROBLOX USER INFO*\n\n`
        teks += `👤 Username: ${acc.username}\n`
        teks += `📛 Display: ${acc.displayName}\n`
        teks += `📝 Bio: ${acc.description || "-"}\n`
        teks += `📅 Joined: ${new Date(acc.created).toLocaleDateString('id-ID')}\n`
        teks += `🚦 Online: ${pres.isOnline ? "Ya" : "Tidak"}\n`
        teks += `🎮 Last game: ${pres.recentGame || "-"}\n\n`
        teks += `👥 Friends: ${stats.friendCount}\n`
        teks += `⭐ Followers: ${stats.followers}\n`
        teks += `➡️ Following: ${stats.following}\n\n`

        teks += `🏅 *Top Badges:*\n`
        for (let badge of json.badges.slice(0,5)) {
            teks += `- ${badge.name}\n`
        }

        teks += `\n👫 *Top Friends:*\n`
        for (let friend of json.friendList.slice(0,5)) {
            teks += `- ${friend.displayName} (@${friend.name})\n`
        }

        await conn.sendMessage(m.chat, {
            image: { url: acc.profilePicture },
            caption: teks
        }, { quoted: m })
    } catch (e) {
        console.error(e)
        throw `🚫 Gagal mengambil data. Pastikan username benar.`
    }
}

handler.help = ['robloxstalk <username>']
handler.tags = ['stalk']
handler.command = /^robloxstalk$/i
handler.limit = true

export default handler