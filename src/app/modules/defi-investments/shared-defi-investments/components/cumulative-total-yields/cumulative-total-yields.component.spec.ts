import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule, ModalController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { FakeModalController } from 'src/testing/fakes/modal-controller.fake.spec';
import { CumulativeTotalYieldsComponent } from './cumulative-total-yields.component';

describe('CumulativeTotalYieldsComponent', () => {
  let component: CumulativeTotalYieldsComponent;
  let fixture: ComponentFixture<CumulativeTotalYieldsComponent>;
  let modalControllerSpy: jasmine.SpyObj<ModalController>;
  let fakeModalController: FakeModalController;

  beforeEach(waitForAsync(() => {
    fakeModalController = new FakeModalController();
    modalControllerSpy = fakeModalController.createSpy();
    TestBed.configureTestingModule({
      declarations: [CumulativeTotalYieldsComponent, FormattedAmountPipe],
      providers: [{ provide: ModalController, useValue: modalControllerSpy }],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CumulativeTotalYieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render skeleton if allLoaded is false', () => {
    component.allLoaded = false;
    fixture.detectChanges();

    const amountEls = fixture.debugElement.query(By.css('div.cty__content__card__information__text__amount > ion-text.amount'));
    const tokenEls = fixture.debugElement.query(
      By.css('div.cty__content__card__information__text__amount > ion-text.token')
    );
    const skeletonEls = fixture.debugElement.query(By.css('ion-skeleton-text'));
    fixture.detectChanges();

    expect(skeletonEls).toBeTruthy();
    expect(amountEls).toBeNull();
    expect(tokenEls).toBeNull();
  });

  it('should open information modal when click on information icon', async () => {
    fixture.detectChanges();
    fixture.debugElement.query(By.css('ion-icon[name="information-circle"]')).nativeElement.click();
    
    expect(modalControllerSpy.create).toHaveBeenCalledTimes(1);
  });

  it('should render yield when allLoaded is true', () => {
    component.totalUsdYield = { value: 1, token: 'USD' };
    component.allLoaded = true;
    fixture.detectChanges();
    
    const amountEls = fixture.debugElement.query(By.css('div.cty__content__card__information__text__amount > ion-text.amount'));
    const tokenEls = fixture.debugElement.query(
      By.css('div.cty__content__card__information__text__amount > ion-text.token')
    );
    const skeletonEls = fixture.debugElement.query(By.css('ion-skeleton-text'));
    fixture.detectChanges();
    
    expect(amountEls).toBeTruthy();
    expect(tokenEls).toBeTruthy();
    expect(skeletonEls).toBeNull();
  });
});
