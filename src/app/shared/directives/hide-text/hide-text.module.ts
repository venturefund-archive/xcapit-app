import { NgModule } from '@angular/core';
import { HideTextDirective } from './hide-text.directive';


@NgModule({
  declarations: [
    HideTextDirective,
  ],
  exports: [
    HideTextDirective
  ]
})
export class HideTextModule {}
