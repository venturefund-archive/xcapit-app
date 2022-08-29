export class DefaultSwapsUrls {
  private _defaultUrls = new Map<string, string[]>([
    [
      'ERC20',
      [
        'swaps/home/blockchain',
        'ERC20',
        'from-token',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        'to-token',
        '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      ],
    ],
    [
      'MATIC',
      [
        'swaps/home/blockchain',
        'MATIC',
        'from-token',
        '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        'to-token',
        '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
      ],
    ],
    [
      'BSC_BEP20',
      [
        'swaps/home/blockchain',
        'BSC_BEP20',
        'from-token',
        '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
        'to-token',
        '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
      ],
    ],
  ]);

  homeByBlockchain(aBlockchainName: string): string[] {
    return this._defaultUrls.get(aBlockchainName);
  }

  home(): string[] {
    return this._defaultUrls.get('MATIC');
  }
}
