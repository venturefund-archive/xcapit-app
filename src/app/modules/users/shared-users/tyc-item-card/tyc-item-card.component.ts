import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ModalAsAlertComponent } from 'src/app/shared/components/modal-as-alert/modal-as-alert.component';

@Component({
  selector: 'app-tyc-item-card',
  template: `<ion-item appTrackClick lines="none" class="ion-no-padding tcic">
    <div class="tcic__wrapper">
      <div class="tcic__wrapper__content">
        <div class="tcic__wrapper__content__title">
          <img [src]="this.item.img" (click)="showAlert()" />
          <ion-text class="ux-font-text-lg title" (click)="itemNavigateTo()">{{
            this.item.title | translate
          }}</ion-text>
        </div>
        <div
          class="tcic__wrapper__content__subtitle"
          *ngFor="let item of this.item.items"
          (click)="subItemNavigateTo(item.route)"
        >
          <ion-text class="ux-font-text-xxs">{{ this.item.subtitle | translate }}</ion-text>
          <ion-icon name="chevron-forward-outline" color="info"></ion-icon>
        </div>
      </div>
      <div class="tcic__wrapper__action" *ngIf="!this.item.items">
        <ion-icon name="chevron-forward-outline" color="info"></ion-icon>
      </div>
    </div>
  </ion-item> `,
  styleUrls: ['./tyc-item-card.component.scss'],
})
export class TycItemCardComponent implements OnInit {
  @Input() item: any;
  @Output() openBrowser = new EventEmitter<any>();
  @Output() itemToRemove = new EventEmitter<any>();
  message: string;

  constructor(private modalController: ModalController, private translate: TranslateService) {}

  ngOnInit() {
    this.setCorrectText();
  }

  itemNavigateTo() {
    if (this.item.items === undefined) {
      this.openBrowser.emit(this.item.route);
    }
  }

  subItemNavigateTo(route) {
    this.openBrowser.emit(route);
  }

  removeTyC() {
    this.itemToRemove.emit(this.item);
  }

  async showAlert(): Promise<any> {
    const modal = await this.modalController.create({
      component: ModalAsAlertComponent,
      componentProps: {
        title: this.translate.instant('profiles.user_profile_menu.terms_and_conditions.remove_tyc.title'),
        message: this.message,
        textCancelButton: this.translate.instant(
          'profiles.user_profile_menu.terms_and_conditions.remove_tyc.cancel_button'
        ),
        textConfirmButton: this.translate.instant(
          'profiles.user_profile_menu.terms_and_conditions.remove_tyc.confirm_button'
        ),
      },
      cssClass: 'ux-modal-as-alert',
      backdropDismiss: false,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data === 'confirm') {
      this.removeTyC();
    }
  }

  setCorrectText() {
    if (this.item.name !== 'kripton') {
      this.message = this.translate.instant(
        'profiles.user_profile_menu.terms_and_conditions.remove_tyc.message_others_providers'
      );
    } else {
      this.message = this.translate.instant(
        'profiles.user_profile_menu.terms_and_conditions.remove_tyc.message_to_kripton'
      );
    }
  }
}
