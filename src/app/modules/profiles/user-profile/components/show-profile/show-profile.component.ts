import { Component, OnInit, Input } from '@angular/core';
import { ApiProfilesService } from '../../../shared-profiles/services/api-profiles/api-profiles.service';

@Component({
  selector: 'app-show-profile',
  template: `
    <div class="sp__personal ion-padding-start ion-padding-end">
      <div class="sp__personal__label">
        <ion-label
          class="ux-font-lato ux-fweight-bold ux-fsize-12"
          color="uxsemidark"
        >
          {{ 'profiles.user_profile.show_personal_data' | translate }}
        </ion-label>
      </div>
      <div class="sp__personal__card">
        <app-ux-list>
          <ion-list>
            <ion-item>
              <ion-label>
                <h2>
                  {{ 'profiles.user_profile.nro_dni' | translate }}
                </h2>
                <h3>
                  {{ this.data?.nro_dni }}
                </h3>
              </ion-label>
            </ion-item>
            <div class="list-divider"></div>
            <ion-item>
              <ion-label>
                <h2>
                  {{ 'profiles.user_profile.cellphone' | translate }}
                </h2>
                <h3>{{ this.data?.cellphone }}</h3>
              </ion-label>
            </ion-item>
          </ion-list>
        </app-ux-list>
      </div>
    </div>

    <div class="sp__bill ion-padding-start ion-padding-end">
      <div class="sp__bill__label">
        <ion-label
          class="ux-font-lato ux-fweight-bold ux-fsize-12"
          color="uxsemidark"
        >
          {{ 'profiles.user_profile.show_bill_data' | translate }}
        </ion-label>
      </div>
      <div class="sp__bill__card">
        <app-ux-list>
          <ion-list>
            <ion-item>
              <ion-label>
                <h2>
                  {{ 'profiles.user_profile.condicion_iva' | translate }}
                </h2>
                <h3>
                  {{ this.data?.condicion_iva }}
                </h3>
              </ion-label>
            </ion-item>
            <div class="list-divider"></div>
            <ion-item>
              <ion-label>
                <h2>
                  {{ 'profiles.user_profile.tipo_factura' | translate }}
                </h2>
                <h3>{{ this.data?.tipo_factura }}</h3>
              </ion-label>
            </ion-item>
            <div class="list-divider"></div>
            <ion-item>
              <ion-label>
                <h2>
                  {{ 'profiles.user_profile.cuit' | translate }}
                </h2>
                <h3>{{ this.data?.cuit }}</h3>
              </ion-label>
            </ion-item>
            <div class="list-divider"></div>
            <ion-item>
              <ion-label>
                <h2>
                  {{ 'profiles.user_profile.direccion' | translate }}
                </h2>
                <h3>{{ this.data?.direccion }}</h3>
              </ion-label>
            </ion-item>
          </ion-list>
        </app-ux-list>
      </div>
    </div>
  `,
  styleUrls: ['./show-profile.component.scss']
})
export class ShowProfileComponent implements OnInit {
  @Input() data: any;
  constructor() {}
  ngOnInit() {
  }
}
