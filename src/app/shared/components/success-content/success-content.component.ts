import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success-content',
  template: `
    <div class="main">
      <div class="main__close_button">
        <ion-button
          fill="clear"
          appTrackClick
          name="Close Success"
          (click)="this.close()"
        >
          <ion-icon
            class="main__close_button__icon"
            name="ux-close"
            color="uxmedium"
          ></ion-icon>
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
            appTrackClick
            name="Success Action Primary"
            (click)="this.primaryAction()"
          >
            {{ this.data?.namePrimaryAction | translate }}
          </ion-button>
        </div>
        <div
          class="main__actions__secondary"
          *ngIf="this.data.nameSecondaryAction"
        >
          <ion-button
            class="ux_button"
            appTrackClick
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
  styleUrls: ['./success-content.component.scss']
})
export class SuccessContentComponent implements OnInit {
  @Input() data: any;

  constructor(private router: Router) {}

  ngOnInit() {}

  close() {
    this.router.navigate([this.data.urlClose]);
  }

  primaryAction() {
    this.router.navigate([this.data.urlPrimaryAction]);
  }

  secondaryAction() {
    this.router.navigate([this.data.urlSecondaryAction]);
  }
}
