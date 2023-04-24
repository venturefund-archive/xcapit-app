import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OPERATION_STATUS } from '../../constants/operation-status';
import { OperationStatus } from '../../interfaces/operation-status.interface';

@Component({
  selector: 'app-operation-status-alert',
  template: `
    <div
      class="osa__information"
      (click)="this.alertAction()"
      [ngClass]="'ux-' + this.status.colorCssClass + '-background-card'"
    >
      <img [src]="this.status.icon" class="osa__information__icon" />
      <div class="osa__information__text">
        <ion-text class="ux-home-status-card"
          >{{
            'fiat_ramps.kripton_operation_detail.state_toast.' + this.operationType + '.' + this.status.textToShow
              | translate
          }}
          <ion-text *ngIf="this.status.textToShow === 'incomplete'" class="ux-link-xs">{{
            'fiat_ramps.kripton_operation_detail.state_toast.' + this.operationType + '.incomplete2' | translate
          }}</ion-text>
        </ion-text>
      </div>
    </div>
  `,
  styleUrls: ['./operation-status-alert.component.scss'],
})
export class OperationStatusAlertComponent implements OnInit {
  @Input() operationStatus: string;
  @Input() operationType: string;
  status: OperationStatus;
  @Output() navigateBy: EventEmitter<any> = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {
    this.setState();
  }

  alertAction() {
    if (this.status.textToShow === 'incomplete') {
      this.navigate();
    }
  }

  setState() {
    this.status = OPERATION_STATUS.find((statuses) => statuses.type === this.operationType).statuses.find(
      (status) => status.name === this.operationStatus
    );
  }

  navigate(): void {
    this.navigateBy.emit();
  }
}
