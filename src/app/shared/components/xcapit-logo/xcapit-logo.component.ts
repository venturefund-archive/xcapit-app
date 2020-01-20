import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-xcapit-logo',
  template: `
    <div class="text-center">
      <img src="../../assets/img/logo-xcapit.svg" alt="Logo xcapit">
    </div>
  `,
  styleUrls: ['./xcapit-logo.component.scss']
})
export class XcapitLogoComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
