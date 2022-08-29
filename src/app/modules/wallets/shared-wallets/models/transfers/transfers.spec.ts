import { RawToken } from 'src/app/modules/swaps/shared-swaps/models/token-repo/token-repo';
import { CovalentRepo } from '../covalent-repo/covalent-repo.interface';
import { FakeCovalentRepo } from '../covalent-repo/fake/fake-covalent-repo';
import { Transfer } from '../transfer/transfer.spec';

export class Transfers {
  constructor(
    private readonly _aToken: RawToken,
    private readonly _inAddress: string,
    private readonly repo: CovalentRepo
  ) {}

  // public all() {
  //   return this.repo.transfersOf(this._aToken, this._inAddress).toPromise().then(res=>{
  //     return res.map(item=>{
  //       new Transfer(
  //         as RawTransfer,
  //         this._aToken
  //       )
  //     })
  //   });
  // }

  /* public transfersOf(aToken: RawToken, inAddress: string): Promise<Transfer> {
    return this.repo.transfersOf(aToken, inAddress).toPromise().then(res => {
      new Transfer(

      )
    })
  } */
}

fdescribe('Transfers', () => {
  let aToken: jasmine.SpyObj<RawToken>;
  const inAddress = '';

  beforeEach(() => {
    aToken = jasmine.createSpyObj('RawToken', {}, { native: true, value: 'MATIC' });
  });

  it('new', () => {
    expect(new Transfers(aToken, inAddress, new FakeCovalentRepo())).toBeTruthy();
  });
  it('all', () => {
    expect(new Transfers(aToken, inAddress, new FakeCovalentRepo()).all()).toBeTruthy();
  });
});
