import { BigNumber, constants, Wallet } from 'ethers';
import { parseUnits } from 'ethers/lib/utils';
import { ERC20Token } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-token/erc20-token.model';
import { TEST_ERC20_COINS } from '../../constants/coins.test';
import { Coin } from '../../interfaces/coin.interface';
import { ERC20TokenSend } from './erc20-token-send.model';

describe('ERC20TokenSend', () => {
  let transfer: ERC20TokenSend;
  let erc20TokenSpy: jasmine.SpyObj<ERC20Token>;
  let zeroAddress: string;
  let usdtCoin: Coin;
  let ethCoin: Coin;

  beforeEach(() => {
    usdtCoin = JSON.parse(JSON.stringify(TEST_ERC20_COINS[2]));
    ethCoin = JSON.parse(JSON.stringify(TEST_ERC20_COINS[0]));
    zeroAddress = constants.AddressZero;

    erc20TokenSpy = jasmine.createSpyObj('ERC20Token', {
      transfer: Promise.resolve({}),
      transferFee: Promise.resolve(BigNumber.from(3)),
      getGasPrice: Promise.resolve(BigNumber.from(2)),
      balanceOf: Promise.resolve(BigNumber.from('500000'))
    });

    transfer = new ERC20TokenSend(zeroAddress, zeroAddress, '1.0', erc20TokenSpy, usdtCoin, ethCoin, false);
  });

  it('should create', () => {
    expect(transfer).toBeTruthy();
  });

  it('should call token transfer on send', async () => {
    await transfer.send();
    expect(erc20TokenSpy.transfer).toHaveBeenCalledOnceWith(zeroAddress, parseUnits('1', usdtCoin.decimals));
  });

  it('should call token transferFee when user has balance on sendEstimateGas', async () => {
    erc20TokenSpy.balanceOf.and.returnValue(Promise.resolve(BigNumber.from('2000000')));
    await transfer.sendEstimateGas();
    expect(erc20TokenSpy.transferFee).toHaveBeenCalledOnceWith(zeroAddress, parseUnits('1', usdtCoin.decimals));
  });

  it('should call token transferFee with amount zero on sendEstimateGas', async () => {
    erc20TokenSpy.balanceOf.and.returnValue(Promise.resolve(BigNumber.from('500000')));
    await transfer.sendEstimateGas();
    expect(erc20TokenSpy.transferFee).toHaveBeenCalledOnceWith(zeroAddress, BigNumber.from(0));
  });

  it('should create an instance of ERC20TokenSend with no wallet on create', () => {
    const send =  ERC20TokenSend.create(zeroAddress, zeroAddress, '1.0', usdtCoin, ethCoin);
    expect(send).toBeInstanceOf(ERC20TokenSend);
    expect(send.canSignTx).toBeFalse();
  });

  it('should create an instance of ERC20TokenSend with wallet on create', () => {
    const wallet = Wallet.createRandom();
    const send =  ERC20TokenSend.create(zeroAddress, zeroAddress, '1.0', usdtCoin, ethCoin, wallet);
    expect(send).toBeInstanceOf(ERC20TokenSend);
    expect(send.canSignTx).toBeTrue();
  });
  
  it('should call getGasPrice on getGasPrice',  async () => {
    await transfer.getGasPrice();
    expect(erc20TokenSpy.getGasPrice).toHaveBeenCalledTimes(1);
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
