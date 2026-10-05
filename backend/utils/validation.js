import z from "zod";

export const userSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});

export const incidentSchema = z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(["fire", "flood", "accident", "medical", "other"]),
    location: z.object({ lat: z.number(), lng: z.number() }),
});

export const updateIncidentsSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    category: z
        .enum(["fire", "flood", "accident", "medical", "other"])
        .optional(),
    status: z.enum(["open", "in_progress", "closed"]).optional(),
    location: z.object({ lat: z.number(), lng: z.number() }).optional(),
});
