const { WebcastChat } = require('tiktok-live-connector');
const express = require('express');
const app = express();

// Ganti "USERNAME_TIKTOK_ANDA" dengan username akun TikTok Anda yang mau LIVE (tanpa tanda @)
const toktokUsername = "99hheell"; 
let latestInteraction = { username: "System", type: "chat", message: "Toktok Bot Connected!" };

const toktokLiveConnection = new WebcastChat(toktokUsername);

toktokLiveConnection.connect().then(state => {
    console.log(`Berhasil terhubung ke room Toktok: ${state.roomId}`);
}).catch(err => {
    console.error('Gagal konek ke Toktok:', err);
});

toktokLiveConnection.on('chat', data => {
    latestInteraction = {
        username: data.uniqueId,
        type: "chat",
        message: data.comment
    };
    console.log(`[Toktok Chat] ${data.uniqueId}: ${data.comment}`);
});

toktokLiveConnection.on('gift', data => {
    if (data.giftType === 1 || data.repeatEnd) {
        latestInteraction = {
            username: data.uniqueId,
            type: "gift",
            message: `${data.giftName} (x${data.repeatCount})`
        };
        console.log(`[Toktok Gift] Dari ${data.uniqueId}: ${data.giftName}`);
    }
});

app.get('/latest-interaction', (req, res) => {
    res.json(latestInteraction);
    latestInteraction = { username: null, type: null, message: null };
});

// Render menggunakan process.env.PORT secara otomatis
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server jembatan Toktok berjalan di port ${PORT}`);
});
