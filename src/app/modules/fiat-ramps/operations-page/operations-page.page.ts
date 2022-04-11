import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { PROVIDERS } from '../shared-ramps/constants/providers';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { InformativeModalComponent } from 'src/app/modules/home/shared-home/components/informative-modal/informative-modal.component';
import { ApiApikeysService } from '../../apikeys/shared-apikeys/services/api-apikeys/api-apikeys.service';
import { OPERATION_STATUS } from '../shared-ramps/constants/operation-status';

@Component({
  selector: 'app-operations-page',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="primary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.operations_list.header' | translate }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button class="ux-font-text-xs" appTrackClick name="New Operation" (click)="this.checkEmptyApiKeys()">
            {{ 'fiat_ramps.operations_list.new' | translate }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-text class="ux-font-text-xl ios hydrated ion-padding-top ion-margin-top">
        <div class="ion-margin-top">
          {{ 'fiat_ramps.operations_list.title' | translate }}
        </div>
      </ion-text>

      <app-operations-list [operationsList]="this.operationsList"></app-operations-list>
    </ion-content>
  `,
  styleUrls: ['./operations-page.page.scss'],
})
export class OperationsPagePage implements OnInit {
  operationsList: any[];
  providers = PROVIDERS;
  status = OPERATION_STATUS;
  modalOpen = false;

  constructor(
    private navController: NavController,
    private fiatRampsService: FiatRampsService,
    private modalController: ModalController,
    private apiApikeysService: ApiApikeysService
  ) {}

  ionViewWillEnter() {
    this.getOperationsList();
  }

  ngOnInit() {}

  async getOperationsList() {
    this.fiatRampsService.getUserOperations().subscribe((data) => {
      this.operationsList = this.formatData(data);
    });
  }

  formatData(data): any[] {
    if ((data.constructor === Object && Object.keys(data).length === 0) || data.length === 0) {
      return [];
    }

    const sortedData = data.sort(this.sortByDateCondition.bind(this));
    const mappedData = sortedData.map(this.mapOperations.bind(this));

    return mappedData;
  }

  sortByDateCondition(a, b): number {
    return a.created_at < b.created_at ? 1 : b.created_at < a.created_at ? -1 : 0;
  }

  mapOperations(operation) {
    operation.provider = this.getProvider(operation.provider);
    operation.status = this.getStatus(operation.status, operation.provider.id);
    return operation;
  }

  getProvider(providerId: string) {
    return this.providers.find((provider) => provider.id.toString() === providerId);
  }

  getStatus(statusName: string, providerId: number) {
    return this.status.find((s) => s.providerId === providerId && s.name === statusName);
  }

  viewOperationDetail(operation) {
    this.navController.navigateForward([
      'fiat-ramps/operation-detail/provider',
      operation.provider.id,
      'operation',
      operation.operation_id,
    ]);
  }

  checkEmptyApiKeys() {
    this.apiApikeysService.getAll().subscribe((data) => {
      if (data.length === 0) {
        this.openModal();
      } else {
        this.navController.navigateForward('/fiat-ramps/select-provider');
      }
    });
  }

  async openModal() {
    if (!this.modalOpen) {
      this.modalOpen = true;
      const modal = await this.modalController.create({
        component: InformativeModalComponent,
        cssClass: 'ux-modal-informative',
        swipeToClose: false,
      });
      await modal.present();

      modal.onDidDismiss().then(() => {
        this.modalOpen = false;
      });
    }
  }
}
