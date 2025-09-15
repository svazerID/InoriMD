//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : searching/mcstalk
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        // Check if the user provided a username
        if (!text) throw `Contoh: ${usedPrefix + command} Dream`;

        // Construct the API URL with the user-provided username
        const apiUrl = `https://api.platform.web.id/minecraft?username=${encodeURIComponent(text)}`;

        // Fetch data from the API
        const response = await fetch(apiUrl);

        // Check if the response is okay (status in the range 200-299)
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Check if the profile is valid
        if (data.data && data.data.profile_valid) {
            const player = data.data;

            // Send Full Body Preview
            await conn.sendMessage(m.chat, {
                image: { url: player.full_body_preview_hd },
                caption: `
👤 Full Body Preview of ${player.username}
🏷️ Username: ${player.username}
🔑 ID: ${player.id}
🕶️ Skin Model: ${player.skin_model}
🔗 Namemc URL: ${player.namemc_url}
🔳 QR UUID: [QR Code](${player.qr_uuid})
                `
            }, { quoted: m });

            // Send Skin Texture
            await conn.sendMessage(m.chat, {
                image: { url: player.skin_texture },
                caption: `🖼️ Here’s the skin texture of ${player.username}.`
            }, { quoted: m });

        } else {
            m.reply('🛑 Player profile not found or invalid username.');
        }
    } catch (e) {
        console.error('Error:', e);
        m.reply('🚨 Error: ' + (process.env.NODE_ENV === 'production' ? 'An error occurred. Please try again later.' : e.message));
    }
}

handler.help = ['mcstalk <username>'];
handler.tags = ['stalk'];
handler.command = ['mcstalk', 'minecraftprofile'];
handler.limit = true;

export default handler;