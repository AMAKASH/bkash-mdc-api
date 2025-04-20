const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
app.use(express.json());
let browser;

// Function to launch browser with recommended settings
async function launchBrowser() {
  try {
    browser = await puppeteer.launch({
      //executablePath: "/usr/bin/chromium-browser",
      headless: "new",
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-web-security",
        "--disable-gpu",
        "--memory-pressure-off",
        "--single-process",
      ],
    });
    console.log("Puppeteer browser launched");

    // Add crash handler
    browser.on("disconnected", async () => {
      console.log("Browser crashed or disconnected. Relaunching...");
      await launchBrowser();
    });
  } catch (error) {
    console.error("Failed to launch browser:", error);
    // Retry launch after 5 seconds
    setTimeout(launchBrowser, 5000);
  }
}

// Initial browser launch
launchBrowser();

app.post("/screenshot/:id", async (req, res) => {
  // Check if browser is available
  if (!browser?.isConnected()) {
    await launchBrowser();
  }

  const { id } = req.params;
  const { destinationFilePath } = req.body;
  let page;

  try {
    page = await browser.newPage();
    await page.goto(`${process.env.CaptureURL}/api/v1/render/${id}`);
    await page.waitForSelector("#target-div");

    const div = await page.$("#target-div");
    await div.screenshot({
      path: destinationFilePath,
    });
    res.json({ msg: "imageRendered" });
    console.log("Save Image as:", destinationFilePath);
  } catch (error) {
    console.error("Error taking screenshot:", error);
    res.status(500).send("Error taking screenshot");
  } finally {
    if (page) await page.close();
  }
});

const PORT = process.env.BROWSER_PORT || 3001;
app.listen(PORT, () => {
  console.log(`Puppeteer service running on port ${PORT}`);
});
