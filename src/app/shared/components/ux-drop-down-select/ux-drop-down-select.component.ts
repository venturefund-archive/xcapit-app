import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ux-drop-down-select',
  template: `
    <div class="ux_dds">
      <ion-label class="ux_dds__label">{{
        'profiles.fiscal_data.country' | translate
      }}</ion-label>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./ux-drop-down-select.component.scss']
})
export class UxDropDownSelectComponent implements OnInit {
  @Input() withSearch = false;

  constructor() {}

  ngOnInit() {}
}
