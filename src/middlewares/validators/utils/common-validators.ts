import { boolean, number, object, string } from 'joi';
import { AddressArea } from '../../../types/address';

export const mongoObjectIdValidator = require('joi-objectid')(require('joi'))();

export const emailSchema = object({ email: string().email() });

export const addressSchema = object({
  address: {
    area: string()
      .valid(...Object.keys(AddressArea))
      .required(),
    city: string().required(),
    street: string().required(),
    houseNumber: number().positive().required()
  }
});

export const partialAddressSchema = addressSchema.fork(['address'], field =>
  field.fork(['area', 'city', 'street', 'houseNumber'], innerField => innerField.optional())
);

const basicUserSchema = object({ firstName: string(), lastName: string() });
const roleSchema = object({ role: string().valid('admin', 'viewer') });

export const userSchema = basicUserSchema
  .concat(addressSchema)
  .concat(emailSchema)
  .keys({
    password: string().min(6)
  });

export const userSchemaWithRole = userSchema.concat(roleSchema);

export const userSearchSchema = basicUserSchema.concat(roleSchema).concat(partialAddressSchema).keys({
  email: string(),
  contributor: boolean(),
  currentlyLoggedIn: boolean()
});
