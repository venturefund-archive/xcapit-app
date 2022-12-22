import { Injectable } from "@angular/core";
import { Password } from "src/app/modules/swaps/shared-swaps/models/password/password";
import { WalletEncryptionService } from "src/app/modules/wallets/shared-wallets/services/wallet-encryption/wallet-encryption.service";
import { IonicStorageService } from "src/app/shared/services/ionic-storage/ionic-storage.service";
import { LoginToken } from "../../models/login-token/login-token";
import { XAuthService } from "../x-auth/x-auth.service";


@Injectable({ providedIn: 'root' })
export class LoginMigrationService {
  constructor(
    private xAuthService: XAuthService,
    private ionicStorageService: IonicStorageService,
    private walletEcryptionService: WalletEncryptionService
  ) {}

  public async migrate(aPassword: string): Promise<void> {
    const wallet = await this.walletEcryptionService.getDecryptedERC20Wallet(aPassword);
    const signedMsg = await wallet.signMessage(wallet.address);
    await this.xAuthService.saveToken(`${wallet.address}_${signedMsg}`);
    await new LoginToken(new Password(aPassword), this.ionicStorageService).save();
  }
}
