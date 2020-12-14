import { number, object, string } from 'joi';

export const emailSchema = object({ email: string().email().optional() });

export const userSchema = emailSchema.keys({
  password: string().min(6).optional(),
  firstName: string().optional(),
  lastName: string().optional(),
  address: object({
    city: string().required(),
    street: string().required(),
    houseNumber: number().positive().required()
  }).optional()
});

export const userSchemaWithRole = userSchema.keys({ role: string().valid('admin', 'viewer').optional() });
