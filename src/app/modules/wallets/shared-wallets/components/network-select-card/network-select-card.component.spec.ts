import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { NetworkSelectCardComponent } from './network-select-card.component';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('NetworkSelectCardComponent', () => {
  let component: NetworkSelectCardComponent;
  let fixture: ComponentFixture<NetworkSelectCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NetworkSelectCardComponent],
      imports: [IonicModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NetworkSelectCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render properly', async () => {
    component.title = 'Test title';
    component.disclaimer = 'Test Disclaimer';
    component.networks = ['BTC', 'BEP2', 'BEP20'];

    fixture.detectChanges();
    await fixture.whenStable();

    const titleEl = fixture.debugElement.query(By.css('.nsc__title'));
    expect(titleEl.nativeElement.innerText).toContain('Test title');

    const networksEl = fixture.debugElement.queryAll(By.css('app-ux-segment'));
    expect(networksEl).toBeTruthy();

    const disclaimerEl = fixture.debugElement.query(By.css('.nsc__disclaimer'));
    expect(disclaimerEl.nativeElement.innerText).toContain('Test Disclaimer');
  });
});
