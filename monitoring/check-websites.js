import fetch from "node-fetch";

const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK;

// Daftar website
const websites = [
  "https://frankandcojewellery.com/en/",
  "https://mondialjeweler.com/en/",
  "https://thepalacejeweler.com/",

  "https://frankandcojewellery.com/en/contacts",
  "https://frankandcojewellery.com/en/diamond-education",
  "https://frankandcojewellery.com/en/size-guide",
  "https://frankandcojewellery.com/en/faq",
  "https://frankandcojewellery.com/en/terms-and-conditions",
  "https://frankandcojewellery.com/en/privacy-policy",
  "https://frankandcojewellery.com/en/stores",
  "https://frankandcojewellery.com/en/articles",
  "https://frankandcojewellery.com/en/about-us",

  "https://thepalacejeweler.com/about/the-palace",
  "https://thepalacejeweler.com/about/diamond",
  "https://thepalacejeweler.com/about/gold",
  "https://thepalacejeweler.com/location",
  "https://thepalacejeweler.com/article",
  "https://thepalacejeweler.com/faq",
  "https://thepalacejeweler.com/terms-condition",
  "https://thepalacejeweler.com/privacy-policies",

  "https://mondialjeweler.com/en/contacts",
  "https://mondialjeweler.com/en/faq",
  "https://mondialjeweler.com/en/terms",
  "https://mondialjeweler.com/en/stores",
  "https://mondialjeweler.com/en/stories/all",

  "https://mondialjeweler.com/id/stories/articles",
  "https://frankandcojewellery.com/id/articles",
  "https://thepalacejeweler.com/article",

  "https://frankandcojewellery.com/id/rings/",

  "https://mondialjeweler.com/en/products/mondial-realms",
  "https://mondialjeweler.com/en/stories/articles/mengapa-excellent-cut-jadi-standar-keindahan-perhi",

  "https://thepalacejeweler.com/#collection-section",
  "https://thepalacejeweler.com/product?type=Perhiasan+Emas&categories[]=Gelang",
  "https://thepalacejeweler.com/article/mewah-dan-terjangkau-ini-8-model-cincin-emas-wani",

  // "https://frankandcojewellery.com/id/articles/tips-memberikan-cincin-berlian-sebagai-year-end-gi,",
];

async function sendSlackMessage(text) {
  await fetch(SLACK_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

async function checkWebsite(url) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(url, {
      method: "GET",
      signal: controller.signal,
    });
    clearTimeout(timeout);

    // Case 1: status bukan 2xx
    if (!res.ok) {
      console.log(`❌ DOWN: ${url} | Status: ${res.status}`);

      await sendSlackMessage(
        `🚨 *Website DOWN!*  
URL: ${url}  
Status: ${res.status} (${res.statusText})`
      );
      return;
    }

    // Case 2: response kosong / error halaman
    const text = await res.text();
    if (!text || text.length < 30) {
      console.log(`❌ EMPTY PAGE: ${url}`);

      await sendSlackMessage(
        `🚨 *Website EMPTY RESPONSE!*  
URL: ${url}`
      );

      return;
    }

    console.log(`✅ UP: ${url}`);
  } catch (err) {
    console.log(`❌ ERROR: ${url} | ${err.message}`);

    let reason = err.message;

    if (err.type === "aborted")
      reason = "Timeout — website lambat / tidak merespon";
    if (reason.includes("certificate")) reason = "SSL Certificate Error";
    if (reason.includes("ENOTFOUND")) reason = "DNS Lookup Failed";
    if (reason.includes("ECONNREFUSED")) reason = "Connection Refused";

    await sendSlackMessage(
      `🚨 *Website ERROR!*  
URL: ${url}  
Reason: ${reason}`
    );
  }
}

async function run() {
  console.log("🔍 Checking websites...\n");

  for (const site of websites) {
    await checkWebsite(site);
  }

  console.log("\n✅ Check completed.");
}

run();
