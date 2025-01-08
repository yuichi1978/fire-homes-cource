import { PropertyStatus } from "@/types/propertyStatus";

export type PropertyProps = {
  id: string;
  address1: string;
  address2?: string;
  city: string;
  postcode: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  description: string;
  status: PropertyStatus;
  images?: string[];
};
