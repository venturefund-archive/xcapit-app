import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiApikeysService } from '../shared-apikeys/services/api-apikeys/api-apikeys.service';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { LINKS } from '../../../config/static-links';
import { PlatformService } from '../../../shared/services/platform/platform.service';
import { StorageApikeysService } from '../shared-apikeys/services/storage-apikeys/storage-apikeys.service';

@Component({
  selector: 'app-manage-apikeys',
  template: `
      <ion-header>
          <ion-toolbar color="uxprimary" class="ux_toolbar">
              <ion-buttons slot="start">
                  <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
              </ion-buttons>
              <ion-buttons slot="end">
                  <ion-button
                          appTrackClick
                          name="Register New Key More"
                          class="add-button"
                          (click)="this.addApiKey()"
                  >
                      <ion-icon style="zoom:1.5;" name="add"></ion-icon>
                  </ion-button>
              </ion-buttons>
              <ion-title class="ion-text-center">{{
                  'apikeys.manage_apikeys.header' | translate
                  }}</ion-title>
          </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding-top">
          <div class="ux_main">
              <div class="ux_content">
                  <div *ngIf="!showImage">
                      <ion-list>
                          <app-apikey-item
                                  *ngFor="let apikeys of apikeys"
                                  [id]="this.apikeys.id"
                                  [fundName]="this.apikeys.nombre_bot"
                                  [alias]="this.apikeys.alias"
                                  (useButtonClicked)="this.useKey($event)"
                          >
                          </app-apikey-item>
                      </ion-list>
                  </div>

                  <div *ngIf="showImage">
                      <div class="nr__image-container">
                          <img
                                  class="nr__image-container__image"
                                  src="assets/img/apikeys/no-apikey.svg"
                                  alt="no-apikey"
                          />
                      </div>
                      <div class="nr__subtitle ion-padding-start ion-padding-end">
                          <ion-text
                                  class="ux-font-lato ux-fweight-regular ux-fsize-15"
                                  color="uxsemidark"
                          >
                              {{ 'apikeys.manage_apikeys.subtitle' | translate }}
                          </ion-text>
                      </div>
                  </div>
                  <div class="nr__security-info-alert">
                      <app-ux-alert-message type="info">{{'apikeys.manage_apikeys.security_info_alert' | translate}}</app-ux-alert-message>
                  </div>
              </div>
              <div class="ux_footer ion-padding">
                  <div class="nr__need-help">
                      <app-need-help
                              [whatsAppLink]="this.supportLinks.apiKeyWhatsappSupport"
                              [telegramLink]="this.supportLinks.apiKeyTelegramSupport"
                      ></app-need-help>
                  </div>
                  <ion-button expand="block" type="button" appTrackClick name="Register New Key" (click)="this.addApiKey()">
                      {{'apikeys.manage_apikeys.add_api_key' | translate}}
                  </ion-button>
              </div>
          </div>
      </ion-content>
  `,
  styleUrls: ['./manage-apikeys.page.scss']
})
export class ManageApikeysPage implements OnInit {
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
    private storageApiKeysService: StorageApikeysService
  ) {
  }

  ngOnInit() {
  }

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
    return apiKeys.filter(key => key.nombre_bot === '');
  }

  getAllApiKeys() {
    this.apiApikeysService
      .getAll()
      .pipe(map((apiKeys) => this.selectMode ? this.filterNotUsedKeys(apiKeys) : apiKeys))
      .subscribe((data) => {
        this.apikeys = data;
        this.showImage = this.apikeys.length === 0;
      });
  }

  useKey(id: any) {
    this.storageApiKeysService.updateData(this.apikeys.find(key => key.id = id));
    this.navController.navigateForward(['/funds/fund-name']).then();
  }
}
