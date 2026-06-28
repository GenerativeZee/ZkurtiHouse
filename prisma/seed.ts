import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "Minimalist Olive Co-ord Set",
    price: 1450,
    imageUrl: "/images/product-1.png",
    images: ["/images/product-1.png"],
    category: "Daily Wear",
    description: "An elegant olive green co-ord set featuring a straight-cut kurti with delicate white embroidery on the sleeves. Designed for the modern minimalist.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Olive Green", "Ivory"],
    fabric: "Fine Cotton",
    fit: "Straight Cut",
    occasion: "Daily Wear",
    rating: 4.9,
    reviews: 156,
    isBestseller: true,
    stock: 50,
  },
  {
    name: "Cream Silk Straight Kurti",
    price: 1199,
    imageUrl: "/images/product-2.png",
    images: ["/images/product-2.png"],
    category: "Office Wear",
    description: "A sophisticated cream-colored straight-cut kurti with subtle tonal embroidery. Pure elegance for the workplace.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Cream", "Beige"],
    fabric: "Silk Blend",
    fit: "Straight Cut",
    occasion: "Office Wear",
    rating: 4.8,
    reviews: 92,
    isBestseller: true,
    stock: 40,
  },
  {
    name: "Navy Blue Gold Thread Kurti",
    price: 1499,
    imageUrl: "/images/product-3.png",
    images: ["/images/product-3.png"],
    category: "Festive Wear",
    description: "Rich navy blue cotton kurti with gold thread work. Ideal for festive celebrations and special occasions.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Navy Blue"],
    fabric: "Cotton Silk",
    fit: "Straight Cut",
    occasion: "Festive Wear",
    rating: 4.9,
    reviews: 56,
    isBestseller: false,
    stock: 30,
  },
  {
    name: "Ivory Lucknowi Chikan Kurti",
    price: 1100,
    imageUrl: "/images/product-4.png",
    images: ["/images/product-4.png"],
    category: "Daily Wear",
    description: "Classic ivory white Lucknowi chikan kurti. Timeless craftsmanship for a graceful look.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Ivory White"],
    fabric: "Georgette",
    fit: "Straight",
    occasion: "Daily Wear",
    rating: 4.7,
    reviews: 210,
    isBestseller: true,
    stock: 60,
  },
  {
    name: "Dusty Rose Mirror Work Kurti",
    price: 950,
    imageUrl: "/images/product-5.png",
    images: ["/images/product-5.png"],
    category: "Festive Wear",
    description: "Dusty rose pink kurti with delicate mirror work and lace details. Shine bright this festive season.",
    sizes: ["M", "L", "XL"],
    colors: ["Dusty Rose"],
    fabric: "Chanderi",
    fit: "Straight Fit",
    occasion: "Festive Wear",
    rating: 4.5,
    reviews: 45,
    isBestseller: false,
    stock: 25,
  },
  {
    name: "Mustard Yellow Block Print Kurti",
    price: 750,
    imageUrl: "/images/product-6.png",
    images: ["/images/product-6.png"],
    category: "Daily Wear",
    description: "Vibrant mustard yellow cotton kurti with traditional block prints. Comfort meets style.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Mustard Yellow"],
    fabric: "100% Cotton",
    fit: "Regular Fit",
    occasion: "Daily Wear",
    rating: 4.4,
    reviews: 132,
    isBestseller: true,
    stock: 80,
  },
  {
    name: "Coral Peach Lace Kurti",
    price: 1350,
    imageUrl: "/images/product-7.png",
    images: ["/images/product-7.png"],
    category: "Office Wear",
    description: "Elegant coral peach kurta with delicate lace trim. Perfect for a sophisticated office look.",
    sizes: ["S", "M", "L"],
    colors: ["Coral Peach"],
    fabric: "Linen Blend",
    fit: "Straight",
    occasion: "Office Wear",
    rating: 4.7,
    reviews: 67,
    isBestseller: false,
    stock: 35,
  },
  {
    name: "Lavender Silver Thread Kurti",
    price: 1250,
    imageUrl: "/images/product-8.png",
    images: ["/images/product-8.png"],
    category: "Festive Wear",
    description: "Beautiful lavender purple A-line kurti with silver thread embroidery. Graceful and charming.",
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Lavender"],
    fabric: "Cotton Silk",
    fit: "A-Line",
    occasion: "Festive Wear",
    rating: 4.8,
    reviews: 38,
    isBestseller: false,
    stock: 20,
  },
];

async function main() {
  console.log("Seeding database...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  for (const product of products) {
    await prisma.product.create({ data: product });
    console.log(`  ✓ ${product.name}`);
  }

  console.log(`\nSeeded ${products.length} products successfully.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
