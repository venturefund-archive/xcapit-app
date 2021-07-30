import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-recovery-word',
  template: `
    <ion-button class="recovery_word" size="small">
      <ion-label>{{ indice + 1 + '. ' + this.word }}</ion-label>
    </ion-button>
  `,
  styleUrls: ['./recovery-word.component.scss'],
})
export class RecoveryWordComponent implements OnInit {
  @Input() word: string;
  @Input() indice: number;

  constructor() {}

  ngOnInit() {}
}
