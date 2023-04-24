// import { rawUSDCData } from 'src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data';
// import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
// import { NativeGasOf } from '../native-gas-of/native-gas-of';
// import { ERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/erc20-provider.interface';
// import { WeiOf } from '../wei-of/wei-of';
// import { Fee } from 'src/app/modules/defi-investments/shared-defi-investments/interfaces/fee.interface';
// import { BigNumber } from 'ethers';
// import { FakeERC20Provider } from 'src/app/modules/defi-investments/shared-defi-investments/models/erc20-provider/fake/fake-erc20-provider';

// export class EstimatedTransferFeeOf {
//   constructor(
//     private readonly aCoin: Coin,
//     private readonly aWallet: string,
//     private readonly anAmount: number,
//     private readonly aProvider: ERC20Provider
//   ) {}

//   value(): Promise<Fee> {
//     return this._estimatedNativeGas();
//   }

//   private async _estimatedNativeGas(): Promise<Fee> {
//     return new NativeGasOf(this.aProvider, {
//       to: this.aWallet,
//       value: new WeiOf(this.anAmount || 1, this.aCoin).value(),
//     });
//   }
// }

// fdescribe('EstimatedTransferFeeOf', () => {
//   let nativeEstimatedTransferFeeOf: EstimatedTransferFeeOf;
//   let nonNativeEstimatedTransferFeeOf: EstimatedTransferFeeOf;
//   let ERC20ProviderSpy: ERC20Provider;
//   let providerSpy: jasmine.SpyObj<any>;
//   beforeEach(() => {
//     providerSpy = jasmine.createSpyObj('provider', {
//       estimateGas: Promise.resolve(BigNumber.from('100')),
//     });

//     ERC20ProviderSpy = new FakeERC20Provider(null, providerSpy);

//     nativeEstimatedTransferFeeOf = new EstimatedTransferFeeOf(rawUSDCData, '0xaWallet', 1, ERC20ProviderSpy);
//   });

//   it('new', () => {
//     expect(nativeEstimatedTransferFeeOf).toBeTruthy();
//   });

//   it('value when token is native', async () => {
//     const fee = await nativeEstimatedTransferFeeOf.value();
//     expect(await fee.value()).toEqual(BigNumber.from('100'));
//   });

//   it('value when token is no native', async () => {
//     const fee = await nonNativeEstimatedTransferFeeOf.value();
//     expect(await fee.value()).toEqual(BigNumber.from('100'));
//   });
// });
