import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCategorieComponent } from './client-categorie.component';

describe('ClientCategorieComponent', () => {
  let component: ClientCategorieComponent;
  let fixture: ComponentFixture<ClientCategorieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientCategorieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientCategorieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
