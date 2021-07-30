import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-verify-phrase-card',
  template: `
    <ion-card class="ion-padding">
      <div class="word" *ngFor="let word of this.words; let indice = index">
        <app-verify-word-button (useButtonClicked)="this.useValue($event)" [word]="word"></app-verify-word-button>
      </div>
    </ion-card>
  `,
  styleUrls: ['./verify-phrase-card.component.scss'],
})
export class VerifyPhraseCardComponent implements OnInit {
  @Output() useButtonClicked: EventEmitter<string> = new EventEmitter<string>();

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

  useValue(word: string) {
    this.useButtonClicked.emit(word);
  }
}
