import { FakeWallet, Wallet } from 'src/app/modules/swaps/shared-swaps/models/wallet/wallet';


export class NativeSendTxOf {
  constructor(private _wallet: Wallet, private _to: string, private _amount: number) {}
}


fdescribe('NativeSendTxOf', () => {
  let transaction: NativeSendTxOf;

  beforeEach(() => {
    transaction = new NativeSendTxOf(new FakeWallet(), '', 1);
  });

  it('new', () => {
    expect(transaction).toBeTruthy();
  });

  it('value', () => {
    expect(transaction.value()).toBeTruthy();
  });
});
