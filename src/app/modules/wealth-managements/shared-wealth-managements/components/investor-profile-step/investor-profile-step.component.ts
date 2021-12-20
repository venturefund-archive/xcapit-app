import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-investor-profile-step',
  template: `
    <div class="investor_step__content_slide ux_main">
      <div class="ux_content">
        <div class="investor_step__content_slide__slide_step_show">
          <ion-text class="ux-font-text-xs">{{ this.actualStep }} de {{ this.sliderLength }}</ion-text>
        </div>
        <div class="investor_step__content_slide__image text-center">
          <img [src]="this.imagePath" alt="" />
        </div>
        <div class="investor_step__content_slide__text">
          <ion-text class="investor_step__content_slide__text__primary_text ux-font-text-lg">
            {{ this.title | translate }}
          </ion-text>
          <ion-text class="investor_step__content_slide__text__secondary_text ux-font-text-base">
            {{ this.subtitle | translate }}
          </ion-text>
        </div>
      </div>
      <div class="ux_footer ">
        <div class="button-next">
          <ion-button
            class="ux_button"
            appTrackClick
            name="Select Profile"
            type="submit"
            color="uxsecondary"
            size="large"
            (click)="this.selectProfile(this.id)"
          >
            {{ 'wealth_managements.about_investor_profile.button_select' | translate }}
          </ion-button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./investor-profile-step.component.scss'],
})
export class InvestorProfileStepComponent implements OnInit {
  @Input() actualStep: number;
  @Input() sliderLength = 3;
  @Input() imagePath: string;
  @Input() id: number;
  @Input() title: string;
  @Input() subtitle: string;
  @Output() setProfileEvent: EventEmitter<number> = new EventEmitter<number>();

  constructor() {}

  ngOnInit() {}

  selectProfile(id: number) {
    this.setProfileEvent.emit(id);
  }
}
