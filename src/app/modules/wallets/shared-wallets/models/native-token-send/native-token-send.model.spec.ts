import { BigNumber, constants, Wallet } from 'ethers';
import { parseEther } from 'ethers/lib/utils';
import { TEST_ERC20_COINS } from '../../constants/coins.test';
import { Coin } from '../../interfaces/coin.interface';
import { NativeToken } from '../native-token/native-token.model';
import { NativeTokenSend } from './native-token-send.model';

describe('NativeTokenTransfer', () => {
  let transfer: NativeTokenSend;
  let nativeTokenSpy: jasmine.SpyObj<NativeToken>;
  let zeroAddress: string;
  let ethCoin: Coin;

  beforeEach(() => {
    ethCoin = JSON.parse(JSON.stringify(TEST_ERC20_COINS[0]));
    zeroAddress = constants.AddressZero;

    nativeTokenSpy = jasmine.createSpyObj('ERC20Token', {
      transfer: Promise.resolve({}),
      transferFee: Promise.resolve(BigNumber.from(2)),
      getGasPrice: Promise.resolve(BigNumber.from(3))
    });

    transfer = new NativeTokenSend(zeroAddress, zeroAddress, '1.0', nativeTokenSpy, ethCoin, false);
  });

  it('should create', () => {
    expect(transfer).toBeTruthy();
  });

  it('should call token transfer on send', async () => {
    await transfer.send();
    expect(nativeTokenSpy.transfer).toHaveBeenCalledOnceWith(zeroAddress, parseEther('1'));
  });

  it('should call token transferFee on sendEstimateGas', async () => {
    await transfer.sendEstimateGas();
    expect(nativeTokenSpy.transferFee).toHaveBeenCalledOnceWith(zeroAddress, parseEther('1'));
  });

  it('should create an instance of NativeTokenSend with no wallet on create', () => {
    const send =  NativeTokenSend.create(zeroAddress, zeroAddress, '1.0', ethCoin);
    expect(send).toBeInstanceOf(NativeTokenSend);
    expect(send.canSignTx).toBeFalse();
  });

  it('should create an instance of NativeTokenSend with wallet on create', () => {
    const wallet = Wallet.createRandom();
    const send =  NativeTokenSend.create(zeroAddress, zeroAddress, '1.0', ethCoin, wallet);
    expect(send).toBeInstanceOf(NativeTokenSend);
    expect(send.canSignTx).toBeTrue();
  });

  it('should call getGasPrice on getGasPrice',  async () => {
    await transfer.getGasPrice();
    expect(nativeTokenSpy.getGasPrice).toHaveBeenCalledTimes(1);
  });

  it('should set and return fee estimate on sendEstimateFee', async () => {
    const fee = await transfer.sendEstimateFee();
    expect(fee).toEqual(BigNumber.from(6));
    expect(transfer.fee).toEqual(fee);
  });

  it('should return parsed fee on parseFee', () => {
    spyOnProperty(transfer, 'fee').and.returnValue(BigNumber.from(6));
    const parsedFee = transfer.formatFee();
    expect(parsedFee).toEqual('0.000000000000000006');
  });
});
