import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PROVIDERS } from '../shared-ramps/constants/providers';
import { FiatRampsService } from '../shared-ramps/services/fiat-ramps.service';

@Component({
  selector: 'app-operations-page',
  template: `
    <ion-header>
      <ion-toolbar mode="ios" color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">
          {{ 'fiat_ramps.operations_list.header' | translate }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button
            class="ux-font-lato ux-fweight-semibold ux-fsize-14 ion-padding-end"
            appTrackClick
            name="New Operation"
            routerDirection="forward"
            [routerLink]="['/fiat-ramps/select-provider']"
          >
            {{ 'fiat_ramps.operations_list.new' | translate }}
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-text class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22 ios hydrated ion-padding-top ion-margin-top">
        <div class="ion-margin-top">
          {{ 'fiat_ramps.operations_list.title' | translate }}
        </div>
      </ion-text>

      <app-ux-list-inverted>
        <ion-list>
          <ion-item class="table-header ux-font-lato ux-fweight-regular ux-fsize-11">
            <ion-label class="table-header__second-item">
              {{ 'fiat_ramps.operations_list.operation' | translate }}
            </ion-label>
            <ion-label class="">
              {{ 'fiat_ramps.operations_list.amount' | translate }}
            </ion-label>
            <ion-label class="">
              {{ 'fiat_ramps.operations_list.status' | translate }}
            </ion-label>
            <ion-label class="">
              {{ 'fiat_ramps.operations_list.date' | translate }}
            </ion-label>
            <ion-label class="">
              {{ 'fiat_ramps.operations_list.provider' | translate }}
            </ion-label>
          </ion-item>
          <div class="container" *ngFor="let op of this.operationsList; let last = last">
            <ion-item
              class="table-header ux-font-lato ux-fweight-regular ux-fsize-12"
              (click)="viewOperationDetail(op)"
            >
              <ion-text class="table-header__second-item ux-fweight-semibold ux-fsize-10">
                {{ op.currency_in }} → {{ op.currency_out }}
              </ion-text>
              <ion-text class="ux-fweight-semibold" *ngIf="op.operation_type === 'cash-in'">
                {{ op.amount_in | currency }}
              </ion-text>
              <ion-text class="ux-fweight-semibold" *ngIf="op.operation_type === 'cash-out'">
                {{ op.amount_out | currency }}
              </ion-text>
              <ion-text class="ux-fweight-semibold">
                <img [src]="op.status.logoRoute" alt="{{ op.status.name }}" />
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

  constructor(private navController: NavController, private fiatRampsService: FiatRampsService) {}

  ionViewWillEnter() {
    this.getOperationsList();
  }

  ngOnInit() {}

  async getOperationsList() {
    this.fiatRampsService.getUserOperations().subscribe((data) => {
      this.operationsList =
        data.constructor === Object && Object.keys(data).length === 0
          ? []
          : data
              .sort((a, b) => (a.created_at < b.created_at ? 1 : b.created_at < a.created_at ? -1 : 0))
              .map((operation) => {
                operation.provider = this.getProvider(operation.provider);
                operation.status = this.getStatus(operation.status, operation.provider.id);
                return operation;
              });
    });
  }

  getProvider(providerId: string) {
    return this.providers.find((provider) => provider.id.toString() === providerId);
  }

  getStatus(statusName: string, providerId: number) {
    let status = {
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
          case 'SUCCESSFULL':
            status.logoRoute += 'ok.svg';
            break;

          case 'EXPIRED':
          case 'CANCELED':
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
    this.navController.navigateForward(['fiat-ramps/operations-detail', operation.operation_id]);
  }
}
