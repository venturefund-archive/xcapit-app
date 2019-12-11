import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-header-trama',
  template: `
    <div [class]="this.headerClasses">
      <div class="xcapit_header_content" >
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./xcapit-header-trama.component.scss']
})
export class XcapitHeaderTramaComponent implements OnInit {
  @Input() mode = 'normal';
  headerClasses = 'xcapit_header_trama';

  constructor() {
  }

  ngOnInit() {
    this.headerClasses = `${this.headerClasses} ${this.mode}`;
  }
}
