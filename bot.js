const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const accounts = require(path.join(__dirname, "accounts.json"));
const tasks = require(path.join(__dirname, "tasks.json"));

function randomDelay(min = 2000, max = 6000) {
  return new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min)) + min));
}

async function saveCookies(page, username) {
  const cookies = await page.cookies();
  const sessionDir = path.join(__dirname, "sessions");
  if (!fs.existsSync(sessionDir)) fs.mkdirSync(sessionDir);
  fs.writeFileSync(path.join(sessionDir, `${username}.json`), JSON.stringify(cookies));
}

async function loadCookies(page, username) {
  const cookiePath = path.join(__dirname, "sessions", `${username}.json`);
  if (fs.existsSync(cookiePath)) {
    const cookies = JSON.parse(fs.readFileSync(cookiePath));
    await page.setCookie(...cookies);
    return true;
  }
  return false;
}

async function login(page, account) {
  try {
    await page.goto("https://www.instagram.com/accounts/login/", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    await page.waitForSelector('input[name="username"]', { timeout: 15000 });
    await page.type('input[name="username"]', account.username, { delay: 100 });
    await page.type('input[name="password"]', account.password, { delay: 100 });

    await Promise.all([
      page.click('button[type="submit"]'),
      page.waitForNavigation({ waitUntil: "networkidle2", timeout: 60000 }),
    ]);

    console.log(`[+] Logged in as ${account.username}`);
    await saveCookies(page, account.username);
  } catch (err) {
    throw new Error(`Login failed for ${account.username}: ${err.message}`);
  }
}

async function performTask(page, task) {
  await randomDelay();

  if (task.type === "follow") {
    const targetUrl = `https://www.instagram.com/${task.target}/`;
    try {
      await page.goto(targetUrl, { waitUntil: "networkidle2", timeout: 60000 });
      await page.waitForSelector('button', { timeout: 10000 });

      const buttons = await page.$$('button');
      for (let btn of buttons) {
        const text = await page.evaluate(el => el.innerText, btn);
        if (text.toLowerCase() === "follow") {
          await btn.click();
          console.log(`[✓] Followed ${task.target}`);
          break;
        }
      }
    } catch (err) {
      console.log(`[x] Could not follow ${task.target}: ${err.message}`);
    }

  } else if (task.type === "like") {
    try {
      await page.goto(task.postUrl, { waitUntil: "networkidle2", timeout: 60000 });
      await page.waitForSelector('svg[aria-label="Like"]', { timeout: 10000 });
      const likeButton = await page.$('svg[aria-label="Like"]');
      if (likeButton) {
        await likeButton.click();
        console.log(`[✓] Liked post: ${task.postUrl}`);
      }
    } catch (err) {
      console.log(`[x] Could not like post: ${task.postUrl}: ${err.message}`);
    }
  }

  await randomDelay();
}

async function runBot(account) {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    const cookiesLoaded = await loadCookies(page, account.username);
    if (!cookiesLoaded) {
      await login(page, account);
    } else {
      console.log(`[+] Logged in with saved session: ${account.username}`);
    }

    for (const task of tasks) {
      await performTask(page, task);
    }
  } catch (err) {
    console.error(`❌ Error with ${account.username}: ${err.message}`);
  } finally {
    await browser.close();
  }
}

// 🔁 Loop through all accounts
(async () => {
  for (const account of accounts) {
    console.log(`\n🔁 Starting tasks for ${account.username}`);
    await runBot(account);
  }
})();
