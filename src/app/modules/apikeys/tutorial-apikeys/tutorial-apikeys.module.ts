import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TutorialApikeysPage } from './tutorial-apikeys.page';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';

const routes: Routes = [
  {
    path: '',
    component: TutorialApikeysPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedApikeysModule],
  declarations: [TutorialApikeysPage]
})
export class TutorialApikeysPageModule {}
