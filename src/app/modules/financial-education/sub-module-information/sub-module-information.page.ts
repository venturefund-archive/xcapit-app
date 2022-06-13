import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { MODULES_CRYPTO } from '../shared-financial-education/constants/crypto';
import { MODULES_FINANCE } from '../shared-financial-education/constants/finance';

@Component({
  selector: 'app-sub-module-information',
  template: ` <ion-content>
    <div>
      <app-sub-module-info [subModule]="this.subModule"></app-sub-module-info>
    </div>
    <div class="ion-padding">
      <div>
        <ion-button
          appTrackClick
          class="ux_button"
          expand="block"
          color="secondary"
          name="ux_education_learn"
          (click)="this.goToLearningMore()"
          >{{ 'financial_education.shared.sub_module_info.button_1' | translate }}</ion-button
        >
      </div>
      <div>
        <ion-button
          appTrackClick
          class="ux_button ux-button-outlined"
          expand="block"
          name="ux_education_test"
          (click)="this.goToStartTest()"
          >{{ 'financial_education.shared.sub_module_info.button_2' | translate }}</ion-button
        >
      </div>
    </div>
  </ion-content>`,
  styleUrls: ['./sub-module-information.page.scss'],
})
export class SubModuleInformationPage implements OnInit {
  selectedTab: string;
  module: any;
  subModule: any;
  data: any;
  constructor(private route: ActivatedRoute, private navController: NavController) {}

  ngOnInit() {
    this.getParams();
    this.getData();
    this.getModule();
    this.getSubModule();
  }

  getParams() {
    this.selectedTab = this.route.snapshot.paramMap.get('tab');
    this.module = this.route.snapshot.paramMap.get('module');
    this.subModule = this.route.snapshot.paramMap.get('submodule');
  }

  getData() {
    this.data = this.selectedTab === 'finance' ? MODULES_FINANCE : MODULES_CRYPTO;
  }

  getModule() {
    this.module = this.data.find((module) => module.name === this.module);
  }

  getSubModule() {
    for (const subModule of this.module.sub_modules) {
      if (subModule.name === this.subModule) this.subModule = subModule;
    }
  }

  goToLearningMore() {
    this.navController.navigateForward([
      `financial-education/typeform/tab/${this.selectedTab}/module/${this.module.name}/submodule/${this.subModule.name}/code/${this.subModule.learning_code}`,
    ]);
  }

  goToStartTest() {
    this.navController.navigateForward([
      `financial-education/typeform/tab/${this.selectedTab}/module/${this.module.name}/submodule/${this.subModule.name}/code/${this.subModule.test_code}`,
    ]);
  }
}
