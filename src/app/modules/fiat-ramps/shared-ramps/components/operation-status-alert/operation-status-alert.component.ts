import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-operation-status-alert',
  template: `
    <div class="osa__information" (click)="this.alertAction()" [ngClass]="this.backgroundClass">
      <img [src]="this.icon" class="osa__information__icon" />
      <div class="osa__information__text">
        <ion-text [ngClass]="this.textClass" [innerHTML]="this.text | translate"> </ion-text>
      </div>
    </div>
  `,
  styleUrls: ['./operation-status-alert.component.scss'],
})
export class OperationStatusAlertComponent implements OnInit {
  @Input() operationStatus: string;
  textClass = 'ux-home-status-card';
  icon: string;
  text: string;
  backgroundClass: string;

  constructor() {}

  ngOnInit() {
    console.log('operationStatus: ', this.operationStatus);
    this.setState();
  }

  alertAction() {
    if (this.operationStatus === 'incompleta') {
      console.log('Redireccion a detalle operacion...')
      // Navegar detalle operacion
    }
  }

  setState() {
    switch (this.operationStatus) {
      case 'incompleta':
        this.icon = 'assets/img/wallets/warning-circle.svg';
        this.text = 'fiat_ramps.kripton_operation_detail.state_toast.created';
        this.backgroundClass = 'ux-warning-background-card';
        // Click: Llevar a detalle de operacion para subir comprobante
        break;
      case 'anulada':
        this.icon = 'assets/img/wallets/error-circle.svg';
        this.text = 'fiat_ramps.kripton_operation_detail.state_toast.nullified';
        this.backgroundClass = 'ux-error-background-card';
        break;
      case 'cancelada':
        this.icon = 'assets/img/wallets/error-circle.svg';
        this.text = 'fiat_ramps.kripton_operation_detail.state_toast.canceled';
        this.backgroundClass = 'ux-error-background-card';
        break;
    }
    // STATES: Incompleta, En progreso, confirmada, anulada, cancelada
    // En progreso y Confirmada fuera del scope de este componente
  }
}
