import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { DefiInvestmentProductsPage } from './defi-investment-products.page';

describe('DefiInvestmentProductsPage', () => {
  let component: DefiInvestmentProductsPage;
  let fixture: ComponentFixture<DefiInvestmentProductsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DefiInvestmentProductsPage ],
      imports: [IonicModule.forRoot(), TranslateModule.forRoot(),  RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(DefiInvestmentProductsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render card and components inside', () => {
    const headerEl = fixture.debugElement.query(By.css('div.dp__card > ion-item'));
    expect(headerEl).toBeTruthy();
    const componentEl = fixture.debugElement.query(By.css('div.dp__card > app-defi-investment-product'));
    expect(componentEl).toBeTruthy();
  });
});
