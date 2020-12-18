export interface Address {
  area: AddressArea;
  city: string;
  street: string;
  houseNumber: number;
}

export enum AddressArea {
  center = 'center',
  north = 'north',
  south = 'south'
}
