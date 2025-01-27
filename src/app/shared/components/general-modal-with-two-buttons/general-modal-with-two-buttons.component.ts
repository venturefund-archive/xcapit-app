import { Component } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { BrowserService } from '../../services/browser/browser.service';
import { TrackService } from '../../services/track/track.service';

@Component({
  selector: 'app-general-modal-with-two-buttons',
  template: `
    <div class="modal-content">
      <div class="main">
        <div class="main__close_button">
          <ion-button
            class="ion-no-padding"
            appTrackClick
            name="Close"
            slot="icon-only"
            fill="clear"
            (click)="this.actionCloseButton()"
          >
            <ion-icon class="main__close_button__icon" name="ux-close"></ion-icon>
          </ion-button>
        </div>
        <div class="main__body">
          <div class="main__body__content">
            <div class="main__body__content__img" *ngIf="this.logo">
              <img [src]="this.logo" />
            </div>
            <div class="ux-text-base main__body__content__header">
              <ion-text *ngIf="this.highlightedHeader" class="highlighted">{{ this.highlightedHeader }}</ion-text>
              <div>
                <ion-text>{{ this.header }}</ion-text>
              </div>
            </div>
            <div *ngIf="this.link" class="ux-font-header-titulo main__body__content__link">
              <ion-text>{{ this.information }}</ion-text>
            </div>
            <div *ngIf="this.link" class="main__body__content__link">
              <ion-icon name="globe-outline" color="info"></ion-icon>
              <ion-text name="Go To More Info" class="ux-link-xs" (click)="this.navigateToMoreInfo()">
                {{ this.link }}
              </ion-text>
            </div>
            <div class="main__actions">
              <div class="main__actions__first-button">
                <ion-button
                  class="ux_button ion-no-margin"
                  appTrackClick
                  name="firstButton"
                  color="secondary"
                  size="large"
                  expand="block"
                  (click)="this.actionFirstButton()"
                >
                  {{ this.firstButton }}
                </ion-button>
              </div>
              <div class="main__actions__second-button">
                <ion-button
                  class="ux_button main__actions__button ion-no-margin"
                  appTrackClick
                  name="secondButton"
                  [ngClass]="{ buyDeposit: this.isBuyOrDeposit }"
                  size="large"
                  color="secondary"
                  expand="block"
                  [fill]="this.isBuyOrDeposit"
                  (click)="this.actionSecondButton()"
                >
                  {{ this.secondButton }}
                </ion-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./general-modal-with-two-buttons.component.scss'],
})
export class GeneralModalWithTwoButtonsComponent {
  logo: string;
  highlightedHeader: string;
  header: string;
  information: string;
  link: string;
  firstButton: string;
  urlFirstButton: string;
  eventFirstButton: string;
  secondButton: string;
  eventSecondButton: string;
  urlSecondButton: string;
  eventCloseButton: string;
  isBuyOrDeposit: boolean;

  constructor(
    private modalController: ModalController,
    private browserService: BrowserService,
    private trackService: TrackService,
    private navController: NavController
  ) {}

  close() {
    this.modalController.dismiss();
  }

  async navigateToMoreInfo() {
    await this.browserService.open({ url: this.link });
  }

  actionFirstButton() {
    this.setEvent(this.eventFirstButton);
    this.navController.navigateForward(this.urlFirstButton);
    this.close();
  }

  actionSecondButton() {
    this.setEvent(this.eventSecondButton);
    this.navController.navigateForward(this.urlSecondButton);
    this.close();
  }

  actionCloseButton() {
    this.setEvent(this.eventCloseButton);
    this.close();
  }

  setEvent(event) {
    this.trackService.trackEvent({
      eventLabel: `${event}`,
    });
  }
}
