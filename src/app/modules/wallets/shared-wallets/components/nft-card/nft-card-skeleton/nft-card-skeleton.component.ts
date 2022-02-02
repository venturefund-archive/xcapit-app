import { Component,OnInit} from '@angular/core';


@Component({
  selector: 'app-nft-card-skeleton',
  template: `
      <ion-item lines="none" class="skeleton">
      <ion-avatar slot="start">
        <ion-skeleton-text animated></ion-skeleton-text>
      </ion-avatar>
      <ion-label>
        <p>
          <ion-skeleton-text animated></ion-skeleton-text>
        </p>
        <p>
          <ion-skeleton-text animated style="width:50%" ></ion-skeleton-text>
        </p>
      </ion-label>
    </ion-item>
  `,
  styleUrls: ['./nft-card-skeleton.component.scss'],
})
export class NftCardSkeletonComponent implements OnInit {

  ngOnInit() {
  }

}
