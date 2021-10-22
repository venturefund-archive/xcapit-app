import { Component, Input, OnInit } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { Browser } = Plugins;

@Component({
  selector: 'app-faq',
  template: `
    <div id="faq">
      <ul>
        <li>
          <input (click)="this.changeState()" type="checkbox" checked />
          <ion-icon name="chevron-up-outline" *ngIf="showFirst"></ion-icon>
          <ion-icon name="chevron-down-outline" *ngIf="!showFirst"></ion-icon>
          <ion-text class="ux-font-header-titulo title">{{ this.faq.title | translate }}</ion-text>
          <ion-text class="ux-font-text-base answer" [innerHTML]="this.faq.answer | translate"> </ion-text>
        </li>
      </ul>
    </div>
    <div class="list-divider" *ngIf="!faq.last"></div>
  `,
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {
  @Input() faq;
  showFirst = false;
  browser = Browser;
  selectedLink: string;
  constructor() {}

  ngOnInit() {}

  changeState() {
    this.showFirst = !this.showFirst;
  }

  open(link: string) {
    this.selectedLink = link;
    this.openInfo(this.selectedLink);
  }
  async openInfo(link) {
    await Browser.open({
      toolbarColor: '#ff9100',
      url: link,
    });
  }
}
