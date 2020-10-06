import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovePaymentComponent } from './remove-payment.component';

describe('RemovePaymentComponent', () => {
  let component: RemovePaymentComponent;
  let fixture: ComponentFixture<RemovePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemovePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemovePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
