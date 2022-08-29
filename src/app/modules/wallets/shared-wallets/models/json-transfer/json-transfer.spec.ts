import { Transfer } from '../transfer/transfer';
import { rawTransfer } from '../covalent-repo/default/covalent-transfers.fixture';
import { rawMATICData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';



export class JSONTransfer {
  constructor(private readonly _aTransfer: Transfer) {}

  public value(): any {
    return {
      fee: this._aTransfer.fee(),
      token: this._aTransfer.token(),
      ...this._aTransfer.raw(),
    };
  }
}

fdescribe('JSONTransfer', () => {
  let jsonTransfer: JSONTransfer;

  beforeEach(() => {
    jsonTransfer = new JSONTransfer(new Transfer(rawTransfer, rawMATICData));
  });

  it('new', () => {
    expect(jsonTransfer).toBeTruthy();
  });

  it('value', () => {
    expect(jsonTransfer.value()).toEqual(2);
  });

});
