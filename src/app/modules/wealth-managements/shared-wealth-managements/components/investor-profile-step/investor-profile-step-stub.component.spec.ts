import { Component, EventEmitter, Input, Output } from '@angular/core';
import { InvestorProfileStepComponent } from './investor-profile-step.component';

@Component({
  selector: 'app-investor-profile-step',
  template: '',
  providers: [
    {
      provide: InvestorProfileStepComponent,
      useClass: InvestorProfileStepStubComponent,
    },
  ],
})
export class InvestorProfileStepStubComponent {
  @Input() actualStep: number;
  @Input() sliderLength = 3;
  @Input() imagePath: string;
  @Input() id: number;
  @Input() title: string;
  @Input() subtitle: string;
  @Output() setProfileEvent: EventEmitter<number> = new EventEmitter<number>();
}
