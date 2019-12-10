import { NgModule } from '@angular/core';

import { TabsRoutingModule } from './tabs-routing.module';
import { TabsComponent } from './tabs/tabs.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [TabsComponent],
  imports: [
    SharedModule,
    TabsRoutingModule
  ]
})
export class TabsModule { }
