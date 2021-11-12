import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';

import { ReferralsSummaryPage } from './referrals-summary.page';
import { TranslateModule } from '@ngx-translate/core';
import { ApiUsuariosService } from '../../usuarios/shared-usuarios/services/api-usuarios/api-usuarios.service';
import { ApiReferralsService } from '../shared-referrals/services/api-referrals/api-referrals.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FakeNavController } from '../../../../testing/fakes/nav-controller.fake.spec';

const referrals = {
  first_order: { with_wallet: 4, without_wallet: 5, reward: 1 },
  second_order: { with_wallet: 2, without_wallet: 6, reward: 0.5 },
};
describe('ReferralsSummaryPage', () => {
  let component: ReferralsSummaryPage;
  let fixture: ComponentFixture<ReferralsSummaryPage>;
  let apiUsuariosServiceSpy: jasmine.SpyObj<ApiUsuariosService>;
  let apiReferralsServiceSpy: jasmine.SpyObj<ApiReferralsService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: jasmine.SpyObj<NavController>;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController();
      navControllerSpy = fakeNavController.createSpy();
      apiUsuariosServiceSpy = jasmine.createSpyObj('ApiUsuariosService', { getUser: of({ referral_id: 'testRefId' }) });
      apiReferralsServiceSpy = jasmine.createSpyObj('ApiReferralsService', { getUserReferralsInfo: of(referrals) });
      TestBed.configureTestingModule({
        declarations: [ReferralsSummaryPage],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
        providers: [
          { provide: ApiUsuariosService, useValue: apiUsuariosServiceSpy },
          { provide: ApiReferralsService, useValue: apiReferralsServiceSpy },
          { provide: NavController, useValue: navControllerSpy },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(ReferralsSummaryPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get referral link on init', async () => {
    component.ionViewWillEnter();
    await fixture.whenStable();
    expect(component.referralLink).toContain('testRefId');
  });

  it('should get referrals count on init', async () => {
    component.ionViewWillEnter();
    await fixture.whenStable();
    expect(component.referrals).toBeFalsy();
  });
});
