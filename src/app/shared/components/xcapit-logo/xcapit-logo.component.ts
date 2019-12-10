import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-xcapit-logo',
  template: `
    <div class="text-center">
      <ion-img src="../../assets/img/logo_xcapit.svg" alt="Logo xcapit">
      </ion-img>
    </div>
  `,
  styleUrls: ['./xcapit-logo.component.scss']
})
export class XcapitLogoComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
