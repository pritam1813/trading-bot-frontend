# Trading Bot Frontend

Next.js dashboard for monitoring and controlling your Binance Futures trading bot.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
```

For production (Vercel), set:
```
NEXT_PUBLIC_API_URL=https://your-vps-domain.com:3000
```

3. Run development server:
```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

## Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable:
   - Key: `NEXT_PUBLIC_API_URL`
   - Value: Your VPS backend URL (e.g., `https://your-vps.com:3000`)
4. Deploy

## Features

- **Dashboard**: Real-time stats, win rate, P&L with live WebSocket updates
- **Bot Controls**: Start, stop, and restart bot
- **Configuration**: Edit all bot settings via UI
- **Live Logs**: Stream logs with filtering and auto-scroll
- **Stats Management**: View detailed trade history and reset stats

## Backend Requirements

Make sure your backend (trading-bot-v2) is running and accessible at the URL specified in `NEXT_PUBLIC_API_URL`.

For VPS deployment, ensure:
- Backend server is running on port 3000
- Firewall allows incoming connections on port 3000
- CORS is enabled for your Vercel domain
