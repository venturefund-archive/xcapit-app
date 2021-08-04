import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-recovery-phrase-card',
  template: `
    <ion-card class="ion-padding">
      <div class="word" *ngFor="let word of this.words; let indice = index">
        <app-recovery-word
          [clickable]="this.clickable"
          [showOrder]="this.showOrder"
          [indice]="indice"
          [word]="word"
          (useButtonClicked)="this.useValue($event)"
        >
        </app-recovery-word>
      </div>
    </ion-card>
  `,
  styleUrls: ['./recovery-phrase-card.component.scss'],
})
export class RecoveryPhraseCardComponent implements OnInit {
  @Input() showOrder = true;
  @Input() ordered = false;
  @Input() clickable = false;
  @Output() useButtonClicked: EventEmitter<string> = new EventEmitter<string>();
  @Input() words: string[];

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
