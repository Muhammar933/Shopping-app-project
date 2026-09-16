# THREADLY System Architecture

> **Brand:** THREADLY  
> **Tagline:** *"WEAR YOUR STYLE."*

## 1. Architectural Philosophy

THREADLY is designed with an uncompromising separation of concerns:
- **Mobile First**: Built using React Native and Expo Router, targeting iOS and Android with 60fps animations, native haptics, camera APIs, and offline-resilient caching.
- **Modular Monolith Backend**: Business logic is strictly kept out of route files. Requests traverse:
  `HTTP Request -> Middleware (Auth/Zod/RateLimit) -> Controller -> Service -> Repository -> Prisma ORM -> PostgreSQL`
- **Clean Dependency Inversion**: Third-party services (Payment processing, Media storage, AI Virtual Try-On) are written against explicit interfaces (`IPaymentService`, `IStorageService`, `IVirtualTryOnService`), enabling zero-touch migration from development mocks to production vendors.

---

## 2. Directory Layout

```
/
├── mobile/             # React Native / Expo Mobile Application
│   ├── app/            # Expo Router file-based screens
│   ├── components/     # Atomic and composite UI elements
│   ├── features/       # Feature modules
│   ├── services/       # Centralized Axios API services
│   ├── store/          # Zustand client state stores
│   ├── hooks/          # Custom mobile lifecycle hooks
│   ├── types/          # Shared TypeScript interfaces
│   ├── constants/      # Brand colors, typography, layout tokens
│   └── assets/         # Brand iconography and splash media
│
├── backend/            # Modular Monolith Express REST API
│   ├── src/
│   │   ├── config/     # Environment and app constants
│   │   ├── controllers/# HTTP handlers and serialization
│   │   ├── middleware/ # Auth, validation, error handlers
│   │   ├── repositories/# Prisma data access layer
│   │   ├── routes/     # Route registration
│   │   ├── services/   # Domain logic and service abstractions
│   │   ├── types/      # DTOs and API types
│   │   ├── utils/      # Security and hashing helpers
│   │   ├── validators/ # Zod request validation schemas
│   │   └── server.ts   # Express bootstrap
│   └── prisma/
│       ├── schema.prisma # PostgreSQL relational schema
│       └── seed.ts     # 22+ T-shirt catalog seed data
│
└── docs/               # Comprehensive project documentation
```
