import { z } from "zod";

export const createValidationSchema = z.object({
    body:z.object(
        {
        
            name: z.string(),
            email: z.string(),
            password: z.string(),
            phone: z.string(),
            role: z.enum(["admin", "user"]),
            address: z.string(),
          
    })
});


export const userSchemaValidations={
    createValidationSchema,
}