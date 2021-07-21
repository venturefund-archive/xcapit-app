import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-recovery-word-button',
  template: `
    <ion-button size="small">
      {{ this.word }}
    </ion-button>
  `,
  styleUrls: ['./recovery-word-button.component.scss'],
})
export class RecoveryWordButtonComponent implements OnInit {
  @Input() word: string;

  constructor() {}

  ngOnInit() {}
}
