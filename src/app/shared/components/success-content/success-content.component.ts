import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-content',
  template: `
    <div class="main">
      <div class="main__close_button">
        <ion-button
          fill="clear"
          appTrackClick="!this.unauth"
          appTrackClickUnauth="this.unauth"
          name="Close Success"
          (click)="this.close()"
        >
          <ion-icon class="main__close_button__icon" name="ux-close" color="uxmedium"></ion-icon>
        </ion-button>
      </div>
      <div class="main__ux_success_image">
        <app-ux-success-img></app-ux-success-img>
      </div>
      <div class="main__primary_text">
        <app-ux-title>{{ this.data?.textPrimary | translate }}</app-ux-title>
      </div>
      <div class="main__secondary_text">
        <app-ux-text>{{ this.data?.textSecondary | translate }}</app-ux-text>
      </div>
      <div class="main__actions">
        <div class="main__actions__primary">
          <ion-button
            class="ux_button"
            color="uxsecondary"
            appTrackClick="!this.unauth"
            appTrackClickUnauth="this.unauth"
            name="Success Action Primary"
            (click)="this.primaryAction()"
          >
            {{ this.data?.namePrimaryAction | translate }}
          </ion-button>
        </div>
        <div class="main__third_text ux-font-lato ux-fweight-semibold ux-fsize-12">
          <ion-text>{{ this.data?.textThird | translate }}</ion-text>
        </div>
        <div class="main__actions__third">
          <ion-button
            *ngIf="this.data.nameThirdAction"
            class="ux_button"
            appTrackClick="!this.unauth"
            appTrackClickUnauth="this.unauth"
            name="Success Action Third"
            fill="outline"
            (click)="this.thirdAction()"
          >
            {{ this.data?.nameThirdAction | translate }}
          </ion-button>
        </div>
        <div class="main__actions__secondary" *ngIf="this.data.nameSecondaryAction">
          <ion-button
            class="ux_button"
            appTrackClick="!this.unauth"
            appTrackClickUnauth="this.unauth"
            fill="clear"
            name="Success Action Secondary"
            (click)="this.secondaryAction()"
          >
            {{ this.data?.nameSecondaryAction | translate }}
          </ion-button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./success-content.component.scss'],
})
export class SuccessContentComponent implements OnInit {
  @Input() data: any;
  @Input() unauth: any = false;
  @Output() primaryActionEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() secondaryActionEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() thirdActionEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(private router: Router) {}

  ngOnInit() {}

  close() {
    this.router.navigate([this.data.urlClose]);
  }

  primaryAction() {
    if (this.data.urlPrimaryAction) {
      this.router.navigate([this.data.urlPrimaryAction]);
    }
    this.primaryActionEvent.emit();
  }

  secondaryAction() {
    if (this.data.urlSecondaryAction) {
      this.router.navigate([this.data.urlSecondaryAction]);
    }
    this.secondaryActionEvent.emit();
  }

  thirdAction() {
    if (this.data.urlThirdAction) {
      this.router.navigate([this.data.urlThirdAction]);
    }
    this.secondaryActionEvent.emit();
  }
}
