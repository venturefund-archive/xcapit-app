import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-choose-investor-profile-skeleton',
  template: `
    <div class="card">
      <ion-skeleton-text
        animated
      ></ion-skeleton-text>
    </div>
  `,
  styleUrls: ['./choose-investor-profile-skeleton.component.scss'],
})
export class ChooseInvestorProfileSkeletonComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
