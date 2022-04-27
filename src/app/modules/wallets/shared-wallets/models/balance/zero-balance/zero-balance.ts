import { Balance } from '../balance.interface';

export class ZeroBalance implements Balance {
  public value(): Promise<number> {
    return Promise.resolve(0);
  }
}
