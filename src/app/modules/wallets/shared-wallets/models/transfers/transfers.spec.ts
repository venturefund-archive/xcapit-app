import { RawToken } from 'src/app/modules/swaps/shared-swaps/models/token-repo/token-repo';
import { CovalentRepo } from '../covalent-repo/covalent-repo.interface';
import { FakeCovalentRepo } from '../covalent-repo/fake/fake-covalent-repo';

export class Transfers {
  constructor(private readonly _aToken: RawToken, private readonly repo: CovalentRepo) {}
}

fdescribe('Transfers', () => {
  let aToken: jasmine.SpyObj<RawToken>;

  beforeEach(() => {
    aToken = jasmine.createSpyObj('RawToken', {}, { native: true, value: 'MATIC' });
  });

  it('new', () => {
    expect(new Transfers(aToken, new FakeCovalentRepo())).toBeTruthy();
  });
});
