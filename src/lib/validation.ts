import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string().min(1, "Name required").max(200),
  price: z.number().int("Price must be integer").positive("Price must be positive"),
  category: z.string().min(1),
  description: z.string().min(10).max(2000),
  fabric: z.string().min(1).max(100),
  fit: z.string().min(1).max(100),
  occasion: z.string().min(1).max(100),
  sizes: z.array(z.string()).min(1, "At least one size required"),
  colors: z.array(z.string()).min(1, "At least one color required"),
  stock: z.number().int().min(0).default(100),
  isBestseller: z.boolean().default(false),
  imageUrl: z.string().url("Invalid image URL"),
  images: z.array(z.string().url()).default([]),
  rating: z.number().min(0).max(5).default(0),
  reviews: z.number().int().min(0).default(0),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const OrderItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  price: z.number().int().positive(),
  imageUrl: z.string(),
  quantity: z.number().int().min(1),
  size: z.string().min(1),
  color: z.string().min(1),
});

export const OrderDataSchema = z.object({
  customerName: z.string().min(2).max(100),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(10).max(15),
  shippingAddress: z.object({
    address: z.string().min(5),
    city: z.string().min(2),
    pincode: z.string().min(6).max(6),
    state: z.string().min(2),
  }),
  items: z.array(OrderItemSchema).min(1),
  subtotal: z.number().int().positive(),
  discount: z.number().int().min(0).default(0),
  couponCode: z.string().nullable().optional(),
  total: z.number().int().positive(),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.enum(["confirmed", "processing", "shipped", "delivered", "cancelled"]),
});
