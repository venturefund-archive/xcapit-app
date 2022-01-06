import {  ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { DefiInvestmentProductComponent } from './defi-investment-product.component';

describe('DefiInvestmentProductComponent', () => {
  let component: DefiInvestmentProductComponent;
  let fixture: ComponentFixture<DefiInvestmentProductComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DefiInvestmentProductComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DefiInvestmentProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
