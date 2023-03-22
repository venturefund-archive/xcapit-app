import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { KriptonSaleSummaryPage } from './kripton-sale-summary.page';

describe('KriptonSaleSummaryPage', () => {
  let component: KriptonSaleSummaryPage;
  let fixture: ComponentFixture<KriptonSaleSummaryPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ KriptonSaleSummaryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(KriptonSaleSummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
