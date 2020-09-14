import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ux-alert-message',
  template: `
    <div class="am" [ngClass]="this.type">
      <div class="am__icon">
        <ion-icon [name]="this.iconName"></ion-icon>
      </div>
      <div class="am__message">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./ux-alert-message.component.scss']
})
export class UxAlertMessageComponent implements OnInit {
  constructor() {}
  iconName: string;
  @Input()
  type = 'info';

  ngOnInit() {
    this.setIconName();
  }

  setIconName() {
    if (this.type === 'info') {
      this.iconName = 'ux-warning-circle';
    }
  }
}
