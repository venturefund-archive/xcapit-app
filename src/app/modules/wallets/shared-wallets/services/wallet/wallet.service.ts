import { Injectable } from '@angular/core';
import { Coin } from '../../interfaces/coin.interface';
import { ethers } from 'ethers';
import { LanguageService } from 'src/app/shared/services/language/language.service';
import { WalletMnemonicService } from '../wallet-mnemonic/wallet-mnemonic.service';
import { BlockchainProviderService } from '../brockchain-provider/blockchain-provider.service';
import { AppStorageService } from 'src/app/shared/services/app-storage/app-storage.service';
import { DerivedPaths } from '../../../enums/derived-paths.enum';
import { AssetBalance } from '../../interfaces/asset-balance.interface';
import { COINS } from '../../../constants/coins';
import { ApiWalletService } from '../api-wallet/api-wallet.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  coins: Coin[];
  createdWallets: ethers.Wallet[];
  derivationPaths: string[] = ["m/44'/60'/0'/0/0"];
  addresses: any = null;

  constructor(
    private walletMnemonicService: WalletMnemonicService,
    private blockchainProviderService: BlockchainProviderService,
    private languageService: LanguageService,
    private appStorageService: AppStorageService,
    private apiWalletService: ApiWalletService
  ) {}

  create(): ethers.Wallet[] {
    if (this.mnemonicExists() && this.selectedCoins()) {
      this.createdWallets = [];
      this.getDerivedPaths();

      for (const derivedPath of this.derivationPaths) {
        this.createdWallets.push(this.createForDerivedPath(derivedPath));
      }

      return this.createdWallets;
    }
  }

  private getDerivedPaths() {
    for (const coin of this.coins) {
      if (!this.derivationPaths.includes(DerivedPaths[coin.network])) {
        this.derivationPaths.push(DerivedPaths[coin.network]);
      }
    }
  }

  private createForDerivedPath(derivedPath: string) {
    return ethers.Wallet.fromMnemonic(this.walletMnemonicService.mnemonic.phrase, derivedPath, this.wordList());
  }

  private wordList() {
    return ethers.wordlists[this.languageService.selected];
  }

  mnemonicExists(): boolean {
    return !!this.walletMnemonicService.mnemonic;
  }

  selectedCoins(): boolean {
    return !!this.coins && !!this.coins.length;
  }

  balanceOf(address: string, coin: string): Promise<string> {
    return this.blockchainProviderService.getFormattedBalanceOf(address, coin);
  }

  async walletExist(): Promise<boolean> {
    const wallets = await this.appStorageService.get('enc_wallet');

    if (!!wallets) {
      this.addresses = wallets.addresses;
    }

    return !!wallets;
  }

  getWalletBalances(): Observable<Array<AssetBalance>> {
    return new Observable((observer) => {
      const walletCoins = this.getWalletCoins();
      const balances: Array<AssetBalance> = [];

      walletCoins.forEach((coin, i) => {
        this.balanceOf(this.addresses[coin.network], coin.value).then((value) => {
          balances.push(this.createBalance(coin, parseFloat(value)));
          observer.next(balances);
          if (i === walletCoins.length - 1) {
            observer.complete();
          }
        });
      });
    });
  }

  getWalletCoins(): Array<Coin> {
    return COINS.filter((coin) => Object.keys(this.addresses).includes(coin.network));
  }

  getWalletPriceCoinsName(): Array<string> {
    return this.getWalletCoins().map((coin) => this.getCoinForPrice(coin.value));
  }

  createBalance(coin: Coin, amount: number): AssetBalance {
    return {
      icon: coin.logoRoute,
      symbol: coin.value,
      usePriceCoin: this.getCoinForPrice(coin.value),
      name: coin.name,
      amount,
      usdAmount: 0,
      usdSymbol: 'USD',
    };
  }

  getWalletBalanceWithUsdAmount(): Observable<Array<AssetBalance>> {
    return new Observable((observer) => {
      const balanceWithUsdAmount: Array<AssetBalance> = [];
      this.apiWalletService.getPrices(this.getWalletPriceCoinsName()).subscribe((prices) => {
        this.getWalletBalances().subscribe({
          next: (assetBalancesList) => {
            const assetBalance = assetBalancesList.pop();
            if (prices.prices[assetBalance.usePriceCoin] === null) {
              assetBalance.usdAmount = -1;
            } else {
              assetBalance.usdAmount = prices.prices[assetBalance.usePriceCoin] * assetBalance.amount;
            }
            balanceWithUsdAmount.push(assetBalance);
            observer.next(balanceWithUsdAmount);
          },
          complete: () => observer.complete(),
        });
      });
    });
  }

  private getCoinForPrice(symbol: string) {
    return symbol === 'RBTC' ? 'BTC' : symbol;
  }
}
