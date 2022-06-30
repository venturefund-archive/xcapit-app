import { Injectable } from "@angular/core";
import { StorageService } from "src/app/shared/services/app-storage/app-storage.service";
import { WalletRepo } from "../../wallet-repo/wallet-repo";
import { Wallets } from "../wallets";


@Injectable({ providedIn: 'root' })
export class WalletsFactory {

  create(aStorage: StorageService): Wallets {
    return new Wallets(new WalletRepo(aStorage));
  }
}
