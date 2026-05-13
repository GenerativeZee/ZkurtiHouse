
export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: 'Daily Wear' | 'Office Wear' | 'Festive Wear';
  description: string;
  sizes: string[];
  colors: string[];
  fabric: string;
  fit: string;
  occasion: string;
  rating: number;
  reviews: number;
  isBestseller?: boolean;
}

export const products: Product[] = [
  {
    id: '1',
    name: 'Minimalist Olive Co-ord Set',
    price: 1450,
    image: '/images/product-1.png',
    category: 'Daily Wear',
    description: 'An elegant olive green co-ord set featuring a straight-cut kurti with delicate white embroidery on the sleeves. Designed for the modern minimalist.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Olive Green', 'Ivory'],
    fabric: 'Fine Cotton',
    fit: 'Straight Cut',
    occasion: 'Daily Wear',
    rating: 4.9,
    reviews: 156,
    isBestseller: true
  },
  {
    id: '2',
    name: 'Cream Silk Straight Kurti',
    price: 1199,
    image: '/images/product-2.png',
    category: 'Office Wear',
    description: 'A sophisticated cream-colored straight-cut kurti with subtle tonal embroidery. Pure elegance for the workplace.',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Cream', 'Beige'],
    fabric: 'Silk Blend',
    fit: 'Straight Cut',
    occasion: 'Office Wear',
    rating: 4.8,
    reviews: 92,
    isBestseller: true
  },
  {
    id: '3',
    name: 'Navy Blue Gold Thread Kurti',
    price: 1499,
    image: '/images/product-3.png',
    category: 'Festive Wear',
    description: 'Rich navy blue cotton kurti with gold thread work. Ideal for festive celebrations and special occasions.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Navy Blue'],
    fabric: 'Cotton Silk',
    fit: 'Straight Cut',
    occasion: 'Festive Wear',
    rating: 4.9,
    reviews: 56,
    isBestseller: false
  },
  {
    id: '4',
    name: 'Ivory Lucknowi Chikan Kurti',
    price: 1100,
    image: '/images/product-4.png',
    category: 'Daily Wear',
    description: 'Classic ivory white Lucknowi chikan kurti. Timeless craftsmanship for a graceful look.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Ivory White'],
    fabric: 'Georgette',
    fit: 'Straight',
    occasion: 'Daily Wear',
    rating: 4.7,
    reviews: 210,
    isBestseller: true
  },
  {
    id: '5',
    name: 'Dusty Rose Mirror Work Kurti',
    price: 950,
    image: '/images/product-5.png',
    category: 'Festive Wear',
    description: 'Dusty rose pink kurti with delicate mirror work and lace details. Shine bright this festive season.',
    sizes: ['M', 'L', 'XL'],
    colors: ['Dusty Rose'],
    fabric: 'Chanderi',
    fit: 'Straight Fit',
    occasion: 'Festive Wear',
    rating: 4.5,
    reviews: 45,
    isBestseller: false
  },
  {
    id: '6',
    name: 'Mustard Yellow Block Print Kurti',
    price: 750,
    image: '/images/product-6.png',
    category: 'Daily Wear',
    description: 'Vibrant mustard yellow cotton kurti with traditional block prints. Comfort meets style.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Mustard Yellow'],
    fabric: '100% Cotton',
    fit: 'Regular Fit',
    occasion: 'Daily Wear',
    rating: 4.4,
    reviews: 132,
    isBestseller: true
  },
  {
    id: '7',
    name: 'Coral Peach Lace Kurti',
    price: 1350,
    image: '/images/product-7.png',
    category: 'Office Wear',
    description: 'Elegant coral peach kurta with delicate lace trim. Perfect for a sophisticated office look.',
    sizes: ['S', 'M', 'L'],
    colors: ['Coral Peach'],
    fabric: 'Linen Blend',
    fit: 'Straight',
    occasion: 'Office Wear',
    rating: 4.7,
    reviews: 67,
    isBestseller: false
  },
  {
    id: '8',
    name: 'Lavender Silver Thread Kurti',
    price: 1250,
    image: '/images/product-8.png',
    category: 'Festive Wear',
    description: 'Beautiful lavender purple A-line kurti with silver thread embroidery. Graceful and charming.',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: ['Lavender'],
    fabric: 'Cotton Silk',
    fit: 'A-Line',
    occasion: 'Festive Wear',
    rating: 4.8,
    reviews: 38,
    isBestseller: false
  }
];

export const categories = [
  {
    name: 'Co-ord Sets',
    image: '/images/hero-banner.png',
    description: 'Minimalist and modern matching sets for a sophisticated look.',
    link: '/shop?category=coord'
  },
  {
    name: 'Daily Wear',
    image: '/images/category-daily.png',
    description: 'Comfortable and stylish kurtis for your everyday grace.',
    link: '/shop?category=daily'
  },
  {
    name: 'Office Wear',
    image: '/images/category-office.png',
    description: 'Professional and elegant designs for the modern woman at work.',
    link: '/shop?category=office'
  },
  {
    name: 'Festive Wear',
    image: '/images/category-festive.png',
    description: 'Celebrate in style with our rich and intricate festive collection.',
    link: '/shop?category=festive'
  }
];

export const testimonials = [
  {
    id: '1',
    name: 'Anjali Sharma',
    comment: 'The quality of the Chikankari kurti is amazing! It feels so premium and the fit is perfect.',
    rating: 5
  },
  {
    id: '2',
    name: 'Priya Verma',
    comment: 'Label Noor has become my go-to for office wear. Elegant and so comfortable for long hours.',
    rating: 5
  },
  {
    id: '3',
    name: 'Sneha Gupta',
    comment: 'I bought a festive kurti and received so many compliments. Can’t believe it’s so affordable!',
    rating: 5
  }
];
