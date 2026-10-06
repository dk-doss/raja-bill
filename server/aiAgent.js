import { db } from './db.js';

/**
 * RAJA STORE AI Agent
 * Resolves all customer and shopkeeper doubts, questions, and error issues in English & Tamil.
 */

export async function askAIAgent({ message, lang = 'en', role = 'customer' }) {
  if (!message || !message.trim()) {
    return {
      reply: lang === 'ta'
        ? 'வணக்கம்! நான் ராஜா ஸ்டோர் AI உதவியாளர். உங்களுக்கு என்ன உதவி வேண்டும்?'
        : 'Hello! I am the RAJA STORE AI Assistant. How can I help you today?'
    };
  }

  const query = message.trim().toLowerCase();
  const storeInfo = db.getStoreInfo();
  const isTamil = lang === 'ta' || /[\u0B80-\u0BFF]/.test(message);

  // Check if Gemini API Key is configured in environment
  const geminiKey = process.env.GEMINI_API_KEY;
  if (geminiKey) {
    try {
      const response = await fetchWithGemini(message, lang, role, storeInfo);
      if (response) return { reply: response };
    } catch (err) {
      console.warn('Gemini API call failed, using built-in intelligent engine:', err.message);
    }
  }

  // Built-in Domain-Expert AI Agent Engine
  return { reply: generateExpertResponse(query, isTamil, storeInfo) };
}

function generateExpertResponse(q, isTamil, storeInfo) {
  // 1. Delivery doubts (Crucial: NO delivery)
  if (q.includes('delivery') || q.includes('deliver') || q.includes('home') || q.includes('டெலிவரி') || q.includes('வீட்டு')) {
    if (isTamil) {
      return `🚫 **கவனத்திற்கு: ராஜா ஸ்டோரில் ஹோம் டெலிவரி கிடையாது.**\n\n` +
        `எங்கள் சேவை **நேரில் சேகரிக்கும் முறை மட்டுமே (Self-Pickup Only)**:\n` +
        `1. நீங்கள் வீட்டிலிருந்தே பொருட்களைத் தேர்ந்தெடுத்து ஆர்டர் செய்யலாம்.\n` +
        `2. எங்கள் கடை ஊழியர் பொருட்களைச் சேகரித்து பையில் பேக் செய்வார்.\n` +
        `3. 'Ready for Collection' (தயார்) என்றதும் நீங்கள் கடைக்கு வந்து (${storeInfo.address}) பெற்றுக்கொள்ளலாம்!`;
    }
    return `🚫 **Important Notice: RAJA STORE does NOT provide home delivery.**\n\n` +
      `Our service is **Self-Pickup Only**:\n` +
      `1. You order groceries from home on this app.\n` +
      `2. Our store staff packs your items.\n` +
      `3. When status turns **READY FOR COLLECTION**, you come to our shop counter at **${storeInfo.address}** to pay and collect your packed bag!`;
  }

  // 2. Tracker Off / How to turn off tracker
  if (q.includes('tracker') || q.includes('track') || q.includes('orange') || q.includes('dot') || q.includes('light') || q.includes('டிராக்க') || q.includes('ஆஃப்') || q.includes('ஆப்') || q.includes('நிறுத்த')) {
    if (isTamil) {
      return `⏱️ **ஆர்டர் டிராக்கரை (Orange Dot) ஆஃப் செய்வது எப்படி:**\n\n` +
        `**வழிமுறை 1 (1-Click):** திரையின் மேல் உள்ள **'Track Order'** பட்டனில் உள்ள சிறிய **[✕]** குறியீட்டை அழுத்தவும். உடனே டிராக்கர் ஆஃப் ஆகிவிடும்!\n\n` +
        `**வழிமுறை 2:** **'Track Order'** பட்டனைத் திறந்து, உள்ளே உள்ள சிவப்பு நிற **[ 🔕 Turn Off Tracker ]** பட்டனை அழுத்தவும்.`;
    }
    return `⏱️ **How to turn off the Order Tracker (Orange Dot):**\n\n` +
      `**Method 1 (Instant 1-Click):** Look at the top navigation bar at the **'Track Order'** pill. Click the small **[✕]** button right inside it! It will immediately turn off.\n\n` +
      `**Method 2:** Click **'Track Order'** to open the tracker window, then click the **[ 🔕 Turn Off Tracker ]** button at the top-right or bottom-left.`;
  }

  // 3. How to place order / How it works
  if (q.includes('how to order') || q.includes('how to buy') || q.includes('process') || q.includes('எப்படி') || q.includes('ஆர்டர் செய்')) {
    if (isTamil) {
      return `🛍️ **ராஜா ஸ்டோரில் ஆர்டர் செய்யும் எளிய 4 படிகள்:**\n\n` +
        `1. **பொருட்களைச் சேர்க்கவும்:** விரும்பிய பொருட்களின் கீழ் உள்ள **[ + சேர் ]** பட்டனை அழுத்தவும்.\n` +
        `2. **கூடையைப் பார்க்கவும்:** மேலே உள்ள **'Cart'** பட்டனை அழுத்தவும்.\n` +
        `3. **விவரங்களை உள்ளிடவும்:** உங்கள் **பெயர்** மற்றும் **10 இலக்க செல்போன் எண்ணை** உள்ளிடவும் (முகவரி தேவையில்லை!).\n` +
        `4. **ஆர்டர் செய்க:** **[ PLACE ORDER ]** அழுத்தவும். உங்களுக்கு ஆர்டர் எண் (#1001) கிடைக்கும். தயாரானதும் கடைக்கு வந்து பெற்றுக்கொள்ளலாம்!`;
    }
    return `🛍️ **How to order at RAJA STORE (Simple 4 Steps):**\n\n` +
      `1. **Select Products:** Click **[ + ADD ]** under any product and adjust quantities.\n` +
      `2. **Open Cart:** Click the green **Cart** button in the top right.\n` +
      `3. **Enter Details:** Click **CONTINUE**, enter your **Name** and **10-digit Phone Number** (no delivery address needed!).\n` +
      `4. **Place Order:** Click **PLACE ORDER**. You will receive an Order # (e.g. #1001). When it's marked **READY**, come to the shop to collect!`;
  }

  // 4. Product search & Stock inquiries
  const products = db.getAllProductsAdmin();
  const searchKeywords = ['atta', 'rice', 'oil', 'dal', 'sugar', 'salt', 'maggi', 'biscuit', 'tea', 'coffee', 'soap', 'surf', 'milk', 'bread', 'paneer', 'அரிசி', 'ஆட்டா', 'எண்ணெய்', 'மேகி', 'டீ'];
  const matchedKeyword = searchKeywords.find(kw => q.includes(kw));

  if (matchedKeyword || q.includes('stock') || q.includes('price') || q.includes('available') || q.includes('விலை') || q.includes('இருப்பு')) {
    const cleanWord = matchedKeyword ? matchedKeyword.replace(/[^\w]/g, '') : '';
    let matches = [];
    if (cleanWord) {
      matches = products.filter(p => p.name.toLowerCase().includes(cleanWord) || (p.brand && p.brand.toLowerCase().includes(cleanWord)));
    }
    if (matches.length > 0) {
      const list = matches.slice(0, 4).map(p =>
        `• **${p.name}** (${p.packSize}): **₹${p.price}** — ${p.stock > 0 ? `✅ In Stock (${p.stock} units)` : '❌ Out of Stock'}`
      ).join('\n');

      if (isTamil) {
        return `📦 **நீங்கள் கேட்ட பொருட்களின் விவரம்:**\n\n${list}\n\nஇவற்றை முகப்புப் பக்கத்தில் தேடி கூடையிலிட்டு உடனடியாக ஆர்டர் செய்யலாம்!`;
      }
      return `📦 **Matching Products in RAJA STORE:**\n\n${list}\n\nSearch for them on the homepage and click **[ + ADD ]** to place your pickup order!`;
    }
  }

  // 5. Store App / Staff Login help
  if (q.includes('login') || q.includes('staff') || q.includes('admin') || q.includes('password') || q.includes('owner') || q.includes('உள்நுழை') || q.includes('கடவுச்சொல்')) {
    if (isTamil) {
      return `🔑 **கடை நிர்வாக தளம் (Store App) உள்நுழைவு உதவி:**\n\n` +
        `• மேலே உள்ள **'Store Staff App'** (அல்லது 'நிர்வாகம்') பட்டனை அழுத்தவும்.\n` +
        `• **Username:** \`admin\`\n` +
        `• **Password:** \`raja123\`\n` +
        `• அல்லது திரையில் உள்ள **"Fill Demo Credentials"** பட்டனை ஒரே கிளிக்கில் அழுத்தலாம்!`;
    }
    return `🔑 **Store Staff Management App Login:**\n\n` +
      `• Click the **'Store Staff App'** button in the top navigation bar.\n` +
      `• **Username:** \`admin\`\n` +
      `• **Password:** \`raja123\`\n` +
      `• You can also click the convenient **"Fill Demo Credentials"** button for 1-click access!`;
  }

  // 6. Timings & Location
  if (q.includes('time') || q.includes('timing') || q.includes('hours') || q.includes('open') || q.includes('address') || q.includes('location') || q.includes('நேரம்') || q.includes('முகவரி')) {
    if (isTamil) {
      return `🏪 **ராஜா ஸ்டோர் கடை விவரங்கள்:**\n\n` +
        `• **கடை பெயர்:** ${storeInfo.name}\n` +
        `• **முகவரி:** ${storeInfo.address}\n` +
        `• **செயல்படும் நேரம்:** ${storeInfo.pickupTimings}\n` +
        `• **தொலைபேசி:** ${storeInfo.phone}\n` +
        `• **நிலை:** ${storeInfo.isOpen ? '✅ இப்போது திறந்துள்ளது (Open Now)' : '❌ மூடப்பட்டுள்ளது'}`;
    }
    return `🏪 **RAJA STORE Shop Details:**\n\n` +
      `• **Store Name:** ${storeInfo.name}\n` +
      `• **Pickup Location:** ${storeInfo.address}\n` +
      `• **Timings:** ${storeInfo.pickupTimings}\n` +
      `• **Phone:** ${storeInfo.phone}\n` +
      `• **Current Status:** ${storeInfo.isOpen ? '✅ Open Now' : '❌ Closed'}`;
  }

  // 7. Error resolution / Trouble
  if (q.includes('error') || q.includes('issue') || q.includes('problem') || q.includes('cannot') || q.includes('failed') || q.includes('சிக்கல்') || q.includes('பிழை')) {
    if (isTamil) {
      return `🛠️ **சிக்கலை சரிசெய்வது எப்படி:**\n\n` +
        `1. **கூடையில் சேர்க்க முடியவில்லை என்றால்:** அந்த பொருள் கையிருப்பில் (In Stock) உள்ளதா எனப் பார்க்கவும். இருப்பு இல்லை (Out of Stock) என்றால் சேர்க்க இயலாது.\n` +
        `2. **ஆர்டர் செய்ய இயலவில்லை என்றால்:** உங்கள் பெயர் மற்றும் 10 இலக்க செல்போன் எண்ணை சரியாக உள்ளிட்டுள்ளீர்களா என சரிபார்க்கவும்.\n` +
        `3. **பக்கம் சரியாக வரவில்லை என்றால்:** பக்கத்தை ரீஃப்ரெஷ் (Refresh - F5) செய்யவும்.\n` +
        `4. மேலும் உதவிக்கு கடைக்கு நேரடியாக அழைக்கவும்: **${storeInfo.phone}**`;
    }
    return `🛠️ **Quick Troubleshooting Guide:**\n\n` +
      `1. **Cannot add product to cart:** Check if the item shows "OUT OF STOCK" or if you exceeded available stock count.\n` +
      `2. **Cannot place order:** Ensure you entered your full name and a valid 10-digit mobile number.\n` +
      `3. **Order status not updating:** Ensure your internet connection is active, or use "Track Order" with your Order #.\n` +
      `4. For immediate store support, call the shopkeeper directly: **${storeInfo.phone}**`;
  }

  // Default helpful overview
  if (isTamil) {
    return `வணக்கம்! நான் **ராஜா ஸ்டோர் AI உதவியாளர்** 🤖.\n\n` +
      `உங்களுக்கு பின்வரும் வழிகளில் உதவ முடியும்:\n` +
      `• **டெலிவரி பற்றி:** ராஜா ஸ்டோரில் டெலிவரி கிடையாது, நேரில் வந்து பெற்றுக்கொள்ளும் சேவை மட்டுமே.\n` +
      `• **பொருட்கள் & விலை:** பொருட்களின் விலை மற்றும் இருப்பு பற்றி கேட்கலாம் (எ.கா: "அரிசி விலை என்ன?").\n` +
      `• **ஆர்டர் உதவி:** எப்படி ஆர்டர் செய்வது, டிராக்கரை ஆஃப் செய்வது எப்படி என அறியலாம்.\n` +
      `• **கடை விவரம்:** முகவரி மற்றும் நேரங்கள் அறியலாம்.\n\n` +
      `உங்கள் கேள்வியை தட்டச்சு செய்யவும்!`;
  }

  return `Hello! I am the **RAJA STORE AI Assistant** 🤖.\n\n` +
    `I am here to clear any doubts or resolve any errors:\n` +
    `• **No Delivery Rule:** Remember, RAJA STORE is strictly Self-Pickup at the shop counter.\n` +
    `• **Stock & Prices:** Ask me about any grocery item (e.g. "What is the price of Atta or Rice?").\n` +
    `• **Order & Tracker Help:** Ask "How to order?" or "How to turn off tracker?".\n` +
    `• **Shop Info:** Ask about store hours, location, or staff login credentials.\n\n` +
    `Feel free to ask me anything!`;
}

// Optional Gemini API integration when GEMINI_API_KEY is available
async function fetchWithGemini(userMsg, lang, role, storeInfo) {
  const geminiKey = process.env.GEMINI_API_KEY;
  if (!geminiKey) return null;

  const systemInstruction = `You are the helpful AI assistant for 'RAJA STORE', a real retail grocery shop.
Key Store Rules:
- There is STRICTLY NO HOME DELIVERY. It is a self-pickup service only. Customers order from home, the shop packs the order, and customers collect in person at RAJA STORE counter (${storeInfo.address}).
- Store hours: ${storeInfo.pickupTimings}. Phone: ${storeInfo.phone}.
- Language: Respond in ${lang === 'ta' ? 'Tamil' : 'English'}.
- Tone: Friendly, concise, helpful, and respectful neighborhood shop assistant.`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
  const payload = {
    contents: [
      { role: 'user', parts: [{ text: `${systemInstruction}\n\nCustomer question: ${userMsg}` }] }
    ]
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  const json = await res.json();
  return json.candidates?.[0]?.content?.parts?.[0]?.text || null;
}
