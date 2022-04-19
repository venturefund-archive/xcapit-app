import { Coin } from '../../interfaces/coin.interface';

export class AmountOf {
  constructor(private readonly _aWei: string, private readonly _coin: Coin) {}
}

describe('AmountOf', () => {
  let coinSpy: jasmine.SpyObj<Coin>;
  beforeEach(() => {
    coinSpy = jasmine.createSpyObj('Coin', {}, { value: 'USDC', decimals: 6 });
  });

  it('should create', () => {
    expect(new AmountOf('1000000', coinSpy));
  });
});
