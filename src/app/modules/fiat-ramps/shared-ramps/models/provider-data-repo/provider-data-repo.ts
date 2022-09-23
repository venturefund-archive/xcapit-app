import { FiatRampProvider } from '../../interfaces/fiat-ramp-provider.interface';
import { FiatRampProviderCountry } from '../../interfaces/fiat-ramp-provider-country';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { RemoteConfigService } from 'src/app/shared/services/remote-config/remote-config.service';

export class ProviderDataRepo {
  constructor(private readonly remoteConfig: RemoteConfigService) {}

  public all(): FiatRampProvider[] {
    return this.providers();
  }

  public byCountry(aCountry: FiatRampProviderCountry): FiatRampProvider[] {
    return this.providers().filter((provider) => provider.countries.includes(aCountry.name));
  }

  public byCountryAndCoin(aCountry: FiatRampProviderCountry, aCoin: Coin) {
    return this.providers().filter(
      (provider) =>
        provider.countries.includes(aCountry.name) &&
        provider.currencies.some((curr) => curr.symbol === aCoin.value && curr.network === aCoin.network)
    );
  }
  private providers(): FiatRampProvider[] {
    /* return this.remoteConfig.getObject('onOffRampsProviders'); */
    return [{
      "id": 1,
      "alias": "kripton",
      "showInfo": true,
      "name": "Kripton Market",
      "providerName": "kripton",
      "logoRoute": "assets/img/provider-logos/KriptonMarket.svg",
      "description": "fiat_ramps.select_provider.krypton_description",
      "disclaimer": "fiat_ramps.shared.constants.providers.kripton.disclaimer",
      "newOperationRoute": "/fiat-ramps/new-operation/kripton",
      "trackClickEventName": "ux_buy_kripton",
      "countries": [
        "Argentina",
        "Venezuela",
        "Uruguay",
        "Colombia"
      ],
      "currencies": [
        {
          "symbol": "DAI",
          "network": "MATIC"
        },
        {
          "symbol": "MATIC",
          "network": "MATIC"
        },
        {
          "symbol": "USDC",
          "network": "MATIC"
        },
        {
          "symbol": "ETH",
          "network": "ERC20"
        },
        {
          "symbol": "USDT",
          "network": "ERC20"
        },
        {
          "symbol": "RBTC",
          "network": "RSK"
        }
      ]
    },]
  }
}
