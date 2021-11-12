import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-xcapit-logo',
  template: `
    <div class="text-center">
      <img src="../../assets/img/new-logo-xcapit.svg" alt="Xcapit" />
    </div>
  `,
  styleUrls: ['./xcapit-logo.component.scss'],
})
export class XcapitLogoComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
