import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KriptonPurchaseInfoComponent } from './kripton-purchase-info.component';

describe('KriptonPurchaseInfoComponent', () => {
  let component: KriptonPurchaseInfoComponent;
  let fixture: ComponentFixture<KriptonPurchaseInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KriptonPurchaseInfoComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KriptonPurchaseInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
