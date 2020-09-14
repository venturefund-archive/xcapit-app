import {
  Component,
  OnInit,
  Input
} from '@angular/core';

@Component({
  selector: 'app-ux-radio-group',
  template: `
    <div class="ux_rg">
      <ion-label class="ux_rg__label">{{ this.label }}</ion-label>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./ux-radio-group.component.scss']
})
export class UxRadioGroupComponent implements OnInit {
  constructor() {}
  @Input() label = '';

  ngOnInit() {}
}
