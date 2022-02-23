import { TEST_ERC20_COINS } from '../../constants/coins.test';
import { Coin } from '../../interfaces/coin.interface';
import { ERC20TokenSend } from '../erc20-token-send/erc20-token-send.model';
import { NativeTokenSend } from '../native-token-send/native-token-send.model';
import { NativeToken } from '../native-token/native-token.model';
import { TokenSend } from './token-send.model';
import { constants, VoidSigner, Wallet } from 'ethers';
import { ERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.model';
import { ERC20Token } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-token/erc20-token.model';
import { ERC20Contract } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-contract/erc20-contract.model';
import { ApiWalletService } from '../../services/api-wallet/api-wallet.service';

describe('TokenSend', () => {
  let eth: Coin;
  let usdt: Coin;
  let nativeTokenSendSpy: jasmine.Spy;
  let erc20TokenSendSpy: jasmine.Spy;
  let apiWalletServiceSpy: jasmine.SpyObj<ApiWalletService>

  beforeEach(() => {
    eth = JSON.parse(JSON.stringify(TEST_ERC20_COINS[0]));
    usdt = JSON.parse(JSON.stringify(TEST_ERC20_COINS[2]));

    apiWalletServiceSpy = jasmine.createSpyObj('ApiWalletService', { getNativeTokenFromNetwork: eth });

    nativeTokenSendSpy = spyOn(NativeTokenSend, 'create');
    const nativeToken = new NativeToken(new ERC20Provider(eth), new VoidSigner(constants.AddressZero));
    nativeTokenSendSpy.and.returnValue(
      new NativeTokenSend(constants.AddressZero, constants.AddressZero, '0', nativeToken, eth, false)
    );

    erc20TokenSendSpy = spyOn(ERC20TokenSend, 'create');
    const erc20Token = new ERC20Token(
      new ERC20Contract(new ERC20Provider(usdt), new VoidSigner(constants.AddressZero))
    );
    erc20TokenSendSpy.and.returnValue(
      new ERC20TokenSend(constants.AddressZero, constants.AddressZero, '0', erc20Token, usdt, eth, false)
    );
  });

  it('should create a NativeTokenSend if coin is native', () => {
    const tx = TokenSend.create('test', 'test', '0', eth, apiWalletServiceSpy);
    expect(nativeTokenSendSpy).toHaveBeenCalledOnceWith('test', 'test', '0', eth, undefined);
    expect(tx).toBeInstanceOf(NativeTokenSend);
  });

  it('should create an ERC20TokenSend if coin is not native', () => {
    const tx = TokenSend.create('test', 'test', '0', usdt, apiWalletServiceSpy);
    expect(erc20TokenSendSpy).toHaveBeenCalledOnceWith('test', 'test', '0', usdt, eth, undefined);
    expect(tx).toBeInstanceOf(ERC20TokenSend);
  });

  it('should pass wallet if coin is native', () => {
    const wallet = Wallet.createRandom();
    const tx = TokenSend.create('test', 'test', '0', eth, apiWalletServiceSpy, wallet);
    expect(nativeTokenSendSpy).toHaveBeenCalledOnceWith('test', 'test', '0', eth, wallet);
    expect(tx).toBeInstanceOf(NativeTokenSend);
  });

  it('should pass wallet if coin is not native', () => {
    const wallet = Wallet.createRandom();
    const tx = TokenSend.create('test', 'test', '0', usdt, apiWalletServiceSpy, wallet);
    expect(erc20TokenSendSpy).toHaveBeenCalledOnceWith('test', 'test', '0', usdt, eth, wallet);
    expect(tx).toBeInstanceOf(ERC20TokenSend);
  });
});
