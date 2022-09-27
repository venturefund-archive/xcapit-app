import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-backup-information-card',
  template: `
    <div
      class="bic__information"
      appTrackClick
      [dataToTrack]="{ eventLabel: 'ux_go_to_protect' }"
      (click)="this.emitCardClicked()"
      [ngClass]="this.backgroundClass"
    >
      <img src="assets/img/wallets/backup-information-circle.svg" class="bic__information__icon" />
      <div class="bic__information__text">
        <ion-text [ngClass]="this.textClass" [innerHTML]="this.text | translate"> </ion-text>
      </div>
    </div>
  `,
  styleUrls: ['./backup-information-card.component.scss'],
})
export class BackupInformationCardComponent implements OnInit {
  @Input() text: string;
  @Input() textClass: string;
  @Input() backgroundClass = 'ux-info-background-card';
  @Output() cardClicked: EventEmitter<void> = new EventEmitter<void>();

  constructor() {}

  ngOnInit() {}

  emitCardClicked() {
    this.cardClicked.emit();
  }
}
