import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        // Check if the user provided a UID
        if (!text) throw `Contoh: ${usedPrefix + command} 800076525`;

        // Construct the API URL with the user-provided UID
        const apiUrl = `https://api.platform.web.id/genshin?uid=${encodeURIComponent(text)}`;

        // Fetch data from the API
        const response = await fetch(apiUrl);

        // Check if the response is okay (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Check if the status is 200
        if (data.status === 200) {
            const player = data.info;

            // Send player information
            const message = `
👤 Nickname: ${player.nickname}
📊 Level: ${player.level}
🌍 World Level: ${player.worldLevel}
🏆 Achievements: ${player.achievement}
🌀 Spiral Abyss: ${player.spiralAbyss}
🔗 Detail Profile: [View Here](${data.detail_url})
            `;

            // Send Screenshot
            await conn.sendMessage(m.chat, {
                image: { url: data.screenshot },
                caption: message
            }, { quoted: m });
        } else {
            m.reply('🛑 Player profile not found or invalid UID.');
        }
    } catch (e) {
        console.error('Error:', e);
    }
}

handler.help = ['genshinstalk']
handler.tags = ['stalk']
handler.command = /^(genshinstalk|gistalk)$/i

handler.register = true
handler.limit = true

export default handler