import moment from 'moment-timezone';
import fs from 'fs';
import { exec } from "child_process";
import { promisify } from "util";

const exec_ = promisify(exec);

export async function all(m) {
    let setting = global.db.data.settings[this.user.jid];
    
    if (setting.backup) {
        if (new Date().getTime() - setting.backupDB > 7200000) {
            try {
                let d = new Date();
                let date = d.toLocaleDateString('id', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                });

                const q = {
                    "key": {
                        "remoteJid": "status@broadcast",
                        "participant": "0@s.whatsapp.net",
                        "fromMe": false,
                        "id": ""
                    },
                    "message": {
                        "conversation": "Successful Backupsc."
                    }
                };

                const zipFileName = `Inori-Beta.zip`;

                m.reply("brum brum brum...");

                // Tunggu 1 detik sebelum memulai proses backup
                setTimeout(async () => {
                    try {
                        const zipCommand = `zip -r ${zipFileName} * -x "node_modules/*"`;

                        await exec_(zipCommand);

                        // Pastikan file zip benar-benar dibuat
                        if (fs.existsSync(zipFileName)) {
                            // Baca file untuk dikirim
                            const file = fs.readFileSync(zipFileName);

                            // Kirim file backup ke admin
                            await this.sendMessage(
                                nomorown + '@s.whatsapp.net',
                                {
                                    document: file,
                                    mimetype: "application/zip",
                                    fileName: zipFileName,
                                    caption: "brumm brummm brum....",
                                },
                                { quoted: q }
                            );

                            m.reply("brumm brumm tit tit..");

                            // Hapus file setelah 5 detik
                            setTimeout(() => {
                                fs.unlinkSync(zipFileName);
                                m.reply("brumm....");
                            }, 5000);
                        } else {
                            m.reply("huekk...");
                        }
                    } catch (execError) {
                        console.error("Error during zip creation:", execError);
                        m.reply("aaaa");
                    }
                }, 1000);

                setting.backupDB = new Date().getTime();
            } catch (error) {
                m.reply("aaaaa.");
                console.error("Error in backup process:", error);
            }
        }
    }
    return true;
}