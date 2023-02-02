import { Coin } from '../../interfaces/coin.interface';
import { ERC20TokenSend } from '../erc20-token-send/erc20-token-send.model';
import { NativeTokenSend } from '../native-token-send/native-token-send.model';
import { TokenSend } from './token-send.model';
import { Signer } from 'ethers';
import { ApiWalletService } from '../../services/api-wallet/api-wallet.service';
import { NetworkConfig } from '../network-config/network-config';

describe('TokenSend', () => {
  const from = '';
  const to = '';
  const amount = 0;
  let coinSpy: jasmine.SpyObj<Coin>;
  let signerSpy: jasmine.SpyObj<Signer>;
  let networkConfigSpy: jasmine.SpyObj<NetworkConfig>;

  beforeEach(() => {
    signerSpy = jasmine.createSpyObj('Signer', { connect: Promise.resolve() });
    coinSpy = jasmine.createSpyObj('Coin', {}, { native: false });
    networkConfigSpy = jasmine.createSpyObj('NetworkConfig', {
      value: Promise.resolve({ gasPrice: '100000000' }),
    });
  });

  it('should create with wallet', () => {
    expect(new TokenSend(to, amount, coinSpy, signerSpy, networkConfigSpy)).toBeTruthy();
  });

  it('should create without wallet', () => {
    expect(TokenSend.create(from, to, amount, coinSpy, networkConfigSpy)).toBeTruthy();
  });

  it('should return an ERC20TokenSend if coin is not native', () => {
    const tokenSend = TokenSend.create(from, to, amount, coinSpy, networkConfigSpy);
    expect(tokenSend.value()).toBeInstanceOf(ERC20TokenSend);
  });

  it('should return a NativeTokenSend if coin is native', () => {
    const tokenSend = TokenSend.create(
      from,
      to,
      amount,
      { native: true } as Coin,
      networkConfigSpy
    );
    expect(tokenSend.value()).toBeInstanceOf(NativeTokenSend);
  });
});
