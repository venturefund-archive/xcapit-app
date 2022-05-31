import { Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { RecoveryWordComponent } from '../recovery-word/recovery-word.component';

@Component({
  selector: 'app-recovery-phrase-card',
  template: `
    <div class="card">
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
    <div class="info" >
      <ion-icon [name]="this.isProtected? 'ux-checked-circle-outline' : 'ux-error-circle-outline'" [color]="this.isProtected? 'successdark': 'danger'"></ion-icon>
      <ion-text class="ux-font-text-xxs" [color]="this.isProtected? 'successdark': 'danger'">
      {{ (this.isProtected ? 'wallets.recovery_phrase_read.protected' : 'wallets.recovery_phrase_read.not_protected') | translate }}
      </ion-text>   
    </div>
  `,
  styleUrls: ['./recovery-phrase-card.component.scss'],
})
export class RecoveryPhraseCardComponent implements OnInit {
  @ViewChildren(RecoveryWordComponent) recoveryWordComponents: QueryList<RecoveryWordComponent>;
  @Input() isProtected: boolean;
  @Input() showOrder = true;
  @Input() ordered = false;
  @Input() clickable = false;
  @Output() useButtonClicked: EventEmitter<string> = new EventEmitter<string>();
  phraseCopy: string[];
  @Input() set phrase(phrase: string[]) {
    this.phraseCopy = [...phrase];
  }
  protected:string;

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
