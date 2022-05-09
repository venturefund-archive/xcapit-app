import { Component, Input, OnInit } from '@angular/core';
import { Coin } from 'src/app/modules/wallets/shared-wallets/interfaces/coin.interface';
import { OPERATION_STATUS } from '../../constants/operation-status';
import { FiatRampOperation } from '../../interfaces/fiat-ramp-operation.interface';
import { OperationStatus } from '../../interfaces/operation-status.interface';

@Component({
  selector: 'app-operation-detail-card',
  template: `
    <ion-card class="ux-card">
      <div>
        <div>
        <img src="asd" alt="Coin Logo">
        </div>
        <div>
        <ion-text>USDT</ion-text>
        <ion-text>USD Theter</ion-text>
        </div>
        <div>
          <app-operation-status-chip [status]="this.operationStatus"></app-operation-status-chip>
        </div>
      </div>
      <div>
        <div>
          <ion-text>Operacion</ion-text>
        </div>
        <div>
          <div>
            <ion-text>Tipo</ion-text>
          </div>
          <div>
            Moneda
            <ion-text>Con</ion-text>
            Moneda
          </div>
        </div>
      </div>
      <div>
        <div>
          <ion-text>Monto</ion-text>
        </div>
        <div>
          <ion-text>123123 asr</ion-text>
        </div>
      </div>
      <div>
        Cotiacion
      </div>
      <div>
        Proveedor
      </div>
      <div>
        Direccion de recepcion
      </div>
      <div>
        Red
      </div>
    </ion-card>
  `,
  styleUrls: ['./operation-detail-card.component.scss'],
})
export class OperationDetailCardComponent implements OnInit {
  @Input() operation: FiatRampOperation;
  coin: Coin;
  address: string;
  operationStatus: OperationStatus = OPERATION_STATUS[0];

  constructor() { }

  ngOnInit() {}

  ionViewWillEnter() {
  }

}
