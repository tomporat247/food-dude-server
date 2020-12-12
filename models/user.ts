export interface User {
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  location: {
    city: string;
    street: string;
    houseNumber: number;
  };
}
