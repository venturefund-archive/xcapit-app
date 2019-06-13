import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BinanceTutorialModalComponent } from './components/binance-tutorial-modal/binance-tutorial-modal.component';
import { CaTutorialModalComponent } from './components/ca-tutorial-modal/ca-tutorial-modal.component';
import { BinanceAddressTutorialModalComponent } from './components/binance-address-tutorial-modal/binance-address-tutorial-modal.component';

@NgModule({
  declarations: [
    BinanceTutorialModalComponent,
    CaTutorialModalComponent,
    BinanceAddressTutorialModalComponent
  ],
  imports: [SharedModule],
  entryComponents: [
    BinanceTutorialModalComponent,
    CaTutorialModalComponent,
    BinanceAddressTutorialModalComponent
  ],
  exports: [
    SharedModule,
    BinanceTutorialModalComponent,
    CaTutorialModalComponent,
    BinanceAddressTutorialModalComponent
  ]
})
export class SharedTutorialsModule {}
