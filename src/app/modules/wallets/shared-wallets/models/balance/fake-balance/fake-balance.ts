
export class FakeBalance {
  constructor(private readonly valueReturn: number = 0) {}

  public value(): Promise<number> {
    return Promise.resolve(this.valueReturn);
  }
}

