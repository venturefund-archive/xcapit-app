import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecoveryPhraseCardComponent } from './components/recovery-phrase-card/recovery-phrase-card.component';
import { RecoveryWordButtonComponent } from './components/recovery-word-button/recovery-word-button.component';
import { RecoveryWordInputComponent } from './components/recovery-word-input/recovery-word-input.component';

@NgModule({
  declarations: [RecoveryPhraseCardComponent, RecoveryWordButtonComponent, RecoveryWordInputComponent],
  imports: [SharedModule],
  exports: [SharedModule, RecoveryPhraseCardComponent, RecoveryWordButtonComponent, RecoveryWordInputComponent],
})
export class SharedWalletsModule {}
