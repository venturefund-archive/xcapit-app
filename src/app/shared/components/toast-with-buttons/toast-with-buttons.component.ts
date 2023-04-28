import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-toast-with-buttons',
  template: `<div class="modal-content">
    <div class="twb">
      <ion-icon color="warningdark" (click)="this.close()" class="twb__close_button" name="close-outline"></ion-icon>
      <div class="content">
        <div class="content__icon-warning">
          <ion-icon name="ux-warning-circle-outline" color="warningdark"></ion-icon>
        </div>
        <div class="content__text ux-font-text-xs">
          <ion-text color="warningdark">{{ this.text | translate }}</ion-text>
        </div>
      </div>

      <div class="content__buttons">
        <div *ngIf="!this.primaryButtonText" style="width: 139px;"></div>
        <ion-button
          *ngIf="this.primaryButtonText"
          (click)="this.primaryAction()"
          class="ux-link-xl"
          appTrackClick
          name="first_action"
          type="button"
          fill="clear"
        >
          {{ this.primaryButtonText | translate }}
        </ion-button>
        <ion-button
          (click)="this.secondaryAction()"
          class="ux-link-xl"
          appTrackClick
          name="secondary_action"
          type="button"
          fill="clear"
        >
          {{ this.secondaryButtonText | translate }}
        </ion-button>
      </div>
    </div>
  </div> `,
  styleUrls: ['./toast-with-buttons.component.scss'],
})
export class ToastWithButtonsComponent implements OnInit {
  @Input() text: string;
  @Input() primaryButtonText: string;
  @Input() secondaryButtonText: string;
  @Input() primaryButtonRoute: string;
  @Input() secondaryButtonRoute: string;

  @Output() primaryActionEvent = new EventEmitter<void>();
  @Output() secondaryActionEvent = new EventEmitter<void>();

  constructor(private modalController: ModalController, private navController: NavController) {}

  ngOnInit() {}

  close() {
    this.modalController.dismiss();
  }

  primaryAction() {
    this.close();
    if (this.primaryButtonRoute) this.navController.navigateForward([this.primaryButtonRoute]);
    this.primaryActionEvent.emit();
  }

  secondaryAction() {
    this.close();
    if (this.primaryButtonRoute) this.navController.navigateForward([this.secondaryButtonRoute]);
    this.secondaryActionEvent.emit();
  }
}
