import { Transfer } from '../transfer/transfer';
import { rawTransfer } from '../covalent-repo/default/covalent-transfers.fixture';
import { rawMATICTokenData } from '../../../../swaps/shared-swaps/models/fixtures/raw-one-inch-response-data';

export class JSONTransfer {
  constructor(private readonly _aTransfer: Transfer) {

  }


}

fdescribe('JSONTransfer', () => {
  it('new', () => {
    expect(new JSONTransfer(new Transfer(rawTransfer, rawMATICTokenData))).toBeTruthy();
  });

  it('value', ()=>{

  })
});
