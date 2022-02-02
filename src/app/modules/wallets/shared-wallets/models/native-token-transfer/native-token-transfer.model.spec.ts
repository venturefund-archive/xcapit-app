import { JsonRpcProvider } from '@ethersproject/providers';
import { BigNumber, constants, Signer, VoidSigner } from 'ethers';
import { NativeTokenTransfer } from './native-token-transfer.model';

fdescribe('NativeTokenTransfer', () => {
  let transfer: NativeTokenTransfer;
  let erc20ProviderMock;
  let signerSpy: jasmine.SpyObj<Signer>;
  let providerSpy: jasmine.SpyObj<JsonRpcProvider>;
  let zeroAddress: string;

  beforeEach(() => {
    zeroAddress = constants.AddressZero;

    providerSpy = jasmine.createSpyObj('Provider', {
      estimateGas: Promise.resolve()
    });
    
    erc20ProviderMock = {
      value: () => providerSpy
    };

    signerSpy = jasmine.createSpyObj('Signer', {
      connect: Promise.resolve({}),
      value: Promise.resolve({})
    });

    transfer = new NativeTokenTransfer(zeroAddress, zeroAddress, { value: 1, token: 'USDT' }, erc20ProviderMock, signerSpy);
  });

  it('should create', () => {
    expect(transfer).toBeTruthy();
  });

  it('should call signer sendTransaction', async () => {
    await transfer.transfer();
    expect(signerSpy.connect).toHaveBeenCalledOnceWith(erc20ProviderMock.value);
    expect(signerSpy.sendTransaction).toHaveBeenCalledOnceWith({ to: zeroAddress, value: BigNumber.from(1) });
  });

  it('should call provider estimateGas', async () => {
    await transfer.estimateFee();
    expect(erc20ProviderMock.value.estimateGas).toHaveBeenCalledOnceWith({ to: zeroAddress, value: BigNumber.from(1) });
  });
});
