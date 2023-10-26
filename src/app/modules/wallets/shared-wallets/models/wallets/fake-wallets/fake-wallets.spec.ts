import { Blockchain } from 'src/app/modules/swaps/shared-swaps/models/blockchain/blockchain';
import { FakeWallet } from '../../wallet/fake/fake-wallet';
import { FakeWallets } from './fake-wallets';

describe('FakeWallets', () => {
  it('new', () => {
    expect(new FakeWallets()).toBeTruthy();
  });

  it('oneBy', async () => {
    const fakeWallets = new FakeWallets(new FakeWallet(Promise.resolve(false), null, '0x0'));
    expect((await fakeWallets.oneBy({} as Blockchain)).address()).toEqual('0x0');
  });
});
