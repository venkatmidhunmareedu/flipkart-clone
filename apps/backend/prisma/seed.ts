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
    image: "https://images.unsplash.com/photo-1593640408182-31c228b5d35d?w=400", // laptop + electronics flatlay
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
    image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400", // folded clothing arrangement
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
    image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400", // smartphone on surface
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
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400", // beauty products flatlay
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
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400", // kitchen/home interior
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
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400", // washing machine / appliance
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
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", // colorful toys
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
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400", // healthy food / supplements
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
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400", // sports equipment
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
    image: "https://images.unsplash.com/photo-1555041469-a586661a9b9?w=400", // modern sofa
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
  Array<{ title: string; brand: string; baseMrp: number; assured?: boolean; image: string; rating?: number; reviewCount?: number; discount?: number }>
> = {
  laptops: [
    {
      title: "Inspiron 15 3520 Intel Core i5-1235U 8GB 512GB SSD Windows 11",
      brand: "Dell",
      baseMrp: 5499900,
      assured: true,
      image: "https://images.unsplash.com/photo-1588702547923-7093a6c3ba33?w=400", // dell laptop on desk
      rating: 4.3,
      reviewCount: 12840,
      discount: 18,
    },
    {
      title: "Pavilion 14-dv2031TU AMD Ryzen 5 7530U 16GB 512GB SSD",
      brand: "HP",
      baseMrp: 6299900,
      assured: true,
      image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400", // laptop open hero
      rating: 4.4,
      reviewCount: 9210,
      discount: 15,
    },
    {
      title: "VivoBook 15 X1504ZA Intel Core i3-1215U 8GB 256GB SSD",
      brand: "ASUS",
      baseMrp: 4299900,
      image: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?w=400", // silver laptop
      rating: 4.1,
      reviewCount: 7430,
      discount: 10,
    },
    {
      title: "IdeaPad Slim 3 82KU01BHIN AMD Ryzen 5 5500U 8GB 512GB SSD",
      brand: "Lenovo",
      baseMrp: 4999900,
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400", // lenovo style laptop
      rating: 4.2,
      reviewCount: 10620,
      discount: 12,
    },
    {
      title: "MacBook Air 13 M2 Chip 8GB 256GB SSD Midnight",
      brand: "Apple",
      baseMrp: 11490000,
      assured: true,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400", // macbook air
      rating: 4.8,
      reviewCount: 24500,
      discount: 5,
    },
    {
      title: "Legion 5 Pro 16IRX8 Intel Core i7-13700HX 16GB 512GB RTX 4060",
      brand: "Lenovo",
      baseMrp: 14999900,
      assured: true,
      image: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400", // gaming laptop
      rating: 4.5,
      reviewCount: 4320,
      discount: 20,
    },
  ],

  headphones: [
    {
      title: "Rockerz 450 Pro Bluetooth On-Ear Headphone 70hr Battery",
      brand: "boAt",
      baseMrp: 399900,
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", // headphones on white
      rating: 4.1,
      reviewCount: 31200,
      discount: 60,
    },
    {
      title: "Airdopes 141 True Wireless Earbuds 42hr Total Playback",
      brand: "boAt",
      baseMrp: 149900,
      assured: true,
      image: "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=400", // tws earbuds case
      rating: 4.0,
      reviewCount: 58700,
      discount: 70,
    },
    {
      title: "Buds Pro 2 ANC Active Noise Cancellation TWS Earbuds",
      brand: "OnePlus",
      baseMrp: 999900,
      image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400", // earbuds with case
      rating: 4.3,
      reviewCount: 14100,
      discount: 35,
    },
    {
      title: "AirPods Pro (2nd Gen) MagSafe USB-C Charging Case",
      brand: "Apple",
      baseMrp: 2499900,
      assured: true,
      image: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400", // airpods in case
      rating: 4.6,
      reviewCount: 19800,
      discount: 8,
    },
    {
      title: "WH-1000XM5 Industry Leading ANC Wireless Headphones",
      brand: "Sony",
      baseMrp: 3499900,
      assured: true,
      image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400", // over-ear headphones
      rating: 4.7,
      reviewCount: 8900,
      discount: 25,
    },
    {
      title: "QuietComfort 45 Wireless Noise Cancelling Headphones White Smoke",
      brand: "Bose",
      baseMrp: 3299900,
      image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400", // white headphones
      rating: 4.5,
      reviewCount: 6400,
      discount: 20,
    },
  ],

  "smart-watches": [
    {
      title: "ColorFit Pro 5 Smartwatch 1.85\" AMOLED Always-On Display BT Calling",
      brand: "Noise",
      baseMrp: 499900,
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", // smartwatch flat lay
      rating: 4.0,
      reviewCount: 22300,
      discount: 68,
    },
    {
      title: "Phoenix 2 Pro BT Calling Smartwatch 1.8\" HD Display 120 Sports Modes",
      brand: "Fire-Boltt",
      baseMrp: 299900,
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400", // watch on wrist
      rating: 3.9,
      reviewCount: 41500,
      discount: 80,
    },
    {
      title: "Galaxy Watch6 44mm Bluetooth Sapphire Glass Health Tracking",
      brand: "Samsung",
      baseMrp: 2999900,
      assured: true,
      image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400", // samsung watch
      rating: 4.4,
      reviewCount: 7650,
      discount: 30,
    },
    {
      title: "Apple Watch Series 9 GPS 45mm Midnight Aluminium",
      brand: "Apple",
      baseMrp: 4490000,
      assured: true,
      image: "https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=400", // apple watch
      rating: 4.7,
      reviewCount: 13200,
      discount: 5,
    },
    {
      title: "Titan Smart 2 Pro Alexa Built-in BT Calling 1.8\" Display",
      brand: "Titan",
      baseMrp: 499900,
      assured: true,
      image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400", // minimalist watch
      rating: 4.1,
      reviewCount: 9870,
      discount: 50,
    },
  ],

  cameras: [
    {
      title: "EOS 1500D 24.1MP DSLR Camera Body with EF-S 18-55mm Lens",
      brand: "Canon",
      baseMrp: 4299900,
      image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400", // dslr camera
      rating: 4.3,
      reviewCount: 11400,
      discount: 20,
    },
    {
      title: "Alpha ILCE-6100 24.2MP APS-C Mirrorless Camera with 16-50mm Lens",
      brand: "Sony",
      baseMrp: 6499900,
      assured: true,
      image: "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=400", // mirrorless camera
      rating: 4.5,
      reviewCount: 6200,
      discount: 15,
    },
    {
      title: "Z30 DX-format Mirrorless Camera Body for Content Creators",
      brand: "Nikon",
      baseMrp: 5999900,
      assured: true,
      image: "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?w=400", // nikon style camera
      rating: 4.4,
      reviewCount: 3800,
      discount: 12,
    },
    {
      title: "GoPro HERO12 Black Action Camera 5.3K60 Video HyperSmooth 6.0",
      brand: "GoPro",
      baseMrp: 3999900,
      image: "https://images.unsplash.com/photo-1525498128493-380d1990a112?w=400", // action camera
      rating: 4.5,
      reviewCount: 8100,
      discount: 18,
    },
    {
      title: "Instax Mini 12 Instant Film Camera Mint Green",
      brand: "Fujifilm",
      baseMrp: 799900,
      image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400", // instax instant camera
      rating: 4.4,
      reviewCount: 17600,
      discount: 10,
    },
  ],

  "mens-clothing": [
    {
      title: "Slim Fit Formal Cotton Shirt Full Sleeves",
      brand: "Allen Solly",
      baseMrp: 249900,
      image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400", // white formal shirt
      rating: 4.2,
      reviewCount: 8400,
      discount: 40,
    },
    {
      title: "Regular Fit 100% Cotton T-Shirt Pack of 3",
      brand: "Peter England",
      baseMrp: 129900,
      assured: true,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", // stacked tshirts
      rating: 4.1,
      reviewCount: 22100,
      discount: 30,
    },
    {
      title: "511 Slim Fit Jeans Dark Stonewash",
      brand: "Levi's",
      baseMrp: 349900,
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400", // jeans folded
      rating: 4.3,
      reviewCount: 15600,
      discount: 25,
    },
    {
      title: "Solid Polo T-Shirt Cotton Blend",
      brand: "U.S. Polo Assn.",
      baseMrp: 179900,
      assured: true,
      image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400", // polo shirt
      rating: 4.2,
      reviewCount: 19300,
      discount: 35,
    },
    {
      title: "Relaxed Fit Chino Trousers Stretch Cotton",
      brand: "Van Heusen",
      baseMrp: 219900,
      image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400", // chino pants
      rating: 4.0,
      reviewCount: 7200,
      discount: 20,
    },
    {
      title: "Hooded Sweatshirt Fleece Full Zip",
      brand: "ADIDAS",
      baseMrp: 299900,
      assured: true,
      image: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400", // hoodie
      rating: 4.4,
      reviewCount: 11200,
      discount: 30,
    },
  ],

  "womens-clothing": [
    {
      title: "Floral Print Straight Kurta Cotton Fabric",
      brand: "FabIndia",
      baseMrp: 199900,
      image: "https://images.unsplash.com/photo-1594938298603-c8148c4b4af5?w=400", // kurta on hanger
      rating: 4.2,
      reviewCount: 9800,
      discount: 30,
    },
    {
      title: "Cotton Palazzo Set Straight Kurta with Dupatta",
      brand: "Biba",
      baseMrp: 179900,
      assured: true,
      image: "https://images.unsplash.com/photo-1614251056798-0a63eda2bb25?w=400", // indo-western outfit
      rating: 4.1,
      reviewCount: 13700,
      discount: 35,
    },
    {
      title: "Ankle Length Leggings High Waist Pack of 2",
      brand: "Go Colors",
      baseMrp: 89900,
      image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400", // leggings
      rating: 4.0,
      reviewCount: 28900,
      discount: 40,
    },
    {
      title: "A-Line Printed Midi Dress Summer Collection",
      brand: "W for Woman",
      baseMrp: 169900,
      assured: true,
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400", // floral dress
      rating: 4.3,
      reviewCount: 7100,
      discount: 25,
    },
    {
      title: "Solid Viscose Rayon Wrap Top",
      brand: "AND",
      baseMrp: 149900,
      image: "https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400", // women's top
      rating: 4.1,
      reviewCount: 5800,
      discount: 30,
    },
  ],

  footwear: [
    {
      title: "Softride Enzo Evo Running Shoes Lightweight",
      brand: "Puma",
      baseMrp: 399900,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", // running shoe side
      rating: 4.2,
      reviewCount: 14300,
      discount: 40,
    },
    {
      title: "Casual Canvas Sneakers Lace Up",
      brand: "Red Tape",
      baseMrp: 249900,
      assured: true,
      image: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400", // white sneakers
      rating: 4.0,
      reviewCount: 18900,
      discount: 35,
    },
    {
      title: "Formal Leather Derby Shoes",
      brand: "Bata",
      baseMrp: 299900,
      image: "https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?w=400", // formal leather shoes
      rating: 4.1,
      reviewCount: 9800,
      discount: 25,
    },
    {
      title: "Ultra 4D Running Shoes Boost Midsole",
      brand: "Adidas",
      baseMrp: 1299900,
      assured: true,
      image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400", // adidas shoes
      rating: 4.5,
      reviewCount: 6700,
      discount: 20,
    },
    {
      title: "Air Max 270 Lifestyle Shoes Black",
      brand: "Nike",
      baseMrp: 1099900,
      image: "https://images.unsplash.com/photo-1556048219-bb6978360b84?w=400", // nike shoes
      rating: 4.4,
      reviewCount: 11200,
      discount: 15,
    },
    {
      title: "Slip-On Crocband Clogs Lightweight",
      brand: "Crocs",
      baseMrp: 399900,
      image: "https://images.unsplash.com/photo-1579407364450-481fe19dbfaa?w=400", // clogs / slip-on
      rating: 4.3,
      reviewCount: 23400,
      discount: 30,
    },
  ],

  watches: [
    {
      title: "Regalia Analog Stainless Steel Watch Day-Date Men",
      brand: "Titan",
      baseMrp: 349900,
      assured: true,
      image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400", // stainless steel watch
      rating: 4.3,
      reviewCount: 12100,
      discount: 25,
    },
    {
      title: "Chronograph Dual Tone Dial Analog Watch Men",
      brand: "Fastrack",
      baseMrp: 249900,
      image: "https://images.unsplash.com/photo-1539874754764-5a96559165b0?w=400", // fastrack chronograph
      rating: 4.0,
      reviewCount: 16700,
      discount: 30,
    },
    {
      title: "Rado True Thinline Quartz Ceramic Watch Women",
      brand: "Fossil",
      baseMrp: 1299900,
      assured: true,
      image: "https://images.unsplash.com/photo-1585123334904-845d60e97b29?w=400", // women watch rose gold
      rating: 4.4,
      reviewCount: 4300,
      discount: 20,
    },
    {
      title: "PRW-6100Y-1ADR Protrek Solar Powered Watch",
      brand: "Casio",
      baseMrp: 599900,
      image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=400", // casio watch
      rating: 4.5,
      reviewCount: 7800,
      discount: 15,
    },
  ],

  smartphones: [
    {
      title: "Galaxy M34 5G 8GB 128GB Midnight Blue 50MP Triple Camera",
      brand: "Samsung",
      baseMrp: 1899900,
      assured: true,
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400", // samsung phone
      rating: 4.2,
      reviewCount: 28400,
      discount: 20,
    },
    {
      title: "Redmi Note 13 Pro 5G 8GB 256GB Midnight Black 200MP",
      brand: "Xiaomi",
      baseMrp: 2699900,
      assured: true,
      image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400", // xiaomi phone
      rating: 4.3,
      reviewCount: 31600,
      discount: 22,
    },
    {
      title: "Nord CE 3 Lite 5G 8GB 128GB Pastel Lime 108MP Camera",
      brand: "OnePlus",
      baseMrp: 1999900,
      image: "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=400", // oneplus phone
      rating: 4.1,
      reviewCount: 22100,
      discount: 18,
    },
    {
      title: "Narzo 60 5G 8GB 256GB Glass Black AMOLED 68W Charging",
      brand: "Realme",
      baseMrp: 1799900,
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400", // phone on surface
      rating: 4.1,
      reviewCount: 17800,
      discount: 15,
    },
    {
      title: "V29 5G 8GB 256GB Himalayan Blue Curved AMOLED 50MP OIS",
      brand: "Vivo",
      baseMrp: 3299900,
      image: "https://images.unsplash.com/photo-1605236453806-6ff36851218e?w=400", // vivo phone
      rating: 4.2,
      reviewCount: 9400,
      discount: 12,
    },
    {
      title: "iPhone 15 128GB Black A16 Bionic Dynamic Island",
      brand: "Apple",
      baseMrp: 7990000,
      assured: true,
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400", // iphone 15
      rating: 4.7,
      reviewCount: 48700,
      discount: 5,
    },
    {
      title: "Pixel 8 8GB 128GB Hazel 50MP Camera Google Tensor G3",
      brand: "Google",
      baseMrp: 7499900,
      assured: true,
      image: "https://images.unsplash.com/photo-1598327106026-d9521da673d1?w=400", // google pixel phone
      rating: 4.5,
      reviewCount: 8200,
      discount: 10,
    },
  ],

  "mobile-accessories": [
    {
      title: "45W USB-C Super Fast Charging Wall Adapter",
      brand: "boAt",
      baseMrp: 149900,
      image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400", // charger plug
      rating: 4.2,
      reviewCount: 23500,
      discount: 50,
    },
    {
      title: "Tempered Glass Screen Protector 9H Hardness Pack of 2",
      brand: "Spigen",
      baseMrp: 49900,
      assured: true,
      image: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400", // screen protector / phone
      rating: 4.3,
      reviewCount: 41200,
      discount: 40,
    },
    {
      title: "Nylon Braided 1.5m USB-C to USB-C Cable Fast Charge",
      brand: "Anker",
      baseMrp: 89900,
      assured: true,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", // cable coiled
      rating: 4.4,
      reviewCount: 18700,
      discount: 30,
    },
    {
      title: "15W Magnetic Wireless Charger Stand MagSafe Compatible",
      brand: "Belkin",
      baseMrp: 299900,
      image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=400", // wireless charger
      rating: 4.3,
      reviewCount: 7100,
      discount: 20,
    },
    {
      title: "Slim Hard Back Cover Bumper Drop Protection Case",
      brand: "Spigen",
      baseMrp: 79900,
      image: "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=400", // phone case
      rating: 4.3,
      reviewCount: 55300,
      discount: 35,
    },
  ],

  tablets: [
    {
      title: "Galaxy Tab A8 10.5\" 4GB 64GB Wi-Fi Grey",
      brand: "Samsung",
      baseMrp: 1899900,
      assured: true,
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400", // tablet on desk
      rating: 4.2,
      reviewCount: 14300,
      discount: 20,
    },
    {
      title: "Pad 6 11\" 6GB 128GB Wi-Fi Mist Blue Dolby Vision Atmos",
      brand: "Xiaomi",
      baseMrp: 2899900,
      image: "https://images.unsplash.com/photo-1589739900243-4b52cd9b104e?w=400", // tablet angle
      rating: 4.3,
      reviewCount: 8900,
      discount: 15,
    },
    {
      title: "iPad 10th Gen 10.9\" 64GB Wi-Fi Blue",
      brand: "Apple",
      baseMrp: 4490000,
      assured: true,
      image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400", // ipad
      rating: 4.6,
      reviewCount: 22400,
      discount: 8,
    },
    {
      title: "Tab P11 Pro Gen 2 11.2\" OLED 6GB 128GB Wi-Fi",
      brand: "Lenovo",
      baseMrp: 3499900,
      image: "https://images.unsplash.com/photo-1541807360936-b5fd86f87da2?w=400", // lenovo tablet
      rating: 4.3,
      reviewCount: 5600,
      discount: 25,
    },
  ],

  "power-banks": [
    {
      title: "10000mAh Lithium Polymer Power Bank 18W Fast Charge",
      brand: "Mi",
      baseMrp: 99900,
      assured: true,
      image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400", // power bank
      rating: 4.3,
      reviewCount: 61400,
      discount: 30,
    },
    {
      title: "20000mAh 22.5W Fast Charge Power Bank Dual USB",
      brand: "Ambrane",
      baseMrp: 149900,
      image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400", // power bank side
      rating: 4.1,
      reviewCount: 29800,
      discount: 55,
    },
    {
      title: "PowerCore 26800 PD 65W USB-C Laptop Power Bank",
      brand: "Anker",
      baseMrp: 599900,
      assured: true,
      image: "https://images.unsplash.com/photo-1655793963800-2a21e3bc7c7f?w=400", // anker power bank
      rating: 4.5,
      reviewCount: 9200,
      discount: 20,
    },
  ],

  skincare: [
    {
      title: "10% Niacinamide Face Serum Minimizes Pores 30ml",
      brand: "Minimalist",
      baseMrp: 59900,
      assured: true,
      image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400", // skincare serum bottle
      rating: 4.4,
      reviewCount: 87300,
      discount: 20,
    },
    {
      title: "Invisible Sunscreen SPF 50 PA++++ Ultra Light 50g",
      brand: "La Shield",
      baseMrp: 49900,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400", // sunscreen tube
      rating: 4.3,
      reviewCount: 43200,
      discount: 15,
    },
    {
      title: "Moisturizing Cream Normal to Dry Skin 100ml",
      brand: "Cetaphil",
      baseMrp: 89900,
      image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?w=400", // moisturizer
      rating: 4.5,
      reviewCount: 34600,
      discount: 18,
    },
    {
      title: "Ubtan Face Wash Natural Glow Turmeric 100ml",
      brand: "Mamaearth",
      baseMrp: 34900,
      assured: true,
      image: "https://images.unsplash.com/photo-1570194065650-d99fb4a8b836?w=400", // face wash tube
      rating: 4.2,
      reviewCount: 67400,
      discount: 25,
    },
    {
      title: "Vitamin C Brightening Cream SPF 25 50g",
      brand: "Himalaya",
      baseMrp: 44900,
      image: "https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400", // cream jar
      rating: 4.1,
      reviewCount: 28700,
      discount: 20,
    },
  ],

  makeup: [
    {
      title: "Super Stay Matte Ink Liquid Lipstick 5ml Long Lasting",
      brand: "Maybelline",
      baseMrp: 59900,
      image: "https://images.unsplash.com/photo-1586495777744-4e6232bf7a26?w=400", // lipstick
      rating: 4.3,
      reviewCount: 44100,
      discount: 25,
    },
    {
      title: "Fit Me Matte Poreless Foundation 30ml 220 Natural Beige",
      brand: "Maybelline",
      baseMrp: 59900,
      assured: true,
      image: "https://images.unsplash.com/photo-1571781565036-d3f759be73e4?w=400", // foundation bottle
      rating: 4.2,
      reviewCount: 51900,
      discount: 30,
    },
    {
      title: "Pro Eye Pencil Kajal Kohl Smudge Proof Black 1.2g",
      brand: "Lakme",
      baseMrp: 19900,
      assured: true,
      image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400", // eye makeup products
      rating: 4.3,
      reviewCount: 112400,
      discount: 30,
    },
    {
      title: "Setting Powder Translucent Loose Powder 6g",
      brand: "NYX",
      baseMrp: 79900,
      image: "https://images.unsplash.com/photo-1631730486784-74757073f533?w=400", // compact powder
      rating: 4.2,
      reviewCount: 18900,
      discount: 20,
    },
    {
      title: "3CE Mood Recipe Cushion Foundation SPF50+ PA+++",
      brand: "3CE",
      baseMrp: 129900,
      assured: true,
      image: "https://images.unsplash.com/photo-1561365452-adb940139ffa?w=400", // cushion compact
      rating: 4.4,
      reviewCount: 9700,
      discount: 15,
    },
  ],

  "hair-care": [
    {
      title: "Onion Hair Fall Control Shampoo 250ml Strengthens Roots",
      brand: "Mamaearth",
      baseMrp: 34900,
      image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=400", // shampoo bottle
      rating: 4.1,
      reviewCount: 98600,
      discount: 20,
    },
    {
      title: "Total Repair 5 Shampoo 340ml Damaged Hair",
      brand: "L'Oreal Paris",
      baseMrp: 39900,
      assured: true,
      image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400", // hair care product
      rating: 4.3,
      reviewCount: 72300,
      discount: 25,
    },
    {
      title: "Hair Growth Onion Oil with Black Seed 150ml",
      brand: "Wow Skin Science",
      baseMrp: 44900,
      image: "https://images.unsplash.com/photo-1526739178209-8b2b5e89e7ef?w=400", // hair oil bottle
      rating: 4.2,
      reviewCount: 56800,
      discount: 30,
    },
    {
      title: "Coconut Milk Anti Breakage Hair Mask 200ml",
      brand: "OGX",
      baseMrp: 69900,
      image: "https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?w=400", // hair mask jar
      rating: 4.3,
      reviewCount: 18700,
      discount: 20,
    },
  ],

  fragrances: [
    {
      title: "Engage Drip Deo Spray 150ml Long Lasting Freshness",
      brand: "Engage",
      baseMrp: 29900,
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=400", // perfume bottle
      rating: 4.0,
      reviewCount: 44200,
      discount: 20,
    },
    {
      title: "Wisal Eau De Parfum 50ml Floral Oriental Fragrance",
      brand: "Ajmal",
      baseMrp: 149900,
      assured: true,
      image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=400", // perfume spray
      rating: 4.4,
      reviewCount: 12600,
      discount: 15,
    },
    {
      title: "Bleu de Chanel Eau de Parfum 100ml Woody Aromatic",
      brand: "Chanel",
      baseMrp: 1499900,
      assured: true,
      image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400", // luxury perfume bottle
      rating: 4.8,
      reviewCount: 6400,
      discount: 5,
    },
    {
      title: "Fogg Marco EDP 100ml 800 Sprays Woody Fresh",
      brand: "Fogg",
      baseMrp: 59900,
      image: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400", // fogg style perfume
      rating: 4.2,
      reviewCount: 38100,
      discount: 25,
    },
  ],

  bedsheets: [
    {
      title: "Spaces Essentials 144TC Cotton Double Bedsheet 2 Pillow Covers",
      brand: "Spaces",
      baseMrp: 199900,
      assured: true,
      image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400", // bedsheet on bed
      rating: 4.2,
      reviewCount: 21400,
      discount: 35,
    },
    {
      title: "Microfiber King Size Bedsheet Anti Pilling 300TC",
      brand: "Story@Home",
      baseMrp: 89900,
      image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400", // bedroom bedsheet
      rating: 4.0,
      reviewCount: 31800,
      discount: 50,
    },
    {
      title: "Egyptian Cotton 1000TC Sateen Weave King Bedsheet",
      brand: "Raymond Home",
      baseMrp: 599900,
      assured: true,
      image: "https://images.unsplash.com/photo-1560448075-bb485b1e9b43?w=400", // luxury bedsheet
      rating: 4.5,
      reviewCount: 4800,
      discount: 25,
    },
  ],

  curtains: [
    {
      title: "Polyester Door Curtain Floral Print Set of 2 7ft",
      brand: "Home Sizzler",
      baseMrp: 79900,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", // curtain in room
      rating: 4.0,
      reviewCount: 14200,
      discount: 45,
    },
    {
      title: "Blackout Window Curtains Thermal Insulated 5ft Set of 2",
      brand: "Amazon Brand",
      baseMrp: 129900,
      image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400", // blackout curtains
      rating: 4.2,
      reviewCount: 9800,
      discount: 30,
    },
    {
      title: "Sheer Voile Curtain Rod Pocket Window Treatment Set of 2",
      brand: "Story@Home",
      baseMrp: 59900,
      image: "https://images.unsplash.com/photo-1615876234886-fd9a39fda97f?w=400", // sheer curtains
      rating: 4.1,
      reviewCount: 7300,
      discount: 40,
    },
  ],

  decor: [
    {
      title: "Wall Art Canvas Painting Set of 3 Abstract Modern Art",
      brand: "eCraftIndia",
      baseMrp: 149900,
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400", // wall art prints
      rating: 4.2,
      reviewCount: 8700,
      discount: 40,
    },
    {
      title: "Fairy LED String Lights Warm White 10m 100 LEDs",
      brand: "Wipro",
      baseMrp: 49900,
      assured: true,
      image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400", // fairy lights
      rating: 4.3,
      reviewCount: 32600,
      discount: 50,
    },
    {
      title: "Ceramic Flower Vase Decorative Marble Finish 25cm",
      brand: "Nestasia",
      baseMrp: 79900,
      image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400", // decorative vase
      rating: 4.4,
      reviewCount: 6100,
      discount: 30,
    },
    {
      title: "Macrame Wall Hanging Boho Home Decor 60x90cm",
      brand: "Handicraft Store",
      baseMrp: 89900,
      image: "https://images.unsplash.com/photo-1558171813-bfe28d50b0c7?w=400", // macrame wall hanging
      rating: 4.3,
      reviewCount: 11400,
      discount: 35,
    },
  ],

  kitchenware: [
    {
      title: "3-Piece Non-Stick Aluminium Cookware Set Kadai Tawa Pan",
      brand: "Prestige",
      baseMrp: 249900,
      assured: true,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400", // cookware set
      rating: 4.3,
      reviewCount: 19700,
      discount: 35,
    },
    {
      title: "Stainless Steel Lunch Box 3 Tier with Bag 900ml",
      brand: "Milton",
      baseMrp: 79900,
      image: "https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400", // lunch box
      rating: 4.2,
      reviewCount: 41200,
      discount: 30,
    },
    {
      title: "Electric Kettle 1.5L 1500W Auto Shutoff Boil-Dry Protection",
      brand: "Philips",
      baseMrp: 99900,
      assured: true,
      image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400", // electric kettle
      rating: 4.4,
      reviewCount: 28900,
      discount: 25,
    },
    {
      title: "Stainless Steel Water Bottle 1L Insulated Hot Cold 18hr",
      brand: "Cello",
      baseMrp: 59900,
      image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400", // water bottle
      rating: 4.2,
      reviewCount: 51300,
      discount: 40,
    },
  ],

  refrigerators: [
    {
      title: "260L 3 Star Intellifresh Inverter Direct Cool Single Door",
      brand: "Whirlpool",
      baseMrp: 2199900,
      assured: true,
      image: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400", // refrigerator
      rating: 4.3,
      reviewCount: 8900,
      discount: 20,
    },
    {
      title: "340L 2 Star Frost Free Double Door Refrigerator",
      brand: "LG",
      baseMrp: 3499900,
      image: "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400", // double door fridge
      rating: 4.4,
      reviewCount: 6700,
      discount: 15,
    },
    {
      title: "253L 3 Star Frost Free Double Door Frost Free",
      brand: "Samsung",
      baseMrp: 2999900,
      assured: true,
      image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400", // samsung fridge
      rating: 4.3,
      reviewCount: 7400,
      discount: 18,
    },
  ],

  "washing-machines": [
    {
      title: "7kg 5 Star Fully Automatic Top Load Washing Machine",
      brand: "Samsung",
      baseMrp: 1899900,
      assured: true,
      image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=400", // washing machine front
      rating: 4.3,
      reviewCount: 12100,
      discount: 18,
    },
    {
      title: "6.5kg Semi Automatic Twin Tub Washing Machine",
      brand: "Whirlpool",
      baseMrp: 1299900,
      image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=400", // semi automatic washer
      rating: 4.1,
      reviewCount: 8900,
      discount: 20,
    },
    {
      title: "8kg 5 Star Front Load Fully Automatic Steam Washing Machine",
      brand: "LG",
      baseMrp: 3999900,
      assured: true,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", // front load washer
      rating: 4.5,
      reviewCount: 9200,
      discount: 22,
    },
  ],

  "air-conditioners": [
    {
      title: "1.5 Ton 3 Star Inverter Split AC 5-in-1 Convertible",
      brand: "Voltas",
      baseMrp: 3499900,
      assured: true,
      image: "https://images.unsplash.com/photo-1620340146096-6f51c035a5a3?w=400", // split ac unit
      rating: 4.2,
      reviewCount: 14300,
      discount: 25,
    },
    {
      title: "1 Ton 5 Star Inverter Split AC Wi-Fi Enabled",
      brand: "Daikin",
      baseMrp: 4299900,
      image: "https://images.unsplash.com/photo-1580595426041-e7c3e4e72f4e?w=400", // ac interior unit
      rating: 4.4,
      reviewCount: 8700,
      discount: 20,
    },
    {
      title: "1.5 Ton 5 Star AI Convertible 6-in-1 DUAL Inverter Wi-Fi",
      brand: "LG",
      baseMrp: 4999900,
      assured: true,
      image: "https://images.unsplash.com/photo-1601599963565-b7f49deb352a?w=400", // modern ac
      rating: 4.5,
      reviewCount: 7100,
      discount: 22,
    },
  ],

  "microwave-ovens": [
    {
      title: "20L Solo Microwave Oven 1200W Stainless Steel Cavity",
      brand: "IFB",
      baseMrp: 649900,
      image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400", // microwave oven
      rating: 4.2,
      reviewCount: 11400,
      discount: 18,
    },
    {
      title: "23L Convection Microwave Oven Slim Fry Health Steam",
      brand: "Samsung",
      baseMrp: 1099900,
      assured: true,
      image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400", // convection microwave
      rating: 4.4,
      reviewCount: 8800,
      discount: 22,
    },
    {
      title: "28L Convection Microwave Oven Motorised Rotisserie",
      brand: "LG",
      baseMrp: 1499900,
      image: "https://images.unsplash.com/photo-1616847437750-a32d63a3e4c8?w=400", // large microwave
      rating: 4.3,
      reviewCount: 6400,
      discount: 20,
    },
  ],

  "soft-toys": [
    {
      title: "Teddy Bear Soft Toy Brown Stuffed Animal 40cm",
      brand: "Archies",
      baseMrp: 79900,
      image: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=400", // teddy bear
      rating: 4.3,
      reviewCount: 18700,
      discount: 40,
    },
    {
      title: "Rainbow Unicorn Soft Plush Toy with Wings 30cm",
      brand: "Hamleys",
      baseMrp: 99900,
      image: "https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400", // unicorn plush
      rating: 4.4,
      reviewCount: 9400,
      discount: 35,
    },
    {
      title: "Stuffed Elephant Baby Toy Soft Cotton 25cm",
      brand: "Mirada",
      baseMrp: 69900,
      assured: true,
      image: "https://images.unsplash.com/photo-1585565804825-4ebf9641ae5e?w=400", // stuffed elephant
      rating: 4.5,
      reviewCount: 7200,
      discount: 30,
    },
  ],

  "board-games": [
    {
      title: "Business Board Game 2-6 Players Family Strategy",
      brand: "Funskool",
      baseMrp: 39900,
      assured: true,
      image: "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400", // board game
      rating: 4.3,
      reviewCount: 12900,
      discount: 25,
    },
    {
      title: "Magnetic Folding Chess Set Tournament Size Wooden Pieces",
      brand: "Sterling",
      baseMrp: 59900,
      image: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=400", // chess board
      rating: 4.4,
      reviewCount: 8700,
      discount: 20,
    },
    {
      title: "Scrabble Original Classic Board Game 2-4 Players",
      brand: "Mattel",
      baseMrp: 89900,
      assured: true,
      image: "https://images.unsplash.com/photo-1606503153255-59d8b8b82176?w=400", // scrabble
      rating: 4.5,
      reviewCount: 6800,
      discount: 15,
    },
    {
      title: "Ludo King Jumbo Size Large Board Game with Dice",
      brand: "Pressman",
      baseMrp: 24900,
      image: "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400", // ludo game
      rating: 4.2,
      reviewCount: 22100,
      discount: 30,
    },
  ],

  "baby-care": [
    {
      title: "Baby Massage Oil Mineral Oil Free 200ml",
      brand: "Johnson's",
      baseMrp: 24900,
      assured: true,
      image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400", // baby care products
      rating: 4.4,
      reviewCount: 41300,
      discount: 20,
    },
    {
      title: "Gentle Baby Wet Wipes No Parabens Alcohol Free 72 pcs",
      brand: "Himalaya",
      baseMrp: 19900,
      image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400", // baby products
      rating: 4.3,
      reviewCount: 54200,
      discount: 25,
    },
    {
      title: "Baby Powder Talc Free with Cornstarch 400g",
      brand: "Johnson's",
      assured: true,
      baseMrp: 29900,
      image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400", // baby powder
      rating: 4.4,
      reviewCount: 32700,
      discount: 15,
    },
  ],

  diapers: [
    {
      title: "Swaddlers Tape Style Diapers Newborn 24 pcs 0-5 kg",
      brand: "Pampers",
      baseMrp: 39900,
      assured: true,
      image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400", // diaper pack
      rating: 4.5,
      reviewCount: 28700,
      discount: 20,
    },
    {
      title: "Little Pants Style Diaper Medium Size 54 pcs 6-11 kg",
      brand: "Huggies",
      baseMrp: 89900,
      image: "https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=400", // baby pants diapers
      rating: 4.4,
      reviewCount: 21400,
      discount: 22,
    },
    {
      title: "Premium Baby Pants XL 42 pcs 12+ kg 12hr Protection",
      brand: "MamyPoko",
      baseMrp: 99900,
      assured: true,
      image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400", // baby diapers
      rating: 4.3,
      reviewCount: 16800,
      discount: 25,
    },
  ],

  snacks: [
    {
      title: "Classic Salted Potato Chips 52g Pack of 4 Crispy",
      brand: "Lay's",
      baseMrp: 8000,
      image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400", // chips bag
      rating: 4.3,
      reviewCount: 89400,
      discount: 10,
    },
    {
      title: "Dark Fantasy Choco Fills Cream Biscuit 300g",
      brand: "Sunfeast",
      baseMrp: 15000,
      assured: true,
      image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400", // chocolate biscuits
      rating: 4.5,
      reviewCount: 112000,
      discount: 8,
    },
    {
      title: "Baked Multigrain Ragi Chips Roasted Seeds 100g",
      brand: "Too Yumm",
      baseMrp: 20000,
      image: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400", // healthy snack chips
      rating: 4.1,
      reviewCount: 24300,
      discount: 15,
    },
    {
      title: "Mixed Nuts Dry Fruits Almonds Cashews Raisins 500g",
      brand: "Happilo",
      baseMrp: 59900,
      assured: true,
      image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400", // mixed nuts
      rating: 4.4,
      reviewCount: 43200,
      discount: 20,
    },
  ],

  beverages: [
    {
      title: "Green Tea Bags Natural Flavour Pack of 25",
      brand: "Tetley",
      baseMrp: 19900,
      image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400", // green tea
      rating: 4.2,
      reviewCount: 67300,
      discount: 15,
    },
    {
      title: "Classic Blend Instant Coffee 200g Glass Jar",
      brand: "Nescafe",
      baseMrp: 44900,
      assured: true,
      image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400", // coffee jar
      rating: 4.4,
      reviewCount: 94100,
      discount: 18,
    },
    {
      title: "Tropicana 100% Juice Mixed Fruit 1L Pack of 6",
      brand: "Tropicana",
      baseMrp: 59900,
      image: "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=400", // juice pack
      rating: 4.3,
      reviewCount: 37800,
      discount: 20,
    },
    {
      title: "Masala Chai Premium CTC Tea Blend 500g Kadak",
      brand: "Wagh Bakri",
      baseMrp: 29900,
      assured: true,
      image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400", // masala chai tea
      rating: 4.5,
      reviewCount: 82400,
      discount: 10,
    },
  ],

  nutrition: [
    {
      title: "Pro Performance Whey Protein 1kg Double Chocolate",
      brand: "MuscleBlaze",
      baseMrp: 249900,
      image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400", // protein powder tub
      rating: 4.2,
      reviewCount: 41200,
      discount: 30,
    },
    {
      title: "HK Vitals Multivitamin Tablets 60 Count Immunity Support",
      brand: "HealthKart",
      baseMrp: 59900,
      assured: true,
      image: "https://images.unsplash.com/photo-1550572017-edd951b55104?w=400", // vitamin tablets
      rating: 4.3,
      reviewCount: 28700,
      discount: 25,
    },
    {
      title: "Omega 3 Fish Oil Softgel Capsules 1000mg 60 Count",
      brand: "OZiva",
      baseMrp: 79900,
      image: "https://images.unsplash.com/photo-1612207355655-8cdb3578f9ac?w=400", // supplement capsules
      rating: 4.2,
      reviewCount: 18900,
      discount: 20,
    },
    {
      title: "Plant-Based Protein Powder Vanilla 500g Vegan",
      brand: "Oziva",
      baseMrp: 149900,
      assured: true,
      image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=400", // plant protein
      rating: 4.1,
      reviewCount: 9800,
      discount: 22,
    },
  ],

  "personal-care": [
    {
      title: "Total Toothpaste Whole Mouth Health 200g Pack of 2",
      brand: "Colgate",
      baseMrp: 19900,
      image: "https://images.unsplash.com/photo-1600428863440-41e4b6e38da1?w=400", // toothpaste
      rating: 4.3,
      reviewCount: 61200,
      discount: 15,
    },
    {
      title: "Deeply Nourishing Body Wash 250ml Sensitive Skin",
      brand: "Dove",
      baseMrp: 24900,
      image: "https://images.unsplash.com/photo-1556760544-74068565f05c?w=400", // body wash bottle
      rating: 4.4,
      reviewCount: 44700,
      discount: 20,
    },
    {
      title: "Deo Stick 72hr Protection 50g",
      brand: "Nivea",
      baseMrp: 24900,
      assured: true,
      image: "https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=400", // deodorant
      rating: 4.2,
      reviewCount: 38900,
      discount: 18,
    },
    {
      title: "Razor 3 Blade Disposable Men Sensitive Pack of 4",
      brand: "Gillette",
      baseMrp: 19900,
      image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400", // razor
      rating: 4.4,
      reviewCount: 52300,
      discount: 15,
    },
  ],

  cricket: [
    {
      title: "English Willow Grade 3 Cricket Bat with Cover SH 1.15kg",
      brand: "SG",
      baseMrp: 349900,
      assured: true,
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=400", // cricket bat
      rating: 4.3,
      reviewCount: 8900,
      discount: 20,
    },
    {
      title: "Players Edition Leather Cricket Ball Red Seam Pack of 3",
      brand: "SS",
      baseMrp: 79900,
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400", // cricket ball
      rating: 4.2,
      reviewCount: 11400,
      discount: 15,
    },
    {
      title: "Thigh Guard Batting Pad Cricket Protection",
      brand: "GM",
      baseMrp: 129900,
      image: "https://images.unsplash.com/photo-1624880357913-a8539238245b?w=400", // cricket gear
      rating: 4.1,
      reviewCount: 4600,
      discount: 25,
    },
    {
      title: "Cricket Batting Gloves Right Hand Pro Series",
      brand: "Kookaburra",
      baseMrp: 149900,
      assured: true,
      image: "https://images.unsplash.com/photo-1590075865003-e48277faa558?w=400", // cricket gloves
      rating: 4.4,
      reviewCount: 5800,
      discount: 18,
    },
  ],

  fitness: [
    {
      title: "Adjustable Dumbbell Set Cast Iron 20kg Home Gym",
      brand: "Kore",
      baseMrp: 349900,
      image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400", // dumbbells
      rating: 4.2,
      reviewCount: 18400,
      discount: 30,
    },
    {
      title: "Anti-Slip Yoga Mat 6mm Extra Thick TPE Material",
      brand: "Strauss",
      baseMrp: 99900,
      assured: true,
      image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400", // yoga mat
      rating: 4.3,
      reviewCount: 31200,
      discount: 35,
    },
    {
      title: "Resistance Bands Set Loop Exercise Bands 5 Levels",
      brand: "TheraBand",
      baseMrp: 79900,
      image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400", // resistance bands
      rating: 4.3,
      reviewCount: 22100,
      discount: 40,
    },
    {
      title: "Jump Rope Speed Skipping Rope Ball Bearings Adjustable",
      brand: "Boldfit",
      baseMrp: 49900,
      image: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=400", // skipping rope
      rating: 4.2,
      reviewCount: 28700,
      discount: 50,
    },
    {
      title: "Pull-Up Bar Doorframe No Screw Chin-Up Bar 100kg",
      brand: "Aurion",
      baseMrp: 129900,
      assured: true,
      image: "https://images.unsplash.com/photo-1597452485669-2c7bb5fef90d?w=400", // pull-up bar exercise
      rating: 4.1,
      reviewCount: 13800,
      discount: 25,
    },
  ],

  cycling: [
    {
      title: "Hercules Sparx 26T MTB Mountain Bike 21 Speed",
      brand: "Hero Cycles",
      baseMrp: 1299900,
      image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400", // mountain bike
      rating: 4.0,
      reviewCount: 7800,
      discount: 15,
    },
    {
      title: "Cycling Helmet MIPS Protection Aero Adjustable",
      brand: "Vega",
      baseMrp: 149900,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400", // cycling helmet
      rating: 4.2,
      reviewCount: 9400,
      discount: 30,
    },
    {
      title: "Cycling Gloves Half Finger Gel Padded MTB Road",
      brand: "Nivia",
      baseMrp: 49900,
      image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400", // cycling gloves
      rating: 4.1,
      reviewCount: 14200,
      discount: 40,
    },
  ],

  outdoor: [
    {
      title: "Coleman Sundome 4 Person Easy Setup Tent 3000mm Waterproof",
      brand: "Coleman",
      baseMrp: 499900,
      image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400", // camping tent
      rating: 4.3,
      reviewCount: 4800,
      discount: 20,
    },
    {
      title: "Trekking Backpack 50L Waterproof Rain Cover Camping",
      brand: "Wildcraft",
      baseMrp: 249900,
      assured: true,
      image: "https://images.unsplash.com/photo-1622260614153-03223fb72052?w=400", // trekking backpack
      rating: 4.3,
      reviewCount: 11200,
      discount: 25,
    },
    {
      title: "Trekking Poles Adjustable Lightweight Aluminum Pair",
      brand: "Quechua",
      baseMrp: 149900,
      image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=400", // trekking poles
      rating: 4.2,
      reviewCount: 7300,
      discount: 30,
    },
  ],

  sofas: [
    {
      title: "Furl 3 Seater Fabric Sofa Cloud Grey Premium Foam",
      brand: "Wakefit",
      baseMrp: 1899900,
      assured: true,
      image: "https://images.unsplash.com/photo-1555041469-a586661a9b9?w=400", // grey 3 seater sofa
      rating: 4.4,
      reviewCount: 8700,
      discount: 20,
    },
    {
      title: "L Shape Corner Sofa Sectional with Ottoman Storage",
      brand: "Nilkamal",
      baseMrp: 3499900,
      image: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400", // l-shape sofa
      rating: 4.2,
      reviewCount: 5600,
      discount: 15,
    },
    {
      title: "Velvet 2 Seater Love Seat Sofa Emerald Green Modern",
      brand: "Urban Ladder",
      baseMrp: 1299900,
      image: "https://images.unsplash.com/photo-1550254478-ead40cc54513?w=400", // velvet loveseat
      rating: 4.3,
      reviewCount: 4200,
      discount: 25,
    },
  ],

  beds: [
    {
      title: "Watson Queen Size Engineered Wood Platform Bed Walnut",
      brand: "Wakefit",
      baseMrp: 1299900,
      assured: true,
      image: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400", // queen bed
      rating: 4.4,
      reviewCount: 11400,
      discount: 20,
    },
    {
      title: "King Size Hydraulic Storage Bed with Box Dark Walnut",
      brand: "Godrej Interio",
      baseMrp: 2499900,
      image: "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?w=400", // king size bed
      rating: 4.3,
      reviewCount: 7200,
      discount: 15,
    },
    {
      title: "Divan Upholstered Platform Bed Frame Tufted Headboard",
      brand: "Urban Ladder",
      baseMrp: 1999900,
      image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=400", // upholstered bed
      rating: 4.4,
      reviewCount: 5800,
      discount: 18,
    },
  ],

  "study-tables": [
    {
      title: "Engineered Wood Study Table with 2 Drawers Walnut Finish",
      brand: "Spacewood",
      baseMrp: 499900,
      image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400", // study desk
      rating: 4.2,
      reviewCount: 9700,
      discount: 25,
    },
    {
      title: "Height Adjustable Laptop Lap Table Stand Portable",
      brand: "Amazon Brand",
      baseMrp: 149900,
      assured: true,
      image: "https://images.unsplash.com/photo-1593642632523-f30f2d68a1e8?w=400", // laptop table
      rating: 4.2,
      reviewCount: 28300,
      discount: 40,
    },
    {
      title: "Standing Desk Converter Sit Stand Riser Dual Monitor",
      brand: "Flexispot",
      baseMrp: 799900,
      image: "https://images.unsplash.com/photo-1593642634443-44adaa06623a?w=400", // standing desk
      rating: 4.4,
      reviewCount: 4100,
      discount: 15,
    },
  ],

  wardrobes: [
    {
      title: "2 Door Engineered Wood Sliding Wardrobe Wenge Finish",
      brand: "Spacewood",
      baseMrp: 899900,
      image: "https://images.unsplash.com/photo-1558997519-83ea9252edf8?w=400", // wooden wardrobe
      rating: 4.1,
      reviewCount: 7800,
      discount: 20,
    },
    {
      title: "3 Door Large Mirror Wardrobe with Loft Brown",
      brand: "Nilkamal",
      baseMrp: 1499900,
      assured: true,
      image: "https://images.unsplash.com/photo-1595428773801-7b9a81b6c3a5?w=400", // 3 door wardrobe
      rating: 4.2,
      reviewCount: 6400,
      discount: 18,
    },
    {
      title: "Open Closet Wardrobe System Freestanding Garment Rack",
      brand: "IKEA",
      baseMrp: 699900,
      image: "https://images.unsplash.com/photo-1556020685-ae41abfc9365?w=400", // open wardrobe
      rating: 4.3,
      reviewCount: 5100,
      discount: 15,
    },
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
