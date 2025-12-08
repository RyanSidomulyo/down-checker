import fetch from "node-fetch";

// Daftar website yang ingin dicek
const websites = [
  "https://frankandcojewellery.com/en/",
  "https://mondialjeweler.com/en/",
  "https://thepalacejeweler.com/",
  "https://centralmegakencana.com/",
  "https://pertaminaretail.com/",

  "https://mondialjeweler.com/en/contacts",
  "https://mondialjeweler.com/en/faq",
  "https://mondialjeweler.com/en/terms",
  "https://mondialjeweler.com/en/stores",
  "https://mondialjeweler.com/en/stories/all",

  "https://polrestamanokwari.com/",
];

// Kirim pesan ke Slack
async function sendSlackMessage(text) {
  await fetch(SLACK_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

// Cek website
async function checkWebsite(url) {
  try {
    const res = await fetch(url, { method: "GET", timeout: 5000 });

    if (!res.ok) {
      console.log(`❌ DOWN: ${url} | Status: ${res.status}`);
      await sendSlackMessage(
        `🚨 *Website DOWN!* \nURL: ${url}\nStatus: ${res.status}`
      );
    } else {
      console.log(`✅ UP: ${url}`);
    }
  } catch (err) {
    console.log(`❌ ERROR: ${url} unreachable`);
    await sendSlackMessage(
      `🚨 *Website ERROR!* \nURL: ${url}\nError: ${err.message}`
    );
  }
}

// Loop semua website
async function run() {
  console.log("🔍 Checking websites...");
  for (const site of websites) {
    await checkWebsite(site);
  }
  console.log("✅ Check completed.");
}

run();
