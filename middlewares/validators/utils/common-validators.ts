import { number, object, string } from 'joi';

export const emailSchema = object({ email: string().email() });

export const userSchema = emailSchema.keys({
  password: string().min(6),
  firstName: string(),
  lastName: string(),
  address: object({
    city: string().required(),
    street: string().required(),
    houseNumber: number().positive().required()
  })
});

export const userSchemaWithRole = userSchema.keys({ role: string().valid('admin', 'viewer') });
