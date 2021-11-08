import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { RecoveryWordComponent } from '../recovery-word/recovery-word.component';

@Component({
  selector: 'app-recovery-phrase-card',
  template: `
    <div class="card ion-padding">
      <div class="word" *ngFor="let word of this.phraseCopy; let i = index">
        <app-recovery-word
          [clickable]="this.clickable"
          [showOrder]="this.showOrder"
          [index]="i"
          [word]="word"
          (useButtonClicked)="this.useValue($event)"
        >
        </app-recovery-word>
      </div>
    </div>
  `,
  styleUrls: ['./recovery-phrase-card.component.scss'],
})
export class RecoveryPhraseCardComponent implements OnInit {
  @ViewChildren(RecoveryWordComponent) recoveryWordComponents: QueryList<RecoveryWordComponent>;
  @Input() showOrder = true;
  @Input() ordered = false;
  @Input() clickable = false;
  @Output() useButtonClicked: EventEmitter<string> = new EventEmitter<string>();
  phraseCopy: string[];
  @Input() set phrase(phrase: string[]) {
    this.phraseCopy = [...phrase];
  }

  constructor() {}

  ngOnInit() {
    if (this.ordered) {
      this.sortPhrase();
    }
  }

  sortPhrase() {
    this.phraseCopy.sort();
  }

  useValue(word: string) {
    this.useButtonClicked.emit(word);
  }

  enable(word: string) {
    const toEnableComponent = this.recoveryWordComponents.find((wordComponent) => wordComponent.word === word);
    toEnableComponent.isActivated = true;
  }
}
