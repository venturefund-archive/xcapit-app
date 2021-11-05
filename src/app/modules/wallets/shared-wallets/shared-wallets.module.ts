import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecoveryPhraseCardComponent } from './components/recovery-phrase-card/recovery-phrase-card.component';
import { RecoveryWordComponent } from './components/recovery-word/recovery-word.component';
import { WalletBalanceCardItemComponent } from './components/wallet-balance-card-item/wallet-balance-card-item.component';
import { WalletBalanceCardComponent } from './components/wallet-balance-card/wallet-balance-card.component';
import { WalletTransactionCardItemComponent } from './components/wallet-transaction-card-item/wallet-transaction-card-item.component';
import { WalletTransactionCardComponent } from './components/wallet-transaction-card/wallet-transaction-card.component';
import { WalletsSubheaderComponent } from './components/wallets-subheader/wallets-subheader.component';
import { NetworkSelectCardComponent } from './components/network-select-card/network-select-card.component';
import { AddressInputCardComponent } from './components/address-input-card/address-input-card.component';
import { AmountInputCardComponent } from './components/amount-input-card/amount-input-card.component';
import { TransactionSummaryCardComponent } from './components/transaction-summary-card/transaction-summary-card.component';
import { WalletPasswordComponent } from './components/wallet-password/wallet-password.component';
import { WalletSubheaderButtonsComponent } from './components/wallet-subheader-buttons/wallet-subheader-buttons.component';
import { WalletPasswordSmallComponent } from './components/wallet-password-small/wallet-password-small.component';

import { ClaimNftCardComponent } from './components/claim-nft-card/claim-nft-card.component';
@NgModule({
  declarations: [
    RecoveryPhraseCardComponent,
    RecoveryWordComponent,
    WalletsSubheaderComponent,
    WalletBalanceCardComponent,
    WalletBalanceCardItemComponent,
    WalletTransactionCardComponent,
    WalletTransactionCardItemComponent,
    NetworkSelectCardComponent,
    AddressInputCardComponent,
    AmountInputCardComponent,
    TransactionSummaryCardComponent,
    WalletPasswordComponent,
    WalletSubheaderButtonsComponent,
    ClaimNftCardComponent,
    WalletPasswordSmallComponent,
  ],
  imports: [SharedModule],
  exports: [
    SharedModule,
    RecoveryPhraseCardComponent,
    RecoveryWordComponent,
    WalletsSubheaderComponent,
    WalletBalanceCardComponent,
    WalletBalanceCardItemComponent,
    WalletTransactionCardComponent,
    WalletTransactionCardItemComponent,
    NetworkSelectCardComponent,
    AddressInputCardComponent,
    AmountInputCardComponent,
    TransactionSummaryCardComponent,
    WalletPasswordComponent,
    WalletSubheaderButtonsComponent,
    ClaimNftCardComponent,
    WalletPasswordSmallComponent,
  ],
})
export class SharedWalletsModule {}
