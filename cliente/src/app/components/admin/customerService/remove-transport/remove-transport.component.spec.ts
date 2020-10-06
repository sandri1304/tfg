import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveTransportComponent } from './remove-transport.component';

describe('RemoveTransportComponent', () => {
  let component: RemoveTransportComponent;
  let fixture: ComponentFixture<RemoveTransportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveTransportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveTransportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
