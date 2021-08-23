import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { SendDetailPage } from './send-detail.page';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('SendDetailPage', () => {
  let component: SendDetailPage;
  let fixture: ComponentFixture<SendDetailPage>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SendDetailPage],
      imports: [IonicModule, TranslateModule.forRoot(), RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SendDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should change selected network on event emited', () => {
    component.networks = ['ERC20', 'BTC'];
    fixture.detectChanges();
    expect(component.selectedNetwork).toBe('ERC20');
    const networkCard = fixture.debugElement.query(By.css('app-network-select-card'));
    networkCard.triggerEventHandler('networkChanged', 'BTC');
    fixture.detectChanges();
    expect(component.selectedNetwork).toBe('BTC');
  });
});
