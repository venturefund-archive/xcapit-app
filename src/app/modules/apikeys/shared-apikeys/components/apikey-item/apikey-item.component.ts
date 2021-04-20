import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  AbstractControl,
} from '@angular/forms';
import {
  AlertController,
  ModalController,
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from 'src/app/shared/services/toast/toast.service';
import { ApiApikeysService } from '../../services/api-apikeys/api-apikeys.service';
import { ApikeysEditModalComponent } from '../apikeys-edit-modal/apikeys-edit-modal.component';

@Component({
  selector: 'app-apikey-item',
  template: `
    <div class="cib ">
      <div class="cib__main">
        <div class="cib__main__content ion-padding">
          <div
            class="cib__main__content__title ux-font-gilroy ux-fweight-extrabold ux-fsize-22"
          >
            <ion-text color="uxdark">{{ this.alias }}</ion-text
            >
            <ion-button
              appTrackClick
              name="EditButton"
              fill="clear"
              size="small"
              class="cib__buttons__editButton"
              (click)="openModal()"
            >
              <ion-icon
                class="cib__buttons__icon"
                style="zoom:1.1;"
                name="pencil-sharp"
              ></ion-icon>
            </ion-button>
          </div>
          <div
            class="cib__main__content__text ux-font-lato ux-fweight-regular ux-fsize-14"
          >
            <ion-text *ngIf="this.fundName">
              <strong class="cib__main__fund_text">{{
                'apikeys.card_apikeys.content' | translate
              }}</strong>
              {{ this.fundName }}
            </ion-text>
            <ion-text *ngIf="!this.fundName">
              <strong class="cib__main__fund_text">{{
                'apikeys.card_apikeys.no_fund_text' | translate
              }}</strong>
            </ion-text>
          </div>
        </div>
      </div>

      <div class="cib__footer">
        <ion-button
          *ngIf="!this.fundName"
          appTrackClick
          name="removeButton"
          fill="clear"
          size="small"
          class="cib__footer__buttons__removeButton"
          (click)="showAlert(this.id)"
        >
          <ion-icon name="trash-sharp"></ion-icon>
        </ion-button>
        <ion-button
          *ngIf="!this.fundName"
          appTrackClick
          name="Manage"
          fill="clear"
          size="small"
          class="cib__footer__more_info ux-font-lato ux-fweight-semibold ux-fsize-14"
          (click)="this.useApiKey(this.id)"
        >
          {{ 'apikeys.card_apikeys.action' | translate }}
          <ion-icon slot="end" name="ux-forward"></ion-icon>
        </ion-button>
        <ion-text
          *ngIf="this.fundName"
          class="ux-font-lato ux-fweight-regular ux-fsize-14 cib__footer__used_key"
        >
          {{ 'apikeys.card_apikeys.used_apikey' | translate }}
        </ion-text>
      </div>
    </div>
  `,
  styleUrls: ['./apikey-item.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class ApikeyItemComponent implements OnInit {
  @Input() id: number;
  @Input() fundName: string;
  @Input() alias: string;
  @Output() useButtonClicked: EventEmitter<number> = new EventEmitter<number>();
  @Output() deletedKey: EventEmitter<number> = new EventEmitter<number>();
  control: AbstractControl;
  constructor(
    private modalController: ModalController,
    private apiApikeysService: ApiApikeysService,
    private translate: TranslateService,
    private alertController: AlertController,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  async openModal() {
    const modal = await this.modalController.create({
      component: ApikeysEditModalComponent,
      componentProps: {
        id: this.id,
        alias: this.alias,
      },
      cssClass: 'ux-routeroutlet-modal apikeys-modal',
      swipeToClose: false,
    });
    await modal.present();
  }

  async showAlert(id) {
    const alert = await this.alertController.create({
      header: this.translate.instant(
        'apikeys.card_apikeys.confirmation_alert.header'
      ),
      message: this.translate.instant(
        'apikeys.card_apikeys.confirmation_alert.message'
      ),
      buttons: [
        {
          text: this.translate.instant(
            'apikeys.card_apikeys.confirmation_alert.cancel_button'
          ),
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: this.translate.instant(
            'apikeys.card_apikeys.confirmation_alert.confirm_button'
          ),
          handler: (_) => this.remove(id),
        },
      ],
    });
    await alert.present();
  }

  remove(id) {
    this.apiApikeysService.delete(id).subscribe(
      () => this.success(id),
      () => this.error()
    );
  }

  private showToast(text: string) {
    this.toastService.showToast({
      message: this.translate.instant(text),
    });
  }

  success(id: number) {
    this.deletedKey.emit(id);
    this.showToast('apikeys.card_apikeys.success_toast');
  }

  error() {
    this.showToast('errorCodes.remove.error');
  }

  useApiKey(id: number) {
    this.useButtonClicked.emit(id);
  }
}
