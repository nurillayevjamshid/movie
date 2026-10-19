# 🎬 KinoPlus — Movie & Cinema Streaming Web App

Zamonaviy, tezkor va to'liq moslashuvchan (responsive) kino va treylerlar portali. Web brauzerlar va **Telegram Mini App** uchun to'liq optimallashtirilgan.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fnurillayevjamshid%2Fmovie)

---

## ✨ Imkoniyatlar va Xususiyatlar

- 🚀 **Zero-dependency & Ultra-fast**: Hech qanday og'ir kutubxonalarsiz, toza HTML5, zamonaviy CSS3 va Vanilla JavaScript asosida yaratilgan.
- 📱 **Telegram Mini App mosligi**: Telegram ichida ochilganda avtomatik `ready()` va `expand()` bo'lib, to'liq ekran rejimida ishlaydi.
- 🎨 **Cinema Dark Mode**: Netflix va Apple TV uslubidagi zamonaviy qorong'i dizayn, glassmorphism effektlari va qulay interfeys.
- 🔍 **Jonli Qidiruv**: Kino nomi, original nomi, janri yoki rejissyori bo'yicha tezkor qidiruv.
- 🏷️ **Janrlar bo'yicha filtrlash**: Fantastika, Jangari, Drama, Sarguzasht, Multfilm va boshqalar.
- 📊 **Saralash (Sorting)**: Reyting, Chiqqan yili va Nomi bo'yicha tartiblash.
- 🍿 **Kino Tafsilotlari & Video Player**: Har bir film haqida to'liq ma'lumot, aktyorlar tarkibi va qulay video/treyler pleeri.
- 🔖 **Saqlanganlar (Favorites)**: Sevimli kinolarni saqlab qo'yish (`localStorage` asosida).
- ⚡ **Vercel uchun to'liq tayyor**: `vercel.json` kesh va xavfsizlik sozlamalari bilan jihozlangan.

---

## 🚀 Loyihani Vercel'ga yangi loyiha qilib ulash (Qo'llanma)

Ushbu repozitoriy Vercel'ga 1 daqiqada ulanadi:

### 1-usul: Vercel Dashboard orqali (Tavsiya etiladi)
1. [vercel.com](https://vercel.com) saytiga kiring va o'z hisobingizga kiring.
2. Yuqori o'ng burchakdagi **"Add New..."** tugmasini bosing va **"Project"** ni tanlang.
3. **"Import Git Repository"** ro'yxatidan `nurillayevjamshid/movie` repozitoriyasini toping va **"Import"** tugmasini bosing.
   *(Agar repozitoriy ko'rinmasa, "Adjust GitHub App Permissions" orqali `movie` reposiga ruxsat bering).*
4. Loyiha nomini tanlang (masalan, `movie-app` yoki `kino-plus`) va **"Deploy"** tugmasini bosing.
5. 15-20 soniyada Vercel sizga bepul `.vercel.app` domenini taqdim etadi!

### 2-usul: Bir marta bosish orqali (1-Click Deploy)
Quyidagi havola orqali to'g'ridan-to'g'ri loyiha yarating:
👉 [https://vercel.com/new/clone?repository-url=https://github.com/nurillayevjamshid/movie](https://vercel.com/new/clone?repository-url=https://github.com/nurillayevjamshid/movie)

---

## 📁 Loyiha Strukturasi

```
movie/
├── .gitignore          # Git e'tiborsiz qoldiradigan fayllar
├── index.html          # Asosiy HTML interfeysi
├── vercel.json         # Vercel server va kesh sozlamalari
├── package.json        # Loyiha metama'lumotlari
├── README.md           # Qo'llanma va ma'lumotlar
├── css/
│   └── style.css       # Qorong'i kino mavzusi va moslashuvchan dizayn
└── js/
    ├── data.js         # Kinolar bazasi va janrlar ro'yxati
    └── app.js          # Asosiy dastur logikasi va Telegram integratsiyasi
```

---

## 💻 Mahalliy ishga tushirish

Loyiha hech qanday o'rnatishni talab qilmaydi. Shunchaki brauzerda `index.html` faylini ochishingiz mumkin, yoki har qanday lokal server orqali ishga tushiring:

```bash
# Python orqali:
python -m http.server 3000

# Node / npx orqali:
npx serve .
```

Brauzerda: `http://localhost:3000`
