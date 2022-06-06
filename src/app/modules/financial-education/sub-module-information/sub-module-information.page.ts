import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sub-module-information',
  template: `
<ion-content>
  <app-sub-module-info></app-sub-module-info>
</ion-content>`,
  styleUrls: ['./sub-module-information.page.scss'],
})
export class SubModuleInformationPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
