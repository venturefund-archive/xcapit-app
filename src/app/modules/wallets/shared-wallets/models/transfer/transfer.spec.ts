import { RawToken } from '../../../../swaps/shared-swaps/models/token-repo/token-repo';
import { RawTransfer } from '../transfers/transfers.spec';

export class Transfer {
  constructor(private readonly _aRawTransfer: RawTransfer, private readonly aToken: RawToken) {}

  public fee() {
    return true;
  }
}

fdescribe('Transfer', () => {
  // it('new', () => {
  //   expect(new Transfer()).toBeTruthy();
  // });
  //
  // it('fee', () => {
  //   expect(new Transfer().fee()).toBeTruthy();
  // });
});
