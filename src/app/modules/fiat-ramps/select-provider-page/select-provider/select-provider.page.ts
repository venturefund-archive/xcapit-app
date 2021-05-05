import { Component, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll, NavController } from '@ionic/angular';

@Component({
  selector: 'app-select-provider',
  template: `
  <ion-header>
      <ion-toolbar color="uxprimary" class="ux_toolbar">
        <ion-buttons slot="start">
          <ion-back-button defaultHref="tabs/funds"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-text-center">
          {{ 'Comprar Cripto' | translate }}</ion-title
        >
      </ion-toolbar>
  </ion-header>
    <ion-content class="ion-padding-top">
          <div class="ux_main"> 
              <div class="sp__title">
                <ion-text
                  class="ux-font-gilroy ux-fweight-extrabold ux-fsize-22"
                >
                  {{ 'fiat_ramps.select_provider.title' | translate }}
                </ion-text>
              </div>
              <div class="ux_content">
                <div>
                        <ion-list>
                            <app-provider-card
                                    *ngFor="let providers of providers"
                                    [id]="this.providers.id"
                                    [name]="this.providers.name"
                                    [img]="this.providers.img"
                                    (useButtonClicked)="this.useProvider($event)"     
                            >
                            </app-provider-card>
                        </ion-list>
                </div> 
              </div>
          </div>
    </ion-content>
  `,
  styleUrls: ['./select-provider.page.scss'],
})
export class SelectProviderPage implements OnInit {
  @ViewChild(IonInfiniteScroll, { static: true })
  infiniteScroll: IonInfiniteScroll;
  providers = [
    {
      id: 1,
      name: "KriptonMarket",
      img: "../../assets/img/providers/id1.svg"
    },

    {
      id: 2,
      name: "Paxful",
      img: "../../assets/img/providers/id2.svg"
    }
  ];
  queryOptions = { ordering: '-created_at' };
  paginationOptions = { cursor: '' };
  loading = true;

  constructor(
    private navController: NavController,
  ) { }

  ngOnInit() {
  }

  useProvider(id: number) {
    if (id == 1) {
      this.navController.navigateForward(['/fiat-ramps/new-operation']).then();
    } else if (id == 2) {
      this.navController.navigateForward(['/funds/fund-name']).then();
    }
  }

}
