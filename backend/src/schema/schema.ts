import z from "zod";

export const employeeSchema = z.object({
    name: z.string().trim().min(1, "Name is required").max(100),
    email: z.string().trim().email("Enter a valid email").max(255),
    role: z.string().trim().min(1, "Role is required").max(100),
});

export const listSchema = z.object({
    search: z.string().trim().default(""),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
});