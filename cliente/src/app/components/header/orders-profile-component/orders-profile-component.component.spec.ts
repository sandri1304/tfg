import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersProfileComponentComponent } from './orders-profile-component.component';

describe('OrdersProfileComponentComponent', () => {
  let component: OrdersProfileComponentComponent;
  let fixture: ComponentFixture<OrdersProfileComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrdersProfileComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersProfileComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
