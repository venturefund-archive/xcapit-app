import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="funds">
          <ion-icon name="rocket"></ion-icon>
        </ion-tab-button>

        <ion-tab-button (click)="this.showMenu()">
          <ion-icon name="menu"></ion-icon>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent {
  constructor(private menu: MenuController) {}

  showMenu() {
    this.menu.toggle();
  }
}
