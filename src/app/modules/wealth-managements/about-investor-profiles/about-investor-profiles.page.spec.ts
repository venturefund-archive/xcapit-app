import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { FakeNavController } from 'src/testing/fakes/nav-controller.fake.spec';
import { SwiperModule } from 'swiper/angular';
import { InvestorProfileStepStubComponent } from '../shared-wealth-managements/components/investor-profile-step/investor-profile-step-stub.component.spec';
import { InvestorProfileService } from '../shared-wealth-managements/services/investor-profile/investor-profile.service';

import { AboutInvestorProfilesPage } from './about-investor-profiles.page';

const fakeInvestorProfiles = [
  {
    id: 1,
    title: 'wealth_managements.about_investor_profile.conservative_profile.title',
    subtitle: 'wealth_managements.about_investor_profile.conservative_profile.subtitle',
    imagePath: 'assets/img/investor-test/conservative.svg',
  },
  {
    id: 2,
    title: 'wealth_managements.about_investor_profile.moderated_profile.title',
    subtitle: 'wealth_managements.about_investor_profile.moderated_profile.subtitle',
    imagePath: 'assets/img/investor-test/moderated.svg',
  },
];

fdescribe('AboutInvestorProfilesPage', () => {
  let component: AboutInvestorProfilesPage;
  let fixture: ComponentFixture<AboutInvestorProfilesPage>;
  let investorProfileServiceSpy: jasmine.SpyObj<InvestorProfileService>;
  let fakeNavController: FakeNavController;
  let navControllerSpy: any;
  beforeEach(
    waitForAsync(() => {
      fakeNavController = new FakeNavController({});
      navControllerSpy = fakeNavController.createSpy();
      investorProfileServiceSpy = jasmine.createSpyObj('investorProfileService', {
        setProfile: of({}),
      });
      TestBed.configureTestingModule({
        declarations: [AboutInvestorProfilesPage, InvestorProfileStepStubComponent],
        imports: [IonicModule.forRoot(), TranslateModule.forRoot(), SwiperModule],
        providers: [
          { provide: NavController, useValue: navControllerSpy },
          { provide: InvestorProfileService, useValue: investorProfileServiceSpy },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(AboutInvestorProfilesPage);
      component = fixture.componentInstance;
      component.investorProfiles = fakeInvestorProfiles;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render app-investor-profile-step component', async () => {
    const appProfileInvestor = fixture.debugElement.queryAll(By.css('app-investor-profile-step'));
    expect(appProfileInvestor.length).toBe(2);
  });

  it('should set Profile when setProfile event is received ', async () => {
    fixture.debugElement.query(By.css('app-investor-profile-step')).triggerEventHandler('setProfileEvent', 1);
    expect(investorProfileServiceSpy.setProfile).toHaveBeenCalledOnceWith(1);
  });
});
