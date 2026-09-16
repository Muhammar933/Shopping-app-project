import React, { useState } from 'react';
import {
  X,
  Code2,
  Database,
  Layers,
  Sparkles,
  Terminal,
  Server,
  BookOpen,
  Copy,
  Check,
} from 'lucide-react';

interface DevDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DevDocsModal: React.FC<DevDocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeSection, setActiveSection] = useState<'architecture' | 'database' | 'api' | 'tryon' | 'setup'>('architecture');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-neutral-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between bg-neutral-900 text-white">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-white/20 text-[#D4A373] text-[10px] font-black tracking-widest uppercase">
              THREADLY ARCHITECTURE
            </span>
            <h2 className="text-sm font-bold tracking-wider">
              System Engineering & API Reference
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-200 bg-neutral-50 px-6 overflow-x-auto no-scrollbar">
          {[
            { id: 'architecture', label: 'Architecture & Layering', icon: Layers },
            { id: 'database', label: 'Prisma Relational Schema', icon: Database },
            { id: 'api', label: 'REST API Endpoints', icon: Server },
            { id: 'tryon', label: 'AI Virtual Try-On Pipeline', icon: Sparkles },
            { id: 'setup', label: 'Local Run Guide', icon: Terminal },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                  activeSection === tab.id
                    ? 'border-neutral-900 text-neutral-900 bg-white'
                    : 'border-transparent text-neutral-500 hover:text-neutral-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-white font-sans text-neutral-800 text-xs leading-relaxed">
          {activeSection === 'architecture' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  Modular Monolith Pattern
                </h3>
                <p className="text-neutral-600 mt-1">
                  Threadly isolates responsibilities into clean, testable layers. Business logic is strictly kept out of route handlers.
                </p>
              </div>

              <div className="bg-neutral-900 text-neutral-100 p-4 rounded-xl font-mono text-[11px] overflow-x-auto">
                <pre>{`HTTP Request
  │
  ▼ [Middleware]
  ├── cors & helmet
  ├── authenticate (JWT stateless token verification)
  ├── authorizeRoles('USER' | 'ADMIN')
  └── validateBody / validateQuery (Zod strict validation)
  │
  ▼ [Controllers] (auth.controller, product.controller, cart.controller, try-on.controller)
  │   - HTTP serialization and response envelopes
  │
  ▼ [Services] (AuthService, ProductService, CartService, OrderService, TryOnService)
  │   - Domain business rules & inventory verification
  │
  ▼ [Service Abstractions]
  │   ├── IPaymentService    -> MockPaymentService (Pluggable for Stripe / Adyen)
  │   ├── IStorageService    -> LocalStorageService (Pluggable for S3 / GCS)
  │   └── IVirtualTryOnService -> MockVirtualTryOnService (Pluggable for Diffusion AI)
  │
  ▼ [Repositories] (UserRepository, ProductRepository, CartRepository, OrderRepository)
  │   - Typed queries via Prisma ORM
  │
  ▼ [Database]
      PostgreSQL relational schema with transactional integrity`}</pre>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
                  <h4 className="font-bold text-neutral-900 text-xs">Mobile Client Stack</h4>
                  <ul className="mt-2 space-y-1 text-neutral-600">
                    <li>• React Native + Expo Router v4</li>
                    <li>• Zustand (State management)</li>
                    <li>• Axios centralized API client with JWT interceptor</li>
                    <li>• Expo SecureStore for native credential storage</li>
                    <li>• Expo Camera & ImagePicker for torso photos</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50">
                  <h4 className="font-bold text-neutral-900 text-xs">Backend API Stack</h4>
                  <ul className="mt-2 space-y-1 text-neutral-600">
                    <li>• Node.js + Express (TypeScript ESM)</li>
                    <li>• Prisma ORM + PostgreSQL</li>
                    <li>• Zod validation on every endpoint</li>
                    <li>• Bcrypt password hashing + salted JWTs</li>
                    <li>• Clean architecture with Dependency Inversion</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'database' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                    Prisma PostgreSQL Schema (12 Models)
                  </h3>
                  <p className="text-neutral-500 mt-0.5">
                    Defined in <code className="text-neutral-900 font-mono">prisma/schema.prisma</code>
                  </p>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `// 12 Models: User, Address, Category, Product, ProductVariant, Cart, CartItem, Order, OrderItem, Payment, Review, TryOnSession, TryOnResult`,
                      'prisma'
                    )
                  }
                  className="px-3 py-1.5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-[11px] font-semibold flex items-center gap-1.5"
                >
                  {copied === 'prisma' ? <Check className="w-3 h-3 text-green-600" /> : <Copy className="w-3 h-3" />}
                  Copy Summary
                </button>
              </div>

              <div className="bg-neutral-900 text-neutral-200 p-4 rounded-xl font-mono text-[11px] overflow-x-auto max-h-[440px]">
                <pre>{`model User {
  id           String         @id @default(uuid())
  email        String         @unique
  passwordHash String
  firstName    String
  lastName     String
  role         Role           @default(USER) // USER, ADMIN
  addresses    Address[]
  cart         Cart?
  orders       Order[]
  tryOnSessions TryOnSession[]
  favorites    Favorite[]
  reviews      Review[]
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
}

model Product {
  id           String           @id @default(uuid())
  name         String
  slug         String           @unique
  description  String
  price        Float
  discountPrice Float?
  sku          String           @unique
  images       String[]
  isFeatured   Boolean          @default(false)
  isNew        Boolean          @default(false)
  isBestSeller Boolean          @default(false)
  category     Category         @relation(fields: [categoryId], references: [id])
  categoryId   String
  variants     ProductVariant[]
  reviews      Review[]
  favorites    Favorite[]
}

model ProductVariant {
  id        String   @id @default(uuid())
  product   Product  @relation(fields: [productId], references: [id])
  productId String
  size      Size     // XS, S, M, L, XL, XXL
  colorName String
  colorHex  String
  stock     Int      @default(0)
}

model TryOnSession {
  id         String        @id @default(uuid())
  userId     String
  productId  String
  inputImage String
  status     TryOnStatus   @default(PENDING) // PENDING, PROCESSING, COMPLETED, FAILED
  result     TryOnResult?
  createdAt  DateTime      @default(now())
}

model Order {
  id          String        @id @default(uuid())
  orderNumber String        @unique
  userId      String
  status      OrderStatus   // PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED
  subtotal    Float
  shippingFee Float
  total       Float
  items       OrderItem[]
  payment     Payment?
}`}</pre>
              </div>
            </div>
          )}

          {activeSection === 'api' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  REST API Endpoints Specification
                </h3>
                <p className="text-neutral-500 mt-0.5">
                  Base URL: <code className="font-mono text-neutral-900">http://localhost:3000/api</code>
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { method: 'POST', path: '/api/auth/register', desc: 'Create new user account and return JWT' },
                  { method: 'POST', path: '/api/auth/login', desc: 'Authenticate user and return JWT' },
                  { method: 'GET', path: '/api/products', desc: 'Query catalog with category, search, and sort filters' },
                  { method: 'GET', path: '/api/products/:id', desc: 'Retrieve full product details, variants, and reviews' },
                  { method: 'GET', path: '/api/cart', desc: 'Get active user cart with auto-calculated subtotals' },
                  { method: 'POST', path: '/api/cart/items', desc: 'Add variant to cart with stock validation' },
                  { method: 'POST', path: '/api/orders', desc: 'Checkout cart, process payment, generate order' },
                  { method: 'POST', path: '/api/try-on', desc: 'Upload torso photo + product ID to initiate AI fitting' },
                  { method: 'GET', path: '/api/try-on/:id', desc: 'Poll try-on session status and retrieve generated look' },
                ].map((ep, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-neutral-50 rounded-lg border border-neutral-200 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          ep.method === 'POST'
                            ? 'bg-blue-100 text-blue-800'
                            : ep.method === 'GET'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-neutral-200 text-neutral-800'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-mono text-xs font-semibold text-neutral-900">
                        {ep.path}
                      </span>
                    </div>
                    <span className="text-neutral-500 text-[11px]">{ep.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'tryon' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  AI Virtual Try-On Pipeline & Abstraction
                </h3>
                <p className="text-neutral-600 mt-1">
                  Threadly rejects simple transparent 2D sticker overlays. The pipeline is designed around generative diffusion with explicit interface decoupling:
                </p>
              </div>

              <div className="bg-neutral-900 text-neutral-200 p-4 rounded-xl font-mono text-[11px] overflow-x-auto">
                <pre>{`// backend/src/services/try-on/try-on.interface.ts
export interface IVirtualTryOnService {
  generateTryOnLook(params: {
    userImageBuffer: Buffer;
    product: ProductWithVariants;
  }): Promise<{
    resultBuffer: Buffer;
    contentType: string;
  }>;
}`}</pre>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Step 1
                  </span>
                  <p className="text-xs font-bold text-neutral-900 mt-1">Pose Keypoints</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Torso segmentation & shoulder angle</p>
                </div>
                <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Step 2
                  </span>
                  <p className="text-xs font-bold text-neutral-900 mt-1">Mesh Draping</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">300GSM fabric drape & drop-shoulder folds</p>
                </div>
                <div className="p-3 rounded-lg border border-neutral-200 bg-neutral-50">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Step 3
                  </span>
                  <p className="text-xs font-bold text-neutral-900 mt-1">Diffusion Inpainting</p>
                  <p className="text-[11px] text-neutral-500 mt-0.5">Lighting match & photorealistic output</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'setup' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  Local Development Run Commands
                </h3>
                <p className="text-neutral-500 mt-0.5">
                  How to launch both backend and mobile applications locally on your machine.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-neutral-900 text-neutral-100 font-mono text-[11px] space-y-2">
                  <p className="text-[#D4A373] font-bold">// 1. Run Backend & Seed PostgreSQL</p>
                  <p>cd backend</p>
                  <p>npm install</p>
                  <p>npx prisma migrate dev --name init</p>
                  <p>npm run prisma:seed</p>
                  <p>npm run dev</p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-900 text-neutral-100 font-mono text-[11px] space-y-2">
                  <p className="text-[#D4A373] font-bold">// 2. Run React Native Expo Mobile App</p>
                  <p>cd mobile</p>
                  <p>npm install</p>
                  <p>npx expo start</p>
                  <p className="text-neutral-400">// Press "i" for iOS Simulator, "a" for Android Emulator</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
