//Simple Base Botz// • Credits : wa.me/62895322391225 [ Asyl ]// • Feature : searching/teraboxsearch
import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        // Check if the user provided a query
        if (!text) throw `Contoh: ${usedPrefix + command} calla`;

        // Construct the API URL with the user-provided query
        const apiUrl = `https://api.platform.web.id/terabox-search?query=${encodeURIComponent(text)}&types=both`;

        // Fetch data from the API
        const response = await fetch(apiUrl);

        // Check for HTTP response status
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Parse the JSON response
        const data = await response.json();

        // Check for success and validate the result
        if (data.success && data.code === 200) {
            let outputMessages = [];
            const contents = data.result.contents;

            // Process the contents and format the output
            if (contents.length > 0) {
                contents.forEach(content => {
                    content.results.forEach(result => {
                        const message = `🎬 Title: ${result.title}\n🔗 URL: ${result.url}\n🔍 Preview: ${result.preview || 'No preview available.'}\n`;
                        outputMessages.push(message);
                    });
                });

                // Send back the joined responses to the user
                m.reply(outputMessages.join('\n'));
            } else {
                m.reply('🛑 No results found for your query.');
            }
        } else {
            throw new Error('Unexpected API response format.');
        }
    } catch (e) {
        console.error('Error:', e);
        m.reply('🚨 Error: ' + (process.env.NODE_ENV === 'production' ? 'An error occurred. Please try again later.' : e.message));
    }
}

handler.help = ['teraboxsearch <query>'];
handler.tags = ['internet'];
handler.command = ['teraboxsearch'];
handler.limit = true;

export default handler;