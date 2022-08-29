import { RawToken } from '../../../../swaps/shared-swaps/models/token-repo/token-repo';
import { rawTransfer } from '../covalent-repo/default/covalent-transfers.fixture';
import { RawTransfer } from '../transfers/transfers.spec';

export class Transfer {
  constructor(private readonly _aRawTransfer: RawTransfer, private readonly aToken: RawToken) {}

  public fee() {
    return true;
  }
}

fdescribe('Transfer', () => {
  let aToken: jasmine.SpyObj<RawToken>;
  it('new', () => {
    expect(new Transfer(rawTransfer, rawMATICData )).toBeTruthy();
  });
  
  it('fee', () => {
    expect(new Transfer().fee()).toBeTruthy();
  });
});
