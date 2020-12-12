import { Schema } from 'joi';

export const validateSchema = <T>(schema: Schema, toValidate: T): T => {
  const { value, error } = schema.validate(toValidate);
  if (error) {
    throw new Error(`validation error: ${JSON.stringify(error)}`);
  }
  return value;
};
