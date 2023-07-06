import { RawLender } from './raw-lender.type';

export interface Lender {
  firstStepUrl(): string;
  logo(): string;
  url(): string;
  json(): RawLender;
}
