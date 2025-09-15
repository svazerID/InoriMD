let handler = async (m, { conn, args, usedPrefix, command }) => {
    // Check if a URL is provided
    if (!args[0]) {
        throw `Example: ${usedPrefix}${command} https://www.mediafire.com/file/xxxx`;
    }

    // Validate the MediaFire URL
    const mediaFireUrlPattern = /(?:https?:\/\/)?(?:www\.)?mediafire\.com\/file\//i;
    if (!mediaFireUrlPattern.test(args[0])) {
        return m.reply('❌ Invalid MediaFire URL. Please provide a valid MediaFire file link.');
    }

    // Indicate that the process has started
    await conn.sendMessage(m.chat, { react: { text: '⌛', key: m.key } });

    try {
        // Fetch data from the API
        const apiUrl = `https://api.platform.web.id/mediafire?url=${encodeURIComponent(args[0])}`;
        let res = await fetch(apiUrl);
        
        // Check if the response is ok
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        let json = await res.json();
        
        // Debug: log the response structure
        console.log('API Response:', json);
        
        // Check if the response contains required data
        // Based on your output, the API returns direct properties, not nested in 'data'
        if (!json.download_url || !json.filename) {
            // Check if there's an error message in the response
            const errorMsg = json.error || json.message || 'Invalid response from MediaFire API';
            throw new Error(errorMsg);
        }

        // Validate download URL
        if (!json.download_url.startsWith('http')) {
            throw new Error('Invalid download URL received from API');
        }

        // React with success
        await conn.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        // Prepare the message caption
        let caption = `*📥 MediaFire Download*\n\n` +
                      `📄 **File:** ${json.filename || 'Unknown'}\n` +
                      `📦 **Size:** ${json.filesize || 'Unknown'}\n` +
                      `📅 **Uploaded:** ${json.uploaded || 'Unknown'}\n` +
                      `🗂️ **Type:** ${json.mimetype || 'Unknown'}\n\n` +
                      `_Downloading file, please wait..._`;

        // Send info message first
        await m.reply(caption);

        // Download and send the file
        try {
            await conn.sendFile(m.chat, json.download_url, json.filename, `✅ Download completed!\n\n📄 ${json.filename}`, m);
            
            // React with completion
            await conn.sendMessage(m.chat, { react: { text: '📁', key: m.key } });
            
        } catch (downloadError) {
            console.error('Download Error:', downloadError);
            
            // If direct download fails, provide the download link
            const fallbackMsg = `❌ Failed to upload file directly. Here's the download link:\n\n` +
                               `🔗 **Download Link:**\n${json.download_url}\n\n` +
                               `📄 **Filename:** ${json.filename}\n` +
                               `📦 **Size:** ${json.filesize}\n\n` +
                               `_Click the link above to download manually._`;
            
            await m.reply(fallbackMsg);
        }

    } catch (error) {
        console.error('MediaFire Handler Error:', error);
        
        // React with error
        await conn.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        
        // Provide detailed error message
        let errorMessage = '❌ Failed to download MediaFire file.\n\n';
        
        if (error.message.includes('HTTP 404')) {
            errorMessage += '🔍 **Error:** File not found or link expired.\n';
            errorMessage += '💡 **Solution:** Check if the MediaFire link is still valid.';
        } else if (error.message.includes('HTTP 403')) {
            errorMessage += '🚫 **Error:** Access denied.\n';
            errorMessage += '💡 **Solution:** File might be private or requires permission.';
        } else if (error.message.includes('HTTP 500')) {
            errorMessage += '⚠️ **Error:** Server error.\n';
            errorMessage += '💡 **Solution:** Try again later, the server might be temporarily down.';
        } else if (error.message.includes('Network')) {
            errorMessage += '🌐 **Error:** Network connection problem.\n';
            errorMessage += '💡 **Solution:** Check your internet connection and try again.';
        } else {
            errorMessage += `⚠️ **Error:** ${error.message || 'Unknown error occurred.'}\n`;
            errorMessage += '💡 **Solution:** Please try again or contact support if the problem persists.';
        }
        
        // Add troubleshooting tips
        errorMessage += '\n\n📋 **Troubleshooting:**\n';
        errorMessage += '• Make sure the MediaFire link is complete and valid\n';
        errorMessage += '• Check if the file is still available on MediaFire\n';
        errorMessage += '• Try copying the link again from MediaFire';
        
        m.reply(errorMessage);
    }
};

// Command metadata
handler.help = ['mediafire <url>'];
handler.tags = ['downloader'];
handler.command = /^(mediafire|mf(dl)?)$/i;
handler.premium = false;
handler.limit = true;

export default handler;