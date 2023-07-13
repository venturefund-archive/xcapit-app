import { RawLender } from './raw-lender.type';

export interface Lender {
  firstStepUrl(): string;
  json(): RawLender;
  logo(): string;
  url(): string;
  depositAddress(): string;
  minWarrantyAmount(): string;
}
