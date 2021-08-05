import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-recovery-phrase-card',
  template: `
    <ion-card class="ion-padding">
      <div class="word" *ngFor="let word of this.phraseCopy; let i = index">
        <app-recovery-word
          [clickable]="this.clickable"
          [showOrder]="this.showOrder"
          [indice]="i"
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
  phraseCopy: string[];
  @Input() phrase: string[];

  constructor() {}

  ngOnInit() {
    this.phraseCopy = [...this.phrase];
    if (this.ordered) {
      this.phraseCopy.sort();
    }
  }

  useValue(word: string) {
    this.useButtonClicked.emit(word);
  }
}
