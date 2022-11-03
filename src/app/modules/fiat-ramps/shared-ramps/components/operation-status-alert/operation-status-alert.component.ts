import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-operation-status-alert',
  template: `
    <div
      class="osa__information"
      (click)="this.alertAction()"
      [ngClass]="this.backgroundClass"
    >
      <img src="assets/img/wallets/backup-information-circle.svg" class="osa__information__icon" />
      <div class="osa__information__text">
        <ion-text [ngClass]="this.textClass" [innerHTML]="this.text | translate"> </ion-text>
        <!-- TEST TEST TEST -->
      </div>
    </div>
  `,
  styleUrls: ['./operation-status-alert.component.scss'],
})
export class OperationStatusAlertComponent implements OnInit {
  @Input() operationStatus: string;
  text = 'fiat_ramps.kripton_operation_detail.state_toast.created';
  textClass = "ux-home-status-card";
  backgroundClass = "ux-warning-background-card";
  
  constructor() { }

  ngOnInit() {
    this.setState();
  }

  alertAction() {
    // this.cardClicked.emit();
  }

  setState() {
    this.backgroundClass = 'ux-warning-background-card';
  }

}
