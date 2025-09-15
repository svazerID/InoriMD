import fetch from "node-fetch";

export async function before(m) {
    this.autosholat = this.autosholat || {};
    const who = m.mentionedJid?.[0] || (m.fromMe ? this.user.jid : m.sender);
    const id = m.chat;

    if (id in this.autosholat) return false;

    // Jadwal sholat (sebaiknya diganti dengan API dinamis)
    const jadwalSholat = {
        Dzuhur: "12:10",
        Asr: "15:10",
        Maghrib: "18:20",
        Isha: "19:30",
        Subuh: "05:30",
    };

    const date = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const timeNow = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

    // Toleransi ±1 menit
    const checkTimeRange = (jadwalTime) => {
        const [jadwalH, jadwalM] = jadwalTime.split(":").map(Number);
        const diff = (hours - jadwalH) * 60 + (minutes - jadwalM);
        return Math.abs(diff) <= 1; // Toleransi 1 menit
    };

    for (const [sholat, waktu] of Object.entries(jadwalSholat)) {
        if (checkTimeRange(waktu)) {
            const command = sholat.toLowerCase();
            const caption = `Now playing ${sholat} prayer reminder audio.`;
            const audio = `https://l.top4top.io/m_2993721ug9.mp3`;
            const thumbnailURL = 'https://telegra.ph/file/b59f136e6c56f9039529c.jpg';

            try {
                const thumb = await fetch(thumbnailURL).then(res => res.buffer());
                await this.sendFile(m.chat, audio, 'adzan.mp3', caption, m, true, {
                    type: 'audioMessage',
                    ptt: true,
                    contextInfo: {
                        mentionedJid: [who],
                        externalAdReply: {
                            showAdAttribution: false,
                            mediaUrl: 'https://instagram.com/rdnmshtguy',
                            mediaType: 2,
                            title: `Waktu Sholat ${sholat} Telah Tiba`,
                            body: 'Ambillah air wudhu dan segeralah shalat',
                            renderLargerThumbnail: true,
                            thumbnail: thumb
                        }
                    }
                });
            } catch (err) {
                console.error("Gagal mengirim pengingat sholat:", err);
                // Fallback: Kirim tanpa thumbnail
                await this.sendFile(m.chat, audio, 'adzan.mp3', caption, m, true, {
                    type: 'audioMessage',
                    ptt: true
                });
            }

            // Bersihkan setelah 57 detik (tidak perlu 57000 ms)
            this.autosholat[id] = setTimeout(() => {
                delete this.autosholat[id];
            }, 57000);
        }
    }
}

export const disabled = false;