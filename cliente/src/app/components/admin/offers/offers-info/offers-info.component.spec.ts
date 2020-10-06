import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffersInfoComponent } from './offers-info.component';

describe('OffersInfoComponent', () => {
  let component: OffersInfoComponent;
  let fixture: ComponentFixture<OffersInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffersInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffersInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
