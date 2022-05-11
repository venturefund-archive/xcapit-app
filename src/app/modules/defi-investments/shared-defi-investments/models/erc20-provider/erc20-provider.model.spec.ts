import { Provider } from '@ethersproject/abstract-provider';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { DefaultERC20Provider } from '../erc20-provider/erc20-provider.model';

const coin = {
  id: 5,
  name: 'UNI - Uniswap',
  logoRoute: 'assets/img/coins/UNI.svg',
  last: true,
  value: 'UNI',
  network: 'ERC20',
  chainId: 42,
  rpc: 'http://testrpc.text/ ',
  moonpayCode: 'uni',
  contract: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  decimals: 18,
} as Coin;

describe('ERC20Provider', () => {
  let erc20Provider: DefaultERC20Provider;
  beforeEach(() => {
    erc20Provider = new DefaultERC20Provider(coin);
  });

  it('should create', () => {
    expect(erc20Provider).toBeTruthy();
  });

  it('should return coin', async () => {
    const coin = erc20Provider.coin();
    expect(coin).toEqual(coin);
  });

  it('should return a provider', async () => {
    const provider = erc20Provider.value();
    expect(provider).toBeInstanceOf(Provider);
    expect(provider.connection.url).toEqual(coin.rpc);
  });
});
