import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-investments-tab-card',
  template: `
    <ion-card class="ux-card-new ion-no-margin">
      <ion-text>{{ this.title | translate }}</ion-text>
      <ion-text>
        {{ this.text | translate }}
      </ion-text>
    </ion-card>
  `,
  styleUrls: ['./investments-tab-card.component.scss'],
})
export class InvestmentsTabCardComponent implements OnInit {
  @Input() optionName: string;
  private title: string;
  private text: string;
  private navigationRoute: string;
  constructor() {}

  ngOnInit() {
    this.title = `funds.investments_tab.${this.optionName}.title`;
    this.text = `funds.investments_tab.${this.optionName}.text`;
    this.navigationRoute = `/tabs/investments/${this.optionName}`;
  }
}
