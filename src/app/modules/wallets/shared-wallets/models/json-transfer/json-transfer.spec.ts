import { Transfer } from '../transfer/transfer';
import { rawTransfer } from '../covalent-repo/default/covalent-transfers.fixture';
import { rawMATICTokenData } from '../../../../swaps/shared-swaps/models/fixtures/raw-one-inch-response-data';

export class JSONTransfer {
  constructor(private readonly _aTransfer: Transfer) {}

  public value(): any {
    return {
      fee: this._aTransfer.fee()
    };
  }
}

fdescribe('JSONTransfer', () => {
  let jsonTransfer: JSONTransfer;

  beforeEach(() => {
    jsonTransfer = new JSONTransfer(new Transfer(rawTransfer, rawMATICTokenData));
  });

  it('new', () => {
    expect(jsonTransfer).toBeTruthy();
  });

  it('value', () => {
    expect(jsonTransfer.value()).toBeTruthy();
  });
});
