import { z } from "zod";

export const userSchema = z.object({
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name cannot be empty"),

  username: z
    .string({ required_error: "Username is required" })
    .min(3, "Username must be at least 3 characters long"),

  email: z
    .string({ required_error: "Email is required" })
    .email("Invalid email format"),

  password: z
    .string({ required_error: "Password is required" })
    .min(6, "Password must be at least 6 characters long"),

  roles: z
    .enum(["user", "admin"], {
      required_error: "Role is required",
      invalid_type_error: "Role must be either 'user' or 'admin'",
    })
    .default("user"),
  location: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
});


export const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});


export const productSchema = z.object({
  productName: z
    .string({ required_error: "Product name is required" })
    .min(1, "Product name cannot be empty"),

  price: z
    .number({ required_error: "Price is required" })
    .positive("Price must be a positive number"),

  quantity: z
    .number({ required_error: "Quantity is required" })
    .int("Quantity must be an integer")
    .nonnegative("Quantity cannot be negative"),

  description: z
    .string({ required_error: "Description is required" })
    .min(1, "Description cannot be empty"),
});


export const warehouseSchemaValidation = z.object({
  location: z.object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
  }),
  capacity: z.number({ required_error: "Capacity is required" }),
  wareHouseName: z
    .string({ required_error: "Warehouse name is required" })
    .min(1, "Warehouse name cannot be empty"),
});


export const ProdcutSchema=z.object({
  productName: z
    .string({ required_error: "Product name is required" })
    .min(1, "Product name cannot be empty"),

  price: z
    .number({ required_error: "Price is required" })
    .positive("Price must be a positive number"),

  quantity: z
    .number({ required_error: "Quantity is required" })
    .int("Quantity must be an integer")
    .nonnegative("Quantity cannot be negative"),
    
  description: z
    .string({ required_error: "Description is required" })
    .min(1, "Description cannot be empty"),
  warehouseId: z
    .string({ required_error: "Warehouse ID is required" })
    .min(1, "Warehouse ID cannot be empty"),
})