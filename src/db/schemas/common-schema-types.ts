export const addressSchemaType = {
  area: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
  houseNumber: {
    type: Number,
    min: 1,
    required: true
  }
};
