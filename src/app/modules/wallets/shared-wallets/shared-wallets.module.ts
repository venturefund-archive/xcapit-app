import { ExpandableInvestmentInfoComponent } from './components/expandable-investment-info/expandable-investment-info.component';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecoveryPhraseCardComponent } from './components/recovery-phrase-card/recovery-phrase-card.component';
import { RecoveryWordComponent } from './components/recovery-word/recovery-word.component';
import { WalletBalanceCardItemComponent } from './components/wallet-balance-card-item/wallet-balance-card-item.component';
import { WalletBalanceCardComponent } from './components/wallet-balance-card/wallet-balance-card.component';
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
import { ComingSoonInvestmentsComponent } from './components/coming-soon-investments/coming-soon-investments.component';
import { SuitePipe } from './pipes/suite.pipe';

@NgModule({
  declarations: [
    RecoveryPhraseCardComponent,
    RecoveryWordComponent,
    WalletsSubheaderComponent,
    WalletBalanceCardComponent,
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
    ComingSoonInvestmentsComponent,
    ExpandableInvestmentInfoComponent,
    SuitePipe,
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
    ComingSoonInvestmentsComponent,
    ExpandableInvestmentInfoComponent,
  ],
})
export class SharedWalletsModule {}
