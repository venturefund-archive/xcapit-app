import { NgModule } from '@angular/core';
import { TutorialApikeysPage } from './tutorial-apikeys.page';
import { RouterModule, Routes } from '@angular/router';
import { SharedApikeysModule } from '../shared-apikeys/shared-apikeys.module';

const routes: Routes = [
  {
    path: '',
    component: TutorialApikeysPage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedApikeysModule],
  declarations: [TutorialApikeysPage],
})
export class TutorialApikeysPageModule {}
