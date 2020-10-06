import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerServiceComponentComponent } from './customer-service-component.component';

describe('CustomerServiceComponentComponent', () => {
  let component: CustomerServiceComponentComponent;
  let fixture: ComponentFixture<CustomerServiceComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerServiceComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerServiceComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
