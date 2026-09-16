# THREADLY — "WEAR YOUR STYLE."

> A production-grade mobile e-commerce platform and modular monolith backend for a luxury T-shirt clothing brand featuring **Virtual Try-On**.

---

## Highlights

- 📱 **Mobile App (`/mobile`)**: React Native + Expo (Expo Router), Zustand, Axios, React Native Paper / Tailwind styling.
- ⚙️ **Modular Monolith Backend (`/backend`)**: Node.js, Express, TypeScript, Zod, and JWT Auth.
- 🗄️ **Database (`/prisma`)**: PostgreSQL with Prisma ORM, complete with 22+ premium T-shirts, variants, reviews, and test orders.
- 📸 **Virtual Try-On**: Dedicated AI try-on pipeline with provider abstraction (`VirtualTryOnService` -> `MockVirtualTryOnService`).
- 💳 **Payment Gateway Abstraction**: Pluggable `IPaymentService` with `MockPaymentService`.
- 📦 **DevOps-Ready**: Completely decoupled from infrastructure so you can containerize with Docker, CI/CD, AWS, or Kubernetes as you see fit.

---

## Directory Navigation

- `/mobile` - React Native Expo mobile application
- `/backend` - Express + TypeScript modular backend
- `/prisma` - Database schema & seed data
- `/docs` - Architecture, API, Database, and Try-On documentation
- `/src` - Interactive live mobile application simulator running in the preview environment
