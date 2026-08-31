# 🇱🇦 Lao Lottery Predict & Analyze (ຫວຍລາວ ພັດທະນາ)

<div align="center">

![Lao Lottery Logo](public/logo.png)

**ແອັບວິເຄາະສະຖິຕິ ແລະ ທຳນາຍຜົນຫວຍລາວພັດທະນາ (2D, 3D, 4D, 5D, 6D)**
*A modern, high-performance lottery prediction and statistical analysis tool built with React, Vite, and Capacitor for Web and Android.*

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Capacitor](https://img.shields.io/badge/Capacitor-Android-119EFF?logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![Version](https://img.shields.io/badge/Version-1.7.0-blue)](#)
[![Font](https://img.shields.io/badge/Font-Noto_Sans_Lao-blueviolet)](#)

</div>

---

## ✨ Features (ຄຸນສົມບັດຫຼັກ)

### 🔮 1. ລະບົບທຳນາຍຫວຍ (Prediction Tab)
- **ວິເຄາະ 2 ໃບ:** ປ້ອນຕົວເລກ 2 ຕົວ 2 ໃບເພື່ອຄຳນວນ ແລະ ສ້າງລາຍການຊຸດຕົວເລກທີ່ເປັນໄປໄດ້.
- **Cross-Match Highlight:** ເນັ້ນຕົວເລກທີ່ກົງກັບສະຖິຕິ Top 20 ແລະ ລາຍການເລກອອກຊ້ຳ.
- **ຄົ້ນຫາ ແລະ Copy ງ່າຍ:** ລະບົບຄົ້ນຫາຕົວເລກດ່ວນ ພ້ອມປຸ່ມ Copy ລາຍການຊຸດໄປໃຊ້ງານທັນທີ.

### 📊 2. ວິເຄາະສະຖິຕິ 2 ຕົວ (00–99 Statistics & Frequency)
- **KPI Summary:** ສະແດງຈຳນວນງວດທັງໝົດ (Total Draws), ເລກອອກຫຼາຍສຸດ (HOT), ເລກອອກໜ້ອຍສຸດ (COLD), ແລະ ຄ່າສະເລ່ຍ (Average Frequency).
- **Top 20 Hot & Cold:** ລາຍການ 20 ອັນດັບເລກອອກຫຼາຍສຸດ ແລະ ອອກໜ້ອຍສຸດ ພ້ອມແຖບເປີເຊັນຄວາມຖີ່.
- **ຕາຕະລາງ 00–99:** ຕາຕະລາງສະຖິຕິຄົບທຸກຕົວເລກ ພ້ອມລະບົບຄົ້ນຫາແບບ Real-time.

### 🎯 3. ວິເຄາະ 3D, 4D, 5D, 6D (Multi-Digit Analysis)
- **Bottom Switcher Dock:** ປຸ່ມສະຫຼັບໂໝດ 3D / 4D / 5D / 6D ແບບຕິດຢູ່ດ້ານລຸ່ມສະດວກໃນການກົດ.
- **Top First / Last Digits:** ວິເຄາະເລກໜ້າ ແລະ ເລກຫຼັງ 20 ອັນດັບ.
- **Position Distribution:** ວິເຄາະຄວາມເປັນໄປໄດ້ຂອງແຕ່ລະຕຳແໜ່ງຫຼັກເລກ.
- **Sample & Full Combos:** ສ້າງຊຸດຕົວເລກປະສົມ Top 5 ແລະ ຊຸດເລກເຕັມ 0-9.

### 🏆 4. ປະຫວັດຜົນຫວຍຍ້ອນຫຼັງ (Draw History)
- **Hero Card:** ສະແດງຜົນຫວຍງວດລ່າສຸດ 6 ຫຼັກພ້ອມວັນທີ ແລະ ງວດທີ.
- **ປະຫວັດຄົບຖ້ວນ:** ຕາຕະລາງຜົນຫວຍຍ້ອນຫຼັງທຸກງວດ ສາມາດຄົ້ນຫາງວດ ຫຼື ຕົວເລກໄດ້ທັນທີ.

### 🎨 5. Modern UI & Themes
- **Sapphire Luxury Theme:** ໂທນສີຟ້າ Sapphire / Cobalt / Sky Ice / Frost White (`#121c3a` ຫາ `#eef5fb`).
- **Dark / Light Mode Support:** ສະຫຼັບໂໝດມືດ-ສະຫວ່າງ ພ້ອມ Contrast ຕົວໜັງສືທີ່ອ່ານງ່າຍ ຄົມຊັດ.
- **Noto Sans Lao Font:** ໃຊ້ຟອນ Noto Sans Lao ຄົບທຸກ Weight ເພື່ອຄວາມສວຍງາມ ແລະ ອ່ານງ່າຍ.
- **Clean SVG Icons:** ໃຊ້ Vector SVG Icons ແທນ Emoji ທົ່ວທັງແອັບ ເພື່ອຄວາມເປັນມືອາຊີບ.
- **Auto-Sync:** ອັບເດດຂໍ້ມູນອັດຕະໂນມັດເວລາ 20:30 (8:30 PM) ແລະ 4 ຄັ້ງຕໍ່ມື້.

---

## 🛠️ Tech Stack

- **Frontend:** [React 18](https://react.js.org), [Vite 6](https://vitejs.dev)
- **Mobile Engine:** [@capacitor/core](https://capacitorjs.com/), [@capacitor/android](https://capacitorjs.com/docs/android)
- **Styling:** Modern Pure CSS with CSS Variables & Glassmorphism
- **Typography:** Google Fonts (`Noto Sans Lao`, `JetBrains Mono`)
- **State Management:** React Context API (`LotteryContext`)

---

## 🚀 Getting Started

### 📋 Prerequisites
- **Node.js** (v18 or newer)
- **npm** or **yarn** / **pnpm**
- **Android Studio** & **JDK 17+** (For building Android APK)

### 💻 Installation & Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/khamdaengp/Laolottery.git
   cd Laolottery
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser at `http://localhost:5173`.

---

## 📱 Building Android APK

1. **Build the web assets and sync to Capacitor Android:**
   ```bash
   npm run build
   npx cap sync android
   ```

2. **Assemble Debug APK:**
   - **Windows:**
     ```cmd
     cd android
     gradlew.bat assembleDebug
     ```
   - **Linux / macOS:**
     ```bash
     cd android
     ./gradlew assembleDebug
     ```

3. **APK Location:**
   The output APK will be available at:
   ```
   android/app/build/outputs/apk/debug/app-universal-debug.apk
   ```

---

## 📁 Project Structure

```
Lottery2day/
├── android/                   # Native Android project (Capacitor)
├── public/
│   └── logo.png               # 3D Sapphire Crystal Sphere Logo
├── src/
│   ├── components/
│   │   ├── Header.jsx         # App header, theme toggle, and sync status
│   │   ├── Tabs.jsx           # Bottom navigation dock
│   │   ├── PredictTab.jsx     # 2D prediction engine & inputs
│   │   ├── AnalyzeTab.jsx     # 2D frequency & statistics tab
│   │   ├── MultiDigitTab.jsx  # 3D/4D/5D/6D container & bottom switcher
│   │   ├── DigitAnalysisTab.jsx # Position & combo tables
│   │   ├── ResultsTab.jsx     # Latest draw hero card & history table
│   │   ├── CopyButton.jsx     # Clipboard copy component
│   │   └── Footer.jsx         # App footer & versioning
│   ├── context/
│   │   └── LotteryContext.jsx # Global data fetching & state management
│   ├── utils/
│   │   └── lottery.js         # Statistical algorithms & calculations
│   ├── App.jsx                # Main layout component
│   ├── index.css              # Global design system & dark/light themes
│   └── main.jsx               # Entry point
├── capacitor.config.json      # Capacitor app configuration
├── package.json
└── vite.config.js
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Developed with ❤️ for Lao Lottery enthusiasts.</sub>
</div>
