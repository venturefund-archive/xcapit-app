import { BigNumber, constants, Wallet } from 'ethers';
import { TEST_ERC20_COINS } from '../../constants/coins.test';
import { Coin } from '../../interfaces/coin.interface';
import { NativeToken } from '../native-token/native-token.model';
import { NativeTokenSend } from './native-token-send.model';

describe('NativeTokenTransfer', () => {
  let transfer: NativeTokenSend;
  let erc20TokenSpy: jasmine.SpyObj<NativeToken>;
  let zeroAddress: string;
  let ethCoin: Coin;

  beforeEach(() => {
    ethCoin = JSON.parse(JSON.stringify(TEST_ERC20_COINS[0]));
    zeroAddress = constants.AddressZero;

    erc20TokenSpy = jasmine.createSpyObj('ERC20Token', {
      transfer: Promise.resolve({}),
      transferFee: Promise.resolve(BigNumber.from(1)),
    });

    transfer = new NativeTokenSend(zeroAddress, zeroAddress, { value: 1, token: 'USDT' }, erc20TokenSpy, false);
  });

  it('should create', () => {
    expect(transfer).toBeTruthy();
  });

  it('should call token transfer on send', async () => {
    await transfer.send();
    expect(erc20TokenSpy.transfer).toHaveBeenCalledOnceWith(zeroAddress, BigNumber.from(1));
  });

  it('should call token transferFee on sendEstimateGas', async () => {
    await transfer.sendEstimateGas();
    expect(erc20TokenSpy.transferFee).toHaveBeenCalledOnceWith(zeroAddress, BigNumber.from(1));
  });

  it('should create an instance of NativeTokenSend with no wallet on create', () => {
    const send =  NativeTokenSend.create(zeroAddress, zeroAddress, 1, ethCoin);
    expect(send).toBeInstanceOf(NativeTokenSend);
    expect(send.canSignTx).toBeFalse();
  });

  it('should create an instance of NativeTokenSend with wallet on create', () => {
    const wallet = Wallet.createRandom();
    const send =  NativeTokenSend.create(zeroAddress, zeroAddress, 1, ethCoin, wallet);
    expect(send).toBeInstanceOf(NativeTokenSend);
    expect(send.canSignTx).toBeTrue();
  });
});
