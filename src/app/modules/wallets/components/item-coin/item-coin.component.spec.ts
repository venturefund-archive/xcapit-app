import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ItemCoinComponent } from './item-coin.component';

describe('ItemCoinComponent', () => {
  let component: ItemCoinComponent;
  let fixture: ComponentFixture<ItemCoinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemCoinComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemCoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
