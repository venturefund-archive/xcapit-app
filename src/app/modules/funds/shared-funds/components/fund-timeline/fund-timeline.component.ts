import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-fund-timeline',
  template: `
    <div class="ftl">
      <div class="ftl__content ion-padding">
        <div
          class="ftl__content__item active"
          *ngFor="let run of this.runs"
          [ngClass]="this.run.estado"
          (click)="this.goToDetail(run.id_corrida)"
        >
          <div class="ftl__content__item__side">
            <div class="ftl__content__item__side__dot-container">
              <div class="ftl__content__item__side__dot-container__dot"></div>
            </div>
            <div class="ftl__content__item__side__line-container">
              <div class="ftl__content__item__side__line-container__line"></div>
            </div>
          </div>
          <div class="ftl__content__item__content" *ngIf="this.run.estado === 'active'">
            <div class="ftl__content__item__content__info">
              <ion-text color="black" class="ux-font-lato ux-fweight-semibold ux-fsize-14">
                {{ this.run.fecha_inicio | date: 'dd/MM/yyyy' }}
              </ion-text>
            </div>
            <div class="ftl__content__item__content__label">
              <ion-text color="uxsemidark" class="ux-font-lato ux-fweight-regular ux-fsize-11">
                {{ 'funds.fund_timeline.active_fund' | translate }}
              </ion-text>
            </div>
          </div>
          <div class="ftl__content__item__content" *ngIf="this.run.estado === 'finalizado'">
            <div class="ftl__content__item__content__info">
              <div>
                <ion-label color="primary" class="ux-font-lato ux-fweight-semibold ux-fsize-14">
                  {{ this.run.fecha_inicio | date: 'dd/MM/yyyy' }}
                </ion-label>
              </div>
              <div class="ftl__content__item__content__info__percentage">
                <ion-label *ngIf="this.run.percentage">
                  <ion-text
                    class="ux-font-lato ux-fweight-semibold ux-fsize-11 positive"
                    *ngIf="this.run.percentage >= 0"
                  >
                    {{ this.run.percentage | number: '1.0-2' }}%
                  </ion-text>
                  <ion-text
                    class="ux-font-lato ux-fweight-semibold ux-fsize-11 negative"
                    *ngIf="this.run.percentage < 0"
                  >
                    {{ this.run.percentage | number: '1.0-2' }}%
                  </ion-text>
                </ion-label>
              </div>
            </div>
            <div class="ftl__content__item__content__label">
              <ion-text color="uxsemidark" class="ux-font-lato ux-fweight-regular ux-fsize-11">
                {{ 'funds.fund_timeline.finished_fund' | translate }}
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
            <ion-label color="uxsemidark" class="ux-font-lato ux-fweight-semibold ux-fsize-12">
              {{ 'funds.fund_timeline.start_of' | translate }}
              {{ this.fundName }}</ion-label
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
  @Input() isOwner: boolean;

  constructor(private navController: NavController) {}

  ngOnInit() {}

  goToDetail(runID) {
    if (this.isOwner === true) {
      this.navController.navigateForward([`/funds/fund-timeline-detail/${this.fundName}/${runID}`]);
    }
  }
}
