import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-nc-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ul>
      <ng-content></ng-content>
    </ul>
  `,
  styleUrls: ['./nc-list.component.scss']
})
export class NcListComponent {
  constructor() {}
}
