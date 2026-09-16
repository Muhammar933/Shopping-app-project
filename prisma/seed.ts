/**
 * THREADLY - Database Seed Script
 * Populates PostgreSQL with:
 * - 1 Admin & 5 Verified Users
 * - 5 Clothing Categories
 * - 22 Realistic Premium T-shirts with variants (XS-XXL, 3-4 colorways each)
 * - Reviews with realistic feedback
 * - Realistic user addresses and orders
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function main() {
  console.log('🌱 Starting Threadly seed...');

  // 1. Clean existing records in reverse dependency order
  await prisma.tryOnResult.deleteMany();
  await prisma.tryOnSession.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Users (1 Admin, 5 Normal Users)
  // Password hash for 'ThreadlyPass2026!'
  const sampleHash = '$2b$10$w8T04c8B/JtF4r8jA.Rz2.k6O6D9j6b4F0i7C5e8B1d2e3f4g5h6i';

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@threadly.studio',
      passwordHash: sampleHash,
      firstName: 'Marcus',
      lastName: 'Vance',
      role: 'ADMIN',
    },
  });

  const normalUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'elena.rostova@gmail.com',
        passwordHash: sampleHash,
        firstName: 'Elena',
        lastName: 'Rostova',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'kai.chen@outlook.com',
        passwordHash: sampleHash,
        firstName: 'Kai',
        lastName: 'Chen',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'sophia.laurent@icloud.com',
        passwordHash: sampleHash,
        firstName: 'Sophia',
        lastName: 'Laurent',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'david.miller@gmail.com',
        passwordHash: sampleHash,
        firstName: 'David',
        lastName: 'Miller',
        role: 'USER',
      },
    }),
    prisma.user.create({
      data: {
        email: 'amara.okafor@gmail.com',
        passwordHash: sampleHash,
        firstName: 'Amara',
        lastName: 'Okafor',
        role: 'USER',
      },
    }),
  ]);

  console.log(`✓ Seeded 1 Admin and ${normalUsers.length} Users.`);

  // 3. Seed Addresses for Users
  const userAddress = await prisma.address.create({
    data: {
      userId: normalUsers[0].id,
      title: 'Studio Apartment',
      street: '452 Mercer Street, Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10013',
      country: 'US',
      isDefault: true,
    },
  });

  // 4. Seed Categories
  const categoriesData = [
    {
      name: 'Heavyweight Essentials',
      slug: 'heavyweight-essentials',
      description: 'Ultra-durable 280-320 GSM combed cotton tees engineered for boxy silhouettes.',
      imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80',
    },
    {
      name: 'Oversized & Street',
      slug: 'oversized-street',
      description: 'Relaxed drop-shoulder cuts crafted with vintage silicone washes.',
      imageUrl: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80',
    },
    {
      name: 'Minimalist Signature',
      slug: 'minimalist-signature',
      description: 'Clean micro-embroidered branding, refined ribbed collars, and tailored seams.',
      imageUrl: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&q=80',
    },
    {
      name: 'Vintage & Pigment Wash',
      slug: 'vintage-pigment-wash',
      description: 'Garment-dyed textures with worn-in patina and ultra-soft pre-shrunk drape.',
      imageUrl: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80',
    },
    {
      name: 'Pima Luxury Blend',
      slug: 'pima-luxury-blend',
      description: 'Long-staple Peruvian Pima cotton with natural luster and featherweight feel.',
      imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80',
    },
  ];

  const categories = await Promise.all(
    categoriesData.map((c) => prisma.category.create({ data: c }))
  );

  console.log(`✓ Seeded ${categories.length} Categories.`);

  // 5. Seed 22 Realistic T-shirts
  const productsCatalog = [
    {
      name: 'Classic Heavyweight Tee',
      slug: 'classic-heavyweight-tee',
      categoryIndex: 0,
      description: 'The foundation of Threadly. Tailored from 300 GSM combed organic cotton with a structured boxy drape and reinforced 1-inch neck ribbing.',
      price: 58.00,
      discountPrice: null,
      sku: 'THRD-HW-01',
      images: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85',
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=85',
      ],
      isFeatured: true,
      isNew: false,
      isBestSeller: true,
      colors: [
        { name: 'Pitch Black', hex: '#111111' },
        { name: 'Bone White', hex: '#F6F5F2' },
        { name: 'Washed Olive', hex: '#525B44' },
      ],
    },
    {
      name: 'Oversized Boxy Tee',
      slug: 'oversized-boxy-tee',
      categoryIndex: 1,
      description: 'Wide chest cut with elongated drop-shoulders. Pre-washed with silicone enzyme for an impeccably smooth hand feel that holds its shape.',
      price: 64.00,
      discountPrice: 54.00,
      sku: 'THRD-OV-02',
      images: [
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&q=85',
        'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1000&q=85',
      ],
      isFeatured: true,
      isNew: true,
      isBestSeller: true,
      colors: [
        { name: 'Vintage Heather', hex: '#8E8E93' },
        { name: 'Charcoal Slag', hex: '#2C2C2E' },
        { name: 'Alabaster', hex: '#FAF9F6' },
      ],
    },
    {
      name: 'Minimal Tone Logo Tee',
      slug: 'minimal-tone-logo-tee',
      categoryIndex: 2,
      description: 'Discreet tone-on-tone high-density silicone Threadly chest typography. Crisp blind hem stitching on sleeves and hem.',
      price: 52.00,
      discountPrice: null,
      sku: 'THRD-MN-03',
      images: [
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1000&q=85',
        'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&q=85',
      ],
      isFeatured: true,
      isNew: false,
      isBestSeller: false,
      colors: [
        { name: 'Deep Navy', hex: '#1C2541' },
        { name: 'Chalk', hex: '#F7F7F7' },
        { name: 'Terracotta', hex: '#9E4734' },
      ],
    },
    {
      name: 'Pigment Washed Sun-Fade Tee',
      slug: 'pigment-washed-sun-fade-tee',
      categoryIndex: 3,
      description: 'Hand-dipped mineral wash creates a distinct sun-faded gradient along seams and collar. Every piece has a 1-of-1 subtle coloration.',
      price: 68.00,
      discountPrice: null,
      sku: 'THRD-VG-04',
      images: [
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=85',
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85',
      ],
      isFeatured: false,
      isNew: true,
      isBestSeller: true,
      colors: [
        { name: 'Dusty Moss', hex: '#636B58' },
        { name: 'Washed Clay', hex: '#9A6B55' },
        { name: 'Faded Ink', hex: '#374151' },
      ],
    },
    {
      name: 'Raw Edge Drop-Tail Tee',
      slug: 'raw-edge-drop-tail-tee',
      categoryIndex: 1,
      description: 'Designed for effortless layering. Features an understated curved scoop hemline with anti-fraying raw edge finish.',
      price: 56.00,
      discountPrice: 48.00,
      sku: 'THRD-OV-05',
      images: [
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1000&q=85',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&q=85',
      ],
      isFeatured: false,
      isNew: false,
      isBestSeller: false,
      colors: [
        { name: 'Onyx', hex: '#0D0D0D' },
        { name: 'Warm Taupe', hex: '#A89F91' },
      ],
    },
    {
      name: 'Peruvian Pima Silk-Touch Tee',
      slug: 'peruvian-pima-silk-touch-tee',
      categoryIndex: 4,
      description: 'Extra-long staple Peruvian Pima cotton. Imparts a liquid-soft drape, natural coolness, and resistant to pilling even after 50+ wash cycles.',
      price: 78.00,
      discountPrice: null,
      sku: 'THRD-PM-06',
      images: [
        'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&q=85',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1000&q=85',
      ],
      isFeatured: true,
      isNew: true,
      isBestSeller: false,
      colors: [
        { name: 'Snow White', hex: '#FFFFFF' },
        { name: 'Midnight Blue', hex: '#0B132B' },
        { name: 'Sage Leaf', hex: '#7A8B7B' },
      ],
    },
    {
      name: 'Studio Archive Heavy Mockneck Tee',
      slug: 'studio-archive-heavy-mockneck-tee',
      categoryIndex: 0,
      description: 'A 340 GSM architectural heavyweight garment. Features an elevated 1.5-inch tailored mockneck collar for cold-weather layering.',
      price: 72.00,
      discountPrice: null,
      sku: 'THRD-HW-07',
      images: [
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1000&q=85',
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85',
      ],
      isFeatured: false,
      isNew: false,
      isBestSeller: true,
      colors: [
        { name: 'Cast Iron', hex: '#222224' },
        { name: 'Oatmeal Marl', hex: '#DED7CD' },
      ],
    },
    {
      name: 'Embroidered Latitude Coordinates Tee',
      slug: 'embroidered-latitude-coordinates-tee',
      categoryIndex: 2,
      description: 'Subtle high-precision tonal embroidery positioned at the nape of the neck reflecting Threadly Design Studio coordinates.',
      price: 54.00,
      discountPrice: null,
      sku: 'THRD-MN-08',
      images: [
        'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=1000&q=85',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1000&q=85',
      ],
      isFeatured: false,
      isNew: true,
      isBestSeller: false,
      colors: [
        { name: 'Black', hex: '#111111' },
        { name: 'Optic White', hex: '#FAFAFA' },
        { name: 'Slate Grey', hex: '#4A5568' },
      ],
    },
    {
      name: 'Acid Washed Retro Skate Tee',
      slug: 'acid-washed-retro-skate-tee',
      categoryIndex: 3,
      description: 'Inspired by early 90s Venice skate culture. Stonewashed with pumice rocks to break down fibers into a featherweight, vintage texture.',
      price: 66.00,
      discountPrice: null,
      sku: 'THRD-VG-09',
      images: [
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=85',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&q=85',
      ],
      isFeatured: true,
      isNew: false,
      isBestSeller: true,
      colors: [
        { name: 'Acid Smoke', hex: '#444446' },
        { name: 'Faded Plum', hex: '#5A4651' },
      ],
    },
    {
      name: 'Mercerized Supima Crewneck',
      slug: 'mercerized-supima-crewneck',
      categoryIndex: 4,
      description: 'Double-mercerized American Supima yarn. Provides a silky finish with deep color retention and an ultra-clean drape for formal wear.',
      price: 82.00,
      discountPrice: 70.00,
      sku: 'THRD-PM-10',
      images: [
        'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&q=85',
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85',
      ],
      isFeatured: false,
      isNew: false,
      isBestSeller: true,
      colors: [
        { name: 'Jet Black', hex: '#0A0A0A' },
        { name: 'Ecru', hex: '#F3EFE0' },
        { name: 'Cognac', hex: '#633B27' },
      ],
    },
    {
      name: 'Relaxed Waffle Knit Thermal Tee',
      slug: 'relaxed-waffle-knit-thermal-tee',
      categoryIndex: 0,
      description: 'Micro-honeycomb thermal texture providing breathable insulation. Cut with a relaxed dropped armhole and ribbed cuffs.',
      price: 62.00,
      discountPrice: null,
      sku: 'THRD-HW-11',
      images: [
        'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1000&q=85',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1000&q=85',
      ],
      isFeatured: false,
      isNew: true,
      isBestSeller: false,
      colors: [
        { name: 'Sand Drift', hex: '#C2B69D' },
        { name: 'Coal', hex: '#1E1E20' },
      ],
    },
    {
      name: 'Distressed Vintage Band Collar Tee',
      slug: 'distressed-vintage-band-collar-tee',
      categoryIndex: 3,
      description: 'Features gentle laser-abrasion nicking on collar edges and sleeve hems for an authentic heirloom rock aesthetic.',
      price: 70.00,
      discountPrice: null,
      sku: 'THRD-VG-12',
      images: [
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=85',
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1000&q=85',
      ],
      isFeatured: false,
      isNew: false,
      isBestSeller: false,
      colors: [
        { name: 'Washed Black', hex: '#262626' },
        { name: 'Vintage Rust', hex: '#87412A' },
      ],
    },
    {
      name: 'Seamless Tubular Body Tee',
      slug: 'seamless-tubular-body-tee',
      categoryIndex: 2,
      description: 'Knitted on vintage circular looms without side seams. Eliminates side-torso friction and guarantees uniform drape.',
      price: 50.00,
      discountPrice: null,
      sku: 'THRD-MN-13',
      images: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85',
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1000&q=85',
      ],
      isFeatured: false,
      isNew: false,
      isBestSeller: true,
      colors: [
        { name: 'Heather Grey', hex: '#9E9E9E' },
        { name: 'Bone', hex: '#EFECE6' },
        { name: 'Nightshade', hex: '#171B26' },
      ],
    },
    {
      name: 'Boxy Heavyweight Pocket Tee',
      slug: 'boxy-heavyweight-pocket-tee',
      categoryIndex: 0,
      description: 'Reinforced utility patch pocket on the left chest with an interior hidden pen slot. Built for daily workshop wear.',
      price: 60.00,
      discountPrice: null,
      sku: 'THRD-HW-14',
      images: [
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&q=85',
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85',
      ],
      isFeatured: false,
      isNew: true,
      isBestSeller: false,
      colors: [
        { name: 'Military Khaki', hex: '#585942' },
        { name: 'Deep Black', hex: '#121212' },
      ],
    },
    {
      name: 'Organic Slub Cotton Lightweight Tee',
      slug: 'organic-slub-cotton-lightweight-tee',
      categoryIndex: 4,
      description: 'Uneven yarn twisting creates a textured, tactile slub pattern that breathes exceptionally well in high heat.',
      price: 52.00,
      discountPrice: 42.00,
      sku: 'THRD-PM-15',
      images: [
        'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&q=85',
        'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=1000&q=85',
      ],
      isFeatured: false,
      isNew: false,
      isBestSeller: false,
      colors: [
        { name: 'Natural Unbleached', hex: '#F0ECE1' },
        { name: 'Indigo Fade', hex: '#2A3C53' },
      ],
    },
    {
      name: 'Split Hem Extended Athletic Tee',
      slug: 'split-hem-extended-athletic-tee',
      categoryIndex: 1,
      description: '4-way comfort stretch cotton-modal blend with 2-inch side split vents allowing uninhibited movement and active styling.',
      price: 58.00,
      discountPrice: null,
      sku: 'THRD-OV-16',
      images: [
        'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1000&q=85',
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85',
      ],
      isFeatured: false,
      isNew: false,
      isBestSeller: true,
      colors: [
        { name: 'Steel Blue', hex: '#465362' },
        { name: 'Matte Black', hex: '#1C1C1C' },
      ],
    },
    {
      name: 'Japanese Loopwheel Heritage Tee',
      slug: 'japanese-loopwheel-heritage-tee',
      categoryIndex: 0,
      description: 'Slowly crafted on antique Wakayama loopwheel machines rotating at 24 rpm. Generates zero tension in the knit for perpetual softness.',
      price: 95.00,
      discountPrice: null,
      sku: 'THRD-HW-17',
      images: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1000&q=85',
      ],
      isFeatured: true,
      isNew: true,
      isBestSeller: false,
      colors: [
        { name: 'Ash Grey', hex: '#777777' },
        { name: 'Pure White', hex: '#FFFFFF' },
      ],
    },
    {
      name: 'Mineral Tint Oversized Work Tee',
      slug: 'mineral-tint-oversized-work-tee',
      categoryIndex: 1,
      description: 'Infused with powdered volcanic earth minerals during dyeing for deep earth coloration and subtle matte finish.',
      price: 66.00,
      discountPrice: null,
      sku: 'THRD-OV-18',
      images: [
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&q=85',
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=85',
      ],
      isFeatured: false,
      isNew: false,
      isBestSeller: false,
      colors: [
        { name: 'Sediment Brown', hex: '#584334' },
        { name: 'Basalt Grey', hex: '#3B3C36' },
      ],
    },
    {
      name: 'Signature Monogram Embroidered Tee',
      slug: 'signature-monogram-embroidered-tee',
      categoryIndex: 2,
      description: 'Threadly ligature monogram executed in 4,000 dense Madeira satin threads on the upper left torso.',
      price: 62.00,
      discountPrice: null,
      sku: 'THRD-MN-19',
      images: [
        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1000&q=85',
        'https://images.unsplash.com/photo-1527719327859-c6ce80353573?w=1000&q=85',
      ],
      isFeatured: false,
      isNew: true,
      isBestSeller: true,
      colors: [
        { name: 'Midnight', hex: '#0F111A' },
        { name: 'Porcelain', hex: '#FAF8F5' },
      ],
    },
    {
      name: 'Faded Indigo Shibori Tee',
      slug: 'faded-indigo-shibori-tee',
      categoryIndex: 3,
      description: 'Hand-clamped woodblock resist-dyeing in natural plant indigo. Beautiful geometric tonal shadows along the lower hem.',
      price: 74.00,
      discountPrice: 62.00,
      sku: 'THRD-VG-20',
      images: [
        'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=85',
        'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&q=85',
      ],
      isFeatured: false,
      isNew: false,
      isBestSeller: false,
      colors: [
        { name: 'Indigo Wave', hex: '#203354' },
      ],
    },
    {
      name: 'Micro-Modal Air Weight Tee',
      slug: 'micro-modal-air-weight-tee',
      categoryIndex: 4,
      description: 'Austrian beechwood modal fiber yielding an ultra-draping, cooling hand. Twice as soft as cotton with silky bounce.',
      price: 68.00,
      discountPrice: null,
      sku: 'THRD-PM-21',
      images: [
        'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&q=85',
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85',
      ],
      isFeatured: false,
      isNew: true,
      isBestSeller: false,
      colors: [
        { name: 'Frost Grey', hex: '#D1D5DB' },
        { name: 'Obsidian', hex: '#18181B' },
      ],
    },
    {
      name: 'Threadly Studio Flagship 380gsm Tee',
      slug: 'threadly-studio-flagship-380gsm-tee',
      categoryIndex: 0,
      description: 'Our heaviest standard knit to date. An immovable 380 GSM fleece-backed jersey structured to sculpt a sharp silhouette.',
      price: 88.00,
      discountPrice: null,
      sku: 'THRD-HW-22',
      images: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85',
        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=1000&q=85',
      ],
      isFeatured: true,
      isNew: true,
      isBestSeller: true,
      colors: [
        { name: 'Raw Black', hex: '#0B0B0C' },
        { name: 'Warm Parchment', hex: '#EBE6DC' },
        { name: 'Oxblood Red', hex: '#4A1521' },
      ],
    },
  ];

  const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  let totalVariantsCreated = 0;

  for (const item of productsCatalog) {
    const category = categories[item.categoryIndex];

    const product = await prisma.product.create({
      data: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        discountPrice: item.discountPrice,
        sku: item.sku,
        images: item.images,
        isFeatured: item.isFeatured,
        isNew: item.isNew,
        isBestSeller: item.isBestSeller,
        categoryId: category.id,
      },
    });

    // Create Variants (Sizes x Colors)
    for (const color of item.colors) {
      for (const size of SIZES) {
        const stock = Math.floor(Math.random() * 25) + 5; // 5 to 30 items
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            size,
            colorName: color.name,
            colorHex: color.hex,
            stock,
          },
        });
        totalVariantsCreated++;
      }
    }

    // Seed 2 realistic reviews per product
    await prisma.review.create({
      data: {
        userId: normalUsers[0].id,
        productId: product.id,
        rating: 5,
        comment: 'The collar construction is remarkably sturdy. Fits true to size with that tailored luxury feel.',
      },
    });

    await prisma.review.create({
      data: {
        userId: normalUsers[1].id,
        productId: product.id,
        rating: 4,
        comment: 'Fabric weight is outstanding. After 3 cold washes, zero shrinkage or collar baconing.',
      },
    });
  }

  console.log(`✓ Seeded ${productsCatalog.length} Products with ${totalVariantsCreated} variants and reviews.`);

  // 6. Seed an Example Past Order for normalUsers[0]
  const sampleProduct = await prisma.product.findFirst({
    include: { variants: true },
  });

  if (sampleProduct && sampleProduct.variants[0]) {
    const order = await prisma.order.create({
      data: {
        orderNumber: 'THRD-89241',
        userId: normalUsers[0].id,
        addressId: userAddress.id,
        status: 'SHIPPED',
        subtotal: 116.00,
        shippingFee: 0.00,
        total: 116.00,
        items: {
          create: [
            {
              productId: sampleProduct.id,
              variantId: sampleProduct.variants[0].id,
              unitPrice: sampleProduct.price,
              quantity: 2,
            },
          ],
        },
        payment: {
          create: {
            amount: 116.00,
            provider: 'MOCK_PAYMENT',
            transactionId: 'TXN-MOCK-983214',
            status: 'COMPLETED',
          },
        },
      },
    });
    console.log(`✓ Seeded sample order ${order.orderNumber}.`);
  }

  console.log('✨ Threadly database seed finished successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
