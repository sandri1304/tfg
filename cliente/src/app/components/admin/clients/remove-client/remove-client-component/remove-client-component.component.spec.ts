import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveClientComponentComponent } from './remove-client-component.component';

describe('RemoveClientComponentComponent', () => {
  let component: RemoveClientComponentComponent;
  let fixture: ComponentFixture<RemoveClientComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveClientComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveClientComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
