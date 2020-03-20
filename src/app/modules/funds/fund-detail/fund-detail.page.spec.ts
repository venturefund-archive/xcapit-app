import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FundDetailPage } from './fund-detail.page';

describe('FundDetailPage', () => {
  let component: FundDetailPage;
  let fixture: ComponentFixture<FundDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FundDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
