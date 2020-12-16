import { number, object, string } from 'joi';

export const mongoObjectIdValidator = require('joi-objectid')(require('joi'))();

export const emailSchema = object({ email: string().email() });

export const addressSchema = object({
  address: {
    city: string().required(),
    street: string().required(),
    houseNumber: number().positive().required()
  }
});

export const userSchema = emailSchema.concat(addressSchema).keys({
  password: string().min(6),
  firstName: string(),
  lastName: string()
});

export const userSchemaWithRole = userSchema.keys({ role: string().valid('admin', 'viewer') });
