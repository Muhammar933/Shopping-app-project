# THREADLY Database Architecture

Engine: **PostgreSQL**  
ORM: **Prisma**

## Entities & Relationships

```
User (1) ──── (0..1) Cart (1) ──── (0..N) CartItem (N) ──── (1) ProductVariant
 │                                                                   │
 ├──── (0..N) Order (1) ──── (1..N) OrderItem ───────────────────────┘
 │             │
 │             └──── (1..1) Payment
 │
 ├──── (0..N) Address
 ├──── (0..N) Favorite ─────────── (1) Product (1) ──── (1..N) ProductVariant
 ├──── (0..N) Review   ───────────┘        │
 └──── (0..N) TryOnSession ────────────────┘
               │
               └──── (0..1) TryOnResult
```

### Key Models & Invariants
1. **User**: Supports `USER` and `ADMIN` roles. Passwords stored using salted bcrypt hashes.
2. **Product**: Belongs to a Category. Contains arrays of high-res studio photography, flags for `isFeatured`, `isNew`, `isBestSeller`.
3. **ProductVariant**: Normalized size (`XS` to `XXL`) and color (`name` and `hex`) combinations with inventory tracking.
4. **Cart & CartItem**: Unique constraint on `[cartId, variantId]`.
5. **Order & OrderItem**: Immutable price snapshot (`unitPrice`) at the moment of checkout.
6. **TryOnSession & TryOnResult**: Tracks async state (`PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`).
