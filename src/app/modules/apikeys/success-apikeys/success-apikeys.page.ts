import { Component, OnInit } from '@angular/core';
import { SUCCESS_TYPES } from 'src/app/shared/components/success-content/success-types.constant';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-success-apikeys',
  template: `
    <ion-content class="ion-padding">
      <app-success-content [data]="this.data"></app-success-content>
    </ion-content>
  `,
  styleUrls: ['./success-apikeys.page.scss'],
})
export class SuccessApikeysPage implements OnInit {
  constructor(private route: ActivatedRoute) {}
  data: any;
  type: string;

  ngOnInit() {
    this.type = this.route.snapshot.paramMap.get('type');
    this.data = this.type === 'new' ? SUCCESS_TYPES.apikeys_new : SUCCESS_TYPES.apikeys_edit;
  }
}
