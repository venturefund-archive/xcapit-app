import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecoveryPhraseCardComponent } from './components/recovery-phrase-card/recovery-phrase-card.component';
import { RecoveryWordComponent } from './components/recovery-word/recovery-word.component';
import { WalletBalanceCardItemComponent } from './components/wallet-balance-card-item/wallet-balance-card-item.component';
import { WalletTransactionCardItemComponent } from './components/wallet-transaction-card-item/wallet-transaction-card-item.component';
import { WalletTransactionCardComponent } from './components/wallet-transaction-card/wallet-transaction-card.component';
import { WalletsSubheaderComponent } from './components/wallets-subheader/wallets-subheader.component';
import { TransactionSummaryCardComponent } from './components/transaction-summary-card/transaction-summary-card.component';
import { WalletPasswordComponent } from './components/wallet-password/wallet-password.component';
import { WalletSubheaderButtonsComponent } from './components/wallet-subheader-buttons/wallet-subheader-buttons.component';
import { ItemsCoinGroupComponent } from './components/items-coin-group/items-coin-group.component';
import { ItemCoinComponent } from './components/item-coin/item-coin.component';
import { NftCardComponent } from './components/nft-card/nft-card.component';
import { WalletPasswordSmallComponent } from './components/wallet-password-small/wallet-password-small.component';
import { StartInvestingComponent } from './components/start-investing/start-investing.component';
import { WalletConnectQrScanComponent } from './components/wallet-connect-qr-scan/wallet-connect-qr-scan.component';
import { NftCardSkeletonComponent } from './components/nft-card/nft-card-skeleton/nft-card-skeleton.component';
import { InformativeCardComponent } from './components/informative-card/informative-card.component';
import { WalletAdviceComponent } from './components/wallet-advice/wallet-advice.component';
import { SkipBackupModalComponent } from './components/skip-backup-modal/skip-backup-modal.component';
import { InfoPhraseModalComponent } from './components/info-phrase-modal/info-phrase-modal.component';
import { WarningBackupModalComponent } from './components/warning-backup-modal/warning-backup-modal.component';
import { SwapInProgressModalComponent } from './components/swap-in-progress-modal/swap-in-progress-modal.component';
import { ShareTransactionDetailComponent } from './components/share-transaction-detail/share-transaction-detail.component';
import { AccordionTokensComponent } from './components/accordion-tokens/accordion-tokens.component';
import { NoActiveTokensCardComponent } from './components/no-active-tokens-card/no-active-tokens-card.component';
import { TransactionInProgressCardComponent } from './components/transaction-in-progress/transaction-in-progress-card/transaction-in-progress-card.component';
import { SwiperModule } from 'swiper/angular';
import { HomeSlidesComponent } from './components/home-slides/home-slides.component';
import { InitiationWalletStepCardComponent } from './components/initiation-wallet-step-card/initiation-wallet-step-card.component';
import { WalletTransactionSkeletonCardComponent } from './components/wallet-transaction-card/wallet-transaction-skeleton-card/wallet-transaction-skeleton-card.component';
import { TransactionInProgressComponent } from './components/transaction-in-progress/transaction-in-progress.component';

@NgModule({
  declarations: [
    WalletAdviceComponent,
    NftCardSkeletonComponent,
    RecoveryPhraseCardComponent,
    RecoveryWordComponent,
    WalletsSubheaderComponent,
    WalletBalanceCardItemComponent,
    WalletTransactionCardComponent,
    WalletTransactionCardItemComponent,
    TransactionSummaryCardComponent,
    WalletPasswordComponent,
    WalletSubheaderButtonsComponent,
    ItemsCoinGroupComponent,
    ItemCoinComponent,
    NftCardComponent,
    WalletPasswordSmallComponent,
    StartInvestingComponent,
    WalletConnectQrScanComponent,
    InformativeCardComponent,
    SkipBackupModalComponent,
    InfoPhraseModalComponent,
    WarningBackupModalComponent,
    SwapInProgressModalComponent,
    ShareTransactionDetailComponent,
    AccordionTokensComponent,
    NoActiveTokensCardComponent,
    TransactionInProgressCardComponent,
    HomeSlidesComponent,
    InitiationWalletStepCardComponent,
    WalletTransactionSkeletonCardComponent,
    TransactionInProgressComponent,
  ],
  imports: [SharedModule, SwiperModule],
  exports: [
    SharedModule,
    WalletAdviceComponent,
    NftCardSkeletonComponent,
    RecoveryPhraseCardComponent,
    RecoveryWordComponent,
    WalletsSubheaderComponent,
    WalletBalanceCardItemComponent,
    WalletTransactionCardComponent,
    WalletTransactionCardItemComponent,
    TransactionSummaryCardComponent,
    WalletPasswordComponent,
    WalletSubheaderButtonsComponent,
    ItemsCoinGroupComponent,
    ItemCoinComponent,
    NftCardComponent,
    WalletPasswordSmallComponent,
    StartInvestingComponent,
    WalletConnectQrScanComponent,
    InformativeCardComponent,
    SkipBackupModalComponent,
    InfoPhraseModalComponent,
    WarningBackupModalComponent,
    SwapInProgressModalComponent,
    ShareTransactionDetailComponent,
    AccordionTokensComponent,
    NoActiveTokensCardComponent,
    TransactionInProgressCardComponent,
    HomeSlidesComponent,
    InitiationWalletStepCardComponent,
    WalletTransactionSkeletonCardComponent,
    TransactionInProgressComponent,
  ],
})
export class SharedWalletsModule {}
