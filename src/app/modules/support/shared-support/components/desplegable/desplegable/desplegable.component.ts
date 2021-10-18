import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-desplegable',
  template: `
    <div (click)="this.changeState()" id="faq">
      <ul>
        <li>
          <input type="checkbox" checked />
          <ion-icon name="chevron-forward-outline" *ngIf="showFirst"></ion-icon>
          <ion-icon name="chevron-down-outline" *ngIf="!showFirst"></ion-icon>
          <ion-text class="ux-font-text-xs title">{{ this.answer.title | translate }}</ion-text>
          <ion-text class="ux-font-text-xxs answer">
            {{ this.answer.answer | translate }}
          </ion-text>
          <a href=""></a>
        </li>
      </ul>
    </div>

    <div class="list-divider" *ngIf="!answer.last"></div>
  `,
  styleUrls: ['./desplegable.component.scss'],
})
export class DesplegableComponent implements OnInit {
  @Input() answer;
  showFirst = false;
  constructor() {}

  ngOnInit() {}

  changeState() {
    this.showFirst = !this.showFirst;
    console.log(this.showFirst);
  }
}
