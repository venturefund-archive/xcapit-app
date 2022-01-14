import { TEST_VAULTS } from './../../constants/test-vault.spec';
import { Vault, TwoPi } from '@2pi-network/sdk';
import { TwoPiApi } from './two-pi-api.class';

describe('TwoPiApi', () => {
  let twoPiApi: TwoPiApi;
  let twoPiInstanceSpy: jasmine.SpyObj<TwoPi>;
  beforeEach(() => {
    twoPiInstanceSpy = jasmine.createSpyObj('TwoPi', { getVaults: TEST_VAULTS });
    twoPiApi = new TwoPiApi();
  });

  it('should create', () => {
    expect(twoPiApi).toBeTruthy();
  });

  it('should return all available vaults on getVaults', async () => {
    twoPiApi.instance = twoPiInstanceSpy;
    await expectAsync(twoPiApi.vaults()).toBeResolvedTo(TEST_VAULTS);
  });

  it('should return a vault by identifier', async () => {
    twoPiApi.instance = twoPiInstanceSpy;
    const vault = await expectAsync(twoPiApi.vault('usdc_aave')).toBeResolvedTo(TEST_VAULTS[0]);
  });
});
