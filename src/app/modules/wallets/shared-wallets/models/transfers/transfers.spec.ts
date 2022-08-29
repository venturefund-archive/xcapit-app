import { RawToken } from 'src/app/modules/swaps/shared-swaps/models/token-repo/token-repo';
import { CovalentRepo } from '../covalent-repo/covalent-repo.interface';
import { FakeCovalentRepo } from '../covalent-repo/fake/fake-covalent-repo';
import { Transfer } from '../transfer/transfer.spec';

export class Transfers {
  constructor(private readonly _aToken: RawToken, private readonly repo: CovalentRepo) {}

  /* public transfersOf(aToken: RawToken, inAddress: string): Promise<Transfer> {
    return this.repo.transfersOf(aToken, inAddress).toPromise().then(res => {
      new Transfer(

      )
    })
  } */
}

fdescribe('Transfers', () => {
  let aToken: jasmine.SpyObj<RawToken>;

  beforeEach(() => {
    aToken = jasmine.createSpyObj('RawToken', {}, { native: true, value: 'MATIC' });
  });

  it('new', () => {
    expect(new Transfers(aToken, new FakeCovalentRepo()).all()).toBeTruthy();
  });
});
