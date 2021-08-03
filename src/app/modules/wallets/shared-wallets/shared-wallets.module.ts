import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecoveryPhraseCardComponent } from './components/recovery-phrase-card/recovery-phrase-card.component';
import { RecoveryWordComponent } from './components/recovery-word/recovery-word.component';

@NgModule({
  declarations: [RecoveryPhraseCardComponent, RecoveryWordComponent],
  imports: [SharedModule],
  exports: [SharedModule, RecoveryPhraseCardComponent, RecoveryWordComponent],
})
export class SharedWalletsModule {}
