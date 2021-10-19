import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  template: `
    <div (click)="this.changeState()" id="faq">
      <ul>
        <li>
          <input type="checkbox" checked />
          <ion-icon name="chevron-up-outline" *ngIf="showFirst"></ion-icon>
          <ion-icon name="chevron-down-outline" *ngIf="!showFirst"></ion-icon>
          <ion-text class="ux-font-header-titulo title">{{ this.answer.title | translate }}</ion-text>
          <ion-text class="ux-font-text-base answer">
            {{ this.answer.answer | translate }}
            <a class="link_text" [href]="this.answer.href">{{ this.answer.link_text | translate }}</a>
          </ion-text>
        </li>
      </ul>
    </div>
    <div class="list-divider" *ngIf="!answer.last"></div>
  `,
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {
  @Input() answer;
  showFirst = false;
  constructor() {}

  ngOnInit() {}

  changeState() {
    this.showFirst = !this.showFirst;
  }
}
