import { NgModule } from '@angular/core';
import { TutorialExchangePage } from './tutorial-exchange.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';

const routes: Routes = [
  {
    path: '',
    component: TutorialExchangePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedApikeysModule],
  declarations: [TutorialExchangePage],
})
export class TutorialExchangePageModule {}
