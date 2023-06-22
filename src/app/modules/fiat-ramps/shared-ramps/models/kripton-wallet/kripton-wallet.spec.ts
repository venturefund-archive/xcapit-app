import { FakeFiatRampsService } from '../fake-fiat-ramps-service/fake-fiat-ramps-service';
import { KriptonWallet } from './kripton-wallet';


describe('KriptonWallet', () => {
  let kriptonWallet: KriptonWallet;
  const anExternalCode = 'anExternalCode';

  beforeEach(() => {
    kriptonWallet = new KriptonWallet(anExternalCode, new FakeFiatRampsService());
  });

  it('new', () => {
    expect(kriptonWallet).toBeTruthy();
  });

  it('address', async () => {
    expect(await kriptonWallet.address()).toBeTruthy();
  });
});
