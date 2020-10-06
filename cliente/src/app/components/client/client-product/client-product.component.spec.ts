import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientProductComponent } from './client-product.component';

describe('ClientProductComponent', () => {
  let component: ClientProductComponent;
  let fixture: ComponentFixture<ClientProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
