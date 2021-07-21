import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-recovery-word-input',
  template: `
    <ion-slides [options]="slideOpts">
      <ion-slide class="slide">
        <ion-card>
          <ion-input class="input-card"> </ion-input>
          <ion-label class="label-card">{{ '1/12' }}</ion-label>
        </ion-card>
      </ion-slide>
    </ion-slides>
  `,
  styleUrls: ['./recovery-word-input.component.scss'],
})
export class RecoveryWordInputComponent implements OnInit {
  slideOpts = {
    initialSlide: 1,
    speed: 400,
  };
  constructor() {}

  ngOnInit() {}
}
