import { TwoPi, Vault } from '@2pi-network/sdk';
import { TwoPiApi } from './two-pi-api.model';

const testVaultUSDC = [
  {
    apy: 0.12392847454895217,
    balances: [],
    contract_address: '0xCB50fF1863cBBAd718d3A1eEEf403a95C58d3B16',
    deposits: [],
    identifier: 'polygon_usdc',
    pid: 1,
    token: 'USDC',
    token_address: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
    tvl: 15800500,
  } as Vault,
  {
    apy: -0.0063743965358873,
    balances: [],
    contract_address: '0x3B353b1CBDDA3A3D648af9825Ee34d9CA816FD38',
    deposits: [],
    identifier: 'mumbai_dai',
    pid: 1,
    token: 'DAI',
    token_address: '0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F',
    tvl: 123456789,
  } as Vault,
];

describe('TwoPiApi', () => {
  let twoPiApi: TwoPiApi;
  let twoPiInstanceSpy: jasmine.SpyObj<TwoPi>;
  beforeEach(() => {
    twoPiInstanceSpy = jasmine.createSpyObj('TwoPi', { getVaults: testVaultUSDC });
    twoPiApi = new TwoPiApi();
  });

  it('should create', () => {
    expect(twoPiApi).toBeTruthy();
  });

  it('should return all available vaults on getVaults', async () => {
    twoPiApi.instance = twoPiInstanceSpy;
    await expectAsync(twoPiApi.vaults()).toBeResolvedTo(testVaultUSDC);
  });

  it('should return a vault by identifier', async () => {
    twoPiApi.instance = twoPiInstanceSpy;
    const vault = await expectAsync(twoPiApi.vault('polygon_usdc')).toBeResolvedTo(testVaultUSDC[0]);
  });

  it('should return mainnet networks when environment is production', () => {
    twoPiApi.env = 'PRODUCCION';
    const networks = twoPiApi.getParams();
    expect(networks).toEqual({ networks: ['polygon'], partner: 'xcapit' });
  });

  it('should return testnet networks when environment is not production', () => {
    twoPiApi.env = 'PREPROD';
    const networks = twoPiApi.getParams();
    expect(networks).toEqual({ networks: ['mumbai'] });
  });
});
