import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { IonicModule } from '@ionic/angular';
import { FormattedAmountPipe } from 'src/app/shared/pipes/formatted-amount/formatted-amount.pipe';
import { YieldsComponent } from './yields.component';

describe('YieldsComponent', () => {
  let component: YieldsComponent;
  let fixture: ComponentFixture<YieldsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ YieldsComponent, FormattedAmountPipe ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(YieldsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render skeleton if yield has not loaded', () => {
    const yieldEls = fixture.debugElement.queryAll(By.css('ion-text'));
    const skeletonEls = fixture.debugElement.queryAll(By.css('ion-skeleton-text'));
    expect(yieldEls.length).toBe(0);
    expect(skeletonEls.length).toBe(2);
  });

  it('should render yield when yield loaded', () => {
    component.yield = { value: 0, token: 'USDC' };
    component.usdYield = { value: 0, token: 'USD' };
    fixture.detectChanges();
    const yieldEls = fixture.debugElement.queryAll(By.css('ion-text'));
    const skeletonEls = fixture.debugElement.queryAll(By.css('ion-skeleton-text'));
    expect(yieldEls.length).toBe(2);
    expect(skeletonEls.length).toBe(0);
  });
});
