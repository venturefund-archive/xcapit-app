import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [{ path: '**', redirectTo: '/tabs/funds' }];

@NgModule({
  imports: [RouterModule.forChild(routes)]
})
export class WildcardRoutingModule {}
