# -*- coding: utf-8 -*-
"""生成华强北电子选购指南（SEO 引流内容）。可重复运行。"""
import json, os, sys
sys.stdout.reconfigure(encoding='utf-8')
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CDIR = os.path.join(ROOT, 'content')

GUIDES = [
 {
  "id":"buying-from-huaqiangbei",
  "title":"Buying Tech from Huaqiangbei: What the Pros Check",
  "category":"gadgets",
  "date":"2026-11-18","readTime":"8 min","image":"assets/images/p-gadgets.svg",
  "excerpt":"Huaqiangbei in Shenzhen is the largest electronics market on earth. Here is how to get factory prices without getting burned.",
  "body":[
   {"type":"h2","text":"Why Huaqiangbei prices are so low"},
   {"type":"p","text":"Huaqiangbei is not a shopping mall — it is the source. Components, assemblies and finished goods change hands here before they ever reach a retail shelf. When you buy from a seller who sources here, you are cutting out layers of distributors, marketing and storefront cost. That is where the price advantage comes from: not cheaper corners, but a shorter chain."},
   {"type":"h2","text":"Check the chipset, not the brand name"},
   {"type":"p","text":"Many budget devices use the same real chipsets as premium ones. Look for the chipset model in the spec sheet — a Bluetooth 5.3 earbud with a known chip and a 10mm driver will outperform a no-name claiming exaggerated numbers. Specs you can verify beat marketing words every time."},
   {"type":"callout","text":"Rule of thumb: if a listing hides the chipset, driver size or battery capacity, treat the bold claims on the banner as decoration."},
   {"type":"h2","text":"Read orders, not just ratings"},
   {"type":"p","text":"A 4.8 rating on 200 reviews means far less than 4.6 on 20,000 orders. Recent order volume tells you whether a product is actually moving right now and whether support is still active. We list monthly orders alongside ratings for exactly this reason."},
   {"type":"h2","text":"Batteries and plugs are the two gotchas"},
   {"type":"p","text":"Battery-containing items can face shipping restrictions depending on your country. And mains chargers come in US, EU and UK plug variants — always check which one you are getting. These are the two most common sources of returns, and both are avoidable with a 10-second spec check."},
  ]
 },
 {
  "id":"best-tws-earbuds-under-25",
  "title":"Best TWS Earbuds Under $25 in 2026",
  "category":"tws-earbuds",
  "date":"2026-11-17","readTime":"7 min","image":"assets/images/p-tws-earbuds.svg",
  "excerpt":"Real ANC, decent calls and 30+ hour cases now cost less than a lunch. Here is what to look for and which specs actually matter.",
  "body":[
   {"type":"h2","text":"Bluetooth 5.3 is the new floor"},
   {"type":"p","text":"Do not settle for Bluetooth 5.0 in 2026. Version 5.3 brings better power efficiency and more stable connections, which translates directly into longer case life and fewer dropouts. It is the single cheapest upgrade you can make."},
   {"type":"h2","text":"ANC: how much is real?"},
   {"type":"p","text":"Hybrid ANC in the 30–45dB range genuinely quiets a commute or an office. Anything claiming 60dB+ at this price is marketing. Look for a transparency mode too — it is what you will use at a café or crossing a street."},
   {"type":"callout","text":"For most people the sweet spot is $15–25: hybrid ANC, a 30–40 hour case and USB-C. Paying more mostly buys brand name, not sound."},
   {"type":"h2","text":"Calls need microphones, not luck"},
   {"type":"p","text":"If you take calls, count the microphones. Four-mic models with call noise cancellation handle wind and street noise far better than single-mic buds. Check the game-mode latency too if you play mobile games — under 70ms feels responsive."},
  ]
 },
 {
  "id":"power-bank-buying-guide",
  "title":"How to Choose a Power Bank (Without Overpaying)",
  "category":"power-banks",
  "date":"2026-11-16","readTime":"6 min","image":"assets/images/p-power-banks.svg",
  "excerpt":"Capacity, wattage and ports explained in plain language — plus why a 65W bank can charge your laptop.",
  "body":[
   {"type":"h2","text":"Capacity: match it to your device"},
   {"type":"p","text":"A 10,000mAh bank adds roughly two phone charges; 20,000mAh gives about four. Go larger only if you are charging a laptop or travelling off-grid — capacity adds weight, and airlines cap carried batteries at 100Wh (about 27,000mAh at 3.7V)."},
   {"type":"h2","text":"Wattage is what changed everything"},
   {"type":"p","text":"A 22.5W bank is fine for phones. If you want to charge a USB-C laptop, look for 65W or 100W Power Delivery. GaN models pack that wattage into a surprisingly small body — that is the upgrade worth paying for."},
   {"type":"callout","text":"Built-in cables are underrated: one fewer thing to forget, and they keep the whole kit in a single pocket."},
   {"type":"h2","text":"Ports and pass-through"},
   {"type":"p","text":"Two outputs let you charge a phone and earbuds together. Pass-through charging (charging the bank and a device at once) is handy but slow — treat it as convenience, not a feature to pay extra for."},
  ]
 },
 {
  "id":"gan-chargers-explained",
  "title":"GaN Chargers Explained: Smaller, Cooler, Faster",
  "category":"chargers",
  "date":"2026-11-15","readTime":"5 min","image":"assets/images/p-chargers.svg",
  "excerpt":"Why the tiny charger in your pocket can now deliver 65W — and how to pick the right wattage.",
  "body":[
   {"type":"h2","text":"What GaN actually is"},
   {"type":"p","text":"Gallium nitride is a semiconductor that handles higher voltages and temperatures than traditional silicon. In practice that means a charger can be half the size and run cooler at the same power. It is a real materials improvement, not a marketing term."},
   {"type":"h2","text":"How much wattage do you need?"},
   {"type":"p","text":"20W covers a phone. 45W is comfortable for a phone plus earbuds or a small tablet. 65W and up will run most ultrabooks. Buy for the most demanding device you own, then use one charger for everything."},
   {"type":"callout","text":"Check the plug standard before ordering — the same model ships with US, EU or UK prongs, and the wrong one needs an adapter."},
  ]
 },
 {
  "id":"smart-watch-value-guide",
  "title":"Smart Watches Under $40: What You Actually Get",
  "category":"smart-watches",
  "date":"2026-11-14","readTime":"7 min","image":"assets/images/p-smart-watches.svg",
  "excerpt":"AMOLED screens, SpO2, 100+ sport modes — a realistic look at budget watches and where they fall short.",
  "body":[
   {"type":"h2","text":"The screen is the biggest visible win"},
   {"type":"p","text":"Budget AMOLED panels at $20–35 are genuinely bright and sharp, with always-on display and custom watch faces. This is the spec that makes a cheap watch feel expensive, and it is the first thing you notice every day."},
   {"type":"h2","text":"Health sensors: useful, not medical"},
   {"type":"p","text":"Heart rate, SpO2 and sleep tracking are fine for trends and motivation. They are not diagnostic tools, and claims of blood pressure or ECG at this price should be treated sceptically. Use them to notice patterns, not to make health decisions."},
   {"type":"callout","text":"If you want GPS for runs, make sure it says built-in GPS. Phones-connected 'GPS' just borrows your phone's location and drains the battery."},
   {"type":"h2","text":"Battery and water resistance"},
   {"type":"p","text":"Five to ten days is realistic. For swimming, look for 5ATM or at least IP68. And check the band — a comfortable strap matters more than one extra sport mode."},
  ]
 },
 {
  "id":"mechanical-keyboard-first",
  "title":"Your First Mechanical Keyboard: A Plain-English Guide",
  "category":"keyboards",
  "date":"2026-11-13","readTime":"6 min","image":"assets/images/p-keyboards.svg",
  "excerpt":"Switch types, layouts and hot-swap explained — so your first board is the right one.",
  "body":[
   {"type":"h2","text":"Pick a layout first"},
   {"type":"p","text":"60% is compact and travel-friendly but drops the arrow and function row. 75% keeps the essentials in a small footprint and is the best all-round starting point. Full-size with a numpad still wins for spreadsheets."},
   {"type":"h2","text":"Switches: linear, tactile, clicky"},
   {"type":"p","text":"Linear switches are smooth and quiet-ish — good for gaming and shared spaces. Tactile give a bump you can feel — great for typing. Clicky add an audible click — satisfying but not office-friendly."},
   {"type":"callout","text":"Get a hot-swap board. It lets you change switches later without soldering, so your first keyboard can grow with your taste."},
   {"type":"h2","text":"Connectivity and keycaps"},
   {"type":"p","text":"Tri-mode (Bluetooth + 2.4G + USB-C) covers desk and travel. PBT keycaps resist shine far better than ABS. Those two details improve long-term satisfaction more than RGB lighting does."},
  ]
 },
 {
  "id":"phone-accessories-that-matter",
  "title":"Phone Accessories Worth Buying at Factory Prices",
  "category":"phone-cases",
  "date":"2026-11-12","readTime":"5 min","image":"assets/images/p-phone-cases.svg",
  "excerpt":"Cases, screen protectors and cables are consumables — here is where buying direct really pays.",
  "body":[
   {"type":"h2","text":"Why these are the best value buys"},
   {"type":"p","text":"Phone accessories are the classic feature-per-dollar win. A magnetic case or a 9H tempered-glass protector does the same job whether it costs $5 or $25 — the difference is mostly branding. This is where factory-direct sourcing shines."},
   {"type":"h2","text":"MagSafe is worth it"},
   {"type":"p","text":"A magnetic case plus a magnetic power bank turns charging into a snap-on action with no cable fiddling. Make sure the case explicitly supports MagSafe and has a strong enough magnet to hold the accessory."},
   {"type":"callout","text":"Screen protectors are consumables — a 3-pack at a few dollars means you can replace them whenever they scratch, instead of babysitting one expensive sheet."},
  ]
 },
 {
  "id":"smart-home-starter",
  "title":"A Cheap Smart-Home Starter Kit That Actually Works",
  "category":"smart-home",
  "date":"2026-11-11","readTime":"6 min","image":"assets/images/p-smart-home.svg",
  "excerpt":"Start with three affordable devices and avoid the app-compatibility trap.",
  "body":[
   {"type":"h2","text":"The three-device starter"},
   {"type":"p","text":"A smart plug with energy monitoring, an RGB LED strip and a motion-sensor night light cover most of what people actually want: remote control, ambience and hands-free lighting. All three are inexpensive bought direct."},
   {"type":"h2","text":"The compatibility trap"},
   {"type":"p","text":"The most common failure is a gadget whose app does not support your region or your voice assistant. Stick to devices that say Tuya / Smart Life, Alexa and Google Home explicitly, and check 2.4GHz WiFi support — many budget devices do not join 5GHz networks."},
   {"type":"callout","text":"A twelve-dollar gadget is only cheap if it works in your home. Verify the app and WiFi band before you order."},
  ]
 },
]

path=os.path.join(CDIR,'guides.json')
with open(path,'w',encoding='utf-8') as f:
    json.dump(GUIDES,f,ensure_ascii=False,indent=2); f.write('\n')
print('written guides.json:',len(GUIDES))
