import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-need-help-card',
  template: ` <div class="nhc" (click)="this.goToFaqs()">
    <div class="nhc__content">
      <div class="nhc__content__body">
        <div class="ux-font-text-lg nhc__content__body__title">
          {{ 'home.home_page.need_help_card.title' | translate }}
        </div>
        <div class="ux-font-text-xxs nhc__content__body__subtitle">
          {{ 'home.home_page.need_help_card.subtitle' | translate }}
        </div>
      </div>
      <img class="nhc__content__img" src="/assets/img/home/need-help.png" />
    </div>
  </div>`,
  styleUrls: ['./need-help-card.component.scss'],
})
export class NeedHelpCardComponent implements OnInit {
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToFaqs() {
    this.navController.navigateForward(['support/options']);
  }
}
