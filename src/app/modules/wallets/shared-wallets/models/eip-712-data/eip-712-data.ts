export class EIP712Data {

  constructor(private _rawData: any) {}

  validFor(aChainId: number | string): boolean {
    return this._parseInt(aChainId) === this.chainId();
  }

  chainId(): number {
    return this._parseInt(this.toJSON().domain.chainId);
  }

  toJSON(): any {
    return JSON.parse(this._rawData);
  }

  private _parseInt(value: number | string): number {
    return parseInt(`${value}`);
  }
}
