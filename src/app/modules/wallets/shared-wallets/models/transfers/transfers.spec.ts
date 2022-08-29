import { RawToken } from 'src/app/modules/swaps/shared-swaps/models/token-repo/token-repo';
import { CovalentRepo } from '../covalent-repo/covalent-repo.interface';
import { FakeCovalentRepo } from '../covalent-repo/fake/fake-covalent-repo';
import { Transfer } from '../transfer/transfer.spec';
import { rawTransfers } from '../covalent-repo/default/covalent-transfers.fixture';
import { of } from 'rxjs';

export type RawTransfer = {
  block_signed_at: string;
  block_height: number;
  tx_hash: string;
  tx_offset: number;
  successful: boolean;
  from_address: string;
  from_address_label: string;
  to_address: string;
  to_address_label: string;
  value: string;
  value_quote: number;
  gas_offered: number;
  gas_spent: number;
  gas_price: number;
  fees_paid: string;
  gas_quote: number;
  gas_quote_rate: number;
};

export class Transfers {
  constructor(
    private readonly _aToken: RawToken,
    private readonly _inAddress: string,
    private readonly repo: CovalentRepo
  ) {}

  public all() {
    return this.repo
      .transfersOf(this._aToken, this._inAddress)
      .toPromise()
      .then((res) =>
          res.data.items.map((rawTransfer: RawTransfer ) =>
          new Transfer(rawTransfer, this._aToken)
        )
      );
  }
}

fdescribe('Transfers', () => {
  let aToken: jasmine.SpyObj<RawToken>;
  const inAddress = '';
  let transfers: Transfers;
  beforeEach(() => {
    aToken = jasmine.createSpyObj('RawToken', {}, { native: true, value: 'MATIC' });
    transfers = new Transfers(aToken, inAddress, new FakeCovalentRepo(of(rawTransfers)));
  });

  it('new', () => {
    expect(transfers).toBeTruthy();
  });

  it('all', async () => {
    expect(await transfers.all()).toBeTruthy();
  });
});
