import { Injectable } from "@angular/core";
import { StorageService } from "src/app/shared/services/app-storage/app-storage.service";
import { NewWalletRepo, WalletRepo } from "../../wallet-repo/wallet-repo";
import { Wallets } from "../wallets";


@Injectable({ providedIn: 'root' })
export class WalletsFactory {
  constructor() {}

  createFromStorage(aStorage: StorageService): Wallets {
    return new Wallets(new WalletRepo(aStorage));
  }

  createFromPhrase(_aPassword: string, _aPhrase: string) {
    return new Wallets(new NewWalletRepo(_aPhrase, _aPassword))
  }
}
