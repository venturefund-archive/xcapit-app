import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecoveryPhraseCardComponent } from './components/recovery-phrase-card/recovery-phrase-card.component';
import { RecoveryWordComponent } from './components/recovery-word/recovery-word.component';
import { WalletsSubheaderComponent } from './components/wallets-subheader/wallets-subheader.component';

@NgModule({
  declarations: [RecoveryPhraseCardComponent, RecoveryWordComponent, WalletsSubheaderComponent],
  imports: [SharedModule],
  exports: [SharedModule, RecoveryPhraseCardComponent, RecoveryWordComponent, WalletsSubheaderComponent],
})
export class SharedWalletsModule {}
