export class EquivalentTokenOf {
  constructor(private readonly aToken: string, private readonly equivalences: any = { BTC: 'WBTC' }) {}

  public value(): string {
    return this.equivalences.hasOwnProperty(this.aToken) ? this.equivalences[this.aToken] : this.aToken;
  }
}
