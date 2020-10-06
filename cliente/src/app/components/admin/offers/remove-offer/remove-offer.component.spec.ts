import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveOfferComponent } from './remove-offer.component';

describe('RemoveOfferComponent', () => {
  let component: RemoveOfferComponent;
  let fixture: ComponentFixture<RemoveOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
