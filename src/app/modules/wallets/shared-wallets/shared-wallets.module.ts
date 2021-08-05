import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { WalletsSubheaderComponent } from './components/wallets-subheader/wallets-subheader.component';

@NgModule({
  declarations: [WalletsSubheaderComponent],
  imports: [SharedModule],
  exports: [SharedModule, WalletsSubheaderComponent],
})
export class SharedWalletsModule {}
