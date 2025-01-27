import { Lender } from '../lender.interface';
import { RawLender } from '../raw-lender.type';

export class NullLender implements Lender {
  infoModalHighlightedHeader(): string {
    throw new Error("Method not implemented.");
  }
  hasCryptoModalDescription(): string {
    throw new Error("Method not implemented.");
  }

  buyOrDepositModalHeader(): string {
    throw new Error("Method not implemented.");
  }

  xscrowAddress(): string {
    throw new Error('Method not implemented.');
  }

  logo(): string {
    throw new Error('Method not implemented.');
  }

  url(): string {
    throw new Error('Method not implemented.');
  }

  depositAddress(): string {
    throw new Error('Method not implemented.');
  }

  minWarrantyAmount(): string {
    throw new Error('Method not implemented.');
  }

  firstStepUrl(): string {
    throw new Error('Method not implemented.');
  }

  token(): string {
    throw new Error('Method not implemented.');
  }

  blockchain(): string {
    throw new Error('Method not implemented.');
  }

  language(): string {
    throw new Error('Method not implemented.')
  }

  json(): RawLender {
    return null;
  }

  onRampProvider(): string {
    return '';
  }
}
