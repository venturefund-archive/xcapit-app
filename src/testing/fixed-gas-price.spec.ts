import { AmountOf } from "src/app/modules/wallets/shared-wallets/models/blockchain-tx/amount-of/amount-of";
import { rawETHData } from "src/app/modules/swaps/shared-swaps/models/fixtures/raw-tokens-data";
import { GasStationOf } from "src/app/modules/swaps/shared-swaps/models/gas-station-of/gas-station-of";
import { RawToken } from "src/app/modules/swaps/shared-swaps/models/token-repo/token-repo";
import { DefaultToken } from "src/app/modules/swaps/shared-swaps/models/token/token";


export const fixedGasPriceTo = (aWeiGasPrice: string = '100000000000', rawTokenData: RawToken = rawETHData) => {
  return {
    price: () => ({
      standard: () => Promise.resolve(new AmountOf(aWeiGasPrice, new DefaultToken(rawTokenData))),
    }),
  } as GasStationOf;
};
