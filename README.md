# Telegram Video Sync Mini App

A Telegram Mini App that allows users to synchronize video playback between multiple devices. Users can create rooms and share room codes to watch videos together in sync.

## Features

- Create and join rooms with unique room codes
- Upload and play local videos
- Synchronized video playback between devices
- Real-time video control synchronization (play, pause, seek)
- Modern Material-UI interface
- Telegram Mini App integration

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A Telegram Bot Token (for Mini App deployment)

## Setup

1. Clone the repository:
```bash
git clone <https://github.com/phyvics/tg-syncvid>
cd tg-syncvid
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Start the WebSocket server:
```bash
node server.js
```

## Development

The application consists of two main parts:

1. Frontend (React + TypeScript)
   - Located in the `src` directory
   - Uses Vite for development and building
   - Material-UI for the interface
   - Socket.IO client for real-time communication

2. Backend (Node.js + Express + Socket.IO)
   - Located in `server.js`
   - Handles room management and video synchronization
   - WebSocket server for real-time communication

## Deployment

1. Build the frontend:
```bash
npm run build
```

2. Deploy the frontend to a static hosting service (e.g., Vercel, Netlify)

3. Deploy the backend to a Node.js hosting service (e.g., Heroku, DigitalOcean)

4. Update the Socket.IO connection URL in `src/App.tsx` to point to your deployed backend

5. Configure your Telegram Bot with the Mini App URL

## Usage

1. Open the Mini App in Telegram
2. Create a room or join an existing one using a room code
3. If you're the host, upload a video file
4. Control the video playback (play, pause, seek)
5. All connected users will see the video synchronized with the host's controls

## License

MIT
