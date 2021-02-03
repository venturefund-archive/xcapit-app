import { Component, OnInit, Input } from '@angular/core';
import { ApiFundsService } from 'src/app/modules/funds/shared-funds/services/api-funds/api-funds.service';

@Component({
  selector: 'app-fund-timeline',
  template: `
    <div class="ftl">
      <div class="ftl__content ion-padding">
        <div
          class="ftl__content__item active"
          *ngFor="let run of this.runs"
          [ngClass]="this.run.estado"
        >
          <div class="ftl__content__item__side">
            <div class="ftl__content__item__side__dot-container">
              <div class="ftl__content__item__side__dot-container__dot"></div>
            </div>
            <div class="ftl__content__item__side__line-container">
              <div class="ftl__content__item__side__line-container__line"></div>
            </div>
          </div>
          <div
            class="ftl__content__item__content"
            *ngIf="this.run.estado == 'active'"
          >
            <div class="ftl__content__item__content__info">
              <ion-text
                color="black"
                class="ux-font-lato ux-fweight-semibold ux-fsize-14"
              >
                {{ this.run.fecha_inicio | date: 'dd/MM/yyyy' }}
              </ion-text>
            </div>
            <div class="ftl__content__item__content__label">
              <ion-text
                color="uxsemidark"
                class="ux-font-lato ux-fweight-regular ux-fsize-11"
              >
                Fondo actual
              </ion-text>
            </div>
          </div>
          <div
            class="ftl__content__item__content"
            *ngIf="this.run.estado == 'finalizado'"
          >
            <div class="ftl__content__item__content__info">
              <div>
                <ion-label
                  color="primary"
                  class="ux-font-lato ux-fweight-semibold ux-fsize-14"
                >
                  {{ this.run.fecha_inicio | date: 'dd/MM/yyyy' }}
                </ion-label>
              </div>
              <div>
                <ion-label>
                  <ion-text
                    class="ux-font-lato ux-fweight-regular ux-fsize-11"
                    style="color: #21dd62;"
                  >
                    {{ this.run.percentage }}
                  </ion-text>
                  <ion-text
                    class="ux-font-lato ux-fweight-regular ux-fsize-10"
                    color="uxsemidark"
                  >
                    / $7.5
                  </ion-text>
                </ion-label>
              </div>
            </div>
            <div class="ftl__content__item__content__label">
              <ion-text
                color="uxsemidark"
                class="ux-font-lato ux-fweight-regular ux-fsize-11"
              >
                Fondo finalizado
              </ion-text>
            </div>
          </div>
        </div>
        <div class="ftl__content__item initial">
          <div class="ftl__content__item__side">
            <div class="ftl__content__item__side__dot-container">
              <div class="ftl__content__item__side__dot-container__dot"></div>
            </div>
          </div>
          <div class="ftl__content__item__content">
            <ion-label
              color="uxmedium"
              class="ux-font-lato ux-fweight-semibold ux-fsize-12"
              >Inicio de {{ this.fundName }}</ion-label
            >
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./fund-timeline.component.scss'],
})
export class FundTimelineComponent implements OnInit {
  @Input() runs: any;
  @Input() fundName: string;
  constructor(private apiFunds: ApiFundsService) {}

  ngOnInit() {}
}
