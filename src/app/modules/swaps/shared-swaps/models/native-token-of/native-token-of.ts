export class NativeTokenOf {

  constructor(private _aBlockchainTokens: BlockchainTokens) {}

  async value(): Promise<Token> {
    return (await this._aBlockchainTokens.value()).find(token => token.isNative() === true);
  }
}
