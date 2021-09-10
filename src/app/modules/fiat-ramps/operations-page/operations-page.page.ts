import { Component, OnInit } from '@angular/core';
import { NavController, ModalController } from '@ionic/angular';
import { PROVIDERS } from '../shared-ramps/constants/providers';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';
import { InformativeModalComponent } from 'src/app/modules/menus/main-menu/components/informative-modal/informative-modal.component';
import { ApiApikeysService } from '../../apikeys/shared-apikeys/services/api-apikeys/api-apikeys.service';

@Component({
  selector: 'app-operations-page',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ 'fiat_ramps.operations_list.header' | translate }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button
            class="new-operation ion-padding-end"
            appTrackClick
            name="New Operation"
            (click)="this.checkEmptyApiKeys()"
          >
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

      <app-ux-list-inverted>
        <ion-list>
          <ion-item class="table-header ux-font-text-xs">
            <ion-label color="uxdark">
              {{ 'fiat_ramps.operations_list.operation' | translate }}
            </ion-label>
            <ion-label color="uxdark">
              {{ 'fiat_ramps.operations_list.amount' | translate }}
            </ion-label>
            <ion-label color="uxdark">
              {{ 'fiat_ramps.operations_list.status' | translate }}
            </ion-label>
            <ion-label color="uxdark">
              {{ 'fiat_ramps.operations_list.date' | translate }}
            </ion-label>
            <ion-label color="uxdark">
              {{ 'fiat_ramps.operations_list.provider' | translate }}
            </ion-label>
          </ion-item>
          <div class="container" *ngFor="let op of this.operationsList; let last = last">
            <ion-item class="table-header ux-font-text-xxs regular" (click)="viewOperationDetail(op)">
              <ion-text class="ux-fweight-semibold ux-fsize-10">
                {{ op.currency_in }} → {{ op.currency_out }}
              </ion-text>
              <ion-text class="ux-fweight-semibold" *ngIf="op.operation_type === 'cash-in'">
                {{ op.amount_in | currency }}
              </ion-text>
              <ion-text class="ux-fweight-semibold" *ngIf="op.operation_type === 'cash-out'">
                {{ op.amount_out | currency }}
              </ion-text>
              <ion-text class="ux-fweight-semibold">
                <img
                  [src]="op.status.logoRoute"
                  alt="{{ 'fiat_ramps.operationStatus.' + op.provider.alias + '.' + op.status.name | translate }}"
                />
              </ion-text>
              <ion-text class="ux-fweight-semibold">
                {{ op.created_at | date: 'dd/MM/yy' }}
              </ion-text>
              <ion-text class="ux-fweight-semibold">
                <img [src]="op.provider.logoRoute" alt="{{ op.provider.name }}" />
              </ion-text>
            </ion-item>
            <div class="list-divider" *ngIf="!last"></div>
          </div>
        </ion-list>
      </app-ux-list-inverted>
    </ion-content>
  `,
  styleUrls: ['./operations-page.page.scss'],
})
export class OperationsPagePage implements OnInit {
  operationsList: any[];
  providers = PROVIDERS;
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
    const status = {
      name: statusName,
      logoRoute: '../../../assets/img/fiat-ramps/operation-status/',
    };

    switch (providerId) {
      case 1:
        // KriptonMarket
        switch (statusName) {
          case 'complete':
            status.logoRoute += 'ok.svg';
            break;

          case 'cancel':
            status.logoRoute += 'error.svg';
            break;

          case 'pending_by_validate':
          case 'request':
          case 'received':
          case 'wait':
          default:
            status.logoRoute += 'processing.svg';
        }
        break;
      case 2:
        // Paxful
        switch (statusName) {
          case 'SUCCESS':
            status.logoRoute += 'ok.svg';
            break;

          case 'EXPIRED':
          case 'CANCELLED':
            status.logoRoute += 'error.svg';
            break;

          default:
            status.logoRoute += 'processing.svg';
        }
        break;
    }

    return status;
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
