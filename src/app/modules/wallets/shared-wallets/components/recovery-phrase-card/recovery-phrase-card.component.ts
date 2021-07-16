import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recovery-phrase-card',
  template: `
    <ion-card>
      <div *ngFor="let word of this.words">
        <app-recovery-word-button [word]="word" class="ion-margin"></app-recovery-word-button>
      </div>
    </ion-card>
  `,
  styleUrls: ['./recovery-phrase-card.component.scss'],
})
export class RecoveryPhraseCardComponent implements OnInit {
  ordered = true;
  words: string[] = [
    'insecto',
    'puerta',
    'vestido',
    'piso',
    'plato',
    'nube',
    'afuera',
    'fuego',
    'laptop',
    'libre',
    'perro',
    'niño',
  ];

  constructor() {}

  ngOnInit() {
    if (this.ordered) {
      this.words.sort();
    }
  }
}
