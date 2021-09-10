import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-recovery-word',
  template: `
    <ion-button
      appTrackClick
      [dataToTrack]="{ description: this.word }"
      name="Recovery Word"
      class="recovery-word"
      size="small"
      [disabled]="!this.isActivated"
      (click)="useValue(this.word)"
    >
      {{ this.showOrder ? indice + 1 + '. ' : '' }}
      {{ this.word }}
    </ion-button>
  `,
  styleUrls: ['./recovery-word.component.scss'],
})
export class RecoveryWordComponent implements OnInit {
  @Input() word: string;
  @Input() indice: number;
  @Input() showOrder: boolean;
  @Input() clickable: boolean;
  @Output() useButtonClicked: EventEmitter<string> = new EventEmitter<string>();
  isActivated = true;

  constructor() {}

  ngOnInit() {}

  useValue(word: string) {
    if (this.clickable) {
      this.useButtonClicked.emit(word);
      this.isActivated = false;
    }
  }
}
