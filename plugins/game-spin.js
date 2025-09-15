const handler = async (m, { conn, args }) => {
    global.db = global.db || {};
    global.db.data = global.db.data || {};
    global.db.data.users = global.db.data.users || {};
    global.db.data.users[m.sender] = global.db.data.users[m.sender] || { money: 100000 };

    let user = global.db.data.users[m.sender];

    if (args.length < 2) {
        return conn.reply(m.chat, 'Contoh: .spin 10000 10', m);
    }

    let betAmount = parseInt(args[0]);
    let spinCount = parseInt(args[1]);

    if (isNaN(betAmount) || betAmount <= 0) {
        return conn.reply(m.chat, 'Jumlah taruhan tidak valid.', m);
    }

    if (isNaN(spinCount) || spinCount <= 0 || spinCount > 20) {
        return conn.reply(m.chat, 'Jumlah spin harus antara 1 hingga 20.', m);
    }

    if (user.money < betAmount) {
        return conn.reply(m.chat, 'Uang kamu tidak cukup untuk taruhan ini.', m);
    }

    user.money -= betAmount;
    let singleBet = betAmount / spinCount;
    let fruits = ['🈴', '💮', '🈺', '☯️', '✳️'];
    let winPatterns = [
        ['🈴', '🈴', '🈴', '🈴', '🈴', '🈴'],
        ['🈴', '💮', '🈴', '💮', '🈴', '💮'],
        ['🈴', '🈴', '🈴'],
        ['🈴', '🈴', '💮', '🈴', '🈴'],
        ['🈴', '🈴', '🈴', '🈴'],
        ['💮', '💮', '🈴', '🈴', '💮', '💮']
    ];

    let wins = 0;
    let losses = 0;
    let totalWinAmount = 0;
    let totalLossAmount = 0;
    let bigWins = 0;
    let superWins = 0;

    const generateSpinResult = () => {
        let result = [];
        for (let i = 0; i < 4; i++) {
            let row = [];
            for (let j = 0; j < 6; j++) {
                row.push(fruits[Math.floor(Math.random() * fruits.length)]);
            }
            result.push(row);
        }
        return result;
    };

    const checkWin = (result) => {
        for (let pattern of winPatterns) {
            if (result.some(row => row.join('').includes(pattern.join('')))) {
                if (pattern.length === 4) {
                    superWins++;
                    totalWinAmount += singleBet * 50;
                    return 'Super Win';
                } else if (pattern.length === 3) {
                    bigWins++;
                    totalWinAmount += singleBet * 10;
                    return 'Big Win';
                } else {
                    wins++;
                    totalWinAmount += singleBet * 2;
                    return 'Win';
                }
            }
        }
        return 'Lose';
    };

    let initialMessage = await conn.reply(m.chat, `Memulai Spin\n👤 User: @${m.sender.split('@')[0]}\n🎰 Spin: ${spinCount}\n💰 Taruhan: ${betAmount}`, m);
    for (let i = 0; i < spinCount; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));

        let spinResult = generateSpinResult();
        let spinText = spinResult.map(row => row.join(' ')).join('\n');
        let spinStatus = checkWin(spinResult);

        if (spinStatus === 'Win' || spinStatus === 'Big Win' || spinStatus === 'Super Win') {
            wins++;
        } else {
            losses++;
            totalLossAmount += singleBet;
        }

        let updateMessage = `Memulai Spin\n👤 User: @${m.sender.split('@')[0]}\n🎰 Spin: ${spinCount}\n💰 Taruhan: ${betAmount}\n\n${spinText}`;
        if (i === spinCount - 1) {
            updateMessage += `\n\nResult\nWin: ${wins}\n -Total: ${totalWinAmount}\nLose: ${losses}\n -Total: ${totalLossAmount}\nSpin: ${spinCount}`;

            if (bigWins > 0 || superWins > 0) {
                updateMessage += `\n\nSuper Result\nBig Win: ${bigWins}\nSuper Win: ${superWins}`;
            }
        }

        await conn.relayMessage(m.chat, {
            protocolMessage: {
                key: initialMessage.key,
                type: 14,
                editedMessage: {
                    conversation: updateMessage
                }
            }
        }, {});
    }

    user.money += totalWinAmount; // Mengembalikan uang kemenangan ke pengguna
};

handler.help = ['spin'];
handler.tags = ['game'];
handler.command = /^(spin)$/i;
export default handler