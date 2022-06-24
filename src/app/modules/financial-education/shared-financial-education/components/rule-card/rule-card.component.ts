import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-rule-card',
  template: `
    <div class="rc__card" (click)="this.goToRules()">
      <div class="rc__card__content">
        <img src="assets/img/financial-education/shared-financial-education/rule-card/circle.svg" alt="">
          <div class="rc__card__content__text">
            <ion-text class="ux-font-header-titulo" >{{this.title | translate}}</ion-text>
            <ion-text class="ux-font-text-xxs" >{{this.subtitle | translate}}</ion-text>
          </div>
        <img src="assets/img/financial-education/shared-financial-education/rule-card/next.svg" alt="">
      </div>
    </div>
  `,
  styleUrls: ['./rule-card.component.scss'],
})
export class RuleCardComponent implements OnInit {
  @Input() title : string;
  @Input() subtitle : string;
  @Input() url : string;
  constructor(private navController: NavController) { }

  ngOnInit() { }

  goToRules() {
    this.navController.navigateForward(this.url);
  }

}
