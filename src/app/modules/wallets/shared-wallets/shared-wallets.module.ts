import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecoveryPhraseCardComponent } from './components/recovery-phrase-card/recovery-phrase-card.component';
import { RecoveryWordComponent } from './components/recovery-word/recovery-word.component';
import { WalletBalanceCardItemComponent } from './components/wallet-balance-card-item/wallet-balance-card-item.component';
import { WalletBalanceCardComponent } from './components/wallet-balance-card/wallet-balance-card.component';
import { WalletTransactionCardItemComponent } from './components/wallet-transaction-card-item/wallet-transaction-card-item.component';
import { WalletTransactionCardComponent } from './components/wallet-transaction-card/wallet-transaction-card.component';
import { WalletsSubheaderComponent } from './components/wallets-subheader/wallets-subheader.component';
import { IconButtonCardComponent } from './components/icon-button-card/icon-button-card.component';

@NgModule({
  declarations: [
    RecoveryPhraseCardComponent,
    RecoveryWordComponent,
    WalletsSubheaderComponent,
    IconButtonCardComponent,
    WalletBalanceCardComponent,
    WalletBalanceCardItemComponent,
    WalletTransactionCardComponent,
    WalletTransactionCardItemComponent,
  ],
  imports: [SharedModule],
  exports: [
    SharedModule,
    RecoveryPhraseCardComponent,
    RecoveryWordComponent,
    WalletsSubheaderComponent,
    IconButtonCardComponent,
    WalletBalanceCardComponent,
    WalletBalanceCardItemComponent,
    WalletTransactionCardComponent,
    WalletTransactionCardItemComponent,
  ],
})
export class SharedWalletsModule {}
