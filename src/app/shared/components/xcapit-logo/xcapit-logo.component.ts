import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-xcapit-logo',
  template: `
    <div class="text-center" *ngIf="whiteLogo">
      <img src="../../assets/img/logo-xcapit.svg" alt="Xcapit" />
    </div>

    <div class="text-center" *ngIf="!whiteLogo">
      <img src="../../assets/img/logo-xcapit-2.svg" alt="Xcapit" />
    </div>
  `,
  styleUrls: ['./xcapit-logo.component.scss'],
})
export class XcapitLogoComponent implements OnInit {
  @Input() whiteLogo = true;
  constructor() {}

  ngOnInit() {}
}
