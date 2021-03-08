import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-list',
  template: `
  <ion-text>Aqui va la lista de apikeys</ion-text>
  `,
  styleUrls: ['./list.page.scss'],
})
export class ListPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
