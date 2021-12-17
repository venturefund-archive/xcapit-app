import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-ux-radio-item',
  template: `
    <div class="ri">
      <ion-item class="ion-no-padding">
        <ion-label class="ion-no-margin">
          <ion-text class="ri__text ux-font-text-base ion-no-margin">{{ this.label }}</ion-text>
        </ion-label>
        <ion-radio name="Option" class="ion-no-margin" mode="md" slot="start" [value]="this.value"></ion-radio>
      </ion-item>
    </div>
  `,
  styleUrls: ['./ux-radio-item.component.scss'],
})
export class UxRadioItemComponent implements OnInit {
  @Input() label;
  @Input() value;

  constructor() {}

  ngOnInit() {}
}
