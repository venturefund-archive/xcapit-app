import { FiatRampProvider } from "./fiat-ramp-provider.interface";

export interface UserKycKriptonData {
  firstName: string;
  lastName: string;
  birthday: string;
  nationality: FiatRampProvider;
  document: string;
  document_number: string;
  gender: any;
  marital_status: any;
  country_code: any;
  phone_number: string;
  street: string;
  number: string;
  floor?: string;
  apartment?: string;
  city: string;
  zipCode: string;
  politically_exposed: boolean;
}
