import bcrypt from "bcryptjs";
import prisma from "../src/lib/prisma";

const DEMO_PASSWORD = "Test@1234";

type SubCategorySeed = {
  name: string;
  slug: string;
};

type CategorySeed = {
  name: string;
  slug: string;
  image: string;
  subcategories: SubCategorySeed[];
};

const categorySeeds: CategorySeed[] = [
  {
    name: "Electronics",
    slug: "electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200",
    subcategories: [
      { name: "Laptops", slug: "laptops" },
      { name: "Headphones", slug: "headphones" },
      { name: "Smart Watches", slug: "smart-watches" },
      { name: "Cameras", slug: "cameras" },
    ],
  },
  {
    name: "Fashion",
    slug: "fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=200",
    subcategories: [
      { name: "Men's Clothing", slug: "mens-clothing" },
      { name: "Women's Clothing", slug: "womens-clothing" },
      { name: "Footwear", slug: "footwear" },
      { name: "Watches", slug: "watches" },
    ],
  },
  {
    name: "Mobiles",
    slug: "mobiles",
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200",
    subcategories: [
      { name: "Smartphones", slug: "smartphones" },
      { name: "Mobile Accessories", slug: "mobile-accessories" },
      { name: "Tablets", slug: "tablets" },
      { name: "Power Banks", slug: "power-banks" },
    ],
  },
  {
    name: "Beauty",
    slug: "beauty",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200",
    subcategories: [
      { name: "Skincare", slug: "skincare" },
      { name: "Makeup", slug: "makeup" },
      { name: "Hair Care", slug: "hair-care" },
      { name: "Fragrances", slug: "fragrances" },
    ],
  },
  {
    name: "Home",
    slug: "home",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200",
    subcategories: [
      { name: "Bedsheets", slug: "bedsheets" },
      { name: "Curtains", slug: "curtains" },
      { name: "Decor", slug: "decor" },
      { name: "Kitchenware", slug: "kitchenware" },
    ],
  },
  {
    name: "Appliances",
    slug: "appliances",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200",
    subcategories: [
      { name: "Refrigerators", slug: "refrigerators" },
      { name: "Washing Machines", slug: "washing-machines" },
      { name: "Air Conditioners", slug: "air-conditioners" },
      { name: "Microwave Ovens", slug: "microwave-ovens" },
    ],
  },
  {
    name: "Toys & Baby",
    slug: "toys-baby",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200",
    subcategories: [
      { name: "Soft Toys", slug: "soft-toys" },
      { name: "Board Games", slug: "board-games" },
      { name: "Baby Care", slug: "baby-care" },
      { name: "Diapers", slug: "diapers" },
    ],
  },
  {
    name: "Food & Health",
    slug: "food-health",
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525cd34?w=200",
    subcategories: [
      { name: "Snacks", slug: "snacks" },
      { name: "Beverages", slug: "beverages" },
      { name: "Nutrition", slug: "nutrition" },
      { name: "Personal Care", slug: "personal-care" },
    ],
  },
  {
    name: "Sports",
    slug: "sports",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=200",
    subcategories: [
      { name: "Cricket", slug: "cricket" },
      { name: "Fitness", slug: "fitness" },
      { name: "Cycling", slug: "cycling" },
      { name: "Outdoor", slug: "outdoor" },
    ],
  },
  {
    name: "Furniture",
    slug: "furniture",
    image: "https://images.unsplash.com/photo-1555041467-a586661a9b9?w=200",
    subcategories: [
      { name: "Sofas", slug: "sofas" },
      { name: "Beds", slug: "beds" },
      { name: "Study Tables", slug: "study-tables" },
      { name: "Wardrobes", slug: "wardrobes" },
    ],
  },
];

const productTemplates: Record<
  string,
  Array<{ title: string; brand: string; baseMrp: number; assured?: boolean }>
> = {
  laptops: [
    { title: "Inspiron 15 Laptop Intel i5 8GB 512GB SSD", brand: "Dell", baseMrp: 5499900, assured: true },
    { title: "Pavilion 14 Ryzen 5 16GB 512GB SSD", brand: "HP", baseMrp: 6299900, assured: true },
    { title: "VivoBook 15 Intel i3 8GB 256GB SSD", brand: "ASUS", baseMrp: 4299900 },
    { title: "IdeaPad Slim 3 Ryzen 5 8GB 512GB", brand: "Lenovo", baseMrp: 4999900 },
  ],
  headphones: [
    { title: "Rockerz 450 Pro Bluetooth Headphone", brand: "boAt", baseMrp: 399900 },
    { title: "Buds VS104 TWS Earbuds", brand: "boAt", baseMrp: 149900, assured: true },
    { title: "Buds Pro 2 ANC Earbuds", brand: "OnePlus", baseMrp: 999900 },
    { title: "AirPods Pro (2nd Gen)", brand: "Apple", baseMrp: 2499900, assured: true },
  ],
  "smart-watches": [
    { title: "Colorfit Pro 5 Smartwatch", brand: "Noise", baseMrp: 499900 },
    { title: "Watch 4 Classic BT Calling", brand: "Fire-Boltt", baseMrp: 299900 },
    { title: "Galaxy Watch6 44mm", brand: "Samsung", baseMrp: 2999900, assured: true },
  ],
  cameras: [
    { title: "EOS 1500D DSLR Camera Body", brand: "Canon", baseMrp: 4299900 },
    { title: "Alpha ILCE-6100 Mirrorless Camera", brand: "Sony", baseMrp: 6499900, assured: true },
  ],
  "mens-clothing": [
    { title: "Slim Fit Formal Shirt", brand: "Allen Solly", baseMrp: 249900 },
    { title: "Regular Fit Cotton T-Shirt Pack of 3", brand: "Peter England", baseMrp: 129900, assured: true },
    { title: "Slim Fit Jeans", brand: "Levi's", baseMrp: 349900 },
  ],
  "womens-clothing": [
    { title: "Floral Print Kurti", brand: "FabIndia", baseMrp: 199900 },
    { title: "Cotton Palazzo Set", brand: "Biba", baseMrp: 179900, assured: true },
    { title: "Ankle Length Leggings Pack of 2", brand: "Go Colors", baseMrp: 89900 },
  ],
  footwear: [
    { title: "Running Shoes", brand: "Puma", baseMrp: 399900 },
    { title: "Casual Sneakers", brand: "Red Tape", baseMrp: 249900, assured: true },
    { title: "Formal Leather Shoes", brand: "Bata", baseMrp: 299900 },
  ],
  watches: [
    { title: "Analog Stainless Steel Watch", brand: "Titan", baseMrp: 349900, assured: true },
    { title: "Chronograph Watch for Men", brand: "Fastrack", baseMrp: 249900 },
  ],
  smartphones: [
    { title: "Galaxy M34 5G 8GB 128GB", brand: "Samsung", baseMrp: 1899900, assured: true },
    { title: "Redmi Note 13 Pro 5G 8GB 256GB", brand: "Xiaomi", baseMrp: 2699900, assured: true },
    { title: "Nord CE 3 Lite 5G 8GB 128GB", brand: "OnePlus", baseMrp: 1999900 },
    { title: "Narzo 60 5G 8GB 256GB", brand: "Realme", baseMrp: 1799900 },
    { title: "V29 5G 8GB 256GB", brand: "Vivo", baseMrp: 3299900 },
  ],
  "mobile-accessories": [
    { title: "20W USB-C Fast Charger", brand: "boAt", baseMrp: 99900 },
    { title: "Tempered Glass Screen Guard Pack of 2", brand: "Spigen", baseMrp: 49900, assured: true },
  ],
  tablets: [
    { title: "Galaxy Tab A8 10.5 inch 4GB 64GB", brand: "Samsung", baseMrp: 1899900, assured: true },
    { title: "Pad 6 11 inch 6GB 128GB", brand: "Xiaomi", baseMrp: 2899900 },
  ],
  "power-banks": [
    { title: "10000mAh Lithium Power Bank", brand: "Mi", baseMrp: 99900, assured: true },
    { title: "20000mAh Fast Charge Power Bank", brand: "Ambrane", baseMrp: 149900 },
  ],
  skincare: [
    { title: "Vitamin C Face Serum 30ml", brand: "Minimalist", baseMrp: 59900, assured: true },
    { title: "Sunscreen SPF 50 50g", brand: "La Shield", baseMrp: 49900 },
    { title: "Moisturizing Cream 100ml", brand: "Cetaphil", baseMrp: 89900 },
  ],
  makeup: [
    { title: "Matte Lipstick Set of 4", brand: "Maybelline", baseMrp: 129900 },
    { title: "Fit Me Foundation 30ml", brand: "Maybelline", baseMrp: 59900, assured: true },
  ],
  "hair-care": [
    { title: "Onion Hair Oil 200ml", brand: "Mamaearth", baseMrp: 44900 },
    { title: "Keratin Shampoo 340ml", brand: "L'Oreal Paris", baseMrp: 39900, assured: true },
  ],
  fragrances: [
    { title: "Eau De Parfum 100ml", brand: "Engage", baseMrp: 59900 },
    { title: "Premium Perfume 50ml", brand: "Ajmal", baseMrp: 149900 },
  ],
  bedsheets: [
    { title: "Cotton Double Bedsheet with 2 Pillow Covers", brand: "Spaces", baseMrp: 199900, assured: true },
    { title: "Microfiber Bedsheet King Size", brand: "Story@Home", baseMrp: 89900 },
  ],
  curtains: [
    { title: "Polyester Door Curtain Set of 2", brand: "Home Sizzler", baseMrp: 79900 },
    { title: "Blackout Window Curtains 5ft", brand: "Amazon Brand", baseMrp: 129900 },
  ],
  decor: [
    { title: "Wall Art Canvas Set of 3", brand: "eCraftIndia", baseMrp: 149900 },
    { title: "LED String Lights 10m", brand: "Wipro", baseMrp: 49900, assured: true },
  ],
  kitchenware: [
    { title: "Non-Stick Cookware Set 3 Pieces", brand: "Prestige", baseMrp: 249900, assured: true },
    { title: "Stainless Steel Lunch Box 3 Tier", brand: "Milton", baseMrp: 79900 },
  ],
  refrigerators: [
    { title: "260L 3 Star Direct Cool Single Door", brand: "Whirlpool", baseMrp: 2199900, assured: true },
    { title: "340L 2 Star Frost Free Double Door", brand: "LG", baseMrp: 3499900 },
  ],
  "washing-machines": [
    { title: "7kg Fully Automatic Top Load", brand: "Samsung", baseMrp: 1899900, assured: true },
    { title: "6.5kg Semi Automatic Twin Tub", brand: "Whirlpool", baseMrp: 1299900 },
  ],
  "air-conditioners": [
    { title: "1.5 Ton 3 Star Split AC", brand: "Voltas", baseMrp: 3499900, assured: true },
    { title: "1 Ton 5 Star Inverter Split AC", brand: "Daikin", baseMrp: 4299900 },
  ],
  "microwave-ovens": [
    { title: "20L Solo Microwave Oven", brand: "IFB", baseMrp: 649900 },
    { title: "23L Convection Microwave Oven", brand: "Samsung", baseMrp: 1099900, assured: true },
  ],
  "soft-toys": [
    { title: "Teddy Bear 40cm", brand: "Archies", baseMrp: 79900 },
    { title: "Plush Unicorn Toy 30cm", brand: "Hamleys", baseMrp: 99900 },
  ],
  "board-games": [
    { title: "Business Board Game", brand: "Funskool", baseMrp: 39900, assured: true },
    { title: "Chess Set Wooden", brand: "Sterling", baseMrp: 59900 },
  ],
  "baby-care": [
    { title: "Baby Massage Oil 200ml", brand: "Johnson's", baseMrp: 24900, assured: true },
    { title: "Baby Wet Wipes Pack of 72", brand: "Himalaya", baseMrp: 19900 },
  ],
  diapers: [
    { title: "Tape Style Diapers New Born 24 pcs", brand: "Pampers", baseMrp: 39900, assured: true },
    { title: "Pants Diapers Medium 54 pcs", brand: "Huggies", baseMrp: 89900 },
  ],
  snacks: [
    { title: "Classic Salted Potato Chips 52g Pack of 4", brand: "Lay's", baseMrp: 8000 },
    { title: "Dark Fantasy Choco Fills 300g", brand: "Sunfeast", baseMrp: 15000, assured: true },
  ],
  beverages: [
    { title: "Green Tea Bags Pack of 25", brand: "Tetley", baseMrp: 19900 },
    { title: "Instant Coffee 200g Jar", brand: "Nescafe", baseMrp: 44900, assured: true },
  ],
  nutrition: [
    { title: "Whey Protein 1kg Chocolate", brand: "MuscleBlaze", baseMrp: 249900 },
    { title: "Multivitamin Tablets 60 count", brand: "HealthKart", baseMrp: 59900, assured: true },
  ],
  "personal-care": [
    { title: "Toothpaste 200g Pack of 2", brand: "Colgate", baseMrp: 19900 },
    { title: "Body Wash 250ml", brand: "Dove", baseMrp: 24900 },
  ],
  cricket: [
    { title: "Kashmir Willow Cricket Bat Size SH", brand: "SG", baseMrp: 149900, assured: true },
    { title: "Leather Cricket Ball Pack of 2", brand: "SS", baseMrp: 79900 },
  ],
  fitness: [
    { title: "Adjustable Dumbbell Set 20kg", brand: "Kore", baseMrp: 349900 },
    { title: "Yoga Mat 6mm Anti-Skid", brand: "Strauss", baseMrp: 99900, assured: true },
  ],
  cycling: [
    { title: "Mountain Bike 26 inch 21 Speed", brand: "Hero Cycles", baseMrp: 1299900 },
    { title: "Cycling Helmet with LED", brand: "Vega", baseMrp: 149900 },
  ],
  outdoor: [
    { title: "Camping Tent 4 Person", brand: "Coleman", baseMrp: 499900 },
    { title: "Trekking Backpack 50L", brand: "Wildcraft", baseMrp: 249900, assured: true },
  ],
  sofas: [
    { title: "3 Seater Fabric Sofa", brand: "Wakefit", baseMrp: 1899900, assured: true },
    { title: "L Shape Corner Sofa with Storage", brand: "Nilkamal", baseMrp: 3499900 },
  ],
  beds: [
    { title: "Queen Size Engineered Wood Bed", brand: "Wakefit", baseMrp: 1299900, assured: true },
    { title: "King Size Hydraulic Storage Bed", brand: "Godrej Interio", baseMrp: 2499900 },
  ],
  "study-tables": [
    { title: "Engineered Wood Study Table with Drawer", brand: "Spacewood", baseMrp: 499900 },
    { title: "Height Adjustable Laptop Table", brand: "Amazon Brand", baseMrp: 149900, assured: true },
  ],
  wardrobes: [
    { title: "2 Door Engineered Wood Wardrobe", brand: "Spacewood", baseMrp: 899900 },
    { title: "3 Door Mirror Wardrobe Brown", brand: "Nilkamal", baseMrp: 1499900, assured: true },
  ],
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function discountPrice(mrp: number, discountPercent: number): number {
  return Math.round(mrp * (1 - discountPercent / 100));
}

function productImages(slug: string): string[] {
  const base = `https://picsum.photos/seed/${slug}`;
  return [`${base}/600/600`, `${base}-2/600/600`, `${base}-3/600/600`];
}

async function main() {
  console.log("Seeding database...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.oTP.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  const demoUser = await prisma.user.create({
    data: {
      email: "test@example.com",
      firstName: "Demo",
      lastName: "User",
      passwordHash,
      emailVerified: true,
    },
  });

  const subcategoryIds: string[] = [];
  let productCount = 0;
  let featuredCount = 0;
  const featuredTarget = 10;

  for (const top of categorySeeds) {
    const parent = await prisma.category.create({
      data: {
        name: top.name,
        slug: top.slug,
        image: top.image,
      },
    });

    for (const sub of top.subcategories) {
      const subcategory = await prisma.category.create({
        data: {
          name: sub.name,
          slug: sub.slug,
          image: top.image,
          parentId: parent.id,
        },
      });

      subcategoryIds.push(subcategory.id);

      const templates = productTemplates[sub.slug] ?? [];
      for (const template of templates) {
        const discountPercent = 15 + Math.floor(Math.random() * 61);
        const sellingPrice = discountPrice(template.baseMrp, discountPercent);
        const slug = slugify(`${template.brand}-${template.title}`);
        const isFeatured = featuredCount < featuredTarget && Math.random() > 0.5;

        if (isFeatured) {
          featuredCount += 1;
        }

        await prisma.product.create({
          data: {
            title: template.title,
            slug,
            description: `${template.title} by ${template.brand}. Quality product with fast delivery across India. MRP ₹${(template.baseMrp / 100).toLocaleString("en-IN")}.`,
            brand: template.brand,
            categoryId: subcategory.id,
            images: productImages(slug),
            mrp: template.baseMrp,
            sellingPrice,
            stock: 20 + Math.floor(Math.random() * 80),
            rating: 3.5 + Math.random() * 1.5,
            reviewCount: 50 + Math.floor(Math.random() * 2000),
            isFeatured,
            isAssured: template.assured ?? Math.random() > 0.6,
            attributes:
              sub.slug.includes("clothing") || sub.slug === "footwear"
                ? { size: ["S", "M", "L", "XL"], color: ["Black", "Blue", "White"] }
                : undefined,
          },
        });

        productCount += 1;
      }
    }
  }

  // Ensure at least 50 products by adding generic items to random subcategories
  while (productCount < 50 && subcategoryIds.length > 0) {
    const categoryId =
      subcategoryIds[Math.floor(Math.random() * subcategoryIds.length)]!;
    const index = productCount + 1;
    const slug = `generic-product-${index}`;
    const mrp = (999 + index * 100) * 100;

    await prisma.product.create({
      data: {
        title: `Best Value Product ${index}`,
        slug,
        description: `Popular choice for everyday use. Product ${index} with great reviews.`,
        brand: "Generic",
        categoryId,
        images: productImages(slug),
        mrp,
        sellingPrice: discountPrice(mrp, 20 + (index % 40)),
        stock: 50,
        rating: 4,
        reviewCount: 100 + index * 10,
        isFeatured: featuredCount < featuredTarget,
        isAssured: index % 3 === 0,
      },
    });

    if (featuredCount < featuredTarget) {
      featuredCount += 1;
    }

    productCount += 1;
  }

  console.log(`Seeded demo user: ${demoUser.email} (password: ${DEMO_PASSWORD})`);
  console.log(`Seeded ${categorySeeds.length} top-level categories`);
  console.log(`Seeded ${productCount} products (${featuredCount} featured)`);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
