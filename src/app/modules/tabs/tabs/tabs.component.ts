import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="funds">
          <ion-icon name="rocket"></ion-icon>
        </ion-tab-button>

        <ion-tab-button (click)="this.test()">
          <ion-icon name="menu"></ion-icon>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {
  constructor(private menu: MenuController) {}

  ngOnInit() {}

  test() {
    this.menu.toggle();
  }
}
