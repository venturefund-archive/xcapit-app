import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header-trama',
  template: `
    <div class="xcapit_header_trama">
      <div class="xcapit_header_content">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ['./xcapit-header-trama.component.scss']
})
export class XcapitHeaderTramaComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
