# Local Development Guide

## Prerequisites
- Node.js 20+
- PostgreSQL database
- Expo CLI (`npm install -g expo-cli`)

---

## 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env

# Run Prisma migrations & database seed
npx prisma migrate dev --name init
npm run prisma:seed

# Start backend server
npm run dev
```

The API will be available at `http://localhost:3000/api`.

---

## 2. Mobile App Setup

```bash
cd mobile
npm install

# Start Expo development server
npx expo start
```

Press `i` for iOS Simulator or `a` for Android Emulator, or scan the QR code using the Expo Go app on a physical device.

---

## 3. Seed User Credentials
- **Admin**: `admin@threadly.studio` / `ThreadlyPass2026!`
- **User**: `elena.rostova@gmail.com` / `ThreadlyPass2026!`
- **User**: `kai.chen@outlook.com` / `ThreadlyPass2026!`
