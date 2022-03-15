import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-step',
  template: `
    <div class="step__content_slide">
      <div class="step__content_slide__slide_step_show">
        <ion-text class="ux-font-text-xs">{{ this.actualStep }} de {{ this.sliderLength }}</ion-text>
      </div>
      <div class="step__content_slide__text">
      <app-xcapit-logo [whiteLogo]="false"></app-xcapit-logo>
        <ion-text class="step__content_slide__text__primary_text ux-font-text-xl">
          {{ this.title }}
        </ion-text>
        <ion-text class="step__content_slide__text__secondary_text ux-font-text-base">
          {{ this.subtitle }}
        </ion-text>
      </div>
      <div class="step__content_slide__button_back slide-button" *ngIf="this.actualStep > 1">
        <ion-button
          appTrackClick
          name="Ion Slide Back Button"
          shape="round"
          size="small"
          slots="icon-only"
          color="secondary"
          (click)="this.slideBack()"
        >
          <ion-icon name="ux-long-arrow"></ion-icon>
        </ion-button>
      </div>
      <div class="step__content_slide__button_next slide-button" *ngIf="this.actualStep < this.sliderLength">
        <ion-button
          appTrackClick
          name="Ion Slide Next Button"
          shape="round"
          size="small"
          slots="icon-only"
          color="secondary"
          (click)="this.slideNext()"
        >
          <ion-icon name="ux-long-arrow"></ion-icon>
        </ion-button>
      </div>
      <div class="step__content_slide__image">
        <img [src]="this.imagePath" alt="" />
      </div>
      <div class="step__content_slide__button_skip" *ngIf="this.actualStep < this.sliderLength">
        <ion-button
          (click)="this.finishOnboarding()"
          class="ux-link-xs"
          appTrackClick
          name="Skip Onboarding"
          type="button"
          fill="clear"
        >
          {{ 'tutorials.first_steps.skip_button' | translate }}
        </ion-button>
      </div>
      <div class="step__content_slide__button_finish" *ngIf="this.actualStep === this.sliderLength">
        <ion-button
          appTrackClick
          name="Finish Onboarding"
          class="ux_button finish"
          type="button"
          color="secondary"
          expand="block"
          size="medium"
          (click)="this.finishOnboarding()"
        >
          {{ 'tutorials.first_steps.finish_button' | translate }}
        </ion-button>
      </div>
    </div>
  `,
  styleUrls: ['./step.component.scss'],
})
export class StepComponent implements OnInit {
  @Input() actualStep: number;
  @Input() sliderLength: number;
  @Input() imagePath: string;
  @Input() title: string;
  @Input() subtitle: string;
  @Output() slideBackEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() slideNextEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() finishEvent: EventEmitter<void> = new EventEmitter<void>();
  constructor() {}

  ngOnInit() {}

  slideNext() {
    this.slideNextEvent.emit();
  }
  slideBack() {
    this.slideBackEvent.emit();
  }

  finishOnboarding() {
    this.finishEvent.emit();
  }
}
