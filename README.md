# ArcCast 🌤️⛓️

> **Real weather, on-chain forever.**

ArcCast is a Web3 weather application built on the **Arc Testnet** that lets users search real-time weather for any city in the world and store it permanently on the blockchain — complete with personal notes, daily streak rewards, and a Pro subscription tier.

---

## 🌐 Live Demo

> Deployed on Vercel — 

---

## ✨ Features

### 🔍 Weather Search
- Search any city or country worldwide
- Real-time weather data powered by OpenWeatherMap
- Air quality index (AQI) with colour-coded indicators
- City descriptions with continent and climate context
- 3-day forecast (Pro users)

### ⛓️ On-Chain Storage
- Store weather snapshots permanently on Arc Testnet
- Attach personal notes to each weather record (e.g. *"Planning to visit Rome in June"*)
- All records stored on-chain and retrievable anytime
- USDC micro-payment model (0.01 USDC per query)

### 🔥 Daily Streak System
- Check in every day to build your streak
- On-chain streak rewards enforced by the smart contract:
  - **3-day streak** → Query fee drops to 0.009 USDC (10% off)
  - **7-day streak** → Query fee drops to 0.008 USDC (20% off)
  - **30-day streak** → 1 free query credit added to your wallet
- Live countdown timer to next check-in window
- Streak broken detection with clear user feedback

### 📜 Activity History
- View your last 20 on-chain weather queries
- See temperature, humidity, wind speed, AQI, and your personal note per record
- Check-in activity also logged in history
- Delete individual records locally (on-chain record remains permanent)
- Full history unlocked for Pro users

### ⚡ Pro Subscription
- **Monthly** — 10 USDC / 30 days
- **Yearly** — 80 USDC / 365 days (save 33%)
- Unlocks: 3-day forecast, full history, bonus free queries

### 🔗 Wallet Support
- **EIP-6963** multi-wallet detection — MetaMask, Rabby, OKX and any injected EVM wallet
- Each wallet connects independently (no cross-wallet interference)
- Automatic Arc Testnet detection and network add/switch prompt
- Full network details displayed for manual setup if needed
- Dark/light theme toggle

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Blockchain | Arc Testnet (Chain ID: 5042002) |
| Smart Contract | Solidity — stores weather records, streaks, subscriptions |
| Weather API | OpenWeatherMap (current weather, forecast, air pollution) |
| Wallet | EIP-6963, MetaMask, Rabby, OKX Wallet |
| Payment Token | USDC (ERC-20 on Arc Testnet) |
| Deployment | Vercel |

---

## 📋 Smart Contract

| Item | Value |
|------|-------|
| Contract Address | `0xEB655C83Ef17eC23B5F718BC7c6F072B789CEa5F` |
| USDC Address | `0x3600000000000000000000000000000000000000` |
| Network | Arc Testnet |
| Chain ID | `5042002` |
| RPC URL | `https://rpc.testnet.arc.network` |
| Explorer | `https://testnet.arcscan.app` |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Web3 wallet (MetaMask, Rabby, or OKX)
- Arc Testnet added to your wallet
- Testnet USDC for queries

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/arccast.git
cd arccast

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Adding Arc Testnet to Your Wallet

If your wallet doesn't have Arc Testnet, ArcCast will prompt you automatically on connection. Or add it manually:

| Field | Value |
|-------|-------|
| Network Name | Arc Testnet |
| Chain ID | 5042002 |
| RPC URL | https://rpc.testnet.arc.network |
| Currency Symbol | USDC |
| Block Explorer | https://testnet.arcscan.app |

---

## 📁 Project Structure

```
arccast/
├── app/
│   ├── page.tsx          # Main application component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── public/
│   └── logo.png          # App logo
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the root of your project:

```env
# No server-side env vars required for core functionality
# OpenWeatherMap and contract addresses are configured in page.tsx
```

---

## 💡 How It Works

1. **Search** — Enter any city or country. ArcCast fetches live weather from OpenWeatherMap including temperature, humidity, wind, visibility, and air quality.

2. **Connect** — Click *Connect Wallet* and choose your wallet. ArcCast will prompt you to add Arc Testnet automatically.

3. **Store** — Add an optional personal note and click *Store on Arc*. ArcCast checks your USDC allowance, requests approval if needed, then sends the weather data to the smart contract.

4. **Earn** — Check in daily on the Streak tab to build your streak and earn on-chain fee discounts. The smart contract enforces discounts automatically — no claiming needed.

5. **Review** — Visit the History tab to see all your on-chain weather records with full details.

---

## 🔐 How Transactions Work

ArcCast uses a two-step transaction flow for storing weather:

- **Step 1 (first time only):** Approve USDC spend — your wallet prompts once to allow the contract to spend up to 10 USDC on your behalf.
- **Step 2:** Store weather on-chain — sends the weather data + your note to the contract. Costs 0.01 USDC (or less with streak discounts).

After the first approval, every subsequent store is just **one wallet popup**.

---

## 🌍 Supported Regions

ArcCast supports weather search for **180+ countries** with smart city mapping — searching "Nigeria" returns Lagos, "Japan" returns Tokyo, and so on. Direct city searches (e.g. "Abuja", "Osaka", "Lyon") also work.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to open a pull request or issue on GitHub.

---

## 📄 License

© 2025 Beauty Benedict. All rights reserved.

---

## 🙏 Acknowledgements

- [OpenWeatherMap](https://openweathermap.org/) — weather data API
- [Arc Network](https://arc.network/) — blockchain infrastructure
- [Anthropic Claude](https://anthropic.com/) — development assistance
- [Vercel](https://vercel.com/) — deployment platform