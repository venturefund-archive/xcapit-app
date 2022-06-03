import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-modules-education',
  template: `
    <ion-accordion-group [value]="this.module.open">
      <ion-accordion [value]="this.module.open" [disabled]="this.module.disabled" class="accordion-arrow-info">
        <ion-item class="ux-font-titulo-xs" slot="header" name="item_module">
          <img class="icon" name="module_img" [src]="this.module.icon" />
          <div>
            <div>
              <ion-label name="module_title">{{ this.module.title | translate }}</ion-label>
            </div>
            <div class="ux-font-text-xxs" *ngIf="this.module.comingSoon">
              <ion-label name="module_coming_soon">{{ 'financial_education.home.coming_soon' | translate }}</ion-label>
            </div>
          </div>
        </ion-item>
        <ion-list slot="content">
          <ion-item
            class="ux-font-text-xxs"
            name="item_sub_module"
            appTrackClick
            [dataToTrack]="{ eventLabel: subModule.dataToTrack }"
            *ngFor="let subModule of this.module.sub_modules"
            (click)="this.goToPage(subModule.link)"
          >
            <div class="item-content">
              <div class="item-content__body">
                <ion-label name="sub_module_title">{{ subModule.title | translate }}</ion-label>
                <ion-icon name="ux-forward"></ion-icon>
              </div>
              <div class="item-content__divider">
                <div class="list-divider light" *ngIf="!subModule.last"></div>
              </div>
            </div>
          </ion-item>
        </ion-list>
      </ion-accordion>
      <div class="list-divider" *ngIf="!this.module.last"></div>
    </ion-accordion-group>
  `,
  styleUrls: ['./modules-education.component.scss'],
})
export class ModulesEducationComponent implements OnInit {
  @Input() module: any;

  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToPage(link) {
    this.navController.navigateForward(link);
  }
}
