import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-backup-information-card',
  template: `
    <div class="bic__information">
      <img src="assets/img/wallets/backup-information-circle.svg" class="bic__information__icon">
      <div class="bic__information__text">
        <ion-text [ngClass]="this.textClass" color="info" [innerHTML]="this.text | translate ">
        </ion-text>
      </div>
    </div>
  `,
  styleUrls: ['./backup-information-card.component.scss'],
})
export class BackupInformationCardComponent implements OnInit {
  @Input() text: string;
  @Input() textClass: string;
  constructor() {}

  ngOnInit() {}
}
