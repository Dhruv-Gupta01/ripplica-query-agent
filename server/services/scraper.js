// const { chromium } = require('playwright');

// async function scrapeDuckDuckGo(query) {
//   const browser = await chromium.launch({ headless: true });

//   const context = await browser.newContext({
//     userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36'
//   });
//   const page = await context.newPage();

//   await page.goto(`https://duckduckgo.com/?q=${encodeURIComponent(query)}`, {
//     waitUntil: 'domcontentloaded',
//   });
//   console.log("DuckDuckGo page loaded");
//   await page.waitForSelector('.result__a', { timeout: 10000 });
//   console.log("Results loaded");
//   const links = await page.$$eval('.result__a', anchors =>
//     anchors
//       .map(a => a.href || a.getAttribute('href'))
//       .filter(href => href && href.startsWith('http'))
//       .slice(0, 5)
//   );

//   const pageContents = [];

//   for (const url of links) {
//     try {
//       const contentPage = await browser.newPage();
//       await contentPage.goto(url, { timeout: 15000, waitUntil: 'domcontentloaded' });
//       const content = await contentPage.$eval('body', el => el.innerText);
//       pageContents.push({ url, content: content.slice(0, 5000) });
//       await contentPage.close();
//     } catch (err) {
//       console.error(`❌ Error scraping ${url}:`, err.message);
//     }
//   }

//   await browser.close();
//   return pageContents;
// }

// module.exports = { scrapeDuckDuckGo };





// const { chromium } = require('playwright');
// const fs = require('fs');

// async function scrapeGoogle(query) {
//   const browser = await chromium.launch({ headless: true });
//   const context = await browser.newContext({
//     userAgent:
//       'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36',
//     viewport: { width: 1280, height: 720 },
//     locale: 'en-US',
//   });

//   const page = await context.newPage();

//   await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`, {
//     waitUntil: 'networkidle',
//   });

//   // Handle cookie/consent form if present
//   try {
//     const consent = await page.$('form[action*="consent"] button');
//     if (consent) {
//       await consent.click();
//       await page.waitForTimeout(2000);
//     }
//   } catch (e) {
//     console.log("✅ No consent popup");
//   }

//   // Wait for a flexible, generic selector
//   await page.waitForSelector('a[href^="http"]:not([href*="google.com"])', {
//     timeout: 15000,
//   });

//   // Dump HTML for debugging
//   const html = await page.content();
//   fs.writeFileSync('google_debug.html', html);

//   const links = await page.$$eval('a[href^="http"]:not([href*="google.com"])', (anchors) =>
//     anchors.map((a) => a.href).slice(0, 5)
//   );

//   const pageContents = [];

//   for (const url of links) {
//     try {
//       const contentPage = await browser.newPage();
//       await contentPage.goto(url, { timeout: 15000, waitUntil: 'domcontentloaded' });
//       const content = await contentPage.$eval('body', (el) => el.innerText);
//       pageContents.push({ url, content: content.slice(0, 5000) });
//       await contentPage.close();
//     } catch (err) {
//       console.error(`❌ Error scraping ${url}:`, err.message);
//     }
//   }

//   await browser.close();
//   console.log(`✅ Scraped ${pageContents.length} pages for query: ${query}`);
//   return pageContents;
// }

// module.exports = { scrapeGoogle };





const { chromium } = require('playwright');
const fs = require('fs');
const url = require('url');

function extractRealUrl(bingUrl) {
  try {
    const parsed = new URL(bingUrl);
    const uParam = parsed.searchParams.get('u');
    return decodeURIComponent(uParam);
  } catch (err) {
    return null;
  }
}

async function scrapeBing(query) {
  const browser = await chromium.launch({ headless: true });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115 Safari/537.36',
    viewport: { width: 1280, height: 720 },
    locale: 'en-US',
  });

  const page = await context.newPage();

  await page.goto(`https://www.bing.com/search?q=${encodeURIComponent(query)}`, {
    waitUntil: 'networkidle',
  });
  console.log("Bing page loaded");
  await page.waitForSelector('li.b_algo h2 a', { timeout: 10000 });
  console.log("Results loaded");
  const rawLinks = await page.$$eval('li.b_algo h2 a', (anchors) =>
    anchors.map((a) => a.href).slice(0, 5)
  );
  console.log("Links extracted : ", rawLinks);
  // ✅ Extract actual destination URLs
//   const links = rawLinks
//     .map(extractRealUrl)
//     .filter((href) => href && href.startsWith('http'));
  const links = rawLinks;
  console.log("Links filtered : ", links);
  const pageContents = [];
  for (const url of links) {
    try {
      const contentPage = await browser.newPage();
      console.log("Content page created");
      await contentPage.goto(url, { timeout: 15000, waitUntil: 'domcontentloaded' });
      console.log("Content page loaded");
      const content = await contentPage.$eval('body', (el) => el.innerText);
      console.log("Content : ", content.slice(0,200));
      pageContents.push({ url, content: content.slice(0, 5000) });
      await contentPage.close();
    } catch (err) {
      console.error(`❌ Error scraping ${url}:`, err.message);
    }
  }

  await browser.close();
  console.log(`✅ Scraped ${pageContents.length} pages for query: ${query}`);
  return pageContents;
}

module.exports = { scrapeBing };
