import { AmountOf } from 'src/app/modules/swaps/shared-swaps/models/amount-of/amount-of';
import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
import { RawToken } from '../../../../swaps/shared-swaps/models/token-repo/token-repo';
import { rawTransfer } from '../covalent-repo/default/covalent-transfers.fixture';
import { RawTransfer } from '../transfers/transfers.spec';

export class Transfer {
  constructor(private readonly _aRawTransfer: RawTransfer, private readonly _aToken: RawToken) {}

  public fee() {
    return new AmountOf(this._aRawTransfer.gas_spent.toString(), new token this._aToken).times(this._aRawTransfer.gas_price).value();
  }
}

fdescribe('Transfer', () => {
  let transfer: Transfer;
  beforeEach (()=> {
    transfer = new Transfer(rawTransfer, rawMATICData);
  });
  
  it('new', () => {
    expect( transfer).toBeTruthy();
  });
  
  it('fee', () => {
    expect( transfer.fee()).toBeTruthy();
  });
});
