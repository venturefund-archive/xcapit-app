import { FiatRampProvider } from "./fiat-ramp-provider.interface";

export interface UserKycKriptonData {
  first_name: string;
  last_name: string;
  birthday: string;
  nationality: FiatRampProvider;
  document_type: string;
  document_number: string;
  gender: any;
  marital_status: any;
  country_code: any;
  telephone_number: string;
  street_address: string;
  street_number: string;
  floor?: string;
  apartment?: string;
  city: string;
  postal_code: string;
  politically_exposed: boolean;
}
