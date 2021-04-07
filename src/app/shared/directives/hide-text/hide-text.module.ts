import { NgModule } from '@angular/core';
import { HideTextPipe } from '../../pipes/hide-text/hide-text.pipe';
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
