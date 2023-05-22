import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OPERATION_STATUS } from '../../constants/operation-status';
import { OperationStatus } from '../../interfaces/operation-status.interface';
import { TrackService } from 'src/app/shared/services/track/track.service';

@Component({
  selector: 'app-operation-status-alert',
  template: `
    <div
      name="Information card"
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

  constructor(private trackService: TrackService,) {}

  ngOnInit() {
    this.setState();
  }

  alertAction() {
    if (this.status.textToShow === 'incomplete') {
      this.trackEvent();
      this.navigate();
    }
  }

  setState() {
    console.log('setting state...')
    this.status = OPERATION_STATUS.find((statuses) => statuses.type === this.operationType).statuses.find(
      (status) => status.name === this.operationStatus
    );
    console.log('states fetched:', this.status);
  }

  navigate(): void {
    this.navigateBy.emit();
  }

  trackEvent(): void {
    if (this.operationType === 'cash-out') {
      this.trackService.trackEvent({
        eventLabel: 'ux_sell_send_detail_try_again',
      });
    }
  }
}
