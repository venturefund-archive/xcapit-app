import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SendSuccessPage } from './send-success.page';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TrackService } from 'src/app/shared/services/track/track.service';

describe('SendSuccessPage', () => {
  let component: SendSuccessPage;
  let fixture: ComponentFixture<SendSuccessPage>;
  let trackServiceSpy: jasmine.SpyObj<TrackService>;

  beforeEach(() => {
    trackServiceSpy = jasmine.createSpyObj('TrackServiceSpy', {
      trackEvent: Promise.resolve(true),
    });
    TestBed.configureTestingModule({
      declarations: [SendSuccessPage],
      imports: [IonicModule],
      providers: [{ provide: TrackService, useValue: trackServiceSpy }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(SendSuccessPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
