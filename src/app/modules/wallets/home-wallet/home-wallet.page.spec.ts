import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { HomeWalletPage } from './home-wallet.page';
import { navControllerMock } from '../../../../testing/spies/nav-controller-mock.spec';

describe('HomeWalletPage', () => {
  let component: HomeWalletPage;
  let fixture: ComponentFixture<HomeWalletPage>;
  let navControllerSpy: any;

  beforeEach(
    waitForAsync(() => {
      navControllerSpy = jasmine.createSpyObj('NavController', navControllerMock);
      TestBed.configureTestingModule({
        declarations: [HomeWalletPage],
        imports: [TranslateModule.forRoot(), HttpClientTestingModule, IonicModule],
        providers: [{ provide: NavController, useValue: navControllerSpy }],
      }).compileComponents();

      fixture = TestBed.createComponent(HomeWalletPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
