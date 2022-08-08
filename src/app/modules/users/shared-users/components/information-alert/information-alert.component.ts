import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-information-alert',
  template: ` <div
  class="ia__information">
  <img src="assets/img/wallets/backup-information-circle.svg" class="ia__information__icon" />
  <div class="ia__information__text ux-font-text-lg">
    <ion-text [innerHTML]="this.text | translate"> </ion-text>
  </div>
</div>`,
  styleUrls: ['./information-alert.component.scss'],
})
export class InformationAlertComponent implements OnInit {
  @Input() text: string; 
  constructor() { }

  ngOnInit() {}

}
