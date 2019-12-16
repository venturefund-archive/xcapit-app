import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-nc-list-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>
      <li></li>
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./nc-list-item.component.scss']
})
export class NcListItemComponent {
  constructor() {}
}
