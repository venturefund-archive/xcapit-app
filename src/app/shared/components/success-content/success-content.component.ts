import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-success-content',
  template: `
    <div class="main">
      <div class="main__close-button">
        <ion-button fill="clear" appTrackClick name="Close Success" (click)="this.close()">
          <ion-icon class="main__close_button__icon" name="ux-close" color="uxsemidark"></ion-icon>
        </ion-button>
      </div>
      <div class="main__ux-success-image">
        <app-ux-center-img [imagePath]="this.data.image" [imageAlt]="this.imageAlt"></app-ux-center-img>
      </div>
      <div class="main__primary-text">
        <app-ux-title>{{ this.data?.textPrimary | translate }}</app-ux-title>
      </div>
      <div class="main__secondary-text">
        <ion-text class="ux-font-text-xs" color="uxsemidark">{{ this.data?.textSecondary | translate }}</ion-text>
      </div>
      <div class="main__actions">
        <div class="main__actions__primary">
          <ion-button
            class="ux_button"
            color="uxsecondary"
            appTrackClick
            name="Success Action Primary"
            (click)="this.primaryAction()"
          >
            {{ this.data?.namePrimaryAction | translate }}
          </ion-button>
        </div>
        <div class="main__third_text ux-font-text-xxs">
          <ion-text color="uxsemidark">{{ this.data?.textThird | translate }}</ion-text>
        </div>
        <div class="main__actions__third" *ngIf="this.data.nameThirdAction">
          <ion-button
            class="ux_button"
            appTrackClick
            name="Success Action Third"
            fill="outline"
            (click)="this.thirdAction()"
          >
            {{ this.data?.nameThirdAction | translate }}
          </ion-button>
        </div>
        <div class="main__actions__secondary" *ngIf="this.data.nameSecondaryAction">
          <ion-button
            class="action_secondary ux-link-xl underline"
            appTrackClick
            fill="clear"
            name="Success Action Secondary"
            (click)="this.secondaryAction()"
          >
            {{ this.data?.nameSecondaryAction | translate }}
          </ion-button>
        </div>
      </div>
      <div class="main__disclaimer" *ngIf="this.data.disclaimer">
        <ion-text class="ux-font-text-xs">{{ this.data.disclaimer | translate }}</ion-text>
      </div>
    </div>
  `,
  styleUrls: ['./success-content.component.scss'],
})
export class SuccessContentComponent implements OnInit {
  @Input() data: any;
  @Input() unauth: any = false;
  @Input() imageAlt = 'Success Image';
  @Output() primaryActionEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() secondaryActionEvent: EventEmitter<void> = new EventEmitter<void>();
  @Output() thirdActionEvent: EventEmitter<void> = new EventEmitter<void>();

  constructor(private navController: NavController) {}

  ngOnInit() {}

  close() {
    this.navController.navigateForward([this.data.urlClose]);
  }

  primaryAction() {
    if (this.data.urlPrimaryAction) {
      this.navController.navigateForward([this.data.urlPrimaryAction],{replaceUrl : true});
    }
    this.primaryActionEvent.emit();
  }

  secondaryAction() {
    if (this.data.urlSecondaryAction) {
      this.navController.navigateForward([this.data.urlSecondaryAction]);
    }
    this.secondaryActionEvent.emit();
  }

  thirdAction() {
    if (this.data.urlThirdAction) {
      this.navController.navigateForward([this.data.urlThirdAction]);
    }
    this.secondaryActionEvent.emit();
  }
}
