import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-verify-word-button',
  template: `
    <ion-button class="verify-word" size="small" [disabled]="!this.isActivated" (click)="useValue(this.word)">
      {{ this.word }}
    </ion-button>
  `,
  styleUrls: ['./verify-word-button.component.scss'],
})
export class VerifyWordButtonComponent implements OnInit {
  @Input() word;
  @Output() useButtonClicked: EventEmitter<string> = new EventEmitter<string>();
  isActivated = true;
  constructor() {}

  ngOnInit() {}

  useValue(word: string) {
    this.useButtonClicked.emit(word);
    this.isActivated = false;
  }
}
