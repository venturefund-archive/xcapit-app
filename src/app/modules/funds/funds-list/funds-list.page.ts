import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-funds-list',
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>funds-list</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="ion-padding">
        <ion-button
          type="button"
          expand="full"
          size="large"
          color="success"
          [routerLink]="['/tutorials/interactive-tutorial']"
        >
          <ion-icon slot="start" name="add"></ion-icon>
          Nuevo Fondo
        </ion-button>
      </div>
    </ion-content>
  `,
  styleUrls: ['./funds-list.page.scss']
})
export class FundsListPage implements OnInit {
  constructor() {}

  ngOnInit() {}
}
