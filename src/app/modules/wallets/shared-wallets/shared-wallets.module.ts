import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CoinSelectorComponent } from './components/coin-selector/coin-selector.component';
import { RecoveryPhraseCardComponent } from './components/recovery-phrase-card/recovery-phrase-card.component';
import { RecoveryWordComponent } from './components/recovery-word/recovery-word.component';
import { WalletBalanceCardItemComponent } from './components/wallet-balance-card-item/wallet-balance-card-item.component';
import { WalletTransactionCardItemComponent } from './components/wallet-transaction-card-item/wallet-transaction-card-item.component';
import { WalletTransactionCardComponent } from './components/wallet-transaction-card/wallet-transaction-card.component';
import { WalletsSubheaderComponent } from './components/wallets-subheader/wallets-subheader.component';
import { AddressInputCardComponent } from './components/address-input-card/address-input-card.component';
import { SendAmountInputCardComponent } from './components/send-amount-input-card/send-amount-input-card.component';
import { TransactionSummaryCardComponent } from './components/transaction-summary-card/transaction-summary-card.component';
import { WalletPasswordComponent } from './components/wallet-password/wallet-password.component';
import { WalletSubheaderButtonsComponent } from './components/wallet-subheader-buttons/wallet-subheader-buttons.component';
import { ItemsCoinGroupComponent } from './components/items-coin-group/items-coin-group.component';
import { ItemCoinComponent } from './components/item-coin/item-coin.component';
import { NftCardComponent } from './components/nft-card/nft-card.component';
import { WalletPasswordSmallComponent } from './components/wallet-password-small/wallet-password-small.component';
import { StartInvestingComponent } from './components/start-investing/start-investing.component';
import { WalletConnectSignRequestComponent } from './components/wallet-connect-sign-request/wallet-connect-sign-request.component';
import { WalletConnectQrScanComponent } from './components/wallet-connect-qr-scan/wallet-connect-qr-scan.component';
import { SuitePipe } from './pipes/suite.pipe';
import { NftCardSkeletonComponent } from './components/nft-card/nft-card-skeleton/nft-card-skeleton.component';

@NgModule({
  declarations: [
    NftCardSkeletonComponent,
    CoinSelectorComponent,
    RecoveryPhraseCardComponent,
    RecoveryWordComponent,
    WalletsSubheaderComponent,
    WalletBalanceCardItemComponent,
    WalletTransactionCardComponent,
    WalletTransactionCardItemComponent,
    AddressInputCardComponent,
    SendAmountInputCardComponent,
    TransactionSummaryCardComponent,
    WalletPasswordComponent,
    WalletSubheaderButtonsComponent,
    ItemsCoinGroupComponent,
    ItemCoinComponent,
    NftCardComponent,
    WalletPasswordSmallComponent,
    StartInvestingComponent,
    WalletConnectSignRequestComponent,
    WalletConnectQrScanComponent,
    SuitePipe,
  ],
  imports: [SharedModule],
  exports: [
    SharedModule,
    CoinSelectorComponent,
    NftCardSkeletonComponent,
    RecoveryPhraseCardComponent,
    RecoveryWordComponent,
    WalletsSubheaderComponent,
    WalletBalanceCardItemComponent,
    WalletTransactionCardComponent,
    WalletTransactionCardItemComponent,
    AddressInputCardComponent,
    SendAmountInputCardComponent,
    TransactionSummaryCardComponent,
    WalletPasswordComponent,
    WalletSubheaderButtonsComponent,
    ItemsCoinGroupComponent,
    ItemCoinComponent,
    NftCardComponent,
    WalletPasswordSmallComponent,
    StartInvestingComponent,
    WalletConnectSignRequestComponent,
    WalletConnectQrScanComponent,
  ],
})
export class SharedWalletsModule {}
