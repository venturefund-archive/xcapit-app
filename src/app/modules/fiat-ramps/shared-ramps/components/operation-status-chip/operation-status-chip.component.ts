import { Component, Input, OnInit } from '@angular/core';
import { OPERATION_STATUS } from '../../constants/operation-status';
import { OperationStatus } from '../../interfaces/operation-status.interface';


@Component({
  selector: 'app-operation-status-chip',
  template: `
    <ion-chip class="chip ion-no-padding ion-no-margin" [ngClass]="this.status.colorCssClass">
      <ion-text class="ux-font-num-subtitulo">
        {{ ('fiat_ramps.operation_status.' + status.textToShow) | translate }}
      </ion-text>
    </ion-chip>
  `,
  styleUrls: ['./operation-status-chip.component.scss'],
})
export class OperationStatusChipComponent implements OnInit {
  @Input() statusName: string;
  status: OperationStatus;
  constructor() { }

  ngOnInit() {
    this.status = OPERATION_STATUS.find(s => s.name === this.statusName);
  }
}
