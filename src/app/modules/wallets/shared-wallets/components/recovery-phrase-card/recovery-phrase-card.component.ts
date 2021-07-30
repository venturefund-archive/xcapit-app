import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recovery-phrase-card',
  template: `
    <ion-card class="ion-padding">
      <div class="word" *ngFor="let word of this.words; let indice = index">
        <app-recovery-word [indice]="indice" [word]="word"> </app-recovery-word>
      </div>
    </ion-card>
  `,
  styleUrls: ['./recovery-phrase-card.component.scss'],
})
export class RecoveryPhraseCardComponent implements OnInit {
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

  ngOnInit() {}
}
