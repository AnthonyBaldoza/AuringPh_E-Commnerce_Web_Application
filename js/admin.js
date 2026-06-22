/* ============================================
   admin.js — Shared Admin Panel Logic
   Frontend Only (LocalStorage) — same approach
   as the rest of the AuringPh prototype.
   ============================================ */

// ── Storage Keys ──
const ADMIN_AUTH_KEY = "auringph_admin_logged_in";
const ADMIN_INFO_KEY = "auringph_admin_info";
const ADMIN_PRODUCTS_KEY = "auringph_admin_products";
const ADMIN_ORDERS_KEY = "auringph_admin_orders";
const ADMIN_USERS_KEY = "auringph_admin_users";

// ── Hardcoded admin credentials (student project / prototype) ──
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

/* ============================================
   SAMPLE / SEED DATA
============================================ */

const SEED_PRODUCTS = [
  // Merged from Shirts, Shoes, Pants, and Others category pages — 90 total
  {
    id: "p1",
    name: "Classic White Tee",
    category: "Shirts",
    brand: "Nike",
    price: 599,
    stock: 43,
    image: "../images/products/shirts/classic-tee.jpg",
  },
  {
    id: "p2",
    name: "Black Essentials Shirt",
    category: "Shirts",
    brand: "Essentials",
    price: 899,
    stock: 10,
    image: "../images/products/shirts/essentials-tee.jpg",
  },
  {
    id: "p3",
    name: "Carhartt Work Shirt",
    category: "Shirts",
    brand: "Carhartt",
    price: 1299,
    stock: 4,
    image: "../images/products/shirts/carhartt-tee.jpg",
  },
  {
    id: "p4",
    name: "Adidas Performance Tee",
    category: "Shirts",
    brand: "Adidas",
    price: 799,
    stock: 50,
    image: "../images/products/shirts/adidas-tee.jpg",
  },
  {
    id: "p5",
    name: "Lacoste Polo Shirt",
    category: "Shirts",
    brand: "Lacoste",
    price: 1599,
    stock: 20,
    image: "../images/products/shirts/lacoste-tee.jpg",
  },
  {
    id: "p6",
    name: "Guess Designer Tee",
    category: "Shirts",
    brand: "Guess",
    price: 1099,
    stock: 18,
    image: "../images/products/shirts/guess-tee.jpg",
  },
  {
    id: "p7",
    name: "Nike Kids Tee",
    category: "Shirts",
    brand: "Nike",
    price: 449,
    stock: 17,
    image: "../images/products/shirts/nike-kids-tee.jpg",
  },
  {
    id: "p8",
    name: "Oversized Polo",
    category: "Shirts",
    brand: "Other",
    price: 699,
    stock: 11,
    image: "../images/products/shirts/oversized-polo.jpg",
  },
  {
    id: "p9",
    name: "Nike Dri-FIT Training Shirt",
    category: "Shirts",
    brand: "Nike",
    price: 849,
    stock: 50,
    image: "../images/products/shirts/nike-drifit.jpg",
  },
  {
    id: "p10",
    name: "Carhartt Henley Shirt",
    category: "Shirts",
    brand: "Carhartt",
    price: 1150,
    stock: 9,
    image: "../images/products/shirts/carhartt-henley.jpg",
  },
  {
    id: "p11",
    name: "Adidas Trefoil Tee",
    category: "Shirts",
    brand: "Adidas",
    price: 750,
    stock: 46,
    image: "../images/products/shirts/adidas-trefoil.jpg",
  },
  {
    id: "p12",
    name: "Lacoste Slim Fit Polo",
    category: "Shirts",
    brand: "Lacoste",
    price: 1750,
    stock: 50,
    image: "../images/products/shirts/lacoste-slim.jpg",
  },
  {
    id: "p13",
    name: "Essentials Relaxed Tee",
    category: "Shirts",
    brand: "Essentials",
    price: 780,
    stock: 60,
    image: "../images/products/shirts/essentials-relaxed.jpg",
  },
  {
    id: "p14",
    name: "Guess Logo Polo",
    category: "Shirts",
    brand: "Guess",
    price: 1250,
    stock: 37,
    image: "../images/products/shirts/guess-polo.jpg",
  },
  {
    id: "p15",
    name: "Nike Air Graphic Tee",
    category: "Shirts",
    brand: "Nike",
    price: 699,
    stock: 8,
    image: "../images/products/shirts/nike-air-tee.jpg",
  },
  {
    id: "p16",
    name: "Carhartt Pocket T-Shirt",
    category: "Shirts",
    brand: "Carhartt",
    price: 950,
    stock: 40,
    image: "../images/products/shirts/carhartt-pocket.jpg",
  },
  {
    id: "p17",
    name: "Adidas Aeroready Shirt",
    category: "Shirts",
    brand: "Adidas",
    price: 880,
    stock: 30,
    image: "../images/products/shirts/adidas-aeroready.jpg",
  },
  {
    id: "p18",
    name: "Lacoste Heritage Polo",
    category: "Shirts",
    brand: "Lacoste",
    price: 1899,
    stock: 5,
    image: "../images/products/shirts/lacoste-heritage.jpg",
  },
  {
    id: "p19",
    name: "Nike Air Force 1 '07 White",
    category: "Shoes",
    brand: "Nike",
    price: 4995,
    stock: 4,
    image: "../images/products/shoes/nike-air-force-1.jpg",
  },
  {
    id: "p20",
    name: "Adidas Samba OG White Gum",
    category: "Shoes",
    brand: "Adidas",
    price: 3799,
    stock: 8,
    image: "../images/products/shoes/adidas-samba-og.jpg",
  },
  {
    id: "p21",
    name: "New Balance 574 Core Grey",
    category: "Shoes",
    brand: "New Balance",
    price: 4299,
    stock: 16,
    image: "../images/products/shoes/new-balance-574.jpg",
  },
  {
    id: "p22",
    name: "Vans Old Skool Black/White",
    category: "Shoes",
    brand: "Vans",
    price: 2499,
    stock: 17,
    image: "../images/products/shoes/vans-old-skool.jpg",
  },
  {
    id: "p23",
    name: "Converse Chuck Taylor All Star Hi",
    category: "Shoes",
    brand: "Converse",
    price: 2799,
    stock: 35,
    image: "../images/products/shoes/converse-chuck-taylor.jpg",
  },
  {
    id: "p24",
    name: "Puma Suede Classic XXI Black",
    category: "Shoes",
    brand: "Puma",
    price: 3499,
    stock: 41,
    image: "../images/products/shoes/puma-suede-classic.jpg",
  },
  {
    id: "p25",
    name: "Nike Air Max 270 Black",
    category: "Shoes",
    brand: "Nike",
    price: 6995,
    stock: 4,
    image: "../images/products/shoes/nike-air-max-270.jpg",
  },
  {
    id: "p26",
    name: "Adidas Ultraboost 22 White",
    category: "Shoes",
    brand: "Adidas",
    price: 7499,
    stock: 38,
    image: "../images/products/shoes/adidas-ultraboost-22.jpg",
  },
  {
    id: "p27",
    name: "New Balance 990v5 Grey",
    category: "Shoes",
    brand: "New Balance",
    price: 8999,
    stock: 15,
    image: "../images/products/shoes/new-balance-990v5.jpg",
  },
  {
    id: "p28",
    name: "Vans Slip-On Checkerboard",
    category: "Shoes",
    brand: "Vans",
    price: 1999,
    stock: 48,
    image: "../images/products/shoes/vans-slip-on.jpg",
  },
  {
    id: "p29",
    name: "Converse Run Star Hike Hi White",
    category: "Shoes",
    brand: "Converse",
    price: 4299,
    stock: 44,
    image: "../images/products/shoes/converse-run-star.jpg",
  },
  {
    id: "p30",
    name: "Puma RS-X Bold Multicolor",
    category: "Shoes",
    brand: "Puma",
    price: 4599,
    stock: 47,
    image: "../images/products/shoes/puma-rs-x.jpg",
  },
  {
    id: "p31",
    name: "Nike Dunk Low Retro White/Black",
    category: "Shoes",
    brand: "Nike",
    price: 5499,
    stock: 37,
    image: "../images/products/shoes/nike-dunk-low.jpg",
  },
  {
    id: "p32",
    name: "Adidas Gazelle Indoor Green",
    category: "Shoes",
    brand: "Adidas",
    price: 3999,
    stock: 29,
    image: "../images/products/shoes/adidas-gazelle.jpg",
  },
  {
    id: "p33",
    name: "New Balance 327 Beige/Brown",
    category: "Shoes",
    brand: "New Balance",
    price: 4799,
    stock: 17,
    image: "../images/products/shoes/new-balance-327.jpg",
  },
  {
    id: "p34",
    name: "Vans Era Navy Canvas",
    category: "Shoes",
    brand: "Vans",
    price: 2199,
    stock: 31,
    image: "../images/products/shoes/vans-era.jpg",
  },
  {
    id: "p35",
    name: "Converse One Star Platform Ox",
    category: "Shoes",
    brand: "Converse",
    price: 3499,
    stock: 40,
    image: "../images/products/shoes/converse-one-star.jpg",
  },
  {
    id: "p36",
    name: "Puma Clyde Leather White",
    category: "Shoes",
    brand: "Puma",
    price: 3299,
    stock: 20,
    image: "../images/products/shoes/puma-clyde.jpg",
  },
  {
    id: "p37",
    name: "Nike Cortez White/Red",
    category: "Shoes",
    brand: "Nike",
    price: 3799,
    stock: 54,
    image: "../images/products/shoes/nike-cortez.jpg",
  },
  {
    id: "p38",
    name: "Adidas Forum Low White/Blue",
    category: "Shoes",
    brand: "Adidas",
    price: 4299,
    stock: 58,
    image: "../images/products/shoes/adidas-forum-low.jpg",
  },
  {
    id: "p39",
    name: "New Balance 550 White/Green",
    category: "Shoes",
    brand: "New Balance",
    price: 5299,
    stock: 3,
    image: "../images/products/shoes/new-balance-550.jpg",
  },
  {
    id: "p40",
    name: "Vans Authentic Lo Pro Black",
    category: "Shoes",
    brand: "Vans",
    price: 1799,
    stock: 51,
    image: "../images/products/shoes/vans-authentic.jpg",
  },
  {
    id: "p41",
    name: "Converse Chuck 70 Hi Parchment",
    category: "Shoes",
    brand: "Converse",
    price: 3999,
    stock: 54,
    image: "../images/products/shoes/converse-chuck-70.jpg",
  },
  {
    id: "p42",
    name: "Puma Suede XL Beige/Gum",
    category: "Shoes",
    brand: "Puma",
    price: 4199,
    stock: 13,
    image: "../images/products/shoes/puma-suede-xl.jpg",
  },
  {
    id: "p43",
    name: "Baggy Cargo Jeans",
    category: "Pants",
    brand: "Bershka",
    price: 650,
    stock: 47,
    image: "../images/products/pants/baggy-cargo-jeans.jpg",
  },
  {
    id: "p44",
    name: "Levi's Vintage Clothing 501 XX Denim",
    category: "Pants",
    brand: "Levi's",
    price: 650,
    stock: 30,
    image: "../images/products/pants/levis-501.jpg",
  },
  {
    id: "p45",
    name: "Veronica Trousers Camel Wide-Leg",
    category: "Pants",
    brand: "A.P.C.",
    price: 450,
    stock: 24,
    image: "../images/products/pants/veronica-trousers.jpg",
  },
  {
    id: "p46",
    name: "LEE Men's 101+ Denim Pants Austin Fit",
    category: "Pants",
    brand: "LEE",
    price: 500,
    stock: 20,
    image: "../images/products/pants/lee-101.jpg",
  },
  {
    id: "p47",
    name: "Bershka Straight-Fit Wide-Leg Trousers",
    category: "Pants",
    brand: "Bershka",
    price: 550,
    stock: 12,
    image: "../images/products/pants/bershka-wideleg.jpg",
  },
  {
    id: "p48",
    name: "A.P.C. Petit New Standard Jeans",
    category: "Pants",
    brand: "A.P.C.",
    price: 750,
    stock: 16,
    image: "../images/products/pants/apc-petit-new-standard.jpg",
  },
  {
    id: "p49",
    name: "Levi's Wedgie Icon Fit Jeans",
    category: "Pants",
    brand: "Levi's",
    price: 700,
    stock: 51,
    image: "../images/products/pants/levis-wedgie.jpg",
  },
  {
    id: "p50",
    name: "Bershka Jogger Pants",
    category: "Pants",
    brand: "Bershka",
    price: 420,
    stock: 24,
    image: "../images/products/pants/bershka-jogger.jpg",
  },
  {
    id: "p51",
    name: "A.P.C. Jean de Travail",
    category: "Pants",
    brand: "A.P.C.",
    price: 800,
    stock: 9,
    image: "../images/products/pants/apc-jean-de-travail.jpg",
  },
  {
    id: "p52",
    name: "LEE Slim Fit Chino",
    category: "Pants",
    brand: "LEE",
    price: 480,
    stock: 8,
    image: "../images/products/pants/lee-slim.jpg",
  },
  {
    id: "p53",
    name: "Bershka Check Tailored Trousers",
    category: "Pants",
    brand: "Bershka",
    price: 580,
    stock: 27,
    image: "../images/products/pants/bershka-check-trousers.jpg",
  },
  {
    id: "p54",
    name: "Levi's 512 Slim Taper Jeans",
    category: "Pants",
    brand: "Levi's",
    price: 620,
    stock: 9,
    image: "../images/products/pants/levis-512.jpg",
  },
  {
    id: "p55",
    name: "A.P.C. Martin Jeans",
    category: "Pants",
    brand: "A.P.C.",
    price: 760,
    stock: 25,
    image: "../images/products/pants/apc-martin.jpg",
  },
  {
    id: "p56",
    name: "LEE Rider Slim Jeans",
    category: "Pants",
    brand: "LEE",
    price: 520,
    stock: 57,
    image: "../images/products/pants/lee-rider.jpg",
  },
  {
    id: "p57",
    name: "Bershka Linen Wide-Leg Pants",
    category: "Pants",
    brand: "Bershka",
    price: 490,
    stock: 25,
    image: "../images/products/pants/bershka-linen.jpg",
  },
  {
    id: "p58",
    name: "Levi's Ribcage Straight Ankle Jeans",
    category: "Pants",
    brand: "Levi's",
    price: 680,
    stock: 41,
    image: "../images/products/pants/levis-ribcage.jpg",
  },
  {
    id: "p59",
    name: "A.P.C. New Cure Jeans",
    category: "Pants",
    brand: "A.P.C.",
    price: 820,
    stock: 19,
    image: "../images/products/pants/apc-new-cure.jpg",
  },
  {
    id: "p60",
    name: "LEE Brooklyn Straight Fit",
    category: "Pants",
    brand: "LEE",
    price: 510,
    stock: 54,
    image: "../images/products/pants/lee-brooklyn.jpg",
  },
  {
    id: "p61",
    name: "Bershka Paperbag Waist Trousers",
    category: "Pants",
    brand: "Bershka",
    price: 460,
    stock: 5,
    image: "../images/products/pants/bershka-paperbag.jpg",
  },
  {
    id: "p62",
    name: "Levi's 724 High Rise Straight Jeans",
    category: "Pants",
    brand: "Levi's",
    price: 710,
    stock: 49,
    image: "../images/products/pants/levis-724.jpg",
  },
  {
    id: "p63",
    name: "A.P.C. Sailor Trousers",
    category: "Pants",
    brand: "A.P.C.",
    price: 870,
    stock: 32,
    image: "../images/products/pants/apc-sailor.jpg",
  },
  {
    id: "p64",
    name: "LEE Straight Fit Jeans",
    category: "Pants",
    brand: "LEE",
    price: 530,
    stock: 37,
    image: "../images/products/pants/lee-straight.jpg",
  },
  {
    id: "p65",
    name: "Bershka Velvet Wide-Leg Trousers",
    category: "Pants",
    brand: "Bershka",
    price: 610,
    stock: 10,
    image: "../images/products/pants/bershka-velvet.jpg",
  },
  {
    id: "p66",
    name: "Levi's Wedgie Straight Jeans",
    category: "Pants",
    brand: "Levi's",
    price: 690,
    stock: 27,
    image: "../images/products/pants/levis-wedgie-straight.jpg",
  },
  {
    id: "p67",
    name: "Nike Heritage Eugene Backpack Black",
    category: "Others",
    brand: "Nike",
    price: 2495,
    stock: 8,
    image: "../images/products/others/nike-heritage-bag.jpg",
  },
  {
    id: "p68",
    name: "Vans Ward Cross Body Bag Black",
    category: "Others",
    brand: "Vans",
    price: 1299,
    stock: 38,
    image: "../images/products/others/vans-ward-bag.jpg",
  },
  {
    id: "p69",
    name: "Adidas Classic Trefoil Backpack",
    category: "Others",
    brand: "Adidas",
    price: 1899,
    stock: 21,
    image: "../images/products/others/adidas-backpack.jpg",
  },
  {
    id: "p70",
    name: "Nike Brasilia 9.5 Training Duffel",
    category: "Others",
    brand: "Nike",
    price: 2199,
    stock: 56,
    image: "../images/products/others/nike-duffel.jpg",
  },
  {
    id: "p71",
    name: "Carhartt Foundry Series Backpack",
    category: "Others",
    brand: "Carhartt",
    price: 3299,
    stock: 43,
    image: "../images/products/others/carhartt-backpack.jpg",
  },
  {
    id: "p72",
    name: "Vans Bumper Tote Bag",
    category: "Others",
    brand: "Vans",
    price: 849,
    stock: 42,
    image: "../images/products/others/vans-tote.jpg",
  },
  {
    id: "p73",
    name: "New Era 9FORTY Adjustable Cap Black",
    category: "Others",
    brand: "New Era",
    price: 899,
    stock: 59,
    image: "../images/products/others/new-era-cap.jpg",
  },
  {
    id: "p74",
    name: "Carhartt Acrylic Watch Hat Beanie Grey",
    category: "Others",
    brand: "Carhartt",
    price: 749,
    stock: 58,
    image: "../images/products/others/carhartt-beanie.jpg",
  },
  {
    id: "p75",
    name: "Nike Swoosh Heritage 86 Cap",
    category: "Others",
    brand: "Nike",
    price: 999,
    stock: 26,
    image: "../images/products/others/nike-cap.jpg",
  },
  {
    id: "p76",
    name: "Adidas Trefoil Baseball Cap",
    category: "Others",
    brand: "Adidas",
    price: 850,
    stock: 39,
    image: "../images/products/others/adidas-cap.jpg",
  },
  {
    id: "p77",
    name: "New Era 59FIFTY Fitted Cap",
    category: "Others",
    brand: "New Era",
    price: 1499,
    stock: 15,
    image: "../images/products/others/new-era-59fifty.jpg",
  },
  {
    id: "p78",
    name: "Vans Jockey Cap Black",
    category: "Others",
    brand: "Vans",
    price: 699,
    stock: 48,
    image: "../images/products/others/vans-cap.jpg",
  },
  {
    id: "p79",
    name: "Adidas Windbreaker Track Jacket Navy",
    category: "Others",
    brand: "Adidas",
    price: 3299,
    stock: 7,
    image: "../images/products/others/adidas-windbreaker.jpg",
  },
  {
    id: "p80",
    name: "Nike Sportswear Windrunner Jacket",
    category: "Others",
    brand: "Nike",
    price: 4599,
    stock: 5,
    image: "../images/products/others/nike-windrunner.jpg",
  },
  {
    id: "p81",
    name: "Carhartt Duck Detroit Jacket Brown",
    category: "Others",
    brand: "Carhartt",
    price: 5999,
    stock: 45,
    image: "../images/products/others/carhartt-jacket.jpg",
  },
  {
    id: "p82",
    name: "Adidas SST Track Jacket Black",
    category: "Others",
    brand: "Adidas",
    price: 2899,
    stock: 17,
    image: "../images/products/others/adidas-sst-jacket.jpg",
  },
  {
    id: "p83",
    name: "Nike Reversible Belt Adjustable",
    category: "Others",
    brand: "Nike",
    price: 649,
    stock: 52,
    image: "../images/products/others/nike-belt.jpg",
  },
  {
    id: "p84",
    name: "Adidas Sport Watch Water Resistant",
    category: "Others",
    brand: "Adidas",
    price: 1499,
    stock: 21,
    image: "../images/products/others/adidas-watch.jpg",
  },
  {
    id: "p85",
    name: "Vans Sunglasses Squared Off Black",
    category: "Others",
    brand: "Vans",
    price: 999,
    stock: 8,
    image: "../images/products/others/vans-shades.jpg",
  },
  {
    id: "p86",
    name: "Carhartt Watch Hat Knit Beanie Black",
    category: "Others",
    brand: "Carhartt",
    price: 599,
    stock: 57,
    image: "../images/products/others/carhartt-knit.jpg",
  },
  {
    id: "p87",
    name: "Nike Everyday Cushioned Crew Socks 3pk",
    category: "Others",
    brand: "Nike",
    price: 349,
    stock: 17,
    image: "../images/products/others/nike-crew-socks.jpg",
  },
  {
    id: "p88",
    name: "Adidas Crew Socks 3 Pairs White",
    category: "Others",
    brand: "Adidas",
    price: 299,
    stock: 58,
    image: "../images/products/others/adidas-socks.jpg",
  },
  {
    id: "p89",
    name: "Vans Classic Crew Socks 3 Pack",
    category: "Others",
    brand: "Vans",
    price: 399,
    stock: 9,
    image: "../images/products/others/vans-socks.jpg",
  },
  {
    id: "p90",
    name: "Carhartt All Season Crew Socks",
    category: "Others",
    brand: "Carhartt",
    price: 449,
    stock: 27,
    image: "../images/products/others/carhartt-socks.jpg",
  },
];

const SEED_USERS = [
  {
    id: "u1",
    name: "Andrea Bautista",
    email: "andrea.bautista@gmail.com",
    phone: "0917 123 4567",
    joined: "2026-01-14",
    orders: 5,
    status: "active",
  },
  {
    id: "u2",
    name: "Mark Villanueva",
    email: "mark.villa@gmail.com",
    phone: "0928 556 9821",
    joined: "2026-02-02",
    orders: 2,
    status: "active",
  },
  {
    id: "u3",
    name: "Kyla Santos",
    email: "kylasantos21@gmail.com",
    phone: "0915 309 7744",
    joined: "2026-02-20",
    orders: 8,
    status: "active",
  },
  {
    id: "u4",
    name: "Joshua Ramos",
    email: "joshua.ramos@yahoo.com",
    phone: "0939 882 1190",
    joined: "2026-03-05",
    orders: 1,
    status: "blocked",
  },
  {
    id: "u5",
    name: "Patricia Cruz",
    email: "patty.cruz@gmail.com",
    phone: "0917 660 2345",
    joined: "2026-03-18",
    orders: 4,
    status: "active",
  },
  {
    id: "u6",
    name: "Renz Aguilar",
    email: "renz.aguilar@gmail.com",
    phone: "0926 410 8893",
    joined: "2026-04-01",
    orders: 0,
    status: "active",
  },
  {
    id: "u7",
    name: "Bea Fernandez",
    email: "bea.fernandez@outlook.com",
    phone: "0918 774 0021",
    joined: "2026-04-22",
    orders: 3,
    status: "active",
  },
];

function seedOrdersFromProducts(products) {
  const customers = [
    { name: "Andrea Bautista", email: "andrea.bautista@gmail.com" },
    { name: "Mark Villanueva", email: "mark.villa@gmail.com" },
    { name: "Kyla Santos", email: "kylasantos21@gmail.com" },
    { name: "Joshua Ramos", email: "joshua.ramos@yahoo.com" },
    { name: "Patricia Cruz", email: "patty.cruz@gmail.com" },
    { name: "Bea Fernandez", email: "bea.fernandez@outlook.com" },
  ];

  return [
    {
      id: "AUR-2026-101",
      customer: customers[0],
      items: [{ name: "Nike Air Force 1 '07", qty: 1, price: 4995 }],
      total: 4995,
      status: "pending",
      date: "2026-06-15",
    },
    {
      id: "AUR-2026-100",
      customer: customers[1],
      items: [
        { name: "Straight Cut Jeans", qty: 1, price: 1299 },
        { name: "Canvas Cap", qty: 1, price: 350 },
      ],
      total: 1649,
      status: "processing",
      date: "2026-06-14",
    },
    {
      id: "AUR-2026-099",
      customer: customers[2],
      items: [{ name: "Vans Old Skool", qty: 1, price: 2499 }],
      total: 2499,
      status: "completed",
      date: "2026-06-12",
    },
    {
      id: "AUR-2026-098",
      customer: customers[3],
      items: [{ name: "Classic White Tee", qty: 2, price: 599 }],
      total: 1198,
      status: "pending",
      date: "2026-06-12",
    },
    {
      id: "AUR-2026-097",
      customer: customers[4],
      items: [
        { name: "New Era 9FORTY Cap", qty: 1, price: 1200 },
        { name: "Oversized Polo Brown", qty: 1, price: 699 },
      ],
      total: 1899,
      status: "processing",
      date: "2026-06-10",
    },
    {
      id: "AUR-2026-096",
      customer: customers[5],
      items: [{ name: "Adidas Samba OG", qty: 1, price: 5495 }],
      total: 5495,
      status: "completed",
      date: "2026-06-08",
    },
    {
      id: "AUR-2026-095",
      customer: customers[0],
      items: [{ name: "Converse Chuck Taylor", qty: 1, price: 2899 }],
      total: 2899,
      status: "completed",
      date: "2026-06-05",
    },
    {
      id: "AUR-2026-094",
      customer: customers[2],
      items: [{ name: "Carhartt Work Shirt", qty: 1, price: 1299 }],
      total: 1299,
      status: "cancelled",
      date: "2026-06-03",
    },
    {
      id: "AUR-2026-093",
      customer: customers[1],
      items: [
        { name: "Classic White Tee", qty: 1, price: 599 },
        { name: "Canvas Cap", qty: 1, price: 350 },
      ],
      total: 949,
      status: "completed",
      date: "2026-05-30",
    },
    {
      id: "AUR-2026-092",
      customer: customers[4],
      items: [{ name: "Vans Old Skool", qty: 1, price: 2499 }],
      total: 2499,
      status: "completed",
      date: "2026-05-26",
    },
  ];
}

function seedAdminData() {
  const existingProducts = JSON.parse(
    localStorage.getItem(ADMIN_PRODUCTS_KEY) || "null",
  );

  if (!existingProducts) {
    // First time ever — seed fresh.
    localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(SEED_PRODUCTS));
  } else if (existingProducts.length < SEED_PRODUCTS.length) {
    // Browser has an older/smaller cached catalog (e.g. the original
    // 10-item demo list) — auto-upgrade to the full merged catalog
    // so admins don't need to manually clear localStorage.
    localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(SEED_PRODUCTS));
  }

  if (!localStorage.getItem(ADMIN_USERS_KEY)) {
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(SEED_USERS));
  }
  if (!localStorage.getItem(ADMIN_ORDERS_KEY)) {
    const products =
      JSON.parse(localStorage.getItem(ADMIN_PRODUCTS_KEY)) || SEED_PRODUCTS;
    localStorage.setItem(
      ADMIN_ORDERS_KEY,
      JSON.stringify(seedOrdersFromProducts(products)),
    );
  }
}

/* ============================================
   AUTH GUARD
   ✅ FIX: Redirects to "../login.html" because
   all admin pages are inside /pages/ folder.
============================================ */
function requireAdminAuth() {
  if (localStorage.getItem(ADMIN_AUTH_KEY) !== "true") {
    window.location.href = "../login.html";
  }
}

function getAdminInfo() {
  return (
    JSON.parse(localStorage.getItem(ADMIN_INFO_KEY)) || {
      username: "admin",
      name: "Admin",
    }
  );
}

function adminLogout() {
  localStorage.removeItem(ADMIN_AUTH_KEY);
  localStorage.removeItem(ADMIN_INFO_KEY);
  // ✅ FIX: Same here — go back to root login.html
  window.location.href = "../login.html";
}

/* ============================================
   SHARED HELPERS
============================================ */
function pesos(n) {
  return "₱" + Number(n || 0).toLocaleString("en-PH");
}

function showAdminToast(msg, duration = 2200) {
  const toast = document.getElementById("adminToast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), duration);
}

function getInitialsFromName(name) {
  if (!name) return "A";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name[0].toUpperCase();
}

/* ============================================
   SIDEBAR — mobile toggle + active link highlight
============================================ */
function initAdminSidebar() {
  const sidebar = document.getElementById("adminSidebar");
  const backdrop = document.getElementById("sidebarBackdrop");
  const toggle = document.getElementById("sidebarToggle");

  if (toggle && sidebar && backdrop) {
    toggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      backdrop.classList.toggle("show");
    });
    backdrop.addEventListener("click", () => {
      sidebar.classList.remove("open");
      backdrop.classList.remove("show");
    });
  }

  // Highlight current page in nav
  const current = window.location.pathname.split("/").pop();
  document.querySelectorAll(".admin-nav-link").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current) link.classList.add("active");
  });

  // Fill in admin "who am I" badge if present
  const info = getAdminInfo();
  const nameEl = document.getElementById("adminWhoamiName");
  const avatarEl = document.getElementById("adminWhoamiAvatar");
  if (nameEl) nameEl.textContent = info.name || info.username || "Admin";
  if (avatarEl)
    avatarEl.textContent = getInitialsFromName(
      info.name || info.username || "Admin",
    );

  // Logout button(s)
  document.querySelectorAll("[data-admin-logout]").forEach((btn) => {
    btn.addEventListener("click", adminLogout);
  });
}

document.addEventListener("DOMContentLoaded", initAdminSidebar);
