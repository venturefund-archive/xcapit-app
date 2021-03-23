import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SymbolFormatComponent } from './symbol-format.component';

describe('SymbolFormatComponent', () => {
  let component: SymbolFormatComponent;
  let fixture: ComponentFixture<SymbolFormatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SymbolFormatComponent ],
      imports: [IonicModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SymbolFormatComponent);
    component = fixture.componentInstance;
    component.symbol = 'BTC/USDT';
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
