import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';
import { ReferralsInfoPage } from './referrals-info.page';

describe('ReferralsInfoPage', () => {
  let component: ReferralsInfoPage;
  let fixture: ComponentFixture<ReferralsInfoPage>;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [ReferralsInfoPage],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(ReferralsInfoPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
