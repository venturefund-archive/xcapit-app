import { Balance } from '../balance.interface';

export class FakeBalance implements Balance {
  constructor(private readonly valueReturn: number = 0) {}

  public value(): Promise<number> {
    return Promise.resolve(this.valueReturn);
  }
}

