import { Component, Input, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-modules-education',
  template: `
    <ion-accordion-group [value]="this.opened">
      <ion-accordion [value]="this.opened" [disabled]="this.module.coming_soon" class="accordion-arrow-info">
        <ion-item class="ux-font-titulo-xs" slot="header" name="item_module">
          <img class="icon" name="module_img" [src]="this.module.icon" />
          <div>
            <div>
              <ion-label name="module_title">{{ this.module.title | translate }}</ion-label>
            </div>
            <div class="ux-font-text-xxs" *ngIf="!this.module.coming_soon">
              <ion-label name="module_status">
                ({{ 'financial_education.home.statuses.' + this.module.status | translate }})</ion-label
              >
            </div>
            <div class="coming_soon ux-font-text-xxs" *ngIf="this.module.coming_soon">
              <ion-label name="module_coming_soon">{{ 'financial_education.home.coming_soon' | translate }}</ion-label>
            </div>
          </div>
        </ion-item>
        <ion-list slot="content">
          <ion-item
            class="ux-font-text-xxs"
            name="item_sub_module"
            appTrackClick
            [dataToTrack]="{ eventLabel: submodule.data_to_track }"
            *ngFor="let submodule of this.module.submodules; let i = index"
            (click)="this.goToPage(submodule)"
          >
            <div class="item-content">
              <div class="item-content__body">
                <ion-icon
                  class="item-content__body__status"
                  [src]="'assets/img/financial-education/states/' + this.submodule.status + '.svg'"
                ></ion-icon>
                <div>
                  <ion-label name="sub_module_title" class="ux-font-text-xxs" color="primary">{{
                    submodule.title | translate
                  }}</ion-label>
                  <div class="ux-font-text-xxs">
                    <ion-label name="sub_module_status"
                      >({{ 'financial_education.home.statuses.' + this.submodule.status | translate }})</ion-label
                    >
                  </div>
                </div>
                <ion-icon class="item-content__body__arrow" name="ux-forward"></ion-icon>
              </div>

              <div class="item-content__divider">
                <div class="list-divider light" *ngIf="this.module.submodules.length !== i + 1"></div>
              </div>
            </div>
          </ion-item>
        </ion-list>
      </ion-accordion>
    </ion-accordion-group>
  `,
  styleUrls: ['./modules-education.component.scss'],
})
export class ModulesEducationComponent implements OnInit {
  @Input() module: any;
  @Input() selectedCategory: string;
  opened = true;
  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToPage(subModule) {
    this.navController.navigateForward([
      'tabs/financial-education/information/category',
      this.selectedCategory,
      'module',
      this.module.id,
      'submodule',
      subModule.id,
    ]);
  }

}
