import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecoveryPhraseCardComponent } from './components/recovery-phrase-card/recovery-phrase-card.component';
import { RecoveryWordComponent } from './components/recovery-word/recovery-word.component';
import { VerifyPhraseCardComponent } from './components/verify-phrase-card/verify-phrase-card.component';
import { VerifyWordButtonComponent } from './components/verify-word-button/verify-word-button.component';

@NgModule({
  declarations: [
    RecoveryPhraseCardComponent,
    RecoveryWordComponent,
    VerifyWordButtonComponent,
    VerifyWordButtonComponent,
    VerifyPhraseCardComponent,
  ],
  imports: [SharedModule],
  exports: [
    SharedModule,
    RecoveryPhraseCardComponent,
    RecoveryWordComponent,
    VerifyWordButtonComponent,
    VerifyWordButtonComponent,
    VerifyPhraseCardComponent,
  ],
})
export class SharedWalletsModule {}
