import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedProfilesModule } from '../shared-profiles/shared-profiles.module';
import { WalletsAgendaHomePage } from './wallets-agenda-home.page';

const routes: Routes = [
  {
    path: '',
    component: WalletsAgendaHomePage,
  },
];

@NgModule({
  imports: [SharedProfilesModule, RouterModule.forChild(routes)],
  declarations: [WalletsAgendaHomePage],
})
export class WalletsAgendaHomePageModule {}
