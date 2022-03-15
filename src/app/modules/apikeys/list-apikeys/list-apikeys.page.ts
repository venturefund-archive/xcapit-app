import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiApikeysService } from '../shared-apikeys/services/api-apikeys/api-apikeys.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { LINKS } from '../../../config/static-links';
import { PlatformService } from '../../../shared/services/platform/platform.service';
import { UX_ALERT_TYPES } from 'src/app/shared/components/ux-alert-message/ux-alert-types';
import { FundDataStorageService } from '../../funds/shared-funds/services/fund-data-storage/fund-data-storage.service';

@Component({
  selector: 'app-list-apikeys',
  template: `
    <ion-header>
      <ion-toolbar color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/investments/binance"></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button appTrackClick name="Register New Key More" class="add-button" (click)="this.addApiKey()">
            <ion-icon style="zoom:1.5; color:white;" name="add"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ 'apikeys.list_apikeys.header' | translate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding-top">
      <div class="ux_main">
        <div class="ux_content">
          <div *ngIf="!this.showImage">
            <ion-list>
              <app-apikey-item
                *ngFor="let apikey of this.apikeys"
                [id]="apikey.id"
                [fundName]="apikey.nombre_bot"
                [alias]="apikey.alias"
                (useButtonClicked)="this.useKey($event)"
                (deletedKey)="this.deleteKey($event)"
                (editedAlias)="this.getAllApiKeys()"
              >
              </app-apikey-item>
            </ion-list>
          </div>

          <div *ngIf="this.showImage">
            <div class="nr__image-container">
              <img class="nr__image-container__image" src="assets/img/apikeys/no-apikey.svg" alt="no-apikey" />
            </div>
            <div class="nr__subtitle ion-padding-start ion-padding-end">
              <ion-text class="ux-font-text-base" color="neutral80">
                {{ 'apikeys.list_apikeys.subtitle' | translate }}
              </ion-text>
            </div>
          </div>
          <div class="nr__security-info-alert">
            <app-ux-alert-message [type]="this.alertType">{{
              'apikeys.list_apikeys.security_info_alert' | translate
            }}</app-ux-alert-message>
          </div>
        </div>
        <div class="ux_footer ion-padding">
          <div class="nr__need-help">
            <app-need-help
              [whatsAppLink]="this.supportLinks.apiKeyWhatsappSupport"
              [telegramLink]="this.supportLinks.apiKeyTelegramSupport"
            ></app-need-help>
          </div>
          <ion-button
            class="ux_button"
            expand="block"
            type="button"
            color="secondary"
            appTrackClick
            name="Register New Key"
            (click)="this.addApiKey()"
          >
            {{ 'apikeys.list_apikeys.add_api_key' | translate }}
          </ion-button>
        </div>
      </div>
    </ion-content>
  `,
  styleUrls: ['./list-apikeys.page.scss'],
})
export class ListApikeysPage implements OnInit {
  alertType = UX_ALERT_TYPES.info;
  apikeys: any = [];
  showImage = false;
  loading = true;
  selectMode = false;
  supportLinks = LINKS;

  constructor(
    private apiApikeysService: ApiApikeysService,
    private navController: NavController,
    private route: ActivatedRoute,
    private platformService: PlatformService,
    private fundDataStorageService: FundDataStorageService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.getMode();
    this.getAllApiKeys();
  }

  getMode() {
    this.selectMode = this.route.snapshot.paramMap.get('mode') === 'select';
  }

  isWebPlatform() {
    return this.platformService.isWeb();
  }

  addApiKey() {
    const path = this.isWebPlatform() ? '/apikeys/register' : '/apikeys/scan';
    this.navController.navigateForward([path]).then();
  }

  filterNotUsedKeys(apiKeys: any[]) {
    return apiKeys.filter((key) => key.nombre_bot === '');
  }

  checkEmptyApiKeys() {
    this.showImage = this.apikeys.length === 0;
  }

  getAllApiKeys() {
    this.apiApikeysService
      .getAll()
      .pipe(map((apiKeys) => (this.selectMode ? this.filterNotUsedKeys(apiKeys) : apiKeys)))
      .subscribe((data) => {
        this.apikeys = data;
        this.checkEmptyApiKeys();
      });
  }

  useKey(apiKeyId: number) {
    this.fundDataStorageService
      .setData('apiKeyId', { api_key_id: apiKeyId })
      .then(() => this.navController.navigateForward(['/funds/fund-name']));
  }

  deleteKey(id: number) {
    const toDeleteIndex = this.apikeys.findIndex((key) => key.id === id);
    this.apikeys.splice(toDeleteIndex, 1);
    this.checkEmptyApiKeys();
  }
}
