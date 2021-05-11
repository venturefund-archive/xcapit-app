import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
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
      <app-ux-title class="ion-padding-top ion-margin-top">
        <div class="ion-margin-top">
          {{ 'fiat_ramps.operations_list.title' | translate }}
        </div>
      </app-ux-title>

      <app-ux-list-inverted>
        <ion-list>
          <ion-item class="table-header ux-font-lato ux-fweight-regular ux-fsize-11">
            <ion-label class="table-header__first-item">
              {{ '#' }}
            </ion-label>
            <ion-label class="table-header__second-item">
              {{ 'fiat_ramps.operations_list.operation' | translate }}
            </ion-label>
            <ion-label class="">
              {{ 'fiat_ramps.operations_list.amount' | translate }}
            </ion-label>
            <ion-label class="">
              {{ 'fiat_ramps.operations_list.provider' | translate }}
            </ion-label>
            <ion-label class="">
              {{ 'fiat_ramps.operations_list.status' | translate }}
            </ion-label>
            <ion-label class="">
              {{ 'fiat_ramps.operations_list.date' | translate }}
            </ion-label>
          </ion-item>
          <div class="container" *ngFor="let op of this.operationsList; let last = last">
            <ion-item
              class="table-header ux-font-lato ux-fweight-regular ux-fsize-12"
              (click)="viewOperationDetail(op)"
            >
              <ion-text class="table-header__first-item ux-fweight-semibold">
                {{ op.id }}
              </ion-text>
              <ion-text class="table-header__second-item ux-fweight-semibold">
                {{ op.currency_in }} → {{ op.currency_out }}
              </ion-text>
              <ion-text class="ux-fweight-semibold">
                {{ op.amount_in }}
              </ion-text>
              <ion-text class="ux-fweight-semibold">
                <img [src]="op.provider.logoRoute" alt="{{ op.provider.name }}" />
              </ion-text>
              <ion-text class="ux-fweight-semibold">
                {{ op.status.replaceAll('_', ' ') }}
              </ion-text>
              <ion-text class="ux-fweight-semibold">
                {{ op.created_at | date }}
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
  providers = [
    {
      alias: '1',
      name: 'KriptonMarket',
      logoRoute: '../../assets/img/providers/id1.svg',
    },
    {
      alias: 'paxful',
      name: 'Paxful',
      logoRoute: '../../assets/img/providers/id2.svg',
    },
  ];

  constructor(private navController: NavController, private fiatRampsService: FiatRampsService) {}

  async ionViewWillEnter() {
    await this.getOperationsList();
    this.sortList();
  }

  ngOnInit() {}

  async getOperationsList() {
    this.operationsList = [];
    await this.providers.forEach(async (provider) => this.getOperationsFor(provider));
    this.fiatRampsService.setProvider('1');
  }

  async getOperationsFor(provider) {
    this.fiatRampsService.setProvider(provider.alias);
    let operations;

    this.fiatRampsService.getUserOperations().subscribe((data) => {
      operations = data.constructor === Object && Object.keys(data).length === 0 ? [] : data;

      operations.forEach((op) => (op.provider = provider));

      this.operationsList = [...this.operationsList, ...operations];
    });
  }

  sortList() {
    if (this.operationsList.length > 0) {
      this.operationsList.sort((a, b) => (a.id < b.id ? 1 : b.id < a.id ? -1 : 0));
    }
  }

  viewOperationDetail(operation) {
    let route: string;

    switch (operation.provider.alias) {
      case '1':
        route = 'fiat-ramps/operations-detail';
        break;
      case 'paxful':
        route = 'fiat-ramps/operations-detail-paxful';
        break;
      default:
        route = 'fiat-ramps/operations';
        break;
    }

    this.navController.navigateForward([route, operation.id]);
  }
}
